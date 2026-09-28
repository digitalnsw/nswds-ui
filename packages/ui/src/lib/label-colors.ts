import type { VariantProps } from 'class-variance-authority'

import { buttonColorVariants } from '../components/button.js'

export type LabelColor = NonNullable<VariantProps<typeof buttonColorVariants>['color']>

export function labelColorVariants(
  color: LabelColor | 'light' | null = 'primary',
  variant: 'solid' | 'soft' | 'surface' | 'outline' | null = 'soft',
) {
  // Keep the light solid fill, but use neutral ink for labels on the page surface.
  const resolvedColor = color === 'light' ? (variant === 'solid' ? 'white' : 'grey') : color
  return buttonColorVariants({ color: resolvedColor, variant })
}
