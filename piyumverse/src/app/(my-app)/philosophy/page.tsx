import type { Metadata } from 'next'
import { RichText } from '@payloadcms/richtext-lexical/react'

import { Reveal } from '@/components/effects/Reveal'
import { getPayloadClient } from '@/lib/payload'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Philosophy – The Principles I Live By | Piyum Dakshina',
  description:
    'Information is wealth. Protect human dignity. My wealth is trust, not money — the three principles behind everything Piyum Dakshina builds.',
  alternates: {
    canonical: '/philosophy',
  },
}

export default async function PhilosophyPage() {
  const payload = await getPayloadClient()
  const page = await payload.findGlobal({ slug: 'philosophy-page' })

  return (
    <section className="glass-card section-card">
      <Reveal>
        <span className="section-eyebrow">{page.badge || 'Philosophy'}</span>
      </Reveal>

      <h1 className="minfo-title mb-4 mt-7 md:mt-10">
        {page.heading || 'The'} <span>{page.headingAccent || 'Principles'}</span>{' '}
        {page.headingRest || 'I Live By'}
      </h1>
      {page.subtitle && (
        <p className="text-text-secondary mb-10 max-w-2xl">{page.subtitle}</p>
      )}

      <div className="space-y-8">
          {page.principles?.map((principle, i) => (
            <div key={principle.id} className="glass-card p-8 hover:border-teal/20 transition-colors">
              <div className="flex items-start gap-4">
                <span className="text-3xl mt-1">{principle.icon}</span>
                <div>
                  <h2 className="text-2xl font-bold gradient-text mb-3">{principle.title}</h2>
                  <p className="text-text-secondary leading-relaxed">{principle.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-2xl border border-grey bg-obsidian p-8 text-center">
          <h3 className="text-xl font-bold gradient-text mb-4">{page.missionHeading || 'My Mission'}</h3>
          {page.missionText && (
            <RichText data={page.missionText} className="rich-text max-w-2xl mx-auto" />
          )}
          {page.missionBadge && (
            <div className="mt-6">
              <span className="inline-block px-4 py-2 rounded-full text-sm font-medium bg-teal/10 text-teal border border-teal/20">
                {page.missionBadge}
              </span>
            </div>
          )}
        </div>
    </section>
  )
}
