// Type-contract + consumption fixture for the PACKED @nswds/ui tarball.
//
// This file is compiled by `tsc` against the cold-installed package in
// scripts/test-consumer-fixture.sh, so it doubles as a regression test for the
// PUBLIC API: it imports and uses every exported component, the variant
// helpers, and `cn`, and references every exported prop type. A removed or
// renamed export — or a removed/renamed prop on a component a unit test never
// touches — becomes a compile error here.
//
// It also exercises the other consumption paths: the compiled stylesheet, the
// per-icon subpath and the icons barrel (tree-shaking is asserted by the
// fixture script — IconSearch must be in the bundle, unimported icons must
// not), and React 19 ref-as-prop forwarding.
//
// The stylesheet arrives through app.css, which pairs it with the fixture's own
// Tailwind build — the two-build configuration a consumer following the README
// ends up in, and the one the cascade hazard lives in. The `AppMarkup` block
// below uses the bare utilities that previously collided with Footer, so the
// built stylesheet really does contain both halves.
import './app.css'

import type {
  BadgeButtonProps,
  BadgeLinkProps,
  BadgeProps,
  ButtonLinkProps,
  ButtonProps,
  CalloutProps,
  CardActionProps,
  CardContentProps,
  CardDescriptionProps,
  CardFooterProps,
  CardHeaderProps,
  CardProps,
  CardTitleProps,
  ContainerProps,
  DescriptionDetailsProps,
  DescriptionListProps,
  DescriptionTermProps,
  ExternalLinkProps,
  FieldContentProps,
  FieldDescriptionProps,
  FieldErrorProps,
  FieldGroupProps,
  FieldLabelProps,
  FieldLegendProps,
  FieldProps,
  FieldSeparatorProps,
  FieldSetProps,
  FieldTitleProps,
  HeaderActionsProps,
  HeaderBrandProps,
  HeaderColor,
  HeaderProps,
  InputProps,
  LabelProps,
  LabeledSeparatorProps,
  LinkCardProps,
  LinkComponent,
  LinkProps,
  LinkUrlObject,
  LogoProps,
  MainNavColor,
  MainNavItem,
  MainNavLinkItem,
  MainNavProps,
  OnThisPageItem,
  OnThisPageProps,
  PushMenuItem,
  PushMenuLevel,
  PushMenuProps,
  SectionProps,
  SeparatorProps,
  SideNavItem,
  SideNavProps,
  SideNavRowVariantProps,
  SiteSearchGroup,
  SiteSearchItem,
  SiteSearchProps,
  SliderProps,
  SpinnerProps,
  Step,
  StepIndicatorProps,
  StepNavProps,
  StepNavSection,
  StepStatus,
  ThemeSwitcherProps,
  ThemeSwitcherTheme,
  UseChromeHeightOptions,
} from '@nswds/ui'
import {
  AspectRatio,
  Badge,
  BadgeButton,
  BadgeLink,
  Button,
  ButtonLink,
  Callout,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Container,
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerPortal,
  DrawerTitle,
  DrawerTrigger,
  ExternalLink,
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
  Footer,
  FooterSocialLink,
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
  LinkCard,
  LinkProvider,
  Logo,
  MainNav,
  OnThisPage,
  PUSH_MENU_DURATION_MS,
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
  ScrollBar,
  Section,
  Separator,
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SideNav,
  SiteSearch,
  Slider,
  SliderControl,
  SliderIndicator,
  SliderLabel,
  SliderRoot,
  SliderThumb,
  SliderTrack,
  SliderValue,
  Spinner,
  StepIndicator,
  StepNav,
  ThemeSwitcher,
  Toaster,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  TouchTarget,
  badgeVariants,
  buttonVariants,
  calloutVariants,
  cn,
  containerVariants,
  descriptionListVariants,
  generatePushMenuBreadcrumb,
  headerColors,
  headerContainerVariants,
  headerVariants,
  linkVariants,
  mainNavColors,
  mainNavContainerVariants,
  mainNavPanelVariants,
  mainNavVariants,
  sectionVariants,
  sideNavRowVariants,
  stepStatusStyles,
  useChromeHeight,
} from '@nswds/ui'
import { IconSearch } from '@nswds/ui/icons'
import { IconAdd } from '@nswds/ui/icons/add'
// The client-reference entry points. Both exist so an icon can be passed as a
// PROP from a server component; importing them here proves the subpaths
// resolve and are typed for a cold-installed consumer.
import { IconLinkedIn } from '@nswds/ui/icons/brands'
import { IconDownload } from '@nswds/ui/icons/client'
import { useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'

// Every exported prop type must remain resolvable. A removed/renamed type
// breaks this tuple at compile time.
type PublicPropTypes = [
  BadgeProps,
  BadgeButtonProps,
  BadgeLinkProps,
  ButtonProps,
  ButtonLinkProps,
  CardProps,
  CardActionProps,
  CardContentProps,
  CardDescriptionProps,
  CardFooterProps,
  CardHeaderProps,
  CardTitleProps,
  ExternalLinkProps,
  FieldProps,
  FieldSetProps,
  FieldLegendProps,
  FieldGroupProps,
  FieldContentProps,
  FieldLabelProps,
  FieldTitleProps,
  FieldDescriptionProps,
  FieldSeparatorProps,
  FieldErrorProps,
  InputProps,
  LabelProps,
  LabeledSeparatorProps,
  LinkProps,
  LinkComponent,
  LogoProps,
  SeparatorProps,
  SpinnerProps,
  ContainerProps,
  SectionProps,
  CalloutProps,
  DescriptionListProps,
  DescriptionTermProps,
  DescriptionDetailsProps,
  LinkCardProps,
  OnThisPageProps,
  OnThisPageItem,
  SliderProps,
  UseChromeHeightOptions,
  HeaderProps,
  HeaderBrandProps,
  HeaderActionsProps,
  HeaderColor,
  MainNavProps,
  MainNavItem,
  MainNavLinkItem,
  MainNavColor,
  SideNavProps,
  SideNavItem,
  SideNavRowVariantProps,
  StepIndicatorProps,
  StepNavProps,
  Step,
  StepNavSection,
  StepStatus,
  PushMenuProps,
  PushMenuItem,
  PushMenuLevel,
  SiteSearchProps,
  SiteSearchGroup,
  SiteSearchItem,
  ThemeSwitcherProps,
  ThemeSwitcherTheme,
]
// Reference the tuple so it isn't elided, without emitting runtime code.
export type __AssertPublicPropTypes = PublicPropTypes

// Header and MainNav ship their colour vocabularies as DATA beside the union
// types derived from them — `headerColors` maps a name to its class string,
// `mainNavColors` is the ordered tuple `MainNavColor` is derived from — so a
// consumer building its own colour picker reads them directly. SideNav
// likewise exports the props of its row variant so consumers can type their
// own row wrappers. Naming each one here means a rename breaks at compile
// time instead of widening to `any` at the call site.
const headerColor: HeaderColor = 'dark'
const mainNavColor: MainNavColor = mainNavColors[0]
const currentSideNavRow: SideNavRowVariantProps = { current: true }

// Variant helpers are part of the public API (consumers extend styling with
// them). Calling them checks their signatures.
const _classNames: string = cn(
  buttonVariants({ variant: 'solid', color: 'primary', size: 'default' }),
  badgeVariants({ variant: 'soft', color: 'primary', size: 'default' }),
  linkVariants({ variant: 'primary' }),
  containerVariants({ size: 'contained' }),
  sectionVariants({ spacing: 'tight', divider: true }),
  calloutVariants({ status: 'warning' }),
  descriptionListVariants({ layout: 'columns' }),
  headerVariants({ color: headerColor }),
  headerContainerVariants({ container: 'contained' }),
  mainNavVariants({ color: mainNavColor, border: 'bottom' }),
  mainNavContainerVariants({ container: 'contained' }),
  mainNavPanelVariants({ color: mainNavColor }),
  sideNavRowVariants(currentSideNavRow),
  // headerColors and stepStatusStyles are plain records rather than cva
  // helpers — a name→classes map and one entry per StepStatus — but they are
  // published for the same reason, so index into both.
  headerColors[headerColor],
  stepStatusStyles['in-progress'].ink,
)

// `href` accepts a string or a url-object shape (LinkUrlObject), not arbitrary
// objects — exercise both forms.
const stringHref: ButtonLinkProps['href'] = '/docs'
const objectHref: LinkUrlObject = { pathname: '/search', query: { q: 'nsw' } }

const onThisPageItems: OnThisPageItem[] = [
  { id: 'specimen', title: 'Specimen' },
  { id: 'download', title: 'Download' },
]

// MainNav, SideNav, StepIndicator/StepNav, PushMenu and SiteSearch are all
// data-driven: the tree/list shape is the API. Declaring each array with its
// exported item type is what puts those types under compile-time contract —
// passing an object literal inline would let a widened field pass unnoticed.
const mainNavPanelLinks: MainNavLinkItem[] = [
  { title: 'Find support near you', href: '/services/support' },
  { title: 'Apply for a licence', href: '/services/licences' },
]

const mainNavigation: MainNavItem[] = [
  { title: 'Home', href: '/' },
  { title: 'Services', href: '/services', links: mainNavPanelLinks },
]

const sideNavSections: SideNavItem[] = [
  {
    title: 'Getting started',
    links: [
      { title: 'Installation', href: '/docs/installation' },
      {
        title: 'Theming',
        links: [{ title: 'Tokens', href: '/docs/theming/tokens' }],
      },
    ],
  },
]

const journeySteps: Step[] = [
  { title: 'Your details', href: '/apply/details', status: 'completed' },
  {
    title: 'Upload documents',
    description: 'Proof of identity and address',
    href: '/apply/documents',
    status: 'in-progress',
  },
  { title: 'Review and submit', href: '/apply/review', status: 'cannot-start' },
]

const stepNavSections: StepNavSection[] = [{ title: 'Before you start', steps: journeySteps }]

// Partial<Record<StepStatus, …>> is the prop's own shape, so this covers the
// StepStatus union by key rather than by a single sample value.
const stepStatusLabels: Partial<Record<StepStatus, string>> = {
  completed: 'Completed',
  'in-progress': 'In progress',
  'cannot-start': 'Cannot start yet',
}

const pushMenuNavigation: PushMenuItem[] = [
  { id: 'home', title: 'Home', href: '/' },
  {
    id: 'services',
    title: 'Services',
    links: [{ id: 'services-support', title: 'Find support near you', href: '/services/support' }],
  },
]

// Both ship beside PushMenu. `generatePushMenuBreadcrumb`'s behaviour is
// covered by packages/ui/tests/, but only this file proves the export still
// exists on the published surface and still takes `{ title }[]` and a length.
const pushMenuBreadcrumb: string = generatePushMenuBreadcrumb(
  [{ title: 'Home' }, { title: 'Services' }],
  40,
)
const pushMenuDuration: number = PUSH_MENU_DURATION_MS

const siteSearchGroups: SiteSearchGroup[] = [
  {
    title: 'Components',
    items: [
      { title: 'Button', href: '/docs/button', keywords: ['action', 'cta'] },
      { title: 'Card', href: '/docs/card' },
    ],
  },
]

function App() {
  // React 19 ref-as-prop: each component must accept a correctly-typed ref to
  // its underlying DOM node. A regression is a compile error here.
  const buttonRef = useRef<HTMLButtonElement>(null)
  const linkRef = useRef<HTMLAnchorElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const buttonProps: ButtonProps = { color: 'primary', size: 'default' }

  // Hooks are public API too. The returned ref must be assignable to the
  // element it is attached to, and `height` must be a number.
  // Destructured, as the hook documents: holding the result as one object and
  // reading a property off it during render trips React Compiler's ref rule.
  const { ref: chromeRef, height: chromeHeight } = useChromeHeight<HTMLDivElement>({
    property: '--fixture-chrome-height',
  })
  const chromeOffset: number = chromeHeight

  // ThemeSwitcher is controlled/uncontrolled; the controlled form is the one
  // that pins ThemeSwitcherTheme into the contract, on the way in (`theme`)
  // and back out (`onThemeChange`).
  const [theme, setTheme] = useState<ThemeSwitcherTheme>('light')

  return (
    <>
      {/* Site chrome. Header and MainNav sit OUTSIDE <main>: a native
          `<header>` only maps to the banner landmark when it is not inside
          main/article/aside/nav/section (HTML-AAM), which is the rule
          header.tsx documents. Footer is after </main> for the same reason —
          `<footer>` in <main> is sectionfooter, not contentinfo. The in-page
          navs stay inside: `<nav>` carries its landmark wherever it sits. */}
      <Header color={headerColor} container='contained' sticky={false} border shadow={false}>
        <HeaderBrand sitename='Consumer fixture' version='0.0.0' versionLabel='Version' />
        <HeaderActions>
          <SiteSearch
            groups={siteSearchGroups}
            onSelect={(item: SiteSearchItem) => item.href}
            label='Search the design system'
            placeholder='Search components'
            emptyMessage='No components match that search.'
            // Only one shortcut-enabled palette may be mounted per page, and
            // the fixture is a page.
            shortcut={false}
          />
          <ThemeSwitcher theme={theme} onThemeChange={setTheme} />
        </HeaderActions>
      </Header>

      {/* Main navigation bar — items with `links` open a mega panel. */}
      <MainNav
        navigation={mainNavigation}
        color={mainNavColor}
        container='contained'
        border='bottom'
        currentHref='/services/support'
        sticky={false}
      />

      <main className={cn('space-y-6 p-8')}>
        {/* Variant helpers are public API; render their output so the calls above
            stay referenced and their signatures are checked. */}
        <span hidden className={_classNames} />

        {/* Buttons */}
        <Button {...buttonProps} ref={buttonRef} leadingVisual={IconSearch}>
          Search
        </Button>
        <Button leadingVisual={IconAdd}>Add</Button>
        <Button leadingVisual={IconDownload}>Download</Button>
        <ButtonLink href={stringHref} variant='outline' ref={linkRef}>
          Documentation
        </ButtonLink>

        {/* Badges */}
        <Badge color='primary'>New</Badge>
        <BadgeButton color='primary'>Filter</BadgeButton>
        <BadgeLink href='/tag/news' color='primary'>
          News
        </BadgeLink>

        {/* Card */}
        <Card>
          <CardHeader>
            <CardTitle>Card title</CardTitle>
            <CardDescription>Card description</CardDescription>
            <CardAction>
              <Button size='sm'>Action</Button>
            </CardAction>
          </CardHeader>
          <CardContent>Body content</CardContent>
          <CardFooter>Footer</CardFooter>
        </Card>

        {/* Form field composition */}
        <FieldSet>
          <FieldLegend>Contact</FieldLegend>
          <FieldGroup>
            <Field>
              <FieldLabel>Email</FieldLabel>
              <Input ref={inputRef} type='email' aria-label='Email' />
              <FieldDescription>We&apos;ll only use this to reply.</FieldDescription>
              <FieldError>Enter a valid email.</FieldError>
            </Field>
            <FieldSeparator />
            <Field orientation='horizontal'>
              <FieldContent>
                <FieldTitle>Notifications</FieldTitle>
              </FieldContent>
            </Field>
          </FieldGroup>
        </FieldSet>

        {/* Label + separators */}
        <Label>Standalone label</Label>
        <LabeledSeparator>or</LabeledSeparator>
        <Separator />

        {/* Links */}
        <LinkProvider component={'a' satisfies LinkComponent}>
          <Link href={objectHref}>Search</Link>
        </LinkProvider>
        <ExternalLink href='https://www.nsw.gov.au'>nsw.gov.au</ExternalLink>

        {/* Page composition: chrome measurement feeding the in-page nav's spy
            line, then the layout primitives around real content. */}
        <div ref={chromeRef}>
          <OnThisPage
            items={onThisPageItems}
            orientation='horizontal'
            offset={chromeOffset}
            onActiveChange={(id: string | null) => id}
          />
        </div>

        <Section spacing='tight' divider labelledBy='fixture-heading'>
          <Container size='contained'>
            <h2 id='fixture-heading'>Specimen</h2>

            <Callout status='info' title='Not seeing it in the font menu?'>
              Quit the application completely and reopen it.
            </Callout>

            <DescriptionList layout='inline'>
              <div>
                <DescriptionTerm>Version</DescriptionTerm>
                <DescriptionDetails>2.001</DescriptionDetails>
              </div>
            </DescriptionList>

            <LinkCard
              href='https://public-sans.digital.gov/'
              external
              label='Upstream'
              title='Public Sans project site'
              description='The full character set.'
            />

            {/* Composed form, then the same control built from its parts — both
                are public API and the generic parameter must flow through both. */}
            <Slider label='Size' defaultValue={56} min={16} max={140} suffix='px' />
            <SliderRoot defaultValue={40} aria-label='Built from parts'>
              <SliderLabel>Weight</SliderLabel>
              <SliderValue />
              <SliderControl>
                <SliderTrack>
                  <SliderIndicator />
                  <SliderThumb />
                </SliderTrack>
              </SliderControl>
            </SliderRoot>
          </Container>
        </Section>

        {/* Brand marks: the Material Symbols set has none, so they ship from
            their own subpath. Exercised as a PROP, which is the case that needs
            them to be client references. */}
        <FooterSocialLink
          href='https://www.linkedin.com'
          label='Follow us on LinkedIn'
          icon={IconLinkedIn}
        />

        {/* Touch target + spinner + logo */}
        <Button size='icon' aria-label='Search'>
          <TouchTarget>
            <IconSearch />
          </TouchTarget>
        </Button>
        <Spinner aria-label='Loading fixture' />
        <Logo logoType='default' />

        {/* Aspect ratio */}
        <AspectRatio ratio={16 / 9}>
          <div className='bg-muted' />
        </AspectRatio>

        {/* Collapsible */}
        <Collapsible>
          <CollapsibleTrigger>Toggle details</CollapsibleTrigger>
          <CollapsibleContent>Collapsible content</CollapsibleContent>
        </Collapsible>

        {/* Popover */}
        <Popover>
          <PopoverTrigger>Open popover</PopoverTrigger>
          <PopoverContent>
            <PopoverHeader>
              <PopoverTitle>Popover title</PopoverTitle>
              <PopoverDescription>Popover description</PopoverDescription>
            </PopoverHeader>
          </PopoverContent>
        </Popover>

        {/* Hover card */}
        <HoverCard>
          <HoverCardTrigger>Hover me</HoverCardTrigger>
          <HoverCardContent>Hover card content</HoverCardContent>
        </HoverCard>

        {/* Tooltip */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>Hover me</TooltipTrigger>
            <TooltipContent>Tooltip label</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Sheet */}
        <Sheet>
          <SheetTrigger>Open sheet</SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Sheet title</SheetTitle>
              <SheetDescription>Sheet description</SheetDescription>
            </SheetHeader>
            <SheetFooter>
              <SheetClose>Close</SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>

        {/* Drawer — DrawerContent renders its own Portal + Overlay, so it is
            composed directly (no outer portal). */}
        <Drawer>
          <DrawerTrigger>Open drawer</DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Drawer title</DrawerTitle>
              <DrawerDescription>Drawer description</DrawerDescription>
            </DrawerHeader>
            <DrawerFooter>
              <DrawerClose>Close</DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>

        {/* DrawerPortal + DrawerOverlay are exported for manual composition;
            exercised standalone here so the type contract still covers them. */}
        <Drawer>
          <DrawerTrigger>Open (manual portal)</DrawerTrigger>
          <DrawerPortal>
            <DrawerOverlay />
          </DrawerPortal>
        </Drawer>

        {/* Resizable */}
        <ResizablePanelGroup orientation='horizontal'>
          <ResizablePanel>One</ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel>Two</ResizablePanel>
        </ResizablePanelGroup>

        {/* Scroll area — ScrollBar is a standalone export */}
        <ScrollArea>
          <p>Scrollable content</p>
          <ScrollBar orientation='horizontal' />
        </ScrollArea>

        {/* Sonner toaster */}
        <Toaster />

        {/* Section navigation, journey progress and the mobile drill-down. Each
            takes its tree/list from the module-scope arrays above. */}
        <SideNav
          sections={sideNavSections}
          currentHref='/docs/theming/tokens'
          headingLevel={3}
          onNavigate={(event) => event.currentTarget.href}
        />

        <StepIndicator
          steps={journeySteps}
          currentHref='/apply/documents'
          statusLabels={stepStatusLabels}
        />

        <StepNav
          sections={stepNavSections}
          currentHref='/apply/documents'
          statusLabels={stepStatusLabels}
          headingLevel={3}
        />

        <PushMenu
          navigation={pushMenuNavigation}
          currentHref='/services/support'
          title='Menu'
          durationMs={pushMenuDuration}
          onItemClick={(item: PushMenuItem) => item.id}
          onNavigate={(level: PushMenuLevel, history: PushMenuLevel[]) => history.indexOf(level)}
        />
        {/* PushMenu draws its own trail; this renders the exported helper's
            output so the call above cannot be elided. */}
        <p hidden>{pushMenuBreadcrumb}</p>

        {/* The consumer's OWN markup. Every class here is a bare utility that
            Footer's rows also depend on at some breakpoint, so the app's Tailwind
            build emits its own copy of each into the second half of the
            stylesheet — after ours, where it can outrank a responsive rule of
            ours that carries no extra specificity. Keeping them here is what
            makes the fixture's cascade assertion meaningful. */}
        <section className='flex flex-col justify-center gap-3 py-6 text-center text-base'>
          <p className='mt-2 px-4 text-lg'>Consumer-owned markup</p>
          <div className='grid grid-cols-1 gap-8 pb-4'>
            <span className='flex h-10 flex-row items-center gap-2 border-b py-3'>Row</span>
          </div>
          {/* `justify-evenly` is the marker the fixture script uses to prove this
              Tailwind build actually ran. It has to be a class @nswds/ui never
              emits — every class above is one the package emits too, so none of
              them can tell the two halves apart. The script re-checks that
              against the installed stylesheet on every run, so the marker cannot
              quietly stop being app-only. */}
          <div className='flex justify-evenly'>Marker</div>
        </section>
      </main>

      {/* Footer is the component the hazard was reported against: its legal-link
          and social rows split left/right from `lg`, and an app's plain
          `justify-center` used to hold them centred at every width. */}
      <Footer
        department='Department of Customer Service'
        legalLinks={[
          { name: 'Privacy', href: '/privacy' },
          { name: 'Accessibility', href: '/accessibility' },
        ]}
        socialLinks={[{ name: 'LinkedIn', href: 'https://www.linkedin.com', icon: IconSearch }]}
      />
    </>
  )
}

createRoot(document.getElementById('root')!).render(<App />)
