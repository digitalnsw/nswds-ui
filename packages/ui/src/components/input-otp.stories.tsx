/**
 * InputOTP — the story set, per docs/reference-storybook-standard.md.
 *
 *   Components/InputOTP               → this file: Docs, Default, Playground
 *   Components/InputOTP/Features      → input-otp.features.stories.tsx
 *   Components/InputOTP/Accessibility → input-otp.accessibility.stories.tsx
 *   Components/InputOTP/Tests         → input-otp.tests.stories.tsx (hidden)
 *
 * The docs page's sections are exported (and kept out of the story index by
 * `excludeStories`) so the Features stories render the same examples.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { REGEXP_ONLY_DIGITS, REGEXP_ONLY_DIGITS_AND_CHARS } from 'input-otp'
import { expect, userEvent } from 'storybook/test'

import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from './input-otp.js'
import { Label } from './label.js'
import {
  DocsApi,
  DocsPage,
  DocsUsage,
  Example,
  ExampleCell,
  ExampleSection,
} from './story-helpers.js'

/** `count` slots in one group, starting at `from`. */
function Slots({ count, from = 0, invalid }: { count: number; from?: number; invalid?: boolean }) {
  return (
    <InputOTPGroup>
      {Array.from({ length: count }, (_, i) => (
        <InputOTPSlot key={from + i} index={from + i} aria-invalid={invalid || undefined} />
      ))}
    </InputOTPGroup>
  )
}

// ─── Sections ─────────────────────────────────────────────────────────────────
// Each section is one part of the docs page AND one Features story.

export function StatesSection() {
  return (
    <ExampleSection
      title='States'
      description={
        <>
          <code>disabled</code> on <code>InputOTP</code> dims every slot. For a code that was not
          accepted, set <code>aria-invalid</code> on the slots and say what went wrong in text
          beside the field.
        </>
      }
    >
      <Example code={`<InputOTPSlot index={0} aria-invalid />`}>
        <ExampleCell label='default'>
          <InputOTP maxLength={6} aria-label='Verification code'>
            <Slots count={6} />
          </InputOTP>
        </ExampleCell>
        <ExampleCell label='disabled'>
          <InputOTP maxLength={6} aria-label='Verification code (disabled)' disabled>
            <Slots count={6} />
          </InputOTP>
        </ExampleCell>
        <ExampleCell label='invalid'>
          <InputOTP maxLength={6} aria-label='Verification code (invalid)' defaultValue='482913'>
            <Slots count={6} invalid />
          </InputOTP>
        </ExampleCell>
      </Example>
    </ExampleSection>
  )
}

export function GroupingSection() {
  return (
    <ExampleSection
      title='Grouping'
      description={
        <>
          <code>maxLength</code> sets how many characters the code takes; render one{' '}
          <code>InputOTPSlot</code> per character. Split a long code into <code>InputOTPGroup</code>
          s with an <code>InputOTPSeparator</code> so it is easier to check against the message it
          came in.
        </>
      }
    >
      <Example
        code={`<InputOTP maxLength={6} aria-label="Verification code">
  <InputOTPGroup>
    <InputOTPSlot index={0} />
    <InputOTPSlot index={1} />
    <InputOTPSlot index={2} />
  </InputOTPGroup>
  <InputOTPSeparator />
  <InputOTPGroup>
    <InputOTPSlot index={3} />
    <InputOTPSlot index={4} />
    <InputOTPSlot index={5} />
  </InputOTPGroup>
</InputOTP>`}
      >
        <ExampleCell label='4 characters'>
          <InputOTP maxLength={4} aria-label='4 digit code'>
            <Slots count={4} />
          </InputOTP>
        </ExampleCell>
        <ExampleCell label='6 characters'>
          <InputOTP maxLength={6} aria-label='6 digit code'>
            <Slots count={6} />
          </InputOTP>
        </ExampleCell>
        <ExampleCell label='3 + 3 with separator'>
          <InputOTP maxLength={6} aria-label='6 digit code in two groups'>
            <Slots count={3} />
            <InputOTPSeparator />
            <Slots count={3} from={3} />
          </InputOTP>
        </ExampleCell>
      </Example>
    </ExampleSection>
  )
}

export function PatternSection() {
  return (
    <ExampleSection
      title='Pattern'
      description={
        <>
          <code>pattern</code> is a regular expression every typed or pasted character must match;
          anything else is refused before it reaches a slot. <code>input-otp</code> exports the
          common ones. A digits-only pattern also brings up the number keypad on a phone.
        </>
      }
    >
      <Example
        code={`import { REGEXP_ONLY_DIGITS, REGEXP_ONLY_DIGITS_AND_CHARS } from 'input-otp'

<InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS}>…</InputOTP>`}
      >
        <ExampleCell label='REGEXP_ONLY_DIGITS'>
          <InputOTP maxLength={6} aria-label='Code, digits only' pattern={REGEXP_ONLY_DIGITS}>
            <Slots count={6} />
          </InputOTP>
        </ExampleCell>
        <ExampleCell label='REGEXP_ONLY_DIGITS_AND_CHARS'>
          <InputOTP
            maxLength={6}
            aria-label='Code, letters and digits'
            pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
          >
            <Slots count={6} />
          </InputOTP>
        </ExampleCell>
      </Example>
    </ExampleSection>
  )
}

