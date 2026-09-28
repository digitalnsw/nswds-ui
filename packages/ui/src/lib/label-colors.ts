import type { VariantProps } from 'class-variance-authority'

import { buttonColorVariants } from '../components/button.js'

export type LabelColor = NonNullable<VariantProps<typeof buttonColorVariants>['color']>

export function labelColorVariants(
  color: LabelColor | 'light' | null = 'primary',
  variant: 'solid' | 'soft' | 'surface' | 'outline' | null = 'soft',
) {
  return buttonColorVariants({ color: color === 'light' ? 'white' : color, variant })
}
