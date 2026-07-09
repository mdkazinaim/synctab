import { Trash2 } from 'lucide-react';
import type { Task } from '../../types';


interface TaskCardProps {
  task: Task;
  onDelete: (id: string) => void;
  onStatusMove: (task: Task, nextStatus: string) => void;
}

export const TaskCard = ({ task, onDelete, onStatusMove }: TaskCardProps) => {
  return (
    <div key={task.id} className="task-card">
      <button
        style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          border: 'none',
          background: 'transparent',
          color: 'var(--text-muted)',
          cursor: 'pointer'
        }}
        onClick={() => onDelete(task.id)}
      >
        <Trash2 size={12} />
      </button>
      <div className="task-card-title" style={task.status === 'DONE' ? { textDecoration: 'line-through' } : undefined}>
        {task.title}
      </div>
      {task.description && <div className="task-card-desc">{task.description}</div>}
      <div className="task-card-footer">
        <span className={`task-priority-badge ${task.priority.toLowerCase()}`}>{task.priority}</span>
        <div className="task-assignee-box">
          {task.assignee ? (
            <div className={`task-assignee-avatar ${task.assignee.avatar}`} title={`Assigned to ${task.assignee.name}`}>
              {task.assignee.name.charAt(0)}
            </div>
          ) : (
            <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Unassigned</span>
          )}

          {task.status === 'TODO' && (
            <button
              className="btn-secondary"
              style={{ padding: '2px 6px', fontSize: '9px' }}
              onClick={() => onStatusMove(task, 'IN_PROGRESS')}
            >
              Start
            </button>
          )}

          {task.status === 'IN_PROGRESS' && (
            <div style={{ display: 'flex', gap: '4px' }}>
              <button
                className="btn-secondary"
                style={{ padding: '2px 6px', fontSize: '9px' }}
                onClick={() => onStatusMove(task, 'TODO')}
              >
                Reset
              </button>
              <button
                className="btn-primary"
                style={{ padding: '2px 6px', fontSize: '9px' }}
                onClick={() => onStatusMove(task, 'DONE')}
              >
                Finish
              </button>
            </div>
          )}

          {task.status === 'DONE' && (
            <button
              className="btn-secondary"
              style={{ padding: '2px 6px', fontSize: '9px' }}
              onClick={() => onStatusMove(task, 'IN_PROGRESS')}
            >
              Reopen
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
