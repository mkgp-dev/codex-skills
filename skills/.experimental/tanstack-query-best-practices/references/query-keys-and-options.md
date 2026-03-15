# Query Keys And Options

Use this reference when the user needs a cache identity scheme that scales beyond toy examples.

## Query keys are cache identity

TanStack Query keys must be arrays at the top level. Build them so they uniquely describe the fetched data.

Prefer keys like:

- `['todos']`
- `['todo', todoId]`
- `['projects', { page, status }]`
- `['users', userId, 'permissions']`

Avoid:

- String-only keys with hidden variables in closures
- Object keys that contain non-serializable values
- Throwing unrelated UI state into the key just because it is nearby

Example:

```tsx
const projectsQuery = useQuery({
  queryKey: ['projects', { teamId, page, status }],
  queryFn: () => fetchProjects({ teamId, page, status }),
})
```

## Include every changing dependency

If the query function depends on a value that changes, include it in the key.

Prefer:

- `queryKey: ['todo', todoId]` with `queryFn: () => fetchTodo(todoId)`

Avoid:

- `queryKey: ['todo']` with `queryFn: () => fetchTodo(todoId)`

Treat query keys like dependency arrays for server data. Missing dependencies cause stale cache reuse and incorrect invalidation.

Review example:

```tsx
// Bad: todoId is hidden from the cache identity
useQuery({
  queryKey: ['todo'],
  queryFn: () => fetchTodo(todoId),
})

// Good: the cache key matches the fetched resource
useQuery({
  queryKey: ['todo', todoId],
  queryFn: () => fetchTodo(todoId),
})
```

## Prefer hierarchical keys

Organize keys from general to specific so invalidation can be targeted cleanly.

Examples:

- `['todos']`
- `['todos', { status: 'done' }]`
- `['todos', todoId]`
- `['todos', todoId, 'comments']`

This makes prefix invalidation useful without turning every invalidation into a full-cache blast.

## Reuse option builders, not scattered config

When a query or mutation config must be reused across `useQuery`, prefetching, hydration, or cache reads, prefer extracted option builders.

Where supported by the adapter, use:

- `queryOptions(...)`
- `mutationOptions(...)`
- `infiniteQueryOptions(...)`

These helpers are especially useful in TypeScript because they preserve inference across:

- `useQuery(...)`
- `prefetchQuery(...)`
- `prefetchInfiniteQuery(...)`
- `getQueryData(...)`

Example:

```tsx
import { queryOptions } from '@tanstack/react-query'

function projectOptions(projectId: string) {
  return queryOptions({
    queryKey: ['project', projectId],
    queryFn: () => fetchProject(projectId),
    staleTime: 30_000,
  })
}

const projectQuery = useQuery(projectOptions(projectId))
await queryClient.prefetchQuery(projectOptions(projectId))
const cachedProject = queryClient.getQueryData(projectOptions(projectId).queryKey)
```

## Invalidation should mirror key design

Prefer:

- `invalidateQueries({ queryKey: ['todos'] })` to refresh a family
- `invalidateQueries({ queryKey: ['todos', todoId] })` for a specific entity
- `exact: true` when only the base key should match
- Predicates only when simpler key targeting is not enough

Avoid:

- `invalidateQueries()` with no filter unless the user truly wants a global refresh
- Weak keys that force predicates everywhere

Invalidation example:

```ts
await queryClient.invalidateQueries({ queryKey: ['projects'] })
await queryClient.invalidateQueries({ queryKey: ['project', projectId] })
await queryClient.invalidateQueries({ queryKey: ['projects'], exact: true })
```

## Framework notes

- Vue: keep reactive refs or getters in `queryKey` when the query should react to them.
- Svelte and Solid: keep option factories wrapped in functions so reactive values are re-evaluated correctly.
- Angular: the same key design rules apply when configs are created inside `injectQuery(() => ({ ... }))`.

## Review checklist

- Are keys arrays and serializable?
- Does every changing dependency appear in the key?
- Does the key hierarchy support targeted invalidation?
- Would an extracted options builder reduce duplication and typing drift?
