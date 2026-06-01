import dotenv from 'dotenv'
import path from 'node:path'
import { parseArgs } from 'node:util'
import { fileURLToPath } from 'node:url'
import { getPayload } from 'payload'

import { createDraftPost } from '@/lib/createDraftPost'

const dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(dirname, '../.env') })

const { values } = parseArgs({
  options: {
    title: { type: 'string' },
    type: { type: 'string', default: 'news' },
    excerpt: { type: 'string' },
    body: { type: 'string' },
    image: { type: 'string' },
    alt: { type: 'string' },
    slug: { type: 'string' },
    baseUrl: { type: 'string', default: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000' },
  },
})

const required = ['title', 'excerpt', 'body', 'image', 'alt'] as const
const missing = required.filter((key) => !values[key])

if (missing.length > 0) {
  throw new Error(`Missing required option(s): ${missing.map((key) => `--${key}`).join(', ')}`)
}

if (!['blog', 'news', 'whitepaper'].includes(values.type || '')) {
  throw new Error('--type must be one of: blog, news, whitepaper')
}

const imagePath = path.resolve(String(values.image))
const { default: config } = await import('@payload-config')
const payloadConfig = await config
const payload = await getPayload({ config: payloadConfig })
let exitCode = 0

try {
  const result = await createDraftPost({
    payload,
    input: {
      title: String(values.title),
      type: values.type as 'blog' | 'news' | 'whitepaper',
      excerpt: String(values.excerpt),
      body: String(values.body),
      imagePath,
      imageAlt: String(values.alt),
      slug: values.slug ? String(values.slug) : undefined,
    },
    baseUrl: String(values.baseUrl),
  })

  console.log(JSON.stringify(result, null, 2))
} catch (error) {
  exitCode = 1
  console.error(error)
} finally {
  await payload.destroy()
  process.exit(exitCode)
}
