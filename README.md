# Ledger — Task Manager

A local-first task manager built with React. Designed as a fresher-interview
project: small in scope, but every decision in here is deliberate and easy
to defend in a follow-up conversation.

## Run it

```bash
npm install
npm run dev
```

Then open the printed localhost URL.

## What it does

- Add, complete, and delete tasks
- Categorize tasks (Work / Personal / Urgent / Learning) with color tags
- Filter by All / Active / Completed
- Search by title
- Everything persists to `localStorage` — refresh the page, your tasks stay

## Why it's built this way (interview talking points)

**`useReducer` over multiple `useState` calls** (`src/taskReducer.js`)
Adding, toggling, and deleting are all "transform the tasks array based on
an action" — that's exactly the shape a reducer is for. It keeps the update
logic in one place instead of spread across handler functions, and makes
every state transition easy to test in isolation.

**`useMemo` for the filtered list** (`src/App.jsx`)
`visibleTasks` is recalculated only when `tasks`, `filter`, or the
*debounced* search term change — not on every render caused by unrelated
state (like typing before the debounce fires).

**`useDebounce` custom hook** (`src/hooks/useDebounce.js`)
Search re-filters the list 250ms after the user stops typing, instead of on
every keystroke. Small list here, but this is the pattern you'd point to
when asked "how would you handle this with a real API or 10,000 rows."

**`useLocalStorage` custom hook** (`src/hooks/useLocalStorage.js`)
Lazy-initializes from storage (so we don't read it on every render) and
persists via `useEffect` (a side effect, correctly kept out of render and
out of `useMemo`, which must stay pure).

**Component split**
`TaskForm` and `TaskRow` are presentational and take callbacks as props —
no direct state mutation, no prop drilling beyond one level. Handlers
passed down are wrapped in `useCallback` so child components don't
re-render on every unrelated parent state change.

## Likely follow-up questions and where to look

- "Why not Redux?" — state is shallow and local to one page; Context/Redux
  would add ceremony without solving a real problem here.
- "How would this scale to 10,000 tasks?" — virtualize the list
  (e.g. `react-window`) so only visible rows mount.
- "How do you avoid stale closures in the reducer?" — the reducer only
  reads from its own `state` and `action` arguments, never outer scope.
