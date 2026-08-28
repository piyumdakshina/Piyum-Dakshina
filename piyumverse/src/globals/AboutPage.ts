import type { GlobalConfig } from 'payload'

export const AboutPage: GlobalConfig = {
  slug: 'about-page',
  label: 'About Page',
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
      defaultValue: 'About',
    },
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Who is',
    },
    {
      name: 'headingAccent',
      type: 'text',
      defaultValue: 'Piyum Dakshina',
      admin: {
        description: 'Gradient-highlighted part of the heading.',
      },
    },
    {
      name: 'headingRest',
      type: 'text',
      defaultValue: '?',
      admin: {
        description: 'Text after the accent, e.g. "?"',
      },
    },
    {
      name: 'intro',
      type: 'richText',
      admin: {
        description: 'Intro paragraph, rendered larger.',
      },
    },
    {
      name: 'body',
      type: 'richText',
      admin: {
        description: 'Main body paragraphs.',
      },
    },
    {
      name: 'coreValues',
      type: 'array',
      label: 'Core Values',
      fields: [
        {
          name: 'icon',
          type: 'text',
        },
        {
          name: 'title',
          type: 'text',
        },
        {
          name: 'description',
          type: 'text',
        },
      ],
    },
    {
      name: 'bodyAfter',
      type: 'richText',
      admin: {
        description: 'Optional paragraphs after the core values card.',
      },
    },
    {
      type: 'group',
      name: 'story',
      label: 'My Story',
      fields: [
        {
          name: 'heading',
          type: 'text',
          defaultValue: 'My Story',
        },
        {
          name: 'sections',
          type: 'array',
          label: 'Story Sections',
          fields: [
            {
              name: 'icon',
              type: 'text',
              admin: {
                description: 'Emoji shown next to the section title.',
              },
            },
            {
              name: 'title',
              type: 'text',
              required: true,
            },
            {
              name: 'content',
              type: 'richText',
              required: true,
            },
          ],
        },
      ],
    },
    {
      type: 'group',
      name: 'proudestMoment',
      label: 'My Proudest Moment',
      fields: [
        {
          name: 'heading',
          type: 'text',
          defaultValue: 'My Proudest Moment',
        },
        {
          name: 'title',
          type: 'text',
          defaultValue: '1st Runner-Up at HackX Junior',
        },
        {
          name: 'content',
          type: 'richText',
        },
      ],
    },
    {
      type: 'group',
      name: 'philosophy',
      label: 'My Philosophy',
      fields: [
        {
          name: 'heading',
          type: 'text',
          defaultValue: 'My Philosophy',
        },
        {
          name: 'points',
          type: 'array',
          label: 'Philosophy Points',
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
              name: 'text',
              type: 'textarea',
              required: true,
            },
          ],
        },
        {
          name: 'message',
          type: 'text',
          defaultValue: '“Don’t earn money. Earn humanity, dignity, respect, trust.”',
        },
      ],
    },
    {
      type: 'group',
      name: 'dream',
      label: 'My Dream',
      fields: [
        {
          name: 'heading',
          type: 'text',
          defaultValue: 'My Dream',
        },
        {
          name: 'content',
          type: 'richText',
        },
      ],
    },
    {
      type: 'group',
      name: 'projects',
      label: 'My Projects',
      fields: [
        {
          name: 'heading',
          type: 'text',
          defaultValue: 'My Projects',
        },
        {
          name: 'highlights',
          type: 'array',
          label: 'Project Highlights',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
            },
            {
              name: 'tagline',
              type: 'text',
              admin: {
                description: 'Small label, e.g. "Solo Product"',
              },
            },
            {
              name: 'achievement',
              type: 'text',
              admin: {
                description: 'Optional achievement badge, e.g. "1st Runner-Up @ HackX Junior".',
              },
            },
            {
              name: 'description',
              type: 'textarea',
              required: true,
            },
          ],
        },
      ],
    },
    {
      type: 'group',
      name: 'athletics',
      label: 'My Athletics',
      fields: [
        {
          name: 'heading',
          type: 'text',
          defaultValue: 'My Athletics',
        },
        {
          name: 'content',
          type: 'richText',
        },
      ],
    },
    {
      type: 'group',
      name: 'education',
      label: 'My Education',
      fields: [
        {
          name: 'heading',
          type: 'text',
          defaultValue: 'My Education',
        },
        {
          name: 'items',
          type: 'array',
          label: 'Education Items',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
            },
            {
              name: 'detail',
              type: 'text',
            },
          ],
        },
      ],
    },
    {
      type: 'group',
      name: 'personalLife',
      label: 'My Personal Life',
      fields: [
        {
          name: 'heading',
          type: 'text',
          defaultValue: 'My Personal Life',
        },
        {
          name: 'items',
          type: 'array',
          label: 'Personal Life Items',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
            },
            {
              name: 'text',
              type: 'textarea',
            },
          ],
        },
      ],
    },
    {
      name: 'socialLinksHeading',
      type: 'text',
      defaultValue: 'My Social Links',
    },
    {
      name: 'socialLinks',
      type: 'array',
      label: 'Social Links',
      fields: [
        {
          name: 'platform',
          type: 'text',
          required: true,
        },
        {
          name: 'handle',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      type: 'group',
      name: 'legacy',
      label: 'My Legacy',
      fields: [
        {
          name: 'heading',
          type: 'text',
          defaultValue: 'My Legacy',
        },
        {
          name: 'quote',
          type: 'text',
          defaultValue: '“I want to be like Piyum.”',
        },
        {
          name: 'content',
          type: 'richText',
        },
      ],
    },
    {
      type: 'group',
      name: 'finalWords',
      label: 'My Final Words',
      fields: [
        {
          name: 'heading',
          type: 'text',
          defaultValue: 'My Final Words',
        },
        {
          name: 'content',
          type: 'richText',
        },
      ],
    },
  ],
}
