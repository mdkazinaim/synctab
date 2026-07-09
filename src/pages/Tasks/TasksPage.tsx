import { useState } from 'react';
import { CheckSquare, Plus } from 'lucide-react';
import type { Task, User } from '../../types';

import { KanbanColumn } from './KanbanColumn';
import { TaskModal } from './TaskModal';

interface TasksPageProps {
  tasks: Task[];
  users: User[];
  onCreateTask: (taskData: { title: string; description: string; priority: string; assigneeId: string; dueDate: string }) => void;
  onStatusMove: (task: Task, nextStatus: string) => void;
  onDeleteTask: (id: string) => void;
}

export const TasksPage = ({
  tasks,
  users,
  onCreateTask,
  onStatusMove,
  onDeleteTask
}: TasksPageProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="widget-container glass-panel">
      <div className="widget-header-row">
        <div>
          <h3 className="widget-title">
            <CheckSquare size={20} color="var(--primary)" /> Team Project Kanban
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Assign issues to teammates, prioritize workload, and move tasks across boards.
          </p>
        </div>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={16} /> Create Task
        </button>
      </div>

      <div className="kanban-board">
        <KanbanColumn
          title="TODO"
          status="TODO"
          statusColor="var(--color-todo)"
          tasks={tasks}
          onDelete={onDeleteTask}
          onStatusMove={onStatusMove}
        />

        <KanbanColumn
          title="IN PROGRESS"
          status="IN_PROGRESS"
          statusColor="var(--color-inprogress)"
          tasks={tasks}
          onDelete={onDeleteTask}
          onStatusMove={onStatusMove}
        />

        <KanbanColumn
          title="DONE"
          status="DONE"
          statusColor="var(--color-done)"
          tasks={tasks}
          onDelete={onDeleteTask}
          onStatusMove={onStatusMove}
        />
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={(data) => {
          onCreateTask(data);
          setIsModalOpen(false);
        }}
        users={users}
      />
    </div>
  );
};
export default TasksPage;
