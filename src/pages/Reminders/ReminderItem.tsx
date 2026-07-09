import { Check, Trash2 } from 'lucide-react';
import type { Reminder } from '../../types';


interface ReminderItemProps {
  reminder: Reminder;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const ReminderItem = ({ reminder, onToggle, onDelete }: ReminderItemProps) => {
  return (
    <div className="reminder-item">
      <div className="reminder-content">
        <button
          className={`reminder-checkbox ${reminder.isCompleted ? 'checked' : ''}`}
          onClick={() => onToggle(reminder.id)}
        >
          {reminder.isCompleted && <Check size={12} />}
        </button>
        <div>
          <div className={`reminder-text ${reminder.isCompleted ? 'completed' : ''}`}>
            {reminder.text}
          </div>
          <div className="reminder-date">
            Scheduled: {new Date(reminder.dueDate).toLocaleString()}
          </div>
        </div>
      </div>
      <button className="reminder-delete-btn" onClick={() => onDelete(reminder.id)}>
        <Trash2 size={14} />
      </button>
    </div>
  );
};
