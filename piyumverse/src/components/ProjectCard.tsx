import Link from 'next/link'

interface ProjectCardProps {
  title: string
  slug: string
  description?: string
  techStack?: { technology?: string }[]
  status?: string
  projectType?: string
  achievement?: string
  liveUrl?: string | null
  githubUrl?: string | null
  coverImage?: string | null
}

const statusColors: Record<string, string> = {
  development: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  production: 'bg-teal/10 text-teal border-teal/20',
  completed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
}

const typeColors: Record<string, string> = {
  solo: 'bg-violet/10 text-violet border-violet/20',
  team: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  competition: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
}

export function ProjectCard({
  title,
  slug,
  description,
  techStack,
  status,
  projectType,
  achievement,
  liveUrl,
  githubUrl,
  coverImage,
}: ProjectCardProps) {
  const bannerIndex =
    title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 4

  return (
    <Link
      href={`/projects/${slug}`}
      className="group relative block rounded-xl border border-grey bg-obsidian p-3 md:p-4 h-full transition-all duration-300 hover:border-cyan/40 hover:glow"
    >
      <div className={`banner-${bannerIndex} relative h-40 md:h-44 rounded-lg overflow-hidden`}>
        <div className="absolute inset-0 bg-grid opacity-60" />
        <img
          src={coverImage || `/projects/${slug}/cover`}
          alt={`${title} cover`}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <span className="absolute inset-0 flex items-center justify-center font-display text-7xl text-white/15 transition-all duration-500 group-hover:scale-125 group-hover:text-white/25">
          {title.charAt(0).toUpperCase()}
        </span>
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
        <div className="absolute inset-0 ring-2 ring-inset ring-white/0 group-hover:ring-cyan/30 rounded-lg transition-all duration-300" />

        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          {status && (
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-medium border backdrop-blur-sm ${statusColors[status] || ''}`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          )}
          {projectType && (
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-medium border backdrop-blur-sm ${typeColors[projectType] || ''}`}
            >
              {projectType === 'solo' ? 'Solo' : projectType === 'team' ? 'Team' : 'Competition'}
            </span>
          )}
        </div>

        <div className="absolute inset-0 flex items-end opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <div className="flex gap-3 ml-4 mb-4">
            <span className="bg-white w-10 h-10 flex items-center justify-center rounded-full text-obsidian transition-transform group-hover:scale-110">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </span>
            {(liveUrl || githubUrl) && (
              <span className="bg-white/10 hover:bg-white/20 text-white border border-white/30 w-10 h-10 flex items-center justify-center rounded-full transition-all">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="p-3 flex flex-col">
        <h3 className="text-xl font-semibold text-text-primary mb-2 group-hover:text-cyan transition-colors">
          {title}
        </h3>

        {description && (
          <p className="text-text-secondary text-sm mb-4 line-clamp-3 leading-relaxed">{description}</p>
        )}

        {achievement && (
          <p className="text-amber-400 text-xs mb-3 flex items-center gap-1">
            <span>🏆</span> {achievement}
          </p>
        )}

        {techStack && techStack.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-auto">
            {techStack.map((tech, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded text-xs bg-white/5 text-text-secondary border border-white/5"
              >
                {tech.technology}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}
