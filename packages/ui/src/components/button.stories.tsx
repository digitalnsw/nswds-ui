import { IconPlus, IconTrash } from "@tabler/icons-react"
import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect } from "storybook/test"

import { Button } from "./button"

const meta = {
  title: "Components/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "outline", "secondary", "ghost", "destructive", "link"],
    },
    size: {
      control: "select",
      options: ["xs", "sm", "default", "lg", "icon-xs", "icon-sm", "icon", "icon-lg"],
    },
    disabled: { control: "boolean" },
    children: { control: "text" },
  },
  args: {
    children: "Button",
    disabled: false,
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas }) => {
    const button = canvas.getByRole("button", { name: /button/i })
    // Proves the button is interactive (not disabled) — not just that it mounted.
    await expect(button).not.toHaveAttribute("aria-disabled", "true")
    await expect(button).toBeEnabled()
  },
}

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="default">Default</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-end gap-2">
      <Button size="xs">Extra small</Button>
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
}

export const WithIcon: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Button>
        <IconPlus data-icon="inline-start" />
        Add item
      </Button>
      <Button variant="outline">
        <IconPlus data-icon="inline-start" />
        Add item
      </Button>
      <Button variant="destructive">
        <IconTrash data-icon="inline-start" />
        Delete
      </Button>
    </div>
  ),
}

export const IconOnly: Story = {
  render: () => (
    <div className="flex flex-wrap items-end gap-2">
      <Button size="icon-xs" variant="outline" aria-label="Add item">
        <IconPlus />
      </Button>
      <Button size="icon-sm" variant="outline" aria-label="Add item">
        <IconPlus />
      </Button>
      <Button size="icon" aria-label="Add item">
        <IconPlus />
      </Button>
      <Button size="icon-lg" aria-label="Add item">
        <IconPlus />
      </Button>
    </div>
  ),
}

export const Disabled: Story = {
  args: {
    disabled: true,
  },
  play: async ({ canvas }) => {
    const button = canvas.getByRole("button", { name: /button/i })
    await expect(button).toBeDisabled()
  },
}

// CssCheck — the only one in the project.
// The Button CVA root applies `font-medium` (→ font-weight: 500).
// If the shared preview failed to load globals.css / Tailwind, this
// would fall back to the browser default (400) and the assertion fails.
export const CssCheck: Story = {
  args: { children: "CSS check" },
  play: async ({ canvas }) => {
    const button = canvas.getByRole("button", { name: /css check/i })
    await expect(getComputedStyle(button).fontWeight).toBe("500")
  },
}
