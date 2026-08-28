import path from 'path'
import { fileURLToPath } from 'url'

import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'
import sharp from 'sharp'

import { ContactMessages } from './src/collections/ContactMessages.ts'
import { Media } from './src/collections/Media.ts'
import { Posts } from './src/collections/Posts.ts'
import { Projects } from './src/collections/Projects.ts'
import { Users } from './src/collections/Users.ts'
import { AboutPage } from './src/globals/AboutPage.ts'
import { AthleticsPage } from './src/globals/AthleticsPage.ts'
import { GalleryPage } from './src/globals/GalleryPage.ts'
import { PhilosophyPage } from './src/globals/PhilosophyPage.ts'
import { SiteSettings } from './src/globals/SiteSettings.ts'
import { Testimonials } from './src/globals/Testimonials.ts'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: '— The Piyumverse Admin',
      icons: [{ rel: 'icon', url: '/favicon.ico' }],
    },
  },
  collections: [Users, Media, Projects, Posts, ContactMessages],
  globals: [SiteSettings, AboutPage, PhilosophyPage, AthleticsPage, GalleryPage, Testimonials],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URL || 'file:./piyumverse.db',
    },
  }),
  sharp,
})
