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
  LinkComponent,
  LinkProps,
  LinkUrlObject,
  LogoProps,
  SeparatorProps,
  SpinnerProps,
} from '@nswds/ui'
import {
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
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
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
  Input,
  Label,
  LabeledSeparator,
  Link,
  LinkProvider,
  Logo,
  Separator,
  Spinner,
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
  DescriptionListProps,
  DescriptionTermProps,
  DescriptionDetailsProps,
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
  linkVariants({ variant: 'primary' })
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
      <ButtonLink href={stringHref} variant="outline" ref={linkRef}>
        Documentation
      </ButtonLink>

      {/* Badges */}
      <Badge color="primary">New</Badge>
      <BadgeButton color="primary">Filter</BadgeButton>
      <BadgeLink href="/tag/news" color="primary">
        News
      </BadgeLink>

      {/* Card */}
      <Card>
        <CardHeader>
          <CardTitle>Card title</CardTitle>
          <CardDescription>Card description</CardDescription>
          <CardAction>
            <Button size="sm">Action</Button>
          </CardAction>
        </CardHeader>
        <CardContent>Body content</CardContent>
        <CardFooter>Footer</CardFooter>
      </Card>

      {/* Description list */}
      <DescriptionList>
        <DescriptionTerm>Agency</DescriptionTerm>
        <DescriptionDetails>NSW Government</DescriptionDetails>
      </DescriptionList>

      {/* Form field composition */}
      <FieldSet>
        <FieldLegend>Contact</FieldLegend>
        <FieldGroup>
          <Field>
            <FieldLabel>Email</FieldLabel>
            <Input ref={inputRef} type="email" aria-label="Email" />
            <FieldDescription>
              We&apos;ll only use this to reply.
            </FieldDescription>
            <FieldError>Enter a valid email.</FieldError>
          </Field>
          <FieldSeparator />
          <Field orientation="horizontal">
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
      <ExternalLink href="https://www.nsw.gov.au">nsw.gov.au</ExternalLink>

      {/* Touch target + spinner + logo */}
      <Button size="icon" aria-label="Search">
        <TouchTarget>
          <IconSearch />
        </TouchTarget>
      </Button>
      <Spinner aria-label="Loading fixture" />
      <Logo logoType="default" />
    </main>
  )
}

createRoot(document.getElementById('root')!).render(<App />)
