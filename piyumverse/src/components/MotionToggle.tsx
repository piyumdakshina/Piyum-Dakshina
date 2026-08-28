'use client'

import { useEffect, useState } from 'react'

const STORAGE_KEY = 'piyumverse-motion'

export function MotionToggle() {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    const initial =
      stored === 'reduced' ||
      (stored === null &&
        typeof window.matchMedia === 'function' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    setReduced(initial)
    document.documentElement.classList.toggle('motion-off', initial)
  }, [])

  const toggle = () => {
    const next = !reduced
    setReduced(next)
    document.documentElement.classList.toggle('motion-off', next)
    try {
      localStorage.setItem(STORAGE_KEY, next ? 'reduced' : 'full')
    } catch {
      // storage unavailable — motion still toggles for this session
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="rail-btn"
      aria-label={reduced ? 'Enable animations' : 'Reduce animations'}
      aria-pressed={reduced}
      data-title={reduced ? 'Motion Off' : 'Motion On'}
    >
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        {reduced ? (
          <path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z" />
        ) : (
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        )}
      </svg>
    </button>
  )
}
