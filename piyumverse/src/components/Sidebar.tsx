import Link from 'next/link'

import { WordRotate } from '@/components/effects/WordRotate'

interface SidebarProps {
  siteName: string
}

const metaInfo = [
  { label: 'Residence', value: 'Sri Lanka' },
  { label: 'Language', value: 'Sinhala · English' },
  { label: 'Focus', value: 'Web Development' },
]

const miniSkills = [
  { label: 'HTML', percent: 90 },
  { label: 'CSS', percent: 85 },
  { label: 'JS', percent: 88 },
  { label: 'React', percent: 92 },
]

function MiniRing({ percent, label }: { percent: number; label: string }) {
  const radius = 20
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percent / 100) * circumference

  return (
    <div className="space-y-2 text-center">
      <div className="relative w-12 h-12">
        <svg viewBox="0 0 48 48" className="w-full h-full -rotate-90">
          <circle
            cx="24"
            cy="24"
            r={radius}
            fill="none"
            stroke="rgba(255, 255, 255, 0.12)"
            strokeWidth="3"
          />
          <circle
            cx="24"
            cy="24"
            r={radius}
            fill="none"
            stroke="#18A0C0"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ filter: 'drop-shadow(0 0 4px rgba(114,229,248,0.6))' }}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-[13px] font-medium text-text-primary">
          {percent}%
        </span>
      </div>
      <p className="text-[13px] font-light text-white/90">{label}</p>
    </div>
  )
}

export function Sidebar({ siteName }: SidebarProps) {
  const initial = siteName.charAt(0) || 'P'

  return (
    <aside className="hidden xl:block fixed top-1/2 -translate-y-1/2 left-4 2xl:left-14 z-40 w-80 2xl:w-[22.75rem]">
      <div className="glass-card p-3">
        <div className="mx-4 mt-12 text-center lg:mx-6">
          <Link
            href="/"
            className="w-36 h-36 mb-2.5 block mx-auto rounded-full overflow-hidden border-[6px] border-[#2f2f2f]"
            aria-label="Home"
          >
            <span className="flex items-center justify-center w-full h-full bg-surface bg-grid text-6xl font-semibold text-white/90">
              {initial}
            </span>
          </Link>
          <h6 className="mb-1 text-lg font-semibold text-text-primary">{siteName}</h6>
          <div className="leading-none word-rotate-wrap">
            <h6 className="text-sm cd-words text-cyan font-normal">
              <WordRotate words={['Web Developer', 'Entrepreneur', 'Dreamer', 'Runner']} />
            </h6>
          </div>
        </div>

        <div className="pt-6 mx-4 lg:mx-6 my-7 border-t border-surface">
          <ul className="space-y-3 text-sm">
            {metaInfo.map((item) => (
              <li key={item.label} className="flex">
                <span className="flex-1 font-medium text-text-primary">{item.label}:</span>
                <span className="text-text-secondary">{item.value}</span>
              </li>
            ))}
            <li className="flex">
              <span className="flex-1 font-medium text-text-primary">Status:</span>
              <span className="text-cyan flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-cyan opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan" />
                </span>
                Available
              </span>
            </li>
          </ul>
        </div>

        <div className="px-4 py-5 lg:py-6 lg:px-6 rounded-2xl bg-surface">
          <div className="text-sm font-medium text-text-primary">Skills</div>
          <div className="flex items-center justify-between my-4">
            {miniSkills.map((skill) => (
              <MiniRing key={skill.label} percent={skill.percent} label={skill.label} />
            ))}
          </div>
          <div className="mt-6">
            <Link href="/contact" className="btn-theme w-full justify-center text-center text-sm">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
                <rect x="2" y="4" width="20" height="16" rx="2" />
              </svg>
              GET IN TOUCH
            </Link>
          </div>
        </div>
      </div>
    </aside>
  )
}
