import Link from 'next/link'
import { RichText } from '@payloadcms/richtext-lexical/react'

import { HeroSection } from '@/components/HeroSection'
import { ProjectCard } from '@/components/ProjectCard'
import { ContactForm } from '@/components/ContactForm'
import { Reveal } from '@/components/effects/Reveal'
import { CountUp } from '@/components/effects/CountUp'
import { ScrollFX, TiltCard } from '@/components/effects/Scroll3D'
import { getPayloadClient } from '@/lib/payload'

const hardcodedPills = ['TypeScript', 'React', 'Next.js', 'Tailwind CSS', 'Node.js', 'Payload CMS', 'SQL & MongoDB', 'Python', 'Arduino']

const hardcodedBars = [
  { label: 'Frontend — React · Next.js · Tailwind', percent: 95 },
  { label: 'Language — TypeScript', percent: 90 },
  { label: 'Backend — Node.js · Payload CMS', percent: 88 },
  { label: 'Data — SQL · MongoDB', percent: 80 },
  { label: 'AI/ML — LLMs · Python', percent: 75 },
  { label: 'Hardware — Arduino', percent: 70 },
]

const hardcodedOverview = [
  {
    icon: '🙋',
    title: 'Who I Am',
    description:
      'An 18-year-old self-taught developer from Sri Lanka. No paid courses. No certificates. No mentors — just late nights, trial and error, and refusing to give up.',
    link: { label: 'Read My Story', href: '/about' },
  },
  {
    icon: '🛠️',
    title: 'What I Build',
    description:
      'Digital safety platforms like AegisVue, AI tools like LEAP, and hardware like VR Chemistry Lab — technology built to serve people, not control them.',
    link: { label: 'Explore My Work', href: '/projects' },
  },
  {
    icon: '💎',
    title: 'Why It Matters',
    description:
      'Information is wealth. Protect human dignity. My wealth is trust, not money. I build because it is my breath — and everyone deserves access to it.',
    link: { label: 'My Philosophy', href: '/philosophy' },
  },
]

