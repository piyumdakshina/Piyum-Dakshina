'use client'

import { useEffect, useState } from 'react'

import { ScrambleText } from '@/components/effects/ScrambleText'

export function Preloader() {
  const [fading, setFading] = useState(false)
  const [gone, setGone] = useState(false)

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFading(true), 1600)
    const removeTimer = setTimeout(() => setGone(true), 2150)
    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(removeTimer)
    }
  }, [])

  if (gone) return null

  return (
    <div
      className={`preloader fixed inset-0 z-[10000] flex items-center justify-center bg-obsidian transition-opacity duration-500 ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      aria-hidden="true"
    >
      <div className="loader-line" />
      <div className="relative w-20 h-20 rounded-full border border-grey bg-obsidian-light flex items-center justify-center">
        <span className="text-2xl font-semibold text-cyan glow-text">P</span>
      </div>
      <div className="absolute top-[58%] w-full flex justify-center">
        <ScrambleText
          as="span"
          text="piyum_dakshina@dev:~$"
          className="text-sm font-mono tracking-wider text-text-secondary"
          duration={1000}
        />
      </div>
    </div>
  )
}
