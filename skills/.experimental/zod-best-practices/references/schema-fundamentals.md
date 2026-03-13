# Schema Fundamentals

Use this guide for greenfield schema authoring and for reviewing the core shape of a schema.

## Prefer modern primitives and format helpers

Use the narrowest schema that matches the actual data contract.

```ts
import * as z from "zod";

const UserSchema = z.object({
  id: z.uuid(),
  email: z.email(),
  website: z.url().optional(),
  createdAt: z.iso.datetime(),
  age: z.int().min(18).max(120),
});
```

Prefer top-level format helpers in new code:

- `z.email()`
- `z.uuid()`
- `z.url()`
- `z.iso.date()`
- `z.iso.time()`
- `z.iso.datetime()`

Do not introduce deprecated method forms such as `z.string().email()` unless you are explaining legacy code.

## Model objects deliberately

`z.object()` strips unknown keys by default. Use a more explicit object mode when strictness matters.

```ts
const StrictUser = z.strictObject({
  name: z.string(),
});

const LooseUser = z.looseObject({
  name: z.string(),
});
```

Prefer:

- `z.object()` when default strip behavior is correct
- `z.strictObject()` when extra keys should fail
- `z.looseObject()` when extra keys should pass through

Treat `.strict()` and `.passthrough()` as legacy APIs that may still appear in existing code.

## Derive variants instead of duplicating schemas

```ts
const UserSchema = z.object({
  id: z.uuid(),
  email: z.email(),
  displayName: z.string().min(1),
  bio: z.string().max(160).optional(),
});

const UserCreateSchema = UserSchema.omit({ id: true });

const UserPatchSchema = UserSchema.pick({
  displayName: true,
  bio: true,
}).partial();
```

Prefer:

- `.pick()` and `.omit()` for variants
- `.partial()` for patch/update input
- `.required()` when a partial schema needs to be made fully required again

Do not recommend removed `.deepPartial()` as a shortcut. Model nested patch shapes intentionally.

## Arrays, tuples, records, maps, and sets

Use `z.array()` for normal lists and `z.tuple()` when the length and positions matter.

```ts
const Tags = z.array(z.string()).min(1);
const Coordinates = z.tuple([z.number(), z.number()]);
```

`.nonempty()` still works, but in modern Zod its inferred type aligns with `.min(1)`. If tuple-like non-empty typing matters, use a tuple with a rest schema instead.

For keyed collections:

```ts
const ScoreMap = z.record(z.string(), z.number());
const ColorScores = z.record(z.enum(["red", "green"]), z.number());
const Cache = z.map(z.string(), z.date());
const UniqueTags = z.set(z.string());
```

Important record notes:

- In current Zod, `z.record()` requires both key and value schemas
- enum-keyed records are checked exhaustively
- use `z.looseRecord()` only when non-matching keys should pass through

## Use `z.enum()` for finite choices

Prefer `z.enum()` for both string literal sets and enum-like inputs.

```ts
enum Role {
  Admin = "admin",
  Member = "member",
}

const RoleSchema = z.enum(Role);
```

Do not introduce `z.nativeEnum()` in new code.

## Be precise about nullability and defaults

- `.optional()` means `T | undefined`
- `.nullable()` means `T | null`
- `.nullish()` means `T | null | undefined`

Choose the narrowest one that matches the transport or persistence contract. Do not use `.optional()` when the actual domain value can be `null`.

`.default()` now short-circuits when input is `undefined`, so the default must match the output type.

```ts
const LengthSchema = z.string()
  .transform((value) => value.length)
  .default(0);
```

If the old pre-parse behavior is needed, prefer `.prefault()`.

Defaults inside optional object properties are now applied during parsing. Mention this when reviewing code that depends on key presence.

## Prefer `z.unknown()` over `z.any()` when possible

Use `z.unknown()` when the value is intentionally opaque but should not erase type safety.

Use `z.any()` only when you truly want to opt out of validation guarantees.

## Schema placement and reuse

- Hoist reusable schemas to module scope
- Share base schemas instead of recreating them in hot paths
- Keep domain schemas close enough to their callers that the naming remains obvious
- Export both schemas and important inferred types where reuse is likely
