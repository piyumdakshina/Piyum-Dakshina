import { getPayloadClient } from '@/lib/payload'

export const revalidate = 3600

const SITE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'https://piyumdakshina.com'

export async function GET() {
  const payload = await getPayloadClient()
  const [{ docs: projects }, { docs: posts }] = await Promise.all([
    payload.find({ collection: 'projects', sort: 'order', limit: 100 }),
    payload.find({
      collection: 'posts',
      where: { status: { equals: 'published' } },
      sort: '-publishedAt',
      limit: 20,
    }),
  ])

  const projectLines = projects
    .map((p) => `- [${p.title}](${SITE_URL}/projects/${p.slug})${p.shortDescription ? `: ${p.shortDescription}` : ''}`)
    .join('\n')
  const postLines = posts
    .map((post) => `- [${post.title}](${SITE_URL}/blog/${post.slug})${post.excerpt ? `: ${post.excerpt}` : ''}`)
    .join('\n')

  const txt = `# The Piyumverse — Piyum Dakshina

> Building with Dignity. Protecting with Humanity.

Piyum Dakshina is an 18-year-old self-taught developer and entrepreneur from Sri Lanka. He builds free technology that protects human dignity: digital safety platforms, education tools, and AI that serves people instead of exploiting them. Founder of AegisVue and lead programmer of LEAP (1st Runner-Up, HackX Junior 2025).

## Pages

- [Home](https://piyumdakshina.com/)
- [About](https://piyumdakshina.com/about)
- [Philosophy](https://piyumdakshina.com/philosophy)
- [Athletics](https://piyumdakshina.com/athletics)
- [Projects](https://piyumdakshina.com/projects)
- [Blog](https://piyumdakshina.com/blog)
- [Gallery](https://piyumdakshina.com/gallery)
- [Resume](https://piyumdakshina.com/resume)
- [Contact](https://piyumdakshina.com/contact)

## Skills

TypeScript, React, Next.js, Tailwind CSS, Node.js, Payload CMS, SQL & MongoDB, Python, Arduino, AI/LLM integration.

## Projects

${projectLines}

## Blog

${postLines}

## Contact

- Email: piyumdakshina573@gmail.com
- Site: ${SITE_URL}
- GitHub: https://github.com/piyumdakshina

## Key Facts

- 18 years old, self-taught (no courses, no certificates, no mentors)
- Founded AegisVue — a free digital safety platform (parental control, school management, workplace monitoring)
- Lead programmer of LEAP — AI platform against career stereotypes in Sri Lankan schools
- 1st Runner-Up at HackX Junior (University of Kelaniya), twice
- Runner, entrepreneur, dreamer
`

  return new Response(txt, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
