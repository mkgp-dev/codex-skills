# Type Inference And Advanced Patterns

Use this guide when the task involves inferred types, advanced composition, recursive data, or domain-specific type safety.

## Prefer inferred types over parallel manual types

```ts
const UserSchema = z.object({
  id: z.uuid(),
  email: z.email(),
  age: z.int().min(18),
});

type User = z.infer<typeof UserSchema>;
```

Do not maintain a separate handwritten type when the schema already defines the contract.

## Distinguish input and output types

Use `z.input<typeof Schema>` when transforms or coercion widen the accepted input. Use `z.output<typeof Schema>` or `z.infer<typeof Schema>` for the parsed output.

```ts
const EnvPort = z.coerce.number().int().min(1);

type PortInput = z.input<typeof EnvPort>;
type PortOutput = z.output<typeof EnvPort>;
```

Important current behavior:

- plain `z.coerce.*()` input defaults to `unknown`
- brands apply to output by default, not input

## Discriminated unions should be the default tagged-union choice

Prefer `z.discriminatedUnion()` when variants share a discriminator key.

```ts
const Shape = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("circle"), radius: z.number() }),
  z.object({ kind: z.literal("square"), size: z.number() }),
]);
```

This is usually easier to narrow in TypeScript and more efficient to parse than a broad union of similar object schemas.

## Use branded types for domain distinctions

Brands are useful when multiple values share the same runtime type but should not be mixed semantically.

```ts
const UserId = z.uuid().brand<"UserId">();
const Email = z.email().brand<"Email">();

type UserId = z.output<typeof UserId>;
type Email = z.output<typeof Email>;
```

Remember:

- branding is static-only
- it does not change runtime output values
- parsing is what produces branded data

## Recursive schemas belong behind `z.lazy()`

```ts
type Category = {
  name: string;
  children: Category[];
};

const CategorySchema: z.ZodType<Category> = z.lazy(() =>
  z.object({
    name: z.string(),
    children: z.array(CategorySchema),
  })
);
```

Use `z.lazy()` for self-referential or mutually recursive structures.

## Readonly and immutable intent

Use `.readonly()` when the parsed output should communicate immutability at the type level.

```ts
const ReadonlyTags = z.array(z.string()).readonly();
const ReadonlyMap = z.map(z.string(), z.date()).readonly();
```

This helps at API boundaries where mutation should be discouraged after parsing.

## Records, maps, and sets are not interchangeable

- use `z.record()` for plain object dictionaries
- use `z.map()` when the runtime shape is genuinely a `Map`
- use `z.set()` for uniqueness semantics

Prefer the runtime structure that matches the actual data consumer instead of reaching for `record` by default.

## Advanced schema guidance

- Prefer discriminated unions over broad object unions when a tag exists
- Prefer derived schemas over duplicated interfaces
- Prefer branded types for domain identity, not for every primitive
- Keep recursive schemas small and composable so errors stay readable
