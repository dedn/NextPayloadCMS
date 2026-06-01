# Payload Draft Post PoC

This local proof of concept checks the proposed marketing-site editorial flow:

- Payload runs inside a Next.js app.
- Postgres stores CMS records.
- Local uploads store media files for the first demo.
- A script can upload an image, create a `posts` draft, and return admin/preview links without manual Payload Admin clicks.

AWS/S3 is intentionally not required for the first check. If this local flow works, the next step is to enable `@payloadcms/storage-s3` for the same `media` collection and repeat the same script against an S3 bucket.

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
- `src/lib/createDraftPost.ts` is the reusable helper Codex can call from scripts or future automation.
- `scripts/create-draft-post.ts` is the CLI wrapper for the helper.
- `src/app/(frontend)/posts/[slug]/page.tsx` reads posts through the Payload Local API and supports `?draft=true` preview reads.

## AWS/S3 Follow-Up

The next production-like check should keep the same script and content model, then change only media storage:

1. Install `@payloadcms/storage-s3`.
2. Add the `s3Storage` plugin in `src/payload.config.ts` for the `media` collection.
3. Read S3 settings from environment variables:
   - `S3_BUCKET`
   - `S3_REGION`
   - `S3_ACCESS_KEY_ID`
   - `S3_SECRET_ACCESS_KEY`
4. Keep the plugin disabled when `S3_BUCKET` is missing so local uploads continue to work without AWS secrets.
5. Re-run `pnpm create-draft-post` and confirm the media file is stored in S3 while the post remains `_status: draft`.
