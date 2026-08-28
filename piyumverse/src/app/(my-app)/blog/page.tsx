import type { Metadata } from 'next'
import Link from 'next/link'

import { Reveal } from '@/components/effects/Reveal'
import { getPayloadClient } from '@/lib/payload'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Thoughts, lessons, and stories from the Piyumverse.',
  alternates: {
    canonical: '/blog',
  },
}

function formatDate(date?: string | null) {
  if (!date) return null
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default async function BlogPage() {
  const payload = await getPayloadClient()
  const { docs: posts } = await payload.find({
    collection: 'posts',
    where: { status: { equals: 'published' } },
    sort: '-publishedAt',
    limit: 100,
  })

  return (
    <section className="glass-card section-card">
      <Reveal>
        <span className="section-eyebrow">Blog</span>
      </Reveal>

      <h1 className="minfo-title mb-4 mt-7 md:mt-10">
        Thoughts & <span>Lessons</span>
      </h1>
      <p className="text-text-secondary mb-10 max-w-2xl">
        Ideas, stories, and notes from the journey — written for anyone who seeks them.
      </p>

        {posts.length === 0 ? (
          <div className="rounded-2xl border border-grey bg-obsidian p-12 text-center">
            <div className="text-4xl mb-4">📝</div>
            <h2 className="text-xl font-medium text-cyan mb-2">No posts yet</h2>
            <p className="text-text-secondary">
              New posts will appear here soon. Check back later.
            </p>
          </div>
        ) : (
          <div className="marquee">
            <div className="marquee-track" style={{ animationDuration: '50s' }}>
              {[0, 1].map((track) => (
                <div key={track} className="flex shrink-0 gap-5 md:gap-7.5 pr-5 md:pr-7.5 py-1">
                  {posts.map((post) => {
                    const date = formatDate(post.publishedAt)
                    return (
                      <article key={`${track}-${post.id}`} className="w-[300px] md:w-[400px] shrink-0 grid grid-cols-12 items-center gap-2 rounded-2xl bg-surface p-3.5 transition-all hover:border hover:border-cyan/30 cursor-pointer">
                        {post.coverImage && typeof post.coverImage === 'object' && post.coverImage.url && (
                          <div className="col-span-12 relative h-40 md:h-44 rounded-xl overflow-hidden">
                            <img
                              src={post.coverImage.url}
                              alt={post.coverImage.alt || `${post.title} cover`}
                              loading="lazy"
                              className="absolute inset-0 w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent opacity-50" />
                          </div>
                        )}
                        <div className="flex flex-col col-span-12 px-3 pt-6 pb-2 md:p-5">
                          <div className="flex items-center gap-5 text-sm font-medium text-text-muted">
                            {date && <span className="post_date">{date}</span>}
                          </div>
                          <div className="mt-3 md:mt-4.5 mb-6 md:mb-8">
                            <h2 className="text-xl font-semibold leading-normal text-text-primary line-clamp-2 2xl:text-2xl 2xl:leading-normal transition-colors hover:text-cyan">
                              {post.title}
                            </h2>
                          </div>
                          {post.excerpt && (
                            <p className="text-text-secondary text-sm line-clamp-2 mb-6">
                              {post.excerpt}
                            </p>
                          )}
                          <div className="read-details">
                            <Link
                              href={`/blog/${post.slug}`}
                              className="inline-flex items-center gap-2 border border-cyan text-cyan text-sm py-3.5 px-6 rounded-3xl leading-none transition-all duration-300 hover:bg-cyan hover:text-obsidian font-medium"
                            >
                              Read More
                            </Link>
                          </div>
                        </div>
                      </article>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        )}
    </section>
  )
}
