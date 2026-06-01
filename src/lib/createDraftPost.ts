import type { Payload } from 'payload'

type PayloadLike = Pick<Payload, 'create'>

type DraftPostInput = {
  title: string
  type: 'blog' | 'news' | 'whitepaper'
  excerpt: string
  body: string
  imagePath: string
  imageAlt: string
  slug?: string
}

type DraftPostResult = {
  postId: number | string
  mediaId: number | string
  slug: string
  adminUrl: string
  previewUrl: string
  status: 'draft'
}

const trimSlashes = (value: string) => value.replace(/\/+$/, '')

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

export const createDraftPost = async ({
  payload,
  input,
  baseUrl,
}: {
  payload: PayloadLike
  input: DraftPostInput
  baseUrl: string
}): Promise<DraftPostResult> => {
  const slug = input.slug ? slugify(input.slug) : slugify(input.title)

  if (!slug) {
    throw new Error('A non-empty title or slug is required to create a draft post.')
  }

  const media = await payload.create({
    collection: 'media',
    data: {
      alt: input.imageAlt,
    },
    filePath: input.imagePath,
  })

  const mediaId = media.id

  const post = await payload.create({
    collection: 'posts',
    draft: true,
    data: {
      title: input.title,
      slug,
      type: input.type,
      excerpt: input.excerpt,
      body: input.body,
      featuredImage: mediaId,
      _status: 'draft',
    },
  })

  const normalizedBaseUrl = trimSlashes(baseUrl)

  return {
    postId: post.id,
    mediaId,
    slug,
    adminUrl: `${normalizedBaseUrl}/admin/collections/posts/${post.id}`,
    previewUrl: `${normalizedBaseUrl}/posts/${slug}?draft=true`,
    status: 'draft',
  }
}
