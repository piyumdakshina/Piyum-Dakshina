import Link from 'next/link'

interface FooterProps {
  builtBy: string
  name: string
  rightsText: string
}

export function Footer({ builtBy, name, rightsText }: FooterProps) {
  return (
    <footer className="relative mx-auto w-full max-w-[75rem] xl:max-w-[65rem] px-4 xl:px-0">
      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      <div className="py-6 max-w-[60rem] xl:max-w-[50rem] mx-auto xl:ml-auto text-center">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-text-muted text-sm">
            {builtBy}{' '}
            <span className="gradient-text font-semibold">{name}</span>
          </p>
          <p className="text-text-muted text-sm flex items-center gap-4">
            <Link href="/resume" className="hover:text-cyan transition-colors">
              Resume
            </Link>
            <span aria-hidden="true">·</span>
            <span>&copy; {new Date().getFullYear()} {rightsText}</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
