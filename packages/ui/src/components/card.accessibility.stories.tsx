/**
 * Card — Accessibility
 *
 * WCAG 2.2 criterion-driven stories for the Card composition.
 *
 * Card is a presentational container — it is not interactive, has no role,
 * and does not manage focus on its own. The applicable WCAG criteria are
 * therefore limited to:
 *
 *   - 1.3.1  Info and Relationships  (semantic structure / heading nesting)
 *   - 1.4.3  Contrast (Minimum)      (card-foreground vs card background)
 *   - 1.4.11 Non-text Contrast        (ring boundary vs surrounding surface)
 *   - 2.4.7  Focus Visible            (only when card contains interactive children)
 *   - 2.4.11 Focus Not Obscured       (focus ring of inner controls is not clipped)
 *
 * Stories below are scoped to those criteria. Card has no size variants that
 * affect hit area, so WCAG 2.5.8 (Target Size Minimum) is not applicable to
 * Card itself — it applies to whatever interactive controls the consumer
 * places inside.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { Button } from './button.js'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './card.js'
import { bodyClasses, ThemeSurface, titleClasses, wcagStoryMeta } from './story-helpers.js'

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Components/Card/Accessibility',
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

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getCard(canvasElement: HTMLElement): HTMLElement {
  const card = canvasElement.querySelector<HTMLElement>('[data-slot="card"]')
  if (!card) throw new Error('Could not find [data-slot="card"].')
  return card
}

// ─── Stories ──────────────────────────────────────────────────────────────────

export const InfoAndRelationships: Story = {
  name: 'Info and Relationships — 1.3.1',
  parameters: {
    wcag: ['1.3.1'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '1.3.1',
          why: 'Screen-reader users rely on semantic structure to understand the relationship between a card title, its description, and its body. Using a real heading element inside CardTitle ensures the card joins the page heading outline rather than appearing as orphaned text.',
          how: 'Inspect the rendered DOM: CardTitle should contain a real heading element (h2/h3/etc.) appropriate to the surrounding outline. The play() function below asserts a heading is present inside the first card title.',
          caveat:
            'CardTitle renders a <div> by default so the composition stays neutral. Consumers MUST nest a heading element (h2, h3, …) inside CardTitle — or render CardTitle around their own heading — so the card participates in the document outline at the correct level.',
        }),
      },
    },
  },
  render: () => (
    <Card className='max-w-md'>
      <CardHeader>
        <CardTitle>
          <h3 className='font-heading text-sm font-medium'>Account settings</h3>
        </CardTitle>
        <CardDescription>
          Update your email, password, and notification preferences.
        </CardDescription>
      </CardHeader>
      <CardContent>
        Changes apply across all NSW Government services linked to your account.
      </CardContent>
    </Card>
  ),
  play: async ({ canvasElement }) => {
    const card = getCard(canvasElement)

    const title = card.querySelector('[data-slot="card-title"]')
    if (!title) throw new Error('Could not find [data-slot="card-title"].')

    const heading = title.querySelector('h1, h2, h3, h4, h5, h6')
    if (!heading) {
      throw new Error(
        'CardTitle should contain a heading element (h1–h6) so the card participates in the document outline.',
      )
    }
  },
}

export const ContrastMinimum: Story = {
  name: 'Contrast — 1.4.3',
  parameters: {
    wcag: ['1.4.3'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '1.4.3',
          why: 'Card title and body text must meet the 4.5:1 minimum contrast ratio against the card surface in every theme so users with low vision can read them.',
          how: 'Use a colour-contrast checker (e.g. Chrome DevTools) on CardTitle (against the card surface) and on CardDescription (against the card surface). Verify both light and dark themes.',
          caveat:
            'CardDescription uses text-muted-foreground which is intentionally lower contrast than CardTitle — verify it still meets 4.5:1 against the card background, not against the page background.',
        }),
      },
    },
  },
  render: () => (
    <div className='space-y-4'>
      {(['primary', 'white'] as const).map((color) => (
        <ThemeSurface key={`contrast-${color}`} color={color}>
          <h4 className={`mb-3 text-sm font-semibold ${titleClasses(color)}`}>
            Surrounding surface: {color}
          </h4>
          <Card className='max-w-md'>
            <CardHeader>
              <CardTitle>Payment details</CardTitle>
              <CardDescription>Manage cards and billing addresses on file.</CardDescription>
            </CardHeader>
            <CardContent>
              Card text should remain readable regardless of the page surface.
            </CardContent>
          </Card>
          <p className={`mt-3 text-xs ${bodyClasses(color)}`}>
            Verify card-foreground vs card background, not vs the surrounding surface.
          </p>
        </ThemeSurface>
      ))}
    </div>
  ),
}

export const NonTextContrast: Story = {
  name: 'Non-text Contrast — 1.4.11',
  parameters: {
    wcag: ['1.4.11'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: '1.4.11',
          why: 'Card uses a 1px ring (ring-1 ring-foreground/10) to delimit its boundary. That boundary must meet 3:1 against the surrounding surface so users with low vision can perceive where the card starts and ends.',
          how: 'Place the card on every surface it can appear on (default background, muted background, dark mode) and verify the ring is still visible at 3:1 against each. The story below renders the card against both default and dark surfaces.',
          caveat:
            'The default ring opacity (10%) is tuned for the default page background. Consumers placing the card on a tinted or low-contrast surface may need to raise the ring opacity via className to stay above 3:1.',
        }),
      },
    },
  },
  render: () => (
    <div className='space-y-4'>
      <div className='rounded-sm border border-border bg-background p-6'>
        <p className='mb-3 text-sm font-semibold text-foreground'>Default surface</p>
        <Card className='max-w-md'>
          <CardHeader>
            <CardTitle>Boundary visibility</CardTitle>
            <CardDescription>
              Ring should remain visible against the page background.
            </CardDescription>
          </CardHeader>
          <CardContent>Boundary test against default background.</CardContent>
        </Card>
      </div>

      <div className='rounded-sm border border-grey-700 bg-grey-800 p-6'>
        <p className='mb-3 text-sm font-semibold text-grey-50'>Dark surface</p>
        <Card className='max-w-md'>
          <CardHeader>
            <CardTitle>Boundary visibility</CardTitle>
            <CardDescription>
              Ring should remain visible against a dark surrounding surface.
            </CardDescription>
          </CardHeader>
          <CardContent>Boundary test against dark background.</CardContent>
        </Card>
      </div>
    </div>
  ),
}

export const FocusVisible: Story = {
  name: 'Focus Visible — 2.4.7 / 2.4.11',
  parameters: {
    wcag: ['2.4.7', '2.4.11'],
    docs: {
      description: {
        story: wcagStoryMeta({
          criteria: ['2.4.7', '2.4.11'],
          why: 'Card itself is not focusable, but it frequently contains interactive controls (buttons, links). Those inner controls must show their own focus indicator and the indicator must not be clipped by the card boundary or overflow.',
          how: 'Tab into the card and verify the inner button shows its focus ring. The ring must not be cut off by the card edge — Card uses overflow-hidden to clip imagery, so focus offsets need to fit within the inner padding.',
          caveat:
            'Card sets overflow-hidden on its outer surface (to clip first-child images to the top corners). Focus indicators that rely on outline-offset > inner padding may be visually clipped — use offsets that fit inside the px-4 / px-3 padding.',
        }),
      },
    },
  },
  render: () => (
    <Card className='max-w-md'>
      <CardHeader>
        <CardTitle>Inner focus test</CardTitle>
        <CardDescription>
          Tab into the card and confirm the button focus ring is visible.
        </CardDescription>
        <CardAction>
          <Button variant='ghost' size='sm'>
            Edit
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <Button variant='solid' color='primary'>
          Primary action
        </Button>
      </CardContent>
      <CardFooter>
        <Button variant='link' color='primary'>
          Learn more
        </Button>
      </CardFooter>
    </Card>
  ),
}
