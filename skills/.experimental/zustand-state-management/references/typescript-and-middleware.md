# TypeScript And Middleware Patterns

Use this reference for current Zustand v5 TypeScript ergonomics.

## Prefer Curried `create<T>()(...)`

The official TypeScript guides still recommend the curried form when you want to annotate store state:

```ts
import { create } from 'zustand'

interface BearStore {
  bears: number
  increase: (by: number) => void
}

export const useBearStore = create<BearStore>()((set) => ({
  bears: 0,
  increase: (by) => set((state) => ({ bears: state.bears + by })),
}))
```

Use the same pattern for vanilla stores with `createStore<T>()(...)`.

## Do Not Call `get()` To Build Initial State

The official advanced TypeScript guide explains that Zustand types are slightly unsound during initial creation. Do not rely on `get()` synchronously while constructing initial state.

Avoid:

```ts
const useBrokenStore = create<{ count: number }>()((_, get) => ({
  count: get().count,
}))
```

Compute initial values directly instead.

## `combine` Is Convenient, But Know The Tradeoff

`combine` can infer state shape for you:

```ts
import { create } from 'zustand'
import { combine } from 'zustand/middleware'

export const useCounterStore = create(
  combine({ count: 0 }, (set) => ({
    increment: () => set((state) => ({ count: state.count + 1 })),
  })),
)
```

Use it when the reduced type ceremony is worth it. Be careful with full-state replacement and assumptions about the exact shape visible to `get`.

## Middleware Composition

The bundled docs recommend applying middleware directly inside `create` so contextual inference stays intact.

```ts
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface CounterStore {
  count: number
  increment: () => void
}

export const useCounterStore = create<CounterStore>()(
  devtools(
    persist(
      (set) => ({
        count: 0,
        increment: () => set((state) => ({ count: state.count + 1 })),
      }),
      { name: 'counter' },
    ),
  ),
)
```

Defaults:

- prefer composing middleware inline rather than through untyped wrapper helpers
- prefer `devtools` as the outermost middleware when combined with other mutating middlewares
- when using slices, apply middleware at the combined store level rather than inside each slice creator

## `createStore` Plus `useStore`

When a framework needs explicit store lifetime control, use a vanilla store plus the React hook:

```ts
import { createStore } from 'zustand/vanilla'
import { useStore } from 'zustand'

type CounterStore = {
  count: number
  increment: () => void
}

export const createCounterStore = (initialCount = 0) =>
  createStore<CounterStore>()((set) => ({
    count: initialCount,
    increment: () => set((state) => ({ count: state.count + 1 })),
  }))

// Later, in a provider:
// const store = useState(() => createCounterStore())[0]
// const count = useStore(store, (state) => state.count)
```

This pattern is especially useful for Next.js per-request stores and for controlled provider boundaries in tests.

## Review Checklist

- Is the store using the correct curried TS form?
- Is `get()` avoided during initial state construction?
- Are middlewares composed in a type-safe order?
- Is the code using `createStore` where store lifetime must be controlled explicitly?
