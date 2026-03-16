# Setup, Installation, and Project Context

Use this reference when the user is initializing shadcn/ui, debugging `components.json`, or deciding how much setup detail the answer needs.

## Setup Rules

- Prefer `npx shadcn@latest init` for project initialization when the user wants CLI-managed components.
- Treat `components.json` as the source of truth for install paths, aliases, style choice, icon library, and Tailwind CSS wiring.
- Do not assume `components.json` exists if the user is copying component source manually.
- Prefer `new-york` over the deprecated `default` style when discussing new setups.

## `components.json` Guidance

- For Tailwind v4, keep `tailwind.config` empty.
- Point `tailwind.css` at the real global CSS entry that owns theme variables.
- Keep `tailwind.cssVariables` enabled when the project uses semantic token theming.
- Keep aliases accurate so generated imports land in the intended `ui`, `lib`, and `hooks` locations.

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true
  },
  "iconLibrary": "lucide",
  "aliases": {
    "components": "@/components",
    "hooks": "@/hooks",
    "lib": "@/lib",
    "utils": "@/lib/utils",
    "ui": "@/components/ui"
  }
}
```

## Monorepo Defaults

- In monorepos, run `add` from the app workspace that owns the local `components.json`.
- Keep a `components.json` file in each participating workspace.
- Keep `style`, `baseColor`, and `iconLibrary` aligned across app and shared UI workspaces.
- Prefer a shared `packages/ui` target for reusable primitives and keep feature components inside the consuming app.

## How Much Setup To Include

- If the user is asking for UI composition or review, keep setup brief and focus on the UI code.
- If the user is blocked on missing aliases, CSS variables, or install paths, explain `components.json` and CSS entry ownership directly.
- Do not force CLI-specific workflows into answers about already-installed components unless the bug is installation-related.
