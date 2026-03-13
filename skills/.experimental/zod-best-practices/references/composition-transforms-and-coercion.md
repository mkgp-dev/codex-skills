# Composition, Transforms, And Coercion

Use this guide for schema reuse, staged parsing, input normalization, and custom validation logic.

## Prefer `.extend()` or shape spreading over `.merge()`

`.merge()` is deprecated. Prefer `.extend()` for normal composition:

```ts
const BaseUser = z.object({
  id: z.uuid(),
  email: z.email(),
});

const AuditFields = z.object({
  createdAt: z.date(),
  updatedAt: z.date(),
});

const UserWithAudit = BaseUser.extend(AuditFields.shape);
```

For better TypeScript performance, shape spreading is often even better:

```ts
const UserWithAudit = z.object({
  ...BaseUser.shape,
  ...AuditFields.shape,
});
```

## Use `.pick()`, `.omit()`, and `.partial()` for variants

```ts
const PublicUser = UserSchema.omit({ passwordHash: true });
const UserPatch = UserSchema.partial();
const UserSummary = UserSchema.pick({ id: true, email: true });
```

Prefer derived schemas over duplicated object literals whenever the shapes are meaningfully related.

## Separate coercion, transforms, pipes, and preprocess

Use each tool for a distinct purpose:

- `z.coerce.*()` for common serialized primitives
- `.transform()` when output type should differ from input type
- `.pipe()` for explicit staged validation
- `z.preprocess()` when arbitrary input must be normalized before entering the target schema

```ts
const PageParam = z.coerce.number().int().min(1);

const Slug = z.string()
  .trim()
  .toLowerCase()
  .pipe(z.string().regex(/^[a-z0-9-]+$/));

const FormNumber = z.preprocess((value) => {
  return typeof value === "string" ? Number(value) : value;
}, z.number().int());
```

Important coercion note:

- `z.coerce.boolean()` uses JavaScript truthiness, which is often surprising
- if that behavior is too loose, prefer explicit preprocessing or a union-based parser

## Use `.refine()` for simple custom validation

```ts
const Password = z.string()
  .min(12)
  .refine((value) => /[A-Z]/.test(value), {
    error: "Password must contain an uppercase letter.",
  });
```

Prefer `.refine()` when:

- there is one logical issue
- a boolean pass/fail check is enough
- the code should stay readable

## Use `.check()` when lower-level control is worth it

`.check()` is more powerful and more verbose. Use it when you want lower-level composition, multiple issues, or performance-sensitive custom logic.

```ts
const PasswordPair = z.object({
  password: z.string().min(12),
  confirmPassword: z.string(),
}).check((ctx) => {
  if (ctx.value.password !== ctx.value.confirmPassword) {
    ctx.issues.push({
      code: "custom",
      path: ["confirmPassword"],
      message: "Passwords do not match.",
      input: ctx.value.confirmPassword,
    });
  }
});
```

## Treat `.superRefine()` as legacy-but-common

The official materials are not perfectly uniform:

- `packages/zod.mdx` marks `.superRefine()` as deprecated in favor of `.check()`
- `api.mdx` still documents `.superRefine()` directly and notes that `.check()` is lower-level

House guidance for this skill:

- recognize `.superRefine()` when reviewing existing code
- do not introduce it as the default style in fresh examples
- prefer `.refine()` for simple cases and `.check()` when lower-level control is actually needed

## Prefer explicit staged parsing over hidden magic

If input needs several steps, make the steps visible:

```ts
const SearchParams = z.object({
  page: z.coerce.number().int().min(1).default(1),
  sort: z.enum(["asc", "desc"]).default("asc"),
});
```

Avoid large transforms that silently validate, coerce, normalize, and reshape everything in one opaque function.

## Fault-tolerant defaults

- use `.default()` when `undefined` should short-circuit to an output value
- use `.prefault()` when the default should still pass through parsing logic
- use `.catch()` only when a fallback-on-parse-failure contract is truly desired
