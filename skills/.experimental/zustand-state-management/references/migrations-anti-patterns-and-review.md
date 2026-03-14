# Migrations, Anti-Patterns, And Review Checklist

Use this reference when modernizing older Zustand code or reviewing a PR.

## Important v5 Migration Points

### `create` No Longer Carries The Old Equality-Function Pattern

If older code relies on custom equality behavior, migrate to:

- narrow selectors
- `useShallow` for shallow-stable object and array selectors
- `createWithEqualityFn` from `zustand/traditional` when custom equality is truly required

### Stable Selector Outputs Matter More

Selectors that allocate a new object, array, or fallback function every time can cause rerender churn and in some cases infinite loops.

Prefer:

```ts
const fallbackAction = () => {}
const action = useMainStore((state) => state.action ?? fallbackAction)
```

Avoid:

```ts
const action = useMainStore((state) => state.action ?? (() => {}))
```

### `zustand/context` Is Legacy

Older examples may still use `createContext` from `zustand/context`. That was deprecated earlier and removed in v5. Use `React.createContext` with a vanilla store and `useStore` instead.

### Persist Behavior Changed

The migration guide notes that `persist` no longer stores the initial state automatically at store creation. Do not assume storage is populated until state is explicitly written or rehydrated.

## Anti-Patterns

- putting every piece of UI state into one giant global store
- storing easy derived values instead of deriving them in selectors
- subscribing to the whole store in large components
- returning fresh objects or arrays from selectors without `useShallow`
- applying middleware inside each slice creator
- using Zustand as the main server-state cache
- reading or mutating the store from React Server Components
- persisting transient request state, errors, or insecure data without a clear reason

## Review Checklist

When reviewing Zustand code, check these first:

1. Does the state belong in Zustand at all?
2. Are selectors narrow and stable?
3. Is the code following v5 patterns instead of carrying v4 habits forward?
4. Is persistence deliberate and hydration-safe?
5. In Next.js, is the store lifetime correct for SSR and request isolation?

## Rewrite Guidance

When you rewrite stale code:

- fix correctness and v5 migration issues first
- then reduce unnecessary rerenders
- then simplify store shape and middleware
- only after that suggest optional architecture refinements
