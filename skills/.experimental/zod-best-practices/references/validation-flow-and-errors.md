# Validation Flow And Errors

Use this guide for parse strategy, async validation, issue handling, and user-facing error output.

## Choose `parse` vs `safeParse` intentionally

Use `safeParse` for expected validation failures at system boundaries:

- request bodies
- query params
- environment variables
- external API data
- user input

```ts
const result = UserSchema.safeParse(input);

if (!result.success) {
  return {
    ok: false,
    issues: result.error.issues,
  };
}

return { ok: true, data: result.data };
```

Use `parse` when throwing is the desired control flow and the caller is expected to handle exceptions.

## Async schemas require async parsing

If any refinement or transform is async, use `parseAsync` or `safeParseAsync`.

```ts
const Username = z.string().refine(async (value) => {
  return !(await isTaken(value));
}, { error: "Username already taken." });

const result = await Username.safeParseAsync("alice");
```

Do not show `parse()` for async refinement examples.

## Prefer the unified `error` API

In current Zod, custom errors belong under `error`.

```ts
const PasswordSchema = z.string().min(12, {
  error: "Password must be at least 12 characters.",
});
```

Prefer this over:

- `{ message: "..." }`
- `required_error`
- `invalid_type_error`
- `errorMap`

Conditional customization is still fine:

```ts
const NameSchema = z.string({
  error: (issue) => {
    if (issue.input === undefined) return "Name is required.";
    return undefined;
  },
});
```

## Remember precedence changed

Schema-level error customization wins over per-parse customization.

```ts
const schema = z.string({ error: "Schema-level error" });

schema.safeParse(12, {
  error: () => "Per-parse error",
});
```

Call this out during migration reviews when older code assumes parse-time overrides take priority.

## Work with `error.issues`

Use `error.issues` for programmatic handling, mapping nested paths, and building transport-safe responses.

```ts
const result = FormSchema.safeParse(input);

if (!result.success) {
  for (const issue of result.error.issues) {
    console.log(issue.path, issue.message);
  }
}
```

Prefer structured issue handling over reading `error.message`.

## Use the current formatting helpers

Use top-level helpers, not deprecated instance methods:

```ts
const tree = z.treeifyError(result.error);
const flat = z.flattenError(result.error);
const pretty = z.prettifyError(result.error);
```

Choose based on the consumer:

- `z.treeifyError()` for nested UI or API structures
- `z.flattenError()` for shallow field-error maps
- `z.prettifyError()` for logs, CLI output, or human-readable debug output

Treat `error.format()` and `error.flatten()` as legacy patterns in existing code.

## Validate early and avoid double validation

Prefer validating once at the boundary and passing validated data inward.

Bad pattern:

- parse request data in middleware
- parse the same object again in the service layer without a good reason

Good pattern:

- validate at the edge
- pass typed, validated data deeper into the system

## Be careful with raw input in errors

By default, issues do not include raw input values. This avoids leaking sensitive data.

```ts
schema.safeParse(input, { reportInput: true });
```

Only enable `reportInput` when it is genuinely useful and safe to log or return.

## JSON and preprocessing boundaries

Do not trust `JSON.parse()` output just because it parsed successfully. Parse the result with Zod immediately afterward.

If preprocessing is needed before validation, keep it narrow and explicit rather than turning it into a hidden data-cleaning pipeline.
