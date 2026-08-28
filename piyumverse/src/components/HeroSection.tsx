import fs from 'fs'
import path from 'path'
import Link from 'next/link'

import { getPayloadClient } from '@/lib/payload'
import { Reveal } from '@/components/effects/Reveal'

const hasHeroVideo = fs.existsSync(
  path.join(process.cwd(), 'public', 'hero-video.mp4'),
)

const hasHeroFrame = fs.existsSync(
  path.join(process.cwd(), 'public', 'hero-frame.png'),
)

const fallbackHero = {
  badge: 'Piyum Dakshina',
  title: 'I want to be the man that one day a child says:',
  titleAccent: '“I want to be like Piyum.”',
  description:
    'Hey. I’m Piyum — an 18-year-old self-taught developer, entrepreneur & dreamer from Sri Lanka. I build free technology that protects human dignity — digital safety platforms, education tools, and AI that serves people instead of exploiting them. Take a look around.',
  primaryButton: { label: 'Explore My Work', href: '/projects' },
  secondaryButton: { label: 'My Story', href: '/about' },
  tertiaryButton: { label: 'Get in Touch', href: '/contact' },
  statusLine1: 'Building with Dignity. Protecting with Humanity.',
  statusLine2: 'Founder of AegisVue · 1st Runner-Up @ HackX Junior',
}

const partnerWordmarks = ['React', 'Next.js', 'TypeScript', 'Tailwind', 'Node.js', 'Payload', 'Docker', 'Git']

