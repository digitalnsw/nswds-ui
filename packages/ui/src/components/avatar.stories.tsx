/**
 * Avatar — a small circular image of a person, with initials as a fallback.
 *
 *   Components/Avatar                → this file: Docs, Default, Playground
 *   Components/Avatar/Features       → avatar.features.stories.tsx
 *   Components/Avatar/Accessibility  → avatar.accessibility.stories.tsx
 *   Components/Avatar/Tests          → avatar.tests.stories.tsx (hidden)
 *
 * The docs page's sections are exported (and kept out of the story index by
 * `excludeStories`) so the Features stories render the same examples.
 *
 * Built on the Base UI avatar primitive. `AvatarImage` loads a real image and
 * falls back to `AvatarFallback` when the source is missing or fails. These
 * stories show the fallback, which is what renders without a network image,
 * so their assertions target it.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from './avatar.js'
import {
  DocsApi,
  DocsPage,
  DocsUsage,
  Example,
  ExampleCell,
  ExampleSection,
} from './story-helpers.js'

const sizes = ['sm', 'default', 'lg'] as const

const sizePx = { sm: '24px', default: '32px', lg: '40px' } as const

const sizeDocs: ReadonlyArray<readonly [(typeof sizes)[number], string]> = [
  ['sm', 'Dense lists and inline beside small text.'],
  ['default', 'Comments, rows and menus — most places.'],
  ['lg', 'Beside a name and a role, such as an assigned officer.'],
]

// ─── Sections ─────────────────────────────────────────────────────────────────
// Each section is one part of the docs page AND one Features story.

export function SizesSection() {
  return (
    <ExampleSection
      title='Sizes'
      description={
        <>
          <code>sm</code>, <code>default</code> and <code>lg</code> are 24, 32 and 40px circles.
          Match the size to the line of text beside the avatar.
        </>
      }
    >
      <Example code={`<Avatar size="lg">…</Avatar>`}>
        {sizes.map((size) => (
          <ExampleCell key={size} label={`${size} · ${sizePx[size]}`}>
            <Avatar size={size}>
              <AvatarFallback>JC</AvatarFallback>
            </Avatar>
          </ExampleCell>
        ))}
      </Example>
      <dl className='grid gap-x-8 gap-y-3 sm:grid-cols-3'>
        {sizeDocs.map(([name, desc]) => (
          <div key={name} className='flex gap-3 text-base'>
            <dt className='w-16 shrink-0 font-semibold'>{name}</dt>
            <dd className='text-muted-foreground'>{desc}</dd>
          </div>
        ))}
      </dl>
    </ExampleSection>
  )
}

export function ImageAndFallbackSection() {
  return (
    <ExampleSection
      title='Image and fallback'
      description={
        <>
          <code>AvatarImage</code> shows a photo once it has loaded; until then, or if it fails,{' '}
          <code>AvatarFallback</code> shows instead. Give the image an <code>alt</code> of the
          person&apos;s name, and the fallback their initials.
        </>
      }
    >
      <Example
        code={`<Avatar>
  <AvatarImage src="/people/jordan-chen.jpg" alt="Jordan Chen" />
  <AvatarFallback>JC</AvatarFallback>
</Avatar>`}
      >
        <ExampleCell label='no image — initials'>
          <Avatar size='lg'>
            <AvatarFallback>JC</AvatarFallback>
          </Avatar>
        </ExampleCell>
        <ExampleCell label='image fails — initials'>
          <Avatar size='lg'>
            {/* An empty data URL never decodes, so the fallback shows without a network request. */}
            <AvatarImage src='data:,' alt='Priya Sharma' />
            <AvatarFallback>PS</AvatarFallback>
          </Avatar>
        </ExampleCell>
      </Example>
    </ExampleSection>
  )
}

export function StatusBadgeSection() {
  return (
    <ExampleSection
      title='Status badge'
      description={
        <>
          <code>AvatarBadge</code> places a small dot on the avatar&apos;s corner, for a status such
          as &ldquo;available&rdquo;. The dot is decorative: say the status in text nearby too.
        </>
      }
    >
      <Example
        code={`<Avatar>
  <AvatarFallback>JC</AvatarFallback>
  <AvatarBadge />
</Avatar>`}
      >
        {sizes.map((size) => (
          <ExampleCell key={size} label={size}>
            <Avatar size={size}>
              <AvatarFallback>JC</AvatarFallback>
              <AvatarBadge />
            </Avatar>
          </ExampleCell>
        ))}
      </Example>
    </ExampleSection>
  )
}

