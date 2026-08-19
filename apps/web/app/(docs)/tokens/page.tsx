import type { Metadata } from 'next'

import { CodeBlock } from '@/components/code-block'

export const metadata: Metadata = {
  title: 'Design tokens',
  description:
    'The token architecture behind NSW Digital UI — the NSW palette, masterbrand theme roles and semantic component tokens, in light and dark mode.',
}

const rampSteps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]

const brandRamps = [
  { name: 'primary', note: 'NSW brand blue — the interactive family' },
  { name: 'grey', note: 'Neutral surfaces and text' },
  { name: 'accent', note: 'Waratah red — sparing emphasis only' },
]

const statusRamps = [
  { name: 'success', note: 'Positive outcomes and confirmations' },
  { name: 'info', note: 'Neutral supporting information' },
  { name: 'warning', note: 'Caution states' },
  { name: 'danger', note: 'Errors and destructive actions' },
]

const semanticTokens = [
  { token: '--background', utility: 'bg-background', note: 'The page surface' },
  { token: '--foreground', utility: 'text-foreground', note: 'Default text ink' },
  { token: '--primary', utility: 'bg-primary', note: 'Primary interactive fill' },
  { token: '--secondary', utility: 'bg-secondary', note: 'Secondary surface' },
  { token: '--muted', utility: 'bg-muted', note: 'Recessed panels and rails' },
  { token: '--accent', utility: 'bg-accent', note: 'Hover / highlight surface' },
  { token: '--destructive', utility: 'bg-destructive', note: 'Dangerous actions' },
  { token: '--border', utility: 'border-border', note: 'Hairlines and rules' },
  { token: '--ring', utility: 'ring-ring', note: 'Focus indicators' },
  { token: '--card', utility: 'bg-card', note: 'Raised card surface' },
  { token: '--popover', utility: 'bg-popover', note: 'Floating panel surface' },
]

function Ramp({ name }: { name: string }) {
  return (
    <ol className='flex overflow-hidden rounded-md ring-1 ring-foreground/10'>
      {rampSteps.map((step) => (
        <li key={step} className='group flex min-w-0 flex-1 flex-col'>
          <span
            className='h-12'
            style={{ backgroundColor: `var(--${name}-${step})` }}
            title={`--${name}-${step}`}
          />
          <span className='bg-background py-1 text-center font-mono text-[10px] text-muted-foreground max-sm:hidden'>
            {step}
          </span>
        </li>
      ))}
    </ol>
  )
}

export default function TokensPage() {
  return (
    <div className='py-10'>
      <p className='text-sm font-bold tracking-wide text-accent-600 uppercase dark:text-accent-200'>
        Foundations
      </p>
      <h1 className='mt-2 text-4xl font-bold sm:text-5xl'>Design tokens</h1>
      <p className='mt-4 max-w-2xl text-base/7 text-muted-foreground'>
        Every visual property in the system traces back to a CSS custom property. Components never
        hardcode a colour — they reference <em>semantic</em> tokens, which resolve through the
        masterbrand theme onto the NSW palette from{' '}
        <code className='font-mono text-sm'>@nswds/tokens</code>. Toggle dark mode in the header to
        watch this page re-resolve.
      </p>

      <section className='mt-12'>
        <h2 className='text-2xl font-bold'>Brand palette</h2>
        <p className='mt-2 max-w-2xl text-base/7 text-muted-foreground'>
          Nineteen-step oklch ramps (50–950, with intermediate 50s not shown). Palette steps are
          theme-invariant — dark mode remaps the <em>semantic</em> layer, not these values.
        </p>
        <div className='mt-6 flex flex-col gap-8'>
          {brandRamps.map((ramp) => (
            <div key={ramp.name}>
              <div className='mb-2 flex items-baseline justify-between gap-4'>
                <h3 className='font-mono text-sm font-bold'>--{ramp.name}-*</h3>
                <p className='text-sm text-muted-foreground'>{ramp.note}</p>
              </div>
              <Ramp name={ramp.name} />
            </div>
          ))}
        </div>
      </section>

      <section className='mt-12'>
        <h2 className='text-2xl font-bold'>Status palette</h2>
        <div className='mt-6 flex flex-col gap-8'>
          {statusRamps.map((ramp) => (
            <div key={ramp.name}>
              <div className='mb-2 flex items-baseline justify-between gap-4'>
                <h3 className='font-mono text-sm font-bold'>--{ramp.name}-*</h3>
                <p className='text-sm text-muted-foreground'>{ramp.note}</p>
              </div>
              <Ramp name={ramp.name} />
            </div>
          ))}
        </div>
      </section>

      <section className='mt-12'>
        <h2 className='text-2xl font-bold'>Semantic tokens</h2>
        <p className='mt-2 max-w-2xl text-base/7 text-muted-foreground'>
          The layer components actually reference. Each name maps a <em>role</em> onto the palette
          and re-resolves in dark mode, so component code never changes between themes.
        </p>
        <ul className='mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3'>
          {semanticTokens.map(({ token, utility, note }) => (
            <li
              key={token}
              className='flex items-center gap-4 rounded-md bg-card p-3 ring-1 ring-foreground/10'
            >
              <span
                className='size-12 shrink-0 rounded-md ring-1 ring-foreground/15'
                style={{ backgroundColor: `var(${token})` }}
              />
              <span className='flex min-w-0 flex-col'>
                <code className='truncate font-mono text-sm font-bold'>{utility}</code>
                <span className='truncate text-xs text-muted-foreground'>
                  {token} — {note}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className='mt-12'>
        <h2 className='text-2xl font-bold'>The rule</h2>
        <p className='mt-2 max-w-2xl text-base/7 text-muted-foreground'>
          Components only ever reference semantic tokens — never raw Tailwind palette colours, never
          hex values. NSW primitive utilities are reserved for brand-specific artwork like the logo.
        </p>
        <CodeBlock
          className='mt-4 max-w-2xl'
          label='component.tsx'
          code={`// Correct — semantic token\n'bg-primary text-primary-foreground hover:bg-primary/80'\n\n// Correct — NSW primitive, for brand artwork only\n'fill-nsw-blue-800 dark:fill-white'\n\n// Wrong — raw Tailwind palette\n'bg-blue-600 text-white'\n\n// Wrong — hardcoded value\n'bg-[#0055a4]'`}
        />
      </section>
    </div>
  )
}
