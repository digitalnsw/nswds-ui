import type { MainNavItem, SideNavItem, SiteSearchGroup } from '@nswds/ui'

import { categorisedComponents, patternItems } from '@/lib/registry'

export const githubUrl = 'https://github.com/digitalnsw/nswds-ui'

/** Top navigation bar — mega panels for the two big sections. */
export const mainNavigation: MainNavItem[] = [
  {
    title: 'Components',
    href: '/components',
    links: categorisedComponents()
      .flatMap(({ items }) => items)
      .map((item) => ({ title: item.title, href: `/components/${item.name}` })),
  },
  {
    title: 'Patterns',
    href: '/patterns',
    links: patternItems.map((item) => ({ title: item.title, href: `/patterns/${item.name}` })),
  },
  { title: 'Icons', href: '/icons' },
  { title: 'Tokens', href: '/tokens' },
]

/** Left rail for the docs pages. */
export const sideNavSections: SideNavItem[] = [
  {
    title: 'Guides',
    links: [
      { title: 'Design tokens', href: '/tokens' },
      { title: 'Icons', href: '/icons' },
    ],
  },
  ...categorisedComponents().map(({ title, items }) => ({
    title,
    links: items.map((item) => ({ title: item.title, href: `/components/${item.name}` })),
  })),
  {
    title: 'Patterns',
    links: patternItems.map((item) => ({ title: item.title, href: `/patterns/${item.name}` })),
  },
]

/** Cmd/Ctrl-K search index. */
export const searchGroups: SiteSearchGroup[] = [
  {
    title: 'Foundations',
    items: [
      {
        title: 'Design tokens',
        href: '/tokens',
        keywords: ['colour', 'color', 'theme', 'palette'],
      },
      { title: 'Icons', href: '/icons', keywords: ['material', 'symbols', 'glyph'] },
    ],
  },
  {
    title: 'Components',
    items: categorisedComponents()
      .flatMap(({ items }) => items)
      .map((item) => ({
        title: item.title,
        href: `/components/${item.name}`,
        keywords: item.description.toLowerCase().split(/\W+/).filter(Boolean).slice(0, 8),
      })),
  },
  {
    title: 'Patterns',
    items: patternItems.map((item) => ({
      title: item.title,
      href: `/patterns/${item.name}`,
      keywords: ['pattern', 'block', 'example'],
    })),
  },
]
