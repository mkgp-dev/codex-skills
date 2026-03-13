# Performance, Accessibility, and Troubleshooting

Use this reference when the user is debugging rerenders, validation behavior, error presentation, or stale patterns in an RHF form.

## Performance Defaults

- Prefer `mode: "onSubmit"` unless the UX genuinely needs earlier validation.
- Define schemas outside the render path so the resolver does not rebuild on every render.
- Prefer `register` over `Controller` for native inputs.
- Prefer `useController` for reusable controlled components and `Controller` for inline controlled bridges.
- Watch only the fields you need; use `useWatch` or `useFormState` for isolated subscriptions.
- Prefer `FormProvider` only when it actually removes painful prop drilling; otherwise keep dependencies explicit.
- Update individual nested values directly when possible instead of setting a large parent object.

## Accessibility Defaults

- Every field needs a visible label or a strong accessible-name alternative.
- Use `aria-invalid` on invalid inputs.
- Use `role="alert"` on inline errors so screen readers announce them.
- Use `aria-describedby` to connect the field to its hint or error text.
- Let RHF focus errors when possible, or use `setFocus(...)` intentionally after async failures.

## Common Integration Mistakes

- Using `Controller` for plain native inputs with no custom value bridge
- Ignoring `useController` and pushing every controlled-field pattern into large inline `Controller` blocks
- Double-registering a controlled component
- Using `watch()` broadly when a child-level `useWatch()` subscription would be narrower
- Pulling broad state from `formState` when `useFormState` or `getFieldState` would isolate the rerender
- Reaching for `useFormContext` in shallow trees where props would be clearer
- Omitting `defaultValues` and then relying on dirty-state or reset behavior
- Using whole-array `setValue(...)` where `replace(...)` or other field-array helpers are the current fit
- Copying stale Zod patterns into form schemas when the form also uses Zod
- Duplicating the same validation in both the Zod schema and RHF field rules without a reason

## Modernization Notes

When modernizing older examples:

- prefer current RHF guidance first
- add `useController`, `useWatch`, `useFormState`, or `FormProvider` only when they solve a real structure or performance problem
- prefer current Zod 4 helper choices in the schema when Zod is present
- prefer top-level Zod error-formatting helpers
- keep RHF wiring the same if it is already correct
- only widen the answer into performance or accessibility guidance when it addresses a real bug or review concern

## Debugging Checklist

Ask these questions in order:

1. Is the schema expressing the real domain shape?
2. Is the input value reaching RHF in the shape the schema expects?
3. Is the field native enough for `register`, or does it require `useController` / `Controller`?
4. Is the current subscription too broad and better expressed with `useWatch`, `useFormState`, or `getFieldState`?
5. Are `defaultValues` and field names aligned with the schema paths?
6. Are errors being mapped at the right layer: resolver, submit handler, or server response?

Use that checklist to keep the answer practical instead of dumping unrelated RHF API details.
