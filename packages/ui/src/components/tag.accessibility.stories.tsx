/**
 * Tag — Accessibility
 *
 * One story per WCAG 2.2 criterion the Tag family has to meet, each asserting
 * it in play(). Tag itself is a static span; TagLink, TagButton, TagCheckbox
 * and TagRemovable's remove button are the interactive members, built on Link
 * and the Base UI button and checkbox — these pin what a consumer relies on.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, fn, userEvent, within } from 'storybook/test'

import { cn } from '../lib/utils.js'
import { compositeOver, expectContrast, resolveColor, wcagStoryMeta } from './story-helpers.js'
import { Tag, TagButton, TagCheckbox, TagLink, TagRemovable } from './tag.js'

const meta = {
  title: 'Components/Tag/Accessibility',
  component: Tag,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Tag>

export default meta

type Story = StoryObj<typeof meta>

const variants = ['solid', 'soft', 'surface', 'outline'] as const
const pageColors = [
  'primary',
  'tertiary',
  'accent',
  'grey',
  'success',
  'warning',
  'danger',
] as const
const onDarkColors = ['white', 'secondary'] as const

/**
 * The opaque colour an element is painted on: its own background composited
 * over each ancestor's until an opaque one is reached. Soft and surface tags
 * are translucent tints, so their real backdrop is the tint over the panel.
 */
function paintedBackground(element: Element): string {
  const layers: string[] = []
  for (let node: Element | null = element; node; node = node.parentElement) {
    const background = getComputedStyle(node).backgroundColor
    layers.push(background)
    if (resolveColor(background).a === 1) {
      const [base, ...tints] = layers.reverse()
      let painted = resolveColor(base!)
      for (const tint of tints) painted = { ...compositeOver(resolveColor(tint), painted), a: 1 }
      return `rgb(${painted.r} ${painted.g} ${painted.b})`
    }
  }
  throw new Error('No opaque background behind the element.')
}

/** Every interactive member of the family, once each. */
function InteractiveSet({ onAction }: { onAction?: () => void }) {
  const [expanded, setExpanded] = useState(false)
  const [removed, setRemoved] = useState(false)
  return (
    <div className='flex flex-wrap items-center gap-3'>
      <Tag>Environment</Tag>
      <TagLink href='#grants'>Grants</TagLink>
      <TagCheckbox name='topic' value='regional'>
        Regional NSW
      </TagCheckbox>
      <TagButton
        aria-expanded={expanded}
        onClick={() => {
          setExpanded((value) => !value)
          onAction?.()
        }}
      >
        More topics
      </TagButton>
      {removed ? null : (
        <TagRemovable removeLabel='Remove Education filter' onRemove={() => setRemoved(true)}>
          Education
        </TagRemovable>
      )}
    </div>
  )
}

// ─── 4.1.2 — Name, Role, Value ────────────────────────────────────────────────

export const NameRoleValue: Story = {
  name: 'Name, Role, Value — 4.1.2',
  parameters: {
    wcag: ['4.1.2'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '4.1.2',
          why: 'Each tag looks alike but does something different — labels, navigates, selects, acts or removes — so assistive technology has to be told which, and what state a selectable tag is in.',
          how: 'One of each member, plus a checked, a mixed and a disabled TagCheckbox. The play() reads each role and name, the checked, mixed and disabled states, and that the static Tag exposes no role at all.',
          caveat:
            'TagRemovable’s label is plain text; only its remove button is a control, named by removeLabel. A vague removeLabel such as “Remove” passes this check but fails readers — name the filter.',
        }),
      },
    },
  },
  render: () => (
    <div className='space-y-4'>
      <InteractiveSet />
      <div className='flex flex-wrap items-center gap-3'>
        <TagCheckbox defaultChecked>Education</TagCheckbox>
        <TagCheckbox indeterminate>All regions</TagCheckbox>
        <TagCheckbox disabled>Archived</TagCheckbox>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByRole('link', { name: 'Grants' })).toHaveAttribute('href', '#grants')
    await expect(canvas.getByRole('button', { name: 'More topics' })).toHaveAttribute(
      'aria-expanded',
      'false',
    )
    await expect(canvas.getByRole('button', { name: 'Remove Education filter' })).toBeVisible()

    await expect(canvas.getByRole('checkbox', { name: 'Regional NSW' })).not.toBeChecked()
    await expect(canvas.getByRole('checkbox', { name: 'Education' })).toBeChecked()
    await expect(canvas.getByRole('checkbox', { name: 'All regions' })).toBePartiallyChecked()
    await expect(canvas.getByRole('checkbox', { name: 'Archived' })).toHaveAttribute(
      'aria-disabled',
      'true',
    )

    // The static Tag is text, not a control.
    const tag = canvasElement.querySelector('[data-slot="tag"]')!
    await expect(tag).not.toHaveAttribute('role')
    await expect(tag).not.toHaveAttribute('tabindex')
  },
}

