import { notFound } from 'next/navigation'
import Image from 'next/image'
import { getPayload } from 'payload'

import config from '@/payload.config'

type PageProps = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ draft?: string }>
}

export default async function PostPreviewPage({ params, searchParams }: PageProps) {
  const [{ slug }, query] = await Promise.all([params, searchParams])
  const isDraftPreview = query.draft === 'true'
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const posts = await payload.find({
    collection: 'posts',
    depth: 1,
    draft: isDraftPreview,
    limit: 1,
    overrideAccess: isDraftPreview,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  const post = posts.docs[0]

  if (!post) {
    notFound()
  }

  const image = typeof post.featuredImage === 'object' ? post.featuredImage : null

  return (
    <article style={{ margin: '0 auto', maxWidth: 760, padding: '64px 24px' }}>
      <p style={{ color: '#0f766e', fontSize: 14, fontWeight: 700, textTransform: 'uppercase' }}>
        {post.type} / {post._status}
      </p>
      <h1 style={{ fontSize: 48, lineHeight: 1.05, margin: '12px 0 20px' }}>{post.title}</h1>
      {image?.url && (
        <Image
          alt={image.alt || ''}
          height={630}
          src={image.url}
          style={{ borderRadius: 12, display: 'block', height: 'auto', margin: '28px 0', width: '100%' }}
          width={1200}
        />
      )}
      <p style={{ color: '#425466', fontSize: 20, lineHeight: 1.5 }}>{post.excerpt}</p>
      <div style={{ color: '#172033', fontSize: 18, lineHeight: 1.7, marginTop: 32, whiteSpace: 'pre-wrap' }}>
        {post.body}
      </div>
    </article>
  )
}
