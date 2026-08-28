import { spawn } from 'node:child_process'
import { existsSync, statSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const isWin = process.platform === 'win32'
const npm = isWin ? 'npm.cmd' : 'npm'
const setupOnly = process.argv.includes('--setup-only')

const run = (cmd, args) =>
  new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { stdio: 'inherit', cwd: root, shell: true })
    p.on('exit', (code) =>
      code === 0 ? resolve() : reject(new Error(`${cmd} ${args.join(' ')} failed (code ${code})`))
    )
  })

const newestMtime = (dir) => {
  if (!existsSync(dir)) return 0
  let newest = 0
  const walk = (d) => {
    for (const entry of readdirSync(d, { withFileTypes: true })) {
      const full = join(d, entry.name)
      if (entry.isDirectory()) walk(full)
      else if (entry.isFile()) newest = Math.max(newest, statSync(full).mtimeMs)
    }
  }
  walk(dir)
  return newest
}

const buildStale = () => {
  const buildId = join(root, '.next', 'BUILD_ID')
  if (!existsSync(buildId)) return true
  const builtAt = statSync(buildId).mtimeMs
  const configFiles = [
    'package.json',
    'next.config.mjs',
    'next.config.js',
    'tsconfig.json',
    'postcss.config.mjs',
    'postcss.config.js',
    'tailwind.config.ts',
    'tailwind.config.js',
  ].map((f) => {
    const p = join(root, f)
    return existsSync(p) ? statSync(p).mtimeMs : 0
  })
  const latestSource = Math.max(newestMtime(join(root, 'src')), newestMtime(join(root, 'scripts')), ...configFiles)
  return latestSource > builtAt
}

const portBusy = async () => {
  try {
    const res = await fetch('http://localhost:3000/', { signal: AbortSignal.timeout(3000) })
    return res.status >= 200
  } catch {
    return false
  }
}

const openBrowser = () => {
  const url = 'http://localhost:3000'
  try {
    if (isWin) {
      spawn('cmd', ['/c', 'start', '', url], { stdio: 'ignore', detached: true, cwd: root }).unref()
    } else {
      spawn('open', [url], { stdio: 'ignore', detached: true, cwd: root }).unref()
    }
  } catch {
    // opening a browser is best-effort
  }
}

const missingDeps = !existsSync(join(root, 'node_modules'))
const missingDb = !existsSync(join(root, 'piyumverse.db'))

if (missingDeps) {
  console.log('\n[setup] Installing dependencies (first run only)...')
  await run(npm, ['install'])
}

if (missingDb) {
  console.log('\n[setup] Seeding the database...')
  await run(npm, ['run', 'seed'])
}

if (setupOnly) {
  console.log('\n[setup] Done. Dependencies and database are ready.')
  process.exit(0)
}

if (!missingDeps && !missingDb) {
  console.log('\n[setup] Everything is ready.')
}

if (await portBusy()) {
  console.log('\n[start] The Piyumverse is already running at http://localhost:3000 — opening your browser.')
  openBrowser()
  process.exit(0)
}

if (buildStale()) {
  console.log('\n[build] Source changed since the last build — building the production bundle (first run can take a few minutes)...')
  await run(npm, ['run', 'build'])
} else {
  console.log('\n[build] Production build is up to date.')
}

console.log('\n[start] The Piyumverse -> http://localhost:3000  (admin: /admin)\n')

const server = spawn(npm, ['run', 'start'], { stdio: 'inherit', cwd: root, shell: true })
server.on('spawn', () => openBrowser())
for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => server.kill(signal))
}
