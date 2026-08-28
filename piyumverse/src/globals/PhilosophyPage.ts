import type { GlobalConfig } from 'payload'

export const PhilosophyPage: GlobalConfig = {
  slug: 'philosophy-page',
  label: 'Philosophy Page',
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
      defaultValue: 'Philosophy',
    },
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'The',
    },
    {
      name: 'headingAccent',
      type: 'text',
      defaultValue: 'Principles',
      admin: {
        description: 'Gradient-highlighted part of the heading.',
      },
    },
    {
      name: 'headingRest',
      type: 'text',
      defaultValue: 'I Live By',
    },
    {
      name: 'subtitle',
      type: 'textarea',
      defaultValue: 'Three core thoughts that define my approach to life, technology, and building.',
    },
    {
      name: 'principles',
      type: 'array',
      label: 'Principles',
      fields: [
        {
          name: 'icon',
          type: 'text',
        },
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
        },
      ],
    },
    {
      name: 'missionHeading',
      type: 'text',
      defaultValue: 'My Mission',
    },
    {
      name: 'missionText',
      type: 'richText',
    },
    {
      name: 'missionBadge',
      type: 'text',
      defaultValue: '“I want to be like Piyum.”',
    },
  ],
}
