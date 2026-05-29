# SSR: Avoid Hydration Mismatches

Hydration mismatches happen when server-rendered markup differs from the first client render.

## Rule

- Keep server and first client render deterministic.
- Move client-only logic (time, random, `window`, storage) into effects and render a stable placeholder.

## Incorrect

```tsx
export function Now() {
  return <p>{new Date().toISOString()}</p>;
}
```

## Correct

```tsx
export function Now() {
  const [now, setNow] = useState<string | null>(null);

  useEffect(() => {
    setNow(new Date().toISOString());
  }, []);

  return <p>{now ?? "..."}</p>;
}
```

## When NOT to apply

- Pure CSR apps with no server-rendered markup.
