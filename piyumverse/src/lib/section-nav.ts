export interface NavItem {
  label: string
  href: string
  sectionId?: string | null
}

export const defaultSectionNav: NavItem[] = [
  { label: 'Home', href: '/#home', sectionId: 'home' },
  { label: 'About', href: '/about', sectionId: 'about' },
  { label: 'Skills', href: '/#skills', sectionId: 'skills' },
  { label: 'Philosophy', href: '/philosophy', sectionId: 'philosophy' },
  { label: 'Athletics', href: '/athletics', sectionId: 'athletics' },
  { label: 'Portfolio', href: '/projects', sectionId: 'portfolio' },
  { label: 'Blog', href: '/blog', sectionId: 'blog' },
  { label: 'Gallery', href: '/gallery', sectionId: 'gallery' },
  { label: 'Contact', href: '/contact', sectionId: 'contact' },
]

/** Derive the homepage section id from a nav href for scroll-spy / icon mapping. */
export function sectionIdForHref(href: string): string | null {
  if (!href) return null

  const hashIndex = href.indexOf('#')
  if (hashIndex !== -1) {
    const fragment = href.slice(hashIndex + 1)
    if (fragment) return fragment
  }

  const path = href.split(/[?#]/)[0] || '/'
  if (path === '/') return 'home'

  const map: Record<string, string> = {
    '/about': 'about',
    '/skills': 'skills',
    '/philosophy': 'philosophy',
    '/athletics': 'athletics',
    '/projects': 'portfolio',
    '/blog': 'blog',
    '/gallery': 'gallery',
    '/contact': 'contact',
  }

  for (const [prefix, id] of Object.entries(map)) {
    if (path.startsWith(prefix)) return id
  }

  return null
}

export function sectionIdForPath(pathname: string): string | null {
  if (pathname === '/') return null
  if (pathname.startsWith('/projects')) return 'portfolio'
  if (pathname.startsWith('/blog')) return 'blog'
  if (pathname.startsWith('/gallery')) return 'gallery'
  if (pathname.startsWith('/philosophy')) return 'philosophy'
  if (pathname.startsWith('/athletics')) return 'athletics'
  if (pathname.startsWith('/contact')) return 'contact'
  if (pathname.startsWith('/about')) return 'about'
  return null
}

/** Resolve a list of CMS nav items, filling in derived section ids + hrefs. */
export function resolveNavItems(
  cmsItems?: { label?: string | null; href?: string | null }[],
): NavItem[] {
  if (!cmsItems || cmsItems.length === 0) return defaultSectionNav
  return cmsItems
    .filter((item) => item.label && item.href)
    .map((item) => {
      const href = (item.href || '').trim()
      return {
        label: item.label as string,
        href,
        sectionId: sectionIdForHref(href),
      }
    })
}