// ─── 2.1.1 — Keyboard ─────────────────────────────────────────────────────────

const acted = fn()

export const Keyboard: Story = {
  name: 'Keyboard — 2.1.1',
  parameters: {
    wcag: ['2.1.1'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '2.1.1',
          why: 'Filters and topic links are often the main way through a listing; a keyboard reader has to reach and operate every one of them.',
          how: 'Tab through the set: the static Tag is skipped, then the link, the checkbox, the button and the remove button take focus in order. Space toggles the checkbox, Enter runs the button, and Enter on the remove button removes the filter. The play() drives all of it with the keyboard.',
          caveat:
            'After a TagRemovable disappears its button goes with it, so the consumer must move focus somewhere useful in onRemove — the Removable filters example moves it to Reset filters.',
        }),
      },
    },
  },
  render: () => <InteractiveSet onAction={acted} />,
  play: async ({ canvasElement }) => {
    acted.mockClear()
    const canvas = within(canvasElement)

    await userEvent.tab()
    await expect(canvas.getByRole('link', { name: 'Grants' })).toHaveFocus()

    await userEvent.tab()
    const checkbox = canvas.getByRole('checkbox', { name: 'Regional NSW' })
    await expect(checkbox).toHaveFocus()
    await userEvent.keyboard(' ')
    await expect(checkbox).toBeChecked()

    await userEvent.tab()
    const more = canvas.getByRole('button', { name: 'More topics' })
    await expect(more).toHaveFocus()
    await userEvent.keyboard('{Enter}')
    await expect(acted).toHaveBeenCalledTimes(1)
    await expect(more).toHaveAttribute('aria-expanded', 'true')

    await userEvent.tab()
    await expect(canvas.getByRole('button', { name: 'Remove Education filter' })).toHaveFocus()
    await userEvent.keyboard('{Enter}')
    await expect(
      canvas.queryByRole('button', { name: 'Remove Education filter' }),
    ).not.toBeInTheDocument()
  },
}

// ─── 2.4.7 — Focus Visible ────────────────────────────────────────────────────

export const FocusVisible: Story = {
  name: 'Focus Visible — 2.4.7',
  parameters: {
    wcag: ['2.4.7'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '2.4.7',
          why: 'A row of tags looks uniform, so the focused one must be unmistakable to someone tabbing through it.',
          how: 'Tab to each interactive tag in turn. The play() asserts each draws a 2px solid outline in its own colour while focused by keyboard.',
          caveat:
            'The ring is :focus-visible only, so a mouse click does not draw it. In forced-colours mode it switches to the system Highlight colour.',
        }),
      },
    },
  },
  render: () => <InteractiveSet />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const controls = [
      canvas.getByRole('link', { name: 'Grants' }),
      canvas.getByRole('checkbox', { name: 'Regional NSW' }),
      canvas.getByRole('button', { name: 'More topics' }),
      canvas.getByRole('button', { name: 'Remove Education filter' }),
    ]
    for (const control of controls) {
      await userEvent.tab()
      await expect(control).toHaveFocus()
      const style = getComputedStyle(control)
      await expect(style.outlineStyle).toBe('solid')
      await expect(parseFloat(style.outlineWidth)).toBeGreaterThanOrEqual(2)
    }
  },
}

