---
name: react-hook-form-with-zod
description: Best-practice guidance for building forms with React Hook Form in modern TypeScript React apps, with Zod integration when schema validation is useful. Use this skill whenever the user is writing or reviewing `useForm`, `register`, `useController`, `Controller`, `useFieldArray`, `useWatch`, `useFormState`, `FormProvider`, `useFormContext`, `defaultValues`, `setValue`, `reset`, `trigger`, `setError`, or accessible React Hook Form validation flows, including cases where Zod and `zodResolver` should be added or modernized.
---

# React Hook Form With Zod

Use this skill for React Hook Form authoring and review. Start with sound RHF structure, then bring in Zod when the user needs schema validation, typed parsing, shared client/server validation, or modernization of stale Zod-backed forms.

## Use This Skill When

- Building or reviewing React Hook Form forms
- Choosing between `register`, `useController`, `Controller`, and `useFieldArray`
- Setting `defaultValues`, `formState`, `useFormState`, `setValue`, `reset`, `trigger`, `setError`, or submit/error flows
- Structuring deeply nested forms with `FormProvider` and `useFormContext`
- Reviewing `watch` versus `useWatch` subscription choices
- Handling numeric, date, checkbox, or custom widget input values in RHF
- Improving accessibility and error rendering for forms
- Adding Zod validation to an RHF form when schemas or shared validation are needed
- Debugging nested errors, field arrays, controlled inputs, or server validation roundtrips
- Reviewing or modernizing outdated React Hook Form + Zod examples

## Out Of Scope

- Pure Zod schema design questions where React Hook Form is not the main problem
- General React component architecture that is unrelated to forms
- Framework-specific UI libraries beyond the form integration point

If the request is mostly about schema modeling or Zod migrations with little RHF involvement, keep the RHF advice brief and point the user toward `zod-best-practices`.

## Working Style

1. Identify whether the problem is plain RHF authoring, RHF review, or RHF plus schema validation.
2. Prefer `register` for native inputs, `useController` for reusable controlled-field components, and `Controller` for inline controlled bridges.
3. Solve browser-input normalization at the RHF boundary before adding schema transforms.
4. Show the `useForm` setup, including `defaultValues`, validation strategy, subscriptions, and only the generics that materially help.
5. Introduce Zod when shared validation, parsed output typing, or clearer schema ownership actually improves the result.
6. Call out stale or legacy RHF or Zod patterns when the user provides older examples.

## Reference Map

- `references/resolver-setup-and-typing.md`
  - Use for baseline `useForm` setup, RHF validation options, `zodResolver`, schema-derived typing, and transformed input/output types.
- `references/state-and-subscriptions.md`
  - Use for `watch`, `useWatch`, `useFormState`, `getFieldState`, and subscription-scoping guidance.
- `references/form-input-normalization.md`
  - Use for `valueAsNumber`, `valueAsDate`, `setValueAs`, RHF-side normalization, optional schema coercion, and browser-input pitfalls.
- `references/controlled-and-dynamic-fields.md`
  - Use for `register`, `useController`, `Controller`, `useFieldArray`, nested paths, controlled components, and dynamic form structures with or without Zod.
- `references/composition-and-form-context.md`
  - Use for `FormProvider`, `useFormContext`, prop-passing tradeoffs, and nested form composition.
- `references/error-flow-and-server-roundtrips.md`
  - Use for RHF-only validation and mutation APIs, `setError`, `clearErrors`, `reset`, `trigger`, `setValue`, `root` errors, and optional schema-backed server reuse.
- `references/performance-accessibility-and-troubleshooting.md`
  - Use for validation modes, rerender control, accessibility, common RHF mistakes, and Zod-specific modernization notes.

## Response Requirements

- Prefer RHF-first examples by default.
- Add Zod only when the user needs schema validation, shared validation, output typing, or a modernization path for existing Zod-backed code.
- Prefer current Zod 4 guidance whenever Zod is present.
- Cover the important RHF API that materially affects structure or performance instead of pretending `useForm` plus `register` is the whole story.
- If the user supplied stale code, separate concrete issues from optional improvements.
- Avoid turning the answer into a generic React tutorial when the problem is form wiring.
- Make the tradeoff between schema validation and RHF field-level rules explicit when both are present.

## Core Defaults

- Prefer plain `useForm(...)` with sensible `defaultValues` and RHF-native patterns for simple forms.
- Prefer `resolver: zodResolver(schema)` when schema-backed validation or shared client/server parsing is actually useful.
- Prefer `type FormValues = z.infer<typeof schema>` for standard Zod-backed forms, and reach for `z.input<typeof schema>` / `z.output<typeof schema>` when transforms or coercion change the parsed shape.
- Prefer `register("age", { valueAsNumber: true })`, `valueAsDate`, or `setValueAs` for native browser inputs before defaulting to schema coercion.
- Prefer `register` for native inputs, `useController` for reusable controlled components, and `Controller` for inline one-off controlled adapters.
- Provide complete `defaultValues` at `useForm` when RHF needs a stable source of truth; do not use `undefined` as the controlled default value.
- Prefer `useWatch` over broad `watch()` subscriptions when rerender isolation matters.
- Prefer `useFormState` or `getFieldState` for scoped state reads instead of pulling the entire `formState` into large components.
- Prefer `FormProvider` and `useFormContext` for deeply nested form trees, but avoid context when direct props keep dependencies clearer.
- Prefer RHF rules for small local constraints and Zod when validation should be centralized, reused, or typed.
- Avoid duplicating the same validation in both the schema and `register(...)` unless the duplication is intentional.
- Prefer targeted `trigger("fieldName")` and deliberate `reset(...)` / `setValue(...)` usage over broad form-wide updates when performance or state correctness matters.
- Prefer `z.flattenError()` when mapping form-field errors and `z.treeifyError()` when the UI or logs need nested structure.
- Prefer `setError("root.serverError", ...)` or field-specific `setError(...)` for async server feedback after submission.
- Prefer `field.id` as the React key for `useFieldArray` items.
- Prefer array helpers such as `append`, `remove`, and `replace`; avoid whole-array updates via `setValue(...)` when RHF documents that path as legacy or scheduled for removal.

## Provenance

This skill is authored from the React Hook Form 7.71.2 documentation snapshot, with the bundled Zod 4.3.6 documentation.
