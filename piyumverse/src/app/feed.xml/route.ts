import { getPayloadClient } from '@/lib/payload'

export const revalidate = 3600

const SITE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'https://piyumdakshina.com'

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function rfc822(date?: string | null): string {
  if (!date) return new Date().toUTCString()
  return new Date(date).toUTCString()
}

export async function GET() {
  const payload = await getPayloadClient()
  const { docs: posts } = await payload.find({
    collection: 'posts',
    where: { status: { equals: 'published' } },
    sort: '-publishedAt',
    limit: 20,
  })

  const items = posts
    .map((post) => {
      const url = `${SITE_URL}/blog/${post.slug}`
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      <pubDate>${rfc822(post.publishedAt)}</pubDate>
      ${post.excerpt ? `<description>${escapeXml(post.excerpt)}</description>` : ''}
    </item>`
    })
    .join('\n')

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Piyum Dakshina — The Piyumverse Blog</title>
    <link>${SITE_URL}</link>
    <description>Building with Dignity. Protecting with Humanity. — writings by Piyum Dakshina, a self-taught developer from Sri Lanka.</description>
    <language>en</language>
    <lastBuildDate>${rfc822(posts[0]?.publishedAt || new Date().toISOString())}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`

  return new Response(feed, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
