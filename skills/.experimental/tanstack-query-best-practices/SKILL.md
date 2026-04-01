---
name: tanstack-query-best-practices
description: Best-practice guidance for designing, reviewing, debugging, and modernizing TanStack Query v5 usage across React, Preact, Solid, Vue, Svelte, and Angular. Use this skill whenever the user is working with TanStack Query or React Query, `QueryClient` setup, `useQuery`, `useMutation`, `useInfiniteQuery`, query keys, invalidation, optimistic updates, prefetching, hydration, cache tuning, stale UI, or server-state boundaries and needs current guidance instead of stale v4-era patterns.
---

# TanStack Query Best Practices

Use this skill for TanStack Query authoring, review, architecture decisions, debugging, and migrations. Start by deciding whether the problem is actually a server-state problem, then shape the query keys, defaults, invalidation flow, and framework integration around that boundary.

## Use This Skill When

- Building or reviewing TanStack Query usage in React, Preact, Solid, Vue, Svelte, or Angular
- Deciding whether data belongs in TanStack Query, local component state, router state, or a client-state store
- Setting up `QueryClient`, providers, prefetching, hydration, persistence, or framework-specific adapters
- Designing query keys, reusable option builders, invalidation rules, or optimistic update flows
- Debugging stale UI, duplicate requests, refetch churn, background loading confusion, or pagination bugs
- Modernizing older React Query or TanStack Query code to current v5 guidance

## Out Of Scope

- Transport-client-specific advice beyond the query integration point
- Generic router, form, or global-state-library tutorials unless the main problem is the TanStack Query boundary
- Inventing normalized-cache workflows that fight TanStack Query's fetch-cache-invalidate model

If the user is mainly solving local UI state, form drafts, or component composition, keep the TanStack Query advice brief and push the state to a more appropriate tool.

## Working Style

1. Decide whether the requested state is actually server state.
2. Prefer reviewing boundaries, keys, and invalidation before rewriting code.
3. Read only the relevant reference file(s) below instead of loading everything.
4. Teach shared TanStack Query rules first, then note framework-specific differences only where the bundled docs/examples show them.
5. Call out stale or migration-era advice explicitly when it appears in user code or prior guidance.
6. Prefer simple, targeted cache operations over broad invalidation or manual state duplication.

## Reference Map

- `references/core-server-state-boundaries.md`
  - Use for deciding whether TanStack Query is the right abstraction, avoiding duplicate server state, and keeping ownership boundaries clear.
- `references/query-client-and-defaults.md`
  - Use for provider setup, stable `QueryClient` lifecycles, defaults like `staleTime`/`gcTime`/retry, and adapter-level setup notes.
- `references/query-keys-and-options.md`
  - Use for key design, dependency inclusion, reusable option builders, and invalidation targeting.
- `references/query-functions-fetching-and-errors.md`
  - Use for query function structure, thrown errors, cancellation, status handling, and result-consumption pitfalls.
- `references/mutations-invalidation-and-optimistic-updates.md`
  - Use for writes, invalidation, `setQueryData`, optimistic updates, rollback flow, and mutation-state sharing.
- `references/pagination-infinite-queries-and-prefetching.md`
  - Use for pagination, infinite queries, placeholder data, prefetching, and request-waterfall reduction.
- `references/ssr-hydration-and-framework-notes.md`
  - Use for SSR, dehydration/hydration, framework-specific caveats, and per-request client guidance.
- `references/typescript-eslint-and-modernization.md`
  - Use for `queryOptions`-style helpers, `skipToken`, ESLint rules, and v4-to-v5 modernization issues.

## Response Requirements

- Say when TanStack Query is the wrong abstraction.
- Prefer current v5 guidance over v4-era habits.
- Treat the query cache as the source of truth for server data unless the user has a strong offline or editing reason not to.
- When reviewing code, separate concrete correctness issues from optional improvements.
- If framework behavior differs, name the difference briefly and keep the shared rule explicit.
- Prefer TypeScript examples unless the user explicitly wants plain JavaScript.

## Core Defaults

- Prefer TanStack Query for remote async state, not modal toggles, uncontrolled drafts, or other purely local UI state.
- Prefer one stable `QueryClient` per client app lifecycle, and a separate `QueryClient` per server request when SSR or hydration is involved.
- Prefer tuning `staleTime` before disabling every automatic refetch trigger.
- Prefer `gcTime` as an inactive-cache retention knob, not a freshness knob.
- Prefer query keys that are array-based, serializable, and include every changing dependency used by the query function.
- Prefer query functions that throw on failure and pass through the provided abort signal when the transport supports cancellation.
- Prefer targeted `invalidateQueries`, `setQueryData`, or `setQueriesData` over blanket cache resets.
- Prefer optimistic UI via mutation variables when only one surface needs the pending state, and cache writes when multiple surfaces must stay in sync.
- Prefer `placeholderData` or the exported `keepPreviousData` helper for paginated transitions instead of the removed `keepPreviousData: true` option.
- Prefer `queryOptions`, `mutationOptions`, and `infiniteQueryOptions` helpers where the adapter supports them and the config must be reused.
- Prefer the TanStack ESLint plugin in React/Preact codebases to catch unstable clients, missing key dependencies, and over-subscribed query results.

## Provenance

This skill is authored from the bundled TanStack Query materials, using the provided documentation snapshot and examples centered on TanStack Query v5.96.1 and the supplied Angular, Preact, React, Solid, Svelte, and Vue sources.
