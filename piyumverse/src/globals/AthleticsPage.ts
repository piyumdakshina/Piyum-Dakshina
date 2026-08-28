import type { GlobalConfig } from 'payload'

export const AthleticsPage: GlobalConfig = {
  slug: 'athletics-page',
  label: 'Athletics Page',
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
      defaultValue: 'Athletics',
    },
    {
      name: 'heading',
      type: 'text',
      defaultValue: "The",
    },
    {
      name: 'headingAccent',
      type: 'text',
      defaultValue: "Runner's",
      admin: {
        description: 'Gradient-highlighted part of the heading.',
      },
    },
    {
      name: 'headingRest',
      type: 'text',
      defaultValue: 'Code',
    },
    {
      name: 'subtitle',
      type: 'textarea',
      defaultValue:
        'Running taught me discipline, resilience, and the power of incremental progress. The same principles that drive me on the track drive me in life and code.',
    },
    {
      name: 'personalBests',
      type: 'array',
      label: 'Personal Bests',
      fields: [
        {
          name: 'time',
          type: 'text',
          required: true,
        },
        {
          name: 'event',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'whyRunHeading',
      type: 'text',
      defaultValue: 'Why I Run',
    },
    {
      name: 'whyRun',
      type: 'richText',
    },
    {
      name: 'achievementsHeading',
      type: 'text',
      defaultValue: 'Key Achievements',
    },
    {
      name: 'achievements',
      type: 'array',
      label: 'Key Achievements',
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
}
