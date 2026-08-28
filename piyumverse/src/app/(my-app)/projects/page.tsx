import type { Metadata } from 'next'

import { ProjectCard } from '@/components/ProjectCard'
import { Reveal } from '@/components/effects/Reveal'
import { getPayloadClient } from '@/lib/payload'

export const revalidate = 60

export const metadata: Metadata = {
  title: "Piyum Dakshina's Projects – AegisVue, LEAP, and More",
  description:
    "Explore Piyum Dakshina's projects including AegisVue (digital safety platform), LEAP (AI career platform), and VR Chemistry Lab.",
  alternates: {
    canonical: '/projects',
  },
}

export default async function ProjectsPage() {
  const payload = await getPayloadClient()
  const { docs: projects } = await payload.find({
    collection: 'projects',
    sort: '-featured',
    limit: 100,
  })

  const sorted = [...projects].sort((a, b) => {
    if (Boolean(a.featured) !== Boolean(b.featured)) return a.featured ? -1 : 1
    return (a.order ?? 0) - (b.order ?? 0)
  })

  return (
    <section className="glass-card section-card">
      <Reveal>
        <span className="section-eyebrow">Projects</span>
      </Reveal>

      <h1 className="minfo-title mb-4 mt-7 md:mt-10">
        Things I've <span>Built</span>
      </h1>
      <p className="text-text-secondary mb-10 max-w-2xl">
        Every project is a story — of curiosity, persistence, and the drive to create something meaningful.
      </p>

      <div className="marquee">
        <div className="marquee-track" style={{ animationDuration: '45s' }}>
          {[0, 1].map((track) => (
            <div key={track} className="flex shrink-0 gap-4 lg:gap-7.5 pr-4 lg:pr-7.5 py-1">
              {sorted.map((project) => (
                <div key={`${track}-${project.id}`} className="w-[300px] md:w-[380px] shrink-0">
                  <ProjectCard
                    title={project.title}
                    slug={project.slug}
                    description={project.shortDescription || undefined}
                    techStack={
                      (project.techStack
                        ?.map((t) => ({ technology: t.technology || '' }))
                        .filter((t) => t.technology) ?? []) as { technology?: string }[]
                    }
                    status={project.status || undefined}
                    projectType={project.projectType || undefined}
                    achievement={project.achievement || undefined}
liveUrl={project.liveUrl || undefined}
                        githubUrl={project.githubUrl || undefined}
                        coverImage={
                          typeof project.coverImage === 'object' && project.coverImage?.url
                            ? project.coverImage.url as string
                            : null
                        }
                      />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
