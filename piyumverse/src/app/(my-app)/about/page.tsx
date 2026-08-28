import type { Metadata } from 'next'
import { RichText } from '@payloadcms/richtext-lexical/react'

import { Reveal } from '@/components/effects/Reveal'
import { getPayloadClient } from '@/lib/payload'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'About Piyum Dakshina – Self-Taught Developer from Sri Lanka',
  description:
    "Learn about Piyum Dakshina's journey as an 18-year-old self-taught developer, his projects AegisVue and LEAP, and his mission to protect human dignity.",
  alternates: {
    canonical: '/about',
  },
}

export default async function AboutPage() {
  const payload = await getPayloadClient()
  const page = await payload.findGlobal({ slug: 'about-page' })

  return (
    <section className="glass-card section-card">
      <Reveal>
        <span className="section-eyebrow">{page.badge || 'About'}</span>
      </Reveal>

      <h1 className="minfo-title mb-8 mt-7 md:mt-10">
        {page.heading || 'Who is'} <span>{page.headingAccent || 'Piyum Dakshina'}</span>
        {page.headingRest ? ` ${page.headingRest}` : '?'}
      </h1>

      <div className="space-y-6 text-text-secondary leading-relaxed">
        {page.intro && <RichText data={page.intro} className="rich-text rich-text-lg" />}
        {page.body && <RichText data={page.body} className="rich-text" />}

        {page.coreValues && page.coreValues.length > 0 && (
          <div className="rounded-2xl border border-grey bg-obsidian p-6 mt-8">
            <h3 className="text-xl font-medium text-teal mb-4">Core Values</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {page.coreValues.map((value) => (
                <div key={value.id} className="p-4 rounded-lg bg-surface/50">
                  <div className="text-2xl mb-2">{value.icon}</div>
                  <h4 className="font-semibold text-text-primary mb-1">{value.title}</h4>
                  <p className="text-sm text-text-muted">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {page.bodyAfter && <RichText data={page.bodyAfter} className="rich-text" />}
      </div>

      {page.story?.sections && page.story.sections.length > 0 && (
        <Reveal>
          <div className="mt-16">
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-2xl md:text-3xl font-bold gradient-text">
                {page.story.heading || 'My Story'}
              </h2>
              <div className="hairline flex-1" />
            </div>
            <div className="grid gap-6">
              {page.story.sections.map((section) => (
                <div key={section.id} className="glass-card p-6 md:p-8 hover:border-teal/20 transition-colors">
                  <div className="flex items-start gap-4">
                    {section.icon && <span className="text-3xl mt-1">{section.icon}</span>}
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-text-primary mb-3">{section.title}</h3>
                      <RichText data={section.content} className="rich-text" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      )}

      {page.proudestMoment?.content && (
        <Reveal>
          <div className="mt-16 rounded-2xl border border-teal/20 bg-obsidian p-6 md:p-8 text-center shimmer-border">
            <h2 className="text-2xl md:text-3xl font-bold gradient-text mb-2">
              {page.proudestMoment.heading || 'My Proudest Moment'}
            </h2>
            <div className="mb-4">
              <span className="inline-block px-4 py-2 rounded-full text-sm font-medium bg-teal/10 text-teal border border-teal/20">
                🏆 {page.proudestMoment.title || '1st Runner-Up at HackX Junior'}
              </span>
            </div>
            <RichText data={page.proudestMoment.content} className="rich-text max-w-2xl mx-auto" />
          </div>
        </Reveal>
      )}

      {page.philosophy?.points && page.philosophy.points.length > 0 && (
        <Reveal>
          <div className="mt-16">
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-2xl md:text-3xl font-bold gradient-text">
                {page.philosophy.heading || 'My Philosophy'}
              </h2>
              <div className="hairline flex-1" />
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {page.philosophy.points.map((point) => (
                <div key={point.id} className="glass-card p-6 hover:border-teal/20 transition-colors">
                  <div className="flex items-start gap-4">
                    {point.icon && <span className="text-3xl mt-1">{point.icon}</span>}
                    <div>
                      <h3 className="text-lg font-semibold text-text-primary mb-2">{point.title}</h3>
                      <p className="text-sm text-text-secondary leading-relaxed">{point.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {page.philosophy.message && (
              <div className="mt-8 rounded-2xl border border-grey bg-obsidian p-6 text-center">
                <p className="text-lg md:text-xl font-medium gradient-text">{page.philosophy.message}</p>
              </div>
            )}
          </div>
        </Reveal>
      )}

      {page.dream?.content && (
        <Reveal>
          <div className="mt-16">
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-2xl md:text-3xl font-bold gradient-text">
                {page.dream.heading || 'My Dream'}
              </h2>
              <div className="hairline flex-1" />
            </div>
            <div className="glass-card p-6 md:p-8">
              <RichText data={page.dream.content} className="rich-text" />
            </div>
          </div>
        </Reveal>
      )}

      {page.projects?.highlights && page.projects.highlights.length > 0 && (
        <Reveal>
          <div className="mt-16">
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-2xl md:text-3xl font-bold gradient-text">
                {page.projects.heading || 'My Projects'}
              </h2>
              <div className="hairline flex-1" />
            </div>
            <div className="grid gap-6">
              {page.projects.highlights.map((project) => (
                <div key={project.id} className="glass-card p-6 md:p-8 hover:border-teal/20 transition-colors">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <h3 className="text-xl font-semibold text-text-primary">{project.title}</h3>
                    {project.tagline && (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-teal/10 text-teal border border-teal/20">
                        {project.tagline}
                      </span>
                    )}
                  </div>
                  {project.achievement && (
                    <p className="text-sm font-medium text-teal mb-3">🏆 {project.achievement}</p>
                  )}
                  <p className="text-text-secondary leading-relaxed">{project.description}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      )}

      {page.athletics?.content && (
        <Reveal>
          <div className="mt-16">
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-2xl md:text-3xl font-bold gradient-text">
                {page.athletics.heading || 'My Athletics'}
              </h2>
              <div className="hairline flex-1" />
            </div>
            <div className="glass-card p-6 md:p-8">
              <RichText data={page.athletics.content} className="rich-text" />
            </div>
          </div>
        </Reveal>
      )}

      {page.education?.items && page.education.items.length > 0 && (
        <Reveal>
          <div className="mt-16">
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-2xl md:text-3xl font-bold gradient-text">
                {page.education.heading || 'My Education'}
              </h2>
              <div className="hairline flex-1" />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {page.education.items.map((item) => (
                <div key={item.id} className="glass-card p-5">
                  <h3 className="font-semibold text-text-primary mb-1">{item.title}</h3>
                  <p className="text-sm text-text-secondary">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      )}

      {page.personalLife?.items && page.personalLife.items.length > 0 && (
        <Reveal>
          <div className="mt-16">
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-2xl md:text-3xl font-bold gradient-text">
                {page.personalLife.heading || 'My Personal Life'}
              </h2>
              <div className="hairline flex-1" />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {page.personalLife.items.map((item) => (
                <div key={item.id} className="glass-card p-5 hover:border-teal/20 transition-colors">
                  <h3 className="font-semibold text-text-primary mb-1">{item.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      )}

      {page.socialLinks && page.socialLinks.length > 0 && (
        <Reveal>
          <div className="mt-16">
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-2xl md:text-3xl font-bold gradient-text">
                {page.socialLinksHeading || 'My Social Links'}
              </h2>
              <div className="hairline flex-1" />
            </div>
            <div className="glass-card overflow-hidden">
              <div className="divide-y divide-grey">
                {page.socialLinks.map((link) => (
                  <div key={link.id} className="flex items-center justify-between gap-4 px-6 py-4">
                    <span className="font-medium text-text-primary">{link.platform}</span>
                    <span className="text-sm text-text-secondary">{link.handle}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      )}

      {page.legacy?.content && (
        <Reveal>
          <div className="mt-16 rounded-2xl border border-grey bg-obsidian p-6 md:p-10 text-center">
            <h2 className="text-2xl md:text-3xl font-bold gradient-text mb-6">
              {page.legacy.heading || 'My Legacy'}
            </h2>
            {page.legacy.quote && (
              <div className="mb-6">
                <span className="inline-block px-4 py-2 rounded-full text-sm md:text-base font-medium bg-teal/10 text-teal border border-teal/20">
                  {page.legacy.quote}
                </span>
              </div>
            )}
            <RichText data={page.legacy.content} className="rich-text max-w-2xl mx-auto" />
          </div>
        </Reveal>
      )}

      {page.finalWords?.content && (
        <Reveal>
          <div className="mt-16 text-center">
            <div className="flex items-center gap-4 mb-6 justify-center">
              <div className="hairline max-w-40" />
              <h2 className="text-2xl md:text-3xl font-bold gradient-text">
                {page.finalWords.heading || 'My Final Words'}
              </h2>
              <div className="hairline max-w-40" />
            </div>
            <RichText data={page.finalWords.content} className="rich-text max-w-2xl mx-auto" />
            <div className="mt-8">
              <p className="font-semibold text-text-primary text-lg">Piyum Dakshina</p>
              <p className="text-sm text-text-muted mt-1">
                Building with Dignity. Protecting with Humanity.
              </p>
            </div>
          </div>
        </Reveal>
      )}
    </section>
  )
}
