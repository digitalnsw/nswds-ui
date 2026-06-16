export const siteName = 'NSW Digital UI'

export const siteDescription =
  'NSW Digital UI Design System is a collection of components for building user interfaces in NSW Government.'

export const siteKeywords = ['NSW Government']

export const registryLocation =
  process.env.REGISTRY_LOCATION ?? 'https://nswds-ui-registry.vercel.app'

export const siteURL = new URL(registryLocation).origin
