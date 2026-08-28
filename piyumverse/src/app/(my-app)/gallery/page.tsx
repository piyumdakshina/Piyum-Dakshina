import type { Metadata } from 'next'

import { GalleryGrid } from '@/components/GalleryGrid'
import { Reveal } from '@/components/effects/Reveal'
import { getPayloadClient } from '@/lib/payload'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Gallery – Moments in Motion | Piyum Dakshina',
  description:
    'Photos from Piyum Dakshina\u2019s life – the track, the builds, and the road between.',
  alternates: {
    canonical: '/gallery',
  },
}

export default async function GalleryPage() {
  const payload = await getPayloadClient()
  const page = await payload.findGlobal({ slug: 'gallery-page' })

  const items = (page.items || []).map((item) => ({
    id: item.id || '',
    imageUrl: typeof item.image === 'object' && item.image?.url ? item.image.url : null,
    caption: item.caption || null,
    category: item.category || null,
  }))

  return (
    <section className="glass-card section-card">
      <Reveal>
        <GalleryGrid
          items={items}
          heading={page.heading || 'Moments'}
          headingAccent={page.headingAccent || 'in Motion'}
          headingRest={page.headingRest || ''}
          subtitle={page.subtitle || ''}
          badge={page.badge || 'Gallery'}
        />
      </Reveal>
    </section>
  )
}
