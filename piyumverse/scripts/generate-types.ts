import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

import { getPayload, generateImportMap } from 'payload'
import { generateTypes } from 'payload/node'

async function main() {
  const { default: config } = await import('../payload.config.ts')
  const payload = await getPayload({ config })
  await generateTypes(payload.config)
  await generateImportMap(payload.config)
  console.log('✓ Types + import map generated')
  process.exit(0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
