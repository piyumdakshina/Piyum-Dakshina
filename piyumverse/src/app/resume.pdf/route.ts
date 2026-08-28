import { getPayloadClient } from '@/lib/payload'

export const revalidate = 3600

const A4_W = 595.28
const A4_H = 841.89
const M = 50
const CONTENT_W = A4_W - M * 2

const CYAN: [number, number, number] = [0.1, 0.63, 0.74]
const GREY: [number, number, number] = [0.35, 0.35, 0.35]

interface TextLine {
  text: string
  size: number
  bold?: boolean
  color?: [number, number, number]
  gapAfter?: number
}

function sanitize(text: string): string {
  return text
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/\u2026/g, '...')
    .replace(/\u2022/g, '-')
    .replace(/\u2192/g, '->')
    .replace(/[^\x20-\x7e]/g, '')
}

function escapePdf(text: string): string {
  return text.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)')
}

function wrapLines(text: string, size: number): string[] {
  const maxChars = Math.max(10, Math.floor(CONTENT_W / (size * 0.5)))
  const words = sanitize(text)
    .split(/\s+/)
    .filter(Boolean)
  const lines: string[] = []
  let cur = ''
  for (const word of words) {
    let w = word
    while (w.length > maxChars) {
      if (cur) lines.push(cur)
      cur = ''
      lines.push(w.slice(0, maxChars))
      w = w.slice(maxChars)
    }
    const candidate = cur ? `${cur} ${w}` : w
    if (candidate.length <= maxChars) {
      cur = candidate
    } else {
      if (cur) lines.push(cur)
      cur = w
    }
  }
  if (cur) lines.push(cur)
  return lines.length ? lines : ['']
}

function lineHeight(size: number) {
  return size * 1.4
}

interface PageGroup {
  lines: TextLine[]
  height: number
}

function layout(input: TextLine[]): PageGroup[] {
  const pages: PageGroup[] = []
  let page: TextLine[] = []
  let used = 0
  const pageHeight = A4_H - M * 2
  const flush = () => {
    if (page.length) {
      pages.push({ lines: page, height: used })
      page = []
      used = 0
    }
  }
  for (const item of input) {
    const h = lineHeight(item.size) + (item.gapAfter ?? 0)
    if (used + h > pageHeight && page.length) flush()
    page.push(item)
    used += h
  }
  flush()
  return pages
}

function buildStream(group: PageGroup): string {
  const ops: string[] = []
  ops.push('BT')
  let y = A4_H - M - group.lines[0].size
  ops.push(`1 0 0 1 ${M} ${y} Tm`)
  for (const item of group.lines) {
    if (item.color) ops.push(`${item.color[0]} ${item.color[1]} ${item.color[2]} rg`)
    else ops.push('0 0 0 rg')
    ops.push(`/${item.bold ? 'F2' : 'F1'} ${item.size} Tf`)
    ops.push(`(${escapePdf(item.text)}) Tj`)
    ops.push(`0 ${-(lineHeight(item.size) + (item.gapAfter ?? 0))} Td`)
  }
  ops.push('ET')
  return ops.join('\n')
}

