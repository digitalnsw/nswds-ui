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
 * same pair was hand-fixed in nine components across two pull requests
 * (Hero, Masthead, Header, Footer, MainNav, Select, NativeSelect,
 * DescriptionList, PageHeader) before this held it. The fix is always the same:
 * resolve the value once with `resolveVariant` from `lib/utils` and feed that
 * one value to cva, the attribute, and anything else that reads it.
 *
 * THE RULE, per source file under `src/components` and `src/patterns`
 * (stories excluded):
 *
 *   1. A `data-*` JSX attribute whose value is `<ident> ?? <fallback>` or
 *      `<ident> || <fallback>`, where the fallback is a value rather than
 *      `undefined`/`null`, is a normalised attribute of `<ident>`: it
 *      advertises a default. (`<ident> || undefined` is presence coercion —
 *      Button's `data-icon-only` — and advertises nothing.)
 *   2. A call to a function whose name ends in `Variants` is a cva call; any
 *      object-literal argument property whose value is the bare identifier
 *      `<ident>` (shorthand `{ color }` or `{ color: color }`) passes `<ident>`
 *      raw.
 *   3. If the same `<ident>` appears in both, the file fails.
 *
 * A `data-size={size}` beside `variants({ size })` is NOT flagged: the
 * attribute mirrors the raw prop, so for `null` both are absent together.
 *
 * WHY IT PARSES. The two halves are often many lines apart and Prettier is
 * free to reflow them, so this reads the TypeScript syntax tree rather than
 * matching text.
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

  /** identifier name -> { attribute, node } for normalised data-* attributes. */
  const normalised = new Map()
  /** identifier name -> call name, for raw props passed to a *Variants call. */
  const raw = new Map()

  const isAbsence = (node) =>
    node.kind === ts.SyntaxKind.NullKeyword ||
    (ts.isIdentifier(node) && node.text === 'undefined') ||
    (ts.isVoidExpression(node) && ts.isNumericLiteral(node.expression))

  const isNormaliser = (node) =>
    ts.isBinaryExpression(node) &&
    (node.operatorToken.kind === ts.SyntaxKind.QuestionQuestionToken ||
      node.operatorToken.kind === ts.SyntaxKind.BarBarToken) &&
    ts.isIdentifier(node.left) &&
    !isAbsence(node.right)

  const visit = (node) => {
    if (ts.isJsxAttribute(node)) {
      const name = node.name.getText(sourceFile)
      if (
        name.startsWith('data-') &&
        node.initializer &&
        ts.isJsxExpression(node.initializer) &&
        node.initializer.expression
      ) {
        let expression = node.initializer.expression
        while (ts.isParenthesizedExpression(expression)) expression = expression.expression
        if (isNormaliser(expression)) {
          normalised.set(expression.left.text, { attribute: name, node })
        }
      }
    }

    if (ts.isCallExpression(node)) {
      const callee = node.expression
      const calleeName = ts.isIdentifier(callee)
        ? callee.text
        : ts.isPropertyAccessExpression(callee)
          ? callee.name.text
          : null
      if (calleeName && calleeName.endsWith('Variants')) {
        for (const argument of node.arguments) {
          if (!ts.isObjectLiteralExpression(argument)) continue
          for (const property of argument.properties) {
            if (ts.isShorthandPropertyAssignment(property)) {
              raw.set(property.name.text, calleeName)
            } else if (
              ts.isPropertyAssignment(property) &&
              ts.isIdentifier(property.initializer) &&
              ts.isIdentifier(property.name) &&
              property.name.text === property.initializer.text
            ) {
              raw.set(property.name.text, calleeName)
            }
          }
        }
      }
    }

    ts.forEachChild(node, visit)
  }
  visit(sourceFile)

  const failures = []
  for (const [identifier, { attribute, node }] of normalised) {
    const call = raw.get(identifier)
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
  return failures
}

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url))
const SRC = join(SCRIPT_DIR, '..', 'src')
const ROOTS = ['components', 'patterns']

function* sourceFiles(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      yield* sourceFiles(full)
    } else if (entry.name.endsWith('.tsx') && !entry.name.includes('.stories.')) {
      yield full
    }
  }
}

function main() {
  const failures = []
  let checked = 0
  for (const root of ROOTS) {
    for (const file of sourceFiles(join(SRC, root))) {
      const relName = relative(SRC, file)
      for (const failure of checkVariantSource(readFileSync(file, 'utf8'), relName)) {
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
