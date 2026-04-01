# Navigation, Links, And UX

Use this reference for relative navigation, reusable links, active states, scroll handling, route masking, and navigation blockers.

## Navigation rules

- Prefer `<Link>` for user-triggered navigation because it renders a real anchor with a valid `href`.
- Use `useNavigate` only for imperative flows such as submit handlers, async side effects, or post-login redirects.
- Treat `from` and `to` as first-class inputs. TanStack Router resolves navigation relatively even when the code looks absolute.
- Prefer route-derived values such as `Route.fullPath` or `someRoute.to` instead of repeating pathname strings.

## Reusable options

- Prefer `linkOptions(...)` when a link config is shared across `Link`, `navigate`, or `redirect`.
- Use `linkOptions` to catch incorrect `to`, `search`, or `params` values early instead of only discovering errors at the spread site.
- Keep navigation option builders close to the route area that owns them.

## Active state and preloading

- Use `activeProps` and `activeOptions` for route-aware styling instead of manual location comparisons.
- Prefer intent-based preloading for common navigational surfaces when the app benefits from faster next-page loads.
- Keep preload usage deliberate; do not preload everything just because the option exists.

## URL behavior

- Use `params`, `search`, `hash`, and `state` fields instead of interpolating dynamic values into `to`.
- Use route masking for modal or alternate-URL flows only when the masked URL materially improves UX.
- Use navigation blocking only for real unsaved-change flows; avoid blanket blockers that fight normal app movement.
- Turn on scroll restoration at the router level when the app behaves like a document-style site or long list UI.

## Avoid

- Buttons that call `navigate` where a normal anchor is the right semantic control
- Relative navigation without a meaningful `from` when type-safe narrowing matters
- Raw object literals reused across links, redirects, and imperative navigation without `linkOptions`
- Reading the current location manually for every active-link decision

## Example

```tsx
import { Link, linkOptions } from '@tanstack/react-router'

const usersLink = linkOptions({
  to: '/dashboard/users',
  search: { page: 1, filter: '' },
})

function DashboardNav() {
  return (
    <nav>
      <Link {...usersLink} activeProps={{ className: 'font-semibold' }}>
        Users
      </Link>
    </nav>
  )
}
```

## Review checklist

- Is `Link` used wherever navigation is user-driven?
- Are reusable link definitions type-checked with `linkOptions`?
- Are route masks, blockers, and preload settings solving a real problem?
- Are params and search values passed structurally instead of assembled into strings?
