# Async Actions, Persistence, And Side Effects

Use this reference when state updates depend on async work or should survive reloads.

## Async Actions

Zustand does not care whether an action is synchronous or asynchronous. The important part is to keep async work out of render and make state transitions explicit.

```ts
import { create } from 'zustand'

type User = { id: string; name: string }

type SessionStore = {
  user: User | null
  status: 'idle' | 'loading' | 'ready' | 'error'
  error: string | null
  loadUser: () => Promise<void>
  signOut: () => void
}

export const useSessionStore = create<SessionStore>()((set) => ({
  user: null,
  status: 'idle',
  error: null,
  loadUser: async () => {
    set({ status: 'loading', error: null })

    try {
      const response = await fetch('/api/me')
      if (!response.ok) throw new Error('Failed to load user')
      const user = (await response.json()) as User
      set({ user, status: 'ready' })
    } catch (error) {
      set({
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  },
  signOut: () => set({ user: null, status: 'idle', error: null }),
}))
```

Guidance:

- keep the async boundary inside an action, a service called by the action, or an event handler
- encode loading and error state only when the UI actually needs it
- avoid turning the store into a generic API client

If remote data is primarily cacheable server state, prefer a dedicated server-state library and keep Zustand for local client workflow state around it.

## Persistence

Use `persist` only for values worth restoring after a reload.

```ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

type PreferencesStore = {
  theme: 'light' | 'dark' | 'system'
  sidebarOpen: boolean
  setTheme: (theme: PreferencesStore['theme']) => void
  setSidebarOpen: (open: boolean) => void
}

export const usePreferencesStore = create<PreferencesStore>()(
  persist(
    (set) => ({
      theme: 'system',
      sidebarOpen: true,
      setTheme: (theme) => set({ theme }),
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
    }),
    {
      name: 'preferences',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        theme: state.theme,
        sidebarOpen: state.sidebarOpen,
      }),
      version: 1,
    },
  ),
)
```

Prefer:

- a unique `name`
- `partialize` so you do not persist transient flags or errors by accident
- `version` and `migrate` once the persisted shape matters over time

Avoid persisting:

- request status flags like `loading`
- server error text that should disappear on reload
- secrets unless you have an explicit security story
- values that cannot be serialized cleanly

## Hydration-Aware Persistence

For SSR-sensitive apps, especially Next.js, persistence needs extra care. The official `persist` docs expose `skipHydration` for SSR cases.

Use this when you need to delay rehydration:

```ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type AuthStore = {
  token: string | null
  hydrated: boolean
  setHydrated: (hydrated: boolean) => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      token: null,
      hydrated: false,
      setHydrated: (hydrated) => set({ hydrated }),
    }),
    {
      name: 'auth',
      skipHydration: true,
      onRehydrateStorage: () => (state, error) => {
        if (!error) state?.setHydrated(true)
      },
    },
  ),
)
```

Then trigger rehydration from a client-only boundary and gate UI that depends on persisted values until hydration is complete.

## Review Checklist

- Is async work happening outside render?
- Does the store really need to own this remote-data lifecycle?
- Is persistence scoped with `partialize`?
- Does SSR or hydration require delayed rehydration or gating?
