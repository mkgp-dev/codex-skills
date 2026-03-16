# Organization, State Boundaries, and Review Checklist

Use this reference when the user is structuring feature code, deciding where shadcn components belong, or asking for a review.

## File Organization

- Keep generated primitives in `components/ui` or the configured shared UI package.
- Keep feature composition in feature-level files such as `components/dashboard/metrics-card.tsx` or `features/settings/profile-form.tsx`.
- Do not keep cloning and forking the same primitive into multiple feature folders just to change spacing or copy.
- Extract reusable wrappers only after a real repetition pattern appears.

## State Boundaries

- Keep open-state, selected-tab, hovered-row, and temporary draft UI state local by default.
- Lift state only when multiple distant surfaces must coordinate.
- Do not push simple presentation state into a global store just because a shadcn component exposes controlled props.
- Keep server data ownership outside the UI primitive. shadcn components should render state, not become the data architecture.

## Common Anti-Patterns

- Replacing `Card`, `Alert`, `Badge`, `Separator`, or `Skeleton` with custom markup that duplicates the same behavior
- Using raw Tailwind colors across the UI instead of semantic tokens
- Building button rows to mimic `ToggleGroup`
- Rendering overlay content without a title
- Using placeholders as the only label
- Overriding every primitive with large `className` strings instead of using theme tokens or variants
- Copy-pasting component source into feature folders for one-off style tweaks
- Mixing install/setup advice into every answer even when the user only needs composition guidance

## Review Checklist

- Is the code using the right primitive for the job?
- Are accessibility requirements satisfied for titles, labels, errors, and invalid states?
- Are styling choices token-based and maintainable?
- Are file boundaries clear between reusable primitives and feature composition?
- Is state kept close to the UI unless broader coordination is required?
- If base vs radix matters, is the chosen API actually correct for that project?
