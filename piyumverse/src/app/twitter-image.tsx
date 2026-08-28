import { ImageResponse } from 'next/og'

export const alt = 'Piyum Dakshina — Self-Taught Developer from Sri Lanka'
export const runtime = 'edge'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px 96px',
          background: 'linear-gradient(135deg, #0a1c26 0%, #083348 60%, #18A0C0 160%)',
          color: '#ffffff',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', fontSize: 64, fontWeight: 700, lineHeight: 1.1 }}>
          Piyum <span style={{ color: '#72E5F8' }}>Dakshina</span>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginTop: 20,
            fontSize: 34,
            color: 'rgba(255,255,255,0.8)',
            lineHeight: 1.4,
          }}
        >
          Self-taught developer building free technology
          <br />
          that protects human dignity.
        </div>
        <div style={{ marginTop: 44, fontSize: 26, color: '#72E5F8', letterSpacing: '0.18em' }}>
          PIYUMDAKSHINA.COM
        </div>
      </div>
    ),
    size,
  )
}
