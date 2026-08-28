'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

interface GalleryItem {
  id: string
  imageUrl?: string | null
  caption?: string | null
  category?: string | null
}

interface GalleryGridProps {
  items: GalleryItem[]
  heading: string
  headingAccent: string
  headingRest: string
  subtitle: string
  badge: string
}

const categoryLabels: Record<string, string> = {
  athletics: 'Athletics',
  builds: 'Builds',
  personal: 'Personal',
  projects: 'Projects',
}

export function GalleryGrid({
  items,
  heading,
  headingAccent,
  headingRest,
  subtitle,
  badge,
}: GalleryGridProps) {
  const [active, setActive] = useState('all')
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  const categories = useMemo(() => {
    const seen = new Set<string>()
    for (const item of items) {
      if (item.category) seen.add(item.category)
    }
    return ['all', ...seen]
  }, [items])

  const visible = useMemo(
    () => (active === 'all' ? items : items.filter((i) => i.category === active)),
    [items, active],
  )

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index)
  }, [])

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null)
  }, [])

  const step = useCallback(
    (dir: 1 | -1) => {
      setLightboxIndex((current) => {
        if (current === null) return null
        return (current + dir + visible.length) % visible.length
      })
    },
    [visible.length],
  )

  useEffect(() => {
    if (lightboxIndex === null) return

    const previouslyFocused = document.activeElement as HTMLElement | null

    const focusableSelector =
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
      if (e.key === 'Tab') {
        const dialog = document.querySelector('[role="dialog"]')
        if (!dialog) return
        const focusables = [...dialog.querySelectorAll<HTMLElement>(focusableSelector)]
        if (focusables.length === 0) return
        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      previouslyFocused?.focus()
    }
  }, [lightboxIndex, closeLightbox, step])

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-grey bg-obsidian p-12 text-center">
        <div className="text-4xl mb-4">📷</div>
        <h2 className="text-xl font-medium text-cyan mb-2">No photos yet</h2>
        <p className="text-text-secondary">
          Photos will appear here once you upload them in the admin panel.
        </p>
      </div>
    )
  }

  const current = lightboxIndex !== null ? visible[lightboxIndex] : null

  return (
    <div className="relative">
      <span className="section-eyebrow">{badge}</span>
      <h1 className="minfo-title mt-5 mb-4 md:mt-10 md:mb-5">
        {heading} <span>{headingAccent}</span>
        {headingRest ? ` ${headingRest}` : ''}
      </h1>
      <p className="text-text-secondary mb-8 md:mb-10 max-w-2xl">{subtitle}</p>

      <div className="flex flex-wrap gap-2.5 mb-8" role="group" aria-label="Filter photos by category">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActive(cat)}
            aria-pressed={active === cat}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors duration-200 cursor-pointer ${
              active === cat
                ? 'border-cyan bg-cyan/15 text-cyan'
                : 'border-white/10 bg-white/5 text-text-secondary hover:border-cyan/40 hover:text-text-primary'
            }`}
          >
            {cat === 'all' ? 'All' : categoryLabels[cat] || cat}
          </button>
        ))}
      </div>

      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 [&>*]:mb-4">
        {visible.map((item, index) => (
          <figure
            key={item.id}
            className="break-inside-avoid relative group rounded-2xl overflow-hidden border border-white/10 bg-surface cursor-pointer hover:border-cyan/40 transition-colors duration-300"
          >
            <button
              type="button"
              onClick={() => openLightbox(index)}
              aria-label={`Open photo: ${item.caption || 'Untitled'}`}
              className="block w-full p-0 m-0 bg-transparent cursor-pointer text-left"
            >
              <img
                src={item.imageUrl || ''}
                alt={item.caption || 'Gallery photo'}
                loading="lazy"
                className="w-full h-auto block transition-transform duration-500 group-hover:scale-[1.04]"
              />
              <figcaption className="absolute inset-x-0 bottom-0 px-4 py-3 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="block text-sm font-medium text-white">
                  {item.caption || 'Untitled'}
                </span>
                {item.category && (
                  <span className="text-xs text-cyan/90">
                    {categoryLabels[item.category] || item.category}
                  </span>
                )}
              </figcaption>
            </button>
          </figure>
        ))}
      </div>

      {current && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 md:p-10"
          onClick={closeLightbox}
        >
          <button
            ref={closeRef}
            type="button"
            onClick={closeLightbox}
            aria-label="Close photo viewer"
            className="absolute top-5 right-5 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white text-xl flex items-center justify-center transition-colors cursor-pointer"
          >
            ✕
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              step(-1)
            }}
            aria-label="Previous photo"
            className="absolute left-3 md:left-8 top-1/2 -translate-y-1/2 w-11 h-11 md:w-12 md:h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer z-10"
          >
            ←
          </button>

          <figure
            className="max-w-4xl w-full max-h-full flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={current.imageUrl || ''}
              alt={current.caption || 'Gallery photo'}
              className="max-w-full max-h-[75vh] w-auto h-auto rounded-xl object-contain shadow-2xl"
            />
            <figcaption className="mt-4 text-center">
              <span className="block text-lg font-medium text-white">
                {current.caption || 'Untitled'}
              </span>
              {current.category && (
                <span className="text-sm text-cyan mt-1 inline-block">
                  {categoryLabels[current.category] || current.category}
                </span>
              )}
              <span className="block text-xs text-text-muted mt-1">
                {lightboxIndex! + 1} / {visible.length}
              </span>
            </figcaption>
          </figure>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              step(1)
            }}
            aria-label="Next photo"
            className="absolute right-3 md:right-8 top-1/2 -translate-y-1/2 w-11 h-11 md:w-12 md:h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer z-10"
          >
            →
          </button>
        </div>
      )}
    </div>
  )
}
