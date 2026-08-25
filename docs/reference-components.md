# Component reference

Every component the design system ships, on both distribution channels, with the props for the
ones you cannot look up anywhere else.

`@nswds/ui` 5.6.0 exports **335 named symbols** across **62 components** and **1 hook**, and the
registry serves **78 items** — those, 2 icon items, 12 blocks, and the `theme` foundation. This page is the complete list. It is
generated from `packages/ui/registry.json` and the built type declarations, so it cannot drift
from what actually ships.

- **npm**: `import { Button } from '@nswds/ui'` — everything in the Exports column below.
- **registry**: `npx shadcn@latest add @nswds/button` — everything in the Registry ref column.
  See the [registry installation guide](installing-from-the-registry.md) for the one-time setup.

Blocks are registry-only by design; hooks and components ship on both channels.

---

## The catalogue

### NSW-original items (23)

21 components plus the two icon items.

Built for NSW Government and documented nowhere else. Prop tables for these are in [Props for the NSW-original components](#props-for-the-nsw-original-components).

| Registry ref               | Exports                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | What it is                                                                                                                                                                                                |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@nswds/callout`           | `Callout`, `CalloutProps`, `CalloutStatus`, `calloutVariants`                                                                                                                                                                                                                                                                                                                                                                                                                                         | Bordered notice marking page content as informational, confirming, cautionary or dangerous, using the NSW semantic role tokens.                                                                           |
| `@nswds/container`         | `Container`, `ContainerProps`, `containerVariants`                                                                                                                                                                                                                                                                                                                                                                                                                                                    | Page-width column carrying the same lateral rhythm the Masthead, Header, MainNav and Footer apply to their own inner wrappers.                                                                            |
| `@nswds/description-list`  | `DescriptionDetails`, `DescriptionDetailsProps`, `DescriptionList`, `DescriptionListProps`, `DescriptionTerm`, `DescriptionTermProps`, `descriptionListVariants`                                                                                                                                                                                                                                                                                                                                      | Term and detail pairs in stacked, two-column or inline layouts, for metadata strips and summary rows.                                                                                                     |
| `@nswds/expandable-search` | `ExpandableSearch`, `ExpandableSearchButtonProps`, `ExpandableSearchField`, `ExpandableSearchFieldProps`, `ExpandableSearchProps`, `ExpandableSearchVariant`, `expandableSearchVariants`                                                                                                                                                                                                                                                                                                              | A 48px search button that expands into a text field on focus, with ink-derived surface colours matching the footer palette.                                                                               |
| `@nswds/footer`            | `Footer`, `FooterAcknowledgement`, `FooterAcknowledgementProps`, `FooterColor`, `FooterLegalLinkItem`, `FooterLegalLinks`, `FooterLegalLinksProps`, `FooterLinkItem`, `FooterNav`, `FooterNavColumn`, `FooterNavColumnProps`, `FooterNavLink`, `FooterNavLinkProps`, `FooterNavProps`, `FooterProps`, `FooterSmallPrint`, `FooterSmallPrintProps`, `FooterSocialLink`, `FooterSocialLinkItem`, `FooterSocialLinkProps`, `footerColors`, `footerContainerVariants`, `footerLogoType`, `footerVariants` | End-of-page contentinfo landmark with acknowledgement of Country, legal links, ownership and social channels, themeable across 13 token-based surface colours.                                            |
| `@nswds/header`            | `Header`, `HeaderActions`, `HeaderActionsProps`, `HeaderBrand`, `HeaderBrandProps`, `HeaderColor`, `HeaderProps`, `headerColors`, `headerContainerVariants`, `headerVariants`                                                                                                                                                                                                                                                                                                                         | Top-of-page banner landmark with brand lockup, site name, version badge and a slot for header controls, in four WCAG 2.2 AAA surface colours.                                                             |
| `@nswds/icon-brands`       | —                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | Third-party brand marks (Facebook, X, YouTube, LinkedIn, Instagram, GitHub) for the footer social row, which the Material Symbols set does not include.                                                   |
| `@nswds/icons`             | —                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | Curated NSWDS icon subset used by the shipped components and patterns. The full Material Symbols set is available per-icon from the @nswds/ui npm package (import { IconSearch } from '@nswds/ui/icons'). |
| `@nswds/labeled-separator` | `LabeledSeparator`, `LabeledSeparatorProps`                                                                                                                                                                                                                                                                                                                                                                                                                                                           | A horizontal divider broken by a centred label, such as an "or" rule between sign-in methods.                                                                                                             |
| `@nswds/link`              | `ExternalLink`, `ExternalLinkProps`, `Link`, `LinkComponent`, `LinkProps`, `LinkProvider`, `LinkUrlObject`, `linkVariants`                                                                                                                                                                                                                                                                                                                                                                            | A link primitive with a provider for app router link components.                                                                                                                                          |
| `@nswds/link-card`         | `LinkCard`, `LinkCardProps`                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | A card whose entire surface is a single link, with one tab stop and one accessible name.                                                                                                                  |
| `@nswds/logo`              | `Logo`, `LogoProps`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | NSW Government logo component.                                                                                                                                                                            |
| `@nswds/main-nav`          | `MainNav`, `MainNavColor`, `MainNavItem`, `MainNavLinkItem`, `MainNavProps`, `mainNavColors`, `mainNavContainerVariants`, `mainNavPanelVariants`, `mainNavVariants`                                                                                                                                                                                                                                                                                                                                   | The full-width NSW site navigation bar with mega-menu panels, current-page marking and 13 token-based surface colours, built on the navigation-menu component.                                            |
| `@nswds/masthead`          | `Masthead`, `MastheadColor`, `MastheadProps`, `mastheadContainerVariants`, `mastheadVariants`                                                                                                                                                                                                                                                                                                                                                                                                         | The "A NSW Government website" strip shown above the site header, with WCAG 2.2 AAA colour variants and fluid/contained width presets.                                                                    |
| `@nswds/on-this-page`      | `OnThisPage`, `OnThisPageItem`, `OnThisPageProps`                                                                                                                                                                                                                                                                                                                                                                                                                                                     | In-page anchor navigation that tracks which section the reader has reached and marks it aria-current="location".                                                                                          |
| `@nswds/push-menu`         | `PUSH_MENU_DURATION_MS`, `PushMenu`, `PushMenuItem`, `PushMenuLevel`, `PushMenuProps`, `generatePushMenuBreadcrumb`                                                                                                                                                                                                                                                                                                                                                                                   | Multi-level drill-down navigation menu with slide transitions, focus management and inert parked levels, for mobile drawers.                                                                              |
| `@nswds/section`           | `Section`, `SectionProps`, `sectionVariants`                                                                                                                                                                                                                                                                                                                                                                                                                                                          | Top-level page section with the house vertical rhythm, an optional divider, and the aria-labelledby wiring that makes it a named region landmark.                                                         |
| `@nswds/side-nav`          | `SideNav`, `SideNavItem`, `SideNavProps`, `SideNavRowVariantProps`, `sideNavRowVariants`                                                                                                                                                                                                                                                                                                                                                                                                              | Vertical section navigation with arbitrary collapsible nesting, current-page marking and auto-expansion of the active branch.                                                                             |
| `@nswds/site-search`       | `SiteSearch`, `SiteSearchGroup`, `SiteSearchItem`, `SiteSearchProps`                                                                                                                                                                                                                                                                                                                                                                                                                                  | Cmd/Ctrl-K site search palette on the Base UI autocomplete and dialog primitives — grouped results, keyboard filtering and an onSelect callback for framework routing.                                    |
| `@nswds/skip-link`         | `SkipLink`, `SkipLinkProps`, `SkipLinks`, `SkipLinksProps`, `skipLinkVariants`                                                                                                                                                                                                                                                                                                                                                                                                                        | Focus-revealed bypass links (SkipLink + SkipLinks landmark) that let keyboard and screen-reader users jump past repeated blocks, with the same AAA colour variants as the Masthead.                       |
| `@nswds/step-indicator`    | `Step`, `StepIndicator`, `StepIndicatorProps`, `StepNav`, `StepNavProps`, `StepNavSection`, `StepStatus`, `stepStatusStyles`                                                                                                                                                                                                                                                                                                                                                                          | Ordered multi-step progress list with status markers (completed, saved, in progress, error, cannot start) and an aria-current step, plus a sectioned StepNav wrapper.                                     |
| `@nswds/tab-nav`           | `TabNav`, `TabNavLink`, `TabNavLinkProps`, `TabNavProps`, `tabNavLinkVariants`, `tabNavListVariants`                                                                                                                                                                                                                                                                                                                                                                                                  | Flat horizontal navigation between the pages of one section, marking the current page with aria-current="page".                                                                                           |
| `@nswds/theme-switcher`    | `ThemeSwitcher`, `ThemeSwitcherProps`, `ThemeSwitcherTheme`                                                                                                                                                                                                                                                                                                                                                                                                                                           | Light/dark toggle button with controlled and uncontrolled modes — framework-free, wire it to next-themes or any theme store.                                                                              |

### Shadcn/Base UI components, NSW-styled (41)

Familiar shadcn shapes rebuilt on Base UI primitives and NSW tokens. Composition follows [Base UI](https://base-ui.com/); only the styling is ours.

| Registry ref           | Exports                                                                                                                                                                                                                                                                                                                                              | What it is                                                                                                               |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `@nswds/accordion`     | `Accordion`, `AccordionContent`, `AccordionItem`, `AccordionTrigger`, `AccordionVariant`                                                                                                                                                                                                                                                             | Vertically stacked, collapsible content panels.                                                                          |
| `@nswds/aspect-ratio`  | `AspectRatio`                                                                                                                                                                                                                                                                                                                                        | Constrains its content to a given width-to-height ratio.                                                                 |
| `@nswds/avatar`        | `Avatar`, `AvatarBadge`, `AvatarFallback`, `AvatarGroup`, `AvatarGroupCount`, `AvatarImage`                                                                                                                                                                                                                                                          | Avatar image with a text fallback, badge, and grouping.                                                                  |
| `@nswds/badge`         | `Badge`, `BadgeButton`, `BadgeButtonProps`, `BadgeLink`, `BadgeLinkProps`, `BadgeProps`, `badgeVariants`                                                                                                                                                                                                                                             | A badge component with variants, colours, sizes, and interactive button/link variants.                                   |
| `@nswds/breadcrumb`    | `Breadcrumb`, `BreadcrumbEllipsis`, `BreadcrumbItem`, `BreadcrumbLink`, `BreadcrumbList`, `BreadcrumbPage`, `BreadcrumbSeparator`                                                                                                                                                                                                                    | Breadcrumb trail showing the current page location.                                                                      |
| `@nswds/button`        | `Button`, `ButtonLink`, `ButtonLinkProps`, `ButtonProps`, `IconSlot`, `TouchTarget`, `buttonVariants`                                                                                                                                                                                                                                                | A button component with variants and sizes.                                                                              |
| `@nswds/button-group`  | `ButtonGroup`, `ButtonGroupSeparator`, `ButtonGroupText`, `buttonGroupVariants`                                                                                                                                                                                                                                                                      | Groups related buttons into a single connected control.                                                                  |
| `@nswds/card`          | `Card`, `CardAction`, `CardActionProps`, `CardContent`, `CardContentProps`, `CardDescription`, `CardDescriptionProps`, `CardFooter`, `CardFooterProps`, `CardHeader`, `CardHeaderProps`, `CardProps`, `CardTitle`, `CardTitleProps`                                                                                                                  | A content container with header, content, footer, action, and description slots.                                         |
| `@nswds/carousel`      | `Carousel`, `CarouselApi`, `CarouselContent`, `CarouselItem`, `CarouselNext`, `CarouselPrevious`, `useCarousel`                                                                                                                                                                                                                                      | A swipeable carousel built on Embla.                                                                                     |
| `@nswds/checkbox`      | `Checkbox`                                                                                                                                                                                                                                                                                                                                           | A checkbox for single on/off selections.                                                                                 |
| `@nswds/collapsible`   | `Collapsible`, `CollapsibleContent`, `CollapsibleTrigger`                                                                                                                                                                                                                                                                                            | An expandable section built on the Base UI collapsible primitive.                                                        |
| `@nswds/combobox`      | `Combobox`, `ComboboxChip`, `ComboboxChips`, `ComboboxChipsInput`, `ComboboxCollection`, `ComboboxContent`, `ComboboxEmpty`, `ComboboxGroup`, `ComboboxInput`, `ComboboxItem`, `ComboboxLabel`, `ComboboxList`, `ComboboxSeparator`, `ComboboxTrigger`, `ComboboxValue`, `useComboboxAnchor`                                                         | A text input paired with an autocomplete list of options.                                                                |
| `@nswds/direction`     | —                                                                                                                                                                                                                                                                                                                                                    | Provides text direction (LTR/RTL) to descendant components.                                                              |
| `@nswds/drawer`        | `Drawer`, `DrawerClose`, `DrawerContent`, `DrawerDescription`, `DrawerFooter`, `DrawerHeader`, `DrawerOverlay`, `DrawerPortal`, `DrawerTitle`, `DrawerTrigger`                                                                                                                                                                                       | An edge-anchored panel that slides in from any side, built on Vaul.                                                      |
| `@nswds/field`         | `Field`, `FieldContent`, `FieldContentProps`, `FieldDescription`, `FieldDescriptionProps`, `FieldError`, `FieldErrorProps`, `FieldGroup`, `FieldGroupProps`, `FieldLabel`, `FieldLabelProps`, `FieldLegend`, `FieldLegendProps`, `FieldProps`, `FieldSeparator`, `FieldSeparatorProps`, `FieldSet`, `FieldSetProps`, `FieldTitle`, `FieldTitleProps` | Form field layout primitives — set, group, label, description, error, and separator slots.                               |
| `@nswds/hover-card`    | `HoverCard`, `HoverCardContent`, `HoverCardTrigger`                                                                                                                                                                                                                                                                                                  | A rich preview surface shown on hover or focus, built on the Base UI preview-card primitive.                             |
| `@nswds/input`         | `Input`, `InputProps`                                                                                                                                                                                                                                                                                                                                | A text input built on the Base UI input primitive with NSW form styling.                                                 |
| `@nswds/input-group`   | `InputGroup`, `InputGroupAddon`, `InputGroupButton`, `InputGroupInput`, `InputGroupText`, `InputGroupTextarea`                                                                                                                                                                                                                                       | Composes an input with inline addons, buttons, and text.                                                                 |
| `@nswds/input-otp`     | `InputOTP`, `InputOTPGroup`, `InputOTPSeparator`, `InputOTPSlot`                                                                                                                                                                                                                                                                                     | A one-time-password / verification code input.                                                                           |
| `@nswds/kbd`           | `Kbd`, `KbdGroup`                                                                                                                                                                                                                                                                                                                                    | Displays a keyboard key or shortcut.                                                                                     |
| `@nswds/label`         | `Label`, `LabelProps`                                                                                                                                                                                                                                                                                                                                | A form label with disabled-state styling.                                                                                |
| `@nswds/native-select` | `NativeSelect`, `NativeSelectOptGroup`, `NativeSelectOption`                                                                                                                                                                                                                                                                                         | A styled native HTML select control.                                                                                     |
| `@nswds/pagination`    | `Pagination`, `PaginationContent`, `PaginationEllipsis`, `PaginationItem`, `PaginationLink`, `PaginationNext`, `PaginationPrevious`                                                                                                                                                                                                                  | Navigation controls for paginated content.                                                                               |
| `@nswds/popover`       | `Popover`, `PopoverContent`, `PopoverDescription`, `PopoverHeader`, `PopoverTitle`, `PopoverTrigger`                                                                                                                                                                                                                                                 | A floating panel anchored to a trigger, built on the Base UI popover primitive.                                          |
| `@nswds/progress`      | `Progress`, `ProgressIndicator`, `ProgressLabel`, `ProgressTrack`, `ProgressValue`                                                                                                                                                                                                                                                                   | Shows the completion progress of a task.                                                                                 |
| `@nswds/radio-group`   | `RadioGroup`, `RadioGroupItem`                                                                                                                                                                                                                                                                                                                       | A set of mutually exclusive radio options.                                                                               |
| `@nswds/resizable`     | `ResizableHandle`, `ResizablePanel`, `ResizablePanelGroup`                                                                                                                                                                                                                                                                                           | Resizable panel groups with draggable handles, built on react-resizable-panels.                                          |
| `@nswds/scroll-area`   | `ScrollArea`, `ScrollBar`                                                                                                                                                                                                                                                                                                                            | A custom scrollable region with styled scrollbars, built on the Base UI scroll-area primitive.                           |
| `@nswds/select`        | `Select`, `SelectContent`, `SelectGroup`, `SelectItem`, `SelectLabel`, `SelectScrollDownButton`, `SelectScrollUpButton`, `SelectSeparator`, `SelectTrigger`, `SelectValue`                                                                                                                                                                           | A dropdown for selecting a single value from a list.                                                                     |
| `@nswds/separator`     | `Separator`, `SeparatorProps`                                                                                                                                                                                                                                                                                                                        | A semantic or decorative divider built on the Base UI separator primitive.                                               |
| `@nswds/sheet`         | `Sheet`, `SheetClose`, `SheetContent`, `SheetDescription`, `SheetFooter`, `SheetHeader`, `SheetTitle`, `SheetTrigger`                                                                                                                                                                                                                                | An edge-anchored dialog that slides in from any side, built on the Base UI dialog primitive.                             |
| `@nswds/slider`        | `Slider`                                                                                                                                                                                                                                                                                                                                             | A slider for choosing a number from a range, built on the Base UI Slider primitive, with a label and live value readout. |
| `@nswds/sonner`        | `Toaster`                                                                                                                                                                                                                                                                                                                                            | A toast notification surface wired to next-themes, with NSWDS status icons.                                              |
| `@nswds/spinner`       | `Spinner`, `SpinnerProps`                                                                                                                                                                                                                                                                                                                            | An inline loading spinner with semantic colour and size variants.                                                        |
| `@nswds/switch`        | `Switch`                                                                                                                                                                                                                                                                                                                                             | A toggle switch for an on/off state.                                                                                     |
| `@nswds/table`         | `Table`, `TableBody`, `TableCaption`, `TableCell`, `TableFooter`, `TableHead`, `TableHeader`, `TableRow`                                                                                                                                                                                                                                             | Primitives for rendering tabular data.                                                                                   |
| `@nswds/tabs`          | `Tabs`, `TabsContent`, `TabsList`, `TabsTrigger`, `tabsListVariants`, `tabsTriggerVariants`                                                                                                                                                                                                                                                          | Layered content sections shown one panel at a time.                                                                      |
| `@nswds/textarea`      | `Textarea`                                                                                                                                                                                                                                                                                                                                           | A multi-line text input.                                                                                                 |
| `@nswds/toggle`        | `Toggle`, `toggleVariants`                                                                                                                                                                                                                                                                                                                           | A two-state button that can be on or off.                                                                                |
| `@nswds/toggle-group`  | `ToggleGroup`, `ToggleGroupItem`                                                                                                                                                                                                                                                                                                                     | A set of two-state toggle buttons.                                                                                       |
| `@nswds/tooltip`       | `Tooltip`, `TooltipContent`, `TooltipProvider`, `TooltipTrigger`                                                                                                                                                                                                                                                                                     | A small label shown on hover or focus, built on the Base UI tooltip primitive.                                           |

### Hooks (1)

| Registry ref               | Exports | What it is                                                                                                                     |
| -------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `@nswds/use-chrome-height` | —       | Measures a sticky chrome element and publishes its height as a CSS custom property, keeping it current as the element resizes. |

### Blocks (12)

Copy-and-adapt worked examples. **Registry only** — deliberately not exported from `@nswds/ui`, because a block is a starting point you own, not an API we version.

| Registry ref                   | Exports | What it is                                                                                                                                           |
| ------------------------------ | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@nswds/footer-accordion`      | —       | A long site map that collapses into accordions below the lg breakpoint and lays out as columns above it.                                             |
| `@nswds/footer-compact`        | —       | A single horizontal row of logo, links, ownership and social, for embedded tools and admin screens. Omits acknowledgement of Country by design.      |
| `@nswds/footer-contact`        | —       | Phone, email, street address and opening hours in an <address> element, beside the site map.                                                         |
| `@nswds/footer-cta`            | —       | A call-to-action band above the site map, tinted with the footer ink so it works on every surface colour.                                            |
| `@nswds/footer-newsletter`     | —       | Link columns beside a labelled email subscription form built on Field, Input and Button.                                                             |
| `@nswds/footer-simple-centred` | —       | Everything centred under the NSW Government logo: the smallest footer that still carries acknowledgement of Country, legal links and ownership.      |
| `@nswds/footer-sitemap`        | —       | Four columns of links above the standard footer. The default choice for a department or agency site.                                                 |
| `@nswds/footer-sitemap-brand`  | —       | The NSW Government mark and a one-paragraph mission beside three link columns.                                                                       |
| `@nswds/forgot-password-form`  | —       | A forgot-password form worked example (Card + Field + Input + Button) wired with NSWDS components. Copy-and-adapt block — not a published component. |
| `@nswds/login-form`            | —       | A login form worked example (Card + Field + Input + Button) wired with NSWDS components. Copy-and-adapt block — not a published component.           |
| `@nswds/mobile-nav`            | —       | Hamburger trigger opening a left-side sheet containing the multi-level push menu — the mobile navigation pattern for NSW site headers.               |
| `@nswds/sign-up-form`          | —       | A sign-up form worked example (Card + Field + Input + Button) wired with NSWDS components. Copy-and-adapt block — not a published component.         |

---

## Props for the NSW-original components

Shadcn and Base UI components are documented upstream. These are not — they were built for NSW
Government, so this table is their only reference. Types come from the shipped `.d.ts` files.

Every component below also accepts the native props of the element it renders (`Header` takes
`React.ComponentPropsWithoutRef<'header'>`, and so on) plus `className` and `ref`. Only the
component's own props are listed.

### Page chrome

#### `Masthead`

The "A NSW Government website" strip. Render it above `Header`.

| Prop                 | Type                                     | Default   | Notes                                                                                                                        |
| -------------------- | ---------------------------------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `color`              | `'dark' \| 'light' \| 'white' \| 'grey'` | `'dark'`  | Every pair is WCAG 2.2 AAA (7:1). `light`/`white`/`grey` are frozen across themes — it is a brand strip, not a page surface. |
| `container`          | `'fluid' \| 'contained'`                 | `'fluid'` | `contained` centres a 1200px column (legacy `nsw-container` parity).                                                         |
| `containerClassName` | `string`                                 | —         | Classes for the inner width-constraining wrapper.                                                                            |

#### `Header`, `HeaderBrand`, `HeaderActions`

`banner` landmark. Render once in a shared layout, below `SkipLinks` and `Masthead`, and keep it
out of `<main>`.

`Header`:

| Prop                 | Type                                     | Default   | Notes                                                                                 |
| -------------------- | ---------------------------------------- | --------- | ------------------------------------------------------------------------------------- |
| `color`              | `'dark' \| 'light' \| 'white' \| 'grey'` | `'white'` | All four are WCAG 2.2 AAA and follow the theme in dark mode.                          |
| `container`          | `'fluid' \| 'contained'`                 | `'fluid'` | Tune with the `--header-max-width` and `--header-padding-x` custom properties.        |
| `sticky`             | `boolean`                                | `true`    | Stick to the top of the viewport on scroll.                                           |
| `border`             | `boolean`                                | `true`    | Hairline rule on the bottom edge, derived from the surface ink.                       |
| `shadow`             | `boolean`                                | `true`    | Raise with a shadow once scrolled. Keys off `data-scrolled`, which is always exposed. |
| `containerClassName` | `string`                                 | —         | Classes for the inner wrapper.                                                        |

`HeaderBrand`:

| Prop           | Type                           | Default     | Notes                                                                                                                      |
| -------------- | ------------------------------ | ----------- | -------------------------------------------------------------------------------------------------------------------------- |
| `sitename`     | `ReactNode`                    | —           | Service name beside the logo.                                                                                              |
| `href`         | `string \| LinkUrlObject`      | `'/'`       | Home-page target.                                                                                                          |
| `headingLevel` | `2 \| 3 \| 4 \| 5 \| 6`        | —           | Omit to render a `<span>`, which is usually right: the page's `<h1>` belongs to its content. `1` is deliberately excluded. |
| `version`      | `ReactNode`                    | —           | Version string in a Badge. Sits outside the link, so it never joins the home link's accessible name.                       |
| `versionLabel` | `string`                       | `'Version'` | Visually-hidden prefix. Pass `''` to suppress.                                                                             |
| `badgeProps`   | `Omit<BadgeProps, 'children'>` | —           | Forwarded to the version Badge. `undefined`/`null` fall back to the surface-aware defaults rather than cva's.              |
| `logo`         | `boolean \| ReactNode`         | `true`      | `false` omits the waratah; a node replaces it with an agency lockup.                                                       |
| `label`        | `string`                       | —           | Set only when the brand renders no text — overriding it otherwise breaks WCAG 2.5.3 Label in Name.                         |

`HeaderActions` takes no own props. It is the trailing control cluster (search, theme switcher,
sign-in) and is deliberately **not** a `nav` landmark — wrap real navigation in your own `<nav>`.

#### `Footer` and its slots

`contentinfo` landmark. Themeable across 13 surface colours.

| Prop              | Type                             | Default      | Notes                                                                                                                                |
| ----------------- | -------------------------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| `color`           | `FooterColor`                    | `'white'`    | One of `primary-800\|600\|400\|200`, `grey-*`, `accent-*`, `white`. The logo treatment follows automatically via `footerLogoType()`. |
| `container`       | `'fluid' \| 'contained'`         | `'fluid'`    |                                                                                                                                      |
| `legalLinks`      | `{ name, href }[]`               | `[]`         | Privacy, accessibility, copyright.                                                                                                   |
| `socialLinks`     | `{ name, href, icon, label? }[]` | —            | `icon` takes a component or an element — see [Icons in a server component](#icons). Brand marks live in `@nswds/ui/icons/brands`.    |
| `department`      | `string`                         | —            | Owning agency, shown in the small print.                                                                                             |
| `acknowledgement` | `boolean \| ReactNode`           | `true`       | Acknowledgement of Country. A node replaces the default wording.                                                                     |
| `smallPrint`      | `boolean`                        | `true`       |                                                                                                                                      |
| `topBorder`       | `boolean`                        | `true`       |                                                                                                                                      |
| `year`            | `number`                         | current year | Copyright year. Pass it explicitly for reproducible builds and snapshot tests.                                                       |

Compose a richer footer from `FooterNav`, `FooterNavColumn` (`heading`, `links`, `headingLevel`),
`FooterAcknowledgement`, `FooterLegalLinks`, `FooterSmallPrint` and `FooterSocialLink` — or start
from one of the eight footer [blocks](#blocks-12).

#### `SkipLink`, `SkipLinks`

Focus-revealed bypass links. Render `SkipLinks` first in the body, above `Masthead`.

| Prop    | Type                                     | Default  | Notes                                                       |
| ------- | ---------------------------------------- | -------- | ----------------------------------------------------------- |
| `href`  | `string`                                 | —        | Required on `SkipLink`. Point it at your `<main id="...">`. |
| `color` | `'dark' \| 'light' \| 'white' \| 'grey'` | `'dark'` | Same four-name vocabulary as Masthead and Header.           |

### Navigation

#### `MainNav`

Full-width nav bar with mega-menu panels.

| Prop           | Type                                    | Default                            | Notes                                                                       |
| -------------- | --------------------------------------- | ---------------------------------- | --------------------------------------------------------------------------- |
| `navigation`   | `MainNavItem[]`                         | —                                  | Required. `{ title, href?, links? }`; supply `links` for a mega-menu panel. |
| `currentHref`  | `string`                                | —                                  | Marks the matching item `aria-current="page"`.                              |
| `color`        | `MainNavColor`                          | `'white'`                          | Same 13-colour vocabulary as Footer.                                        |
| `border`       | `'none' \| 'top' \| 'bottom' \| 'both'` | `'none'`                           |                                                                             |
| `container`    | `'fluid' \| 'contained'`                | `'fluid'`                          |                                                                             |
| `sticky`       | `boolean`                               | `false`                            |                                                                             |
| `shadow`       | `boolean`                               | `true`                             |                                                                             |
| `emptyMessage` | `ReactNode`                             | `'No navigation items available.'` | Rendered when `navigation` is empty.                                        |

#### `SideNav`

Vertical section nav with arbitrary collapsible nesting; the active branch auto-expands.

| Prop           | Type                                   | Default                            | Notes                                            |
| -------------- | -------------------------------------- | ---------------------------------- | ------------------------------------------------ |
| `sections`     | `SideNavItem[]`                        | —                                  | Required. `{ title, href?, links? }`, recursive. |
| `currentHref`  | `string`                               | —                                  |                                                  |
| `onNavigate`   | `MouseEventHandler<HTMLAnchorElement>` | —                                  | For client-side routing.                         |
| `headingLevel` | `2 \| 3 \| 4 \| 5 \| 6`                | `2`                                |                                                  |
| `emptyMessage` | `ReactNode`                            | `'No navigation items available.'` |                                                  |

#### `TabNav`, `TabNavLink`

Flat horizontal navigation **between pages** of a section. Not `Tabs` — that switches panels
within one page; this navigates.

| Prop          | Type      | Notes                                                       |
| ------------- | --------- | ----------------------------------------------------------- |
| `currentHref` | `string`  | On `TabNav`; marks the matching link `aria-current="page"`. |
| `border`      | `boolean` | On `TabNav`.                                                |
| `current`     | `boolean` | On `TabNavLink`, when you mark it yourself.                 |

#### `PushMenu`

Multi-level drill-down menu for mobile drawers, with focus management and inert parked levels.

| Prop              | Type                       | Default        | Notes                                     |
| ----------------- | -------------------------- | -------------- | ----------------------------------------- |
| `navigation`      | `PushMenuItem[]`           | —              | Required. `{ id, title, href?, links? }`. |
| `currentHref`     | `string`                   | —              |                                           |
| `title`           | `string`                   | `'Menu'`       | Root level heading.                       |
| `onItemClick`     | `(item) => void`           | —              |                                           |
| `onNavigate`      | `(level, history) => void` | —              | Fires on every level change.              |
| `onClose`         | `() => void`               | —              |                                           |
| `showBreadcrumbs` | `boolean`                  | `true`         |                                           |
| `durationMs`      | `number`                   | `300`          | Also exported as `PUSH_MENU_DURATION_MS`. |
| `backLabel`       | `string`                   | `'Back'`       |                                           |
| `closeLabel`      | `string`                   | `'Close menu'` |                                           |
| `submenuLabel`    | `ReactNode`                | `'submenu'`    |                                           |
| `escapeGoesBack`  | `boolean`                  | `true`         | Escape pops one level instead of closing. |
| `headingLevel`    | `2 \| 3 \| 4 \| 5 \| 6`    | `2`            |                                           |

`generatePushMenuBreadcrumb(levels, maxLength?)` builds the breadcrumb string and is exported
separately, so you can render it yourself.

#### `OnThisPage`

In-page anchor navigation that tracks the reader's position and marks it `aria-current="location"`.

| Prop                          | Type                              | Default        | Notes                                                                          |
| ----------------------------- | --------------------------------- | -------------- | ------------------------------------------------------------------------------ |
| `items`                       | `{ id, title }[]`                 | —              | Required; `id` must match an element id on the page.                           |
| `orientation`                 | `'horizontal' \| 'vertical'`      | `'horizontal'` |                                                                                |
| `offset`                      | `number`                          | `0`            | Scroll-spy offset. Feed it `useChromeHeight`'s `height` under a sticky header. |
| `activeId` / `onActiveChange` | `string \| null` / `(id) => void` | —              | Controlled mode.                                                               |
| `emptyMessage`                | `ReactNode`                       | —              |                                                                                |

#### `StepIndicator`, `StepNav`

Ordered multi-step progress.

| Prop           | Type                                   | Notes                                     |
| -------------- | -------------------------------------- | ----------------------------------------- |
| `steps`        | `Step[]`                               | `{ title, description?, href, status? }`. |
| `sections`     | `StepNavSection[]`                     | `StepNav` only — `{ title, steps }`.      |
| `currentHref`  | `string`                               | Sets `aria-current="step"`.               |
| `onNavigate`   | `MouseEventHandler<HTMLAnchorElement>` |                                           |
| `statusLabels` | `Partial<Record<StepStatus, string>>`  | Localise the status text.                 |
| `headingLevel` | `2 \| 3 \| 4 \| 5 \| 6`                | `StepNav` only; defaults to `2`.          |

`StepStatus` is `'default' \| 'not-started' \| 'in-progress' \| 'completed' \| 'saved' \| 'error' \| 'cannot-start'`.
`stepStatusStyles` exposes each status's ink, connector, marker shape, icon and disabled flag.

#### `SiteSearch`

Cmd/Ctrl-K search palette on the Base UI autocomplete and dialog primitives.

| Prop                                    | Type                   | Default                               | Notes                                                             |
| --------------------------------------- | ---------------------- | ------------------------------------- | ----------------------------------------------------------------- |
| `groups`                                | `SiteSearchGroup[]`    | —                                     | Required. `{ title, items }`, items `{ title, href, keywords? }`. |
| `onSelect`                              | `(item) => void`       | —                                     | Required. Routing is yours — the component never navigates.       |
| `open` / `onOpenChange` / `defaultOpen` |                        |                                       | Controlled or uncontrolled.                                       |
| `shortcut`                              | `boolean`              | `true`                                | Bind Cmd/Ctrl-K.                                                  |
| `label`                                 | `string`               | `'Search site'`                       |                                                                   |
| `placeholder`                           | `string`               | `'Type to search across the site...'` |                                                                   |
| `emptyMessage`                          | `string`               | `'No results found.'`                 |                                                                   |
| `trigger`                               | `ReactElement \| null` |                                       | `null` for keyboard-only.                                         |

#### `ExpandableSearch`, `ExpandableSearchField`

A 48px search button that expands into a field on focus.

| Prop                                    | Type                      | Notes                                              |
| --------------------------------------- | ------------------------- | -------------------------------------------------- |
| `onAction`                              | `(value: string) => void` | On `ExpandableSearch`. Submit handler.             |
| `variant`                               | `ExpandableSearchVariant` | Same 13 surface colours as Footer, plus `default`. |
| `label` / `buttonLabel` / `buttonProps` |                           | On `ExpandableSearchField`.                        |

### Layout and content

#### `Container`

| Prop   | Type                                           | Default   | Notes                                                                    |
| ------ | ---------------------------------------------- | --------- | ------------------------------------------------------------------------ |
| `size` | `'narrow' \| 'contained' \| 'wide' \| 'fluid'` | `'fluid'` | Carries the same lateral rhythm as Masthead, Header, MainNav and Footer. |

#### `Section`

| Prop         | Type                                        | Default     | Notes                                                                                                                                                                               |
| ------------ | ------------------------------------------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `spacing`    | `'none' \| 'tight' \| 'default' \| 'loose'` | `'default'` |                                                                                                                                                                                     |
| `divider`    | `boolean`                                   | `false`     |                                                                                                                                                                                     |
| `labelledBy` | `string`                                    | —           | Id of the section's heading. Supplying it makes the section a **named `region` landmark**; omitting it leaves a plain `<section>`. Prefer supplying it for top-level page sections. |

#### `Callout`

| Prop     | Type                                           | Default        | Notes                                                                        |
| -------- | ---------------------------------------------- | -------------- | ---------------------------------------------------------------------------- |
| `status` | `'info' \| 'success' \| 'warning' \| 'danger'` | `'info'`       | Uses the semantic role tokens, so it re-brands and dark-mode-flips for free. |
| `title`  | `ReactNode`                                    | —              |                                                                              |
| `icon`   | `ElementType \| null`                          | status default | `null` removes it.                                                           |

#### `LinkCard`

A card whose whole surface is one link — one tab stop, one accessible name.

| Prop                    | Type                      | Notes                              |
| ----------------------- | ------------------------- | ---------------------------------- |
| `href`                  | `string \| LinkUrlObject` | Required.                          |
| `title`                 | `ReactNode`               | Required.                          |
| `label` / `description` | `ReactNode`               | Eyebrow and body.                  |
| `external`              | `boolean`                 | Adds the external-link affordance. |

#### `DescriptionList`, `DescriptionTerm`, `DescriptionDetails`

| Prop     | Type                                 | Default     |
| -------- | ------------------------------------ | ----------- |
| `layout` | `'stacked' \| 'columns' \| 'inline'` | `'stacked'` |

#### `Logo`

| Prop       | Type                                                      | Default     | Notes                                                    |
| ---------- | --------------------------------------------------------- | ----------- | -------------------------------------------------------- |
| `logoType` | `'default' \| 'reversed' \| 'mono-white' \| 'mono-black'` | `'default'` | `Footer` picks this for you via `footerLogoType(color)`. |
| `wordmark` | `'full' \| 'nsw'`                                         | `'full'`    |                                                          |

#### `ThemeSwitcher`

Framework-free light/dark toggle. It holds no theme itself — wire it to `next-themes` or your own store.

| Prop            | Type                | Notes         |
| --------------- | ------------------- | ------------- |
| `theme`         | `'light' \| 'dark'` | Controlled.   |
| `defaultTheme`  | `'light' \| 'dark'` | Uncontrolled. |
| `onThemeChange` | `(theme) => void`   |               |

It also takes every `Button` prop except `children`.

### Links and routing

#### `Link`, `LinkProvider`, `ExternalLink`

`Link` renders a plain `<a>` until you give it a framework link component. Do that once, at the
root, and every component that renders a link — `HeaderBrand`, `Footer`, `MainNav`, `SideNav`,
`TabNav`, `LinkCard`, `ButtonLink` — routes client-side.

```tsx
import NextLink from 'next/link'
import { LinkProvider } from '@nswds/ui'

;<LinkProvider component={NextLink}>{children}</LinkProvider>
```

| Prop                   | Type                                                | Notes                                            |
| ---------------------- | --------------------------------------------------- | ------------------------------------------------ |
| `href`                 | `string \| LinkUrlObject`                           | The object form matches next/link's `UrlObject`. |
| `as`                   | `ElementType`                                       | Per-call override of the provider's component.   |
| `variant`              | `'primary' \| 'secondary' \| 'white' \| 'unstyled'` |                                                  |
| `newTabLabel` / `icon` | `string` / `ReactNode \| null`                      | `ExternalLink` only.                             |

### Buttons

#### `Button`, `ButtonLink`

`ButtonLink` is the same surface rendered as a link — use it whenever the control navigates.

| Prop                                                  | Type                                                                                                            | Default     | Notes                                                |
| ----------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | ----------- | ---------------------------------------------------- |
| `variant`                                             | `'solid' \| 'soft' \| 'surface' \| 'outline' \| 'link' \| 'ghost'`                                              | `'solid'`   |                                                      |
| `color`                                               | `'primary' \| 'secondary' \| 'tertiary' \| 'accent' \| 'danger' \| 'success' \| 'warning' \| 'grey' \| 'white'` | `'primary'` |                                                      |
| `size`                                                | `'sm' \| 'default' \| 'lg' \| 'icon'`                                                                           | `'default'` |                                                      |
| `leadingVisual` / `trailingVisual` / `trailingAction` | `IconSlot`                                                                                                      | —           | A component **or** an element — see [Icons](#icons). |
| `loading`                                             | `boolean`                                                                                                       | `false`     | Swaps in a spinner and disables.                     |
| `block`                                               | `boolean`                                                                                                       | `false`     | Full width.                                          |
| `iconOnly`                                            | `boolean`                                                                                                       | —           | Give it an `aria-label`.                             |
| `alignContent`                                        | `'center' \| 'start'`                                                                                           | `'center'`  |                                                      |
| `labelWrap`                                           | `boolean`                                                                                                       | `false`     | Allow the label to wrap.                             |
| `count` / `countLabel`                                | `number` / `string`                                                                                             | —           | Trailing count badge and its screen-reader label.    |

`TouchTarget` expands a small control's hit area to the 44px WCAG 2.5.8 minimum without changing
its painted size.

### Hooks

#### `useChromeHeight`

Measures a sticky element and publishes its height as a CSS custom property, keeping it current
as the element resizes.

```tsx
const { ref, height } = useChromeHeight<HTMLElement>({ property: '--header-height' })
```

| Option     | Type             | Default             | Notes                                                            |
| ---------- | ---------------- | ------------------- | ---------------------------------------------------------------- |
| `property` | `string \| null` | `'--chrome-height'` | `null` to skip writing a custom property and just read `height`. |

Returns `{ ref, height }`. Use it for `scroll-padding-top`, `MainNav`'s `--main-nav-top`, and
`OnThisPage`'s `offset`.

---

## Icons

3,921 Material Symbols ship as individual modules, so your bundle contains only what you import.
This is verified on every build by `scripts/test-consumer-fixture.sh`, which asserts an imported
icon reaches the bundle and an unimported one does not.

```tsx
import { IconSearch } from '@nswds/ui/icons' // tree-shaken from the barrel
import { IconAdd } from '@nswds/ui/icons/add' // or directly
```

Icon slots (`leadingVisual`, `trailingVisual`, `trailingAction`, `socialLinks[].icon`) accept
**either the component or an element** — the `IconSlot` type is
`React.ElementType | React.ReactElement`.

In a **React Server Component, pass the element**: `leadingVisual={<IconDownload />}`. The icon
modules are deliberately not client components, so a bare icon function is just a function value,
and functions do not serialise across the RSC boundary. Passing the component throws
_"Functions cannot be passed directly to Client Components."_ When you genuinely need the
component form on a server page, import from `@nswds/ui/icons/client`, which re-exports the same
set as client references — at the cost of shipping the icon module to the browser.

Brand marks are not in Material Symbols and ship separately, already client-safe:

```tsx
import {
  IconFacebook,
  IconGitHub,
  IconInstagram,
  IconLinkedIn,
  IconX,
  IconYouTube,
} from '@nswds/ui/icons/brands'
```

The registry's `@nswds/icons` item carries only the curated subset the shipped components use —
the full set is npm-only.

---

## Export subpaths

| Subpath                    | Contains                                                    |
| -------------------------- | ----------------------------------------------------------- |
| `@nswds/ui`                | All components, hooks, `cn`, and every `*Variants` function |
| `@nswds/ui/styles.css`     | Precompiled stylesheet with token values inlined            |
| `@nswds/ui/components/*`   | A single component module                                   |
| `@nswds/ui/icons`          | Icon barrel (tree-shakeable)                                |
| `@nswds/ui/icons/*`        | A single icon module                                        |
| `@nswds/ui/icons/brands`   | The six brand marks                                         |
| `@nswds/ui/postcss.config` | Shared PostCSS config                                       |

There is no `@nswds/ui/hooks/*` or `@nswds/ui/lib/*` — `cn` comes from the root barrel. The
in-repo `@nswds/ui/globals.css` specifier is a Storybook alias, **not** a published subpath.

---

## Related

- [Build your first NSW page](tutorial-build-your-first-page.md) — start here if you have not used the system before
- [Design tokens](reference-tokens.md) — what the components' colours resolve to
- [Theme and re-brand](howto-theme-and-rebrand.md) — changing those values
- [Installing from the registry](installing-from-the-registry.md) — the copy-the-source channel
- [Architecture](explanation-architecture.md) — why there are two channels at all
