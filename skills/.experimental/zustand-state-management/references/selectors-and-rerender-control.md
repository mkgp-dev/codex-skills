# Selectors, Subscriptions, And Rerender Control

This is the main reference for Zustand v5 subscription behavior.

## Prefer Narrow Selectors

Subscribe to exactly what the component needs:

```ts
const count = useCounterStore((state) => state.count)
const increment = useCounterStore((state) => state.increment)
```

Avoid pulling the whole store unless the component truly needs the whole store object:

```ts
// Avoid as a default pattern
const store = useCounterStore()
```

## Stable Selector Outputs Matter In v5

In Zustand v5, selectors that return a fresh object or array reference on every render can cause unnecessary rerenders and can even produce infinite update loops in bad cases.

Risky pattern:

```ts
const [searchValue, setSearchValue] = useSearchStore((state) => [
  state.searchValue,
  state.setSearchValue,
])
```

Prefer separate selectors when possible:

```ts
const searchValue = useSearchStore((state) => state.searchValue)
const setSearchValue = useSearchStore((state) => state.setSearchValue)
```

If the component genuinely needs a bundled object or array, use `useShallow`.

## `useShallow` For Object And Array Selectors

The bundled hook docs use `useShallow` from `zustand/react/shallow`:

```ts
import { useShallow } from 'zustand/react/shallow'

const { bears, fishes } = useZooStore(
  useShallow((state) => ({
    bears: state.bears,
    fishes: state.fishes,
  })),
)
```

Use it when:

- the selector returns an object or array
- the result should be considered equal by shallow comparison
- separate selectors would be awkward or materially noisier

Do not use it as a blanket fix for sloppy selector design.

## `createWithEqualityFn` Only When You Need Custom Equality

The v5 migration guide is explicit: `create` no longer accepts a custom equality function path. If you truly need that behavior, move to `createWithEqualityFn` from `zustand/traditional`.

```ts
import { createWithEqualityFn } from 'zustand/traditional'
import { shallow } from 'zustand/vanilla/shallow'

type PositionStore = {
  position: { x: number; y: number }
  setPosition: (position: { x: number; y: number }) => void
}

export const usePositionStore = createWithEqualityFn<PositionStore>()(
  (set) => ({
    position: { x: 0, y: 0 },
    setPosition: (position) => set({ position }),
  }),
  shallow,
)
```

Notes:

- this is not the default path
- it adds `zustand/traditional` plus the `use-sync-external-store` peer dependency
- reach for it when custom equality is central to the design, not as a reflex

## External Subscriptions

When non-React code needs granular subscriptions, use `subscribeWithSelector`.

```ts
import { createStore } from 'zustand/vanilla'
import { subscribeWithSelector } from 'zustand/middleware'

type MetricsStore = {
  online: boolean
  latencyMs: number
}

export const metricsStore = createStore<MetricsStore>()(
  subscribeWithSelector(() => ({
    online: true,
    latencyMs: 0,
  })),
)

metricsStore.subscribe((state) => state.online, (online) => {
  console.log('online status changed', online)
})
```

Prefer this to broad store subscriptions when only one field matters.

## Review Checklist

- Is each component subscribed to the smallest useful slice?
- Does any selector return a new object, array, or fallback function each render?
- Would separate selectors be simpler than a bundled object selector?
- Is `createWithEqualityFn` solving a real requirement or hiding weak selector design?
