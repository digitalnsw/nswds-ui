/**
 * Resolves a cva variant prop to its default once, so the value fed to cva,
 * to the `data-*` attribute and to anything else that reads it agrees.
 *
 * cva reads an explicit `null` as "no variant" (no classes for that axis) but
 * `undefined` and `''` as "use `defaultVariants`", while `??` falls through
 * only for `null` and `undefined`. A component that wrote `data-color={color
 * ?? DEFAULT}` beside `variants({ color })` therefore advertised the default
 * with none of its classes for `null`, and `''` for `''`. `||` covers all
 * three for a string-keyed axis, where no member is falsy.
 *
 * String axes only: the generic refuses booleans, because `false || fallback`
 * would flip a boolean variant (Button's `iconOnly`, TabNav's `fill`) to its
 * truthy branch. Those axes keep their own handling.
 *
 * Not re-exported from the package barrel — an internal helper, shipped to
 * registry consumers as `lib/variants.ts` beside their own `lib/utils.ts`.
 */
export function resolveVariant<T extends string>(value: T | null | undefined, fallback: T): T {
  return value || fallback
}
