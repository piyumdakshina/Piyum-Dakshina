'use client'

import { useEffect } from 'react'

export function PWA() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return
    if (!('serviceWorker' in navigator)) return

    const register = async () => {
      try {
        await navigator.serviceWorker.register('/sw.js', { scope: '/' })
      } catch {
        // SW unavailable — the site still works fully online
      }
    }

    const onLoad = () => register()
    window.addEventListener('load', onLoad)
    const timer = window.setTimeout(register, 3000)

    return () => {
      window.removeEventListener('load', onLoad)
      window.clearTimeout(timer)
    }
  }, [])

  return null
}