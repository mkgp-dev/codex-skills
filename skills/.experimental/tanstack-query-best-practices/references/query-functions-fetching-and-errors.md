# Query Functions, Fetching, And Errors

Use this reference when the correctness problem is inside the query function or how its result is consumed.

## Query functions must return a promise and throw on failure

The query function should either:

- Resolve the data
- Throw an error or return a rejected promise

If the transport does not throw by default, do it yourself.

With `fetch`, check `response.ok` and throw when needed. Do not quietly return error payloads as successful query data unless the API contract is explicitly modeled that way.

## Use the provided context

The query function context can supply:

- `queryKey`
- `signal`
- `client`
- `meta`
- `pageParam` for infinite queries

Prefer using the provided abort signal with transports that support cancellation. This keeps outdated requests from continuing unnecessarily.

## Avoid hidden dependencies

A query function that closes over changing values without reflecting them in the key is a cache bug waiting to happen.

Prefer either:

- Query functions that read ids or filters from `queryKey`
- Closures whose changing values are still present in the key

## Render status by intent

Shared guidance:

- Use the no-data state for first render or missing data
- Use the error state for terminal failures
- Use the background-fetch state separately from first-load state

In React-family v5 docs, that usually means:

- `isPending` or `status === 'pending'` for "no data yet"
- `isError` for failure
- `isFetching` for any active fetch, including background refetch

Do not confuse a background refetch with a blank-screen loading state.

## Keep result consumption narrow

Prefer selecting or reading only the fields a component actually needs.

In React and Preact especially:

- Avoid object rest destructuring on query results if you care about tracked subscriptions
- Avoid placing the entire query result object in hook dependency arrays
- Destructure the needed fields instead

## Select carefully

`select` is useful for stable derived views of server data, but it should not become an excuse to hide weak boundaries.

Prefer:

- Lightweight transformations that are still meaningfully tied to the fetched resource

Avoid:

- Using `select` to smuggle large local view-model systems into the cache layer

## Review checklist

- Does the query function throw on failure?
- Does it use the provided abort signal when possible?
- Are changing dependencies reflected in the key?
- Is the UI distinguishing first-load state from background fetching?
- Is the consuming code subscribing only to the fields it needs?
