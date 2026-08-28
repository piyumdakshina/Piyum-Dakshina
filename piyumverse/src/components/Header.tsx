'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { resolveNavItems, type NavItem } from '@/lib/section-nav'
import { MotionToggle } from '@/components/MotionToggle'

interface HeaderProps {
  siteName: string
  socialLinks: { id?: string; platform?: string; url?: string; icon?: string }[]
  navItems?: { label?: string | null; href?: string | null }[]
}

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
  dot: <circle cx="12" cy="12" r="4" />,
}

export function Header({ siteName, socialLinks, navItems }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const nav = resolveNavItems(navItems)

  const scrollToSection = (e: React.MouseEvent, item: NavItem) => {
    if (pathname !== '/') return
    if (!item.sectionId) return
    const el = document.getElementById(item.sectionId)
    if (!el) return
    e.preventDefault()
    setMobileOpen(false)
    el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <header className="xl:hidden fixed top-0 left-0 right-0 z-50 bg-obsidian/80 backdrop-blur-xl border-b border-grey">
        <div className="px-4 py-2.5 flex items-center justify-between">
          <Link href="/" className="text-lg font-semibold text-text-primary">
            {siteName}
            <span className="text-cyan">.</span>
          </Link>
          <button
            className="w-11 h-11 rounded-full border border-surface-light flex items-center justify-center text-text-primary hover:border-cyan/50 hover:text-cyan transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <svg width="20" height="20" viewBox="0 0 20 12" fill="currentColor">
              {mobileOpen ? (
                <path d="M5.64 11.3l4.36-4.36 4.36 4.36L16.36 9.3 12 4.94 16.36.58 14.36-1.42 10 2.94 5.64-1.42 3.64.58 8 4.94 3.64 9.3z" />
              ) : (
                <path d="M1.333 0h17.334v2H1.333V0zm0 5h17.334v2H1.333V5zm0 5h17.334v2H1.333v-2z" />
              )}
            </svg>
          </button>
        </div>
      </header>

      <div
        className={`xl:hidden fixed top-0 right-0 h-full w-[85%] max-w-xs z-[60] bg-obsidian-light border-l border-grey transition-transform duration-300 overflow-y-auto py-12 px-8 ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <button
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-surface text-white text-sm flex items-center justify-center"
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
        >
          ✕
        </button>

        <div className="mb-6 text-lg font-medium text-text-primary">Menu</div>
        <ul className="space-y-5 font-normal">
          {nav.map((item) => (
            <li key={`${item.label}-${item.href}`}>
              <Link
                href={item.href}
                onClick={(e) => {
                  scrollToSection(e, item)
                  setMobileOpen(false)
                }}
                className="flex items-center gap-3 transition-colors text-text-secondary hover:text-cyan"
              >
                <span className="w-5 text-current">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
                    {paths[item.sectionId || ''] || paths.dot}
                  </svg>
                </span>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <br />
        <br />
        <div className="mb-4 font-medium text-text-primary">Get in Touch</div>
        <div className="flex items-center gap-4">
          {socialLinks.length > 0 ? (
            socialLinks.map((link) => (
              <a
                key={link.id}
                href={link.url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-secondary hover:text-cyan transition-colors text-lg"
                title={link.platform}
              >
                {link.icon || link.platform?.charAt(0)}
              </a>
            ))
          ) : (
            <Link href="/contact" className="text-text-secondary hover:text-cyan transition-colors text-lg">
              ✉
            </Link>
          )}
        </div>

        <br />
        <div className="flex items-center gap-3">
          <span className="text-sm text-text-secondary">Animations</span>
          <MotionToggle />
        </div>
      </div>

      {mobileOpen && (
        <div
          className="xl:hidden fixed inset-0 z-[55] bg-black/60"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  )
}
