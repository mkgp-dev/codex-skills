# Pagination, Infinite Queries, And Prefetching

Use this reference when the user is dealing with page transitions, load-more flows, or request waterfalls.

## Paginated queries

Include the page or cursor in the query key.

Prefer:

- `queryKey: ['projects', page]`
- `queryKey: ['projects', { cursor, filters }]`

For smooth page-to-page transitions, prefer `placeholderData` with the identity behavior:

- `placeholderData: keepPreviousData`
- or `placeholderData: (previousData) => previousData`

This keeps the previous successful data visible while the next page loads and exposes `isPlaceholderData`.

Do not teach the removed `keepPreviousData: true` option as current guidance.

Paginated-query example:

```tsx
import { keepPreviousData, useQuery } from '@tanstack/react-query'

const projectsQuery = useQuery({
  queryKey: ['projects', page],
  queryFn: () => fetchProjects(page),
  placeholderData: keepPreviousData,
})
```

## Infinite queries

Use `useInfiniteQuery` when the resource is one logical list that grows in both directions or with "load more."

Prefer:

- Explicit `initialPageParam`
- `getNextPageParam` and `getPreviousPageParam` when applicable
- Guards like `hasNextPage && !isFetching` before calling `fetchNextPage`
- `maxPages` when the list can grow very large or refetch costs matter

Remember:

- One infinite query cache entry contains all pages
- Refetches happen sequentially from the start
- Manual cache updates must preserve both `pages` and `pageParams`

Infinite-query example:

```tsx
const feedQuery = useInfiniteQuery({
  queryKey: ['activity-feed'],
  queryFn: ({ pageParam }) => fetchActivityPage(pageParam),
  initialPageParam: 0,
  getNextPageParam: (lastPage) => lastPage.nextCursor,
  maxPages: 5,
})

const loadMore = () => {
  if (feedQuery.hasNextPage && !feedQuery.isFetching) {
    feedQuery.fetchNextPage()
  }
}
```

## Prefetch deliberately

Prefetch when you know or strongly suspect the user will need the data soon.

Good triggers:

- Hover, focus, or intent-driven event handlers
- Route loaders or route transitions
- Parent components flattening a predictable request waterfall
- Server preload phases before hydration

Use:

- `prefetchQuery`
- `prefetchInfiniteQuery`
- `ensureQueryData` when returning cached data regardless of stale state is the goal

Intent-prefetch example:

```tsx
function UserRow({ userId }: { userId: string }) {
  const queryClient = useQueryClient()

  const prefetch = () =>
    queryClient.prefetchQuery({
      queryKey: ['user', userId],
      queryFn: () => fetchUser(userId),
      staleTime: 60_000,
    })

  return <button onMouseEnter={prefetch} onFocus={prefetch}>Open User</button>
}
```

## Keep prefetching aligned with real usage

Prefetching is not free. It uses bandwidth, memory, and cache lifetime.

Prefer:

- Intent-driven prefetch for likely next actions
- Server prefetch for content needed immediately after navigation
- Stale-time-aware prefetching so repeated focus or hover events do not spam requests

Avoid:

- Prefetching large data sets "just in case"
- Treating prefetch as a substitute for fixing obviously weak query boundaries

## Suspense and secondary data

If the framework supports Suspenseful query APIs, make sure prefetching does not accidentally block or serialize unrelated work. Prefetch secondary data only when it meaningfully reduces a waterfall or improves the next interaction.

## Review checklist

- Is the page or cursor part of the key?
- Is placeholder data used for smooth paginated transitions?
- Does the infinite query define `initialPageParam` and next/previous param logic?
- Are `fetchNextPage` calls guarded against conflicting in-flight work?
- Is prefetching tied to a realistic upcoming need?