function formatDate(date?: string | null) {
  if (!date) return null
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

async function getHomeData() {
  try {
    const payload = await getPayloadClient()
    const [aboutPage, settings, philosophyPage, athleticsPage, galleryPage, testimonialsPage, { docs: projects }, { docs: posts }, countResults] =
      await Promise.all([
        payload.findGlobal({ slug: 'about-page' }),
        payload.findGlobal({ slug: 'site-settings' }),
        payload.findGlobal({ slug: 'philosophy-page' }),
        payload.findGlobal({ slug: 'athletics-page' }),
        payload.findGlobal({ slug: 'gallery-page' }),
        payload.findGlobal({ slug: 'testimonials' }),
        payload.find({
          collection: 'projects',
          sort: '-featured',
          limit: 100,
        }),
        payload.find({
          collection: 'posts',
          where: { status: { equals: 'published' } },
          sort: '-publishedAt',
          limit: 100,
        }),
        Promise.all([payload.count({ collection: 'projects' }), payload.count({ collection: 'posts' })]),
      ])

    let repos: { name: string; description: string | null; language: string | null; stars: number; forks: number; htmlUrl: string }[] = []
    try {
      const username = settings?.githubUsername || 'piyumdakshina'
      const res = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`, {
        headers: { 'User-Agent': 'piyumverse' },
        next: { revalidate: 3600 },
      })
      if (res.ok) {
        const data = (await res.json()) as {
          name: string
          description: string | null
          language: string | null
          stargazers_count: number
          forks_count: number
          html_url: string
        }[]
        repos = data.map((r) => ({
          name: r.name,
          description: r.description,
          language: r.language,
          stars: r.stargazers_count,
          forks: r.forks_count,
          htmlUrl: r.html_url,
        }))
      }
    } catch {
      repos = []
    }

    return { aboutPage, settings, philosophyPage, athleticsPage, galleryPage, testimonialsPage, projects, posts, counts: countResults, repos }
  } catch {
    return {
      aboutPage: null,
      settings: null,
      philosophyPage: null,
      athleticsPage: null,
      galleryPage: null,
      testimonialsPage: null,
      projects: [],
      posts: [],
      counts: null,
      repos: [],
    }
  }
}

export default async function HomePage() {
  const { aboutPage, settings, philosophyPage, athleticsPage, galleryPage, testimonialsPage, projects, posts, counts, repos } =
    await getHomeData()

  const galleryItems = (galleryPage?.items || []).map((item) => ({
    id: item.id,
    imageUrl: typeof item.image === 'object' && item.image?.url ? item.image.url : null,
    caption: item.caption || null,
    category: item.category || null,
  }))

  const contact = settings?.contact || {}
  const socialLinks = settings?.socialLinks || []
  const emailLink = socialLinks.find(
    (l) => l.platform?.toLowerCase().includes('email') || l.url?.includes('mailto')
  )
  const githubLink = socialLinks.find((l) => l.platform?.toLowerCase().includes('github'))

  const projectCount = counts?.[0]?.totalDocs ?? 0
  const postCount = counts?.[1]?.totalDocs ?? 0

  const overviewCards =
    settings?.overview?.cards?.map((card) => ({
      icon: card.icon || '🙋',
      title: card.title || '',
      description: card.description || '',
      link: { label: card.linkLabel || 'Read More', href: card.linkHref || '/about' },
    })) || hardcodedOverview

  const skillPills =
    settings?.skills?.pills?.map((pill) => pill.label).filter((label): label is string => !!label) || hardcodedPills

  const skillBars =
    settings?.skills?.bars?.map((bar) => ({ label: bar.label, percent: bar.percent ?? 0 })) || hardcodedBars

  const cmsStats = settings?.stats?.filter((s) => !!s.label && !!s.value) || []
  const extraStats =
    cmsStats.length > 0
      ? cmsStats
      : [
          { value: '∞', label: 'Dreams Chasing' },
          { value: '100%', label: 'Self-Taught' },
        ]

  const githubUsername = settings?.githubUsername || 'piyumdakshina'

  const infoRows = [
    ...(emailLink ? [{ label: 'Email', value: emailLink.url?.replace('mailto:', '') || '' }] : []),
    ...(githubLink ? [{ label: 'Github', value: githubLink.url?.replace('https://', '') || '' }] : []),
    { label: 'Language', value: 'Sinhala · English' },
    { label: 'Residence', value: 'Sri Lanka' },
  ]

  return (
    <ScrollFX>
      <HeroSection />

      <section data-reveal3d className="glass-card section-card">
        <div className="grid gap-4 md:grid-cols-3">
          {overviewCards.map((card, i) => (
            <Reveal key={card.title} delay={i * 120}>
              <TiltCard className="h-full">
                <div className="h-full flex flex-col rounded-2xl border border-grey bg-obsidian p-6 hover:border-cyan/30 transition-colors">
                  <div className="text-3xl mb-3">{card.icon}</div>
                  <h3 className="font-semibold text-text-primary mb-2">{card.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed flex-1">{card.description}</p>
                  <Link
                    href={card.link.href}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-cyan mt-4 hover:underline"
                  >
                    {card.link.label} <span aria-hidden>→</span>
                  </Link>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="about" data-reveal3d className="glass-card section-card">
        <Reveal>
          <span className="section-eyebrow">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-cyan">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            </svg>
            ABOUT ME
          </span>
        </Reveal>

        <Reveal delay={100}>
          <h2 className="minfo-title mt-7 md:mt-10">
            {aboutPage?.heading || 'Who is'} <span>{aboutPage?.headingAccent || 'Piyum Dakshina'}</span>
            {aboutPage?.headingRest ? ` ${aboutPage.headingRest}` : '?'}
          </h2>
        </Reveal>

        {aboutPage?.intro && (
          <Reveal delay={150}>
            <div className="mt-4 md:mt-6 text-text-secondary">
              <RichText data={aboutPage.intro} className="rich-text" />
            </div>
          </Reveal>
        )}

        <Reveal delay={200}>
          <div className="mt-6 flex flex-wrap items-center gap-2 md:gap-4">
            {skillPills.map((pill) => (
              <span
                key={pill}
                className="inline-block px-3.5 py-2 md:px-5 border border-dashed border-surface-light rounded-3xl text-sm text-text-secondary hover:text-cyan transition-colors cursor-default"
              >
                {pill}
              </span>
            ))}
          </div>
        </Reveal>

        <Reveal delay={250}>
          <ul className="grid mt-4 mb-10 text-sm md:grid-cols-2 gap-x-8 gap-y-3">
            {infoRows.map((row) => (
              <li key={row.label} className="flex items-center">
                <span className="flex-[0_0_6rem] text-text-secondary">{row.label}</span>
                <span className="flex-[0_0_2rem] text-text-secondary">:</span>
                <span className="text-text-primary">{row.value}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={300}>
          <ul className="grid grid-cols-2 gap-6 md:grid-cols-4 xl:gap-8">
            <li>
              <div className="mb-1 text-2xl font-semibold text-cyan md:text-3xl 2xl:text-4xl">
                <CountUp value={projectCount} suffix="+" />
              </div>
              <div className="text-sm text-text-secondary">Projects Built</div>
            </li>
            <li>
              <div className="mb-1 text-2xl font-semibold text-cyan md:text-3xl 2xl:text-4xl">
                <CountUp value={postCount} suffix="+" />
              </div>
              <div className="text-sm text-text-secondary">Blog Posts</div>
            </li>
            {extraStats.map((stat) => (
              <li key={stat.label}>
                <div className="mb-1 text-2xl font-semibold text-cyan md:text-3xl 2xl:text-4xl">{stat.value}</div>
                <div className="text-sm text-text-secondary">{stat.label}</div>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={350}>
          <div className="mt-10">
            <Link href="/about" className="btn-outline">
              READ MORE ABOUT ME
            </Link>
          </div>
        </Reveal>
      </section>

      <section id="skills" data-reveal3d className="glass-card section-card">
        <Reveal>
          <span className="section-eyebrow">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-cyan">
              <path d="M12 14l9-5-9-5-9 5 9 5zm0 0l9-5-9 5-9-5 9 5zm0 0v6" />
            </svg>
            SKILLS
          </span>
        </Reveal>

        <Reveal delay={100}>
          <h2 className="minfo-title mt-7 md:mt-10">
            My <span>Skills</span>
          </h2>
        </Reveal>

        <Reveal delay={150}>
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-5 mt-8">
            {skillBars.map((skill) => (
              <div key={skill.label}>
                <div className="flex items-center justify-between mb-2 text-sm">
                  <span className="text-text-primary font-medium">{skill.label}</span>
                  <span className="text-text-secondary">{skill.percent}%</span>
                </div>
                <div className="skill-bar">
                  <div className="skill-bar-fill" style={{ width: `${skill.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <section id="philosophy" data-reveal3d className="glass-card section-card">
        <Reveal>
          <span className="section-eyebrow">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-cyan">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V2H6.5A2.5 2.5 0 0 0 4 4.5v15zm0 0V21h13.5" />
            </svg>
            PHILOSOPHY
          </span>
        </Reveal>

        <Reveal delay={100}>
          <h2 className="minfo-title mt-5 mb-8 md:my-10">
            {philosophyPage?.heading || 'The'} <span>{philosophyPage?.headingAccent || 'Principles'}</span>
            {philosophyPage?.headingRest ? ` ${philosophyPage.headingRest}` : ''}
          </h2>
        </Reveal>

        {philosophyPage?.principles && philosophyPage.principles.length > 0 && (
          <Reveal delay={150}>
            <div className="grid gap-4 md:grid-cols-3">
              {philosophyPage.principles.slice(0, 3).map((principle) => (
                <div
                  key={principle.id}
                  className="rounded-2xl border border-grey bg-obsidian p-5 hover:border-cyan/20 transition-colors"
                >
                  <div className="text-3xl mb-3">{principle.icon || '📖'}</div>
                  <h3 className="font-semibold text-text-primary mb-2">{principle.title}</h3>
                  <p className="text-sm text-text-secondary line-clamp-4">{principle.description}</p>
                </div>
              ))}
            </div>
          </Reveal>
        )}

        <Reveal delay={200}>
          <div className="mt-8">
            <Link href="/philosophy" className="btn-outline">
              READ MORE
            </Link>
          </div>
        </Reveal>
      </section>

      <section id="athletics" data-reveal3d className="glass-card section-card">
        <Reveal>
          <span className="section-eyebrow">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-cyan">
              <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
            </svg>
            ATHLETICS
          </span>
        </Reveal>

        <Reveal delay={100}>
          <h2 className="minfo-title mt-5 mb-8 md:my-10">
            {athleticsPage?.heading || 'The'} <span>{athleticsPage?.headingAccent || "Runner's"}</span>
            {athleticsPage?.headingRest ? ` ${athleticsPage.headingRest}` : ''}
          </h2>
        </Reveal>

        {athleticsPage?.personalBests && athleticsPage.personalBests.length > 0 && (
          <Reveal delay={150}>
            <div className="grid grid-cols-3 gap-4">
              {athleticsPage.personalBests.slice(0, 3).map((pb) => (
                <div
                  key={pb.id}
                  className="rounded-2xl border border-grey bg-surface/50 p-6 text-center hover:border-cyan/30 transition-colors"
                >
                  <div className="text-2xl md:text-3xl font-semibold text-cyan mb-1">{pb.time}</div>
                  <div className="text-sm text-text-secondary">{pb.event}</div>
                </div>
              ))}
            </div>
          </Reveal>
        )}

        <Reveal delay={200}>
          <div className="mt-8">
            <Link href="/athletics" className="btn-outline">
              READ MORE
            </Link>
          </div>
        </Reveal>
      </section>

      {projects.length > 0 && (
        <section id="portfolio" data-reveal3d className="glass-card section-card">
          <Reveal>
            <span className="section-eyebrow">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-cyan">
                <path d="M3 3h7v7H3V3zm11 0h7v7h-7V3zM3 14h7v7H3v-7zm11 0h7v7h-7v-7z" />
              </svg>
              PORTFOLIO
            </span>
          </Reveal>

          <Reveal delay={100}>
            <h2 className="minfo-title mt-5 mb-8 md:my-10">
              Recent <span>Work</span>
            </h2>
          </Reveal>

          <div className="marquee mt-8">
            <div className="marquee-track" style={{ animationDuration: '45s' }}>
              {[0, 1].map((track) => (
                <div key={track} className="flex shrink-0 gap-4 lg:gap-7.5 pr-4 lg:pr-7.5 py-1">
                  {projects.map((project, i) => (
                    <Reveal key={`${track}-${project.id}`} delay={i * 100} className="w-[280px] md:w-[340px] shrink-0">
                      <ProjectCard
                        title={project.title}
                        slug={project.slug}
                        description={project.shortDescription || undefined}
                        techStack={
                          (project.techStack
                            ?.map((t) => ({ technology: t.technology || '' }))
                            .filter((t) => t.technology) ?? []) as { technology?: string }[]
                        }
                        status={project.status || undefined}
                        projectType={project.projectType || undefined}
                        achievement={project.achievement || undefined}
                        liveUrl={project.liveUrl || undefined}
                        githubUrl={project.githubUrl || undefined}
                        coverImage={
                          typeof project.coverImage === 'object' && project.coverImage?.url
                            ? project.coverImage.url as string
                            : null
                        }
                      />
                    </Reveal>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <Reveal delay={200}>
            <div className="mt-10 text-center md:mt-13">
              <Link href="/projects" className="btn-theme">
                VIEW ALL PROJECTS
              </Link>
            </div>
          </Reveal>
        </section>
      )}

      {posts.length > 0 && (
        <section id="blog" data-reveal3d className="glass-card section-card">
          <Reveal>
            <span className="section-eyebrow">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-cyan">
                <path d="M17 3a2.8 2.8 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
              </svg>
              BLOG
            </span>
          </Reveal>

          <Reveal delay={100}>
            <h2 className="minfo-title mt-5 mb-8 md:my-10">
              From the <span>Blog</span>
            </h2>
          </Reveal>

          <div className="marquee">
            <div className="marquee-track" style={{ animationDuration: '50s' }}>
              {[0, 1].map((track) => (
                <div key={track} className="flex shrink-0 gap-5 md:gap-7.5 pr-5 md:pr-7.5 py-1">
                  {posts.map((post) => {
                    const date = formatDate(post.publishedAt)
                    return (
                      <Reveal key={`${track}-${post.id}`} delay={100} className="w-[300px] md:w-[380px] shrink-0">
                        <TiltCard className="h-full">
                          <Link
                            href={`/blog/${post.slug}`}
                            className="group grid grid-cols-12 items-center gap-2 rounded-2xl bg-surface p-3.5 outline outline-1 outline-transparent transition-colors duration-300 hover:outline-cyan/30 hover:bg-surface/70 h-full"
                          >
                            <div className="flex flex-col col-span-12 px-3 pt-6 pb-2 md:p-5">
                              <div className="flex items-center gap-5 text-sm font-medium text-text-muted">
                                {date && <span className="post_date">{date}</span>}
                              </div>
                              <div className="mt-3 md:mt-4.5 mb-6 md:mb-8">
                                <h3 className="text-xl font-semibold leading-normal text-text-primary line-clamp-2 2xl:text-2xl 2xl:leading-normal transition-colors group-hover:text-cyan">
                                  {post.title}
                                </h3>
                              </div>
                              <div className="read-details">
                                <span className="inline-flex items-center gap-2 border border-cyan text-cyan text-sm py-3.5 px-6 rounded-3xl leading-none transition-all duration-300 group-hover:bg-cyan group-hover:text-obsidian font-medium">
                                  Read More
                                </span>
                              </div>
                            </div>
                          </Link>
                        </TiltCard>
                      </Reveal>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>

          <Reveal delay={200}>
            <div className="mt-10 text-center md:mt-13">
              <Link href="/blog" className="btn-theme">
                VIEW ALL POSTS
              </Link>
            </div>
          </Reveal>
        </section>
      )}

      {galleryItems.length > 0 && (
        <section id="gallery" data-reveal3d className="glass-card section-card">
          <Reveal>
            <span className="section-eyebrow">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-cyan">
                <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                <circle cx="12" cy="13" r="3" />
              </svg>
              GALLERY
            </span>
          </Reveal>

          <Reveal delay={100}>
            <h2 className="minfo-title mt-5 mb-8 md:my-10">
              Moments <span>in Motion</span>
            </h2>
          </Reveal>

          <div className="marquee">
            <div className="marquee-track" style={{ animationDuration: '45s' }}>
              {[0, 1].map((track) => (
                <div key={track} className="flex shrink-0 gap-4 lg:gap-7.5 pr-4 lg:pr-7.5 py-1">
                  {galleryItems.map((photo, i) => (
                    <Reveal key={`${track}-${photo.id}`} delay={i * 100} className="shrink-0">
                      <TiltCard>
                        <Link
                          href="/gallery"
                          className="group relative block w-[240px] md:w-[280px] aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-surface transition-colors duration-300 hover:border-cyan/40"
                        >
                          {photo.imageUrl && (
                            <img
                              src={photo.imageUrl}
                              alt={photo.caption || 'Gallery photo'}
                              loading="lazy"
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                            />
                          )}
                          {photo.caption && (
                            <span className="absolute inset-x-0 bottom-0 px-4 py-3 bg-gradient-to-t from-black/70 to-transparent text-sm font-medium text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              {photo.caption}
                            </span>
                          )}
                        </Link>
                      </TiltCard>
                    </Reveal>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <Reveal delay={200}>
            <div className="mt-10 text-center md:mt-13">
              <Link href="/gallery" className="btn-theme">
                VIEW ALL PHOTOS
              </Link>
            </div>
          </Reveal>
        </section>
      )}

      {repos.length > 0 && (
        <section id="github" data-reveal3d className="glass-card section-card">
          <Reveal>
            <span className="section-eyebrow">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-cyan">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              GITHUB
            </span>
          </Reveal>

          <Reveal delay={100}>
            <h2 className="minfo-title mt-5 mb-8 md:my-10">
              Latest from <span>GitHub</span>
            </h2>
          </Reveal>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {repos.map((repo, i) => (
              <Reveal key={repo.name} delay={i * 80}>
                <TiltCard className="h-full">
                  <a
                    href={repo.htmlUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group h-full flex flex-col rounded-2xl border border-grey bg-obsidian p-5 hover:border-cyan/40 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <h3 className="font-semibold text-text-primary group-hover:text-cyan transition-colors break-all">
                        {repo.name}
                      </h3>
                      {repo.language && (
                        <span className="shrink-0 flex items-center gap-1.5 text-xs text-text-muted">
                          <span className="w-2 h-2 rounded-full bg-cyan" aria-hidden="true" />
                          {repo.language}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-text-secondary leading-relaxed flex-1 line-clamp-2">
                      {repo.description || 'No description provided.'}
                    </p>
                    <div className="flex items-center gap-4 mt-4 text-xs text-text-muted">
                      <span className="flex items-center gap-1">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                        {repo.stars}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                          <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2" />
                        </svg>
                        {repo.forks}
                      </span>
                    </div>
                  </a>
                </TiltCard>
              </Reveal>
            ))}
          </div>

<Reveal delay={200}>
          <div className="mt-10 text-center md:mt-13">
            <a
              href={`https://github.com/${githubUsername}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-theme"
            >
              VIEW ALL REPOS
            </a>
          </div>
        </Reveal>
        </section>
      )}

      {testimonialsPage?.testimonials && testimonialsPage.testimonials.length > 0 && (
        <section id="testimonials" data-reveal3d className="glass-card section-card">
          <Reveal>
            <span className="section-eyebrow">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-cyan">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              {testimonialsPage.badge || 'TESTIMONIALS'}
            </span>
          </Reveal>

          <Reveal delay={100}>
            <h2 className="minfo-title mt-5 mb-4 md:mt-10">
              {testimonialsPage.heading || 'What'} <span>{testimonialsPage.headingAccent || 'People Say'}</span>
              {testimonialsPage.headingRest ? ` ${testimonialsPage.headingRest}` : ''}
            </h2>
          </Reveal>

          {testimonialsPage.subtitle && (
            <Reveal delay={150}>
              <p className="text-text-secondary mb-10 max-w-2xl">{testimonialsPage.subtitle}</p>
            </Reveal>
          )}

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {testimonialsPage.testimonials.map((t, i) => (
              <Reveal key={t.id} delay={i * 80}>
                <TiltCard className="h-full">
                  <figure className="h-full flex flex-col rounded-2xl border border-grey bg-obsidian p-6 hover:border-cyan/30 transition-colors">
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="text-cyan/60 mb-4"
                    aria-hidden="true"
                  >
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                  <blockquote className="text-sm text-text-secondary leading-relaxed flex-1">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-5 pt-4 border-t border-grey">
                    <p className="font-semibold text-text-primary text-sm">{t.name}</p>
                    {t.role && <p className="text-xs text-text-muted mt-0.5">{t.role}</p>}
                  </figcaption>
                </figure>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <section id="contact" data-reveal3d className="glass-card section-card">
        <Reveal>
          <span className="section-eyebrow">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-cyan">
              <path d="M22 7l-8.991 5.727a2 2 0 0 1-2.009 0L2 7m0 0a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7z" />
            </svg>
            CONTACT
          </span>
        </Reveal>

        <Reveal delay={100}>
          <h2 className="minfo-title mb-10 mt-7">
            {contact.heading || "Let's"} <span>{contact.headingAccent || 'Connect'}</span>
          </h2>
        </Reveal>

        <Reveal delay={150}>
          <div className="grid gap-12 mt-8 mb-10 md:my-12 md:grid-cols-12">
            <div className="md:col-span-5">
              <ul className="contact-info space-y-6 md:space-y-10 2xl:space-y-12">
                {infoRows.map((row) => (
                  <li key={row.label} className="flex items-center gap-5">
                    <div className="flex justify-center w-12">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#18A0C0" strokeWidth="1.8" className="w-7 h-7">
                        {row.label === 'Email' || row.label === 'Github' ? (
                          <path d="M22 7l-8.991 5.727a2 2 0 0 1-2.009 0L2 7m0 0a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7z" />
                        ) : (
                          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0zm-5 0a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                        )}
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h6 className="text-lg text-text-primary">{row.label}</h6>
                      <p className="text-sm text-text-secondary">{row.value}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="md:col-span-7">
              <ContactForm />
            </div>
          </div>
        </Reveal>
      </section>
    </ScrollFX>
  )
}
