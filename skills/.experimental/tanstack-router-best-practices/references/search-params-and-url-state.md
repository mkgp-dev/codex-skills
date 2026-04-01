# Search Params And URL State

Use this reference when URL state drives filtering, pagination, tabs, or cross-route state that users should be able to refresh, share, and revisit.

## Core rules

- Treat search params as application state, not as a raw string bag.
- Always validate search params before consuming them. `validateSearch` is the main boundary.
- Prefer sensible fallbacks for malformed URL input unless the user explicitly wants validation failures to surface.
- Keep URL state for shareable, navigable, refresh-safe state. Keep purely local UI toggles out of search params.

## Validation guidance

- Prefer schema-backed validation when the project already uses a validator.
- With Zod v4, prefer passing the schema directly to `validateSearch`.
- When using validator transforms or fallback behavior, make sure the Router sees the correct input and output types.
- Use custom validation functions only when schema libraries are unnecessary or too rigid for the case.

## Search-driven loading

- Use `loaderDeps` to declare exactly which search fields a loader uses.
- Extract only the fields the loader needs. Do not return the entire `search` object unless every field affects the loader result.
- When consuming search in components, prefer selectors such as `Route.useSearch({ select })` for narrow subscriptions.

## Serialization and structure

- Lean on the Router's JSON-first search parsing instead of treating everything as `URLSearchParams` strings.
- Use custom search-param serialization only when you have a concrete interoperability or URL-format requirement.
- Remember that first-level params stay URLSearchParams-compatible even when nested values are serialized as JSON.

## Avoid

- Reading unvalidated search params directly as trusted app data
- Putting every incidental UI detail into the URL
- Making `loaderDeps` equal the full validated search object when only one field drives the loader
- Rebuilding search strings manually with string concatenation

## Example

```tsx
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

const usersSearch = z.object({
  page: z.number().int().positive().default(1),
  filter: z.string().default(''),
})

export const Route = createFileRoute('/users')({
  validateSearch: usersSearch,
  loaderDeps: ({ search: { page, filter } }) => ({ page, filter }),
  loader: ({ deps }) => fetchUsers(deps),
})
```

## Review checklist

- Does the route validate all consumed search params?
- Are defaults and fallback behavior intentional?
- Does `loaderDeps` include only loader-relevant search fields?
- Is URL state being used only for state worth sharing, restoring, or bookmarking?
