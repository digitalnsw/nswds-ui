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
import '@nswds/ui/styles.css'

import type {
  BadgeButtonProps,
  BadgeLinkProps,
  BadgeProps,
  ButtonLinkProps,
  ButtonProps,
  CardActionProps,
  CardContentProps,
  CardDescriptionProps,
  CardFooterProps,
  CardHeaderProps,
  CardProps,
  CardTitleProps,
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
  LinkComponent,
  LinkProps,
  LinkUrlObject,
  LogoProps,
  SeparatorProps,
  SpinnerProps,
} from '@nswds/ui'
import {
  AspectRatio,
  Badge,
  BadgeButton,
  BadgeLink,
  Button,
  ButtonLink,
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
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  Input,
  Label,
  LabeledSeparator,
  Link,
  LinkProvider,
  Logo,
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
  Separator,
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Spinner,
  Toaster,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  TouchTarget,
  badgeVariants,
  buttonVariants,
  cn,
  linkVariants,
} from '@nswds/ui'
import { IconSearch } from '@nswds/ui/icons'
import { IconAdd } from '@nswds/ui/icons/add'
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
]
// Reference the tuple so it isn't elided, without emitting runtime code.
export type __AssertPublicPropTypes = PublicPropTypes

// Variant helpers are part of the public API (consumers extend styling with
// them). Calling them checks their signatures.
const _classNames: string = cn(
  buttonVariants({ variant: 'solid', color: 'primary', size: 'default' }),
  badgeVariants({ variant: 'soft', color: 'primary', size: 'default' }),
  linkVariants({ variant: 'primary' }),
)

// `href` accepts a string or a url-object shape (LinkUrlObject), not arbitrary
// objects — exercise both forms.
const stringHref: ButtonLinkProps['href'] = '/docs'
const objectHref: LinkUrlObject = { pathname: '/search', query: { q: 'nsw' } }

function App() {
  // React 19 ref-as-prop: each component must accept a correctly-typed ref to
  // its underlying DOM node. A regression is a compile error here.
  const buttonRef = useRef<HTMLButtonElement>(null)
  const linkRef = useRef<HTMLAnchorElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const buttonProps: ButtonProps = { color: 'primary', size: 'default' }

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
    </main>
  )
}

createRoot(document.getElementById('root')!).render(<App />)
