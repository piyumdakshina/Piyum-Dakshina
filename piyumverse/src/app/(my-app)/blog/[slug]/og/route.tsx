import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const size = {
  width: 1200,
  height: 630,
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params

  let title = 'The Piyumverse'
  let coverDataUrl: string | null = null

  try {
    const origin = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
    const apiUrl = `${origin}/api/posts?where[slug][equals]=${encodeURIComponent(slug)}&limit=1&depth=1`
    const res = await fetch(apiUrl, { headers: { Accept: 'application/json' }, cache: 'no-store' })
    if (res.ok) {
      const { docs } = (await res.json()) as {
        docs: { title?: string; coverImage?: { url?: string; mimeType?: string } }[]
      }
      const post = docs[0]
      if (post) {
        title = post.title || 'The Piyumverse'
        if (post.coverImage?.url) {
          const media = await fetch(`${origin}${post.coverImage.url}`, { cache: 'no-store' })
          if (media.ok) {
            const bytes = await media.arrayBuffer()
            const mime = post.coverImage.mimeType || 'image/jpeg'
            const b64 = Buffer.from(bytes).toString('base64')
            coverDataUrl = `data:${mime};base64,${b64}`
          }
        }
      }
    }
  } catch {
    // fall back to the styled card below
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          position: 'relative',
          fontFamily: 'sans-serif',
          color: '#ffffff',
          background: 'linear-gradient(135deg, #03131c 0%, #0a3d52 60%, #0e4a63 100%)',
        }}
      >
        {coverDataUrl ? (
          <img
            src={coverDataUrl}
            alt=""
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        ) : null}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            background:
              'linear-gradient(to top, rgba(3,19,28,0.96) 0%, rgba(3,19,28,0.55) 55%, rgba(3,19,28,0.2) 100%)',
          }}
        />
        <div
          style={{
            position: 'relative',
            display: 'flex',
            padding: '64px 84px',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              fontSize: 26,
              color: '#72E5F8',
              letterSpacing: '0.3em',
              marginBottom: 24,
            }}
          >
            THE PIYUMVERSE · BLOG
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 64,
              fontWeight: 700,
              lineHeight: 1.12,
              maxWidth: 900,
            }}
          >
            {title}
          </div>
          <div
            style={{
              display: 'flex',
              marginTop: 28,
              fontSize: 24,
              color: 'rgba(255,255,255,0.6)',
            }}
          >
            piyumdakshina.com/blog/{slug}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      headers: { 'Cache-Control': 'public, max-age=3600' },
    },
  )
}