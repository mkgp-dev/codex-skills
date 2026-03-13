# Migration And Deprecations

Use this guide when the task involves older Zod code, version migrations, or stale community examples.

## Prefer explicit replacement guidance

When reviewing legacy code, name the exact old API and the exact replacement.

## Common replacements

### String format methods -> top-level helpers

```ts
// legacy
z.string().email();
z.string().uuid();
z.string().url();

// modern
z.email();
z.uuid();
z.url();
```

### `message` -> `error`

```ts
// legacy
z.string().min(5, { message: "Too short." });

// modern
z.string().min(5, { error: "Too short." });
```

### `required_error` and `invalid_type_error` -> conditional `error`

```ts
// legacy
z.string({
  required_error: "Required",
  invalid_type_error: "Not a string",
});

// modern
z.string({
  error: (issue) => issue.input === undefined
    ? "Required"
    : "Not a string",
});
```

### `errorMap` -> `error`

```ts
z.string({
  error: (issue) => {
    if (issue.code === "too_small") {
      return `Minimum is ${issue.minimum}`;
    }
    return undefined;
  },
});
```

### Legacy object modifiers -> explicit top-level object helpers

```ts
// legacy
z.object({ name: z.string() }).strict();
z.object({ name: z.string() }).passthrough();

// modern
z.strictObject({ name: z.string() });
z.looseObject({ name: z.string() });
```

### `.merge()` -> `.extend()` or shape spread

```ts
const Combined = Base.extend(Extra.shape);

const CombinedFast = z.object({
  ...Base.shape,
  ...Extra.shape,
});
```

### `z.nativeEnum()` -> `z.enum()`

```ts
enum Role {
  Admin = "admin",
  Member = "member",
}

const RoleSchema = z.enum(Role);
```

### `ZodError.format()` and `ZodError.flatten()` -> top-level helpers

```ts
const tree = z.treeifyError(error);
const flat = z.flattenError(error);
```

### Removed or discouraged APIs

- `.deepPartial()` was removed
- `.nonstrict()` was removed
- `z.promise()` is deprecated; await first, then parse
- `.strip()` is deprecated as a recommendation because plain `z.object()` already strips
- `.safe()` on numbers no longer means what older code often expects

## Behavior changes worth calling out

- `z.coerce.*()` inputs default to `unknown`
- defaults inside optional object properties are applied during parsing
- `.default()` now uses output-type defaults; `.prefault()` preserves pre-parse behavior
- enum-keyed `z.record()` is now exhaustive
- `safeParse()` and `safeParseAsync()` no longer return real `Error` subclasses in the same way older code may assume

## Migration style for this skill

- be explicit about whether an API is removed, deprecated, legacy, or still valid but no longer preferred
- prefer before/after examples over abstract statements
- if the old code still runs, say so, but still recommend the modern form