export async function GET() {
  const payload = await getPayloadClient()
  const [aboutPage, athleticsPage, settings] = await Promise.all([
    payload.findGlobal({ slug: 'about-page' }),
    payload.findGlobal({ slug: 'athletics-page' }),
    payload.findGlobal({ slug: 'site-settings' }),
  ])

  const education = aboutPage.education?.items || []
  const projects = aboutPage.projects?.highlights || []
  const achievements = athleticsPage.achievements || []
  const socialLinks = (settings.socialLinks || []).slice(0, 5)

  const skillBars = [
    { label: 'Frontend — React · Next.js · Tailwind', percent: 95 },
    { label: 'Language — TypeScript', percent: 90 },
    { label: 'Backend — Node.js · Payload CMS', percent: 88 },
    { label: 'Data — SQL · MongoDB', percent: 80 },
    { label: 'AI/ML — LLMs · Python', percent: 75 },
    { label: 'Hardware — Arduino', percent: 70 },
  ]

  const lines: TextLine[] = []
  const push = (text: string, size: number, opts: Partial<TextLine> = {}) => {
    for (const wrapped of wrapLines(text, size)) {
      lines.push({ text: wrapped, size, ...opts })
    }
  }

  push('PIYUM DAKSHINA', 24, { bold: true, color: CYAN, gapAfter: 4 })
  push('Self-Taught Developer & Entrepreneur  |  Sri Lanka', 12.5, { color: GREY, gapAfter: 4 })
  push('piyumdakshina573@gmail.com  |  piyumdakshina.com', 10, { color: GREY, gapAfter: 14 })

  push('PROFILE', 13, { bold: true, color: CYAN, gapAfter: 6 })
  push(
    'An 18-year-old self-taught developer from Sri Lanka building free technology that protects human dignity - digital safety platforms, education tools, and AI that serves people instead of exploiting them. Founder of AegisVue; 1st Runner-Up at HackX Junior.',
    10.5,
    { gapAfter: 14 }
  )

  push('SKILLS', 13, { bold: true, color: CYAN, gapAfter: 6 })
  for (const skill of skillBars) {
    push(`${skill.label} (${skill.percent}%)`, 10.5)
  }
  push('TypeScript · React · Next.js · Tailwind CSS · Node.js · Payload CMS · SQL & MongoDB · Python · Arduino', 10, {
    color: GREY,
    gapAfter: 14,
  })

  push('SELECTED PROJECTS', 13, { bold: true, color: CYAN, gapAfter: 6 })
  for (const project of projects) {
    push(project.title || 'Project', 11.5, { bold: true })
    if (project.tagline) push(project.tagline, 10, { color: GREY })
    if (project.achievement) push(`Award: ${project.achievement}`, 10, { color: CYAN })
    if (project.description) push(project.description, 10.5)
    push('', 4, { gapAfter: 4 })
  }

  push('EDUCATION', 13, { bold: true, color: CYAN, gapAfter: 6 })
  for (const item of education) {
    push(item.title || '', 11.5, { bold: true })
    if (item.detail) push(item.detail, 10.5, { gapAfter: 8 })
  }
  push('', 6, {})

  push('ACHIEVEMENTS', 13, { bold: true, color: CYAN, gapAfter: 6 })
  for (const achievement of achievements) {
    if (achievement.text) push(`- ${achievement.text}`, 10.5)
  }
  push('', 6, {})

  push('CONNECT', 13, { bold: true, color: CYAN, gapAfter: 6 })
  for (const link of socialLinks) {
    const url = (link.url || '').replace('https://', '').replace('http://', '')
    push(`${link.platform || 'Social'} - ${url}`, 10.5)
  }

  const pages = layout(lines)
  const N = pages.length
  const F1 = 3 + N
  const F2 = 3 + N + 1
  const streamStart = 3 + N + 2

  const objects: (Buffer | undefined)[] = []
  objects[1] = Buffer.from('<< /Type /Catalog /Pages 2 0 R >>')
  const kids = pages.map((_, i) => `${3 + i} 0 R`).join(' ')
  objects[2] = Buffer.from(`<< /Type /Pages /Kids [${kids}] /Count ${N} >>`)

  for (let i = 0; i < N; i++) {
    objects[3 + i] = Buffer.from(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${A4_W} ${A4_H}] /Resources << /Font << /F1 ${F1} 0 R /F2 ${F2} 0 R >> >> /Contents ${streamStart + i} 0 R >>`
    )
  }

  objects[F1] = Buffer.from('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>')
  objects[F2] = Buffer.from('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>')

  for (let i = 0; i < N; i++) {
    const stream = buildStream(pages[i])
    objects[streamStart + i] = Buffer.from(`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`)
  }

  let pdf = Buffer.from('%PDF-1.4\n')
  const offsets: number[] = [0]
  for (let i = 1; i < objects.length; i++) {
    offsets[i] = pdf.length
    pdf = Buffer.concat([pdf, Buffer.from(`${i} 0 obj\n`), objects[i] as Buffer, Buffer.from('\nendobj\n')])
  }

  const xrefStart = pdf.length
  let xref = `xref\n0 ${objects.length}\n0000000000 65535 f \n`
  for (let i = 1; i < objects.length; i++) {
    xref += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`
  }
  pdf = Buffer.concat([pdf, Buffer.from(`${xref}trailer\n<< /Size ${objects.length} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF\n`)])

  return new Response(pdf, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename="Piyum-Dakshina-Resume.pdf"',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
