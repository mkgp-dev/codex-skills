# Hooks: Derive State Instead of Synchronizing It

Duplicating derived values into state creates bugs and unnecessary rerenders.

## Rule

- Prefer derived values computed from props/state.
- Use state only for values that change independently (draft input, UI toggles, async state).

## Incorrect

```tsx
export function FullName(props: { first: string; last: string }) {
  const [full, setFull] = useState(`${props.first} ${props.last}`);

  useEffect(() => {
    setFull(`${props.first} ${props.last}`);
  }, [props.first, props.last]);

  return <p>{full}</p>;
}
```

## Correct

```tsx
export function FullName(props: { first: string; last: string }) {
  const full = `${props.first} ${props.last}`;
  return <p>{full}</p>;
}
```

## When NOT to apply

- When the user edits a derived value as a draft that can diverge from the source.
