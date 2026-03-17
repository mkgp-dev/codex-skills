---
name: zustand-state-management
description: Best-practice guidance for designing, reviewing, and modernizing Zustand state in modern TypeScript React apps. Use this skill whenever the user is writing or reviewing `create`, `createStore`, `useStore`, `useShallow`, `persist`, `devtools`, `subscribeWithSelector`, `createWithEqualityFn`, slices, Next.js store setup, hydration behavior, or selector-related rerender problems in Zustand v5 code.
---

# Zustand State Management

Use this skill for Zustand authoring and review. Start by deciding whether the state should exist in Zustand at all, then choose the smallest store shape, subscription pattern, and middleware stack that solves the problem without introducing avoidable rerenders or framework bugs.

## Use This Skill When

- Building or reviewing Zustand stores in React or vanilla TypeScript code
- Deciding whether state belongs in local component state, Zustand, or a server-state tool
- Structuring store state, actions, selectors, slices, and derived values
- Fixing rerender churn, unstable selector outputs, or stale v4 equality patterns
- Adding `persist`, `devtools`, `immer`, `combine`, or `subscribeWithSelector`
- Wiring Zustand into Next.js, SSR, or hydration-sensitive apps
- Modernizing older examples that still rely on `zustand/context`, selector equality args on `create`, or other pre-v5 patterns

## Out Of Scope

- Server-state fetching, caching, retries, and invalidation beyond explaining why Zustand is not the right primary tool
- UI-library-specific component advice beyond the store integration point
- Generic React performance tuning that is unrelated to Zustand subscriptions

If the user is mainly solving remote-data synchronization, keep the Zustand advice brief and push toward a server-state library. If the user only needs a local toggle, draft state, or ephemeral widget state, prefer component state instead of inventing a store.

## Working Style

1. Decide whether the problem actually needs a shared client store.
2. Keep store state minimal and derive values in selectors when they can be computed cheaply and deterministically.
3. Prefer narrow selectors and stable selector outputs; treat object and array allocations inside selectors as a performance and correctness concern in v5.
4. Use middleware only when it clearly improves the design, not because a template happened to include it.
5. For Next.js or SSR, treat module-scoped stores as a risk until you have confirmed the request and hydration model.
6. When reviewing user code, separate correctness issues, v5 migration issues, and optional architecture improvements.

## Reference Map

- `references/store-architecture-and-boundaries.md`
  - Use for deciding whether Zustand is appropriate, store shape, actions, derived state, and slices.
- `references/selectors-and-rerender-control.md`
  - Use for selector discipline, stable outputs, `useShallow`, `createWithEqualityFn`, and external subscriptions.
- `references/async-persistence-and-side-effects.md`
  - Use for async actions, persistence, `partialize`, versioned migrations, and hydration-aware rehydration.
- `references/typescript-and-middleware.md`
  - Use for `create<T>()(...)`, `createStore<T>()(...)`, `combine`, middleware ordering, and TypeScript gotchas.
- `references/nextjs-ssr-and-hydration.md`
  - Use for per-request store creation, provider wiring, React Server Component boundaries, and hydration safety.
- `references/migrations-anti-patterns-and-review.md`
  - Use for v4 to v5 modernization, removed APIs, common mistakes, and review checklists.

## Response Requirements

- Say when Zustand is the wrong abstraction.
- Prefer modern Zustand v5 guidance, especially around selector stability and removed equality arguments on `create`.
- Prefer TypeScript examples unless the user explicitly wants plain JavaScript.
- Show the smallest store and selector surface that solves the problem.
- Keep examples architecture-first: state boundary, actions, selector usage, then middleware if justified.
- Call out stale patterns directly when the user provides older Zustand code.

## Core Defaults

- Prefer local component state for UI-only, route-local, or short-lived state.
- Prefer Zustand for shared client state that must be read or updated across distant components.
- Prefer a small store with explicit actions over pushing entire UI trees or fetched payload lifecycles into the store.
- Prefer selectors like `useStore((s) => s.count)` over subscribing to the whole store.
- Prefer `useShallow` from `zustand/react/shallow` when a selector must return an object or array.
- Prefer `createWithEqualityFn` from `zustand/traditional` only when the problem truly needs a custom equality function; note that it requires `use-sync-external-store`.
- Prefer `createStore` plus `useStore` for framework-specific provider patterns such as per-request Next.js stores.
- Prefer `persist` only for data that is worth restoring after reload; use `partialize`, `version`, and `migrate` deliberately.
- Prefer keeping network calls outside render and inside actions, services, or event handlers.
- Prefer deriving simple computed values in selectors instead of storing duplicated derived state.
- Prefer applying middleware at the combined store level, not inside individual slice creators.
- Prefer `devtools` as the outermost middleware when composing it with other mutating middlewares.

## Provenance

This skill is authored from the bundled Zustand documentation snapshot targeting Zustand v5.0.12, including the official guides for TypeScript, slices, `useShallow`, `persist`, Next.js, SSR and hydration, testing, and the v5 migration guide.
