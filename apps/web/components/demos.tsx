'use client'

import {
  AspectRatio,
  Badge,
  BadgeLink,
  Button,
  ButtonLink,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  ExpandableSearch,
  ExpandableSearchField,
  ExternalLink,
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  Footer,
  Header,
  HeaderActions,
  HeaderBrand,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  Input,
  Label,
  LabeledSeparator,
  Link,
  Logo,
  MainNav,
  Masthead,
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
  PushMenu,
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
  ScrollArea,
  Separator,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SideNav,
  SiteSearch,
  SkipLink,
  Spinner,
  StepIndicator,
  ThemeSwitcher,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  type MainNavItem,
  type PushMenuItem,
  type SideNavItem,
  type Step,
} from '@nswds/ui'
import { IconAccessibility } from '@nswds/ui/icons/accessibility'
import { IconAdd } from '@nswds/ui/icons/add'
import { IconCall } from '@nswds/ui/icons/call'
import { IconCheckCircle } from '@nswds/ui/icons/check-circle'
import { IconCode } from '@nswds/ui/icons/code'
import { IconColors } from '@nswds/ui/icons/colors'
import { IconEast } from '@nswds/ui/icons/east'
import { IconError } from '@nswds/ui/icons/error'
import { IconInfo } from '@nswds/ui/icons/info'
import { IconMail } from '@nswds/ui/icons/mail'
import { IconPalette } from '@nswds/ui/icons/palette'
import { IconSearch } from '@nswds/ui/icons/search'
import { IconShapes } from '@nswds/ui/icons/shapes'
import { IconWarning } from '@nswds/ui/icons/warning'
import { IconWidgets } from '@nswds/ui/icons/widgets'
import type * as React from 'react'
import { toast } from 'sonner'

// ─── Shared sample data ───────────────────────────────────────────────────────

const mainNavSample: MainNavItem[] = [
  {
    title: 'Services',
    href: '#services',
    links: [
      { title: 'Apply for a licence', href: '#licence' },
      { title: 'Pay a fine', href: '#fine' },
      { title: 'Book an appointment', href: '#appointment' },
      { title: 'Check an application', href: '#application' },
      { title: 'Renew registration', href: '#rego' },
      { title: 'Report an issue', href: '#report' },
    ],
  },
  { title: 'About us', href: '#about' },
  { title: 'Contact', href: '#contact' },
]

const sideNavSample: SideNavItem[] = [
  {
    title: 'Getting started',
    links: [
      { title: 'Installation', href: '#installation' },
      { title: 'Design tokens', href: '#tokens' },
      {
        title: 'Guides',
        links: [
          { title: 'Theming', href: '#theming' },
          { title: 'Dark mode', href: '#dark-mode' },
        ],
      },
    ],
  },
]

const pushMenuSample: PushMenuItem[] = [
  {
    id: 'services',
    title: 'Services',
    links: [
      {
        id: 'transport',
        title: 'Transport',
        links: [
          { id: 'opal', title: 'Opal cards', href: '#opal' },
          { id: 'rego', title: 'Vehicle registration', href: '#rego' },
        ],
      },
      { id: 'grants', title: 'Grants and funding', href: '#grants' },
    ],
  },
  { id: 'about', title: 'About us', href: '#about' },
  { id: 'contact', title: 'Contact', href: '#contact' },
]

const journeySteps: Step[] = [
  {
    title: 'Your details',
    description: 'Name and contact information',
    href: '#your-details',
    status: 'completed',
  },
  { title: 'Eligibility', href: '#eligibility', status: 'saved' },
  {
    title: 'Documents',
    description: 'Upload supporting evidence',
    href: '#documents',
    status: 'in-progress',
  },
  { title: 'Review', href: '#review', status: 'not-started' },
  { title: 'Payment', href: '#payment', status: 'cannot-start' },
]

const curatedIcons = [
  ['Accessibility', IconAccessibility],
  ['Add', IconAdd],
  ['Call', IconCall],
  ['Check circle', IconCheckCircle],
  ['Code', IconCode],
  ['Colors', IconColors],
  ['East', IconEast],
  ['Error', IconError],
  ['Info', IconInfo],
  ['Mail', IconMail],
  ['Palette', IconPalette],
  ['Search', IconSearch],
  ['Shapes', IconShapes],
  ['Warning', IconWarning],
  ['Widgets', IconWidgets],
] as const

const semanticSwatches = [
  ['primary', '--primary'],
  ['background', '--background'],
  ['foreground', '--foreground'],
  ['muted', '--muted'],
  ['accent (surface)', '--accent'],
  ['border', '--border'],
  ['destructive', '--destructive'],
  ['ring', '--ring'],
] as const

