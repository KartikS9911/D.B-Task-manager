import { CATEGORIES } from '../taskReducer'

function formatTime(timestamp) {
  const diffMs = Date.now() - timestamp
  const mins = Math.round(diffMs / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.round(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.round(hours / 24)
  return `${days}d ago`
}

export default function TaskRow({ task, index, onToggle, onDelete }) {
  const cat = CATEGORIES[task.category]

  return (
    <div className={`task-row ${task.completed ? 'completed' : ''}`}>
      <span className="task-index">{String(index + 1).padStart(2, '0')}</span>

      <div className="task-main">
        <div className="task-title-row">
          <input
            type="checkbox"
            className="task-checkbox"
            checked={task.completed}
            onChange={() => onToggle(task.id)}
            aria-label={`Mark "${task.title}" as ${task.completed ? 'active' : 'done'}`}
          />
          <span className="task-title">{task.title}</span>
        </div>
        <div className="task-meta">{formatTime(task.createdAt)}</div>
      </div>

      <span className="tag" style={{ background: cat.color }}>
        {cat.label}
      </span>

      {task.completed && <span className="stamp">DONE</span>}

      <button
        className="delete-btn"
        onClick={() => onDelete(task.id)}
        aria-label={`Delete "${task.title}"`}
      >
        ✕
      </button>
    </div>
  )
}
