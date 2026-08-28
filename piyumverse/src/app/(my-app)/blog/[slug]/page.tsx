import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { RichText } from '@payloadcms/richtext-lexical/react'

import { getPayloadClient } from '@/lib/payload'

export const revalidate = 60

export async function generateStaticParams() {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'posts',
    where: { status: { equals: 'published' } },
    limit: 100,
    select: { slug: true },
  })
  return docs.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'posts',
    where: { slug: { equals: slug } },
    limit: 1,
  })
  const post = docs[0]

  if (!post) {
    return { title: 'Post Not Found' }
  }

  return {
    title: post.title,
    description: post.excerpt || undefined,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt || undefined,
      type: 'article',
      publishedTime: post.publishedAt || undefined,
      modifiedTime: post.updatedAt || undefined,
      authors: ['https://piyumdakshina.com'],
      images: [
        {
          url: `/blog/${post.slug}/og`,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt || undefined,
      images: [`/blog/${post.slug}/og`],
    },
  }
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'posts',
    where: { slug: { equals: slug } },
    limit: 1,
  })
  const post = docs[0]

  if (!post) {
    notFound()
  }

  const date = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt || undefined,
    datePublished: post.publishedAt || undefined,
    dateModified: post.updatedAt || undefined,
    author: {
      '@type': 'Person',
      name: 'Piyum Dakshina',
      url: 'https://piyumdakshina.com',
    },
    mainEntityOfPage: `https://piyumdakshina.com/blog/${post.slug}`,
  }

  return (
    <section className="glass-card section-card">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
        />
        <Link
          href="/blog"
          className="inline-flex items-center gap-1 text-text-muted hover:text-teal transition-colors mb-8"
        >
          ← Back to Blog
        </Link>

        {date && <p className="text-sm text-text-muted mb-3">{date}</p>}

        {post.coverImage && typeof post.coverImage === 'object' && post.coverImage.url && (
          <div className="relative rounded-2xl overflow-hidden border border-grey mb-8 aspect-[1200/630]">
            <img
              src={post.coverImage.url}
              alt={post.coverImage.alt || `${post.title} cover`}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        )}

        <h1 className="minfo-title mb-6">
          {post.title}
        </h1>

        {post.excerpt && (
          <p className="text-lg text-text-secondary mb-8">{post.excerpt}</p>
        )}

        <article className="rounded-2xl border border-grey bg-obsidian p-8">
          <RichText data={post.content} className="rich-text" />
        </article>
    </section>
  )
}
