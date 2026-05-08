# TinaCMS Skill

Use this guide when implementing or modifying TinaCMS-backed features in this repository.

## Goal
- Keep Tina changes schema-driven, strongly typed, and compatible with the existing Next.js App Router plus Tina visual editing flow.

## Repository-Specific Rules
- Fetch content on the server with `client.queries.*()`.
- When a route supports visual editing, keep the server/client split:
  - `page.tsx` fetches data.
  - `client-page.tsx` calls `useTina({ query, data, variables })`.
- Always pass all three Tina values to the client component: `query`, `data`, and `variables`.
- For visual editing, prefer querying an individual document for the editable page state.
- Import generated Tina query types from `@/tina/__generated__/types`.
- Prefer content-driven changes in `content/` over hardcoding editable strings in JSX.
- Keep schema and rendering in sync. If you add or rename fields in `tina/`, update the UI that renders them.
- Use `data-tina-field={tinaField(object, 'fieldName')}` only on visible editable elements.
- Pass the source object to `tinaField()`, not a derived primitive.
- Prefer existing collections, templates, and field helpers before adding new abstractions.

## Tina Docs Notes
- `tina/config.{ts,tsx}` must be deterministic. Do not use unstable values like `Date.now()` or `Math.random()` in config.
- `tina-lock.json` should be checked into source control.
- Treat `tina/__generated__/` as generated output. Do not hand-edit generated files.
- The generated client covers most data fetching; add `tina/queries/` only when generated queries are insufficient.

## Folder Map
- `tina/config.tsx`: Tina config, media, build settings, collection registration.
- `tina/collection/*.ts`: collection definitions.
- `tina/fields/*.tsx`: reusable custom fields and shared schema fragments.
- `content/`: Markdown, MDX, and JSON content edited through Tina.

## Common Change Patterns

### 1. Add a new editable field to an existing document
- Update the relevant collection or template schema first.
- Regenerate Tina generated files if the change requires it.
- Update the UI component to render the field.
- Add `tinaField()` wiring to the rendered element if the field should be click-to-edit.
- Update existing content files in `content/` if the field is required or if useful starter data is needed.
- If adding a markdown body field, use a `rich-text` or `string` field and only one `isBody` field per markdown or MDX collection.

### 2. Add a Tina-backed route
- Prefer an async server `page.tsx`.
- Fetch with the matching `client.queries.<collection or query>()` call.
- For editable pages, pass `query`, `data`, and `variables` into a colocated `client-page.tsx`.
- In `client-page.tsx`, use `useTina()` and render from the returned `data`.
- Use `notFound()` or an existing fallback pattern when content is missing.

### 3. Work with global content
- Use the existing `global` collection in `tina/collection/global.ts` for shared site settings.
- Keep shared layout data flow aligned with `components/layout/layout.tsx`.
- Prefer extending the current `header`, `footer`, or `theme` objects instead of creating duplicate global documents.

## Schema Design Guidance
- Prefer explicit field names that match rendered usage.
- Use `object` plus `list: true` for repeatable structured content.
- Use `ui.defaultItem` for editor-friendly defaults.
- Use `ui.router` only when a collection needs route resolution behavior.
- Keep naming aligned with generated Tina types and existing collection names.
- Avoid weak typing unless a Tina API constraint makes it necessary.
- A collection must use either `fields` or `templates`, not both.
- Prefer singular collection `name` values because they map into the GraphQL schema.
- `isTitle` should be a required top-level string field, and only one field in a collection should use it.
- Use `match.include` and `match.exclude` when a collection should only target a subset of files in its path.
- Use `ui.allowedActions` for singleton or controlled collections where editors should not create or delete files.
- Use `ui.min` and `ui.max` selectively on list fields to enforce editor constraints.
- For rich-text defaults, Tina expects AST-shaped default data rather than plain markdown strings.

## Visual Editing Rules
- Use `useTina()` only in client components.
- Apply `tinaField()` to headings, text, images, links, block wrappers, and list items that correspond directly to editable fields.
- For list items or nested objects, use the nested item object as the first argument to `tinaField()`.
- Do not add `data-tina-field` to elements that are hidden, synthetic, or built from merged values.
- `data-tina-field` must be attached to actual HTML elements, not React components. If needed, pass a prop through to an underlying DOM node.
- For `TinaMarkdown` custom components, the props object already carries edit metadata in edit mode; `tinaField(props)` can target the embedded item.

## Querying Guidance
- Prefer generated client queries over manual GraphQL when an existing generated query already fits.
- Use single-document queries for individual pages and settings documents.
- Use connection queries for lists, pagination, sorting, or filtering.
- Keep route fetching simple and close to the route.
- Use `fetchOptions.next.revalidate` or route revalidation deliberately when App Router caching would otherwise hide Tina updates.
- Filter on `_sys.filename` in application code when needed; generated connection filters target document fields, not `_sys` metadata.
- Tina's built-in generated client queries operate on one root collection at a time; if a page truly needs multiple roots, consider custom queries.

## Content Modeling Guidance
- Prefer modeling editor-controlled sections as Tina schema, not ad hoc JSON parsing in components.
- Prefer MDX or rich text fields when content needs structured longform editing.
- Prefer JSON global documents for shared structured settings.
- If a field changes from optional to required, ensure existing content remains valid.

## When To Touch Content Files
- Update `content/` when a schema change introduces required data.
- Add example or starter values when a new field would otherwise render poorly.
- Do not move editable copy into code if it belongs in Tina-managed content.

## Verification
- Run `pnpm exec biome check --write <touched-files>` after TS or TSX edits.
- Run `pnpm exec tsc --noEmit` for type safety.
- Run `pnpm build` when changes affect routes, Tina config, schema, or production output.
- If build-time Tina cloud variables are unavailable locally, use the most relevant verification available and state the limitation clearly.

