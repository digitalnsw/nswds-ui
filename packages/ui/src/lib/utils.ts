import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Resolves a cva variant prop to its default once, so the value fed to cva,
 * to the `data-*` attribute and to anything else that reads it agrees.
 *
 * cva reads an explicit `null` as "no variant" (no classes for that axis) but
 * `undefined` and `''` as "use `defaultVariants`", while `??` falls through
 * only for `null` and `undefined`. A component that wrote `data-color={color
 * ?? DEFAULT}` beside `variants({ color })` therefore advertised the default
 * with none of its classes for `null`, and `''` for `''`. `||` covers all
 * three, and every variant key here is a non-empty string, so a falsy value
 * is never a member.
 */
export function resolveVariant<T extends string>(value: T | null | undefined, fallback: T): T {
  return value || fallback
}
