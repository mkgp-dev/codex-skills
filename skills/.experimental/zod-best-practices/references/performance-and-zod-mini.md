# Performance And Zod Mini

Use this guide when performance, bundle size, or TypeScript compiler behavior is part of the task.

## Default to regular `zod`

For most applications, regular `zod` is the right recommendation. It has better ergonomics and is the default library intended for the vast majority of use cases.

Do not recommend `zod/mini` just because it exists.

## Recommend Zod Mini only for real bundle constraints

`zod/mini` is useful when:

- the application is client-side and bundle-sensitive
- tree-shaking matters materially
- the team accepts a more functional and less discoverable API

Regular Zod:

```ts
z.string().min(5).max(10).trim();
```

Zod Mini:

```ts
import * as z from "zod/mini";

z.string().check(z.minLength(5), z.maxLength(10), z.trim());
```

If bundle size is not the real constraint, prefer regular `zod`.

## Reuse schemas instead of recreating them

Hoist schemas to module scope unless the shape truly depends on runtime values.

Good:

```ts
export const UserSchema = z.object({
  id: z.uuid(),
  email: z.email(),
});
```

Bad:

```ts
function validateUser(input: unknown) {
  const schema = z.object({
    id: z.uuid(),
    email: z.email(),
  });

  return schema.safeParse(input);
}
```

## Prefer TypeScript-friendly composition

Modern Zod significantly improved TypeScript performance, but shape spreading is still often the best choice for larger object composition.

General order of preference:

1. shape spreading for large composed objects
2. `.extend()` for straightforward additions
3. avoid `.merge()` in new code

## Validate at the boundary once

Repeatedly parsing the same object wastes time and complicates control flow. Validate once at the edge, then pass validated data inward.

## Large collections

For large arrays or datasets:

- avoid dynamically rebuilding the same schema inside loops
- parse each item or batch with a reused schema
- do not over-engineer partial validation unless profiling shows a real bottleneck

## Performance guidance style

Keep performance advice grounded:

- favor clarity unless there is a measurable hot path
- do not oversell bundle-size wins in backend code
- only recommend Zod Mini when the tradeoff is justified