export function InContextSection() {
  return (
    <ExampleSection
      title='In context'
      description={
        <>
          Confirming a mobile number during sign-up. A visible label is tied to the field with{' '}
          <code>id</code> and <code>htmlFor</code>, the hint says where the code was sent, and{' '}
          <code>pattern=&#123;REGEXP_ONLY_DIGITS&#125;</code> refuses anything but numbers.
        </>
      }
    >
      <Example
        code={`<Label htmlFor="otp">Enter your verification code</Label>
<p id="otp-hint">We sent a 6 digit code to the mobile number ending in 123.</p>
<InputOTP id="otp" aria-describedby="otp-hint" maxLength={6} pattern={REGEXP_ONLY_DIGITS}>
  …
</InputOTP>`}
      >
        <div className='w-full max-w-md space-y-3'>
          <Label htmlFor='otp-in-context'>Enter your verification code</Label>
          <p id='otp-in-context-hint' className='text-muted-foreground'>
            We sent a 6 digit code to the mobile number ending in 123. It expires in 10 minutes.
          </p>
          <InputOTP
            id='otp-in-context'
            aria-describedby='otp-in-context-hint'
            maxLength={6}
            pattern={REGEXP_ONLY_DIGITS}
          >
            <Slots count={3} />
            <InputOTPSeparator />
            <Slots count={3} from={3} />
          </InputOTP>
        </div>
      </Example>
    </ExampleSection>
  )
}

// ─── Docs page ────────────────────────────────────────────────────────────────

function InputOTPDocs() {
  return (
    <DocsPage
      title='InputOTP'
      npm={['InputOTP', 'InputOTPGroup', 'InputOTPSlot', 'InputOTPSeparator']}
      registry='input-otp'
      summary={
        <>
          InputOTP takes a one-time passcode, showing each character in its own slot. One real input
          sits underneath, so typing, pasting a whole code and the phone&apos;s &ldquo;from
          Messages&rdquo; suggestion all work as they would in an ordinary field.
        </>
      }
    >
      <DocsUsage
        use={[
          'Confirming a phone number or email address with a code you sent.',
          'A second step at sign-in, such as a code from an authenticator app.',
          'A short, fixed-length code printed on a letter, such as an activation code.',
        ]}
        avoid={[
          'A reference or licence number of variable length — use Input.',
          'A password or anything people choose themselves — use Input with type="password".',
          'A number people already know, like a postcode — use Input with inputMode="numeric".',
        ]}
      />
      <StatesSection />
      <GroupingSection />
      <PatternSection />
      <InContextSection />
      <DocsApi />
    </DocsPage>
  )
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Components/InputOTP',
  component: InputOTP,
  tags: ['autodocs'],
  excludeStories: /Section$/,
  parameters: {
    layout: 'padded',
    controls: { expanded: true },
    docs: { page: InputOTPDocs },
  },
  args: {
    maxLength: 6,
    'aria-label': 'One-time passcode',
    disabled: false,
    children: (
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    ),
  },
  argTypes: {
    children: {
      control: false,
      description: 'InputOTPGroup, InputOTPSlot and InputOTPSeparator elements.',
      table: { category: 'Content' },
    },
    maxLength: {
      control: 'number',
      description: 'How many characters the code takes. Render one slot per character.',
      table: { category: 'Behavior' },
    },
    pattern: {
      control: 'text',
      description: 'A regular expression each typed or pasted character must match.',
      table: { category: 'Behavior' },
    },
    disabled: {
      control: 'boolean',
      description: 'Removes the field from use.',
      table: { category: 'Behavior' },
    },
    onChange: {
      description: 'Called with the new value as it is typed.',
      table: { category: 'Events' },
    },
    onComplete: {
      description: 'Called with the value once every slot is filled.',
      table: { category: 'Events' },
    },
    'aria-label': {
      control: 'text',
      description: 'Accessible name when there is no visible label tied to the field.',
      table: { category: 'Accessibility' },
    },
    containerClassName: { table: { disable: true } },
    className: { table: { disable: true } },
  },
} satisfies Meta<typeof InputOTP>

export default meta

type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  play: async ({ canvasElement }) => {
    // input-otp renders one hidden <input> that owns the value, plus a slot
    // element per character cell. Target the input, not the visual slots.
    const input = canvasElement.querySelector<HTMLInputElement>('[data-slot="input-otp"]')
    if (!input) {
      throw new Error('Could not find [data-slot="input-otp"].')
    }
    await expect(input).toBeEnabled()

    const slots = canvasElement.querySelectorAll('[data-slot="input-otp-slot"]')
    await expect(slots).toHaveLength(6)

    // Typing must round-trip through the single hidden input.
    input.focus()
    await userEvent.keyboard('123456')
    await expect(input).toHaveValue('123456')
  },
}

export const Playground: Story = {}
