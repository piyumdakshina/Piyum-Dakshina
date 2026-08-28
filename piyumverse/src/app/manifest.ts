import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'The Piyumverse — Piyum Dakshina',
    short_name: 'Piyumverse',
    description:
      'Portfolio of Piyum Dakshina — self-taught developer from Sri Lanka building with dignity, protecting with humanity.',
    id: '/',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#03131c',
    theme_color: '#18a0c0',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  }
}
