# Compat: Do Not Default to `preact/compat`

`preact/compat` is an interoperability boundary. It is useful, but it can hide tradeoffs and steer architecture toward React-ecosystem assumptions.

## Rule

- Prefer Preact-native packages when available.
- Use `preact/compat` only when an ecosystem dependency requires React APIs.
- When recommending compat, state what you gain (ecosystem compatibility) and what you risk (bundle size, mismatched assumptions, harder debugging).

## Incorrect

```tsx
// "Just install preact/compat everywhere" is not a default plan.
import React from "preact/compat";
```

## Correct

```tsx
// Use Preact APIs by default.
import { useEffect, useMemo, useState } from "preact/hooks";

// Only introduce compat where a dependency forces it, and isolate it.
// Example: third-party React-only library entrypoint isolated to one module.
import React from "preact/compat";
import { ReactWidget } from "react-only-widget";

type Props = { title: string };

export function CompatWidgetBoundary(props: Props) {
  return <ReactWidget title={props.title} />;
}
```

## When NOT to apply

- If the project is explicitly a React app using Preact only as a compatibility layer (rare; confirm intent first).
