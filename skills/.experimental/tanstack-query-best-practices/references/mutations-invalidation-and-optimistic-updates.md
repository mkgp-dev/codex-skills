# Mutations, Invalidation, And Optimistic Updates

Use this reference for writes and cache synchronization after the server changes.

## Use mutations for server writes

Creates, updates, deletes, and other side effects belong in mutations, not queries.

Keep mutation functions focused on the remote action. Put follow-up cache work in lifecycle callbacks such as `onSuccess`, `onError`, `onSettled`, or `onMutate`.

Basic invalidation example:

```tsx
const queryClient = useQueryClient()

const createTodo = useMutation({
  mutationFn: postTodo,
  onSuccess: async () => {
    await queryClient.invalidateQueries({ queryKey: ['todos'] })
  },
})
```

## Prefer targeted invalidation first

The default post-write strategy should usually be:

1. Mutate on the server
2. Invalidate the affected query family or entity
3. Let TanStack Query refetch active observers in the background

This is often simpler and safer than trying to hand-update every possible cache entry.

Prefer:

- `invalidateQueries({ queryKey: ['todos'] })`
- `invalidateQueries({ queryKey: ['todo', todoId] })`

Avoid:

- `invalidateQueries()` with no filter
- Overwriting large swaths of cache data when a targeted refetch is enough

## Use cache writes when the response is already authoritative

Prefer `setQueryData` or `setQueriesData` when:

- The mutation response contains the new canonical entity
- The user needs instant consistency across multiple subscribed surfaces
- The update is small, local, and easy to express deterministically

If the cache update is complex or brittle, fall back to invalidation.

Authoritative-response example:

```tsx
const renameTodo = useMutation({
  mutationFn: ({ id, title }: { id: string; title: string }) =>
    updateTodo(id, { title }),
  onSuccess: (updatedTodo) => {
    queryClient.setQueryData(['todo', updatedTodo.id], updatedTodo)
    queryClient.invalidateQueries({ queryKey: ['todos'] })
  },
})
```

## Choose the right optimistic strategy

Prefer optimistic UI via mutation variables when:

- Only one part of the UI needs the pending representation
- You want lower complexity and no rollback bookkeeping

Prefer cache-level optimistic updates when:

- Multiple parts of the UI must reflect the pending change immediately
- The optimistic state should behave like real query data across the app

## Cache-level optimistic update flow

When updating the cache optimistically:

1. Cancel relevant outgoing queries first
2. Snapshot the previous data
3. Write the optimistic value
4. Roll back on error if needed
5. Invalidate on settle

This avoids background refetches overwriting the optimistic value before the mutation settles.

Optimistic-update example:

```tsx
const updateTodoTitle = useMutation({
  mutationFn: ({ id, title }: { id: string; title: string }) =>
    updateTodo(id, { title }),
  onMutate: async (nextTodo, context) => {
    await context.client.cancelQueries({ queryKey: ['todo', nextTodo.id] })

    const previousTodo = context.client.getQueryData<Todo>(['todo', nextTodo.id])

    context.client.setQueryData<Todo>(['todo', nextTodo.id], (old) =>
      old ? { ...old, title: nextTodo.title } : old,
    )

    return { previousTodo }
  },
  onError: (_error, variables, snapshot, context) => {
    context.client.setQueryData(['todo', variables.id], snapshot?.previousTodo)
  },
  onSettled: async (_data, _error, variables, _snapshot, context) => {
    await context.client.invalidateQueries({ queryKey: ['todo', variables.id] })
    await context.client.invalidateQueries({ queryKey: ['todos'] })
  },
})
```

## Keep mutation state shareable when needed

Use `mutationKey` and `useMutationState` when the optimistic or pending state must be visible in a different component from the one firing the mutation.

Cross-component pending-state example:

```tsx
const saveTodo = useMutation({
  mutationKey: ['saveTodo'],
  mutationFn: updateTodo,
})

const pendingVariables = useMutationState<Todo>({
  filters: { mutationKey: ['saveTodo'], status: 'pending' },
  select: (mutation) => mutation.state.variables,
})
```

## Subtle but important detail

If the UI should remain in a pending state until invalidation/refetch work finishes, return or await the invalidation promise inside the mutation callback.

## Anti-patterns

- Copying mutation results into unrelated local state and never syncing the cache
- Broad invalidation after every mutation
- Optimistic cache writes without rollback or settle handling
- Re-creating normalized-cache complexity for simple entity updates
