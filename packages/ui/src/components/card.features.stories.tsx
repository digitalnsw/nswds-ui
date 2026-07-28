/**
 * Card — Features
 *
 * Size scale, composition recipes, and supported content shapes for the Card
 * composition. Use these stories during design QA and CSS refactors to catch
 * regressions in padding, gap, header layout, and image clipping behaviour
 * across the full surface of the composition.
 *
 * Card is presentational and has no variant or colour axis — only a `size`
 * prop. The interesting axes therefore are composition (which sub-parts are
 * present) and content shape (with/without image, with/without action,
 * with/without description). Each story below isolates one of those axes.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './card.js'
import { docsTemplate } from './story-helpers.js'

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Components/Card/Features',
  component: Card,
  parameters: {
    layout: 'padded',
  },
  args: {
    size: 'default',
  },
} satisfies Meta<typeof Card>

export default meta

type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Sizes: Story = {
  name: 'Sizes',
  parameters: {
    docs: {
      description: {
        story: docsTemplate({
          what: 'Side-by-side comparison of the default and sm size variants showing identical content. Both render the same composition so padding, gap, and row spacing differences are isolated.',
          why: 'Confirms the size-driven padding and gap tokens scale consistently across header, content, and footer sub-parts after token or layout refactors.',
          how: 'Compare horizontal padding (px-4 vs px-3) and vertical gap (gap-4 vs gap-3) between the two cards. Title and description spacing inside the header should also shrink in the sm variant.',
          caveat:
            'Card only exposes two sizes — sm and default. Consumers needing larger layouts should compose Card with their own outer spacing utilities rather than introducing a new size variant.',
        }),
      },
    },
  },
  render: () => (
    <div className='grid w-full max-w-4xl grid-cols-1 gap-4 md:grid-cols-2'>
      {(['default', 'sm'] as const).map((size) => (
        <Card key={size} size={size}>
          <CardHeader>
            <CardTitle>Size: {size}</CardTitle>
            <CardDescription>Padding and gap scale with the size token.</CardDescription>
          </CardHeader>
          <CardContent>Card body content sits inside CardContent.</CardContent>
          <CardFooter>Footer row.</CardFooter>
        </Card>
      ))}
    </div>
  ),
}

export const Composition: Story = {
  name: 'Composition',
  parameters: {
    docs: {
      description: {
        story: docsTemplate({
          what: 'Card composed with every sub-part used together: CardHeader, CardTitle, CardDescription, CardAction, CardContent, and CardFooter.',
          why: 'Exercises the full grid wiring inside CardHeader — when CardAction is present, the header switches to a two-column grid so the action sits flush right while title and description stack on the left.',
          how: 'Verify the action button aligns to the right edge of the header and spans both header rows. Title and description should stack tightly on the left without overlapping the action.',
          caveat:
            'CardAction relies on data-slot detection inside CardHeader to flip the grid layout. Wrapping CardAction in another element will break the grid — render CardAction as a direct child of CardHeader.',
        }),
      },
    },
  },
  render: () => (
    <Card className='max-w-md'>
      <CardHeader>
        <CardTitle>Project status</CardTitle>
        <CardDescription>Quarterly summary across active workstreams.</CardDescription>
        <CardAction>
          <button className='text-xs font-medium text-primary underline-offset-4 hover:underline'>
            View all
          </button>
        </CardAction>
      </CardHeader>
      <CardContent>12 tasks in review, 4 blocked, and 28 completed this sprint.</CardContent>
      <CardFooter>Last sync 5 minutes ago.</CardFooter>
    </Card>
  ),
}

export const WithImage: Story = {
  name: 'With Image',
  parameters: {
    docs: {
      description: {
        story: docsTemplate({
          what: 'Card rendered with a leading image as its first child, followed by header, content, and footer.',
          why: 'Card uses a `has-[>img:first-child]:pt-0` rule to remove top padding when the first child is an image, and a `*:[img:first-child]:rounded-t-lg` rule to round the top corners of the image. This story verifies both behaviours after CSS refactors.',
          how: 'Confirm the image sits flush against the top edge of the card with no gap, and that the top corners of the image follow the card radius without clipping.',
          caveat:
            'The image must be a direct first child of Card — wrapping it in another element breaks the selector. The image element is responsible for its own aspect ratio and object-fit; Card does not enforce a height.',
        }),
      },
    },
  },
  render: () => (
    <Card className='max-w-sm'>
      <img
        src='https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=60'
        alt=''
        className='aspect-video h-auto w-full object-cover'
      />
      <CardHeader>
        <CardTitle>Autumn in the Blue Mountains</CardTitle>
        <CardDescription>A weekend itinerary with the best walks and lookouts.</CardDescription>
      </CardHeader>
      <CardContent>
        Includes Govetts Leap, Wentworth Falls, and the Grand Canyon walking track.
      </CardContent>
      <CardFooter>4 min read.</CardFooter>
    </Card>
  ),
}

export const MinimalCard: Story = {
  name: 'Minimal',
  parameters: {
    docs: {
      description: {
        story: docsTemplate({
          what: 'Card composed only of Card + CardContent — no header, no footer, no title or description.',
          why: 'Confirms the bare surface still renders the rounded boundary, ring, and content padding correctly when only a single sub-part is present.',
          how: 'Verify the content text sits inside the same horizontal padding as a full card, and that the rounded corners and ring still apply without any other sub-parts present.',
          caveat:
            'When only CardContent is present, vertical padding still comes from Card itself (py-4 / py-3). Consumers wanting a flush layout should drop CardContent and place children directly.',
        }),
      },
    },
  },
  render: () => (
    <Card className='max-w-md'>
      <CardContent>
        Minimal card with just CardContent inside. Useful for list rows or compact summary tiles
        where a header is overkill.
      </CardContent>
    </Card>
  ),
}

export const CardWithoutDescription: Story = {
  name: 'Header without description',
  parameters: {
    docs: {
      description: {
        story: docsTemplate({
          what: 'Card whose header contains only CardTitle (and optionally CardAction) — no CardDescription.',
          why: 'CardHeader uses a `has-data-[slot=card-description]` selector to switch to a two-row grid. Without a description, the header should collapse to a single row with the title vertically centred against the action.',
          how: 'Verify the header is a single row, the title baseline is aligned with the action button, and there is no empty second row reserving space below the title.',
          caveat:
            'If you need spacing below the title without rendering a description, add it via CardContent rather than reintroducing an empty CardDescription — empty descriptions still trigger the two-row grid.',
        }),
      },
    },
  },
  render: () => (
    <Card className='max-w-md'>
      <CardHeader>
        <CardTitle>Single-row header</CardTitle>
        <CardAction>
          <button className='text-xs font-medium text-primary underline-offset-4 hover:underline'>
            Edit
          </button>
        </CardAction>
      </CardHeader>
      <CardContent>Body content for a header-only card.</CardContent>
    </Card>
  ),
}