// ─── 2.5.8 — Target Size (Minimum) ────────────────────────────────────────────

export const TargetSize: Story = {
  name: 'Target Size (Minimum) — 2.5.8',
  parameters: {
    wcag: ['2.5.8'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '2.5.8',
          why: 'Tags are small by design and sit close together; a target that small is easy to miss with a finger, and easy to hit the wrong neighbour.',
          how: 'Every interactive member at the smallest size. The play() measures each target and asserts it is at least 48×48 — twice the 24px minimum — with the space reserved in layout, so wrapping rows never overlap.',
          caveat:
            'The visible pill can be smaller than the target at size sm; the target is the element’s own box, not an invisible extension of it.',
        }),
      },
    },
  },
  render: () => (
    <div className='flex flex-wrap items-center gap-3'>
      <TagLink size='sm' href='#grants'>
        Grants
      </TagLink>
      <TagCheckbox size='sm'>Regional NSW</TagCheckbox>
      <TagButton size='sm'>More</TagButton>
      <TagRemovable size='sm' removeLabel='Remove Education filter' onRemove={() => {}}>
        Education
      </TagRemovable>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const targets = [
      canvas.getByRole('link', { name: 'Grants' }),
      canvas.getByRole('checkbox', { name: 'Regional NSW' }),
      canvas.getByRole('button', { name: 'More' }),
      canvas.getByRole('button', { name: 'Remove Education filter' }),
    ]
    for (const target of targets) {
      const { width, height } = target.getBoundingClientRect()
      await expect(width).toBeGreaterThanOrEqual(48)
      await expect(height).toBeGreaterThanOrEqual(48)
    }
  },
}

// ─── 1.4.1 — Use of Color ─────────────────────────────────────────────────────

export const UseOfColor: Story = {
  name: 'Use of Color — 1.4.1',
  parameters: {
    wcag: ['1.4.1'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '1.4.1',
          why: 'A selected filter tag is also tinted, but a tint alone is invisible to many readers. The selection has to show in shape as well as colour.',
          how: 'An unselected, a selected and a mixed TagCheckbox. The play() asserts the selected one draws a check mark and the mixed one a dash, and the unselected one draws neither.',
          caveat:
            'The glyphs are aria-hidden: assistive technology reads the checked state from the checkbox role, covered by Name, Role, Value.',
        }),
      },
    },
  },
  render: () => (
    <div className='flex flex-wrap items-center gap-3'>
      <TagCheckbox>Environment</TagCheckbox>
      <TagCheckbox defaultChecked>Education</TagCheckbox>
      <TagCheckbox indeterminate>All regions</TagCheckbox>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const glyph = (name: string) => canvas.getByRole('checkbox', { name }).querySelector('svg')
    await expect(glyph('Environment')).toBeNull()
    await expect(glyph('Education')).toBeVisible()
    await expect(glyph('All regions')).toBeVisible()
    // A check for the selection and a different glyph for mixed.
    await expect(glyph('Education')!.innerHTML).not.toBe(glyph('All regions')!.innerHTML)
  },
}

// ─── 1.4.3 — Contrast (Minimum) ───────────────────────────────────────────────

