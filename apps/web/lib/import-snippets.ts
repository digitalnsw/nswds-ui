/** npm-channel import snippets shown on each component page. */
const importNames: Record<string, string[]> = {
  logo: ['Logo'],
  masthead: ['Masthead'],
  'skip-link': ['SkipLink', 'SkipLinks'],
  header: ['Header', 'HeaderBrand', 'HeaderActions'],
  footer: ['Footer', 'FooterNav', 'FooterNavColumn'],
  'main-nav': ['MainNav'],
  'side-nav': ['SideNav'],
  'push-menu': ['PushMenu'],
  'site-search': ['SiteSearch'],
  'expandable-search': ['ExpandableSearch', 'ExpandableSearchField'],
  link: ['Link', 'ExternalLink', 'LinkProvider'],
  'step-indicator': ['StepIndicator', 'StepNav'],
  button: ['Button', 'ButtonLink'],
  field: ['Field', 'FieldLabel', 'FieldDescription', 'FieldError'],
  input: ['Input'],
  label: ['Label'],
  'theme-switcher': ['ThemeSwitcher'],
  card: ['Card', 'CardHeader', 'CardTitle', 'CardContent', 'CardFooter'],
  badge: ['Badge', 'BadgeButton', 'BadgeLink'],
  separator: ['Separator'],
  'labeled-separator': ['LabeledSeparator'],
  'aspect-ratio': ['AspectRatio'],
  'scroll-area': ['ScrollArea'],
  resizable: ['ResizablePanelGroup', 'ResizablePanel', 'ResizableHandle'],
  collapsible: ['Collapsible', 'CollapsibleTrigger', 'CollapsibleContent'],
  drawer: ['Drawer', 'DrawerTrigger', 'DrawerContent', 'DrawerTitle'],
  sheet: ['Sheet', 'SheetTrigger', 'SheetContent', 'SheetTitle'],
  popover: ['Popover', 'PopoverTrigger', 'PopoverContent', 'PopoverTitle'],
  'hover-card': ['HoverCard', 'HoverCardTrigger', 'HoverCardContent'],
  tooltip: ['Tooltip', 'TooltipTrigger', 'TooltipContent', 'TooltipProvider'],
  sonner: ['Toaster'],
  spinner: ['Spinner'],
}

/**
 * The npm import snippet for a component slug, or null for items that aren't
 * consumed as a barrel import (the theme tokens, the per-icon modules).
 */
export function importSnippet(slug: string): string | null {
  if (slug === 'icons') {
    return `// Per-icon modules keep the 3,900-icon set tree-shakeable\nimport { IconSearch } from '@nswds/ui/icons/search'`
  }
  if (slug === 'theme') {
    return `/* The compiled stylesheet ships every token layer */\n@import '@nswds/ui/styles.css';`
  }
  const names = importNames[slug]
  if (!names) {
    return null
  }
  return `import { ${names.join(', ')} } from '@nswds/ui'`
}
