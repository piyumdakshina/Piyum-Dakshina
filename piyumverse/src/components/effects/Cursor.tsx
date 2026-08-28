'use client'

import { useEffect } from 'react'

export function Cursor() {
  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return

    const dot = document.createElement('div')
    const ring = document.createElement('div')
    dot.className = 'custom-cursor-dot'
    ring.className = 'custom-cursor-ring'
    document.body.appendChild(dot)
    document.body.appendChild(ring)
    document.documentElement.classList.add('custom-cursor-active')

    let x = window.innerWidth / 2
    let y = window.innerHeight / 2
    let rx = x
    let ry = y
    let raf = 0
    let running = false

    const position = (el: HTMLDivElement, cx: number, cy: number) => {
      el.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%)`
    }

    position(dot, x, y)
    position(ring, rx, ry)

    const tick = () => {
      running = false
      const dx = x - rx
      const dy = y - ry
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist > 0.5) {
        rx += dx * 0.25
        ry += dy * 0.25
        position(ring, rx, ry)
        raf = requestAnimationFrame(tick)
        running = true
      }
    }

    const onMove = (e: MouseEvent) => {
      x = e.clientX
      y = e.clientY
      position(dot, x, y)
      if (!running) {
        raf = requestAnimationFrame(tick)
        running = true
      }
      const target = e.target as Element | null
      const hovering = !!target?.closest?.(
        'a, button, input, textarea, select, [role="button"]',
      )
      ring.classList.toggle('is-hovering', hovering)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
      document.documentElement.classList.remove('custom-cursor-active')
      dot.remove()
      ring.remove()
    }
  }, [])

  return null
}