function ColourMatrix() {
  return (
    <div className='space-y-4'>
      {[
        { colors: pageColors, brand: false },
        { colors: onDarkColors, brand: true },
      ].map(({ colors, brand }) => (
        <div
          key={String(brand)}
          className={cn(
            'flex flex-col items-start gap-3 rounded-xl border p-6',
            brand
              ? 'border-transparent bg-primary-800 dark:bg-primary-950'
              : 'border-border bg-background',
          )}
        >
          {colors.map((color) => (
            <div key={color} className='flex flex-wrap gap-3'>
              {variants.map((variant) => (
                <Tag key={variant} color={color} variant={variant}>
                  {color} {variant}
                </Tag>
              ))}
              <TagLink color={color} href='#grants'>
                {color} link
              </TagLink>
              <TagCheckbox color={color} defaultChecked>
                {color} checked
              </TagCheckbox>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

const tagSelector = '[data-slot="tag"], [data-slot="tag-link"], [data-slot="tag-checkbox"]'

const contrastStory: Story = {
  parameters: {
    wcag: ['1.4.3'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '1.4.3',
          why: 'A tag is 16px text that carries a topic by itself, so its label must clear 4.5:1 against what it is actually painted on — for soft, surface and a checked filter, a translucent tint over the page.',
          how: 'Every colour in every variant, plus a TagLink and a checked TagCheckbox, on the surface it is made for: the page for brand and semantic colours, the solid brand band for white and secondary. The play() composites each tint over its panel and measures the label against it.',
          caveat:
            'White and secondary are made for dark surfaces and are measured only on one. Disabled tags are exempt from the criterion and are not measured.',
        }),
      },
    },
  },
  render: () => <ColourMatrix />,
  play: async ({ canvasElement }) => {
    const tags = canvasElement.querySelectorAll<HTMLElement>(tagSelector)
    await expect(tags).toHaveLength(
      (pageColors.length + onDarkColors.length) * (variants.length + 2),
    )
    for (const tag of tags) {
      expectContrast(getComputedStyle(tag).color, paintedBackground(tag), {
        label: `Tag "${tag.textContent}"`,
      })
    }
  },
}

export const ContrastMinimum: Story = { ...contrastStory, name: 'Contrast (Minimum) — 1.4.3' }

export const ContrastMinimumDark: Story = {
  ...contrastStory,
  name: 'Contrast (Minimum) — 1.4.3 (dark)',
  globals: { theme: 'dark' },
}

// ─── 1.4.11 — Non-text Contrast ───────────────────────────────────────────────

const nonTextStory: Story = {
  parameters: {
    wcag: ['1.4.11'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '1.4.11',
          why: 'The border is what marks an interactive tag out as a control, and the box is what marks a TagCheckbox as a checkbox; both must clear 3:1 against the surface to be seen.',
          how: 'An outline TagLink, TagButton and TagCheckbox in each page colour. The play() measures each one’s border, and the checkbox’s box border, against the painted surface.',
          caveat:
            'The static Tag’s lighter border is decorative — the label carries it — and is not measured. White and secondary are dark-surface colours and are covered by the contrast story.',
        }),
      },
    },
  },
  render: () => (
    <div className='flex flex-col items-start gap-3 rounded-xl border border-border bg-background p-6'>
      {pageColors.map((color) => (
        <div key={color} className='flex flex-wrap gap-3'>
          <TagLink color={color} href='#grants'>
            {color} link
          </TagLink>
          <TagButton color={color}>{color} button</TagButton>
          <TagCheckbox color={color}>{color} filter</TagCheckbox>
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const controls = canvasElement.querySelectorAll<HTMLElement>(
      '[data-slot="tag-link"], [data-slot="tag-button"], [data-slot="tag-checkbox"]',
    )
    await expect(controls).toHaveLength(pageColors.length * 3)
    for (const control of controls) {
      const surface = paintedBackground(control)
      expectContrast(getComputedStyle(control).borderTopColor, surface, {
        minimum: 3,
        label: `"${control.textContent}" border`,
      })
      if (control.dataset.slot === 'tag-checkbox') {
        const box = control.querySelector<HTMLElement>(':scope > [aria-hidden]')
        await expect(box).not.toBeNull()
        expectContrast(getComputedStyle(box!).borderTopColor, surface, {
          minimum: 3,
          label: `"${control.textContent}" checkbox box`,
        })
      }
    }
  },
}

export const NonTextContrast: Story = { ...nonTextStory, name: 'Non-text Contrast — 1.4.11' }

export const NonTextContrastDark: Story = {
  ...nonTextStory,
  name: 'Non-text Contrast — 1.4.11 (dark)',
  globals: { theme: 'dark' },
}
