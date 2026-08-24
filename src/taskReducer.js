export const CATEGORIES = {
  work: { label: 'Work', color: '#B37F23' },
  personal: { label: 'Personal', color: '#7C9885' },
  urgent: { label: 'Urgent', color: '#B4553F' },
  learning: { label: 'Learning', color: '#4E7AB5' },
}

export const initialTasks = [
  {
    id: 't1',
    title: 'Prep for system design round',
    category: 'urgent',
    completed: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 5,
  },
  {
    id: 't2',
    title: 'Review React hooks rules',
    category: 'learning',
    completed: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 24,
  },
  {
    id: 't3',
    title: 'Book flight tickets',
    category: 'personal',
    completed: false,
    createdAt: Date.now() - 1000 * 60 * 30,
  },
]

/**
 * useReducer instead of scattered useState: adding/toggling/deleting tasks
 * are all "the same kind" of update (transform the tasks array based on an
 * action), so a reducer keeps that logic in one auditable place instead of
 * spread across multiple setState calls with copy-paste array spreading.
 */
export function taskReducer(state, action) {
  switch (action.type) {
    case 'ADD_TASK': {
      const title = action.payload.title.trim()
      if (!title) return state
      const newTask = {
        id: crypto.randomUUID(),
        title,
        category: action.payload.category,
        completed: false,
        createdAt: Date.now(),
      }
      return [newTask, ...state]
    }

    case 'TOGGLE_TASK':
      return state.map((task) =>
        task.id === action.payload.id
          ? { ...task, completed: !task.completed }
          : task
      )

    case 'DELETE_TASK':
      return state.filter((task) => task.id !== action.payload.id)

    default:
      return state
  }
}
