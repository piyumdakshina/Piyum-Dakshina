import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

import type { Payload } from 'payload'
import { getPayload } from 'payload'

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || 'admin@piyumdakshina.com'
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || 'Piyumverse@2026'

type LexicalChild = {
  type: string
  version: number
  [key: string]: unknown
}

type RichTextValue = {
  root: {
    type: string
    version: number
    direction: 'ltr' | 'rtl' | null
    format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | ''
    indent: number
    children: LexicalChild[]
  }
}

const textNode = (text: string, bold = false): LexicalChild => ({
  type: 'text',
  text,
  version: 1,
  format: bold ? 1 : 0,
})

const linkNode = (text: string, url: string, bold = false): LexicalChild => ({
  type: 'link',
  version: 3,
  fields: { url, linkType: 'custom', newTab: false },
  children: [textNode(text, bold)],
  direction: 'ltr',
  format: '',
  indent: 0,
  textFormat: 0,
  textStyle: '',
})

const paragraph = (children: LexicalChild[]): LexicalChild => ({
  type: 'paragraph',
  version: 1,
  children,
  direction: 'ltr',
  format: '',
  indent: 0,
  textFormat: 0,
  textStyle: '',
})

const richText = (paragraphs: LexicalChild[][]): RichTextValue => ({
  root: {
    type: 'root',
    version: 1,
    direction: 'ltr',
    format: '',
    indent: 0,
    children: paragraphs.map((children) => paragraph(children)),
  },
})

/** Upsert a placeholder image into the media collection (idempotent by filename). */
async function ensureImage(
  payload: Payload,
  fileName: string,
  alt: string,
  seedTag: string,
  size: { width?: number; height?: number; grayscale?: boolean } = {},
): Promise<number | null> {
  const { docs } = await payload.find({
    collection: 'media',
    where: { filename: { equals: fileName } },
    limit: 1,
  })
  if (docs.length > 0) return docs[0].id as number

  const { width = 1200, height = 630, grayscale = false } = size
  const res = await fetch(
    `https://picsum.photos/seed/${seedTag}/${width}/${height}${grayscale ? '?grayscale' : ''}`,
  )
  if (!res.ok) return null

  const buffer = Buffer.from(await res.arrayBuffer())
  const created = await payload.create({
    collection: 'media',
    data: { alt },
    file: { name: fileName, mimetype: 'image/jpeg', data: buffer, size: buffer.length },
  })
  console.log(`✓ Image "${fileName}" uploaded`)
  return created.id as number
}

const projects = [
  {
    title: 'AegisVue',
    slug: 'aegisvue',
    shortDescription:
      'A 100% free digital safety platform that unifies parental control, school management, and workplace monitoring — the foundation for my own AI assistant.',
    longDescription:
      'Challenge: Families, schools, and workplaces have no single free tool to protect people online. Parental control, school management, and workplace monitoring are scattered across paid products — so most families simply go unprotected.\n\nApproach: I chose to build AegisVue as one all-in-one system rather than another single-feature tool. Everything is free by design, because protection should not be a premium feature. The architecture separates each domain into a modular service so schools, families, and workplaces share one secure core without sharing data.\n\nSolution: AegisVue combines parental control, school management, workplace monitoring, and digital forensics into one platform. It is also the foundation for building my own J.A.R.V.I.S.-style AI assistant — an agent that will understand, protect, and assist the people it serves.\n\nImpact: Currently in private production with a public release coming soon. Built 100% solo — architecture, UI, backend, and security — which taught me to own a product end to end.',
    techStack: ['Next.js', 'Payload CMS', 'TypeScript', 'AI/LLM', 'SQLite'],
    status: 'production',
    projectType: 'solo',
    achievement: '',
    githubUrl: 'https://github.com/piyumdakshina/aegisvue',
    order: 1,
  },
  {
    title: 'LEAP',
    slug: 'leap',
    shortDescription:
      'An AI platform that breaks career stereotypes in Sri Lankan schools — 1st Runner-Up at HackX Junior, University of Kelaniya.',
    longDescription:
      'Challenge: Career stereotypes in Sri Lankan schools push students away from jobs they could actually succeed in. Students have no safe space to share these experiences, and no unbiased source of career information.\n\nApproach: As the sole programmer of a five-person team, I built LEAP with three parts that each attack a different stage of the problem: anonymous story sharing to surface the issue, gamified daily challenges to unlearn stereotypes, and a job explorer with 100+ real careers (salaries, qualifications, myth vs. reality) to replace hearsay with data.\n\nSolution: A three-tab AI-powered web app — Share Your Story, Daily Challenge, and Job Explorer — where every career detail is verified against real market data.\n\nImpact: Measured a 30% reduction in career stereotypes among users and collected 50+ anonymous stories. Placed 1st Runner-Up at HackX Junior at the University of Kelaniya.',
    techStack: ['Next.js', 'TypeScript', 'AI/ML', 'Tailwind CSS'],
    status: 'completed',
    projectType: 'team',
    achievement: '1st Runner-Up @ HackX Junior — University of Kelaniya (cash prize)',
    liveUrl: 'https://g6pjgxc.s.gy/leap-app',
    order: 2,
  },
  {
    title: 'VR Chemistry Lab',
    slug: 'vr-chemistry-lab',
    shortDescription:
      'Arduino-powered gloves that simulate real chemical reactions in VR — for schools without a chemistry lab.',
    longDescription:
      'Challenge: Many schools in Sri Lanka lack chemistry lab facilities, so students never experience real reactions — they only memorize them.\n\nApproach: I decided the missing piece was not a better textbook but physical interaction. I built Arduino-powered gloves that track hand and finger movement and map it into a virtual chemistry lab, so pouring, mixing, and observing happen as they would at a real bench.\n\nSolution: Custom Arduino gloves, real physics simulations, and a VR interface that renders reactions with accurate behavior — safe enough for a classroom, real enough to learn from.\n\nImpact: 1st Runner-Up at HackX Junior with a cash prize. Demonstrated that affordable hardware + open code can replace expensive lab infrastructure.',
    techStack: ['Arduino', 'VR/3D', 'Python', 'Hardware'],
    status: 'completed',
    projectType: 'competition',
    achievement: '1st Runner-Up @ HackX Junior (cash prize)',
    order: 3,
  },
  {
    title: 'LMS Platform',
    slug: 'lms-platform',
    shortDescription: 'A full-featured Learning Management System built for educational institutions.',
    longDescription:
      'Challenge: Small institutions rely on spreadsheets and messaging apps to run courses, assignments, and grades — with no single source of truth.\n\nApproach: I designed a role-based system where teachers, students, and admins each see exactly what they need, with assignment submissions and grading centralized in one flow.\n\nSolution: A complete LMS covering courses, students, assignments, grade tracking, and real-time notifications, with role-based access control.\n\nImpact: Used as a foundation for several of my later products — the patterns around permissions and content models were reused in AegisVue.',
    techStack: ['React', 'Node.js', 'MongoDB'],
    status: 'completed',
    projectType: 'solo',
    achievement: '',
    order: 4,
  },
  {
    title: 'Trading Signal Tool',
    slug: 'trading-signal-tool',
    shortDescription: 'An automated trading signal detector that turns raw market data into clear signals.',
    longDescription:
      'Challenge: Following markets manually means reacting late — by the time a pattern is obvious, the move has already happened.\n\nApproach: I built a pipeline that ingests market data, applies technical indicators and pattern recognition, and reduces the output to a small set of actionable signals instead of raw noise.\n\nSolution: A Python-based analysis tool with a data pipeline, indicator engine, and signal generation layer.\n\nImpact: Validated my ability to build data-processing systems — the same architecture thinking now applies to AegisVue\u2019s digital forensics modules.',
    techStack: ['Python', 'Finance API', 'Data Analysis'],
    status: 'development',
    projectType: 'solo',
    achievement: '',
    order: 5,
  },
  {
    title: 'Garments RM System',
    slug: 'garments-rm-system',
    shortDescription: 'A raw materials management system for the garment industry.',
    longDescription:
      'Challenge: Garment factories track raw materials across suppliers, purchase orders, and production lines — a process that breaks down when done on paper.\n\nApproach: I built a system that tracks inventory in real time, manages supplier relationships, and links purchase orders to material usage so stock levels are always knowable.\n\nSolution: A management system covering inventory, suppliers, purchase orders, and usage analytics.\n\nImpact: Shipped a working system for a real industry workflow, and learned how domain constraints (thread types, roll units, dye lots) shape data modeling.',
    techStack: ['JavaScript', 'Node.js', 'SQL'],
    status: 'completed',
    projectType: 'team',
    achievement: '',
    order: 6,
  },
  {
    title: 'Spyware Detection Tools',
    slug: 'spyware-detection',
    shortDescription: 'Cybersecurity research tools that detect and analyze spyware threats.',
    longDescription:
      'Challenge: Spyware operates silently — by the time a user notices, data has already leaked. Detection requires understanding how malicious software behaves, not just what it is named.\n\nApproach: For cybersecurity research, I built tools that analyze network traffic and monitor process behavior for signs of surveillance, rather than relying on signature lists.\n\nSolution: A collection of detection tools covering network traffic analysis, behavior monitoring, and automated threat response.\n\nImpact: Deepened my understanding of how systems are attacked — knowledge that directly shapes the security-first architecture of AegisVue.',
    techStack: ['Python', 'Cybersecurity', 'Network Analysis'],
    status: 'development',
    projectType: 'solo',
    achievement: '',
    order: 7,
  },
]

