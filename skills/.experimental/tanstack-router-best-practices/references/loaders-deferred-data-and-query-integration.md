# Loaders, Deferred Data, And Query Integration

Use this reference when the user is deciding whether data belongs in Router loaders, the Router cache, or TanStack Query.

## Lifecycle boundaries

- Use `beforeLoad` for middleware-style work such as auth checks, dependency injection, and redirects.
- Use `loader` for route data acquisition and route-level preload orchestration.
- Remember that route loaders run in parallel after route matching and `beforeLoad`.

## Router cache vs Query cache

- Prefer Router loader returns for route-local data that is not heavily shared between routes.
- Prefer TanStack Query when data is shared across screens, needs richer invalidation, or benefits from mutation APIs and optimistic updates.
- Do not duplicate the same remote dataset in both Router loader data and Query cache without a clear reason.

## Query integration defaults

- Pass `queryClient` through typed router context.
- In loaders, prefer `queryClient.ensureQueryData(...)` for critical data needed before render.
- Prefer unawaited `prefetchQuery` or `fetchQuery` only when intentionally kicking off non-critical work that can stream later.
- If the component will read from Query hooks instead of `useLoaderData`, prefer an async loader that awaits the Query warm-up and returns `void` to avoid unnecessary loader-data type inference.

## Deferred data

- For Router-managed loader data, defer only slow, non-critical data by returning unresolved promises and resolve them with `Await` or React 19 `use()`.
- For Query-managed data, defer by starting non-critical queries in the loader and consuming them behind `Suspense` in components.
- Keep the fast path small. Await only the data required to render the next location meaningfully.

## Cache-key discipline

- Use `loaderDeps` for search-driven or derived loader inputs.
- Use `staleTime` to control freshness and `gcTime` to control cache retention.
- Do not describe `gcTime` as a freshness control.
- Use blocking stale reloads only when showing stale data during revalidation is unacceptable.

## Avoid

- Running auth redirects in loaders when they belong in `beforeLoad`
- Returning complex Query promises as loader data when the component already uses Query hooks
- Using the entire search object as loader deps by default
- Splitting loaders into lazy UI chunks unless the tradeoff is explicitly justified

## Example

```tsx
import { createFileRoute } from '@tanstack/react-router'
import { postsQueryOptions } from './postsQueryOptions'

export const Route = createFileRoute('/posts')({
  loader: async ({ context: { queryClient } }) => {
    await queryClient.ensureQueryData(postsQueryOptions)
  },
  component: PostsPage,
})
```

## Review checklist

- Is `beforeLoad` handling guards and redirects before child routes load?
- Is the chosen cache owner clear: Router cache or Query cache?
- Are `loaderDeps`, `staleTime`, and `gcTime` used intentionally?
- Is deferred loading reserved for non-critical data?
