# State and Subscriptions

Use this reference when the question is about reading form values or form state without creating avoidable rerenders.

## `watch` Versus `useWatch`

Prefer `watch()` for simple read logic that naturally belongs near the form root. Prefer `useWatch()` when a child component should subscribe to a specific field or subset of fields without rerendering the entire form.

```tsx
const { control, watch } = useForm<FormValues>();

const status = watch("status");
const lineItems = useWatch({ control, name: "lineItems" });
```

Best-practice defaults:

- avoid broad `watch()` calls when only one child needs the value
- prefer specific field names over whole-form subscriptions
- provide `defaultValue` to `useWatch` when initial undefined values would create UI flicker

## `useWatch` Timing and `getValues`

If a value may be set before the subscription is established, combine `useWatch` with `getValues()` or make sure the subscription is created before the update path matters.

```tsx
const coupon = useWatch({
  control,
  name: "couponCode",
  defaultValue: getValues("couponCode"),
});
```

Use this guidance when the user is debugging missed updates or timing problems.

## `useFormState`

Use `useFormState()` to isolate subscriptions to `errors`, `dirtyFields`, `isSubmitting`, or other state slices in child components.

```tsx
const { errors, isSubmitting } = useFormState({
  control,
  name: ["email", "password"],
});
```

Defaults:

- subscribe to the narrowest field set that answers the question
- destructure only the properties the component actually needs
- avoid lifting broad form-state subscriptions to the top of large component trees

## `getFieldState`

Use `getFieldState(name, formState)` when the user needs the state for a single field without wiring a broader subscription pattern.

```tsx
const emailState = getFieldState("email", formState);
```

This is useful for one-off reads or helper functions, not as a blanket replacement for `useFormState`.

## Review Guidance

Call out these patterns when reviewing RHF code:

- `watch()` used at the form root to power many unrelated child components
- components reading the whole `formState` object when they need one property
- `useWatch()` without a stable default in places where undefined causes a broken first render
- subscription logic that is much broader than the actual UI dependency
