'use client'

import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'

const motionReduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const motionOff = () => document.documentElement.classList.contains('motion-off')

type ScrollFXProps = {
  children: ReactNode
  className?: string
}

export function ScrollFX({ children, className = '' }: ScrollFXProps) {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scene = rootRef.current
    if (!scene) return

    const depths = Array.from(scene.querySelectorAll<HTMLElement>('[data-depth]'))
    const orbits = Array.from(scene.querySelectorAll<HTMLElement>('[data-orbit]'))
    const fades = Array.from(scene.querySelectorAll<HTMLElement>('[data-fade]'))
    const reveals = Array.from(scene.querySelectorAll<HTMLElement>('[data-reveal3d]'))

    const reset = () => {
      for (const el of depths) el.style.transform = ''
      for (const el of orbits) el.style.transform = ''
      for (const el of fades) el.style.opacity = ''
      for (const el of reveals) el.classList.add('is-visible')
    }

    if (motionReduced() || motionOff()) {
      reset()
      return
    }

    let raf = 0
    const tick = () => {
      raf = 0
      if (motionOff()) return
      const vh = window.innerHeight || 1

      for (const el of depths) {
        const rect = el.getBoundingClientRect()
        const delta = (rect.top + rect.height / 2 - vh / 2) / vh
        const depth = Number(el.dataset.depth ?? 0)
        el.style.transform = `translate3d(0, ${(-(delta * depth * 70)).toFixed(2)}px, 0)`
      }

      for (const el of orbits) {
        const rect = el.getBoundingClientRect()
        const delta = Math.max(0, (rect.top + rect.height / 2 - vh / 2) / vh)
        el.style.transform = `perspective(1100px) rotateX(${(delta * 18).toFixed(2)}deg) translate3d(0, ${(-(delta * 50)).toFixed(2)}px, 0)`
      }

      for (const el of fades) {
        const rect = el.getBoundingClientRect()
        const delta = Math.max(0, (rect.top + rect.height / 2 - vh / 2) / vh)
        const opacity = Math.max(0, 1 - delta * 1.8).toFixed(3)
        el.style.opacity = opacity
      }

      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
    )
    for (const el of reveals) observer.observe(el)

    const htmlClassObserver = new MutationObserver(() => {
      if (motionOff()) {
        cancelAnimationFrame(raf)
        raf = 0
        reset()
      } else if (!raf) {
        raf = requestAnimationFrame(tick)
      }
    })
    htmlClassObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    return () => {
      cancelAnimationFrame(raf)
      observer.disconnect()
      htmlClassObserver.disconnect()
    }
  }, [])

  return (
    <div ref={rootRef} className={`fx-scene${className ? ` ${className}` : ''}`}>
      {children}
    </div>
  )
}

type TiltCardProps = {
  children: ReactNode
  className?: string
  max?: number
}

export function TiltCard({ children, className = '', max = 7 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || motionReduced()) return
    if (!window.matchMedia('(pointer: fine)').matches) return

    let raf = 0
    const onMove = (e: MouseEvent) => {
      if (motionOff()) return
      const rect = el.getBoundingClientRect()
      if (!rect.width || !rect.height) return
      const px = (e.clientX - rect.left) / rect.width
      const py = (e.clientY - rect.top) / rect.height
      const rx = (0.5 - py) * max
      const ry = (px - 0.5) * max
      if (raf) cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        el.style.transition = 'transform 60ms linear'
        el.style.transform = `perspective(1000px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateZ(4px)`
      })
    }
    const onLeave = () => {
      if (raf) cancelAnimationFrame(raf)
      el.style.transition = 'transform 0.6s cubic-bezier(0.22, 0.61, 0.36, 1)'
      el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)'
      raf = 0
    }

    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [max])

  return (
    <div ref={ref} className={`tilt-3d ${className}`.trim()}>
      {children}
    </div>
  )
}