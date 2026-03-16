---
name: shadcn-ui-best-practices
description: Best-practice guidance for authoring, reviewing, debugging, and modernizing shadcn/ui usage in React applications. Use this skill whenever the user is working with shadcn/ui components, `components.json`, Dialog or Sheet flows, Field or FieldGroup forms, semantic tokens, theming, Tailwind v4 integration, or wants to replace ad hoc Tailwind-heavy UI with maintainable component-first patterns.
---

# shadcn/ui Best Practices

Use this skill for shadcn/ui authoring, review, architecture decisions, UI cleanup, and modernization. Center the answer on the fact that shadcn/ui ships source code you own: prefer composition, semantic tokens, and maintainable project conventions over one-off styling hacks.

## Use This Skill When

- Building or reviewing shadcn/ui interfaces, pages, forms, overlays, or feature UIs
- Deciding between existing shadcn primitives and custom markup
- Setting up or auditing `components.json`, aliases, Tailwind v4 wiring, or theme tokens
- Debugging broken composition, invalid states, trigger APIs, or over-customized styling
- Modernizing older shadcn patterns such as deprecated `toast` usage or brittle color overrides
- Organizing feature code around `components/ui`, app-level feature components, and local state boundaries

## Out Of Scope

- Registry publishing or MCP workflows unless the user's main problem is specifically about registry authoring
- Framework-specific deployment or routing details that are not materially affecting shadcn usage
- Replacing shadcn/ui with a different component system

If the problem is mostly about generic React state, data fetching, or router behavior, keep the shadcn portion focused on the UI boundary.

## Working Style

1. Identify whether the task is setup, review, authoring, debugging, or modernization.
2. Prefer existing shadcn components and documented composition patterns before suggesting custom wrappers.
3. Read only the relevant reference file(s) below instead of loading everything.
4. Keep base-vs-radix API differences explicit when they affect correctness.
5. Prefer semantic tokens, variants, and CSS variables over raw utility overrides.
6. When reviewing code, separate concrete accessibility or composition bugs from optional polish.

## Reference Map

- `references/setup-installation-and-project-context.md`
  - Use for initialization choices, `components.json`, aliases, monorepo notes, and when CLI context matters.
- `references/composition-primitives-and-layout.md`
  - Use for component selection, triggers, overlays, layout, grouping rules, and replacing custom markup with primitives.
- `references/forms-accessibility-and-validation.md`
  - Use for `Field`, `FieldGroup`, `FieldSet`, invalid states, controlled inputs, and structured form composition.
- `references/styling-theming-and-tailwind-v4.md`
  - Use for semantic tokens, OKLCH variables, `@theme inline`, Tailwind v4 behavior, and controlled customization.
- `references/organization-state-and-review-checklist.md`
  - Use for file organization, state boundaries, maintainability rules, and review-oriented anti-pattern detection.

## Response Requirements

- Treat shadcn/ui as owned source code, not as an untouchable package API.
- Prefer current patterns over older or deprecated guidance.
- Name accessibility requirements explicitly for overlays, fields, and invalid states.
- Avoid assuming CLI-injected project context exists; use `components.json` only when relevant to the user's setup.
- When base and radix differ, name the difference instead of pretending one API fits both.
- Prefer TypeScript examples unless the user explicitly wants JavaScript.

## Core Defaults

- Prefer existing shadcn components and documented composition before inventing styled `div` alternatives.
- Prefer full component composition such as `CardHeader` plus `CardContent`, `DialogHeader` plus `DialogTitle`, and grouped item structures inside `SelectGroup`, `DropdownMenuGroup`, or similar parents.
- Prefer `Field`, `FieldGroup`, `FieldSet`, `FieldLegend`, and `FieldError` for form structure instead of ad hoc spacing wrappers.
- Prefer `data-invalid` on the field container and `aria-invalid` on the control for invalid-state styling and accessibility.
- Prefer `sonner` over the deprecated `toast` component.
- Prefer semantic tokens and built-in variants over raw palette utilities or manual dark-mode color overrides.
- Prefer `@theme inline`, CSS variables, and OKLCH-based theming for Tailwind v4 projects.
- Prefer `size-*`, `gap-*`, and `cn()` over duplicated width-height pairs, `space-*`, or manual class string concatenation.
- Prefer local component state for transient UI like open tabs, expanded rows, and modal state; only lift state when multiple surfaces genuinely need shared coordination.
- Prefer gradual customization of generated components over early, broad rewrites that make future updates hard.

## Provenance

This skill is authored from the bundled shadcn documentation and examples.
