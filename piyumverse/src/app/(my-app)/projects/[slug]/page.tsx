import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { getPayloadClient } from '@/lib/payload'

export const revalidate = 60

export async function generateStaticParams() {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'projects',
    limit: 100,
    select: { slug: true },
  })
  return docs.map((project) => ({ slug: project.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'projects',
    where: { slug: { equals: slug } },
    limit: 1,
  })
  const project = docs[0]

  if (!project) {
    return { title: 'Project Not Found' }
  }

  const coverUrl =
    typeof project.coverImage === 'object' && project.coverImage?.url
      ? (project.coverImage.url as string)
      : `/projects/${project.slug}/cover`

  return {
    title: project.title,
    description: project.shortDescription || undefined,
    alternates: {
      canonical: `/projects/${project.slug}`,
    },
    openGraph: {
      title: project.title,
      description: project.shortDescription || undefined,
      type: 'article',
      images: [
        {
          url: coverUrl,
          alt: `${project.title} cover`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: project.title,
      description: project.shortDescription || undefined,
      images: [coverUrl],
    },
  }
}

const statusLabels: Record<string, string> = {
  development: 'In Development',
  production: 'Production',
  completed: 'Completed',
}

const typeLabels: Record<string, string> = {
  solo: 'Solo',
  team: 'Team Project',
  competition: 'Competition',
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'projects',
    where: { slug: { equals: slug } },
    limit: 1,
  })
  const project = docs[0]

  if (!project) {
    notFound()
  }

  const status = statusLabels[project.status || ''] || project.status
  const type = typeLabels[project.projectType || ''] || project.projectType
  const longDescription = project.longDescription || ''
  const techStack = project.techStack?.map((t) => t.technology).filter(Boolean) || []

  return (
    <section className="glass-card section-card">
        <Link
          href="/projects"
          className="inline-flex items-center gap-1 text-text-muted hover:text-teal transition-colors mb-8"
        >
          ← Back to Projects
        </Link>

        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-teal/10 text-teal border border-teal/20">
            {status}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-violet/10 text-violet border border-violet/20">
            {type}
          </span>
          {project.achievement && (
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
              🏆 {project.achievement}
            </span>
          )}
        </div>

        <div className="relative rounded-2xl overflow-hidden border border-grey mb-8 aspect-[1200/630]">
          <img
            src={
              typeof project.coverImage === 'object' && project.coverImage?.url
                ? (project.coverImage.url as string)
                : `/projects/${project.slug}/cover`
            }
            alt={`${project.title} cover`}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>

        <h1 className="minfo-title mb-4">
          {project.title}
        </h1>

        {project.shortDescription && (
          <p className="text-lg text-text-secondary mb-8">{project.shortDescription}</p>
        )}

        {longDescription && (
          <div className="rounded-2xl border border-grey bg-obsidian p-8 mb-8">
            <h2 className="text-xl font-medium text-teal mb-4">About This Project</h2>
            {longDescription.split(/\n\s*\n/).map((paragraph, i) => (
              <p key={i} className="text-text-secondary leading-relaxed mb-4 last:mb-0">
                {paragraph}
              </p>
            ))}
          </div>
        )}

        {techStack.length > 0 && (
          <div className="rounded-2xl border border-grey bg-obsidian p-8 mb-8">
            <h2 className="text-xl font-medium text-teal mb-4">Tech Stack</h2>
            <div className="flex flex-wrap gap-3">
              {techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1.5 rounded-full border border-surface-light bg-surface text-text-secondary text-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {(project.githubUrl || project.liveUrl) && (
          <div className="flex flex-wrap gap-4">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-theme"
              >
                View on GitHub
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
              >
                Live Demo
              </a>
            )}
          </div>
        )}
    </section>
  )
}
