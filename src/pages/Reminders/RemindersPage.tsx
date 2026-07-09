import { useState } from 'react';
import { Clock, Plus } from 'lucide-react';
import type { Reminder } from '../../types';

import { ReminderItem } from './ReminderItem';

interface RemindersPageProps {
  reminders: Reminder[];
  onCreateReminder: (text: string, time: string) => void;
  onToggleReminder: (id: string) => void;
  onDeleteReminder: (id: string) => void;
}

export const RemindersPage = ({
  reminders,
  onCreateReminder,
  onToggleReminder,
  onDeleteReminder
}: RemindersPageProps) => {
  const [newReminderText, setNewReminderText] = useState('');
  const [newReminderTime, setNewReminderTime] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReminderText || !newReminderTime) return;
    onCreateReminder(newReminderText, newReminderTime);
    setNewReminderText('');
    setNewReminderTime('');
  };

  return (
    <div className="widget-container glass-panel">
      <div>
        <h3 className="widget-title">
          <Clock size={20} color="var(--primary)" /> Task Reminders
        </h3>
        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
          Setup alert triggers for deadlines, team presentations or meetings.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
        <div className="form-group">
          <label className="form-label">Reminder Text</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Standup presentation preparation"
            value={newReminderText}
            onChange={(e) => setNewReminderText(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Trigger Time</label>
          <input
            type="datetime-local"
            className="form-input"
            value={newReminderTime}
            onChange={(e) => setNewReminderTime(e.target.value)}
          />
        </div>
        <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start' }}>
          <Plus size={14} /> Add Reminder
        </button>
      </form>

      <div className="reminders-list" style={{ marginTop: '20px' }}>
        {reminders.map((rem) => (
          <ReminderItem
            key={rem.id}
            reminder={rem}
            onToggle={onToggleReminder}
            onDelete={onDeleteReminder}
          />
        ))}
        {reminders.length === 0 && (
          <div className="empty-state">
            <span className="empty-state-icon">🔔</span>
            <span>No reminders scheduled for this profile.</span>
          </div>
        )}
      </div>
    </div>
  );
};
export default RemindersPage;
