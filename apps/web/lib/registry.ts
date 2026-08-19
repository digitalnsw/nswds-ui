import uiPackageJson from '../../../packages/ui/package.json'
import registry from '../../../packages/ui/registry.json'
import registryConfig from '../../../registry.config.json'

/** One file delivered by a registry item. */
export type RegistryFile = {
  path: string
  type: string
  target?: string
}

/** One item in packages/ui/registry.json. */
export type RegistryItem = {
  name: string
  type: string
  title: string
  description: string
  dependencies?: string[]
  registryDependencies?: string[]
  files?: RegistryFile[]
  docs?: string
}

/** Public URL consumers install from (proxied path on the docs domain). */
export const registryLocation: string = registryConfig.location

/** Current published @nswds/ui version. */
export const uiVersion: string = uiPackageJson.version

const items = registry.items as RegistryItem[]

/** Installable UI components and foundations (registry:ui + the theme). */
export const componentItems = items.filter(
  (item) => item.type === 'registry:ui' || item.type === 'registry:theme',
)

/** Copy-and-adapt worked examples (registry:block). */
export const patternItems = items.filter((item) => item.type === 'registry:block')

export function getComponent(slug: string): RegistryItem | undefined {
  return componentItems.find((item) => item.name === slug)
}

export function getPattern(slug: string): RegistryItem | undefined {
  return patternItems.find((item) => item.name === slug)
}

/** `npx shadcn add …` command for an item. */
export function installCommand(item: RegistryItem): string {
  return `npx shadcn@latest add ${registryLocation}/r/${item.name}.json`
}

/**
 * Registry-dependency URLs → sibling item names, for cross-linking. URLs point
 * at `<location>/r/<name>.json`; anything that doesn't parse is dropped.
 */
export function registryDependencyNames(item: RegistryItem): string[] {
  return (item.registryDependencies ?? [])
    .map((url) => /\/r\/([\w-]+)\.json$/.exec(url)?.[1])
    .filter((name): name is string => Boolean(name))
}

/** Display grouping for the components index and side navigation. */
export const componentCategories: { title: string; slugs: string[] }[] = [
  { title: 'Foundations', slugs: ['theme', 'icons', 'logo'] },
  { title: 'Page chrome', slugs: ['masthead', 'skip-link', 'header', 'footer'] },
  {
    title: 'Navigation',
    slugs: [
      'main-nav',
      'side-nav',
      'push-menu',
      'site-search',
      'expandable-search',
      'link',
      'step-indicator',
    ],
  },
  { title: 'Forms & actions', slugs: ['button', 'field', 'input', 'label', 'theme-switcher'] },
  {
    title: 'Content & layout',
    slugs: [
      'card',
      'badge',
      'separator',
      'labeled-separator',
      'aspect-ratio',
      'scroll-area',
      'resizable',
      'collapsible',
    ],
  },
  {
    title: 'Overlays & feedback',
    slugs: ['drawer', 'sheet', 'popover', 'hover-card', 'tooltip', 'sonner', 'spinner'],
  },
]

/** Categories with their resolved items, in display order. */
export function categorisedComponents() {
  const bySlug = new Map(componentItems.map((item) => [item.name, item]))
  const categorised = componentCategories.map(({ title, slugs }) => ({
    title,
    items: slugs
      .map((slug) => bySlug.get(slug))
      .filter((item): item is RegistryItem => Boolean(item)),
  }))
  // Anything registered but not yet categorised still gets listed, so a new
  // registry item never silently disappears from the docs.
  const categorisedSlugs = new Set(componentCategories.flatMap(({ slugs }) => slugs))
  const uncategorised = componentItems.filter((item) => !categorisedSlugs.has(item.name))
  if (uncategorised.length > 0) {
    categorised.push({ title: 'Other', items: uncategorised })
  }
  return categorised
}
