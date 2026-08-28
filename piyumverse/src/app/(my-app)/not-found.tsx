import Link from 'next/link'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-lg mx-auto text-center">
        <div className="text-8xl font-bold gradient-text mb-4">404</div>
        <p className="text-xl text-text-secondary mb-8">
          Oops. Even I can&apos;t find that.
        </p>
        <p className="text-text-muted mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Want to see my projects instead?
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/"
            className="px-6 py-3 rounded-lg bg-teal text-obsidian font-semibold hover:bg-teal-dark transition-colors"
          >
            Go Home
          </Link>
          <Link
            href="/projects"
            className="px-6 py-3 rounded-lg border border-white/10 text-text-primary hover:border-teal/30 hover:text-teal transition-all"
          >
            View Projects
          </Link>
          <Link
            href="/contact"
            className="px-6 py-3 rounded-lg border border-white/10 text-text-primary hover:border-violet/30 hover:text-violet transition-all"
          >
            Contact Me
          </Link>
        </div>
      </div>
    </div>
  )
}
