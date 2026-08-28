import type { GlobalConfig } from 'payload'

export const GalleryPage: GlobalConfig = {
  slug: 'gallery-page',
  label: 'Gallery Page',
  access: {
    read: () => true,
  },
  admin: {
    group: 'Pages',
  },
  fields: [
    {
      name: 'badge',
      type: 'text',
      defaultValue: 'Gallery',
    },
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Moments',
    },
    {
      name: 'headingAccent',
      type: 'text',
      defaultValue: 'in Motion',
      admin: {
        description: 'Gradient-highlighted part of the heading.',
      },
    },
    {
      name: 'headingRest',
      type: 'text',
      defaultValue: '',
    },
    {
      name: 'subtitle',
      type: 'textarea',
      defaultValue:
        'Photos from the track, the desk, and the road between — moments that made me who I am.',
    },
    {
      name: 'items',
      type: 'array',
      label: 'Gallery Items',
      admin: {
        description: 'Add photos here — upload images via the Media collection.',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'caption',
          type: 'text',
          admin: {
            description: 'Short caption shown under the photo.',
          },
        },
        {
          name: 'category',
          type: 'select',
          options: [
            { label: 'Athletics', value: 'athletics' },
            { label: 'Builds', value: 'builds' },
            { label: 'Personal', value: 'personal' },
            { label: 'Projects', value: 'projects' },
          ],
          defaultValue: 'personal',
          required: true,
        },
      ],
    },
  ],
}
