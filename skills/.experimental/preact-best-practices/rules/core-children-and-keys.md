# Core: Treat Children and Keys as Part of API

Stable keys prevent subtle UI bugs in lists. Stable children APIs keep composition predictable.

## Rule

- Use stable keys derived from domain identity, not array index.
- Prefer explicit children props (`children`, render props) over hidden coupling.

## Incorrect

```tsx
export function TodoList(props: { items: { id: string; title: string }[] }) {
  return (
    <ul>
      {props.items.map((it, idx) => (
        <li key={idx}>{it.title}</li>
      ))}
    </ul>
  );
}
```

## Correct

```tsx
export function TodoList(props: { items: { id: string; title: string }[] }) {
  return (
    <ul>
      {props.items.map((it) => (
        <li key={it.id}>{it.title}</li>
      ))}
    </ul>
  );
}
```

## When NOT to apply

- Truly static lists that never reorder, filter, or insert items (rare in apps).
