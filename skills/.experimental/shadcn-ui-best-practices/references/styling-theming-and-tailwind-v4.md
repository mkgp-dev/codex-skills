# Styling, Theming, and Tailwind v4

Use this reference when the problem is visual consistency, token usage, dark mode, or Tailwind v4 migration.

## Styling Defaults

- Prefer semantic tokens such as `bg-background`, `text-foreground`, `bg-primary`, and `text-muted-foreground`.
- Prefer built-in variants before custom class overrides.
- Use `cn()` for conditional classes instead of manual template-string assembly.
- Avoid raw palette utilities for core product UI when a semantic token or variant exists.
- Avoid manual `dark:` color overrides for shadcn components when token-based theming can solve the problem once.

## Tailwind v4 Rules

- Prefer CSS variables with `@theme inline`.
- Keep theme variables in the main global CSS file, not scattered across component files.
- In Tailwind v4 projects, move `:root` and `.dark` outside `@layer base`.
- Store theme values directly as color values and map them through `@theme inline`.

```css
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --primary: oklch(0.922 0 0);
  --primary-foreground: oklch(0.205 0 0);
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
}
```

## Customization Discipline

- Add new semantic tokens when the design truly needs a new concept, not just because one screen wants a custom color.
- Extend the theme centrally before hardcoding values in many components.
- Treat `className` as the place for spacing, width, placement, and minor composition glue, not a substitute for a design-token system.
- Be conservative about editing generated primitives. Prefer wrappers or feature-level composition until a repeated need justifies changing the primitive itself.

## Modernization Notes

- Prefer `sonner` over the deprecated `toast` component.
- Prefer `size-*` over paired `w-*` and `h-*` when dimensions match.
- Use `data-slot` hooks when customizing component internals in Tailwind v4-era components instead of brittle descendant selectors.

## Review Questions

- Is the code using semantic tokens or raw colors?
- Is dark mode solved with variables or duplicated class branches?
- Is the component overriding appearance that should instead come from a variant or theme token?
- Is Tailwind v4 wired through `@theme inline` and a single owned CSS entry?
