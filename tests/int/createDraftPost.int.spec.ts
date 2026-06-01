import { describe, expect, it } from 'vitest'

import { createDraftPost } from '@/lib/createDraftPost'

describe('createDraftPost', () => {
  it('uploads the featured image and creates an unpublished post draft', async () => {
    const calls: Array<{ collection: string; data: Record<string, unknown>; draft?: boolean; filePath?: string }> = []

    const payload = {
      create: async (input: {
        collection: string
        data: Record<string, unknown>
        draft?: boolean
        filePath?: string
      }) => {
        calls.push(input)

        if (input.collection === 'media') {
          return { id: 101, url: '/media/demo.svg', ...input.data }
        }

        return { id: 202, ...input.data }
      },
    } as Parameters<typeof createDraftPost>[0]['payload']

    const result = await createDraftPost({
      payload,
      input: {
        title: 'Codex creates a Payload draft',
        type: 'news',
        excerpt: 'A small proof that AI-assisted editorial drafts can be created without manual admin clicks.',
        body: 'This draft was created through the Payload Local API.',
        imagePath: '/tmp/demo.svg',
        imageAlt: 'Abstract product interface preview',
      },
      baseUrl: 'http://localhost:3000',
    })

    expect(calls).toEqual([
      {
        collection: 'media',
        data: {
          alt: 'Abstract product interface preview',
        },
        filePath: '/tmp/demo.svg',
      },
      {
        collection: 'posts',
        draft: true,
        data: {
          title: 'Codex creates a Payload draft',
          slug: 'codex-creates-a-payload-draft',
          type: 'news',
          excerpt: 'A small proof that AI-assisted editorial drafts can be created without manual admin clicks.',
          body: 'This draft was created through the Payload Local API.',
          featuredImage: 101,
          _status: 'draft',
        },
      },
    ])

    expect(result).toEqual({
      postId: 202,
      mediaId: 101,
      slug: 'codex-creates-a-payload-draft',
      adminUrl: 'http://localhost:3000/admin/collections/posts/202',
      previewUrl: 'http://localhost:3000/posts/codex-creates-a-payload-draft?draft=true',
      status: 'draft',
    })
  })
})
