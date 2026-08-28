'use client'

import { createElement, useEffect, useRef } from 'react'
import { animate, scrambleText } from 'animejs'

interface ScrambleTextProps {
  text: string
  className?: string
  as?: string
  delay?: number
  duration?: number
  cursor?: string
}

export function ScrambleText({
  text,
  className = '',
  as = 'span',
  delay = 0,
  duration = 1100,
  cursor = '_',
}: ScrambleTextProps) {
  const ref = useRef<HTMLElement | null>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const start = () => {
      if (started.current) return
      started.current = true
      animate(el, {
        innerHTML: scrambleText({
          text,
          chars: '01!<>-_\\/[]{}=+*^?#$&@%',
          cursor,
          delay,
          duration,
          ease: 'out(1)',
          settleDuration: 700,
          settleRate: 45,
          revealRate: 55,
          perturbation: 0.65,
        }),
      })
    }

    const inView = () => {
      const r = el.getBoundingClientRect()
      return r.top < window.innerHeight && r.bottom > 0
    }

    if (inView()) {
      start()
      return
    }

    const timer = setTimeout(start, 3000)
    const onScroll = () => {
      if (inView()) {
        start()
        cleanup()
      }
    }
    const cleanup = () => {
      clearTimeout(timer)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return cleanup
  }, [text, delay, duration, cursor])

  return createElement(as, { ref, className } as never, text)
}
