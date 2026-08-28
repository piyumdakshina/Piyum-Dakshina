import type { MetadataRoute } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'https://piyumdakshina.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
      {
        userAgent: 'GPTBot',
        allow: '/',
      },
      {
        userAgent: 'ClaudeBot',
        allow: '/',
      },
      {
        userAgent: 'PerplexityBot',
        allow: '/',
      },
      {
        userAgent: 'GoogleOther',
        allow: '/',
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
