import { ImageResponse } from 'next/og'

export const alt = 'Piyum Dakshina — Self-Taught Developer from Sri Lanka'
export const runtime = 'edge'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '72px 88px',
          background:
            'linear-gradient(135deg, #03131c 0%, #062a3a 55%, #0a3d52 100%)',
          color: '#ffffff',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            justifyContent: 'space-around',
            opacity: 0.12,
          }}
        >
          {[0, 1, 2, 3].map((i) => (
            <div key={i} style={{ width: 1, background: '#72E5F8', height: '100%' }} />
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 28 }}>
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: 999,
              background: '#18A0C0',
              boxShadow: '0 0 30px rgba(114, 229, 248, 0.9)',
            }}
          />
          <div style={{ fontSize: 30, color: '#72E5F8', letterSpacing: '0.3em' }}>
            THE PIYUMVERSE
          </div>
        </div>

        <div
          style={{
            fontSize: 84,
            fontWeight: 700,
            lineHeight: 1.08,
            color: '#ffffff',
          }}
        >
          Piyum Dakshina
        </div>

        <div
          style={{
            marginTop: 26,
            fontSize: 38,
            color: 'rgba(255, 255, 255, 0.85)',
            lineHeight: 1.4,
          }}
        >
          Self-Taught Developer · Sri Lanka
        </div>

        <div
          style={{
            marginTop: 46,
            fontSize: 28,
            color: '#72E5F8',
            border: '1px solid rgba(114, 229, 248, 0.4)',
            borderRadius: 999,
            padding: '14px 34px',
            alignSelf: 'flex-start',
          }}
        >
          Building with Dignity. Protecting with Humanity.
        </div>
      </div>
    ),
    size,
  )
}
