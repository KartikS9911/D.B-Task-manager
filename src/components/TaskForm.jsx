import { useState } from 'react'
import { CATEGORIES } from '../taskReducer'

export default function TaskForm({ onAdd }) {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('work')

  function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim()) return
    onAdd({ title, category })
    setTitle('')
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="task-form-row">
        <input
          type="text"
          placeholder="Add a new entry..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          aria-label="Task title"
        />
        <button type="submit" className="add-btn" disabled={!title.trim()}>
          Add
        </button>
      </div>
      <div className="category-select">
        {Object.entries(CATEGORIES).map(([key, { label, color }]) => (
          <button
            type="button"
            key={key}
            className={`category-chip ${category === key ? 'active' : ''}`}
            style={category === key ? { background: color } : {}}
            onClick={() => setCategory(key)}
          >
            {label}
          </button>
        ))}
      </div>
    </form>
  )
}
