/**
 * Tests for the variant-normalisation gate.
 *
 * The gate guards a disagreement nothing else in CI can see — an element whose
 * `data-*` attribute advertises a default while cva painted no classes — so a
 * mistake in it is invisible until the next component repeats the pattern. A
 * gate that stops gating exits 0, which reads exactly like success, so the
 * passing shapes matter as much as the failing ones, and the shapes it is
 * known not to catch are recorded here so a rule change can tell a deliberate
 * limitation from a regression.
 *
 * Run: npm run test:scripts
 */

import assert from 'node:assert/strict'
import test from 'node:test'

import { checkVariantSource } from './check-variant-normalisation.mjs'

const messages = (source) => checkVariantSource(source).map((failure) => failure.message)

const component = (body, { cvaName = 'widgetVariants' } = {}) => `
import { cva } from 'class-variance-authority'
import { cn } from '../lib/utils.js'
import { resolveVariant } from '../lib/variants.js'
const DEFAULT_COLOR = 'white'
const ${cvaName} = cva('w-full', {
  variants: { color: { white: 'bg-white', dark: 'bg-dark' } },
  defaultVariants: { color: DEFAULT_COLOR },
})
function Widget({ className, color, ...props }) {
  ${body}
}
`

// ─── Shapes that must pass ──────────────────────────────────────────────────

test('passes a variant resolved once and fed to both', () => {
  const source = component(`
  const colorway = resolveVariant(color, DEFAULT_COLOR)
  return <div {...props} data-color={colorway} className={cn(widgetVariants({ color: colorway }), className)} />
  `)
  assert.deepEqual(messages(source), [])
})

test('passes a mirrored attribute, where null leaves both absent', () => {
  const source = component(`
  return <div data-color={color} className={cn(widgetVariants({ color }), className)} {...props} />
  `)
  assert.deepEqual(messages(source), [])
})

test('passes a normalised attribute whose identifier never reaches cva', () => {
  const source = component(`
  return <div data-tone={color ?? 'calm'} className={cn('x', className)} {...props} />
  `)
  assert.deepEqual(messages(source), [])
})

test('passes presence coercion: `x || undefined` advertises no default', () => {
  const source = component(`
  return <div data-icon-only={color || undefined} data-band={color ?? null} className={widgetVariants({ color })} {...props} />
  `)
  assert.deepEqual(messages(source), [])
})

test('passes two components in one file that each use a legal shape', () => {
  const source = component(`
  const colorway = color ?? DEFAULT_COLOR
  return <div data-color={colorway} className={widgetVariants({ color: colorway })} {...props} />
}
function Other({ color, ...props }) {
  return <div data-color={color} className={widgetVariants({ color })} {...props} />
  `)
  assert.deepEqual(messages(source), [])
})

// ─── Shapes that must fail ──────────────────────────────────────────────────

test('fails the original pattern: ?? in the attribute, raw shorthand to cva', () => {
  const source = component(`
  return <div data-color={color ?? DEFAULT_COLOR} className={cn(widgetVariants({ color }), className)} {...props} />
  `)
  const failures = checkVariantSource(source)
  assert.equal(failures.length, 1)
  assert.equal(failures[0].identifier, 'color')
  assert.equal(failures[0].attribute, 'data-color')
  assert.equal(failures[0].call, 'widgetVariants')
  assert.match(failures[0].message, /resolveVariant\(color, DEFAULT\)/)
})

test('fails the same pattern spelled with || and an explicit property', () => {
  const source = component(`
  return <div data-color={color || DEFAULT_COLOR} className={widgetVariants({ color: color })} {...props} />
  `)
  assert.equal(messages(source).length, 1)
})

test('fails the ternary spelling', () => {
  const source = component(`
  return <div data-color={color ? color : DEFAULT_COLOR} className={widgetVariants({ color })} {...props} />
  `)
  assert.equal(messages(source).length, 1)
})

test('fails the aliased spelling: const look = color ?? D, data-color={look}, raw to cva', () => {
  const source = component(`
  const look = color ?? DEFAULT_COLOR
  return <div data-color={look} className={widgetVariants({ color })} {...props} />
  `)
  assert.equal(messages(source).length, 1)
})

test('fails the half-applied new idiom: resolveVariant alias on the attribute, raw to cva', () => {
  const source = component(`
  const colorway = resolveVariant(color, DEFAULT_COLOR)
  return (
    <div {...props} data-color={colorway} className={cn(heroVariants({ color: colorway }), className)}>
      <div className={heroInnerVariants({ color })} />
    </div>
  )
  `)
  const failures = checkVariantSource(source)
  assert.equal(failures.length, 1)
  assert.equal(failures[0].call, 'heroInnerVariants')
})

test('fails a cva function named *Cva', () => {
  const source = component(
    `
  return <div data-color={color ?? DEFAULT_COLOR} className={widgetCva({ color })} {...props} />
  `,
    { cvaName: 'widgetCva' },
  )
  assert.equal(messages(source).length, 1)
})

test('fails a cva function declared in the file under any name', () => {
  const source = component(
    `
  return <div data-color={color ?? DEFAULT_COLOR} className={paint({ color })} {...props} />
  `,
    { cvaName: 'paint' },
  )
  assert.equal(messages(source).length, 1)
})

test('fails when the attribute and the cva call are far apart and parenthesised', () => {
  const source = component(`
  const classes = cn(
    widgetVariants({
      color,
    }),
    className,
  )
  return (
    <div
      data-slot='widget'
      data-color={(color ?? DEFAULT_COLOR)}
      {...props}
      className={classes}
    />
  )
  `)
  assert.equal(messages(source).length, 1)
})

test('reports each offending identifier once with its line', () => {
  const source = component(`
  return (
    <div
      data-size={size ?? 'default'}
      data-variant={variant ?? 'default'}
      className={widgetVariants({ variant, size })}
      {...props}
    />
  )
  `)
  const failures = checkVariantSource(source)
  assert.deepEqual(failures.map((f) => f.identifier).sort(), ['size', 'variant'])
  assert.ok(failures.every((f) => Number.isInteger(f.line) && f.line > 0))
})

// ─── Shapes known to slip — accepted limitations, recorded ───────────────────

test('does not catch a fallback applied through another helper', () => {
  const source = component(`
  return <div data-color={withDefault(color)} className={widgetVariants({ color })} {...props} />
  `)
  assert.deepEqual(messages(source), [])
})

test('does not catch a member-access operand', () => {
  const source = component(`
  return <div data-color={props.color ?? DEFAULT_COLOR} className={widgetVariants({ color: props.color })} />
  `)
  assert.deepEqual(messages(source), [])
})

test('does not catch a template literal or an attribute supplied by a spread object', () => {
  const source = component(`
  const attrs = { 'data-color': color ?? DEFAULT_COLOR }
  return <div data-tone={\`\${color ?? DEFAULT_COLOR}\`} {...attrs} className={widgetVariants({ color })} {...props} />
  `)
  assert.deepEqual(messages(source), [])
})
