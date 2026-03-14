# Store Architecture And Boundaries

Start here when deciding whether a value belongs in Zustand and how the store should be structured.

## Use Zustand Only For Shared Client State

Prefer local component state when the value is:

- only used by one component or a tight parent-child cluster
- transient UI state such as hover, open/closed, input drafts, or temporary filters
- easier to reset naturally with component unmounts or route changes

Prefer a server-state tool when the problem is primarily:

- fetching, caching, retrying, or invalidating remote data
- synchronizing server truth across screens
- tracking loading and error lifecycles for API data as a first-class concern

Prefer Zustand when the state is:

- shared across distant client components
- updated from multiple interaction points
- a client-side workflow or UI model that should outlive a single component

## Keep The Store Small

Default to a narrow shape:

- plain state fields
- explicit actions
- minimal persistence

Avoid storing:

- duplicated derived values that can be computed cheaply from existing state
- raw DOM nodes, class instances, promises, or other hard-to-serialize values unless the design clearly requires them
- entire fetched-resource lifecycles when the data really belongs to a server-state cache

## Prefer Actions That Encode Intent

Good actions express business intent and keep mutation rules in one place.

```ts
import { create } from 'zustand'

type CartItem = {
  id: string
  price: number
  quantity: number
}

type CartStore = {
  items: CartItem[]
  addItem: (item: CartItem) => void
  changeQuantity: (id: string, quantity: number) => void
  clear: () => void
}

export const useCartStore = create<CartStore>()((set) => ({
  items: [],
  addItem: (item) =>
    set((state) => ({
      items: [...state.items, item],
    })),
  changeQuantity: (id, quantity) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, quantity } : item,
      ),
    })),
  clear: () => set({ items: [] }),
}))
```

Prefer this over scattering `setState(...)` calls across components.

## Derived State: Usually Compute, Do Not Store

If a value is a cheap deterministic function of current state, derive it in a selector:

```ts
const total = useCartStore((state) =>
  state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
)
```

Store a derived value only when:

- it is expensive enough that repeated recalculation is a real bottleneck
- you need to snapshot it as part of the workflow itself
- it comes from an external source and is not purely derivable from current store state

If you store a derived value, define exactly which action updates it. Do not let it drift.

## Splitting And Scaling Stores

Do not start with slices by default. Start with one bounded store and split only when:

- the store has multiple clear domains
- independent contributors need stronger modularity
- the store creator is becoming hard to review or test

The official slices pattern composes slice creators into one bounded store:

```ts
import { create, type StateCreator } from 'zustand'

type BearSlice = {
  bears: number
  addBear: () => void
}

type FishSlice = {
  fishes: number
  addFish: () => void
}

type ZooStore = BearSlice & FishSlice

const createBearSlice: StateCreator<ZooStore, [], [], BearSlice> = (set) => ({
  bears: 0,
  addBear: () => set((state) => ({ bears: state.bears + 1 })),
})

const createFishSlice: StateCreator<ZooStore, [], [], FishSlice> = (set) => ({
  fishes: 0,
  addFish: () => set((state) => ({ fishes: state.fishes + 1 })),
})

export const useZooStore = create<ZooStore>()((...args) => ({
  ...createBearSlice(...args),
  ...createFishSlice(...args),
}))
```

Guidance:

- apply middleware at the combined store level
- keep cross-slice interactions explicit
- do not turn slices into fake microservices; they are still one client store

## Review Questions

- Does this state truly need to be shared?
- Could any fields be derived instead of stored?
- Are actions expressing intent, or is mutation leaking into components?
- Has the store grown large enough to justify slices, or would that add ceremony too early?
