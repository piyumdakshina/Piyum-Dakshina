import type { CollectionConfig } from 'payload'

export const Projects: CollectionConfig = {
  slug: 'projects',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['title', 'status', 'projectType', 'featured', 'order'],
    description: 'Projects displayed on the /projects page.',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'URL slug, e.g. /projects/aegisvue',
      },
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      admin: {
        description: 'One or two sentence summary shown on the project card.',
      },
    },
    {
      name: 'longDescription',
      type: 'textarea',
      admin: {
        description: 'Full story shown on the project detail page. Separate paragraphs with a blank line.',
      },
    },
    {
      name: 'techStack',
      type: 'array',
      fields: [
        {
          name: 'technology',
          type: 'text',
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Development', value: 'development' },
        { label: 'Production', value: 'production' },
        { label: 'Completed', value: 'completed' },
      ],
      defaultValue: 'development',
      required: true,
    },
    {
      name: 'projectType',
      type: 'select',
      options: [
        { label: 'Solo', value: 'solo' },
        { label: 'Team', value: 'team' },
        { label: 'Competition', value: 'competition' },
      ],
      defaultValue: 'solo',
      required: true,
    },
    {
      name: 'achievement',
      type: 'text',
      admin: {
        description: 'Optional achievement badge, e.g. "1st Runner-Up @ HackX Junior"',
      },
    },
    {
      name: 'githubUrl',
      type: 'text',
    },
    {
      name: 'liveUrl',
      type: 'text',
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Optional cover image for the project card.',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Feature this project at the top of the projects page.',
      },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Lower numbers appear first.',
      },
    },
  ],
}