## Anti-Patterns
- Do not bypass Tina by hardcoding content that should be editable.
- Do not invent a second content-fetching pattern when the existing server/client split already fits.
- Do not forget to update renderers after schema edits.
- Do not attach `tinaField()` to derived strings instead of the source object.
- Do not create new global content structures when the existing `global` document can be extended.

---

## General TinaCMS Reference

### Field Types

| Type | Use Case | Notes |
|------|----------|-------|
| `string` | Short text, slugs | `ui: { component: 'textarea' }` for multi-line |
| `rich-text` | Long formatted content | `isBody: true` for main content area |
| `number` | Numeric values | — |
| `datetime` | Dates/times | — |
| `boolean` | Toggles | — |
| `image` | Image uploads | Points at Cloudinary or Tina media |
| `reference` | Link to another document | `collections: ['collectionName']` |
| `object` | Nested fields group | Can use `list: true` for repeatable |

### Common Errors & Solutions

#### ESbuild Compilation Errors
`ERROR: Schema Not Successfully Built` or `ERROR: Config Not Successfully Executed`
- **Cause:** Importing UI components, React hooks, `window`, or DOM APIs in `tina/config.ts`
- **Fix:** Only import type definitions and simple utilities from `tina/config.ts`; create separate `.schema.ts` files if needed

#### Module Resolution: "Could not resolve 'tinacms'"
```bash
rm -rf node_modules pnpm-lock.yaml && pnpm install
```

#### Field Naming Constraints
Field names: letters, numbers, underscores **only** — no hyphens or spaces.
```ts
// ❌  name: 'hero-image'
// ✅  name: 'heroImage'  or  name: 'hero_image'
```

#### Missing `_template` Key Error
`GetCollection failed: template name was not provided`
- Collections using `templates` array require `_template` in frontmatter
- Switch to `fields` (no `_template` needed) if you have a single schema

#### Build Script Ordering
`Cannot find module '../tina/__generated__/client'`
```json
{ "build": "tinacms build && next build" }
```
Tina must run first — it generates the TypeScript types the framework build needs.

#### Failed Loading TinaCMS Assets in Production
Never use `tinacms dev` in a build pipeline — it outputs `localhost:4001` asset paths.  
Always `tinacms build`. For subdirectory deploys set `build.basePath` in `tina/config.ts`.

#### Reference Field 503 Service Unavailable
Caused by 100s+ items in a referenced collection (no pagination support currently).
- Split into smaller collections by status/category
- Or replace `reference` with `string` + `ui: { component: 'select', options: [...] }`

#### Docker Binding Issues
TinaCMS binds to `127.0.0.1` by default. For Docker containers:
```bash
tinacms dev -c "next dev --hostname 0.0.0.0"
```

#### Path Mismatch
Files not appearing in admin? Verify `path` in collection config matches the actual directory exactly (`content/posts` not `posts` or `content/posts/`).

### Deployment Patterns

#### TinaCloud (Managed — easiest)
```bash
npx @tinacms/cli@latest init backend
```
Env vars: `NEXT_PUBLIC_TINA_CLIENT_ID`, `TINA_TOKEN`  
Sign up at https://app.tina.io — free tier available.

#### Self-Hosted: Cloudflare Workers
Install: `npm install @tinacms/datalayer tinacms-authjs`

```ts
// workers/src/index.ts
import { TinaNodeBackend, LocalBackendAuthProvider } from '@tinacms/datalayer'
import { AuthJsBackendAuthProvider, TinaAuthJSOptions } from 'tinacms-authjs'
import databaseClient from '../../tina/__generated__/databaseClient'

const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === 'true'
export default {
  async fetch(request: Request, env: Env) {
    const handler = TinaNodeBackend({
      authProvider: isLocal
        ? LocalBackendAuthProvider()
        : AuthJsBackendAuthProvider({
            authOptions: TinaAuthJSOptions({ databaseClient, secret: env.NEXTAUTH_SECRET }),
          }),
      databaseClient,
    })
    return handler(request)
  }
}
```

#### Self-Hosted: Vercel Functions
```ts
// api/tina/backend.ts
import { TinaNodeBackend, LocalBackendAuthProvider } from '@tinacms/datalayer'
import { AuthJsBackendAuthProvider, TinaAuthJSOptions } from 'tinacms-authjs'
import databaseClient from '../../../tina/__generated__/databaseClient'

const handler = TinaNodeBackend({
  authProvider: process.env.TINA_PUBLIC_IS_LOCAL === 'true'
    ? LocalBackendAuthProvider()
    : AuthJsBackendAuthProvider({
        authOptions: TinaAuthJSOptions({ databaseClient, secret: process.env.NEXTAUTH_SECRET }),
      }),
  databaseClient,
})
export default handler
```

Add `vercel.json` rewrite: `{ "source": "/api/tina/:path*", "destination": "/api/tina/backend" }`

### Authentication Options

| Method | Use For |
|--------|---------|
| `LocalBackendAuthProvider()` | Local dev only — no auth check |
| `AuthJsBackendAuthProvider` | Self-hosted with OAuth (GitHub, Discord, Google, etc.) |
| `TinaCloudBackendAuthProvider` | TinaCloud managed service |
| Custom `isAuthorized` fn | Existing auth systems |

Set `TINA_PUBLIC_IS_LOCAL=true` in local `.env` to bypass auth during development.

### GraphQL API

```ts
// Single document
const response = await client.queries.post({ relativePath: 'hello-world.md' })

// Collection list
const posts = await client.queries.postConnection()
const items = posts.data.postConnection.edges?.map(e => e!.node)
```