export async function HeroSection() {
  let hero = fallbackHero

  try {
    const payload = await getPayloadClient()
    const settings = await payload.findGlobal({ slug: 'site-settings' })
    if (settings.hero) {
      hero = {
        badge: settings.hero.badge || fallbackHero.badge,
        title: settings.hero.title || fallbackHero.title,
        titleAccent: settings.hero.titleAccent || fallbackHero.titleAccent,
        description: settings.hero.description || fallbackHero.description,
        primaryButton: {
          label: settings.hero.primaryButton?.label || fallbackHero.primaryButton.label,
          href: settings.hero.primaryButton?.href || fallbackHero.primaryButton.href,
        },
        secondaryButton: {
          label: settings.hero.secondaryButton?.label || fallbackHero.secondaryButton.label,
          href: settings.hero.secondaryButton?.href || fallbackHero.secondaryButton.href,
        },
        tertiaryButton: {
          label: settings.hero.tertiaryButton?.label || fallbackHero.tertiaryButton.label,
          href: settings.hero.tertiaryButton?.href || fallbackHero.tertiaryButton.href,
        },
        statusLine1: settings.hero.statusLine1 || fallbackHero.statusLine1,
        statusLine2: settings.hero.statusLine2 || fallbackHero.statusLine2,
      }
    }
  } catch {
    // DB not seeded yet — render with defaults
  }

  return (
    <section id="home" className="relative shimmer-border rounded-[1rem] p-[1px]">
      <div className="glass-card relative section-card overflow-hidden">
        <div className="absolute -top-24 -left-24 w-80 h-80 glow-orb" data-depth="-0.5" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 glow-orb" data-depth="0.9" style={{ background: 'radial-gradient(circle, rgba(114,229,248,0.12) 0%, transparent 70%)' }} />
        <div className="absolute inset-0 pixel-grid pointer-events-none" />

        <Reveal className="relative">
          <span className="section-eyebrow">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-cyan">
              <path d="M3 9.5L12 2l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1V9.5z" />
            </svg>
            INTRODUCE
          </span>
        </Reveal>

        <div className="mt-8 relative" data-fade>
          <Reveal delay={100}>
            <h1 className="text-[32px] lg:text-5xl xl:text-4xl 2xl:text-5xl font-semibold leading-[1.27] mb-6 lg:mb-7 text-text-primary">
              {hero.title} <br />
              <span className="text-cyan glow-text">{hero.titleAccent}</span>
            </h1>
          </Reveal>

          <div className="flex flex-col md:flex-row md:items-center gap-8 md:gap-12 lg:gap-16">
            <Reveal delay={200} className="flex-1">
              <p className="text-text-secondary leading-relaxed max-w-[36rem]">{hero.description}</p>
            </Reveal>

            <div className="hidden md:flex justify-center shrink-0">
              <div className="relative" data-orbit>
                <div className="absolute inset-0 rounded-[1.25rem] bg-teal/20 blur-2xl" />
                {hasHeroVideo ? (
                  <div className="relative w-32 h-44 rounded-[1.25rem] overflow-hidden border border-grey/50 floating shadow-2xl">
                    <video
                      src="/hero-video.mp4"
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                      aria-label={`${hero.badge} portrait video`}
                    />
                    <div className="absolute inset-0 rounded-[1.25rem] pointer-events-none ring-2 ring-inset ring-white/10" />
                  </div>
                ) : hasHeroFrame ? (
                  <div className="relative w-32 h-44 rounded-[1.25rem] overflow-hidden border border-grey/50 floating shadow-2xl">
                    <img
                      src="/hero-frame.png"
                      alt={`${hero.badge} portrait`}
                      className="hero-portrait w-full h-full object-cover"
                    />
                    <div className="hero-light-sweep" />
                    <div className="absolute inset-0 bottom-0 bg-gradient-to-t from-obsidian/50 to-transparent" />
                    <div className="absolute inset-0 rounded-[1.25rem] pointer-events-none ring-2 ring-inset ring-white/10" />
                    <span className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 rounded-full bg-obsidian/60 backdrop-blur px-2 py-0.5 text-[10px] uppercase tracking-wider text-cyan">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan opacity-75" />
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan" />
                      </span>
                      In Motion
                    </span>
                  </div>
                ) : (
                  <div className="relative flex flex-col items-center gap-3">
                    <span className="avatar-ring p-[3px] rounded-full w-28 h-28 floating">
                      <span className="flex items-center justify-center w-full h-full rounded-full bg-obsidian-light font-semibold text-5xl text-white">
                        {(hero.badge.split(' ')[0] || 'P').charAt(0)}
                      </span>
                    </span>
                  </div>
                )}
                <p className="relative mt-3 text-center text-sm font-medium text-text-primary">{hero.badge}</p>
              </div>
            </div>
          </div>

          <Reveal delay={300}>
            <ul className="flex items-center flex-wrap mt-6 -mx-3 lg:mt-7 gap-y-2">
              <li className="flex items-center text-sm text-text-secondary mx-3">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="mr-2 text-cyan">
                  <path d="M3 12.5l6 6L21 5.5" />
                </svg>
                {hero.statusLine1}
              </li>
              <li className="flex items-center text-sm text-text-secondary mx-3">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="mr-2 text-cyan">
                  <path d="M3 12.5l6 6L21 5.5" />
                </svg>
                {hero.statusLine2}
              </li>
            </ul>
          </Reveal>

          <Reveal delay={400}>
            <div className="flex flex-wrap items-center gap-4 mt-7">
              <Link href={hero.tertiaryButton.href} className="btn-theme">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                </svg>
                HIRE ME
              </Link>
              <Link href={hero.primaryButton.href} className="btn-outline">
                {hero.primaryButton.label}
              </Link>
              <Link href={hero.secondaryButton.href} className="btn-outline">
                {hero.secondaryButton.label}
              </Link>
            </div>
          </Reveal>
        </div>

        <div className="mb-2 mt-14 xl:mb-0 xl:mt-20">
          <div className="items-center grid-cols-12 overflow-hidden md:grid">
            <div className="hidden col-span-2 md:inline-block">
              <h6 className="font-medium text-text-secondary text-sm md:max-w-[8rem] border-l border-teal pl-4">
                Trusted tools
              </h6>
            </div>
            <div className="col-span-10 marquee">
              <div className="marquee-track py-2">
                {[0, 1].map((track) => (
                  <div key={track} className="flex items-center shrink-0">
                    {partnerWordmarks.map((name) => (
                      <span
                        key={`${track}-${name}`}
                        className="flex items-center gap-6 mx-6 font-medium text-text-secondary uppercase text-sm tracking-[0.18em]"
                      >
                        {name}
                        <span className="w-1.5 h-1.5 rounded-full bg-teal/60" />
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
