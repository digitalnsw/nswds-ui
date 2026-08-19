import { IconAccessibility } from '@nswds/ui/icons/accessibility'
import { IconAdd } from '@nswds/ui/icons/add'
import { IconArrowForward } from '@nswds/ui/icons/arrow-forward'
import { IconCall } from '@nswds/ui/icons/call'
import { IconCheck } from '@nswds/ui/icons/check'
import { IconCheckCircle } from '@nswds/ui/icons/check-circle'
import { IconChevronRight } from '@nswds/ui/icons/chevron-right'
import { IconClose } from '@nswds/ui/icons/close'
import { IconCode } from '@nswds/ui/icons/code'
import { IconColors } from '@nswds/ui/icons/colors'
import { IconDarkMode } from '@nswds/ui/icons/dark-mode'
import { IconEast } from '@nswds/ui/icons/east'
import { IconError } from '@nswds/ui/icons/error'
import { IconExpandMore } from '@nswds/ui/icons/expand-more'
import { IconInfo } from '@nswds/ui/icons/info'
import { IconKey } from '@nswds/ui/icons/key'
import { IconKeyboardArrowDown } from '@nswds/ui/icons/keyboard-arrow-down'
import { IconLightMode } from '@nswds/ui/icons/light-mode'
import { IconLocationOn } from '@nswds/ui/icons/location-on'
import { IconLogin } from '@nswds/ui/icons/login'
import { IconMail } from '@nswds/ui/icons/mail'
import { IconMenu } from '@nswds/ui/icons/menu'
import { IconMoreHoriz } from '@nswds/ui/icons/more-horiz'
import { IconOpenInNew } from '@nswds/ui/icons/open-in-new'
import { IconPackage } from '@nswds/ui/icons/package'
import { IconPalette } from '@nswds/ui/icons/palette'
import { IconPersonAdd } from '@nswds/ui/icons/person-add'
import { IconRemove } from '@nswds/ui/icons/remove'
import { IconSearch } from '@nswds/ui/icons/search'
import { IconShapes } from '@nswds/ui/icons/shapes'
import { IconWarning } from '@nswds/ui/icons/warning'
import { IconWest } from '@nswds/ui/icons/west'
import { IconWidgets } from '@nswds/ui/icons/widgets'
import type { Metadata } from 'next'

import { CodeBlock } from '@/components/code-block'

export const metadata: Metadata = {
  title: 'Icons',
  description:
    'The full Material Symbols set — 3,900+ icons as individually importable, tree-shakeable React components.',
}

/** The curated subset the registry ships (mirrors the `icons` registry item). */
const curatedIcons = [
  ['accessibility', IconAccessibility],
  ['add', IconAdd],
  ['arrow-forward', IconArrowForward],
  ['call', IconCall],
  ['check', IconCheck],
  ['check-circle', IconCheckCircle],
  ['chevron-right', IconChevronRight],
  ['close', IconClose],
  ['code', IconCode],
  ['colors', IconColors],
  ['dark-mode', IconDarkMode],
  ['east', IconEast],
  ['error', IconError],
  ['expand-more', IconExpandMore],
  ['info', IconInfo],
  ['key', IconKey],
  ['keyboard-arrow-down', IconKeyboardArrowDown],
  ['light-mode', IconLightMode],
  ['location-on', IconLocationOn],
  ['login', IconLogin],
  ['mail', IconMail],
  ['menu', IconMenu],
  ['more-horiz', IconMoreHoriz],
  ['open-in-new', IconOpenInNew],
  ['package', IconPackage],
  ['palette', IconPalette],
  ['person-add', IconPersonAdd],
  ['remove', IconRemove],
  ['search', IconSearch],
  ['shapes', IconShapes],
  ['warning', IconWarning],
  ['west', IconWest],
  ['widgets', IconWidgets],
] as const

export default function IconsPage() {
  return (
    <div className='py-10'>
      <p className='text-sm font-bold tracking-wide text-accent-600 uppercase dark:text-accent-200'>
        Foundations
      </p>
      <h1 className='mt-2 text-4xl font-bold sm:text-5xl'>Icons</h1>
      <p className='mt-4 max-w-2xl text-base/7 text-muted-foreground'>
        The design system ships the full Google Material Symbols set — 3,900+ icons — as
        individually importable React components. Icons carry no client-side JavaScript, size
        themselves from the surrounding component, and paint with{' '}
        <code className='font-mono text-sm'>currentColor</code>.
      </p>

      <section className='mt-10'>
        <h2 className='text-2xl font-bold'>Usage</h2>
        <p className='mt-2 max-w-2xl text-base/7 text-muted-foreground'>
          Always import per icon, never through a barrel — that keeps the 3,900-module set fully
          tree-shakeable.
        </p>
        <CodeBlock
          className='mt-4 max-w-2xl'
          label='app.tsx'
          code={`import { IconSearch } from '@nswds/ui/icons/search'\n\n<Button leadingVisual={<IconSearch />}>Search</Button>`}
        />
      </section>

      <section className='mt-12'>
        <h2 className='text-2xl font-bold'>The curated registry subset</h2>
        <p className='mt-2 max-w-2xl text-base/7 text-muted-foreground'>
          Registry consumers get these {curatedIcons.length} icons — the set the shipped components
          and patterns use — via{' '}
          <code className='font-mono text-sm'>npx shadcn add …/r/icons.json</code>.
        </p>
        <ul className='mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-6'>
          {curatedIcons.map(([name, Icon]) => (
            <li
              key={name}
              className='flex flex-col items-center gap-2 rounded-md bg-muted px-3 py-5 ring-1 ring-foreground/5'
            >
              <Icon aria-hidden='true' className='size-7 text-foreground' />
              <span className='font-mono text-xs text-muted-foreground'>{name}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
