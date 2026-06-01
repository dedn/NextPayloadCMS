# Payload Draft Post PoC

This local proof of concept checks the proposed marketing-site editorial flow:

- Payload runs inside a Next.js app.
- Postgres stores CMS records.
- Local uploads are used by default when S3 env vars are missing.
- Optional S3 uploads store media files in an AWS bucket for a production-like media check.
- A script can upload an image, create a `posts` draft, and return admin/preview links without manual Payload Admin clicks.

AWS/S3 is optional. When `S3_BUCKET`, `S3_REGION`, `S3_ACCESS_KEY_ID`, and `S3_SECRET_ACCESS_KEY` are present, Payload uses `@payloadcms/storage-s3` for the same `media` collection. Without those values, the demo continues to work with local uploads.

## Local Commands

Start Postgres:

```bash
pnpm db:up
```

Run the app:

```bash
pnpm dev
```

Create a draft post with the bundled fixture image:

```bash
pnpm create-draft-post \
  --title "Codex creates a Payload draft" \
  --type news \
  --excerpt "A small proof that AI-assisted editorial drafts can be created without manual admin clicks." \
  --body "This draft was created through the Payload Local API." \
  --image scripts/fixtures/demo-featured-image.svg \
  --alt "Abstract product interface preview"
```

Run tests:

```bash
pnpm test:int
```

## How it works

- `src/collections/Media.ts` is the upload-enabled collection.
- `src/collections/Posts.ts` enables drafts and models blog/news/whitepaper entries in one collection.
- `src/lib/s3Storage.ts` keeps S3 disabled unless all required S3 environment variables are present.
- `src/lib/createDraftPost.ts` is the reusable helper Codex can call from scripts or future automation.
- `scripts/create-draft-post.ts` is the CLI wrapper for the helper.
- `src/app/(frontend)/posts/[slug]/page.tsx` reads posts through the Payload Local API and supports `?draft=true` preview reads.

## AWS/S3 Check

To repeat the production-like media check:

1. Create an S3 bucket.
2. Create an IAM user with permission to upload/list objects for that bucket.
3. Add these values to `.env`:
   - `S3_BUCKET`
   - `S3_REGION`
   - `S3_ACCESS_KEY_ID`
   - `S3_SECRET_ACCESS_KEY`
4. Run `pnpm create-draft-post` with an image.
5. Confirm the media file is stored in S3 while the post remains `_status: draft`.

## AWS/RDS PostgreSQL Check

To repeat the production-like database check:

1. Create an Amazon RDS PostgreSQL instance.
2. Keep it small for the PoC, for example `db.t4g.micro`.
3. Make it publicly accessible only for the local test.
4. Restrict the database security group to PostgreSQL `5432` from your current IP.
5. Create the database if it was not created during RDS setup:

```sql
CREATE DATABASE payload_draft_post_poc;
```

6. Download the RDS CA bundle:

```bash
curl -o global-bundle.pem https://truststore.pki.rds.amazonaws.com/global/global-bundle.pem
```

7. Point `DATABASE_URL` at RDS:

```bash
DATABASE_URL=postgres://payload:REPLACE_WITH_PASSWORD@REPLACE_WITH_RDS_ENDPOINT:5432/payload_draft_post_poc?sslmode=verify-full&sslrootcert=./global-bundle.pem
```

8. Restart `pnpm dev`, then re-run `pnpm create-draft-post`.
9. Confirm `posts` and `media` metadata are stored in RDS while the media file is stored in S3.
