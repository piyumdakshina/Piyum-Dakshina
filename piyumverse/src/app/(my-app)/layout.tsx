import type { Metadata, Viewport } from 'next'
import { Poppins } from 'next/font/google'

import { Header } from '@/components/Header'
import { Sidebar } from '@/components/Sidebar'
import { NavRail } from '@/components/NavRail'
import { Footer } from '@/components/Footer'
import { PWA } from '@/components/PWA'
import { Cursor } from '@/components/effects/Cursor'
import { Preloader } from '@/components/effects/Preloader'
import { getPayloadClient } from '@/lib/payload'

import './globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
})

const fallbackMetadata: Metadata = {
  title: {
    default: 'Piyum Dakshina – Building with Dignity. Protecting with Humanity.',
    template: '%s — Piyum Dakshina',
  },
  description:
    'Piyum Dakshina is an 18-year-old self-taught developer from Sri Lanka. Founder of AegisVue and lead programmer of LEAP. Building technology that protects human dignity.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'https://piyumdakshina.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Piyum Dakshina — Self-Taught Developer from Sri Lanka',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/twitter-image'],
  },
  icons: {
    icon: '/icon-192.png',
    apple: '/apple-touch-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#18a0c0',
}

export async function generateMetadata(): Promise<Metadata> {
  try {
    const payload = await getPayloadClient()
    const settings = await payload.findGlobal({ slug: 'site-settings' })
    const meta = settings.metadata

    if (!meta?.title) return fallbackMetadata

    const siteUrl = meta.siteUrl || 'https://piyumdakshina.com'

    return {
      title: {
        default: meta.title,
        template: `%s — ${meta.title.split('—')[0].trim()}`,
      },
      description: meta.description || undefined,
      metadataBase: new URL(siteUrl),
      alternates: {
        canonical: '/',
      },
      openGraph: {
        title: meta.title,
        description: meta.description || undefined,
        url: siteUrl,
        siteName: settings.siteName || 'The Piyumverse',
        locale: 'en_US',
        type: 'website',
        images: [
          {
            url: '/opengraph-image',
            width: 1200,
            height: 630,
            alt: 'Piyum Dakshina — Self-Taught Developer from Sri Lanka',
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: meta.title,
        description: meta.description || undefined,
        images: ['/twitter-image'],
      },
      robots: {
        index: true,
        follow: true,
      },
      icons: {
        icon: '/icon-192.png',
        apple: '/apple-touch-icon.png',
      },
    }
  } catch {
    return fallbackMetadata
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let socialLinks: { id?: string; platform?: string; url?: string; icon?: string }[] = []
  let navItems: { label?: string | null; href?: string | null }[] = []
  let footerData = {
    builtBy: 'Built with Dignity by',
    name: 'Piyum Dakshina',
    rightsText: 'The Piyumverse. All rights reserved.',
  }
  let siteName = 'The Piyumverse'

  try {
    const payload = await getPayloadClient()
    const settings = await payload.findGlobal({ slug: 'site-settings' })
    socialLinks = (settings.socialLinks || []).map((link) => ({
      id: link.id || undefined,
      platform: link.platform || undefined,
      url: link.url || undefined,
      icon: link.icon || undefined,
    }))
    navItems = (settings.navItems || []).map((item) => ({
      label: item.label || null,
      href: item.href || null,
    }))
    siteName = settings.siteName || siteName
    footerData = {
      builtBy: settings.footer?.builtBy || footerData.builtBy,
      name: settings.footer?.name || footerData.name,
      rightsText: settings.footer?.rightsText || footerData.rightsText,
    }
  } catch {
    // DB not seeded yet — render with defaults
  }

  return (
    <html lang="en" className={poppins.variable}>
      <head>
        {process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN && (
          <script
            defer
            data-domain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN}
            src="https://plausible.io/js/script.js"
          />
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: 'Piyum Dakshina',
              alternateName: 'R.W.K Piyum Dakshina Damsiri',
              jobTitle: 'Self-Taught Developer',
              birthDate: '2008-03-30',
              url: 'https://piyumdakshina.com',
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Batuwatta, Ragama',
                addressCountry: 'LK',
              },
              sameAs: [
                'https://youtube.com/@piyumdakshina369',
                'https://instagram.com/piyum_dakshina',
                'https://facebook.com/piyum.dakshina',
                'https://linkedin.com/in/piyumdakshina',
                'https://tiktok.com/@piyum_dakshina_',
              ],
            }),
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[200] focus:px-5 focus:py-3 focus:rounded-lg focus:bg-obsidian-light focus:border focus:border-cyan focus:text-cyan focus:text-sm focus:font-medium"
        >
          Skip to main content
        </a>
        <Preloader />
        <PWA />
        <Cursor />
        <Header siteName={siteName} socialLinks={socialLinks} navItems={navItems} />
        <Sidebar siteName={siteName} />
        <NavRail navItems={navItems} />
        <div className="bg-lines max-sm:px-8 sm:px-12" aria-hidden="true">
          <div className="line-wrapper">
            <div className="line1" />
            <div className="line2" />
            <div className="line3" />
            <div className="line4" />
          </div>
        </div>
        <main id="main-content" className="flex-1 pt-24 xl:pt-10 pb-6 px-4 xl:px-0">
          <div className="relative mx-auto w-full max-w-[76.25rem] xl:max-2xl:max-w-[65rem] minfo-stack">{children}</div>
        </main>
        <Footer {...footerData} />
      </body>
    </html>
  )
}