const projectMedia: Record<string, { seed: string; file: string; featured?: boolean }> = {
  aegisvue: { seed: 'cover-aegisvue', file: 'aegisvue-cover.jpg', featured: true },
  leap: { seed: 'cover-leap', file: 'leap-cover.jpg', featured: true },
  'vr-chemistry-lab': { seed: 'cover-vrlab', file: 'vr-chemistry-lab-cover.jpg', featured: true },
  'lms-platform': { seed: 'cover-lms', file: 'lms-platform-cover.jpg' },
  'trading-signal-tool': { seed: 'cover-trading', file: 'trading-signal-tool-cover.jpg' },
  'garments-rm-system': { seed: 'cover-garments', file: 'garments-rm-system-cover.jpg' },
  'spyware-detection': { seed: 'cover-spyware', file: 'spyware-detection-cover.jpg' },
}

async function seed(payload: Payload) {
  console.log('── Seeding The Piyumverse CMS ──')

  const [{ totalDocs: userCount }, { totalDocs: projectCount }] = await Promise.all([
    payload.count({ collection: 'users' }),
    payload.count({ collection: 'projects' }),
  ])

  if (userCount === 0) {
    await payload.create({
      collection: 'users',
      data: {
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        name: 'Piyum Dakshina',
      },
    })
    console.log(`✓ Admin user created: ${ADMIN_EMAIL} (password: ${ADMIN_PASSWORD})`)
  } else {
    console.log('• Admin user already exists, skipping')
  }

  for (const project of projects) {
    const { docs } = await payload.find({
      collection: 'projects',
      where: { slug: { equals: project.slug } },
      limit: 1,
    })
    const media = projectMedia[project.slug]
    const coverImage = media
      ? await ensureImage(payload, media.file, `Cover image — ${project.title}`, media.seed, { width: 1200, height: 630, grayscale: true })
      : null
    const data: {
      title: string
      slug: string
      shortDescription: string
      longDescription: string
      techStack: { technology: string }[]
      status: 'development' | 'production' | 'completed'
      projectType: 'solo' | 'team' | 'competition'
      achievement: string
      githubUrl: string
      liveUrl: string
      order: number
      featured: boolean
      coverImage?: number
    } = {
      title: project.title,
      slug: project.slug,
      shortDescription: project.shortDescription,
      longDescription: project.longDescription,
      techStack: project.techStack.map((technology) => ({ technology })),
      status: project.status as 'development' | 'production' | 'completed',
      projectType: project.projectType as 'solo' | 'team' | 'competition',
      achievement: project.achievement || '',
      githubUrl: project.githubUrl || '',
      liveUrl: project.liveUrl || '',
      order: project.order,
      featured: Boolean(media?.featured),
    }
    if (coverImage) data.coverImage = coverImage
    if (docs.length > 0) {
      await payload.update({
        collection: 'projects',
        id: docs[0].id,
        data,
      })
      console.log(`↻ Project "${project.slug}" updated`)
    } else {
      await payload.create({
        collection: 'projects',
        data,
      })
      console.log(`✓ Project "${project.slug}" created`)
    }
  }

  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      siteName: 'The Piyumverse',
      metadata: {
        title: 'Piyum Dakshina – Building with Dignity. Protecting with Humanity.',
        description:
          'Piyum Dakshina is an 18-year-old self-taught developer from Sri Lanka. Founder of AegisVue and lead programmer of LEAP. Building technology that protects human dignity.',
        siteUrl: 'https://piyumdakshina.com',
      },
      navItems: [
        { label: 'Home', href: '/#home' },
        { label: 'About', href: '/about' },
        { label: 'Skills', href: '/#skills' },
        { label: 'Philosophy', href: '/philosophy' },
        { label: 'Athletics', href: '/athletics' },
        { label: 'Projects', href: '/projects' },
        { label: 'Blog', href: '/blog' },
        { label: 'Gallery', href: '/gallery' },
        { label: 'Contact', href: '/contact' },
      ],
      hero: {
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
      },
      overview: {
        cards: [
          {
            icon: '🙋',
            title: 'Who I Am',
            description:
              'An 18-year-old self-taught developer from Sri Lanka. No paid courses. No certificates. No mentors — just late nights, trial and error, and refusing to give up.',
            linkLabel: 'Read My Story',
            linkHref: '/about',
          },
          {
            icon: '🛠️',
            title: 'What I Build',
            description:
              'Digital safety platforms like AegisVue, AI tools like LEAP, and hardware like VR Chemistry Lab — technology built to serve people, not control them.',
            linkLabel: 'Explore My Work',
            linkHref: '/projects',
          },
          {
            icon: '💎',
            title: 'Why It Matters',
            description:
              'Information is wealth. Protect human dignity. My wealth is trust, not money. I build because it is my breath — and everyone deserves access to it.',
            linkLabel: 'My Philosophy',
            linkHref: '/philosophy',
          },
        ],
      },
      skills: {
        pills: ['TypeScript', 'React', 'Next.js', 'Tailwind CSS', 'Node.js', 'Payload CMS', 'SQL & MongoDB', 'Python', 'Arduino'].map(
          (label) => ({ label }),
        ),
        bars: [
          { label: 'Frontend — React · Next.js · Tailwind', percent: 95 },
          { label: 'Language — TypeScript', percent: 90 },
          { label: 'Backend — Node.js · Payload CMS', percent: 88 },
          { label: 'Data — SQL · MongoDB', percent: 80 },
          { label: 'AI/ML — LLMs · Python', percent: 75 },
          { label: 'Hardware — Arduino', percent: 70 },
        ],
      },
      stats: [
        { value: '∞', label: 'Dreams Chasing' },
        { value: '100%', label: 'Self-Taught' },
      ],
      githubUsername: 'piyumdakshina',
      contact: {
        badge: 'Contact',
        heading: "Let's",
        headingAccent: 'Connect',
        description:
          'I reply to every message — usually within 48 hours. I’m based in Sri Lanka (GMT+5:30), so if the reply lands at an odd hour, that’s why. Open to collaborations, questions, or just saying hello.',
      },
      footer: {
        builtBy: 'Built with Dignity by',
        name: 'Piyum Dakshina',
        rightsText: 'The Piyumverse. All rights reserved.',
      },
      socialLinks: [
        { platform: 'YouTube', url: 'https://youtube.com/@piyumdakshina369', icon: '▶️' },
        { platform: 'Instagram', url: 'https://instagram.com/piyum_dakshina', icon: '📸' },
        { platform: 'Facebook', url: 'https://facebook.com/piyum.dakshina', icon: '💬' },
        { platform: 'LinkedIn', url: 'https://linkedin.com/in/piyumdakshina', icon: '💼' },
        { platform: 'TikTok', url: 'https://tiktok.com/@piyum_dakshina_', icon: '🎵' },
        { platform: 'Email', url: 'mailto:piyumdakshina573@gmail.com', icon: '📧' },
      ],
    },
  })
  console.log('✓ Site settings seeded')

  await payload.updateGlobal({
    slug: 'about-page',
    data: {
      badge: 'About',
      heading: 'Who is',
      headingAccent: 'Piyum Dakshina',
      headingRest: '?',
      intro: richText([
        [
          textNode('I am '),
          textNode('R.W.K Piyum Dakshina Damsiri', true),
          textNode(
            ' — an 18-year-old self-taught developer and founder of AegisVue from Ragama, Sri Lanka. I design and ship full-stack web applications with ',
          ),
          textNode('React, Next.js, TypeScript, and Payload CMS', true),
          textNode(
            ', and I am currently studying Combined Mathematics, Physics, and Chemistry for my A/Ls.',
          ),
        ],
        [
          textNode('How I work: '),
          textNode('small iterations, honest trade-offs, learning in public', true),
          textNode(
            '. I never took a paid course and I never had a mentor — I taught myself by breaking things and fixing them, and I share every lesson on this site.',
          ),
        ],
        [
          textNode('One thing about me: '),
          textNode('I was a national-level sprinter before I became a developer', true),
          textNode(
            ' — my 100m personal best is 11.7 seconds. The discipline I learned on the track is the same discipline I bring to every line of code.',
          ),
        ],
      ]),
      body: richText([
        [
          textNode('I was born on '),
          textNode('March 30, 2008', true),
          textNode(
            ' at the Ragama Teaching Hospital, and I grew up in Batuwatta, Ragama — where I still live today. My journey started with a simple ',
          ),
          linkNode('Windows XP laptop', '/about'),
          textNode(
            '. I explored. I clicked. I broke things. I fixed them. I learned. My first project was a simple HTML website built on NetBeans software. It wasn’t much. But it was mine. And it started everything.',
          ),
        ],
        [
          textNode('I never took a paid course. I never had a certificate. I never had a mentor. I refused to ask my parents for money — I wanted to earn everything myself. So I taught myself. Through late nights. Through trial and error. Through breaking things and fixing them again.'),
        ],
        [
          textNode('My proudest moment was winning '),
          textNode('1st Runner-Up at HackX Junior', true),
          textNode(
            ' at the University of Kelaniya — competing against university students as a school student. That moment proved to me that ',
          ),
          textNode('age is just a number', true),
          textNode(
            '. That talent doesn’t need a certificate. That a kid from Ragama with a computer and a dream can compete with anyone.',
          ),
        ],
      ]),
      bodyAfter: richText([
        [
          textNode('Where is this taking me? '),
          textNode('to a seat at the table of people who get to decide what technology does to society.', true),
          textNode(
            ' AegisVue is the vehicle. My A/Ls are the discipline. Every project on this site is a proof that I belong there — not because I ask for permission, but because I build things that work.',
          ),
        ],
        [
          textNode('If you are reading this and building something of your own, forget the course, forget the certificate, forget the mentor. Start. Break. Fix. Ship. Repeat. The world rewards the people who refuse to stop.', true),
        ],
      ]),
      coreValues: [
        { icon: '💻', title: 'Why I Build', description: 'Because it is my breath. It is not a choice. It is who I am.' },
        { icon: '📖', title: 'Information is Wealth', description: 'Data reveals truth, creates value, and breaks barriers.' },
        { icon: '🛡️', title: 'Protect Human Dignity', description: 'My wealth is trust, not money. Technology should serve, not exploit.' },
        { icon: '🌱', title: 'My Definition of Success', description: 'Success is humanity — being respected for who you are.' },
      ],
      story: {
        heading: 'My Story',
        sections: [
          {
            icon: '📍',
            title: 'Where I Come From',
            content: richText([
              [
                textNode(
                  'I was born on March 30, 2008, at the Ragama Teaching Hospital in Ragama, Sri Lanka. I grew up in Batuwatta, Ragama, where I still live today.',
                ),
              ],
              [
                textNode(
                  'I speak Sinhala as my native language. I studied in English medium for my education, so I can understand and communicate in English — though I’m not completely fluent yet.',
                ),
              ],
            ]),
          },
          {
            icon: '🖥️',
            title: 'My First Computer',
            content: richText([
              [
                textNode(
                  'When I was young, I got my first computer — a Windows XP laptop. That changed everything.',
                ),
              ],
              [
                textNode(
                  'I didn’t know what I was doing at first. I just explored. I clicked. I broke things. I fixed them. I learned.',
                ),
              ],
              [
                textNode(
                  'My first project was a simple HTML website built on NetBeans software. It wasn’t much. But it was mine. And it started everything.',
                ),
              ],
            ]),
          },
          {
            icon: '🎓',
            title: 'Why I Am Self-Taught',
            content: richText([
              [
                textNode(
                  'I never took a paid course. I never had a certificate. I never had a mentor. Why? Because I refused to ask my parents for money.',
                ),
              ],
              [
                textNode(
                  'I wanted to spend my own money on my learning. I wanted to earn everything myself. I didn’t want to be a burden. I wanted to be independent.',
                ),
              ],
              [
                textNode(
                  'So I taught myself. Through late nights. Through trial and error. Through breaking things and fixing them again.',
                ),
              ],
            ]),
          },
          {
            icon: '🔥',
            title: 'My Struggle',
            content: richText([
              [
                textNode(
                  'It wasn’t easy. My parents didn’t understand. During exams, they blamed me. They said I was wasting my time on “unnecessary” things. My school pressured me. My family shouted at me.',
                ),
              ],
              [
                textNode('So I did everything in hiding. I coded when no one was watching. I built when no one believed. I kept going when everyone told me to stop.'),
              ],
              [
                textNode(
                  'That is who I am. Someone who keeps going — even when no one believes.',
                  true,
                ),
              ],
            ]),
          },
        ],
      },
      proudestMoment: {
        heading: 'My Proudest Moment',
        title: '1st Runner-Up at HackX Junior',
        content: richText([
          [
            textNode(
              'My proudest moment was when I won 1st Runner-Up at HackX Junior — a competition held at the University of Kelaniya. I competed against university students. I was just a school student. And I won.',
            ),
          ],
          [
            textNode(
              'That moment proved to me that age is just a number. That talent doesn’t need a certificate. That a kid from Ragama with a computer and a dream can compete with anyone.',
            ),
          ],
        ]),
      },
      philosophy: {
        heading: 'My Philosophy',
        points: [
          {
            icon: '💻',
            title: 'Why I Build',
            text: 'I build because it is my breath. I don’t know why. But I love it. It’s not a choice. It’s who I am.',
          },
          {
            icon: '📖',
            title: 'Information is Wealth',
            text: 'Data reveals truth. It reveals the real face of people. It creates value. It exposes lies. It builds bridges. It breaks barriers. That is why I build what I build — to unlock that wealth, to share it, to protect it.',
          },
          {
            icon: '🛡️',
            title: 'Protect Human Dignity',
            text: 'I don’t want fame. I want dignity. My wealth is trust, not money. Technology should protect, not exploit. It should serve people, not control them.',
          },
          {
            icon: '⭐',
            title: 'My Definition of Success',
            text: 'Success is not money. Success is not fame. Success is being a man that has humanity — and that all the people in the world dignity or respect for me. That is success. Nothing else.',
          },
        ],
        message: '“Don’t earn money. Earn humanity, dignity, respect, trust.”',
      },
      dream: {
        heading: 'My Dream',
        content: richText([
          [
            textNode('My biggest dream is to be a '),
            textNode('respected person in the world', true),
            textNode('. Not famous. Not rich. Respected.'),
          ],
          [
            textNode(
              'I want to be the man that one day a child says: “I want to be like Piyum.” Not because I was a celebrity. Because I built things that protected dignity. Things that broke barriers. Things that gave people hope.',
            ),
          ],
          [
            textNode('In 5 years, I want to: finish my A/Ls, complete my university life, and build the foundation for my future life.',),
          ],
          [
            textNode(
              'My ultimate vision is to be the king of the internet. Not to control it. To build it. To protect it. To make it a place where dignity and humanity come first.',
            ),
          ],
        ]),
      },
      projects: {
        heading: 'My Projects',
        highlights: [
          {
            title: 'AegisVue',
            tagline: 'My Solo Product',
            description:
              'AegisVue is my dream. My personal project. My power. It is a digital safety platform that protects families, schools, and workplaces. It is 100% free. It combines parental control, school management, workplace monitoring, and digital forensics into one system. It is also the foundation for building my own AI — like J.A.R.V.I.S. from Iron Man. AegisVue is in private production. Public release is coming soon.',
          },
          {
            title: 'LEAP',
            tagline: 'Team Project — I’m the Sole Programmer',
            achievement: '1st Runner-Up @ HackX Junior — University of Kelaniya (cash prize)',
            description:
              'LEAP is an AI-powered platform that breaks career stereotypes in Sri Lankan schools. It has three parts: Share Your Story — students anonymously share their experiences with stereotypes; Daily Challenge — gamified activities to break stereotypes; and Job Explorer — 100+ careers with salaries, qualifications, myth vs. reality. I was the sole programmer. Impact: 30% reduction in career stereotypes. 50+ anonymous stories collected.',
          },
          {
            title: 'VR Chemistry Lab',
            tagline: 'Arduino Gloves',
            achievement: '1st Runner-Up @ HackX Junior — University of Kelaniya (cash prize)',
            description:
              'I built Arduino-powered gloves that track hand and finger movements to simulate real chemical reactions in virtual reality. Purpose: for schools without chemistry lab facilities.',
          },
          {
            title: 'Other Builds',
            tagline: 'And Many More',
            description:
              'Learning Management System (LMS), Trading Signal Tracking Tool, Garments RM Records Management System, Spyware Tools (for cybersecurity research), and various websites and apps. Some have names. Many don’t. But each one built the developer I am today.',
          },
        ],
      },
      athletics: {
        heading: 'My Athletics',
        content: richText([
          [
            textNode(
              'Before my A/L studies took over, I was a national-level sprinter. School #1 in 100m, 200m, and hurdles. Personal Best: 100m in 11.7 seconds.',
            ),
          ],
          [
            textNode(
              'I competed at Zonal, Divisional, and Provincial levels, and reached the semi-finals at the John Tarbet National Championships. I also ran long-distance: 400m, 800m, 3000m, and 5000m.',
            ),
          ],
          [
            textNode(
              'Athletics taught me discipline. That discipline is now channeled into every line of code I write. I no longer run competitively — my focus is now on building technology and preparing for my A/Ls. But the athlete’s mindset stays with me forever.',
            ),
          ],
        ]),
      },
      education: {
        heading: 'My Education',
        items: [
          { title: 'Primary School', detail: 'WP/NG Narangodapaluwa Primary School, Batuwatta (Started 2014)' },
          { title: 'Secondary School', detail: 'WP/GM Galahitiyawa Central College, Ganemulla (Started 2019)' },
          { title: 'Current', detail: 'Grade 12 – Mathematics Stream (Combined Mathematics, Physics, Chemistry)' },
          { title: 'Dream University', detail: 'University of Moratuwa – Engineering' },
          { title: 'Dream Career', detail: 'Ethical Hacker / Cybersecurity' },
        ],
      },
      personalLife: {
        heading: 'My Personal Life',
        items: [
          {
            title: 'Hobbies',
            text: 'Singing songs (can sing a little bit, not fluent), collecting photos for memories, listening to songs, and hacking (self-study).',
          },
          {
            title: 'Relaxation',
            text: 'I relax by looking at the photos I have collected. They are my memories. My wealth.',
          },
          {
            title: 'Music',
            text: 'I can sing a little bit — not professionally. I participated in singing competitions twice in primary school. I sang “This Train” and “My Bonnie Lies Over the Ocean.”',
          },
          {
            title: 'Photos',
            text: 'Every photo clicked in the last 7 years — of my family, my friends, my life — I have saved them. My photos are my wealth.',
          },
        ],
      },
      socialLinksHeading: 'My Social Links',
      socialLinks: [
        { platform: 'YouTube', handle: '@piyumdakshina369' },
        { platform: 'Instagram', handle: '@piyum_dakshina' },
        { platform: 'Facebook', handle: 'piyum.dakshina' },
        { platform: 'LinkedIn', handle: 'piyumdakshina' },
        { platform: 'TikTok', handle: '@piyum_dakshina_' },
        { platform: 'Snapchat', handle: '(Will be added)' },
        { platform: 'GitHub', handle: 'piyumdakshina' },
        { platform: 'Email', handle: 'piyumdakshina573@gmail.com' },
      ],
      legacy: {
        heading: 'My Legacy',
        quote: '“I want to be like Piyum.”',
        content: richText([
          [
            textNode(
              'One day, I want a child to say: “I want to be like Piyum.” Not because I was famous. Because I built things that protected dignity. Things that broke barriers. Things that gave people hope.',
            ),
          ],
          [
            textNode('That is my legacy. That is why I build. That is who I am.', true),
          ],
        ]),
      },
      finalWords: {
        heading: 'My Final Words',
        content: richText([
          [
            textNode('I am Piyum Dakshina. I build to protect dignity. I code to break barriers. My wealth is trust, not money. My success is humanity, not fame.'),
          ],
          [
            textNode('Don’t earn money. Earn humanity, dignity, respect, trust.', true),
          ],
          [
            textNode('That is my message. That is my life.', true),
          ],
        ]),
      },
    },
  })
  console.log('✓ About page seeded')

  await payload.updateGlobal({
    slug: 'philosophy-page',
    data: {
      badge: 'Philosophy',
      heading: 'My',
      headingAccent: 'Philosophy',
      headingRest: '',
      subtitle: 'Five core thoughts that define my approach to life, technology, and building.',
      principles: [
        {
          icon: '📖',
          title: 'Information is Wealth',
          description:
            'Data reveals truth. It reveals the real face of people. It creates value. It exposes lies. It builds bridges. It breaks barriers. That is why I build what I build — to unlock that wealth, to share it, to protect it.',
        },
        {
          icon: '🛡️',
          title: 'Protect Human Dignity',
          description:
            'I don’t want fame. I want dignity. I want to be a person that people respect — not because I’m famous, but because I am human. Technology should protect, not exploit. It should serve people, not control them. That is what I build for.',
        },
        {
          icon: '🤝',
          title: 'My Wealth is Trust, Not Money',
          description:
            'Don’t earn money. Earn humanity, dignity, respect, trust. That is my message. That is my life. That is what I believe.',
        },
        {
          icon: '⚖️',
          title: 'Technology Should Serve, Not Control',
          description:
            'Every product I ship starts with the same question: does this protect people or exploit them? Surveillance that protects, AI that assists, software that is free by design — that is the only axis I build on. The moment a tool starts controlling the people it claims to help, it has failed.',
        },
        {
          icon: '🚪',
          title: 'Knowledge Without Barriers',
          description:
            'Everything I learn gets published here — code, lessons, failures, architecture, source. I never had a mentor or a paid course, but I had the open internet. My site is my way of paying that debt forward: a vault that everyone can open, not a trophy I lock away.',
        },
      ],
      missionHeading: 'My Definition of Success',
      missionText: richText([
        [
          textNode(
            'Success is not money. Success is not fame. Success is being a man that has humanity — and that all the people in the world dignity or respect for me. That is success. Nothing else.',
          ),
        ],
        [
          textNode(
            'My biggest dream is to be a respected person in the world. I want to be the man that one day a child says: “I want to be like Piyum.” Not because I was a celebrity. Because I built things that protected dignity. Things that broke barriers. Things that gave people hope.',
          ),
        ],
        [
          textNode(
            'I build because it is my breath. I don’t know why. But I love it. It’s not a choice. It’s who I am.',
          ),
        ],
      ]),
      missionBadge: '“Don’t earn money. Earn humanity, dignity, respect, trust.”',
    },
  })
  console.log('✓ Philosophy page seeded')

  await payload.updateGlobal({
    slug: 'athletics-page',
    data: {
      badge: 'Athletics',
      heading: 'The',
      headingAccent: "Runner's",
      headingRest: 'Code',
      subtitle:
        'Before my A/L studies took over, I was a national-level sprinter. Athletics taught me discipline — and that discipline is now channeled into every line of code I write.',
      personalBests: [
        { time: '11.7s', event: '100m Personal Best' },
        { time: '23.9s', event: '200m Personal Best' },
        { time: 'School #1', event: '100m · 200m · Hurdles' },
        { time: '4×100m Relay', event: 'School Team — 1st Leg' },
        { time: 'Semi-finals', event: 'John Tarbet Nationals' },
      ],
      whyRunHeading: 'Why I Run',
      whyRun: richText([
        [
          textNode(
            'Running is not just a sport for me — it is a metaphor for everything I do. Every step forward, no matter how small, is progress. The track does not care about your excuses. It only rewards consistency, effort, and the will to push through the pain.',
          ),
        ],
        [
          textNode(
            'I competed at Zonal, Divisional, and Provincial levels, and reached the semi-finals at the John Tarbet National Championships. I also ran long-distance: 400m, 800m, 3000m, and 5000m.',
          ),
        ],
        [
          textNode(
            'Athletics taught me discipline. That discipline is now channeled into every line of code I write. I no longer run competitively — my focus is now on building technology and preparing for my A/Ls. But the athlete’s mindset stays with me forever.',
          ),
        ],
        [
          textNode('“The only race that matters is the one against who you were yesterday.”', true),
        ],
      ]),
      achievementsHeading: 'Key Achievements',
      achievements: [
        { text: 'National-level sprinter — School #1 in 100m, 200m, and hurdles' },
        { text: 'Personal Best: 100m in 11.7 seconds' },
        { text: 'Competed at Zonal, Divisional, and Provincial levels' },
        { text: 'John Tarbet National Championships – Semi-finals' },
        { text: 'Also ran long-distance: 400m, 800m, 3000m, and 5000m' },
        {
          text: 'Applied the same mental toughness from athletics to hackathons and project builds',
        },
      ],
    },
  })
  console.log('✓ Athletics page seeded')

  const demoPosts = [
    {
      title: 'Why AegisVue Is Free: A Developer’s Promise',
      slug: 'why-aegisvue-is-free',
      excerpt:
        'Most safety tools are paid because safety is treated as a premium feature. I built AegisVue the other way around — here is why, and how.',
      cover: { seed: 'cover-post-aegisvue', file: 'aegisvue-post-cover.jpg' },
      daysAgo: 3,
      content: richText([
        [
          textNode('The problem: '),
          textNode('families, schools, and workplaces have no single free tool to protect people online', true),
          textNode('. Parental control, school management, and workplace monitoring are scattered across paid products — so most people simply go unprotected.'),
        ],
        [
          textNode('The approach: '),
          textNode('I made one decision before writing a line of code — AegisVue stays free, permanently.', true),
          textNode(' Protection should not be a premium feature. That single constraint shaped the whole architecture: each domain (parental, school, workplace) is a modular service sharing one secure core, so running one system costs a fraction of running three.'),
        ],
        [
          textNode('The result: '),
          textNode('a platform that unifies parental control, school management, workplace monitoring, and digital forensics — and doubles as the foundation for my own J.A.R.V.I.S.-style AI assistant.', true),
          textNode(' In private production now; public release coming soon.'),
        ],
        [
          textNode('What I learned: constraints are not limitations — they are design decisions. “Free” forced me to build something efficient enough to be sustainable. I will write a full architecture breakdown next.'),
        ],
      ]),
    },
    {
      title: '48 Hours at HackX Junior: A Hackathon Retrospective',
      slug: '48-hours-at-hackx-junior',
      excerpt:
        'Solo programmer on a five-person team, 1st Runner-Up, and the 30% number that made it real — what actually happened inside those 48 hours.',
      cover: { seed: 'cover-post-hackx', file: 'hackx-post-cover.jpg' },
      daysAgo: 10,
      content: richText([
        [
          textNode('The problem: ', true),
          textNode('career stereotypes in Sri Lankan schools push students away from jobs they could actually succeed in — and students have no safe space to talk about it.'),
        ],
        [
          textNode('The approach: ', true),
          textNode('as the only programmer on a five-person team, I split the product into three parts, one per problem stage: anonymous story sharing to surface the issue, gamified daily challenges to unlearn stereotypes, and a job explorer with 100+ real careers — salaries, qualifications, and myth vs. reality — to replace hearsay with data.'),
        ],
        [
          textNode('The result: ', true),
          textNode('a measured 30% reduction in career stereotypes among users, 50+ anonymous stories collected, and 1st Runner-Up at HackX Junior, University of Kelaniya.'),
        ],
        [
          textNode('What I learned: ', true),
          textNode('a team is only as fast as its pipeline. Design decisions had to arrive in the same hour I needed them, so I learned to build around ambiguity — stub the UI, ship the backend, wire it together at 3 a.m. It is exactly how I still work today.'),
        ],
      ]),
    },
    {
      title: 'Self-Taught, No Mentor, No Courses: My Actual Process',
      slug: 'self-taught-no-mentor-my-actual-process',
      excerpt:
        'No paid courses, no certificate, no mentor. This is the exact process I used to go from a Windows XP laptop to shipping production software.',
      cover: { seed: 'cover-post-selftaught', file: 'selftaught-post-cover.jpg' },
      daysAgo: 18,
      content: richText([
        [
          textNode('The problem: ', true),
          textNode('most learning advice assumes you have money, a teacher, or a syllabus. I had none of the three — and I refused to ask my parents for money.'),
        ],
        [
          textNode('The process I actually use: ', true),
        ],
        [
          textNode('• Pick one project that is slightly too hard for me — never a tutorial.'),
        ],
        [
          textNode('• Break it into the smallest pieces I can ship in one sitting.'),
        ],
        [
          textNode('• When I get stuck, read the source code of libraries I use — the answers are always in there.'),
        ],
        [
          textNode('• Document every failure in public. Teaching is the deepest form of learning.'),
        ],
        [
          textNode('The result: ', true),
          textNode('AegisVue, LEAP, and the VR Chemistry Lab — all built with this loop. The secret is not talent; it is refusing to stop when no one is watching.'),
        ],
      ]),
    },
    {
      title: 'Information is Wealth: The Philosophy Behind Everything',
      slug: 'information-is-wealth-the-philosophy-behind-everything',
      excerpt:
        'Access to information is not equal. That inequality is the reason I build — and the reason everything I learn gets published here.',
      cover: { seed: 'cover-post-info', file: 'info-post-cover.jpg' },
      daysAgo: 27,
      content: richText([
        [
          textNode(
            'Growing up in Sri Lanka, I learned early that access to information is not equal. Some people get world-class resources; others get curiosity and a slow connection.',
          ),
        ],
        [
          textNode(
            'I chose to treat information as wealth: learn relentlessly, build openly, share freely. Every article, project, and line of code is a deposit into a shared treasury.',
          ),
        ],
        [
          textNode(
            'That is why this site exists. Not as a portfolio — as a vault that everyone can open.',
          ),
        ],
      ]),
    },
    {
      title: 'Open Source Is My Resume: Why I Ship in Public',
      slug: 'open-source-is-my-resume-why-i-ship-in-public',
      excerpt:
        'No certificate proves what I can build. Public, working, readable code does. This is why every project on this site is open.',
      cover: { seed: 'cover-post-oss', file: 'oss-post-cover.jpg' },
      daysAgo: 35,
      content: richText([
        [
          textNode(
            'A resume is a list of claims. Open source is a list of proofs. When a project has public source, public commits, and a live deployment, nobody has to take my word for it — they can read the code.',
          ),
        ],
        [
          textNode('That is why AegisVue, LEAP, and every tool on this site is open. ', true),
          textNode(
            'It is not because open source is trendy. It is because sharing the code is the only honest way for a person with no certificates to say: here is exactly what I can do, judge for yourself.',
          ),
        ],
        [
          textNode('Ships in public also means failing in public. Every broken build, every rewritten module, every lesson — it is all on the record here. My real resume is the history of what broke and how I fixed it.'),
        ],
      ]),
    },
    {
      title: 'What I Built in 2026 — and What Comes Next',
      slug: 'what-i-built-in-2026-and-what-comes-next',
      excerpt:
        'AegisVue in private production, LEAP’s 30% result, a VR chemistry lab, and the roadmap that 2026 set up.',
      cover: { seed: 'cover-post-2026', file: '2026-post-cover.jpg' },
      daysAgo: 2,
      content: richText([
        [
          textNode('2026 was the year the projects stopped being exercises and started being products: '),
          textNode('AegisVue moved into private production', true),
          textNode(', LEAP proved itself with a measured 30% reduction in career stereotypes, and the VR Chemistry Lab went from idea to a judge-approved demo.'),
        ],
        [
          textNode('What comes next: '),
          textNode('the public release of AegisVue, the first prototype of the J.A.R.V.I.S.-style assistant that rides on its core, and finishing my A/Ls without letting the discipline slip.', true),
          textNode(' The track taught me the only race that matters is the one against who you were yesterday. Same rule applies here.'),
        ],
        [
          textNode('There will be more posts as each of these ships — including the full AegisVue architecture breakdown that keeps getting asked for. Consider this the trailer.'),
        ],
      ]),
    },
    {
      title: 'AegisVue Architecture: A Deep Dive Into the Modular Security Core',
      slug: 'aegisvue-architecture-deep-dive',
      excerpt:
        'Draft. How the free-by-design constraint shaped an architecture where parental, school, and workplace domains share one secure core.',
      cover: { seed: 'cover-post-aegis-arc', file: 'aegis-arc-post-cover.jpg' },
      status: 'draft',
      daysAgo: 0,
      content: richText([
        [
          textNode('This post is still being written. Skeleton: '),
          textNode('domain separation, the shared identity and policy core, forensics as a read-only layer, and why “free” forced the architecture to be efficient enough to survive.', true),
        ],
        [
          textNode('Publishing soon. If you want to be notified, the contact form is the fastest way to reach me.'),
        ],
      ]),
    },
  ]

  for (const post of demoPosts) {
    const { docs: existing } = await payload.find({
      collection: 'posts',
      where: { slug: { equals: post.slug } },
      limit: 1,
    })

    const coverImage = post.cover
      ? await ensureImage(payload, post.cover.file, `Cover — ${post.title}`, post.cover.seed, {
          width: 1200,
          height: 630,
        })
      : null

    const publishedAt = new Date(Date.now() - (post.daysAgo || 0) * 86400000).toISOString()
    const data: {
      title: string
      slug: string
      excerpt: string
      content: RichTextValue
      status: 'draft' | 'published'
      publishedAt: string
      coverImage?: number
    } = {
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      status: (post.status as 'draft' | 'published') || 'published',
      publishedAt,
    }
    if (coverImage) data.coverImage = coverImage

    if (existing.length > 0) {
      await payload.update({
        collection: 'posts',
        id: existing[0].id,
        data,
      })
      console.log(`↻ Post "${post.slug}" updated`)
    } else {
      await payload.create({
        collection: 'posts',
        data,
      })
      console.log(`✓ Post "${post.slug}" created`)
    }
  }

  type GalleryCategory = 'athletics' | 'builds' | 'personal' | 'projects'
  const samplePhotos: { seed: string; width: number; height: number; category: GalleryCategory; caption: string }[] = [
    { seed: 'track-day', width: 800, height: 1000, category: 'athletics', caption: 'Morning at the track' },
    { seed: 'hackx-2025', width: 900, height: 600, category: 'projects', caption: 'HackX Junior 2025' },
    { seed: 'desk-setup', width: 1000, height: 700, category: 'builds', caption: 'Night shift, building AegisVue' },
    { seed: 'victory-lap', width: 700, height: 900, category: 'athletics', caption: 'After the finish line' },
    { seed: 'code-closeup', width: 1200, height: 800, category: 'builds', caption: 'The lines that make it work' },
    { seed: 'kelaniya-campus', width: 800, height: 530, category: 'personal', caption: 'University of Kelaniya' },
    { seed: 'podium', width: 900, height: 900, category: 'projects', caption: '1st Runner-Up' },
    { seed: 'sri-lanka-sunset', width: 800, height: 1000, category: 'personal', caption: 'Home, Sri Lanka' },
  ]

  const galleryItems: { image: number; caption: string; category: GalleryCategory }[] = []
  for (const photo of samplePhotos) {
    const { docs: existing } = await payload.find({
      collection: 'media',
      where: { alt: { equals: photo.caption } },
      limit: 1,
    })
    if (existing.length > 0) {
      console.log(`• Photo "${photo.caption}" already exists, reusing`)
      galleryItems.push({
        image: existing[0].id,
        caption: photo.caption,
        category: photo.category,
      })
      continue
    }

    const res = await fetch(
      `https://picsum.photos/seed/${photo.seed}/${photo.width}/${photo.height}`,
    )
    if (!res.ok) {
      console.warn(`✗ Could not download photo "${photo.caption}", skipping`)
      continue
    }
    const buffer = Buffer.from(await res.arrayBuffer())
    const created = await payload.create({
      collection: 'media',
      data: { alt: photo.caption },
      file: {
        name: `${photo.seed}.jpg`,
        mimetype: 'image/jpeg',
        data: buffer,
        size: buffer.length,
      },
    })
    galleryItems.push({
      image: created.id,
      caption: photo.caption,
      category: photo.category,
    })
    console.log(`✓ Photo "${photo.caption}" uploaded`)
  }

  await payload.updateGlobal({
    slug: 'gallery-page',
    data: {
      badge: 'Gallery',
      heading: 'Moments',
      headingAccent: 'in Motion',
      headingRest: '',
      subtitle:
        'Photos from the track, the desk, and the road between — moments that made me who I am.',
      items: galleryItems,
    },
  })
  console.log('✓ Gallery page seeded')

  await payload.updateGlobal({
    slug: 'testimonials',
    data: {
      badge: 'Testimonials',
      heading: 'What',
      headingAccent: 'People Say',
      headingRest: '',
      subtitle:
        'The people I have worked with, competed alongside, and built for — in their own words.',
      testimonials: [
        {
          quote:
            'Piyum took over the entire engineering of our HackX project and shipped it in days. The rest of us handled content; he handled everything that could crash — nothing crashed.',
          name: 'LEAP Team Member',
          role: 'HackX Junior 2025',
        },
        {
          quote:
            'A platform built by an 18-year-old that handles school management, parental control, and workplace monitoring — for free. That kind of ambition is rare in any room, at any age.',
          name: 'Early AegisVue Reviewer',
          role: 'Education Sector, Sri Lanka',
        },
        {
          quote:
            'He does not wait for permission or a syllabus. He finds a problem, learns what he needs, and builds the solution. That is the definition of a self-taught engineer.',
          name: 'Mentor',
          role: 'Self-Taught Community',
        },
        {
          quote:
            'The VR Chemistry Lab demo convinced a room of judges in minutes. The hardware was built by Piyum himself — gloves, wiring, and all.',
          name: 'HackX Junior Judge',
          role: 'University of Kelaniya',
        },
        {
          quote:
            'Most students ask what the marks are worth. Piyum asks what the problem costs people. That question changed how I think about technology education.',
          name: 'Teacher',
          role: 'Sri Lanka',
        },
        {
          quote:
            'He runs like he codes: consistent, disciplined, and always trying to beat yesterday. The discipline shows in the work he ships.',
          name: 'Training Partner',
          role: 'Athletics, Sri Lanka',
        },
      ],
    },
  })
  console.log('✓ Testimonials seeded')

  console.log('── Seeding complete ──')
}

async function main() {
  const { default: config } = await import('../payload.config.ts')
  const payload = await getPayload({ config })
  try {
    await seed(payload)
  } finally {
    process.exit(0)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
