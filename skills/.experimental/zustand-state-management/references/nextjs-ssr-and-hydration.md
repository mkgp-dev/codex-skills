# Next.js, SSR, And Hydration

Use this reference when Zustand is being used in Next.js or any SSR-sensitive React app.

## Core Constraint

In server-rendered environments, module state can leak across requests. The official Next.js guide recommends per-request store creation instead of a single global store.

## Prefer A Store Factory

Create the store with `createStore` and instantiate it from a provider boundary:

```ts
// stores/counter-store.ts
import { createStore } from 'zustand/vanilla'

export type CounterStore = {
  count: number
  increment: () => void
}

export const createCounterStore = (count = 0) =>
  createStore<CounterStore>()((set) => ({
    count,
    increment: () => set((state) => ({ count: state.count + 1 })),
  }))
```

```tsx
// providers/counter-store-provider.tsx
'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'
import { useStore } from 'zustand'

import { createCounterStore } from './stores/counter-store'

type CounterStoreApi = ReturnType<typeof createCounterStore>
type CounterStoreState = ReturnType<CounterStoreApi['getState']>

const CounterStoreContext = createContext<CounterStoreApi | null>(null)

export function CounterStoreProvider({
  children,
}: {
  children: ReactNode
}) {
  const [store] = useState(() => createCounterStore())
  return (
    <CounterStoreContext.Provider value={store}>
      {children}
    </CounterStoreContext.Provider>
  )
}

export function useCounterStore<T>(
  selector: (state: CounterStoreState) => T,
) {
  const store = useContext(CounterStoreContext)
  if (!store) throw new Error('useCounterStore must be used inside provider')
  return useStore(store, selector)
}
```

This keeps store creation tied to the correct lifecycle instead of relying on shared module state.

## React Server Components

Do not read from or write to Zustand stores inside React Server Components. They cannot use hooks or context, and they are not the place for mutable client store access.

Pass initial data down and initialize the client store in a client boundary instead.

## Hydration Safety

The server-rendered output and the first client render must agree. Hydration errors are often caused by:

- reading browser-only APIs during render
- using persisted client-only values before hydration is complete
- creating different initial store state on the server and the client

Prefer:

- deterministic server and client initial state
- client-only hydration gates around persisted or browser-derived values
- `skipHydration` plus manual `rehydrate()` when `persist` must be delayed

## Practical Defaults

- do not export one module-scoped global store as the default Next.js pattern
- do not wire Zustand directly into React Server Components
- do not let `persist` read client storage during SSR-sensitive render paths without a plan for gating or delayed rehydration

## Review Checklist

- Is the store created per request or per provider instance?
- Could this code leak state across requests?
- Does the first client render match the server output?
- Is persisted state gated until hydration completes?
