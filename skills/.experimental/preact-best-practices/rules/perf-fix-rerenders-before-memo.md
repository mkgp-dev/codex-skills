# Performance: Fix Rerenders Before Reaching for Memoization

Memoization is easy to misuse. Most rerender problems come from unstable props and over-broad subscriptions.

## Rule

- First identify what changes are triggering rerenders (props, signals, context, parent state).
- Stabilize object/array props with `useMemo` only when needed.
- Prefer narrowing what a component reads over memoizing everything.

## Incorrect

```tsx
export function List(props: { items: string[] }) {
  const style = { padding: 8 }; // new object every render
  return (
    <ul style={style}>
      {props.items.map((x) => (
        <li key={x}>{x}</li>
      ))}
    </ul>
  );
}
```

## Correct

```tsx
export function List(props: { items: string[] }) {
  const style = useMemo(() => ({ padding: 8 }), []);
  return (
    <ul style={style}>
      {props.items.map((x) => (
        <li key={x}>{x}</li>
      ))}
    </ul>
  );
}
```

## When NOT to apply

- If the user has profiling data showing a real hot path and memoization is demonstrably needed.
