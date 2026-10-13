#!/usr/bin/env node
/**
 * Fails when a component advertises a variant's default in a `data-*`
 * attribute while handing cva the raw prop.
 *
 * WHY THIS IS A GATE. class-variance-authority reads an explicit `null` as
 * "no variant" (no classes for that axis) where `undefined` takes
 * `defaultVariants`, and `??` falls through for both. So
 *
 *   data-color={color ?? DEFAULT}      // advertises the default
 *   className={variants({ color })}    // paints nothing for null
 *
 * renders an element whose attribute and classes disagree, silently: it lints,
 * typechecks, builds, and every story that passes a member value is green. The
 * same pair was hand-fixed in eleven components across two pull requests
 * before this held it. The fix is always the same: resolve the value once with
 * `resolveVariant` from `lib/variants` and feed that one value to cva, the
 * attribute, and anything else that reads it.
 *
 * THE RULE, per component (function-like scope) in every source file under
 * `src/components` and `src/patterns` (stories excluded):
 *
 *   1. An identifier `<ident>` is NORMALISED by an expression that supplies a
 *      real fallback: `<ident> ?? <fallback>`, `<ident> || <fallback>`,
 *      `<ident> ? <ident> : <fallback>` or `resolveVariant(<ident>, …)`,
 *      where the fallback is not `undefined`/`null`. A `const <alias> =
 *      <that expression>` makes `<alias>` carry the normalised value.
 *   2. A `data-*` JSX attribute whose value is such an expression, or such an
 *      alias, ADVERTISES `<ident>`'s default.
 *   3. A call to a cva function — one declared in the file as `const x =
 *      cva(…)`, or named `*Variants` / `*Cva` — whose object-literal argument
 *      passes the bare `<ident>` (shorthand `{ color }` or `{ color: color }`)
 *      hands it to cva RAW.
 *   4. If `<ident>` is advertised (2) and raw (3) inside the same component,
 *      the file fails.
 *
 * Not flagged: `data-size={size}` beside `variants({ size })` (the attribute
 * mirrors the prop, so for `null` both are absent together) and presence
 * coercion such as `data-icon-only={iconOnly || undefined}`.
 *
 * Known to slip (recorded as fixtures): a fallback applied through another
 * helper, a member access (`props.color ?? D`), a template literal, or an
 * attribute arriving through a spread object. Extend the rule when one of
 * those shapes appears in a component.
 *
 * WHY IT PARSES. The halves are often many lines apart and Prettier is free to
 * reflow them, so this reads the TypeScript syntax tree rather than matching
 * text.
 *
 * `checkVariantSource` is the whole per-file rule, exported for the fixture
 * tests in check-variant-normalisation.test.mjs (run by `npm run
 * test:scripts`), because a gate that stops gating exits 0, which reads exactly
 * like success.
 */

