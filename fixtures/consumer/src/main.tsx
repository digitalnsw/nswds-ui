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
  InputProps,
  LabelProps,
  LabeledSeparatorProps,
  LinkCardProps,
  LinkComponent,
  LinkProps,
  LinkUrlObject,
  LogoProps,
  OnThisPageItem,
  OnThisPageProps,
  SectionProps,
  SeparatorProps,
  SliderProps,
  SpinnerProps,
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
  OnThisPage,
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
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
  Slider,
  SliderControl,
  SliderIndicator,
  SliderLabel,
  SliderRoot,
  SliderThumb,
  SliderTrack,
  SliderValue,
  Spinner,
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
  linkVariants,
  sectionVariants,
  useChromeHeight,
} from '@nswds/ui'
import { IconSearch } from '@nswds/ui/icons'
import { IconAdd } from '@nswds/ui/icons/add'
// The client-reference entry points. Both exist so an icon can be passed as a
// PROP from a server component; importing them here proves the subpaths
// resolve and are typed for a cold-installed consumer.
import { IconLinkedIn } from '@nswds/ui/icons/brands'
import { IconDownload } from '@nswds/ui/icons/client'
import { useRef } from 'react'
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
]
// Reference the tuple so it isn't elided, without emitting runtime code.
export type __AssertPublicPropTypes = PublicPropTypes

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
)

// `href` accepts a string or a url-object shape (LinkUrlObject), not arbitrary
// objects — exercise both forms.
const stringHref: ButtonLinkProps['href'] = '/docs'
const objectHref: LinkUrlObject = { pathname: '/search', query: { q: 'nsw' } }

const onThisPageItems: OnThisPageItem[] = [
  { id: 'specimen', title: 'Specimen' },
  { id: 'download', title: 'Download' },
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

  return (
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
    </main>
  )
}

createRoot(document.getElementById('root')!).render(<App />)
