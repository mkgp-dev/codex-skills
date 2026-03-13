# Composition and Form Context

Use this reference when the user is splitting forms into nested components and needs to decide between prop passing and RHF context.

## `FormProvider` and `useFormContext`

Use `FormProvider` when form methods need to be consumed deep in the tree and prop drilling becomes noisy.

```tsx
const methods = useForm<FormValues>({
  defaultValues: {
    email: "",
  },
});

<FormProvider {...methods}>
  <form onSubmit={methods.handleSubmit(onSubmit)}>
    <EmailField />
  </form>
</FormProvider>
```

```tsx
function EmailField() {
  const { register } = useFormContext<FormValues>();
  return <input {...register("email")} />;
}
```

## When to Prefer Props Instead

Prefer explicit props when:

- the tree is shallow
- only one or two children need RHF methods
- clearer component contracts matter more than convenience

Prefer context when:

- deeply nested fields would otherwise thread `register`, `control`, or `errors` through many layers
- reusable field components should work inside a shared form boundary

## Context Rules

- `useFormContext()` only works under `FormProvider`
- avoid nested `FormProvider` unless there is a deliberate boundary between independent forms
- do not put the full `methods` object in `useEffect` dependency arrays; destructure the specific function such as `reset`

## Best-Practice Defaults

- pair `FormProvider` with scoped hooks such as `useController`, `useWatch`, or `useFormState` inside the child component that actually needs them
- avoid using context as an excuse to make every field component implicitly depend on the whole form
- if context causes broad rerenders in expensive subtrees, memoize child components or reduce the subscriptions they create

## Review Guidance

Flag these patterns when reviewing code:

- `useFormContext()` used in shallow components that could just accept `register` or `control`
- nested `FormProvider` without a clear reason
- field components that read too much form context when they only need one field or one state property
