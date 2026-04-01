# codex-skills

A repository for building, refining, and organizing reusable Codex skills.

> [!NOTE]
> These skills are based on my current tech stack. I want coding agents to write code using these libraries while following the best practices I’ve gained through experience. I’m still experimenting with the output, but I hope it works well.

## Overview

This project is designed to grow into a maintainable collection of high-quality skills that can be authored, improved, benchmarked, and categorized over time. The repository currently uses a simple structure with curated and experimental skills.

## Available Skills

### Curated

| Skill | Description |
| --- | --- |
| None yet | No curated skills are currently tracked in this repository. |

### Experimental

| Skill | Description |
| --- | --- |
| [zod-best-practices](skills/.experimental/zod-best-practices/) | Core Zod schema design, validation, migration, and review guidance for TypeScript applications. |
| [react-hook-form-with-zod](skills/.experimental/react-hook-form-with-zod/) | RHF-first best-practice guidance for `useForm`, field subscriptions, controlled components, field arrays, form context, and optional Zod integration when schema validation or shared parsing is useful. |
| [shadcn-ui-best-practices](skills/.experimental/shadcn-ui-best-practices/) | Best-practice guidance for shadcn/ui composition, forms, theming, Tailwind v4 integration, accessibility, organization, and maintainable UI customization. |
| [tanstack-query-best-practices](skills/.experimental/tanstack-query-best-practices/) | TanStack Query v5 best-practice guidance for server-state boundaries, `QueryClient` setup, query keys, invalidation, mutations, pagination, hydration, and framework-aware usage across Angular, Preact, React, Solid, Svelte, and Vue. |
| [tanstack-router-best-practices](skills/.experimental/tanstack-router-best-practices/) | TanStack Router v1 best-practice guidance for route-tree design, typed navigation, search params, loaders, auth guards, not-found handling, code splitting, and Query integration in React apps. |
| [zustand-state-management](skills/.experimental/zustand-state-management/) | Zustand v5 best-practice guidance for state boundaries, store design, selectors, rerender control, persistence, middleware, and Next.js-safe store setup. |

## Installation

For a copy-paste-friendly command list, see [INSTALLATION.md](./INSTALLATION.md).

## Automation

The repository includes a scheduled library version checker driven by [libraries.json](./libraries.json). It now creates or updates a single GitHub issue only when one or more tracked packages have a newer **major** npm release, and it closes the tracking issue when no major updates remain.

## License

This repository is licensed under the MIT License. See [LICENSE](./LICENSE).
