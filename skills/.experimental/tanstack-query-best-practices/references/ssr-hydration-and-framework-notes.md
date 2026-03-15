# SSR, Hydration, And Framework Notes

Use this reference when the user is rendering on the server, hydrating prefetched data, or hitting adapter-specific behavior.

## Shared SSR flow

The full TanStack Query SSR path is:

1. Create a fresh `QueryClient` for the request or preload phase
2. Prefetch the queries you want available at first render
3. Dehydrate that client
4. Pass the dehydrated state to the client
5. Rehydrate it inside a `HydrationBoundary` or adapter-equivalent boundary

When multiple queries can be prefetched independently, fetch them in parallel.

React-family hydration example:

```tsx
// server or loader
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 60_000 },
  },
})

await Promise.all([
  queryClient.prefetchQuery({ queryKey: ['posts'], queryFn: getPosts }),
  queryClient.prefetchQuery({ queryKey: ['profile'], queryFn: getProfile }),
])

const dehydratedState = dehydrate(queryClient)
```

```tsx
// client
function App({ dehydratedState }: { dehydratedState: unknown }) {
  const [queryClient] = React.useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={dehydratedState}>
        <Routes />
      </HydrationBoundary>
    </QueryClientProvider>
  )
}
```

## Prefer full hydration over `initialData` for non-trivial cases

`initialData` is acceptable for simple one-off cases, but full dehydrate/hydrate is usually better when:

- Multiple components consume the same query
- You care about correct `dataUpdatedAt`
- The page is revisited and server-fetched data should replace older client cache data

## Server-side freshness defaults

Set a non-zero `staleTime` for hydrated SSR queries unless immediate client refetch is actually desired. Otherwise the app may fetch again right after hydration and waste the server work you just did.

## React and Preact

Prefer:

- A per-request client on the server
- A stable client in client state at the app root
- `HydrationBoundary`, not the old `Hydrate` component

Do not create one module-global server client shared across requests.

## Solid

Solid Query works naturally with `Suspense` and `ErrorBoundary`. Keep the same server-state rules, but remember the adapter exposes data in a Solid-friendly reactive shape.

## Vue

Vue-specific correctness rule: keep reactive inputs reactive.

Prefer:

- Passing refs or getters in `queryKey`
- Reactive `enabled` conditions when the query should follow reactive state

Avoid extracting `.value` too early and then expecting the query to refetch automatically.

Also remember query results are immutable. Create a copy before mutating for forms or two-way bindings.

Vue reactivity example:

```ts
export function useUserProjects(userId: MaybeRefOrGetter<string>) {
  return useQuery({
    queryKey: ['user-projects', userId],
    queryFn: () => fetchUserProjects(toValue(userId)),
  })
}
```

## Svelte and SvelteKit

Svelte Query requires `create*` options to be wrapped in a function to preserve reactivity.

For SvelteKit SSR in the bundled docs:

- Server execution needs extra care so queries do not keep running after HTML is sent
- The documented setup gates queries with `browser` in default options
- Prefetching through load functions plus `QueryClientProvider` is the more complete cache-preserving setup

Svelte note example:

```svelte
<script lang="ts">
  import { createQuery } from '@tanstack/svelte-query'

  const postsQuery = createQuery(() => ({
    queryKey: ['posts'],
    queryFn: getPosts,
  }))
</script>
```

## Angular

The Angular adapter in the bundled docs is still experimental.

Prefer:

- `provideTanStackQuery(new QueryClient())` at bootstrap time
- `injectQuery(() => ({ ... }))` and `injectMutation(() => ({ ... }))`
- Patch-version pinning and careful upgrades

Angular example:

```ts
query = injectQuery(() => ({
  queryKey: ['todos'],
  queryFn: () => this.todoService.getTodos(),
}))
```

## Review checklist

- Is there a fresh client per request or preload phase?
- Is hydration using the current boundary API?
- Is `initialData` being used where full hydration would be safer?
- Are reactive framework inputs staying reactive?
- Are framework-specific caveats acknowledged without replacing the shared TanStack Query rules?
