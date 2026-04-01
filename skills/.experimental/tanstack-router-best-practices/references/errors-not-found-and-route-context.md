# Errors, Not Found, And Route Context

Use this reference for auth guards, dependency injection, `notFoundComponent`, redirects, and route-level error boundaries.

## Router context

- Prefer `createRootRouteWithContext` when routes need dependencies such as auth state, service clients, or a `QueryClient`.
- Pass only the root context required at router creation time. Let `beforeLoad` extend context as the route tree descends.
- Use router context for dependency injection, not for storing arbitrary UI state.
- Call `router.invalidate()` when context-derived state such as auth changes and routes need recomputed context.

## Auth and guards

- Prefer auth checks in `beforeLoad`, not in leaf components.
- Redirect unauthenticated users with `redirect({ to, search: { redirect: location.href } })`.
- If auth verification can throw, rethrow intentional redirects and convert real failures into the chosen auth flow.
- Use outlet short-circuiting only when the product intentionally keeps users on the same URL for login UX.

## Not-found handling

- Prefer `notFoundComponent` and `notFound()` for missing-path and missing-resource handling.
- Configure at least a root-level `notFoundComponent` or router-wide `defaultNotFoundComponent`.
- Throw `notFound()` in `loader` or `beforeLoad` when the resource does not exist.
- Prefer throwing not-found errors in loaders instead of components so loader data stays typed and the UI does not flicker.
- Treat deprecated `NotFoundRoute` guidance as stale.

## Error boundaries

- Keep route-specific `errorComponent` or default router error components close to the failure boundary they represent.
- Use `notFoundComponent` for missing-resource cases and `errorComponent` for actual error states.
- Do not rely on the Router's intentionally basic fallback not-found UI.

## Avoid

- Importing auth hooks directly into route config when the value should come from router context
- Throwing `notFound()` in components as the default pattern
- Leaving root-level not-found behavior unconfigured
- Treating not-found and general error handling as interchangeable

## Review checklist

- Is router context being used for injected dependencies instead of ad hoc imports?
- Do guards live in `beforeLoad`?
- Is `notFoundComponent` configured where users need meaningful recovery UI?
- Are missing resources handled in loaders instead of components?
