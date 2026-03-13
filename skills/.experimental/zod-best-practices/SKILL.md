---
name: zod-best-practices
description: Core Zod schema design, validation, migration, and review guidance for TypeScript applications. Use this skill whenever the user is writing Zod schemas, reviewing Zod code, modernizing deprecated Zod patterns, choosing parsing or error-handling APIs, reasoning about type inference, composing advanced schemas, or asking for current best practices that should avoid stale Zod guidance.
---

# Zod Best Practices

Use this skill for core Zod authoring, review, migration, and explanation. Prefer modern APIs from the official docs, call out legacy or deprecated patterns explicitly, and keep recommendations practical enough to apply directly in real TypeScript codebases.

## Use This Skill When

- Writing new Zod schemas for TypeScript applications
- Reviewing an existing Zod schema for correctness, maintainability, or migration issues
- Modernizing older Zod code to current patterns
- Choosing parsing, error customization, or error formatting APIs
- Reasoning about type inference, advanced schemas, coercion, transforms, checks, or Zod Mini tradeoffs

## Out Of Scope

- Framework-specific integration patterns where the main problem is the library wiring, not the Zod schema itself
- OpenAPI generation or client-generation workflows
- ORM, router, or UI library specifics unless the question is still primarily about the Zod schema design

## Working Style

1. Identify whether the task is review, modernization, schema authoring, or API explanation.
2. Prefer review and modernization first when the user supplied code.
3. Read only the relevant reference file(s) below instead of loading everything.
4. Prefer current APIs in examples and name deprecated or legacy alternatives when they appear in existing code.
5. Keep recommendations practical: prefer the simplest schema that preserves type safety, clear errors, and maintainable composition.

## Reference Map

- `references/schema-fundamentals.md`
  - Use for primitives, object modeling, arrays, records, enums, nullability, defaults, and string-format helpers.
- `references/validation-flow-and-errors.md`
  - Use for `parse` vs `safeParse`, async parsing, custom errors, issue handling, and error formatting.
- `references/type-inference-and-advanced-patterns.md`
  - Use for `z.infer`, `z.input`, `z.output`, discriminated unions, branded types, recursion, and readonly schemas.
- `references/composition-transforms-and-coercion.md`
  - Use for `.extend()`, shape spreading, `.pick()`, `.omit()`, `.partial()`, `.pipe()`, `.transform()`, `z.coerce`, `z.preprocess`, `.refine()`, `.check()`, and legacy `.superRefine()`.
- `references/migration-and-deprecations.md`
  - Use for old-to-new replacements, removed APIs, and behavior changes that commonly trip up existing code.
- `references/performance-and-zod-mini.md`
  - Use for schema reuse, TypeScript performance, tree-shaking, and when Zod Mini is or is not worth it.

## Response Requirements

- Prefer modern syntax in all new code.
- When reviewing code, separate concrete issues from optional improvements.
- When replacing deprecated APIs, show before/after snippets if the user gave code.
- Do not recommend legacy APIs as the default when a current alternative exists.
- If a legacy API still works for backward compatibility, say that clearly and still prefer the modern form.
- If an integration-specific question is mostly about another framework or library, keep the answer centered on the Zod portion and avoid drifting into tool-specific tutorials.

## Core Defaults

- Prefer top-level format helpers like `z.email()` and `z.uuid()` over deprecated method forms such as `z.string().email()`.
- Prefer `safeParse` for expected user-input validation and `parse` when throwing is intentional.
- Prefer the unified `error` API over older `message`, `required_error`, `invalid_type_error`, or `errorMap` patterns.
- Prefer `z.strictObject()` or `z.looseObject()` over legacy `.strict()` or `.passthrough()` when the object mode should be explicit.
- Prefer `.extend()` or object shape spreading over deprecated `.merge()`.
- Prefer `z.enum()` over deprecated `z.nativeEnum()`.
- Prefer top-level error formatting helpers such as `z.treeifyError()`, `z.flattenError()`, and `z.prettifyError()` over deprecated instance methods.
- Prefer `.refine()` for simple validation, `.check()` for lower-level composition or multi-issue control, and treat `.superRefine()` as legacy-but-common in existing code.

## Provenance

This skill was authored against the official Zod documentation available at the time of creation, specifically version 4.3.6 materials.