import { describe, expect, it } from 'vitest'

import { reportedPage } from './report-path'

describe('reportedPage', () => {
  it('reports a page at its path, and a dynamic route as its pattern', () => {
    expect(reportedPage('', '/', {})).toEqual({ route: '/', path: '/' })
    expect(reportedPage('', '/components/button', null)).toEqual({
      route: '/components/button',
      path: '/components/button',
    })
    expect(
      reportedPage('', '/components/button', { section: 'components', slug: 'button' }),
    ).toEqual({ route: '/[section]/[slug]', path: '/components/button' })
  })

  it("states a zone's page with its basePath", () => {
    expect(reportedPage('/signature', '/', {})).toEqual({ route: '/signature', path: '/signature' })
    expect(reportedPage('/infographics', '/account', {})).toEqual({
      route: '/infographics/account',
      path: '/infographics/account',
    })
  })

  it('redacts a segment holding an email address in both the route and the path', () => {
    expect(reportedPage('/signature', '/a@b.c', {})).toEqual({
      route: '/signature/%5Bredacted%5D',
      path: '/signature/%5Bredacted%5D',
    })
    // A dynamic segment's value becomes its template in the route, so only the path holds it.
    expect(reportedPage('', '/people/a@b.c', { person: 'a@b.c' })).toEqual({
      route: '/people/[person]',
      path: '/people/%5Bredacted%5D',
    })
    // Encoded in the path, the value no longer matches its param, and the route is the path:
    // redacted as well.
    expect(reportedPage('', '/people/a%40b.c', { person: 'a@b.c' })).toEqual({
      route: '/people/%5Bredacted%5D',
      path: '/people/%5Bredacted%5D',
    })
  })
})
