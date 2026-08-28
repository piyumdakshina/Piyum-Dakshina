import type { GlobalConfig } from 'payload'

export const Testimonials: GlobalConfig = {
  slug: 'testimonials',
  label: 'Testimonials',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'badge',
      type: 'text',
      defaultValue: 'Testimonials',
    },
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'What',
    },
    {
      name: 'headingAccent',
      type: 'text',
      defaultValue: 'People Say',
    },
    {
      name: 'headingRest',
      type: 'text',
    },
    {
      name: 'subtitle',
      type: 'textarea',
      defaultValue:
        'The people I have worked with, competed alongside, and built for — in their own words.',
    },
    {
      name: 'testimonials',
      type: 'array',
      label: 'Testimonials',
      minRows: 0,
      fields: [
        {
          name: 'quote',
          type: 'textarea',
          required: true,
          admin: {
            description: 'The testimonial quote.',
          },
        },
        {
          name: 'name',
          type: 'text',
          required: true,
          admin: {
            description: 'Who said it — name or role title.',
          },
        },
        {
          name: 'role',
          type: 'text',
          admin: {
            description: 'e.g. HackX Junior Judge, LEAP teammate.',
          },
        },
      ],
    },
  ],
}
