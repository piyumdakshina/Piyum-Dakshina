import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const { getPayload } = await import('payload')
const { default: config } = await import('../payload.config.ts')

const payload = await getPayload({ config })
const g = await payload.findGlobal({ slug: 'gallery-page' })
const { docs } = await payload.find({ collection: 'media', limit: 50 })
console.log('gallery items:', (g.items || []).length)
console.log('media docs:', docs.length, docs.map((d) => d.alt).join(' | '))
process.exit(0)
