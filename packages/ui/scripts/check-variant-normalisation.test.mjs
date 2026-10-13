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

// Each rule is tested on its own: `mismatch` (default advertised, raw prop to
// cva) and `order` (advertised attribute before a props spread).
const mismatches = (source) =>
  checkVariantSource(source).filter((failure) => failure.kind === 'mismatch')
const messages = (source) => mismatches(source).map((failure) => failure.message)
const orders = (source) => checkVariantSource(source).filter((failure) => failure.kind === 'order')

const component = (body, { cvaName = 'widgetVariants' } = {}) => `
import { cva } from 'class-variance-authority'
import { cn } from '../lib/utils.js'
import { resolveVariant } from '../lib/resolve-variant.js'
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

test('passes presence coercion spelled `x || void 0`', () => {
  const source = component(`
  return <div data-flag={color || void 0} className={widgetVariants({ color })} {...props} />
  `)
  assert.deepEqual(messages(source), [])
})

test('passes an advertised identifier handed to cva only through className', () => {
  const source = component(`
  const colorway = resolveVariant(color, DEFAULT_COLOR)
  return <div {...props} data-color={colorway} className={widgetVariants({ color: colorway, className: color })} />
  `)
  assert.deepEqual(messages(source), [])
})

test('passes the same through the class option and the className shorthand', () => {
  const source = component(`
  const colorway = resolveVariant(color, DEFAULT_COLOR)
  const className = color
  return <div {...props} data-color={colorway} className={widgetVariants({ color: colorway, class: color, className })} />
  `)
  assert.deepEqual(messages(source), [])
})

// ─── Shapes that must fail ──────────────────────────────────────────────────

test('fails the original pattern: ?? in the attribute, raw shorthand to cva', () => {
  const source = component(`
  return <div data-color={color ?? DEFAULT_COLOR} className={cn(widgetVariants({ color }), className)} {...props} />
  `)
  const failures = mismatches(source)
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
  const failures = mismatches(source)
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
  const failures = mismatches(source)
  assert.deepEqual(failures.map((f) => f.identifier).sort(), ['size', 'variant'])
  assert.ok(failures.every((f) => Number.isInteger(f.line) && f.line > 0))
})

test('fails a violation in the second component of a file, at its own line', () => {
  const source = component(`
  const colorway = resolveVariant(color, DEFAULT_COLOR)
  return <div {...props} data-color={colorway} className={widgetVariants({ color: colorway })} />
}
function Other({ color, ...props }) {
  return (
    <div
      data-color={color ?? DEFAULT_COLOR}
      className={widgetVariants({ color })}
      {...props}
    />
  )
  `)
  const failures = mismatches(source)
  assert.equal(failures.length, 1)
  const otherStart = source.split('\n').findIndex((l) => l.includes('function Other')) + 1
  assert.ok(
    failures[0].line > otherStart,
    `expected the failure inside Other, got line ${failures[0].line}`,
  )
})

test('fails a raw cva call inside a useMemo in the same component', () => {
  const source = component(`
  const classes = React.useMemo(() => widgetVariants({ color }), [color])
  return <div data-color={color ?? DEFAULT_COLOR} className={classes} {...props} />
  `)
  assert.equal(messages(source).length, 1)
})

test('fails an advertised alias used inside a .map() callback beside a raw cva call', () => {
  const source = component(`
  const look = resolveVariant(color, DEFAULT_COLOR)
  return (
    <ul className={widgetVariants({ color })} {...props}>
      {items.map((item) => <li key={item} data-color={look} />)}
    </ul>
  )
  `)
  assert.equal(messages(source).length, 1)
})

test('fails the renamed-prop idiom: { color: colorProp } raw beside its resolved alias', () => {
  const source = `
import { cva } from 'class-variance-authority'
import { resolveVariant } from '../lib/resolve-variant.js'
const heroVariants = cva('w-full', { variants: { color: { white: 'a', dark: 'b' } } })
function HeroX({ color: colorProp, ...props }) {
  const color = resolveVariant(colorProp, 'white')
  return <section data-color={color} className={heroVariants({ color: colorProp })} {...props} />
}
`
  assert.equal(messages(source).length, 1)
})

test('fails a cva function called as a member', () => {
  const source = component(`
  return <div data-color={color ?? DEFAULT_COLOR} className={styles.widgetVariants({ color })} {...props} />
  `)
  assert.equal(messages(source).length, 1)
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

test('does not catch an options object built before the call', () => {
  const source = component(`
  const options = { color }
  return <div data-color={color ?? DEFAULT_COLOR} className={widgetVariants(options)} {...props} />
  `)
  assert.deepEqual(messages(source), [])
})

test('does not catch a raw prop renamed through a local', () => {
  const source = component(`
  const raw = color
  return <div data-color={color ?? DEFAULT_COLOR} className={widgetVariants({ color: raw })} {...props} />
  `)
  assert.deepEqual(messages(source), [])
})

test('does not catch a positional cva wrapper', () => {
  const source = component(`
  return <div data-color={color ?? DEFAULT_COLOR} className={labelColorVariants(color, 'soft')} {...props} />
  `)
  assert.deepEqual(messages(source), [])
})

// ─── Attribute order ─────────────────────────────────────────────────────────

test('order: fails an advertised attribute written before a props spread', () => {
  const source = component(`
  const colorway = resolveVariant(color, DEFAULT_COLOR)
  return <div data-color={colorway} {...props} className={widgetVariants({ color: colorway })} />
  `)
  const failures = orders(source)
  assert.equal(failures.length, 1)
  assert.equal(failures[0].attribute, 'data-color')
  assert.match(failures[0].message, /after the spread/)
})

test('order: passes an advertised attribute written after the spread', () => {
  const source = component(`
  const colorway = resolveVariant(color, DEFAULT_COLOR)
  return <div {...props} data-color={colorway} className={widgetVariants({ color: colorway })} />
  `)
  assert.deepEqual(orders(source), [])
})

test('order: passes state and mirrored attributes before the spread', () => {
  const source = component(`
  return (
    <div
      data-scrolled={isScrolled || undefined}
      data-color={color}
      {...props}
      className={widgetVariants({ color })}
    />
  )
  `)
  assert.deepEqual(orders(source), [])
})

test('order: a spread on a different element does not count', () => {
  const source = component(`
  const colorway = resolveVariant(color, DEFAULT_COLOR)
  return (
    <div data-color={colorway} className={widgetVariants({ color: colorway })}>
      <span {...props} />
    </div>
  )
  `)
  assert.deepEqual(orders(source), [])
})
