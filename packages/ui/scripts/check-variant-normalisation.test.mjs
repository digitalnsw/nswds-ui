/**
 * Tests for the variant-normalisation gate.
 *
 * The gate guards a disagreement nothing else in CI can see — an element whose
 * `data-*` attribute advertises a default while cva painted no classes — so a
 * mistake in it is invisible until the next component repeats the pattern. A
 * gate that stops gating exits 0, which reads exactly like success, so the
 * passing shapes matter as much as the failing ones.
 *
 * Run: npm run test:scripts
 */

import assert from 'node:assert/strict'
import test from 'node:test'

import { checkVariantSource } from './check-variant-normalisation.mjs'

const messages = (source) => checkVariantSource(source).map((failure) => failure.message)

const component = (body) => `
import { cva } from 'class-variance-authority'
import { cn, resolveVariant } from '../lib/utils.js'
const DEFAULT_COLOR = 'white'
const widgetVariants = cva('w-full', {
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
  return <div data-color={colorway} className={cn(widgetVariants({ color: colorway }), className)} {...props} />
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

test('passes a cva call that receives a different identifier than the attribute names', () => {
  const source = component(`
  const colorway = color ?? DEFAULT_COLOR
  return <div data-color={color ?? DEFAULT_COLOR} className={widgetVariants({ color: colorway })} {...props} />
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
