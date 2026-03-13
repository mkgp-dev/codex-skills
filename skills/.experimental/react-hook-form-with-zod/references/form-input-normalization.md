# Form Input Normalization

Use this reference when the problem is really about what the browser gives React Hook Form and how that value should be normalized before validation.

## Prefer RHF-Side Normalization First

Native HTML inputs often emit strings even when the domain type is numeric or date-like. For common browser inputs, prefer RHF's registration helpers before adding schema machinery.

```ts
type FormValues = {
  age: number;
  startDate: Date;
};

const form = useForm<FormValues>();

<input type="number" {...form.register("age", { valueAsNumber: true })} />
<input type="date" {...form.register("startDate", { valueAsDate: true })} />
```

This keeps the normalization close to the input and avoids unnecessary schema complexity.

## Use `setValueAs` for Custom Parsing

When a native helper is not enough, normalize at registration time.

```ts
<input
  {...form.register("nickname", {
    setValueAs: (value) => value.trim() || undefined,
  })}
/>
```

This is usually clearer than pushing every browser quirk into a transform.

## When Zod Coercion or Preprocess Is Reasonable

Use schema-side coercion when:

- the same schema validates data from multiple non-form boundaries
- the browser source is not the only source of input
- the normalization is truly part of the domain boundary

```ts
const schema = z.object({
  quantity: z.coerce.number().int().positive(),
  publishAt: z.preprocess(
    (value) => value === "" ? undefined : value,
    z.iso.datetime().optional()
  ),
});
```

If coercion changes the type materially, mention `z.input` and `z.output`.

## Zod Defaults When Used

- Prefer current top-level format helpers such as `z.email()` and `z.uuid()`.
- Prefer the unified `error` API instead of `message`, `required_error`, or `errorMap` as the default recommendation.
- Avoid hiding surprising transforms inside the schema when RHF can normalize the value more directly.

## Common Browser Pitfalls

- Empty strings are not the same as `undefined`.
- `valueAsNumber` can produce `NaN`; if that matters, explain the failure mode and show an explicit empty-state strategy.
- Checkboxes and multi-selects already produce different shapes; explain whether the field should be boolean, array, or enum-backed.
- File inputs and custom objects are not a good fit for "pretend it is just a string" validation.

## Review Guidance

When reviewing existing code:

- call out string-to-number transforms that should have been `valueAsNumber`
- call out schema defaults whose type does not match the post-transform output
- call out coercion that relies on surprising JavaScript behavior without documenting it
