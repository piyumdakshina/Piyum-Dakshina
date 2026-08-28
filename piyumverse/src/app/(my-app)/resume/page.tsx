import type { Metadata } from 'next'
import Link from 'next/link'

import { PrintButton } from '@/components/PrintButton'
import { Reveal } from '@/components/effects/Reveal'
import { getPayloadClient } from '@/lib/payload'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Resume – Piyum Dakshina',
  description:
    "Resume of Piyum Dakshina — an 18-year-old self-taught developer from Sri Lanka. Skills, projects, education, and achievements.",
  alternates: {
    canonical: '/resume',
  },
}

const skillPills = ['TypeScript', 'React', 'Next.js', 'Tailwind CSS', 'Node.js', 'Payload CMS', 'SQL & MongoDB', 'Python', 'Arduino']

const skillBars = [
  { label: 'Frontend — React · Next.js · Tailwind', percent: 95 },
  { label: 'Language — TypeScript', percent: 90 },
  { label: 'Backend — Node.js · Payload CMS', percent: 88 },
  { label: 'Data — SQL · MongoDB', percent: 80 },
  { label: 'AI/ML — LLMs · Python', percent: 75 },
  { label: 'Hardware — Arduino', percent: 70 },
]

export default async function ResumePage() {
  const payload = await getPayloadClient()
  const [aboutPage, athleticsPage, settings] = await Promise.all([
    payload.findGlobal({ slug: 'about-page' }),
    payload.findGlobal({ slug: 'athletics-page' }),
    payload.findGlobal({ slug: 'site-settings' }),
  ])

  const education = aboutPage.education?.items || []
  const projects = aboutPage.projects?.highlights || []
  const achievements = athleticsPage.achievements || []
  const socialLinks = settings.socialLinks || []

  return (
    <section className="glass-card section-card print:border-0 print:shadow-none print:bg-transparent print:p-0">
      <div className="flex flex-wrap items-start justify-between gap-6 mb-10">
        <Reveal>
          <div>
            <span className="section-eyebrow">Resume</span>
            <h1 className="minfo-title mt-7">
              Piyum <span>Dakshina</span>
            </h1>
            <p className="mt-2 text-lg text-text-secondary">
              Self-Taught Developer & Entrepreneur · Sri Lanka
            </p>
          </div>
        </Reveal>
        <Reveal delay={100}>
          <div className="flex flex-wrap gap-3 print:hidden">
            <a href="/resume.pdf" download className="btn-theme">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" className="inline-block mr-2 align-[-2px]">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download PDF
            </a>
            <PrintButton />
          </div>
        </Reveal>
      </div>

      <div className="space-y-12">
        <Reveal>
          <div className="grid gap-4 text-sm md:grid-cols-2 print:grid-cols-2">
            <a
              href="mailto:piyumdakshina573@gmail.com"
              className="flex items-center gap-3 text-text-secondary hover:text-cyan transition-colors"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              piyumdakshina573@gmail.com
            </a>
            <span className="flex items-center gap-3 text-text-secondary">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              Sri Lanka
            </span>
            <span className="flex items-center gap-3 text-text-secondary">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              <Link href="/" className="hover:text-cyan transition-colors">
                piyumdakshina.com
              </Link>
            </span>
          </div>
        </Reveal>

        <Reveal>
          <div>
            <h2 className="resume-section-title">Profile</h2>
            <p className="text-text-secondary leading-relaxed">
              An 18-year-old self-taught developer from Sri Lanka building free technology that
              protects human dignity — digital safety platforms, education tools, and AI that serves
              people instead of exploiting them. Founder of AegisVue; 1st Runner-Up at HackX Junior.
            </p>
          </div>
        </Reveal>

        <Reveal>
          <div>
            <h2 className="resume-section-title">Skills</h2>
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-4">
              {skillBars.map((skill) => (
                <div key={skill.label}>
                  <div className="flex items-center justify-between mb-1.5 text-sm">
                    <span className="text-text-primary font-medium">{skill.label}</span>
                    <span className="text-text-secondary">{skill.percent}%</span>
                  </div>
                  <div className="skill-bar">
                    <div className="skill-bar-fill" style={{ width: `${skill.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 mt-6">
              {skillPills.map((pill) => (
                <span
                  key={pill}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-teal/10 text-teal border border-teal/20 print:bg-obsidian"
                >
                  {pill}
                </span>
              ))}
            </div>
          </div>
        </Reveal>

        {projects.length > 0 && (
          <Reveal>
            <div>
              <h2 className="resume-section-title">Selected Projects</h2>
              <div className="space-y-4">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="rounded-2xl border border-grey bg-obsidian p-5 print:border-grey/50 print:bg-transparent"
                  >
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h3 className="font-semibold text-text-primary">{project.title}</h3>
                      {project.tagline && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal/10 text-teal border border-teal/20">
                          {project.tagline}
                        </span>
                      )}
                    </div>
                    {project.achievement && (
                      <p className="text-sm font-medium text-teal mb-2">🏆 {project.achievement}</p>
                    )}
                    <p className="text-sm text-text-secondary leading-relaxed">{project.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        )}

        {education.length > 0 && (
          <Reveal>
            <div>
              <h2 className="resume-section-title">Education</h2>
              <div className="space-y-4">
                {education.map((item) => (
                  <div key={item.id} className="rounded-2xl border border-grey bg-obsidian p-5 print:border-grey/50 print:bg-transparent">
                    <h3 className="font-semibold text-text-primary">{item.title}</h3>
                    <p className="text-sm text-text-secondary mt-1">{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        )}

        {achievements.length > 0 && (
          <Reveal>
            <div>
              <h2 className="resume-section-title">Achievements</h2>
              <ul className="space-y-2">
                {achievements.map((achievement, i) => (
                  <li key={i} className="flex items-start gap-3 text-text-secondary">
                    <span className="text-cyan mt-0.5">▸</span>
                    <span>{achievement.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        )}

        {socialLinks.length > 0 && (
          <Reveal>
            <div>
              <h2 className="resume-section-title">Connect</h2>
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-grey text-sm text-text-secondary hover:border-cyan/40 hover:text-cyan transition-colors print:no-underline"
                  >
                    {link.icon && <span>{link.icon}</span>}
                    {link.platform}
                  </a>
                ))}
              </div>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  )
}
