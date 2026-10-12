/**
 * Hero — the story set for docs/reference-storybook-standard.md.
 *
 *   Components/Hero                → this file: Docs, Default, Playground
 *   Components/Hero/Features       → hero.features.stories.tsx
 *   Components/Hero/Accessibility  → hero.accessibility.stories.tsx
 *
 * The docs page's sections are exported (and kept out of the story index by
 * `excludeStories`) so the Features stories render the same examples. The
 * five recommended combinations ship as registry blocks and have a page of
 * their own under Patterns/HeroBlocks.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { IconArrowForward } from '../icons/index.js'
import { ButtonLink } from './button.js'
import {
  Hero,
  HeroActions,
  HeroContent,
  HeroDescription,
  HeroMedia,
  HeroRule,
  HeroTitle,
  type HeroColor,
} from './hero.js'
import { DocsApi, DocsPage, DocsUsage, Example, ExampleSection } from './story-helpers.js'

// Served by Storybook from apps/storybook/public; replace with your own artwork.
const illustration = { src: 'images/hero-illustration.png', alt: '' }
const canvas = { src: 'images/hero-illustration-canvas.png', alt: '' }
const stack = { src: 'images/hero-illustration-stack.png', alt: '' }

const description =
  'Reusable components, layouts and tools for NSW Government email: accessible, on-brand and proven in every major client, Outlook included.'

const colors: HeroColor[] = ['white', 'light', 'tint', 'dark']

const colorDocs: ReadonlyArray<readonly [HeroColor, string]> = [
  ['white', 'The page’s own surface. The default under a white header.'],
  ['light', 'Off-white, marking the opener off from a white body without colour.'],
  ['tint', 'The pale brand blue, for a landing page that wants one panel of colour.'],
  ['dark', 'The brand band: white on navy, as email.digital.nsw.gov.au opens.'],
]

/** Actions that read on the given surface (see Button’s `color`). */
function Actions({ color }: { color: HeroColor }) {
  const buttonColor = color === 'dark' ? 'white' : 'primary'
  return (
    <HeroActions>
      <ButtonLink href='#start' color={buttonColor} trailingVisual={IconArrowForward}>
        Get started
      </ButtonLink>
      <ButtonLink href='#components' variant='outline' color={buttonColor}>
        View components
      </ButtonLink>
    </HeroActions>
  )
}

// ─── Sections ─────────────────────────────────────────────────────────────────
// Each section is one example story AND one part of the docs page.

export function LayoutsSection() {
  return (
    <ExampleSection
      title='Layouts'
      description={
        <>
          <code>split</code> sets the content beside the media from <code>lg</code> and stacks them,
          content first, below it. <code>stack</code> sets the content over the media at full width,
          and is the layout for a hero with no media at all.
        </>
      }
    >
      <Example
        layout='fill'
        code={`<Hero layout="split" labelledBy="hero-title">
  <HeroContent>
    <HeroTitle id="hero-title">Built for every inbox.</HeroTitle>
    <HeroDescription>…</HeroDescription>
    <HeroActions>…</HeroActions>
  </HeroContent>
  <HeroMedia fit="framed"><img src="…" alt="" /></HeroMedia>
</Hero>`}
      >
        <Hero layout='split' labelledBy='layouts-split-title'>
          <HeroContent>
            <HeroTitle id='layouts-split-title'>Built for every inbox.</HeroTitle>
            <HeroDescription>{description}</HeroDescription>
            <Actions color='white' />
          </HeroContent>
          <HeroMedia fit='framed'>
            <img src={canvas.src} alt={canvas.alt} />
          </HeroMedia>
        </Hero>
      </Example>
      <Example
        layout='fill'
        code={`<Hero layout="stack" align="centre" labelledBy="hero-title">
  <HeroContent>…</HeroContent>
  <HeroMedia fit="band"><img src="…" alt="" /></HeroMedia>
</Hero>`}
      >
        <Hero layout='stack' align='centre' labelledBy='layouts-stack-title'>
          <HeroContent>
            <HeroTitle id='layouts-stack-title'>
              Consistent, accessible email for NSW Government.
            </HeroTitle>
            <HeroDescription>{description}</HeroDescription>
            <Actions color='white' />
          </HeroContent>
          <HeroMedia fit='band'>
            <img src={illustration.src} alt={illustration.alt} />
          </HeroMedia>
        </Hero>
      </Example>
    </ExampleSection>
  )
}

