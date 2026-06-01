type S3StorageEnv = {
  S3_ACCESS_KEY_ID?: string
  S3_BUCKET?: string
  S3_REGION?: string
  S3_SECRET_ACCESS_KEY?: string
}

export const shouldUseS3Storage = (env: S3StorageEnv) =>
  Boolean(env.S3_BUCKET && env.S3_REGION && env.S3_ACCESS_KEY_ID && env.S3_SECRET_ACCESS_KEY)
