import type { Task } from '../../types';

import { TaskCard } from './TaskCard';

interface KanbanColumnProps {
  title: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  statusColor: string;
  tasks: Task[];
  onDelete: (id: string) => void;
  onStatusMove: (task: Task, nextStatus: string) => void;
}

export const KanbanColumn = ({
  title,
  status,
  statusColor,
  tasks,
  onDelete,
  onStatusMove
}: KanbanColumnProps) => {
  const filteredTasks = tasks.filter((t) => t.status === status);

  return (
    <div className="kanban-column">
      <div className="column-header">
        <span className="column-title">
          <span className="status-dot" style={{ backgroundColor: statusColor, position: 'relative' }} /> {title}
        </span>
        <span className="column-count">{filteredTasks.length}</span>
      </div>
      <div className="tasks-list">
        {filteredTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onDelete={onDelete}
            onStatusMove={onStatusMove}
          />
        ))}
      </div>
    </div>
  );
};
