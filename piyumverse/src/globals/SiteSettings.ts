import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  access: {
    read: () => true,
  },
  admin: {
    group: 'Pages',
    description: 'Global site-wide settings: metadata, navigation, hero, footer, social links.',
  },
  fields: [
    {
      name: 'siteName',
      type: 'text',
      required: true,
      defaultValue: 'The Piyumverse',
    },
    {
      type: 'group',
      name: 'metadata',
      label: 'SEO & Metadata',
      fields: [
        {
          name: 'title',
          type: 'text',
          defaultValue: 'The Piyumverse — Piyum Dakshina',
        },
        {
          name: 'description',
          type: 'textarea',
          defaultValue:
            'The Piyumverse — permanent digital identity of Piyum Dakshina. Self-taught developer, entrepreneur & dreamer from Sri Lanka.',
        },
        {
          name: 'siteUrl',
          type: 'text',
          defaultValue: 'https://piyumdakshina.com',
        },
      ],
    },
    {
      name: 'navItems',
      type: 'array',
      label: 'Navigation Links',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'href',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      type: 'group',
      name: 'hero',
      label: 'Hero Section',
      fields: [
        {
          name: 'badge',
          type: 'text',
          defaultValue: 'Piyum Dakshina',
        },
        {
          name: 'title',
          type: 'text',
          defaultValue: 'Welcome to the',
        },
        {
          name: 'titleAccent',
          type: 'text',
          defaultValue: 'Piyumverse',
          admin: {
            description: 'Gradient-highlighted part of the title.',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          defaultValue:
            'The permanent digital identity of Piyum Dakshina. Self-taught developer, entrepreneur & dreamer from Sri Lanka.',
        },
        {
          type: 'group',
          name: 'primaryButton',
          fields: [
            { name: 'label', type: 'text', defaultValue: 'Explore Projects' },
            { name: 'href', type: 'text', defaultValue: '/projects' },
          ],
        },
        {
          type: 'group',
          name: 'secondaryButton',
          fields: [
            { name: 'label', type: 'text', defaultValue: 'About Me' },
            { name: 'href', type: 'text', defaultValue: '/about' },
          ],
        },
        {
          type: 'group',
          name: 'tertiaryButton',
          fields: [
            { name: 'label', type: 'text', defaultValue: 'Get in Touch' },
            { name: 'href', type: 'text', defaultValue: '/contact' },
          ],
        },
        {
          name: 'statusLine1',
          type: 'text',
          defaultValue: 'Available for collaboration',
        },
        {
          name: 'statusLine2',
          type: 'text',
          defaultValue: 'Building AegisVue',
        },
      ],
    },
    {
      type: 'group',
      name: 'overview',
      label: 'Home — Overview Cards',
      fields: [
        {
          name: 'cards',
          type: 'array',
          maxRows: 3,
          fields: [
            { name: 'icon', type: 'text', defaultValue: '🙋' },
            { name: 'title', type: 'text', required: true },
            { name: 'description', type: 'textarea', required: true },
            { name: 'linkLabel', type: 'text', defaultValue: 'Read More' },
            { name: 'linkHref', type: 'text', defaultValue: '/about' },
          ],
        },
      ],
    },
    {
      type: 'group',
      name: 'skills',
      label: 'Home — Skills',
      fields: [
        {
          name: 'pills',
          type: 'array',
          maxRows: 16,
          label: 'Quick Skill Pills',
          fields: [{ name: 'label', type: 'text', required: true }],
        },
        {
          name: 'bars',
          type: 'array',
          maxRows: 12,
          label: 'Skill Bars',
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'percent', type: 'number', min: 0, max: 100, required: true },
          ],
        },
      ],
    },
    {
      name: 'stats',
      type: 'array',
      label: 'Home — Stat Highlights',
      maxRows: 8,
      fields: [
        { name: 'value', type: 'text', required: true },
        { name: 'label', type: 'text', required: true },
      ],
    },
    {
      name: 'githubUsername',
      type: 'text',
      label: 'GitHub Username',
      defaultValue: 'piyumdakshina',
    },
    {
      type: 'group',
      name: 'contact',
      label: 'Contact Page',
      fields: [
        {
          name: 'badge',
          type: 'text',
          defaultValue: 'Contact',
        },
        {
          name: 'heading',
          type: 'text',
          defaultValue: "Let's",
        },
        {
          name: 'headingAccent',
          type: 'text',
          defaultValue: 'Connect',
        },
        {
          name: 'description',
          type: 'textarea',
          defaultValue:
            "Have a project idea, collaboration opportunity, or just want to say hello? Reach out through any of the channels below.",
        },
      ],
    },
    {
      type: 'group',
      name: 'footer',
      fields: [
        {
          name: 'builtBy',
          type: 'text',
          defaultValue: 'Built with Dignity by',
        },
        {
          name: 'name',
          type: 'text',
          defaultValue: 'Piyum Dakshina',
        },
        {
          name: 'rightsText',
          type: 'text',
          defaultValue: 'The Piyumverse. All rights reserved.',
        },
      ],
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
          name: 'url',
          type: 'text',
          required: true,
        },
        {
          name: 'icon',
          type: 'text',
          admin: {
            description: 'Emoji shown next to the platform name.',
          },
        },
      ],
    },
  ],
}
