import type { Metadata } from 'next'
import { RichText } from '@payloadcms/richtext-lexical/react'

import { Reveal } from '@/components/effects/Reveal'
import { getPayloadClient } from '@/lib/payload'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Athletics – The Runner\u2019s Code | Piyum Dakshina',
  description:
    "Piyum Dakshina's running journey – national-level sprinter, 11.7s 100m personal best, John Tarbet Nationals semi-finalist, and the discipline of the track.",
  alternates: {
    canonical: '/athletics',
  },
}

export default async function AthleticsPage() {
  const payload = await getPayloadClient()
  const page = await payload.findGlobal({ slug: 'athletics-page' })

  return (
    <section className="glass-card section-card">
      <Reveal>
        <span className="section-eyebrow">{page.badge || 'Athletics'}</span>
      </Reveal>

      <h1 className="minfo-title mb-4 mt-7 md:mt-10">
        {page.heading || 'The'} <span>{page.headingAccent || "Runner's"}</span>{' '}
        {page.headingRest || 'Code'}
      </h1>
      {page.subtitle && (
        <p className="text-text-secondary mb-10 max-w-2xl">{page.subtitle}</p>
      )}

        {page.personalBests && page.personalBests.length > 0 && (
          <div className="rounded-2xl border border-grey bg-obsidian p-8 mb-8">
            <h2 className="text-2xl font-medium text-text-primary mb-6">Personal Bests</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {page.personalBests.map((pb) => (
                <div key={pb.id} className="p-6 rounded-lg bg-surface/50 text-center">
                  <div className="text-3xl font-semibold text-teal mb-1">{pb.time}</div>
                  <div className="text-sm text-text-muted">{pb.event}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {page.whyRun && (
          <div className="rounded-2xl border border-grey bg-obsidian p-8">
            <h2 className="text-2xl font-medium text-text-primary mb-6">{page.whyRunHeading || 'Why I Run'}</h2>
            <RichText data={page.whyRun} className="rich-text" />
          </div>
        )}

        {page.achievements && page.achievements.length > 0 && (
          <div className="mt-8 rounded-2xl border border-grey bg-obsidian p-8">
            <h2 className="text-2xl font-medium text-text-primary mb-6">{page.achievementsHeading || 'Key Achievements'}</h2>
            <ul className="space-y-3">
              {page.achievements.map((achievement) => (
                <li key={achievement.id} className="flex items-start gap-3 text-text-secondary">
                  <span className="text-teal mt-0.5">▸</span>
                  {achievement.text}
                </li>
              ))}
            </ul>
          </div>
        )}
    </section>
  )
}
