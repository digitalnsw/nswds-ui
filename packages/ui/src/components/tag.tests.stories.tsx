import type { Meta, StoryObj } from '@storybook/react-vite'
import React, { useRef, useState } from 'react'
import { expect, fn, userEvent, within } from 'storybook/test'

import { IconCheck } from '../icons/check.js'
import { LinkProvider } from './link.js'
import { ThemeSurface } from './story-helpers.js'
import { Tag, TagButton, TagCheckbox, TagLink, TagRemovable } from './tag.js'

const colors = [
  'primary',
  'grey',
  'secondary',
  'white',
  'tertiary',
  'accent',
  'danger',
  'success',
  'warning',
] as const
const variants = ['solid', 'soft', 'surface', 'outline'] as const
const meta = {
  title: 'Components/Tag/Tests',
  component: Tag,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Categories and topics use small-radius tags. Tag is static; TagLink navigates without an underline; TagCheckbox selects a filter; TagRemovable exposes a separately named remove button. Use Badge for status and counts.',
      },
    },
  },
  tags: ['!dev', '!autodocs'],
  args: { children: 'Environment' },
  argTypes: {
    color: { control: 'select', options: colors },
    variant: { control: 'inline-radio', options: variants },
    size: { control: 'inline-radio', options: ['sm', 'default', 'lg'] },
  },
} satisfies Meta<typeof Tag>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <div className='flex flex-wrap items-center gap-3'>
      <Tag {...args} />
      <TagLink href='#grants'>Grants</TagLink>
      <TagCheckbox defaultChecked>Regional NSW</TagCheckbox>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const checkbox = canvas.getByRole('checkbox', { name: 'Regional NSW' })
    await expect(checkbox).toBeChecked()
    await userEvent.click(checkbox)
    await expect(checkbox).not.toBeChecked()
    await userEvent.keyboard(' ')
    await expect(checkbox).toBeChecked()
    await expect(canvas.getByRole('link', { name: 'Grants' })).toHaveAttribute('href', '#grants')
  },
}

export const Variants: Story = {
  render: () => (
    <div className='space-y-4'>
      {colors.map((color) => (
        <ThemeSurface key={color} color={color}>
          <div className='flex flex-wrap gap-3'>
            {variants.map((variant) => (
              <Tag key={variant} color={color} variant={variant}>
                {color} {variant}
              </Tag>
            ))}
          </div>
        </ThemeSurface>
      ))}
    </div>
  ),
}

export const CssCheck: Story = {
  render: () => (
    <div className='flex flex-wrap items-center gap-3'>
      <Tag>Environment</Tag>
      <TagLink href='#grants'>Grants</TagLink>
      <TagCheckbox>Regional NSW</TagCheckbox>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const tag = canvasElement.querySelector<HTMLElement>('[data-slot=tag]')!
    const link = canvas.getByRole('link', { name: 'Grants' })
    await expect(parseFloat(getComputedStyle(tag).borderRadius)).toBe(4)
    await expect(getComputedStyle(tag).boxShadow).toBe('none')
    await expect(getComputedStyle(link).textDecorationLine).toBe('none')
    await expect(link.getBoundingClientRect().height).toBeGreaterThanOrEqual(48)
    // Storybook's synthetic pointer events do not activate CSS :hover.
    // Check the real pointer states in the browser, alongside this keyboard path.
    await userEvent.tab()
    await expect(link).toHaveFocus()
    await expect(getComputedStyle(link).outlineStyle).toBe('solid')
    await expect(parseFloat(getComputedStyle(link).outlineWidth)).toBeGreaterThanOrEqual(2)
    await expect(getComputedStyle(link).textDecorationLine).toBe('none')
  },
}

function FilterExample() {
  const [checked, setChecked] = useState(false)
  const [education, setEducation] = useState(true)
  const regionalRef = useRef<HTMLButtonElement>(null)
  return (
    <form aria-label='Topic filters' className='flex flex-wrap items-center gap-3'>
      <TagCheckbox
        ref={regionalRef}
        name='topic'
        value='regional'
        checked={checked}
        onCheckedChange={setChecked}
      >
        Regional NSW
      </TagCheckbox>
      <TagCheckbox disabled name='topic' value='closed'>
        Unavailable
      </TagCheckbox>
      <TagCheckbox readOnly defaultChecked>
        Read only
      </TagCheckbox>
      <TagCheckbox indeterminate>All regions</TagCheckbox>
      {education && (
        <TagRemovable
          removeLabel='Remove Education filter'
          onRemove={() => {
            setEducation(false)
            regionalRef.current?.focus()
          }}
        >
          Education
        </TagRemovable>
      )}
    </form>
  )
}

export const Filters: Story = {
  render: () => <FilterExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const form = canvas.getByRole('form', { name: 'Topic filters' }) as HTMLFormElement
    const selected = canvas.getByRole('checkbox', { name: 'Regional NSW' })
    await expect(new FormData(form).has('topic')).toBe(false)
    await userEvent.click(selected)
    await expect(selected).toBeChecked()
    await expect(new FormData(form).get('topic')).toBe('regional')
    const disabled = canvas.getByRole('checkbox', { name: 'Unavailable' })
    await userEvent.click(disabled)
    await expect(disabled).not.toBeChecked()
    await expect(disabled).toHaveAttribute('data-disabled')
    const readOnly = canvas.getByRole('checkbox', { name: 'Read only' })
    await userEvent.click(readOnly)
    await expect(readOnly).toBeChecked()
    await expect(canvas.getByRole('checkbox', { name: 'All regions' })).toHaveAttribute(
      'aria-checked',
      'mixed',
    )
    const remove = canvas.getByRole('button', { name: 'Remove Education filter' })
    await expect(remove.getBoundingClientRect().height).toBeGreaterThanOrEqual(48)
    await expect(remove.getBoundingClientRect().width).toBeGreaterThanOrEqual(48)
    await userEvent.click(remove)
    await expect(
      canvas.queryByRole('button', { name: 'Remove Education filter' }),
    ).not.toBeInTheDocument()
    await expect(selected).toHaveFocus()
  },
}

