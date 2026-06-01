import type { CollectionConfig } from 'payload'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    defaultColumns: ['title', 'type', '_status', 'updatedAt'],
    useAsTitle: 'title',
  },
  access: {
    read: ({ req }) => {
      if (req.user) {
        return true
      }

      return {
        _status: {
          equals: 'published',
        },
      }
    },
  },
  versions: {
    drafts: true,
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
    },
    {
      name: 'type',
      type: 'select',
      defaultValue: 'blog',
      options: [
        {
          label: 'Blog',
          value: 'blog',
        },
        {
          label: 'News',
          value: 'news',
        },
        {
          label: 'Whitepaper',
          value: 'whitepaper',
        },
      ],
      required: true,
    },
    {
      name: 'excerpt',
      type: 'textarea',
      required: true,
    },
    {
      name: 'body',
      type: 'textarea',
      required: true,
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
  ],
}
