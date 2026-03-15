# TypeScript, ESLint, And Modernization

Use this reference when the user needs current v5-safe guidance, type-safe helpers, or a cleanup path for older examples.

## TypeScript defaults

Prefer typed query functions over letting transports return `any`.

Good pattern:

- Extract the fetcher into a properly typed function
- Let inference flow into `useQuery`, `select`, and cache reads

Example:

```tsx
type Group = { id: string; name: string }

const fetchGroups = async (): Promise<Group[]> => {
  const response = await fetch('/api/groups')
  if (!response.ok) throw new Error('Failed to fetch groups')
  return response.json()
}

const groupsQuery = useQuery({
  queryKey: ['groups'],
  queryFn: fetchGroups,
})
```

## Reusable option helpers

When configs are reused, prefer the adapter's helper builders where available:

- `queryOptions`
- `mutationOptions`
- `infiniteQueryOptions`

These helpers help preserve inference across:

- Hook usage
- Prefetching
- `getQueryData`
- Shared query/mutation definitions

Example:

```tsx
import { mutationOptions, queryOptions } from '@tanstack/react-query'

function groupOptions() {
  return queryOptions({
    queryKey: ['groups'],
    queryFn: fetchGroups,
    staleTime: 5_000,
  })
}

function addGroupOptions() {
  return mutationOptions({
    mutationKey: ['groups', 'create'],
    mutationFn: addGroup,
  })
}
```

## Type-safe conditional queries

When the adapter supports it, `skipToken` is preferable to awkward generic workarounds for conditionally disabled queries in TypeScript-heavy code.

Example:

```tsx
const todoQuery = useQuery({
  queryKey: ['todo', todoId],
  queryFn: todoId ? () => fetchTodo(todoId) : skipToken,
})
```

## Useful advanced typing hooks

Only reach for these when the codebase really benefits:

- Registering a global error type
- Registering global query and mutation key shapes
- Registering typed `meta`

Do not front-load these patterns into small examples unless the user explicitly needs them.

## ESLint guidance

In React and Preact codebases, the TanStack ESLint plugin is worth recommending because it catches high-value mistakes like:

- Unstable `QueryClient` creation
- Missing query-key dependencies
- Over-subscribing via object rest destructuring on query results
- Passing whole query or mutation result objects into hook dependency arrays

Recommend linting when the user is building a team-wide pattern, not only when a single snippet is broken.

Lint-worthy review example:

```tsx
// Bad
const query = useQuery({ queryKey: ['todos'], queryFn: fetchTodos })
useEffect(() => {
  console.log(query.data)
}, [query])

// Better
const { data } = useQuery({ queryKey: ['todos'], queryFn: fetchTodos })
useEffect(() => {
  console.log(data)
}, [data])
```

## Modernization checklist for old guidance

Call these out directly when they appear:

- Prefer the single object signature for query and mutation hooks.
- `cacheTime` was renamed to `gcTime`.
- Query callbacks like `onSuccess`, `onError`, and `onSettled` were removed from queries in v5; keep them on mutations.
- Prefer `HydrationBoundary` over the removed `Hydrate`.
- Prefer `placeholderData` identity behavior or the exported `keepPreviousData` helper over the removed `keepPreviousData: true` option.
- Infinite queries now require `getNextPageParam`, and `initialPageParam` should be explicit.
- In React-family v5 guidance, `status: 'loading'` became `status: 'pending'`, and `isPending` is the primary no-data status flag.

Modernization example:

```tsx
// Old
useQuery(['todos'], fetchTodos, {
  cacheTime: 10 * 60_000,
  keepPreviousData: true,
})

// Current v5 direction
useQuery({
  queryKey: ['todos'],
  queryFn: fetchTodos,
  gcTime: 10 * 60_000,
  placeholderData: keepPreviousData,
})
```

## Review checklist

- Is the fetcher typed instead of leaking `any`?
- Would reusable option helpers remove duplicated configs?
- Are lint rules available for the exact class of bug being discussed?
- Does the modernization advice replace removed APIs instead of preserving them behind "still works" wording?