export const DisabledRemoval: Story = {
  render: () => (
    <TagRemovable disabled removeLabel='Remove locked filter' onRemove={fn()}>
      Locked filter
    </TagRemovable>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('button', { name: 'Remove locked filter' }),
    ).toBeDisabled()
  },
}

export const RemoveIconSize: Story = {
  render: () => (
    <div className='flex flex-wrap items-center gap-3'>
      <TagRemovable removeLabel='Remove Approved filter' onRemove={fn()}>
        <IconCheck data-testid='label-icon' /> Approved
      </TagRemovable>
      <TagCheckbox defaultChecked>Selected</TagCheckbox>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const size = (el: Element) => {
      const { width, height } = el.getBoundingClientRect()
      return [width, height]
    }
    // The Tag root's descendant icon rule must not shrink the remove glyph.
    const remove = canvas.getByRole('button', { name: 'Remove Approved filter' })
    await expect(size(remove.querySelector('[data-slot=icon]')!)).toEqual([20, 20])
    await expect(size(canvas.getByTestId('label-icon'))).toEqual([16, 16])
    const checkbox = canvas.getByRole('checkbox', { name: 'Selected' })
    await expect(size(checkbox.querySelector('[data-slot=icon]')!)).toEqual([16, 16])
  },
}

export const RemovableFocus: Story = {
  render: () => (
    <div className='space-y-4'>
      {colors.map((color) => (
        <ThemeSurface key={color} color={color}>
          <div className='flex flex-wrap gap-3'>
            {variants.map((variant) => (
              <TagRemovable
                key={variant}
                color={color}
                variant={variant}
                removeLabel={`Remove ${color} ${variant}`}
                onRemove={fn()}
              >
                {color} {variant}
              </TagRemovable>
            ))}
          </div>
        </ThemeSurface>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    for (const button of within(canvasElement).getAllByRole('button')) {
      await userEvent.tab()
      await expect(button).toHaveFocus()
      const style = getComputedStyle(button)
      await expect(style.outlineStyle).toBe('solid')
      await expect(parseFloat(style.outlineWidth)).toBeGreaterThanOrEqual(2)
      if (button.closest('[data-variant=solid]')) {
        // All four sides must sit inside the coloured tag, including at its edges.
        await expect(parseFloat(style.outlineOffset)).toBeLessThanOrEqual(
          -parseFloat(style.outlineWidth),
        )
        await expect(style.outlineColor).toBe(style.color)
      } else {
        await expect(parseFloat(style.outlineOffset)).toBeGreaterThanOrEqual(2)
      }
    }
  },
}
export const RemovableFocusDark: Story = { ...RemovableFocus, globals: { theme: 'dark' } }

export const WithLinkProvider: Story = {
  render: () => (
    <LinkProvider
      component={(props: React.ComponentPropsWithoutRef<'a'>) => (
        <a {...props} data-framework-link />
      )}
    >
      <TagLink href='#grants'>Grants</TagLink>
    </LinkProvider>
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('link', { name: 'Grants' })).toHaveAttribute(
      'data-framework-link',
    )
  },
}

export const SizesAndWrapping: Story = {
  render: () => (
    <div className='w-full max-w-80 space-y-4'>
      {(['sm', 'default', 'lg'] as const).map((size) => (
        <div key={size} className='flex flex-wrap items-center gap-2'>
          <TagLink href='#community' size={size}>
            Aboriginal community organisations and regional services
          </TagLink>
          <TagCheckbox size={size}>Regional NSW</TagCheckbox>
          <TagRemovable size={size} removeLabel={`Remove Education ${size}`} onRemove={fn()}>
            Education
          </TagRemovable>
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const container = canvasElement.firstElementChild as HTMLElement
    await expect(container.scrollWidth).toBeLessThanOrEqual(container.clientWidth)
    for (const link of within(canvasElement).getAllByRole('link')) {
      await expect(link.getBoundingClientRect().height).toBeGreaterThanOrEqual(48)
      await expect(getComputedStyle(link).textDecorationLine).toBe('none')
    }
    // No size may render text below the 16px floor or tighter than 1.5 line spacing.
    for (const tag of canvasElement.querySelectorAll('[data-slot^=tag]')) {
      const { fontSize, lineHeight } = getComputedStyle(tag)
      await expect(parseFloat(fontSize)).toBeGreaterThanOrEqual(16)
      await expect(parseFloat(lineHeight)).toBeGreaterThanOrEqual(1.5 * parseFloat(fontSize))
    }
  },
}

export const Dark: Story = { ...Default, globals: { theme: 'dark' } }
export const CssCheckDark: Story = { ...CssCheck, globals: { theme: 'dark' } }
export const VariantsDark: Story = { ...Variants, globals: { theme: 'dark' } }

export const InteractiveColours: Story = {
  render: () => (
    <div className='space-y-4'>
      {colors.map((color) => (
        <ThemeSurface key={color} color={color}>
          <div className='flex flex-wrap gap-3'>
            <TagLink color={color} href='#topic'>
              Topic
            </TagLink>
            <TagCheckbox color={color} defaultChecked>
              Selected
            </TagCheckbox>
            <TagButton color={color}>Action</TagButton>
          </div>
        </ThemeSurface>
      ))}
    </div>
  ),
}
export const InteractiveColoursDark: Story = { ...InteractiveColours, globals: { theme: 'dark' } }
