/**
 * Label — Features
 *
 * Demonstrates Label paired with the form controls it commonly names
 * (text inputs, checkboxes, radios), the required-indicator pattern, the
 * disabled state inherited from peer/ancestor controls, and truncation
 * behaviour inside constrained containers.
 *
 * Label has no variant/colour/size axes — these stories focus on
 * composition with other form controls and on visual states triggered by
 * surrounding markup (peer-disabled, group-data-disabled).
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { Label } from './label.js'
import { docsTemplate } from './story-helpers.js'

const meta = {
  title: 'Components/Label/Features',
  component: Label,
  parameters: {
    layout: 'padded',
  },
  args: {
    children: 'Email address',
  },
} satisfies Meta<typeof Label>

export default meta

type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

export const WithInput: Story = {
  name: 'With Input',
  parameters: {
    docs: {
      description: {
        story: docsTemplate({
          what: 'Label paired with a single-line text input via the htmlFor → id association so clicking the label focuses the input.',
          why: 'The htmlFor/id association is what gives the input its programmatic accessible name and what makes the label a 100% reliable hit target for pointer users.',
          how: 'Click the label text and verify the input below it gains focus; tab through and confirm a screen reader announces the label as the field name.',
          caveat:
            'Stories below use plain <input> elements rather than the @nswds/ui Input component so the Label component can be reviewed in isolation.',
        }),
      },
    },
  },
  render: () => (
    <div className="grid w-full max-w-sm gap-1.5">
      <Label htmlFor="label-features-input">Email address</Label>
      <input
        id="label-features-input"
        type="email"
        placeholder="you@example.com"
        className="h-9 rounded-sm border border-input bg-background px-3 text-sm"
      />
    </div>
  ),
}

export const WithRequiredIndicator: Story = {
  name: 'Required Indicator',
  parameters: {
    docs: {
      description: {
        story: docsTemplate({
          what: 'Label rendered with a trailing red asterisk to signal that the associated field is required for form submission.',
          why: 'A consistent required marker placement makes form scanning predictable; the asterisk is decorative so it should not be announced by assistive tech.',
          how: 'Verify the asterisk renders in the danger token colour and that it carries aria-hidden="true". The native required attribute on the input does the actual announcing.',
          caveat:
            'Some teams prefer "(required)" or "(optional)" text instead of an asterisk for clarity — use whichever convention your product team has adopted, and apply it consistently across every form.',
        }),
      },
    },
  },
  render: () => (
    <div className="grid w-full max-w-sm gap-1.5">
      <Label htmlFor="label-required-input">
        Full name
        <span aria-hidden="true" className="text-danger-600">
          *
        </span>
      </Label>
      <input
        id="label-required-input"
        type="text"
        required
        className="h-9 rounded-sm border border-input bg-background px-3 text-sm"
      />
    </div>
  ),
}

export const WithCheckboxAndRadio: Story = {
  name: 'With Checkbox and Radio',
  parameters: {
    docs: {
      description: {
        story: docsTemplate({
          what: 'Label wrapping a checkbox and label wrapping a radio input — the select-none and gap-2 utilities baked into the component keep the control and text aligned without extra wrappers.',
          why: 'Wrapping a checkbox or radio in its label gives the entire label area as a click/tap target, which is especially valuable on small screens.',
          how: 'Tap or click anywhere on the label row and confirm the control toggles. Verify the text does not get selected on rapid double-clicks (select-none).',
          caveat:
            'When wrapping the control, htmlFor is not strictly required since the implicit association is enough — but keeping htmlFor in place is harmless and helps when the markup is later refactored.',
        }),
      },
    },
  },
  render: () => (
    <div className="grid w-full max-w-sm gap-4">
      <div className="grid gap-2">
        <Label htmlFor="label-features-news">
          <input
            id="label-features-news"
            type="checkbox"
            className="size-4 rounded-sm border border-input"
          />
          Subscribe to the newsletter
        </Label>
        <Label htmlFor="label-features-terms">
          <input
            id="label-features-terms"
            type="checkbox"
            className="size-4 rounded-sm border border-input"
            defaultChecked
          />
          I agree to the terms of service
        </Label>
      </div>

      <fieldset className="grid gap-2">
        <legend className="text-xs/relaxed font-medium">
          Preferred contact
        </legend>
        <Label htmlFor="label-features-radio-email">
          <input
            id="label-features-radio-email"
            type="radio"
            name="label-features-contact"
            defaultChecked
            className="size-4 border border-input"
          />
          Email
        </Label>
        <Label htmlFor="label-features-radio-sms">
          <input
            id="label-features-radio-sms"
            type="radio"
            name="label-features-contact"
            className="size-4 border border-input"
          />
          SMS
        </Label>
      </fieldset>
    </div>
  ),
}

export const Disabled: Story = {
  name: 'Disabled',
  parameters: {
    docs: {
      description: {
        story: docsTemplate({
          what: 'Label paired with a disabled input; the peer-disabled utilities baked into the component dim the label to 50% opacity and switch the cursor to not-allowed.',
          why: 'Visually linking the disabled state of the label to the disabled state of the control reinforces that the entire field — not just the input — is currently unavailable.',
          how: 'Confirm the label opacity drops to ~0.5 when the input below carries the disabled attribute. Try hovering the label and verify the not-allowed cursor appears.',
          caveat:
            'The peer-disabled selector relies on the input being a previous sibling of the label inside the same parent. The group-data-[disabled=true] selector handles the same intent when the disabled state sits on an ancestor fieldset instead.',
        }),
      },
    },
  },
  render: () => (
    <div className="grid w-full max-w-sm gap-4">
      <div className="grid gap-1.5">
        <input
          id="label-features-disabled"
          type="text"
          disabled
          defaultValue="cannot edit"
          className="peer h-9 rounded-sm border border-input bg-background px-3 text-sm disabled:cursor-not-allowed disabled:opacity-50"
        />
        <Label htmlFor="label-features-disabled">Read-only field</Label>
      </div>

      <fieldset
        data-disabled="true"
        className="group grid gap-1.5 rounded-sm border border-border p-3"
      >
        <Label htmlFor="label-features-group-disabled">
          Group-disabled label
        </Label>
        <input
          id="label-features-group-disabled"
          type="text"
          disabled
          className="h-9 rounded-sm border border-input bg-background px-3 text-sm disabled:cursor-not-allowed disabled:opacity-50"
        />
      </fieldset>
    </div>
  ),
}

export const Truncated: Story = {
  name: 'Truncated',
  parameters: {
    docs: {
      description: {
        story: docsTemplate({
          what: 'Label rendered inside a narrow container with a long text value; the label uses truncate so overflow text is replaced with an ellipsis instead of wrapping.',
          why: 'Forms inside narrow drawers, sidebars, and table cells need a predictable single-line label height; truncation prevents layout jumps caused by occasionally-long labels.',
          how: 'Resize the viewport or narrow the container; confirm the long label text clips with an ellipsis and does not wrap or push the input out of view.',
          caveat:
            'Truncated labels still expose their full text to assistive technology via the underlying DOM textContent — visual truncation does not affect the accessible name.',
        }),
      },
    },
  },
  render: () => (
    <div className="grid w-full max-w-[14rem] gap-1.5">
      <Label htmlFor="label-features-truncated" className="truncate">
        Australian Business Number including the nine-digit identifier
      </Label>
      <input
        id="label-features-truncated"
        type="text"
        className="h-9 rounded-sm border border-input bg-background px-3 text-sm"
      />
    </div>
  ),
}
