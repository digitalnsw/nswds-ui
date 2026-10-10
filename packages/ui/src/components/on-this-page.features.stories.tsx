/**
 * OnThisPage — Features
 *
 * One story per section of the docs page, rendering the same examples, so a
 * feature can be opened on its own canvas.
 */

import type { Meta, StoryObj } from '@storybook/react-vite'

import { OnThisPage } from './on-this-page.js'
import {
  ControlledSection,
  InContextSection,
  StatesSection,
  VariantsSection,
} from './on-this-page.stories.js'

const meta = {
  title: 'Components/OnThisPage/Features',
  component: OnThisPage,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof OnThisPage>

export default meta

type Story = StoryObj<typeof meta>

export const Variants: Story = { render: () => <VariantsSection /> }

export const States: Story = { render: () => <StatesSection /> }

export const Controlled: Story = { render: () => <ControlledSection /> }

export const InContext: Story = { name: 'In context', render: () => <InContextSection /> }