export function ColoursSection() {
  return (
    <ExampleSection
      title='Colours'
      description={
        <>
          Four surfaces, in the Header’s vocabulary plus <code>tint</code>. Each sets the inks its
          slots read, so the title, description and anything you add inside stay readable in both
          themes. On <code>dark</code> give the actions <code>color=&quot;white&quot;</code>.
        </>
      }
    >
      <Example layout='fill' code={`<Hero color="dark" layout="stack">…</Hero>`}>
        <div className='flex flex-col gap-4'>
          {colors.map((color) => (
            <Hero
              key={color}
              color={color}
              layout='stack'
              labelledBy={`colours-${color}-title`}
              innerClassName='max-w-3xl'
            >
              <HeroContent className='max-sm:py-10 sm:max-lg:py-10 lg:py-12'>
                <HeroTitle id={`colours-${color}-title`} headingLevel={2}>
                  {color}
                </HeroTitle>
                <HeroDescription>{colorDocs.find(([c]) => c === color)?.[1]}</HeroDescription>
                <Actions color={color} />
              </HeroContent>
            </Hero>
          ))}
        </div>
      </Example>
    </ExampleSection>
  )
}

export function MediaSection() {
  return (
    <ExampleSection
      title='Media'
      description={
        <>
          <code>HeroMedia</code> wraps one image and <code>fit</code> decides how it sits.{' '}
          <code>bleed</code> runs flush to the band’s edge and fills its height; <code>framed</code>{' '}
          is a rounded picture beside the text; <code>rise</code> climbs out of the bottom edge of a
          panel; <code>band</code> is a shallow strip beneath stacked content. Every fit crops the
          image to the slot, so pass a plain <code>img</code> or your framework’s image component.
        </>
      }
    >
      <Example layout='fill' code={`<HeroMedia fit="bleed"><img src="…" alt="" /></HeroMedia>`}>
        <Hero color='dark' layout='split' labelledBy='media-bleed-title'>
          <HeroContent>
            <HeroTitle id='media-bleed-title' headingLevel={2}>
              Made to send.
            </HeroTitle>
            <HeroDescription>{description}</HeroDescription>
            <Actions color='dark' />
          </HeroContent>
          <HeroMedia fit='bleed'>
            <img src={illustration.src} alt={illustration.alt} />
          </HeroMedia>
        </Hero>
      </Example>
      <Example layout='fill' code={`<HeroMedia fit="rise"><img src="…" alt="" /></HeroMedia>`}>
        <Hero color='tint' layout='split' labelledBy='media-rise-title'>
          <HeroContent>
            <HeroTitle id='media-rise-title' headingLevel={2}>
              Design once, send anywhere.
            </HeroTitle>
            <HeroDescription>{description}</HeroDescription>
            <Actions color='tint' />
          </HeroContent>
          <HeroMedia fit='rise'>
            <img src={stack.src} alt={stack.alt} />
          </HeroMedia>
        </Hero>
      </Example>
    </ExampleSection>
  )
}

export function RuleSection() {
  return (
    <ExampleSection
      title='Without media'
      description={
        <>
          A hero with no illustration is <code>layout=&quot;stack&quot;</code> with only a{' '}
          <code>HeroContent</code>. <code>HeroRule</code> above the title gives it one mark of the
          brand colour; it is decorative and hidden from assistive technology.
        </>
      }
    >
      <Example
        layout='fill'
        code={`<Hero layout="stack" labelledBy="hero-title">
  <HeroContent>
    <HeroRule />
    <HeroTitle id="hero-title">On-brand in every inbox.</HeroTitle>
    …
  </HeroContent>
</Hero>`}
      >
        <Hero layout='stack' labelledBy='rule-title'>
          <HeroContent>
            <HeroRule />
            <HeroTitle id='rule-title' headingLevel={2}>
              On-brand in every inbox.
            </HeroTitle>
            <HeroDescription>{description}</HeroDescription>
            <Actions color='white' />
          </HeroContent>
        </Hero>
      </Example>
    </ExampleSection>
  )
}

