/**
 * Empty — Default, Variants, CssCheck
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'

import { IconFolderOpen } from '../icons/folder-open.js'
import { IconSearchOff } from '../icons/search-off.js'
import { Button } from './button.js'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from './empty.js'

const meta = {
  title: 'Components/Empty',
  component: Empty,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'An empty state for a list, table or search with nothing to show. Say why it is empty and offer a way forward. EmptyTitle is a div so it fits any heading level — put a heading inside it where the empty state stands in for a section.',
      },
    },
  },
  render: (args) => (
    <Empty {...args} className='border'>
      <EmptyHeader>
        <EmptyMedia variant='icon'>
          <IconFolderOpen aria-hidden='true' />
        </EmptyMedia>
        <EmptyTitle>
          <h2>No applications yet</h2>
        </EmptyTitle>
        <EmptyDescription>
          Applications you start are saved here, so you can come back to them later.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button>Start an application</Button>
      </EmptyContent>
    </Empty>
  ),
} satisfies Meta<typeof Empty>

export default meta

type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('heading', { name: 'No applications yet' })).toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: 'Start an application' })).toBeEnabled()
  },
}

export const Variants: Story = {
  name: 'Variants',
  play: async ({ canvasElement }) => {
    // EmptyTitle is a div, so plain-text titles add nothing to the outline —
    // the consumer opts in by nesting a heading (as Default does).
    const canvas = within(canvasElement)
    await expect(canvas.queryByRole('heading')).toBeNull()
    await expect(canvasElement.querySelector('[data-slot="empty-title"]')?.tagName).toBe('DIV')
  },
  render: () => (
    <div className='grid gap-6 md:grid-cols-2'>
      <Empty className='border'>
        <EmptyHeader>
          <EmptyMedia variant='icon'>
            <IconSearchOff aria-hidden='true' />
          </EmptyMedia>
          <EmptyTitle>No results for “parking permit”</EmptyTitle>
          <EmptyDescription>
            Check the spelling, or try a shorter search. You can also{' '}
            <a href='#browse'>browse all services</a>.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
      <Empty className='bg-muted'>
        <EmptyHeader>
          <EmptyMedia>
            <IconFolderOpen aria-hidden='true' className='size-16 text-muted-foreground' />
          </EmptyMedia>
          <EmptyTitle>Nothing archived</EmptyTitle>
          <EmptyDescription>Archived items appear here.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className='flex gap-2'>
            <Button variant='outline'>Import</Button>
            <Button>Create</Button>
          </div>
        </EmptyContent>
      </Empty>
    </div>
  ),
}

export const CssCheck: Story = {
  name: 'CSS Check',
  play: async ({ canvasElement }) => {
    // Proves globals.css loaded: the icon tile's --muted fill resolves.
    const media = canvasElement.querySelector<HTMLElement>('[data-slot="empty-icon"]')
    if (!media) throw new Error('EmptyMedia not found.')
    await expect(getComputedStyle(media).backgroundColor).not.toBe('rgba(0, 0, 0, 0)')
    const description = canvasElement.querySelector<HTMLElement>('[data-slot="empty-description"]')
    await expect(getComputedStyle(description!).fontSize).toBe('16px')
  },
}
