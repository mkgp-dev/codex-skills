# Signals: Avoid Double Sources of Truth

The fastest way to create Preact state bugs is to keep the "same" value in more than one place.

## Rule

- Pick one owner for a value (signal OR hook state OR derived computation).
- If you need a derived value, compute it from the owner at render time.

## Incorrect

```tsx
import { signal } from "@preact/signals";

const count = signal(0);

export function Counter() {
  const [local, setLocal] = useState(count.value);

  return (
    <div>
      <button onClick={() => setLocal((x) => x - 1)}>-</button>
      <span>{count.value}</span>
      <button onClick={() => (count.value += 1)}>+</button>
    </div>
  );
}
```

## Correct

```tsx
import { signal } from "@preact/signals";

const count = signal(0);

export function Counter() {
  return (
    <div>
      <button onClick={() => (count.value -= 1)}>-</button>
      <span>{count.value}</span>
      <button onClick={() => (count.value += 1)}>+</button>
    </div>
  );
}
```

## When NOT to apply

- When you intentionally have a draft value that can diverge from the saved value (explicitly call it a draft).
