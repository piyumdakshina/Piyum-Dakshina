import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const revalidate = 3600
export const size = {
  width: 1200,
  height: 630,
}

const BANNER_BG = [
  'linear-gradient(135deg, #03131c 0%, #0a3d52 60%, #0e4a63 100%)',
  'linear-gradient(135deg, #03131c 0%, #123a4d 60%, #0d2b3d 100%)',
  'linear-gradient(135deg, #03131c 0%, #0b3a3a 60%, #0d4a4a 100%)',
  'linear-gradient(135deg, #03131c 0%, #381a4a 60%, #2a1238 100%)',
]

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  try {
    const origin = new URL(req.url).origin
    const apiUrl = `${origin}/api/projects?where[slug][equals]=${encodeURIComponent(slug)}&limit=1&depth=0`
    const res = await fetch(apiUrl, {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    })
    if (!res.ok) return new Response('Not found', { status: 404 })
    const { docs } = (await res.json()) as {
      docs: {
        title?: string | null
        shortDescription?: string | null
        status?: string | null
        techStack?: { technology?: string | null }[] | null
      }[]
    }
    const project = docs[0]
    if (!project) return new Response('Not found', { status: 404 })

    const title = project.title || 'Project'
    const description = (project.shortDescription || '').slice(0, 160)
    const techs = (project.techStack || [])
      .map((t) => t.technology || '')
      .filter(Boolean)
      .slice(0, 5)
    const index =
      title.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0) % BANNER_BG.length

    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '72px 84px',
            background: BANNER_BG[index],
            color: '#ffffff',
            fontFamily: 'sans-serif',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 26, color: '#72E5F8', letterSpacing: '0.3em' }}>
              THE PIYUMVERSE
            </div>
            <div
              style={{
                fontSize: 22,
                color: 'rgba(255,255,255,0.9)',
                border: '1px solid rgba(114,229,248,0.45)',
                borderRadius: 999,
                padding: '10px 26px',
              }}
            >
              {project.status || 'Project'}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', fontSize: 82, fontWeight: 700, lineHeight: 1.08 }}>
              {title}
            </div>
            {description && (
              <div
                style={{
                  marginTop: 24,
                  fontSize: 30,
                  color: 'rgba(255,255,255,0.82)',
                  lineHeight: 1.45,
                  maxWidth: 900,
                }}
              >
                {description}
              </div>
            )}
            <div style={{ display: 'flex', gap: 14, marginTop: 40 }}>
              {techs.map((tech) => (
                <div
                  key={tech}
                  style={{
                    fontSize: 22,
                    color: '#03131c',
                    background: '#72E5F8',
                    borderRadius: 999,
                    padding: '10px 22px',
                  }}
                >
                  {tech}
                </div>
              ))}
            </div>
          </div>

          <div style={{ fontSize: 24, color: 'rgba(255,255,255,0.55)' }}>
            {`piyumdakshina.com/projects/${slug}`}
          </div>
        </div>
      ),
      { ...size, headers: { 'Cache-Control': 'public, max-age=31536000, immutable' } }
    )
  } catch {
    return new Response('Not found', { status: 404 })
  }
}
