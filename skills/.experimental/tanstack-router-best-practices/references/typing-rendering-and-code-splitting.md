# Typing, Rendering, And Code Splitting

Use this reference for type registration, route APIs, render behavior, and lazy-route structure.

## Type registration and route APIs

- Register the router with declaration merging so top-level exports like `Link`, `useNavigate`, and `useParams` stay fully typed.
- Prefer `Route.useParams()`, `Route.useSearch()`, and other route-bound hooks inside the route module.
- Prefer `getRouteApi(routeId)` in split files or deep components instead of importing route modules and creating circular dependencies.
- Use `from` to narrow route-aware hooks and links when relative navigation or search typing matters.
- Use `strict: false` only for truly shared components that cannot know their route boundary.

## Rendering behavior

- Do not read `router.state` in a component and expect reactivity. Use `useRouterState` for reactive router state.
- Use selectors with `useRouterState` or route hooks to avoid broad rerenders.
- Enable structural sharing only when the selected output is JSON-compatible and the rerender tradeoff justifies it.

## Code splitting

- Prefer automatic code splitting when using file-based routing with a supported bundler.
- If automatic splitting is unavailable, keep critical route config in the main route file and move non-critical UI config into `.lazy.tsx`.
- Do not try to lazy split the root route; it is always rendered.
- Keep loaders, search validation, route context, and other critical route config in the non-lazy file so routing and preloading can start immediately.

## Avoid

- Non-registered routers that force weak types at the framework boundary
- Importing route modules from arbitrary deep files when `getRouteApi` is the safer option
- Using `router.state` directly for loading indicators
- Moving loaders into lazy route files just because the component is lazy

## Example

```ts
const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
```

## Review checklist

- Is the router registered for global type inference?
- Are route-aware hooks narrowed with `from` where needed?
- Are loading indicators using `useRouterState` instead of direct `router.state` reads?
- Is code splitting keeping critical route config eager and lazy UI config separate?
