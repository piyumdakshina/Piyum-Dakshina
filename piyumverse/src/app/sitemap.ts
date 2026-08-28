import type { MetadataRoute } from 'next'

import { getPayloadClient } from '@/lib/payload'

export const revalidate = 3600

const SITE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'https://piyumdakshina.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/philosophy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/athletics`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/projects`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/gallery`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
    { url: `${SITE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/resume`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  ]

  try {
    const payload = await getPayloadClient()
    const [projects, posts] = await Promise.all([
      payload.find({
        collection: 'projects',
        limit: 100,
        select: { slug: true, updatedAt: true },
      }),
      payload.find({
        collection: 'posts',
        where: { status: { equals: 'published' } },
        limit: 100,
        select: { slug: true, updatedAt: true },
      }),
    ])

    const projectRoutes = projects.docs.map((project) => ({
      url: `${SITE_URL}/projects/${project.slug}`,
      lastModified: project.updatedAt ? new Date(project.updatedAt) : new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }))

    const postRoutes = posts.docs.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))

    return [...staticRoutes, ...projectRoutes, ...postRoutes]
  } catch {
    return staticRoutes
  }
}
