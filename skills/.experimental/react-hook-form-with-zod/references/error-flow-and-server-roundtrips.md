# Error Flow and Server Roundtrips

Use this reference when the user needs to understand how errors move through RHF alone or through RHF plus a schema-backed server boundary.

## RHF-Only Client Validation and Errors

React Hook Form populates `formState.errors` from its active validation strategy.

```tsx
const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm({
  defaultValues: {
    email: "",
  },
});

<input
  {...register("email", { required: "Email is required." })}
  aria-invalid={errors.email ? "true" : "false"}
  aria-describedby={errors.email ? "email-error" : undefined}
/>
{errors.email && <span id="email-error" role="alert">{errors.email.message}</span>}
```

Use inline field errors by default. Add an error summary only when the UX benefits from it.

## `setError` and `clearErrors`

Use `setError(...)` for async failures, server responses, or form-level conditions that are not naturally expressed by the field registration rules.

```ts
form.setError("email", {
  type: "manual",
  message: "That email is already taken.",
});

form.clearErrors("email");
```

Defaults:

- use field-specific errors when the user can act on a specific field
- use `root.serverError` for submission-level failures
- clear errors deliberately when the UX calls for it; do not clear everything by reflex on every keystroke

## `trigger`

Use `trigger(...)` for dependent validation or explicit validation checkpoints.

```ts
await form.trigger("confirmPassword");
await form.trigger(["startDate", "endDate"]);
```

Prefer targeted triggers over whole-form triggers when only one field or one dependency chain needs revalidation.

## `reset` and `setValue`

Use `reset(...)` when the form should move to a new baseline state. Use `setValue(...)` for targeted programmatic updates.

```ts
form.reset({
  email: "",
  password: "",
});

form.setValue("profile.email", nextEmail, {
  shouldDirty: true,
  shouldValidate: true,
});
```

Rules worth calling out:

- `reset()` is most reliable when `useForm(...)` started with complete `defaultValues`
- controlled fields still depend on correct default values to reset cleanly
- avoid broad parent-object `setValue(...)` calls when a specific field path is available
- avoid whole-array `setValue(...)` when field-array helpers are the current fit

## When Zod Enters the Flow

With `zodResolver(schema)`, RHF populates `formState.errors` from schema validation failures instead of duplicating the same logic in field rules.

Prefer that path when validation should be centralized or shared.

## Server Validation Reuse

When the form also uses Zod, prefer reusing the same schema on the server boundary. For expected request validation failures, prefer `safeParse` or `safeParseAsync`.

```ts
const result = schema.safeParse(payload);

if (!result.success) {
  const flattened = z.flattenError(result.error);
  return {
    ok: false,
    fieldErrors: flattened.fieldErrors,
    formErrors: flattened.formErrors,
  };
}
```

This produces a clean shape for mapping back into RHF.

## Mapping Server Errors Into RHF

Use `setError(...)` after submission for API failures or cross-field server feedback.

```ts
Object.entries(fieldErrors).forEach(([name, messages]) => {
  form.setError(name, {
    type: "server",
    message: Array.isArray(messages) ? messages[0] : messages,
  });
});

form.setError("root.serverError", {
  type: "server",
  message: "Unable to save your changes.",
});
```

Call out these RHF rules when relevant:

- field errors created with `setError(...)` can be replaced by the next successful validation pass
- root errors are useful for submission-level failures
- `shouldFocus` only works when the field ref is actually registered and focusable

## Choosing a Zod Error Shape

- Use `z.flattenError()` when RHF needs a shallow map of field messages.
- Use `z.treeifyError()` when the user needs nested diagnostics or wants to inspect deeply nested structures.
- Use `z.prettifyError()` for logs or CLI output, not as the primary form error shape.

Call out legacy guidance explicitly if the user is still using instance methods such as `error.flatten()` or `error.format()`.

## Review Guidance

Flag these patterns when you see them:

- mixing RHF field rules and schema validation without a clear ownership boundary
- broad `trigger()` or `setValue()` usage where a targeted field update would be clearer and cheaper
- calling `reset()` without a coherent default-values strategy
- catching `parse(...)` exceptions for normal UI validation flow when a non-throwing path would be clearer
- returning raw `ZodError` objects directly to the client
- mixing schema errors and server business-rule errors without distinguishing the source