export function GroupsSection() {
  return (
    <ExampleSection
      title='Groups'
      description={
        <>
          <code>AvatarGroup</code> overlaps a set of avatars, ringing each in the page colour so
          they stay distinct; <code>AvatarGroupCount</code> ends the row with how many more there
          are, and matches the size of the avatars in the group.
        </>
      }
    >
      <Example
        code={`<AvatarGroup>
  <Avatar><AvatarFallback>JC</AvatarFallback></Avatar>
  …
  <AvatarGroupCount>+5</AvatarGroupCount>
</AvatarGroup>`}
      >
        {sizes.map((size) => (
          <ExampleCell key={size} label={size}>
            <AvatarGroup>
              {['JC', 'PS', 'MN'].map((initials) => (
                <Avatar key={initials} size={size}>
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
              ))}
              <AvatarGroupCount>+5</AvatarGroupCount>
            </AvatarGroup>
          </ExampleCell>
        ))}
      </Example>
    </ExampleSection>
  )
}

export function InContextSection() {
  return (
    <ExampleSection
      title='In context'
      description='The case officer assigned to an application, with their name, role and availability beside the avatar — the avatar never carries the information alone.'
    >
      <Example
        layout='fill'
        code={`<Avatar size="lg">
  <AvatarImage src={officer.photo} alt="" />
  <AvatarFallback>PS</AvatarFallback>
  <AvatarBadge />
</Avatar>
<p>Priya Sharma</p>`}
      >
        <div className='flex items-center gap-4'>
          <Avatar size='lg'>
            <AvatarFallback>PS</AvatarFallback>
            <AvatarBadge />
          </Avatar>
          <div>
            <p className='font-semibold'>Priya Sharma</p>
            <p className='text-muted-foreground'>Case officer, Housing Assistance · Available</p>
          </div>
        </div>
      </Example>
    </ExampleSection>
  )
}

// ─── Docs page ────────────────────────────────────────────────────────────────

function AvatarDocs() {
  return (
    <DocsPage
      title='Avatar'
      npm={[
        'Avatar',
        'AvatarImage',
        'AvatarFallback',
        'AvatarBadge',
        'AvatarGroup',
        'AvatarGroupCount',
      ]}
      registry='avatar'
      summary={
        <>
          A small circular image of a person, with their initials as a fallback. It is built on the
          Base UI avatar primitive, which shows the fallback until the image has loaded.
        </>
      }
    >
      <DocsUsage
        use={[
          'Identifying the person behind an account, a comment or a case.',
          'Showing who is assigned to or working on something, as a group.',
          'A signed-in person’s menu in a header.',
        ]}
        avoid={[
          'A status or count on its own — use Badge.',
          'An organisation or brand mark — use Logo.',
          'An illustration or content image — use an image in an AspectRatio.',
        ]}
      />
      <SizesSection />
      <ImageAndFallbackSection />
      <StatusBadgeSection />
      <GroupsSection />
      <InContextSection />
      <DocsApi />
    </DocsPage>
  )
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Components/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  excludeStories: /Section$/,
  parameters: {
    layout: 'padded',
    controls: { expanded: true, sort: 'requiredFirst' },
    docs: { page: AvatarDocs },
  },
  args: {
    size: 'default',
    children: <AvatarFallback>AB</AvatarFallback>,
  },
  argTypes: {
    children: {
      control: false,
      description: 'AvatarImage and AvatarFallback, and optionally an AvatarBadge.',
      table: { category: 'Content' },
    },
    size: {
      control: 'inline-radio',
      options: sizes,
      description: 'Diameter: 24, 32 or 40px.',
      table: { category: 'Appearance' },
    },
    className: { table: { disable: true } },
  },
} satisfies Meta<typeof Avatar>

export default meta

type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const fallback = canvasElement.querySelector<HTMLElement>('[data-slot="avatar-fallback"]')
    if (!fallback) {
      throw new Error('Could not find [data-slot="avatar-fallback"].')
    }

    // With no loadable image, Base UI renders the fallback — assert the
    // initials arrived rather than testing a hidden image element.
    await expect(fallback).toHaveTextContent('AB')
  },
}

export const Playground: Story = {}
