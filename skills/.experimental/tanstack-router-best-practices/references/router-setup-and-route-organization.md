# Router Setup And Route Organization

Use this reference when the user is deciding how to structure a TanStack Router app or when a route tree has become hard to navigate and maintain.

## Preferred setup

- Prefer file-based routing for most apps. The bundled docs describe it as the preferred and recommended approach.
- Use the TanStack Router bundler plugin when the stack supports it so route generation and code splitting stay automatic.
- Reach for code-based routing only when route definitions truly need to live in code.
- Use virtual file routes only when you need custom route-file locations or want to keep an existing project layout while still getting file-based route-tree generation.

## Route-tree design

- Keep the route tree visually aligned with the URL hierarchy.
- Mix flat files and route directories where it improves readability; do not force one style everywhere.
- Use pathless layout routes for shared shells, guard boundaries, and common outlets that should not add a pathname segment.
- Encapsulate large route areas into directories with `route.tsx` when a route needs sibling files such as loaders, components, tests, or lazy files.
- Keep route-specific helpers near the route, but keep generic services and data clients outside the route tree.

## Defaults to prefer

- One clear root route with app-level providers and defaults
- File names that reflect path shape instead of feature nicknames
- Route files that own route config, not business logic
- Virtual routes only as an escape hatch, not as the default convention

## Avoid

- Rewriting a straightforward file-based app into code-based routes without a real benefit
- Hiding critical route ownership behind sprawling helper factories
- Using one giant route file once the route tree has naturally broken into sections
- Treating virtual routes as a style preference instead of a constraint-driven choice

## Example structure

```text
src/routes/
  __root.tsx
  index.tsx
  posts/
    route.tsx
    index.tsx
    $postId.tsx
    $postId.edit.tsx
  settings.tsx
  settings.profile.tsx
  _authed.tsx
  _authed/
    dashboard.tsx
```

## Review checklist

- Is file-based routing being used unless there is a concrete reason not to?
- Do pathless layouts represent UI and guard boundaries cleanly?
- Is the route tree readable from file names alone?
- Are route files focused on route concerns instead of becoming feature dumping grounds?
