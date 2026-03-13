# Controlled and Dynamic Fields

Use this reference when the user is dealing with controlled widgets, nested objects, or arrays of fields in React Hook Form.

## `register` First, `useController` or `Controller` When Needed

React Hook Form is optimized for uncontrolled native inputs. Stay with `register` unless a component needs a controlled `value` / `onChange` contract.

Use `useController` when you are building a reusable controlled field component and want the hook-level API.

```tsx
function CurrencyField({
  control,
  name,
}: {
  control: Control<FormValues>;
  name: "amount";
}) {
  const {
    field,
    fieldState: { error },
  } = useController({
    control,
    name,
  });

  return (
    <>
      <CurrencyInput
        value={field.value}
        onValueChange={(raw) => field.onChange(raw === "" ? undefined : Number(raw))}
        onBlur={field.onBlur}
      />
      {error && <span role="alert">{error.message}</span>}
    </>
  );
}
```

Use `Controller` when the controlled bridge is local to one form and an inline render prop keeps the code simpler.

```tsx
<Controller
  control={form.control}
  name="publishAt"
  render={({ field }) => (
    <DatePicker
      selected={field.value}
      onChange={field.onChange}
      onBlur={field.onBlur}
    />
  )}
/>
```

Important defaults:

- prefer `useController` for reusable controlled-field components
- prefer `Controller` for one-off inline integrations
- Do not spread both `field` and `register(...)` into the same input.
- Do not use `undefined` as the controlled default value.
- If the user is only wrapping a native `<input>`, challenge whether `Controller` is necessary.
- keep one `useController` per reusable field component unless there is a very clear reason to couple multiple fields together

## Transforming Controlled Values

If a controlled widget emits the wrong shape, normalize it in the `field.onChange(...)` bridge before reaching for complex schema transforms.

```tsx
<Controller
  control={form.control}
  name="amount"
  render={({ field }) => (
    <CurrencyInput
      value={field.value}
      onValueChange={(raw) => field.onChange(raw === "" ? undefined : Number(raw))}
    />
  )}
/>
```

## Nested Paths

RHF names nested values with dot paths. Keep the schema and the field names aligned.

```ts
type FormValues = {
  profile: {
    email: string;
  };
};

<input {...form.register("profile.email")} />
```

If the form also uses Zod, keep the schema paths identical to the RHF field names.

## `useFieldArray`

Use `useFieldArray` when the user has repeatable groups such as contacts, addresses, or line items.

```tsx
const { fields, append, remove, replace } = useFieldArray({
  control: form.control,
  name: "contacts",
});

{fields.map((field, index) => (
  <div key={field.id}>
    <input {...form.register(`contacts.${index}.email`)} />
    <button type="button" onClick={() => remove(index)}>Remove</button>
  </div>
))}
```

Rules worth calling out:

- Use `field.id` as the React key, not the array index.
- Prefer one `useFieldArray` instance per field-array name.
- Prefer `append`, `prepend`, `insert`, `remove`, `move`, and `replace` over whole-array `setValue(...)`.
- Provide complete default objects when appending or inserting array items.
- Avoid `shouldUnregister` on a `Controller` that lives inside a field array unless the user understands the remount/unregister behavior.
- If the form also uses Zod, make the array item schema match the field-array item shape exactly.

## Multi-Step Forms

If the user has a wizard:

- keep the schema stable across steps when possible
- be explicit about whether hidden-step values should persist
- mention `shouldUnregister` only when the persistence tradeoff matters

Do not drift into general app-state architecture unless the question is specifically about how RHF state survives between steps.
