/**
 * Field — Features
 *
 * Composition matrices and state stories for the Field wrapper. These stories
 * cover the full surface of Field's orientation prop, the FieldError display
 * patterns, and grouping via FieldSet/FieldLegend, FieldGroup, and
 * FieldSeparator.
 *
 * Stories are intended for internal use during design QA and CSS refactors:
 * each renders multiple Field configurations side-by-side so regressions in
 * spacing, orientation, or error styling are easy to spot in visual diffs.
 *
 * Accessibility-specific assertions live in field.accessibility.stories.tsx.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from './field.js'
import { Input } from './input.js'
import { docsTemplate } from './story-helpers.js'

const meta = {
  title: 'Components/Field/Features',
  component: Field,
  parameters: {
    layout: 'padded',
  },
  args: {
    orientation: 'vertical',
  },
} satisfies Meta<typeof Field>

export default meta

type Story = StoryObj<typeof meta>

// ─── Orientations ─────────────────────────────────────────────────────────────

export const Orientations: Story = {
  name: 'Orientations',
  parameters: {
    docs: {
      description: {
        story: docsTemplate({
          what: 'Side-by-side rendering of all three orientation values (vertical, horizontal, responsive) so the layout differences can be compared at a glance.',
          why: 'Orientation drives spacing, label width, and wrapping behaviour across every Field instance — visual parity across orientations is essential for consistent forms.',
          how: 'Compare the label-to-control alignment in each row. Vertical stacks them, horizontal places them inline, and responsive wraps at the @md breakpoint of the parent container.',
          caveat:
            'Responsive orientation depends on a FieldGroup ancestor with @container/field-group; outside that context it behaves the same as vertical.',
        }),
      },
    },
  },
  render: () => (
    <div className="w-full max-w-2xl space-y-8">
      <section className="space-y-2">
        <p className="text-foreground text-sm font-semibold">Vertical</p>
        <Field orientation="vertical">
          <FieldLabel htmlFor="features-vertical">Email</FieldLabel>
          <Input
            id="features-vertical"
            type="email"
            placeholder="you@example.com"
          />
          <FieldDescription>
            We&apos;ll never share your email.
          </FieldDescription>
        </Field>
      </section>

      <section className="space-y-2">
        <p className="text-foreground text-sm font-semibold">Horizontal</p>
        <Field orientation="horizontal">
          <FieldLabel htmlFor="features-horizontal">Email</FieldLabel>
          <Input
            id="features-horizontal"
            type="email"
            placeholder="you@example.com"
          />
        </Field>
      </section>

      <section className="space-y-2">
        <p className="text-foreground text-sm font-semibold">Responsive</p>
        <FieldGroup>
          <Field orientation="responsive">
            <FieldLabel htmlFor="features-responsive">Email</FieldLabel>
            <Input
              id="features-responsive"
              type="email"
              placeholder="you@example.com"
            />
            <FieldDescription>
              Wraps to two columns above the @md breakpoint.
            </FieldDescription>
          </Field>
        </FieldGroup>
      </section>
    </div>
  ),
}

// ─── WithError ────────────────────────────────────────────────────────────────

export const WithError: Story = {
  name: 'With Error',
  parameters: {
    docs: {
      description: {
        story: docsTemplate({
          what: 'Two FieldError patterns: one fed by an errors array of objects, the other receiving error text as children. Both render in the destructive token colour and carry role="alert".',
          why: 'Forms display validation messages in two common shapes — array-of-objects from validation libraries (zod, react-hook-form) and inline strings from manual checks. The component supports both without code branches at the call site.',
          how: 'Compare the two fields — the array-driven field renders the message(s) automatically, deduplicating by message text. The children-driven field renders whatever is passed.',
          caveat:
            'FieldError returns null when both errors and children are empty, so it can be left mounted unconditionally. Multiple distinct error messages render as a bulleted list.',
        }),
      },
    },
  },
  render: () => (
    <div className="w-full max-w-2xl space-y-8">
      <Field>
        <FieldLabel htmlFor="features-error-array">Email</FieldLabel>
        <Input
          id="features-error-array"
          type="email"
          defaultValue="not-an-email"
          aria-invalid="true"
        />
        <FieldError
          errors={[
            { message: 'Please enter a valid email address.' },
            { message: 'Email is required.' },
          ]}
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="features-error-children">Postcode</FieldLabel>
        <Input
          id="features-error-children"
          defaultValue="abc"
          aria-invalid="true"
        />
        <FieldError>Postcode must be 4 digits.</FieldError>
      </Field>
    </div>
  ),
}

// ─── FieldSet + FieldLegend ───────────────────────────────────────────────────

export const FieldSetWithLegend: Story = {
  name: 'FieldSet with Legend',
  parameters: {
    docs: {
      description: {
        story: docsTemplate({
          what: 'FieldSet wraps related Fields under a shared FieldLegend, demonstrating both legend variants (legend and label) and showing several Fields nested inside.',
          why: 'Grouping related controls under a legend gives them a single programmatic name in the accessibility tree — required for radio groups, checkbox groups, and any logical sub-section of a form.',
          how: 'Inspect the rendered fieldset element: it carries data-slot="field-set" and contains a <legend> with data-slot="field-legend". Both legend variants now render at text-sm (14px); the variant prop changes the line-height — `legend` uses the default leading, `label` uses the relaxed leading to match FieldLabel-style spacing.',
          caveat:
            'FieldLegend must be a direct child of <fieldset> — placing it elsewhere breaks the native legend association even though the visual styling still applies.',
        }),
      },
    },
  },
  render: () => (
    <div className="w-full max-w-2xl space-y-8">
      <FieldSet>
        <FieldLegend>Personal details</FieldLegend>
        <Field>
          <FieldLabel htmlFor="features-set-name">Full name</FieldLabel>
          <Input id="features-set-name" placeholder="Jane Citizen" />
        </Field>
        <Field>
          <FieldLabel htmlFor="features-set-email">Email</FieldLabel>
          <Input
            id="features-set-email"
            type="email"
            placeholder="you@example.com"
          />
        </Field>
      </FieldSet>

      <FieldSet>
        <FieldLegend variant="label">Contact preferences</FieldLegend>
        <FieldDescription>
          Choose how you would like us to contact you.
        </FieldDescription>
        <Field>
          <FieldLabel htmlFor="features-set-tel">Phone number</FieldLabel>
          <Input id="features-set-tel" type="tel" placeholder="0400 000 000" />
        </Field>
      </FieldSet>
    </div>
  ),
}

// ─── FieldGroup ───────────────────────────────────────────────────────────────

export const FieldGroupComposition: Story = {
  name: 'Field Group',
  parameters: {
    docs: {
      description: {
        story: docsTemplate({
          what: 'FieldGroup wrapping several Fields with a FieldSeparator splitting the group into logical sections. The separator can optionally carry label text rendered against the surrounding background.',
          why: 'Long forms benefit from visual separators between conceptual chunks. FieldGroup also provides the @container context that responsive Field orientation depends on.',
          how: 'Resize the viewport — responsive Fields inside the group flip from stacked to side-by-side at the @md breakpoint. Inspect the separator: data-slot="field-separator" with data-content="true" when label text is present.',
          caveat:
            'FieldSeparator uses negative top/bottom margins to compensate for FieldGroup gap; expect the separator height to overlap the gap rather than add to it.',
        }),
      },
    },
  },
  render: () => (
    <div className="w-full max-w-2xl">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="features-group-name">Full name</FieldLabel>
          <Input id="features-group-name" placeholder="Jane Citizen" />
        </Field>
        <Field>
          <FieldLabel htmlFor="features-group-email">Email</FieldLabel>
          <Input
            id="features-group-email"
            type="email"
            placeholder="you@example.com"
          />
        </Field>

        <FieldSeparator>Address</FieldSeparator>

        <Field>
          <FieldLabel htmlFor="features-group-street">Street</FieldLabel>
          <Input id="features-group-street" placeholder="123 George St" />
        </Field>
        <Field>
          <FieldLabel htmlFor="features-group-postcode">Postcode</FieldLabel>
          <Input id="features-group-postcode" placeholder="2000" />
        </Field>

        <FieldSeparator />

        <Field>
          <FieldLabel htmlFor="features-group-notes">Notes</FieldLabel>
          <Input id="features-group-notes" placeholder="Optional" />
        </Field>
      </FieldGroup>
    </div>
  ),
}

// ─── States ──────────────────────────────────────────────────────────────────

export const States: Story = {
  name: 'States',
  parameters: {
    docs: {
      description: {
        story: docsTemplate({
          what: 'Field rendered in default, disabled (via data-disabled on the wrapper), and invalid (via data-invalid on the wrapper) states so the visual treatment of each can be reviewed side-by-side.',
          why: 'Field forwards its disabled and invalid state to descendant FieldLabel and FieldDescription via group selectors — confirming both labels and descriptions visually reflect the state is critical to avoid silent regressions during token refactors.',
          how: 'Compare the three rows: the disabled row should show reduced opacity on the label, and the invalid row should turn the wrapper text destructive. Inspect data-disabled and data-invalid attributes on the wrapping div.',
          caveat:
            'data-disabled and data-invalid are styling hooks only — the Input element itself must still receive native disabled and aria-invalid attributes for assistive tech and form submission to behave correctly.',
        }),
      },
    },
  },
  render: () => (
    <div className="w-full max-w-2xl space-y-8">
      <section className="space-y-2">
        <p className="text-foreground text-sm font-semibold">Default</p>
        <Field>
          <FieldLabel htmlFor="features-state-default">Email</FieldLabel>
          <Input
            id="features-state-default"
            type="email"
            placeholder="you@example.com"
          />
          <FieldDescription>
            We&apos;ll never share your email.
          </FieldDescription>
        </Field>
      </section>

      <section className="space-y-2">
        <p className="text-foreground text-sm font-semibold">Disabled</p>
        <Field data-disabled="true">
          <FieldLabel htmlFor="features-state-disabled">Email</FieldLabel>
          <Input
            id="features-state-disabled"
            type="email"
            placeholder="you@example.com"
            disabled
          />
          <FieldDescription>
            We&apos;ll never share your email.
          </FieldDescription>
        </Field>
      </section>

      <section className="space-y-2">
        <p className="text-foreground text-sm font-semibold">Invalid</p>
        <Field data-invalid="true">
          <FieldLabel htmlFor="features-state-invalid">Email</FieldLabel>
          <Input
            id="features-state-invalid"
            type="email"
            defaultValue="not-an-email"
            aria-invalid="true"
          />
          <FieldError>Please enter a valid email address.</FieldError>
        </Field>
      </section>
    </div>
  ),
}