export function NamingSection() {
  return (
    <ExampleSection
      title='Naming the hero'
      description={
        <>
          Like Section, a hero only becomes a <code>region</code> landmark once it has a name. Point{' '}
          <code>labelledBy</code> at the <code>id</code> of its <code>HeroTitle</code>. The title is
          an <code>h1</code> by default, because a hero opens the page; pass{' '}
          <code>headingLevel=&#123;2&#125;</code> for a hero that opens a section of a page whose{' '}
          <code>h1</code> sits elsewhere.
        </>
      }
    >
      <Example
        layout='fill'
        code={`<Hero labelledBy="welcome-title">
  <HeroContent>
    <HeroTitle id="welcome-title">Made to send.</HeroTitle>
  </HeroContent>
</Hero>`}
      >
        <Hero color='light' layout='stack' labelledBy='naming-title'>
          <HeroContent className='max-sm:py-10 sm:max-lg:py-10 lg:py-12'>
            <HeroTitle id='naming-title' headingLevel={2}>
              Made to send.
            </HeroTitle>
            <HeroDescription>
              This band is exposed as “Made to send., region” in the landmark list.
            </HeroDescription>
          </HeroContent>
        </Hero>
      </Example>
    </ExampleSection>
  )
}

// ─── Docs page ────────────────────────────────────────────────────────────────

function HeroDocs() {
  return (
    <DocsPage
      title='Hero'
      npm={['Hero', 'HeroContent', 'HeroTitle', 'HeroDescription', 'HeroActions', 'HeroMedia']}
      registry='hero'
      summary={
        <>
          The opening band of a page: a <strong>title</strong>, a short description, up to two
          actions and optionally one illustration, on four surface colours. Compose it from its
          slots, or start from one of the five hero blocks.
        </>
      }
    >
      <DocsUsage
        use={[
          'The first band of a landing or product page, under the header.',
          'A short statement of what the service is, with one or two ways in.',
          'One illustration, where the brand has artwork for the page.',
        ]}
        avoid={[
          'A band further down the page — use Section with Container.',
          'A notice or warning at the top of a page — use Callout.',
          'A carousel of images or messages — use Carousel.',
        ]}
      />
      <LayoutsSection />
      <ColoursSection />
      <MediaSection />
      <RuleSection />
      <NamingSection />
      <DocsApi />
    </DocsPage>
  )
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Components/Hero',
  component: Hero,
  tags: ['autodocs'],
  excludeStories: /Section$/,
  parameters: {
    layout: 'fullscreen',
    controls: { expanded: true, sort: 'requiredFirst' },
    docs: { page: HeroDocs },
  },
  args: {
    color: 'white',
    layout: 'split',
    container: 'fluid',
    align: 'start',
    labelledBy: 'demo-hero-title',
    children: (
      <>
        <HeroContent>
          <HeroTitle id='demo-hero-title'>Built for every inbox.</HeroTitle>
          <HeroDescription>{description}</HeroDescription>
          <Actions color='white' />
        </HeroContent>
        <HeroMedia fit='framed'>
          <img src={canvas.src} alt={canvas.alt} />
        </HeroMedia>
      </>
    ),
  },
  argTypes: {
    color: {
      control: 'inline-radio',
      options: colors,
      description: 'Surface colour. Sets the inks the slots read.',
      table: { category: 'Appearance' },
    },
    layout: {
      control: 'inline-radio',
      options: ['split', 'stack'],
      description: 'Content beside the media, or over it.',
      table: { category: 'Appearance' },
    },
    container: {
      control: 'inline-radio',
      options: ['fluid', 'contained'],
      description: 'Full-bleed, or a centred 1200px column.',
      table: { category: 'Appearance' },
    },
    align: {
      control: 'inline-radio',
      options: ['start', 'centre'],
      description: 'Where the text sits.',
      table: { category: 'Appearance' },
    },
    children: {
      control: false,
      description: 'HeroContent, and optionally HeroMedia.',
      table: { category: 'Content' },
    },
    labelledBy: {
      control: 'text',
      description: '`id` of the HeroTitle. Required for the hero to be a landmark.',
      table: { category: 'Accessibility' },
    },
    className: { table: { disable: true } },
    innerClassName: { table: { disable: true } },
  },
} satisfies Meta<typeof Hero>

export default meta

type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const hero = canvasElement.querySelector<HTMLElement>('[data-slot="hero"]')
    if (!hero) {
      throw new Error('Could not find an element with [data-slot="hero"].')
    }
    if (hero.tagName !== 'SECTION') {
      throw new Error(`Expected a <section> element, received <${hero.tagName.toLowerCase()}>.`)
    }
    const labelledBy = hero.getAttribute('aria-labelledby')
    if (labelledBy !== 'demo-hero-title') {
      throw new Error(`Expected aria-labelledby="demo-hero-title", received "${labelledBy}".`)
    }
    const title = hero.ownerDocument.getElementById('demo-hero-title')
    if (!title || title.tagName !== 'H1') {
      throw new Error('aria-labelledby does not point at the h1 HeroTitle.')
    }
  },
}

export const Playground: Story = {}
