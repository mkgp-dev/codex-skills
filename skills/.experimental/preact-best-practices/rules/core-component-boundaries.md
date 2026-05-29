# Core: Keep Component Boundaries Clear

Clear component boundaries reduce rerender churn and make code easier to test and refactor.

## Rule

- Prefer small, focused components with explicit props.
- Keep "data fetching / orchestration" separate from "presentation" when the UI gets complex.

## Incorrect

```tsx
type Props = { userId: string };

export function UserPanel(props: Props) {
  const [user, setUser] = useState<{ name: string } | null>(null);

  useEffect(() => {
    fetch(`/api/users/${props.userId}`)
      .then((r) => r.json())
      .then((data) => setUser(data));
  }, [props.userId]);

  return (
    <div>
      <h2>User</h2>
      <p>{user?.name ?? "Loading..."}</p>
    </div>
  );
}
```

## Correct

```tsx
type User = { name: string };
type ViewProps = { user: User | null };

function UserPanelView(props: ViewProps) {
  return (
    <div>
      <h2>User</h2>
      <p>{props.user?.name ?? "Loading..."}</p>
    </div>
  );
}

type ContainerProps = { userId: string };

export function UserPanel(props: ContainerProps) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    let alive = true;
    fetch(`/api/users/${props.userId}`)
      .then((r) => r.json())
      .then((data) => {
        if (alive) setUser(data);
      });
    return () => {
      alive = false;
    };
  }, [props.userId]);

  return <UserPanelView user={user} />;
}
```

## When NOT to apply

- Small one-off UI where splitting would add indirection without reuse.
