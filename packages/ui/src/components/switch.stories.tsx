/**
 * Switch — Default, Variants, CssCheck
 *
 * An on/off toggle built on the Base UI Switch primitive — the `switch` role,
 * keyboard toggling and focus come from there. We style the track and thumb,
 * and add a `size` variant (`sm` | `default`).
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from './field.js'
import { Input } from './input.js'
import { Switch } from './switch.js'

const meta = {
  title: 'Components/Switch',
  component: Switch,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      // Inline autodocs stories share documentElement. Stories with fixed
      // globals would repaint the entire docs page as they mount.
      page: () => <SwitchDocs />,
      description: {
        component:
          'A 32px NSW switch for an on/off setting that applies straight away. The thumb is a hollow ring when off and a solid thumb with a tick when on, so the state reads by shape as well as colour. It has a 44px hit area and Checkbox’s theme-aware ink. Base UI owns the `switch` role, keyboard toggling and form submission. Compose with Field and FieldLabel for a visible label; set Field invalid to share the error treatment used by Input.',
      },
    },
  },
} satisfies Meta<typeof Switch>

export default meta

type Story = StoryObj<typeof meta>

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: (args) => (
    <Field orientation='horizontal' className='min-h-11 gap-4'>
      <Switch {...args} />
      <FieldLabel className='font-normal'>Email updates</FieldLabel>
    </Field>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Base UI owns the ARIA — assert it arrived rather than re-implementing it.
    const control = canvas.getByRole('switch', { name: 'Email updates' })
    await expect(control).toHaveAttribute('aria-checked', 'false')
    await expect(control.querySelector('svg')).toBeNull()

    // Toggling is inherited, not hand-rolled — prove it with a real click on
    // the label, then with the keyboard.
    await userEvent.click(canvas.getByText('Email updates'))
    await expect(control).toHaveAttribute('aria-checked', 'true')
    await expect(control.querySelector('svg')).not.toBeNull()
    control.focus()
    await userEvent.keyboard('[Space]')
    await expect(control).toHaveAttribute('aria-checked', 'false')
    await expect(control).toHaveFocus()
  },
}

const states = [
  { label: 'Off' },
  { label: 'On', defaultChecked: true },
  { label: 'Disabled off', disabled: true },
  { label: 'Disabled on', disabled: true, defaultChecked: true },
  { label: 'Invalid off', 'aria-invalid': true },
  { label: 'Invalid on', 'aria-invalid': true, defaultChecked: true },
] as const

function SwitchStates({ size }: { size?: 'sm' | 'default' }) {
  return (
    <div className='grid max-w-xl grid-cols-1 gap-x-10 gap-y-4 sm:grid-cols-2'>
      {states.map(({ label, ...props }) => (
        <Field
          key={label}
          orientation='horizontal'
          className='min-h-11 gap-4'
          disabled={'disabled' in props && props.disabled}
        >
          <Switch size={size} {...props} />
          <FieldLabel className='font-normal'>{label}</FieldLabel>
        </Field>
      ))}
    </div>
  )
}

export const Variants: Story = {
  render: () => (
    <div className='grid gap-10'>
      <SwitchStates />
      <SwitchStates size='sm' />
    </div>
  ),
}

export const DarkVariants: Story = {
  ...Variants,
  globals: { theme: 'dark' },
}

function SettingsList() {
  const rows = [
    {
      name: 'Email updates',
      description: 'Get an email when your application status changes.',
      defaultChecked: true,
    },
    { name: 'SMS reminders', description: 'We will text you 2 days before your appointment.' },
    {
      name: 'Share usage data',
      description: 'Available after you verify your mobile number.',
      disabled: true,
    },
  ]
  return (
    <div className='w-full max-w-xl divide-y divide-border border-y border-border'>
      {rows.map(({ name, description, ...props }) => (
        <Field
          key={name}
          orientation='horizontal'
          className='justify-between gap-6 py-5'
          disabled={props.disabled}
        >
          <FieldContent>
            <FieldLabel>{name}</FieldLabel>
            <FieldDescription>{description}</FieldDescription>
          </FieldContent>
          <Switch {...props} />
        </Field>
      ))}
    </div>
  )
}

export const WithField: Story = {
  render: () => (
    <div className='grid w-xl max-w-full gap-10'>
      <SettingsList />
      <Field orientation='horizontal' className='gap-4' invalid>
        <Switch />
        <FieldContent className='pt-1'>
          <FieldLabel className='font-normal'>Two-step verification</FieldLabel>
          <FieldError>Turn on two-step verification. Staff accounts need it.</FieldError>
        </FieldContent>
      </Field>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const updates = canvas.getByRole('switch', { name: 'Email updates' })
    await expect(updates).toHaveAccessibleDescription(
      'Get an email when your application status changes.',
    )
    const invalid = canvas.getByRole('switch', { name: 'Two-step verification' })
    await expect(invalid).toHaveAttribute('aria-invalid', 'true')
    await expect(invalid).toHaveAccessibleDescription(
      'Turn on two-step verification. Staff accounts need it.',
    )
    // Disabled reads through colour, not opacity, and cannot be toggled.
    const disabled = canvas.getByRole('switch', { name: 'Share usage data' })
    await expect(disabled).toHaveAttribute('data-disabled')
    await userEvent.click(disabled)
    await expect(disabled).toHaveAttribute('aria-checked', 'false')
    await expect(getComputedStyle(disabled).opacity).toBe('1')
  },
}

export const FormSubmission: Story = {
  render: () => (
    <form className='grid gap-4'>
      <Field orientation='horizontal' className='min-h-11 gap-4'>
        <Switch name='updates' value='email' />
        <FieldLabel className='font-normal'>Email updates</FieldLabel>
      </Field>
      <Field orientation='horizontal' className='min-h-11 gap-4'>
        <Switch defaultChecked readOnly />
        <FieldLabel className='font-normal'>Read only</FieldLabel>
      </Field>
    </form>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const form = canvasElement.querySelector('form')!
    const control = canvas.getByRole('switch', { name: 'Email updates' })
    await expect(new FormData(form).has('updates')).toBe(false)
    await userEvent.click(control)
    await expect(new FormData(form).get('updates')).toBe('email')
    const readOnly = canvas.getByRole('switch', { name: 'Read only' })
    await userEvent.click(readOnly)
    await expect(readOnly).toHaveAttribute('aria-checked', 'true')
  },
}

function SwitchDocs() {
  return (
    <div className='max-w-3xl space-y-8 text-foreground'>
      <section className='space-y-3'>
        <h1 className='text-4xl font-bold tracking-normal'>Switch</h1>
        <p className='text-base text-muted-foreground'>
          A switch turns a single setting on or off, and the change applies straight away. For a
          choice that is only sent with a form, or one someone must agree to, use a checkbox.
        </p>
      </section>

      <section className='space-y-4'>
        <h2 className='text-2xl font-bold tracking-normal'>Default</h2>
        <Field orientation='horizontal' className='min-h-11 gap-4'>
          <Switch />
          <FieldLabel className='font-normal'>Email updates</FieldLabel>
        </Field>
        <pre className='overflow-x-auto rounded-sm bg-muted p-4 text-base'>
          <code>{`import { Field, FieldLabel, Switch } from '@nswds/ui'

<Field orientation="horizontal" className="min-h-11 gap-4">
  <Switch name="updates" />
  <FieldLabel className="font-normal">Email updates</FieldLabel>
</Field>`}</code>
        </pre>
      </section>

      <section className='space-y-4'>
        <h2 className='text-2xl font-bold tracking-normal'>States</h2>
        <p className='text-base text-muted-foreground'>
          Use the theme toolbar to preview the selected primary palette in light or dark mode.
          Invalid switches use the same danger colours as other form elements. The small size is
          24px tall and keeps the 44px hit area.
        </p>
        <SwitchStates />
        <SwitchStates size='sm' />
      </section>

      <section className='space-y-4'>
        <h2 className='text-2xl font-bold tracking-normal'>In a settings list</h2>
        <p className='text-base text-muted-foreground'>
          Put the label and description first and the switch at the end of the row. The label stays
          the target, so the whole row can be pressed.
        </p>
        <SettingsList />
      </section>
    </div>
  )
}

// Compare resolved colours, so these assertions follow consumer token overrides.
function tokenColour(element: HTMLElement, token: string) {
  const probe = document.createElement('span')
  probe.style.color = `var(${token})`
  element.append(probe)
  const colour = getComputedStyle(probe).color
  probe.remove()
  return colour
}

const geometry = {
  default: { width: 56, height: 32, thumb: 22, inset: 5, icon: 18 },
  sm: { width: 40, height: 24, thumb: 16, inset: 4, icon: 12 },
} as const

export const CssCheck: Story = {
  name: 'CssCheck',
  render: () => (
    <div className='grid gap-6'>
      {(['default', 'sm'] as const).flatMap((size) =>
        states.map(({ label, ...props }) => (
          <Switch key={`${size} ${label}`} aria-label={`${size} ${label}`} size={size} {...props} />
        )),
      )}
      <Input aria-label='Invalid input reference' aria-invalid />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('textbox')
    const dark = document.documentElement.classList.contains('dark')

    for (const size of ['default', 'sm'] as const) {
      const expected = geometry[size]
      for (const { label } of states) {
        const control = canvas.getByRole('switch', { name: `${size} ${label}` })
        const on = label.endsWith(' on') || label === 'On'
        const box = control.getBoundingClientRect()
        await expect(box.width).toBe(expected.width)
        await expect(box.height).toBe(expected.height)
        await expect(getComputedStyle(control, '::after').height).toBe('44px')
        await expect(Number.parseFloat(getComputedStyle(control, '::after').width)).toBe(
          Math.max(expected.width, 44),
        )

        // The thumb sits at the Checkbox inset and travels to the far inset.
        const thumb = control.querySelector<HTMLElement>('[data-slot="switch-thumb"]')!
        await waitFor(() => {
          const t = thumb.getBoundingClientRect()
          expect(t.width).toBe(expected.thumb)
          expect(t.y + t.height / 2).toBe(box.y + box.height / 2)
          expect(on ? box.right - t.right : t.x - box.x).toBe(expected.inset)
        })

        // State by shape: only the on thumb carries the tick.
        const icon = thumb.querySelector('svg')
        if (on) {
          await expect(icon).not.toBeNull()
          await expect(icon!.getBoundingClientRect().width).toBe(expected.icon)
        } else {
          await expect(icon).toBeNull()
        }

        const ink = label.startsWith('Invalid')
          ? '--danger-solid'
          : label.startsWith('Disabled')
            ? '--text-subtle'
            : dark
              ? '--color-primary-200'
              : '--color-primary-800'
        if (on) {
          await expect(getComputedStyle(control).backgroundColor).toBe(tokenColour(control, ink))
          await expect(getComputedStyle(thumb).backgroundColor).toBe(
            tokenColour(control, label.startsWith('Invalid') ? '--white' : '--surface-default'),
          )
          await expect(getComputedStyle(thumb).color).toBe(tokenColour(control, ink))
        } else {
          // The off track keeps its full-contrast hairline; the old one was a
          // border-default fill at 1.34:1 against the page.
          await expect(getComputedStyle(control).borderTopColor).toBe(
            label.startsWith('Invalid')
              ? getComputedStyle(input).borderTopColor
              : tokenColour(
                  control,
                  label.startsWith('Disabled') ? '--text-subtle' : '--text-default',
                ),
          )
          await expect(getComputedStyle(thumb).backgroundColor).toBe(
            tokenColour(control, '--input-surface'),
          )
          await expect(getComputedStyle(thumb).boxShadow).not.toBe('none')
          if (label.startsWith('Invalid')) {
            // Border plus a 1px inset ring: Input's 2px invalid edge.
            await expect(getComputedStyle(control).boxShadow).not.toBe('none')
          }
        }
        await expect(getComputedStyle(control).opacity).toBe('1')
      }
    }

    // Establish keyboard modality, then focus the control to inspect the real ring.
    await userEvent.tab()
    const plain = canvas.getByRole('switch', { name: 'default On' })
    plain.focus()
    await expect(plain).toHaveFocus()
    await expect(getComputedStyle(plain).outlineStyle).toBe('solid')
    await expect(getComputedStyle(plain).outlineWidth).toBe('2px')
    await expect(getComputedStyle(plain).outlineOffset).toBe('3px')

    const invalid = canvas.getByRole('switch', { name: 'default Invalid on' })
    invalid.focus()
    await expect(getComputedStyle(invalid).outlineOffset).toBe('2px')
    const focusColour = tokenColour(invalid, '--input-invalid-ring')
    await waitFor(() => expect(getComputedStyle(invalid).outlineColor).toBe(focusColour))
  },
}

export const DarkCssCheck: Story = {
  ...CssCheck,
  globals: { theme: 'dark' },
}

export const BrandThemeCssCheck: Story = {
  ...CssCheck,
  globals: { theme: 'light', themeCategory: 'brand', themePrimary: 'purple' },
}

export const DarkBrandThemeCssCheck: Story = {
  ...CssCheck,
  globals: { theme: 'dark', themeCategory: 'brand', themePrimary: 'purple' },
}
