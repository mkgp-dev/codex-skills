# Hooks: Effects Must Be Dependency-Correct and Clean Up

Incorrect effect dependencies cause stale closures, repeated requests, and memory leaks.

## Rule

- Include every value used by an effect that can change.
- Clean up subscriptions, timers, and in-flight work.
- Prefer event handlers over effects when you’re responding to user actions.

## Incorrect

```tsx
export function Clock() {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    setInterval(() => setNow(Date.now()), 1000);
  }, []);

  return <time>{new Date(now).toISOString()}</time>;
}
```

## Correct

```tsx
export function Clock() {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  return <time>{new Date(now).toISOString()}</time>;
}
```

## When NOT to apply

- If you can compute a value during render without side effects, avoid an effect entirely.
