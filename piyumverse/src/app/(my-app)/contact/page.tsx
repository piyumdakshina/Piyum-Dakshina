import type { Metadata } from 'next'

import { ContactForm } from '@/components/ContactForm'
import { Reveal } from '@/components/effects/Reveal'
import { getPayloadClient } from '@/lib/payload'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Connect with Piyum Dakshina – Social Links & Email',
  description:
    'Connect with Piyum Dakshina on YouTube, Instagram, LinkedIn, TikTok, and more. Email: piyumdakshina573@gmail.com',
  alternates: {
    canonical: '/contact',
  },
}

export default async function ContactPage() {
  const payload = await getPayloadClient()
  const settings = await payload.findGlobal({ slug: 'site-settings' })

  const contact = settings.contact || {}
  const socialLinks = settings.socialLinks || []

  return (
    <section className="glass-card section-card">
      <Reveal>
        <span className="section-eyebrow">{contact.badge || 'Contact'}</span>
      </Reveal>

      <h1 className="minfo-title mb-4 mt-7 md:mt-10">
        {contact.heading || "Let's"} <span>{contact.headingAccent || 'Connect'}</span>
      </h1>
      {contact.description && (
        <p className="text-text-secondary mb-10 max-w-2xl">{contact.description}</p>
      )}

      <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <h2 className="text-xl font-medium text-text-primary mb-6">Social Links</h2>
            <div className="space-y-3">
              {socialLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-2xl border border-grey bg-obsidian p-4 flex items-center gap-4 hover:border-cyan/40 transition-all group"
                >
                  <span className="text-xl">{link.icon}</span>
                  <div>
                    <p className="text-text-primary font-medium group-hover:text-cyan transition-colors">
                      {link.platform}
                    </p>
                    <p className="text-xs text-text-muted">
                      {link.url?.replace('https://', '') || ''}
                    </p>
                  </div>
                  <span className="ml-auto text-text-muted group-hover:text-cyan transition-colors">
                    ↗
                  </span>
                </a>
              ))}
            </div>
          </div>

          <div className="md:col-span-7">
            <h2 className="text-xl font-medium text-text-primary mb-6">Send a Message</h2>
            <ContactForm />
          </div>
        </div>
    </section>
  )
}