// ─── Demos ────────────────────────────────────────────────────────────────────

const demos: Record<string, React.ReactNode> = {
  theme: (
    <ul className='grid w-full max-w-md grid-cols-2 gap-3 sm:grid-cols-4'>
      {semanticSwatches.map(([name, token]) => (
        <li key={name} className='flex flex-col gap-1.5'>
          <span
            className='h-14 rounded-md ring-1 ring-foreground/15'
            style={{ backgroundColor: `var(${token})` }}
          />
          <span className='font-mono text-xs text-muted-foreground'>{name}</span>
        </li>
      ))}
    </ul>
  ),

  icons: (
    <ul className='grid grid-cols-3 gap-4 sm:grid-cols-5'>
      {curatedIcons.map(([name, Icon]) => (
        <li key={name} className='flex flex-col items-center gap-2'>
          <span className='flex size-12 items-center justify-center rounded-md bg-muted text-foreground'>
            <Icon aria-hidden='true' className='size-6' />
          </span>
          <span className='text-xs text-muted-foreground'>{name}</span>
        </li>
      ))}
    </ul>
  ),

  logo: (
    <div className='flex flex-wrap items-center gap-8'>
      <Logo className='h-20 w-auto' />
      <span className='rounded-md bg-primary-800 p-4 dark:bg-primary-950'>
        <Logo logoType='reversed' className='h-20 w-auto' />
      </span>
    </div>
  ),

  masthead: <Masthead />,

  'skip-link': (
    <div className='relative w-full max-w-md overflow-hidden rounded-md border border-border bg-background'>
      <SkipLink href='#skip-link-demo-target'>Skip to content</SkipLink>
      <p id='skip-link-demo-target' className='px-4 py-10 text-sm text-muted-foreground'>
        Click here, then press <kbd className='rounded-sm border border-border px-1'>Tab</kbd> — the
        skip link slides in above this box when it receives keyboard focus.
      </p>
    </div>
  ),

  header: (
    <Header sticky={false} shadow={false}>
      <HeaderBrand sitename='Service name' version='1.0.0' />
      <HeaderActions>
        <ThemeSwitcher />
      </HeaderActions>
    </Header>
  ),

  footer: (
    <Footer
      color='primary-800'
      legalLinks={[
        { name: 'Accessibility', href: '#accessibility' },
        { name: 'Privacy', href: '#privacy' },
        { name: 'Copyright', href: '#copyright' },
      ]}
      department='Digital NSW, Department of Customer Service'
    />
  ),

  'main-nav': <MainNav navigation={mainNavSample} currentHref='#about' shadow={false} />,

  'side-nav': (
    <div className='w-full max-w-xs rounded-md bg-background p-6 ring-1 ring-foreground/10'>
      <SideNav sections={sideNavSample} currentHref='#tokens' />
    </div>
  ),

  'push-menu': (
    <div className='h-96 w-full max-w-sm overflow-hidden rounded-md bg-background ring-1 ring-foreground/10'>
      <PushMenu navigation={pushMenuSample} title='Menu' currentHref='#about' />
    </div>
  ),

  'site-search': (
    <SiteSearch
      groups={[
        {
          title: 'Getting started',
          items: [
            { title: 'Installation', href: '#installation' },
            { title: 'Design tokens', href: '#tokens', keywords: ['colour', 'theme'] },
          ],
        },
        {
          title: 'Components',
          items: [
            { title: 'Button', href: '#button' },
            { title: 'Header', href: '#header', keywords: ['navigation', 'banner'] },
          ],
        },
      ]}
      onSelect={() => {}}
    />
  ),

  'expandable-search': (
    <div className='flex flex-wrap items-center gap-4'>
      <ExpandableSearch variant='default'>
        <ExpandableSearchField placeholder='Search' />
      </ExpandableSearch>
      <span className='rounded-md bg-primary-800 p-3 dark:bg-primary-950'>
        <ExpandableSearch variant='primary-800'>
          <ExpandableSearchField placeholder='Search' />
        </ExpandableSearch>
      </span>
    </div>
  ),

  link: (
    <p className='max-w-md text-base/7 text-foreground'>
      Inline links sit flush with surrounding text — <Link href='#somewhere'>a primary link</Link>{' '}
      carries the halo hover treatment, and an{' '}
      <ExternalLink href='https://www.nsw.gov.au'>external link</ExternalLink> announces that it
      opens in a new tab.
    </p>
  ),

  'step-indicator': (
    <div className='w-full max-w-sm rounded-md bg-background p-6 ring-1 ring-foreground/10'>
      <StepIndicator steps={journeySteps} currentHref='#documents' />
    </div>
  ),

  button: (
    <div className='flex max-w-xl flex-wrap items-center gap-3'>
      <Button>Solid</Button>
      <Button variant='soft'>Soft</Button>
      <Button variant='outline'>Outline</Button>
      <Button variant='ghost'>Ghost</Button>
      <Button variant='link'>Link</Button>
      <Button color='danger'>Danger</Button>
      <Button loading>Saving</Button>
      <Button leadingVisual={<IconAdd aria-hidden='true' />}>With icon</Button>
    </div>
  ),

  field: (
    <div className='w-full max-w-sm rounded-md bg-background p-6 ring-1 ring-foreground/10'>
      <Field>
        <FieldLabel htmlFor='demo-field-email'>Email address</FieldLabel>
        <Input id='demo-field-email' type='email' placeholder='you@example.com' />
        <FieldDescription>We&rsquo;ll only use this to send your receipt.</FieldDescription>
      </Field>
      <Field className='mt-6' data-invalid='true'>
        <FieldLabel htmlFor='demo-field-name'>Full name</FieldLabel>
        <Input id='demo-field-name' aria-invalid defaultValue='' />
        <FieldError>Enter your full name.</FieldError>
      </Field>
    </div>
  ),

  input: (
    <div className='flex w-full max-w-sm flex-col gap-4 rounded-md bg-background p-6 ring-1 ring-foreground/10'>
      <Input placeholder='you@example.com' aria-label='Email address' />
      <Input type='search' placeholder='Search…' aria-label='Search' />
      <Input disabled placeholder='Disabled' aria-label='Disabled input' />
    </div>
  ),

  label: (
    <div className='grid w-full max-w-sm gap-1.5 rounded-md bg-background p-6 ring-1 ring-foreground/10'>
      <Label htmlFor='demo-label-input'>Email address</Label>
      <Input id='demo-label-input' type='email' placeholder='you@example.com' />
    </div>
  ),

  'theme-switcher': (
    <div className='flex flex-col items-center gap-3'>
      <ThemeSwitcher />
      <p className='text-xs text-muted-foreground'>
        Uncontrolled here — the header&rsquo;s switcher is wired to next-themes.
      </p>
    </div>
  ),

  card: (
    <Card className='w-full max-w-sm'>
      <CardHeader>
        <CardTitle>Renew your registration</CardTitle>
        <CardDescription>Takes about five minutes with your billing notice.</CardDescription>
      </CardHeader>
      <CardContent>
        You&rsquo;ll need your payment method and concession details if they apply to you.
      </CardContent>
      <CardFooter>
        <ButtonLink href='#renew' trailingVisual={<IconEast aria-hidden='true' />}>
          Start now
        </ButtonLink>
      </CardFooter>
    </Card>
  ),

  badge: (
    <div className='flex max-w-md flex-wrap items-center gap-3'>
      <Badge>Soft</Badge>
      <Badge variant='solid'>Solid</Badge>
      <Badge variant='outline'>Outline</Badge>
      <Badge variant='surface' color='accent'>
        Accent
      </Badge>
      <Badge variant='solid' color='grey'>
        Grey
      </Badge>
      <BadgeLink href='#badge' variant='soft' color='secondary'>
        Linked badge
      </BadgeLink>
    </div>
  ),

  separator: (
    <div className='w-full max-w-md space-y-3 rounded-md bg-background p-6 ring-1 ring-foreground/10'>
      <p className='text-sm'>Section one</p>
      <Separator />
      <p className='text-sm'>Section two</p>
      <div className='flex h-8 items-stretch gap-3 pt-2'>
        <span className='flex items-center text-sm'>Home</span>
        <Separator orientation='vertical' />
        <span className='flex items-center text-sm'>About</span>
        <Separator orientation='vertical' />
        <span className='flex items-center text-sm'>Contact</span>
      </div>
    </div>
  ),

  'labeled-separator': (
    <div className='w-full max-w-md space-y-8 rounded-md bg-background p-6 ring-1 ring-foreground/10'>
      <LabeledSeparator />
      <LabeledSeparator>continue with</LabeledSeparator>
    </div>
  ),

  'aspect-ratio': (
    <div className='flex w-full max-w-xl flex-wrap gap-6'>
      {(
        [
          ['16 / 9', 16 / 9],
          ['4 / 3', 4 / 3],
          ['1 / 1', 1],
        ] as const
      ).map(([label, ratio]) => (
        <div key={label} className='w-40'>
          <AspectRatio ratio={ratio}>
            <div className='flex size-full items-center justify-center rounded-md bg-muted text-sm text-muted-foreground ring-1 ring-foreground/10'>
              {label}
            </div>
          </AspectRatio>
        </div>
      ))}
    </div>
  ),

  'scroll-area': (
    <ScrollArea className='h-48 w-64 rounded-md bg-background ring-1 ring-foreground/10'>
      <div className='p-4'>
        {Array.from({ length: 30 }, (_, i) => (
          <p key={i} className='py-1 text-sm text-foreground'>
            Row {i + 1}
          </p>
        ))}
      </div>
    </ScrollArea>
  ),

  resizable: (
    <ResizablePanelGroup
      orientation='horizontal'
      className='h-48 w-full max-w-md rounded-md bg-background ring-1 ring-foreground/10'
    >
      <ResizablePanel
        defaultSize={50}
        className='flex items-center justify-center bg-muted p-4 text-sm text-muted-foreground'
      >
        One
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel
        defaultSize={50}
        className='flex items-center justify-center p-4 text-sm text-foreground'
      >
        Two
      </ResizablePanel>
    </ResizablePanelGroup>
  ),

  collapsible: (
    <Collapsible className='w-full max-w-md'>
      <CollapsibleTrigger className='flex w-full items-center justify-between rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground'>
        What documents do I need?
      </CollapsibleTrigger>
      <CollapsibleContent className='mt-2 rounded-md border border-border bg-muted p-4 text-sm text-muted-foreground'>
        A current proof of identity and your billing notice. Concession card holders should also
        have their card number handy.
      </CollapsibleContent>
    </Collapsible>
  ),

  drawer: (
    <Drawer>
      <DrawerTrigger className='cursor-pointer rounded-sm bg-primary px-6 py-3 text-base font-bold text-primary-foreground'>
        Open drawer
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Drawer title</DrawerTitle>
          <DrawerDescription>
            Slides in from the edge; drag or press Escape to dismiss.
          </DrawerDescription>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  ),

  sheet: (
    <div className='flex flex-wrap gap-3'>
      {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
        <Sheet key={side}>
          <SheetTrigger className='cursor-pointer rounded-sm border border-border bg-background px-4 py-2 text-sm font-medium text-foreground capitalize'>
            {side}
          </SheetTrigger>
          <SheetContent side={side}>
            <SheetHeader>
              <SheetTitle>Side: {side}</SheetTitle>
              <SheetDescription>
                An edge-anchored dialog that slides in from the {side}.
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      ))}
    </div>
  ),

  popover: (
    <Popover>
      <PopoverTrigger className='cursor-pointer rounded-sm bg-primary px-6 py-3 text-base font-bold text-primary-foreground'>
        Open popover
      </PopoverTrigger>
      <PopoverContent>
        <PopoverHeader>
          <PopoverTitle>Notifications</PopoverTitle>
          <PopoverDescription>You have 3 unread messages.</PopoverDescription>
        </PopoverHeader>
      </PopoverContent>
    </Popover>
  ),

  'hover-card': (
    <HoverCard>
      <HoverCardTrigger className='cursor-default rounded-sm bg-primary px-6 py-3 text-base font-bold text-primary-foreground'>
        Hover me
      </HoverCardTrigger>
      <HoverCardContent>
        <p className='text-sm text-popover-foreground'>
          A rich preview shown on hover or focus — it never steals focus from the trigger.
        </p>
      </HoverCardContent>
    </HoverCard>
  ),

  tooltip: (
    <TooltipProvider>
      <div className='flex flex-wrap gap-3'>
        {(['top', 'bottom', 'left', 'right'] as const).map((side) => (
          <Tooltip key={side}>
            <TooltipTrigger className='cursor-default rounded-sm border border-border bg-background px-4 py-2 text-sm font-medium text-foreground capitalize'>
              {side}
            </TooltipTrigger>
            <TooltipContent side={side}>Shown on the {side}</TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  ),

  sonner: (
    <div className='flex flex-wrap gap-3'>
      <Button variant='soft' color='success' onClick={() => toast.success('Saved successfully')}>
        Success
      </Button>
      <Button variant='soft' onClick={() => toast.info('A new version is available')}>
        Info
      </Button>
      <Button
        variant='soft'
        color='warning'
        onClick={() => toast.warning('Your session expires soon')}
      >
        Warning
      </Button>
      <Button variant='soft' color='danger' onClick={() => toast.error('Something went wrong')}>
        Error
      </Button>
    </div>
  ),

  spinner: (
    <div className='flex flex-wrap items-end gap-6'>
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <div key={size} className='flex flex-col items-center gap-2'>
          <Spinner size={size} aria-label={`Loading (${size})`} />
          <span className='text-xs text-muted-foreground'>{size}</span>
        </div>
      ))}
    </div>
  ),
}

/** Renders the live demo for a registry item, or nothing when none exists. */
export function ComponentDemo({ slug }: { slug: string }) {
  return demos[slug] ?? null
}
