# Signals: Choose Signals vs Hooks Deliberately

Signals are great for shared, reactive values without prop drilling, but they are not a blanket replacement for component state.

## Rule

- Use hooks (`useState`, `useReducer`) for local, component-owned state.
- Use signals when multiple components need the same reactive value and you want to avoid wiring it through props/context.
- Avoid mixing signals and hook state to represent the same source of truth.

## Incorrect

```tsx
import { signal } from "@preact/signals";

const theme = signal<"light" | "dark">("light");

export function ThemeToggle() {
  const [localTheme, setLocalTheme] = useState(theme.value);

  return (
    <button
      onClick={() => {
        const next = localTheme === "light" ? "dark" : "light";
        setLocalTheme(next);
        theme.value = next;
      }}
    >
      Toggle
    </button>
  );
}
```

## Correct

```tsx
import { signal } from "@preact/signals";

export const theme = signal<"light" | "dark">("light");

export function ThemeToggle() {
  return (
    <button
      onClick={() => {
        theme.value = theme.value === "light" ? "dark" : "light";
      }}
    >
      Toggle
    </button>
  );
}
```

## When NOT to apply

- If state is purely local to one component and never shared, prefer hooks.