import { readdirSync, readFileSync, realpathSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

import ts from 'typescript'

const isAbsence = (node) =>
  node.kind === ts.SyntaxKind.NullKeyword || (ts.isIdentifier(node) && node.text === 'undefined')

/**
 * The identifier an expression normalises, or `null` when it does not supply a
 * real fallback for one: `x ?? D`, `x || D`, `x ? x : D`, `resolveVariant(x, D)`.
 */
function normalisedIdentifier(expression) {
  let node = expression
  while (ts.isParenthesizedExpression(node)) node = node.expression
  if (
    ts.isBinaryExpression(node) &&
    (node.operatorToken.kind === ts.SyntaxKind.QuestionQuestionToken ||
      node.operatorToken.kind === ts.SyntaxKind.BarBarToken) &&
    ts.isIdentifier(node.left) &&
    !isAbsence(node.right)
  ) {
    return node.left.text
  }
  if (
    ts.isConditionalExpression(node) &&
    ts.isIdentifier(node.condition) &&
    ts.isIdentifier(node.whenTrue) &&
    node.whenTrue.text === node.condition.text &&
    !isAbsence(node.whenFalse)
  ) {
    return node.condition.text
  }
  if (
    ts.isCallExpression(node) &&
    ts.isIdentifier(node.expression) &&
    node.expression.text === 'resolveVariant' &&
    node.arguments.length >= 1 &&
    ts.isIdentifier(node.arguments[0])
  ) {
    return node.arguments[0].text
  }
  return null
}

const isFunctionLike = (node) =>
  ts.isFunctionDeclaration(node) ||
  ts.isFunctionExpression(node) ||
  ts.isArrowFunction(node) ||
  ts.isMethodDeclaration(node)

/** The nearest enclosing function-like node — one component — or the file. */
function scopeOf(node, sourceFile) {
  let current = node.parent
  while (current && !isFunctionLike(current)) current = current.parent
  return current ?? sourceFile
}

/**
 * Checks one source file. Returns one failure per offending identifier:
 * `{ line, identifier, attribute, call, message }`.
 */
export function checkVariantSource(source, fileName = 'component.tsx') {
  const sourceFile = ts.createSourceFile(
    fileName,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  )

  /** Names of cva functions declared in this file (`const x = cva(…)`). */
  const cvaFunctions = new Set()
  const isCvaCallee = (name) =>
    cvaFunctions.has(name) || name.endsWith('Variants') || name.endsWith('Cva')

  /** scope -> Map(identifier -> { attribute, node }) */
  const advertised = new Map()
  /** scope -> Map(identifier -> callName) */
  const raw = new Map()
  /** scope -> Map(alias -> identifier) */
  const aliases = new Map()
  const bucket = (store, scope) => {
    if (!store.has(scope)) store.set(scope, new Map())
    return store.get(scope)
  }

  // Pass 1: cva declarations and aliases, which may precede or follow their uses.
  const collect = (node) => {
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.initializer) {
      const init = node.initializer
      if (
        ts.isCallExpression(init) &&
        ts.isIdentifier(init.expression) &&
        init.expression.text === 'cva'
      ) {
        cvaFunctions.add(node.name.text)
      }
      const target = normalisedIdentifier(init)
      if (target) bucket(aliases, scopeOf(node, sourceFile)).set(node.name.text, target)
    }
    ts.forEachChild(node, collect)
  }
  collect(sourceFile)

  // Pass 2: advertised attributes and raw cva arguments.
  const visit = (node) => {
    if (ts.isJsxAttribute(node)) {
      const name = node.name.getText(sourceFile)
      if (
        name.startsWith('data-') &&
        node.initializer &&
        ts.isJsxExpression(node.initializer) &&
        node.initializer.expression
      ) {
        const scope = scopeOf(node, sourceFile)
        let expression = node.initializer.expression
        while (ts.isParenthesizedExpression(expression)) expression = expression.expression
        let target = normalisedIdentifier(expression)
        if (!target && ts.isIdentifier(expression)) {
          target = bucket(aliases, scope).get(expression.text) ?? null
        }
        if (target) bucket(advertised, scope).set(target, { attribute: name, node })
      }
    }

    if (ts.isCallExpression(node) && ts.isIdentifier(node.expression)) {
      const calleeName = node.expression.text
      if (isCvaCallee(calleeName)) {
        const scope = scopeOf(node, sourceFile)
        for (const argument of node.arguments) {
          if (!ts.isObjectLiteralExpression(argument)) continue
          for (const property of argument.properties) {
            if (ts.isShorthandPropertyAssignment(property)) {
              bucket(raw, scope).set(property.name.text, calleeName)
            } else if (
              ts.isPropertyAssignment(property) &&
              ts.isIdentifier(property.initializer) &&
              ts.isIdentifier(property.name) &&
              property.name.text === property.initializer.text
            ) {
              bucket(raw, scope).set(property.name.text, calleeName)
            }
          }
        }
      }
    }

    ts.forEachChild(node, visit)
  }
  visit(sourceFile)

  const failures = []
  for (const [scope, attributes] of advertised) {
    const rawInScope = raw.get(scope)
    if (!rawInScope) continue
    for (const [identifier, { attribute, node }] of attributes) {
      const call = rawInScope.get(identifier)
      if (!call) continue
      const { line } = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile))
      failures.push({
        line: line + 1,
        identifier,
        attribute,
        call,
        message:
          `\`${attribute}\` advertises a default for \`${identifier}\` while \`${call}()\` receives it raw — ` +
          `cva paints no classes for null. Resolve it once (\`const ${identifier}way = resolveVariant(${identifier}, DEFAULT)\`) ` +
          'and pass that to both.',
      })
    }
  }
  return failures
}

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url))
const SRC = join(SCRIPT_DIR, '..', 'src')
const ROOTS = ['components', 'patterns']

function main() {
  const failures = []
  let checked = 0
  for (const root of ROOTS) {
    const dir = join(SRC, root)
    for (const name of readdirSync(dir)) {
      if (!name.endsWith('.tsx') || name.includes('.stories.')) continue
      const relName = relative(SRC, join(dir, name))
      for (const failure of checkVariantSource(readFileSync(join(dir, name), 'utf8'), relName)) {
        failures.push(`src/${relName}:${failure.line}: ${failure.message}`)
      }
      checked++
    }
  }

  if (failures.length > 0) {
    console.error(`✖ Variant normalisation check failed (${failures.length}):\n`)
    for (const failure of failures) console.error(`  ${failure}`)
    console.error('\nSee the header of scripts/check-variant-normalisation.mjs for the rule.')
    process.exit(1)
  }

  if (checked === 0) {
    console.error(
      '✖ Variant normalisation check found no source files — the detection is broken, not the code.',
    )
    process.exit(1)
  }

  console.log(
    `✔ Variant normalisation: ${checked} source files resolve each variant once before cva and data-*.`,
  )
}

// Run only when invoked directly, so the tests can import `checkVariantSource`.
function invokedDirectly() {
  if (!process.argv[1]) return false
  try {
    return realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url))
  } catch {
    return false
  }
}

if (invokedDirectly()) main()
