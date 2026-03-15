# Query Client And Defaults

Use this reference for setup, client lifetime, and the default behaviors that drive most "why did this refetch?" questions.

## Keep the QueryClient stable

Create one stable `QueryClient` for the lifecycle of the client app. Do not construct a new client on every render.

Prefer:

- A module-scoped client for purely client-rendered apps
- `useState(() => new QueryClient(...))` or equivalent inside the app root when SSR is involved
- A fresh client per request on the server

Avoid:

- `const queryClient = new QueryClient()` inside a rendering function on every render
- Sharing one server-side client across requests

React-family example:

```tsx
import * as React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60_000,
            gcTime: 10 * 60_000,
            retry: 2,
          },
        },
      }),
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
```

## Understand the important defaults

Out of the box:

- Queries start stale
- Stale queries refetch on mount, window focus, and reconnect
- Inactive queries are garbage collected after 5 minutes by default
- Failed queries retry 3 times with exponential backoff
- Structural sharing stays on and should usually remain on

These defaults are aggressive but sensible. Most refetch churn should be solved by setting an appropriate `staleTime`, not by turning off every trigger first.

## Default tuning guidance

Prefer:

- `staleTime` based on data volatility and UX expectations
- `gcTime` based on how long inactive results are worth keeping around
- Retry functions or lower retry counts for permanent failures like 4xx cases
- Server-side `staleTime` above `0` when using hydration to avoid immediate client refetch

Remember:

- `staleTime` controls freshness
- `gcTime` controls how long inactive cache entries survive

If someone says "`gcTime` keeps data fresh for 30 minutes," correct that directly.

Default-tuning example:

```ts
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60_000,
      gcTime: 30 * 60_000,
      retry: (failureCount, error) => {
        if (isPermanentClientError(error)) return false
        return failureCount < 2
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
})
```

## Provider setup by framework

- React and Preact: wrap the tree with `QueryClientProvider`.
- Solid: wrap the tree with `QueryClientProvider`; query data cooperates with `Suspense` and `ErrorBoundary`.
- Vue: install the adapter once, then use its composables with reactive inputs.
- Svelte: place `QueryClientProvider` near the root and wrap `create*` options in a function.
- Angular: use `provideTanStackQuery(new QueryClient())`, then `injectQuery` / `injectMutation`; the adapter is still marked experimental in the bundled docs, so prefer patch-version pinning.

Angular example:

```ts
import { bootstrapApplication } from '@angular/platform-browser'
import {
  provideTanStackQuery,
  QueryClient,
} from '@tanstack/angular-query-experimental'

bootstrapApplication(AppComponent, {
  providers: [provideTanStackQuery(new QueryClient())],
})
```

## Devtools and plugins

Devtools are useful in development, but they are optional. Recommend them when the user is debugging cache behavior or refetch flow.

Persistence and offline plugins are specialized tools. Do not recommend them by default unless the user actually needs offline durability or warm startup caches.

## Review checklist

- Is the client stable across renders?
- Is SSR using a per-request client?
- Are freshness complaints being solved with `staleTime` rather than broad trigger disablement?
- Is `gcTime` being described and used correctly?
- Are retry defaults appropriate for the API behavior?
