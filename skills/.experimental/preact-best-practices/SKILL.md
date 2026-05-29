---
name: preact-best-practices
description: Best-practice guidance for authoring, reviewing, debugging, and modernizing Preact v10 apps and components, including hooks, signals, `preact/compat`, SSR, performance, and testing. Use this skill whenever the user is working in Preact (or `preact/compat`), asks for Preact equivalents to React patterns, needs help choosing signals vs hooks for shared state, is debugging rerenders or hydration issues, or wants maintainable Preact-first patterns instead of React-only assumptions.
---

# Preact Best Practices

Use this skill to write and review Preact v10 code with Preact-first defaults, while selectively importing React best practices when they transfer cleanly. Keep `preact/compat` guidance explicit: treat it as an interop boundary, not the default.

## Use This Skill When

- Building or reviewing Preact components, hooks, or shared UI patterns
- Deciding between signals, hooks, and local component state
- Debugging rerenders, effect loops, stale closures, or hydration mismatches
- Writing or fixing tests using Preact Testing Library patterns
- Integrating React-ecosystem packages via `preact/compat` and wanting the tradeoffs made explicit

## Out Of Scope

- Generic React-only advice that assumes React internals apply unchanged to Preact
- Full framework selection debates (keep advice bounded to Preact usage once chosen)
- Tooling or bundler setup tutorials unless the user explicitly asks

## Working Style

1. Identify whether the task is authoring, review, debugging, modernization, SSR, testing, or compat interop.
2. Prefer Preact-native patterns first; only reach for `preact/compat` when ecosystem constraints force it.
3. Load only the rule files relevant to the user’s situation (see the rule index below).
4. When reviewing code, separate correctness issues from optional improvements.

## Rule Index (Load Only What You Need)

Core:
- `rules/core-component-boundaries.md`
- `rules/core-children-and-keys.md`

Hooks:
- `rules/hooks-effect-deps-and-cleanup.md`
- `rules/hooks-derive-state-dont-sync.md`

Signals:
- `rules/signals-choose-signals-vs-hooks.md`
- `rules/signals-avoid-double-sources-of-truth.md`

Compat:
- `rules/compat-dont-default-to-compat.md`

SSR:
- `rules/ssr-avoid-hydration-mismatch.md`

Testing:
- `rules/test-prefer-user-queries.md`

Performance:
- `rules/perf-fix-rerenders-before-memo.md`

## Response Requirements

- Prefer TypeScript examples unless the user explicitly wants plain JavaScript.
- Be explicit about tradeoffs when recommending signals vs hooks.
- If suggesting `preact/compat`, name what is gained and what is lost, and say when to avoid it.
- Prefer correctness and maintainability over micro-optimizations.

## Provenance

This skill is based on the official Preact v10 guides plus portable UI best practices adapted from common React discipline where the underlying principles apply.
