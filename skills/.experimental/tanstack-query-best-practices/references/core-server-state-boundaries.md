# Core Server-State Boundaries

Start here when the main question is "Should this live in TanStack Query at all?"

## Put data in TanStack Query when it is server state

Use TanStack Query when the data:

- Lives on a server or remote API
- Must be fetched, refetched, invalidated, or synchronized over time
- Can be changed by other actors outside the current component tree
- Benefits from caching, deduplication, retries, and background refresh

Examples:

- Lists, detail records, search results, dashboard metrics, and server-backed feature flags
- Mutation lifecycles for creates, updates, deletes, and other remote side effects
- Paginated and infinite feeds

## Keep data out of TanStack Query when it is local client state

Prefer local state, router state, or a client-state store for:

- Modal visibility, tabs, accordions, and wizard steps
- Form drafts before submit
- Drag state, hover state, selection state, and temporary UI affordances
- Purely derived values that can be recomputed from other state

Do not introduce TanStack Query just because a component wants asynchronous code. If the data is not shared server state, the cache is usually the wrong abstraction.

## Treat the query cache as the source of truth

Avoid copying query data into another store just to "make it easier to use." That usually creates stale mirrors, duplicate invalidation rules, and unnecessary effect code.

Prefer:

- Reading server data directly from queries
- Passing local filters, sort choices, or route params into the query key
- Deriving UI state from query data in render or selectors

Push back on patterns like:

- `useEffect(() => setStore(query.data), [query.data])`
- Copying fetched lists into Zustand/Redux only to keep them "globally available"
- Maintaining both `useState` data and query cache data for the same resource

## Separate server state from edit state

If the user is editing a record:

- Keep the canonical fetched value in the query cache
- Keep transient unsaved edits in local form state or draft state
- Submit the draft through a mutation
- Invalidate or patch the affected queries after the mutation settles

This gives a clean boundary between fetched truth and local draft intent.

Example:

```tsx
function EditUserPage({ userId }: { userId: string }) {
  const userQuery = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  })

  const form = useForm<UserDraft>({
    values: userQuery.data
      ? {
          name: userQuery.data.name,
          email: userQuery.data.email,
        }
      : undefined,
  })

  const queryClient = useQueryClient()
  const saveUser = useMutation({
    mutationFn: (draft: UserDraft) => updateUser(userId, draft),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['user', userId] }),
  })

  return <UserForm form={form} onSubmit={saveUser.mutate} />
}
```

Keep the fetched user in the query cache and the unsaved draft in form state. Do not mirror the fetched record into another global client-state store unless there is a separate non-form workflow that truly needs it.

## Review checklist

- Is this actually remote shared data?
- Is any server data being mirrored into local or global client state without a strong reason?
- Are filters, ids, cursors, or auth-scoped values part of the query identity instead of hidden in closures?
- Is the user trying to use TanStack Query as a generic app-state container?

## Anti-patterns

- Using TanStack Query for every state problem in the app
- Using it as a replacement for form state or view state
- Normalizing and hand-maintaining a large client-side entity graph unless there is a very specific need
- Copying query data into another state layer and then forgetting which source is authoritative
