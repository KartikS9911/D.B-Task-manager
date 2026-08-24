import { useReducer, useState, useMemo, useCallback, useEffect } from 'react'
import { taskReducer, initialTasks } from './taskReducer'
import { useLocalStorage } from './hooks/useLocalStorage'
import { useDebounce } from './hooks/useDebounce'
import TaskForm from './components/TaskForm'
import TaskRow from './components/TaskRow'

const FILTERS = ['all', 'active', 'completed']

export default function App() {
  // Persisted task list, driven by a reducer for predictable transitions
  const [storedTasks, setStoredTasks] = useLocalStorage('ledger-tasks', initialTasks)
  const [tasks, dispatch] = useReducer(taskReducer, storedTasks)

  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 250)

  // Keep localStorage in sync whenever the reducer produces a new tasks array.
  // This is a side effect (writing to storage), so it belongs in useEffect,
  // not in render or in useMemo (which must stay a pure calculation).
  useEffect(() => {
    setStoredTasks(tasks)
  }, [tasks, setStoredTasks])

  const handleAdd = useCallback(
    (payload) => dispatch({ type: 'Upload_TASK', payload }),
    []
  )
  const handleToggle = useCallback(
    (id) => dispatch({ type: 'TOGGLE_TASK', payload: { id } }),
    []
  )
  const handleDelete = useCallback(
    (id) => dispatch({ type: 'DELETE_TASK', payload: { id } }),
    []
  )

  // Memoized so filtering/searching only recomputes when tasks, filter,
  // or the *debounced* search term actually change — not on every keystroke.
  const visibleTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        if (filter === 'active') return !task.completed
        if (filter === 'completed') return task.completed
        return true
      })
      .filter((task) =>
        task.title.toLowerCase().includes(debouncedSearch.toLowerCase())
      )
  }, [tasks, filter, debouncedSearch])

  const activeCount = useMemo(
    () => tasks.filter((t) => !t.completed).length,
    [tasks]
  )

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">
          Ledger<span>.</span>
        </h1>
        <div className="entry-count">
          <strong>{activeCount}</strong>
          open of {tasks.length}
        </div>
      </header>

      <TaskForm onAdd={handleAdd} />

      <div className="toolbar">
        <div className="filter-tabs">
          {FILTERS.map((f) => (
            <button
              key={f}
              className={`filter-tab ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
        <input
          type="text"
          className="search-input"
          placeholder="search entries..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search tasks"
        />
      </div>

      <div className="ledger">
        {visibleTasks.length === 0 ? (
          <div className="empty-state">
            <strong>No entries here</strong>
            {tasks.length === 0
              ? 'Add your first task above to get started.'
              : 'Try a different filter or search term.'}
          </div>
        ) : (
          visibleTasks.map((task, i) => (
            <TaskRow
              key={task.id}
              task={task}
              index={i}
              onToggle={handleToggle}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

      <p className="footer-note">saved locally in your browser · no server required</p>
    </div>
  )
}
