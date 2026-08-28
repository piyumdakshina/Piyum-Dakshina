'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

import { sectionIdForPath, resolveNavItems, type NavItem } from '@/lib/section-nav'
import { MotionToggle } from '@/components/MotionToggle'

const paths: Record<string, React.ReactNode> = {
  home: <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1v-9.5z" />,
  about: (
    <>
      <circle cx="12" cy="7.5" r="4" />
      <path d="M5 21v-1.5a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4V21" />
    </>
  ),
  skills: (
    <>
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 12 12 17 22 12" />
      <polyline points="2 17 12 22 22 17" />
    </>
  ),
  philosophy: (
    <>
      <path d="M2 3.5h6a4 4 0 0 1 4 4V21a3 3 0 0 0-3-3H2V3.5z" />
      <path d="M22 3.5h-6a4 4 0 0 0-4 4V21a3 3 0 0 1 3-3h7V3.5z" />
    </>
  ),
  athletics: <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />,
  portfolio: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
    </>
  ),
  blog: (
    <>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </>
  ),
  gallery: (
    <>
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2v11z" />
      <circle cx="12" cy="13" r="4" />
    </>
  ),
  contact: (
    <>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <polyline points="22,6 12,13 2,6" />
    </>
  ),
  share: (
    <>
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </>
  ),
  dot: <circle cx="12" cy="12" r="4" />,
}

interface NavRailProps {
  navItems?: { label?: string | null; href?: string | null }[]
}

export function NavRail({ navItems }: NavRailProps) {
  const pathname = usePathname()
  const [activeId, setActiveId] = useState<string | null>('home')
  const nav = resolveNavItems(navItems)

  useEffect(() => {
    if (pathname !== '/') {
      setActiveId(sectionIdForPath(pathname))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id)
        }
      },
      { rootMargin: '-30% 0px -60% 0px', threshold: 0 }
    )

    const ids = new Set(nav.map((item) => item.sectionId).filter((id): id is string => !!id))
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [pathname, nav])

  const onNavClick = (e: React.MouseEvent, item: NavItem) => {
    if (pathname !== '/') return
    if (!item.sectionId) return
    const el = document.getElementById(item.sectionId)
    if (!el) return
    e.preventDefault()
    el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav className="hidden xl:flex fixed top-1/2 -translate-y-1/2 right-4 2xl:right-14 z-40 flex-col items-center gap-4 border border-surface rounded-[2rem] px-2.5 py-4 bg-obsidian/70 backdrop-blur-md">
      <a
        href="/#home"
        onClick={(e) => {
          if (pathname === '/') {
            const el = document.getElementById('home')
            if (!el) return
            e.preventDefault()
            el.scrollIntoView({ behavior: 'smooth' })
          }
        }}
        className="w-12 h-12 rounded-full border border-surface flex items-center justify-center text-xl font-semibold text-cyan hover:bg-surface transition-colors"
        aria-label="The Piyumverse"
      >
        P
      </a>

      <div className="my-2 flex flex-col items-center gap-2">
        {nav.map((item) => (
          <a
            key={`${item.label}-${item.href}-${item.sectionId}`}
            href={item.href}
            data-title={item.label}
            onClick={(e) => onNavClick(e, item)}
            className={`rail-btn ${activeId === item.sectionId ? 'active' : ''}`}
            aria-label={item.label}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              {paths[item.sectionId || ''] || paths.dot}
            </svg>
          </a>
        ))}
      </div>

      <a
        href="/contact"
        data-title="Share"
        className="rail-btn"
        aria-label="Share"
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          {paths.share}
        </svg>
      </a>

      <div className="my-1 w-10 border-t border-surface" aria-hidden="true" />

      <MotionToggle />
    </nav>
  )
}
