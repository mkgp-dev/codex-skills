---
name: tanstack-router-best-practices
description: Best-practice guidance for designing, reviewing, debugging, and modernizing TanStack Router routing in React apps, especially file-based route trees, `Link` and `useNavigate`, `validateSearch`, `beforeLoad`, loaders, `notFoundComponent`, auth guards, code splitting, and TanStack Query integration. Use this whenever the user is working with `@tanstack/react-router`, TanStack Start routing, route organization, URL state, or navigation behavior and needs current v1 guidance instead of stale class-based or React Router patterns.
---

# TanStack Router Best Practices

Use this skill for TanStack Router authoring, review, architecture decisions, debugging, and migrations. Start by deciding whether the problem is route structure, URL state, loader orchestration, or data ownership, then keep the route tree typed, the navigation APIs explicit, and the data-loading story consistent.

## Use This Skill When

- Building or reviewing route trees, layouts, pathless layouts, or route-file organization
- Choosing between file-based, code-based, and virtual file routing
- Designing typed links, relative navigation, reusable link options, or route masking flows
- Validating and consuming search params, shared URL state, and search-driven loaders
- Wiring `beforeLoad`, loaders, auth guards, redirects, not-found handling, and pending states
- Integrating TanStack Router with TanStack Query or TanStack Start
- Fixing stale Router examples that still rely on deprecated route classes, `NotFoundRoute`, or non-reactive `router.state`

## Out Of Scope

- Generic React component design that is unrelated to routing concerns
- Server-state cache policy design beyond the Router integration point
- Framework setup details outside React unless the user explicitly asks for Solid, Vue, or another supported framework

If the user is mainly solving local component state, form validation, or server-cache ownership, keep Router advice brief and push the problem toward the right abstraction.

## Working Style

1. Prefer file-based routing unless the project has a concrete reason to keep routes in code or to use virtual file routes.
2. Keep route concerns in routes: matching, params, search validation, guards, loaders, and route-level boundaries.
3. Default to React examples, but lead with shared TanStack Router rules when the behavior is framework-agnostic.
4. Prefer typed route APIs, `from` narrowing, and reusable option builders over raw strings and ad hoc URL assembly.
5. Separate Router cache guidance from TanStack Query guidance before recommending a loader strategy.
6. Call out deprecated or stale patterns directly when they appear in user code.

## Reference Map

- `references/router-setup-and-route-organization.md`
  - Use for file-based routing, route-tree design, pathless layouts, route directories, and virtual routes.
- `references/navigation-links-and-ux.md`
  - Use for `Link`, `useNavigate`, relative navigation, active states, preloading, masking, blocking, and scroll behavior.
- `references/search-params-and-url-state.md`
  - Use for `validateSearch`, schema adapters, URL-state boundaries, serializers, and search-driven loader keys.
- `references/loaders-deferred-data-and-query-integration.md`
  - Use for `beforeLoad`, loaders, `loaderDeps`, Router cache vs Query cache, deferred data, and SSR-oriented Query integration.
- `references/errors-not-found-and-route-context.md`
  - Use for auth guards, redirects, `notFoundComponent`, route errors, root defaults, and typed router context.
- `references/typing-rendering-and-code-splitting.md`
  - Use for router registration, `getRouteApi`, `from` and `strict`, render optimizations, `useRouterState`, and lazy route setup.

## Response Requirements

- Say when file-based routing is the simpler and safer choice.
- Prefer current v1 APIs over deprecated route classes, `NotFoundRoute`, or stale React Router habits.
- Prefer TypeScript examples unless the user explicitly wants plain JavaScript.
- Keep route matching, URL validation, guards, and loaders in routes instead of burying them in page components.
- When reviewing code, separate correctness issues from optional ergonomics improvements.
- If the user is using TanStack Query, explain whether the route should return loader data, prewarm the query cache, or do both.

## Core Defaults

- Prefer file-based routing with the Router plugin for new React apps.
- Prefer mixed flat and directory route organization over forcing a fully flat or fully nested convention everywhere.
- Prefer pathless layouts for shared UI or guard boundaries that should not add a URL segment.
- Prefer `Link` for user-driven navigation and `useNavigate` or redirects only for event-driven or lifecycle-driven navigation.
- Prefer `linkOptions` for reusable navigation objects instead of untyped object literals.
- Prefer validated, typed search params with sensible fallbacks before consuming URL state.
- Prefer `loaderDeps` that list only the params or search fields the loader actually uses.
- Prefer `beforeLoad` for auth and route middleware, and `loader` for data acquisition.
- Prefer `notFoundComponent` plus `notFound()` over deprecated `NotFoundRoute`.
- Prefer `createRootRouteWithContext` when routes need injected dependencies such as auth or a `QueryClient`.
- Prefer `useRouterState`, route hooks, or `getRouteApi` in components instead of reading `router.state` directly.
- Prefer automatic code splitting when supported; otherwise split non-critical route UI into `.lazy.tsx` files.

## Provenance

This skill is authored from the bundled TanStack Router materials centered on `@tanstack/react-router` v1.168.10.
