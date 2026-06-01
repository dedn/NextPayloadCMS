import { describe, expect, it } from 'vitest'

import { shouldUseS3Storage } from '@/lib/s3Storage'

describe('S3 storage config', () => {
  it('enables S3 only when all required S3 environment variables are present', () => {
    expect(
      shouldUseS3Storage({
        S3_ACCESS_KEY_ID: 'access-key-id',
        S3_BUCKET: 'bucket-name',
        S3_REGION: 'us-east-2',
        S3_SECRET_ACCESS_KEY: 'secret-access-key',
      }),
    ).toBe(true)

    expect(
      shouldUseS3Storage({
        S3_ACCESS_KEY_ID: 'access-key-id',
        S3_BUCKET: 'bucket-name',
        S3_REGION: 'us-east-2',
      }),
    ).toBe(false)
  })
})
