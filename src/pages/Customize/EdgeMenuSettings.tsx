import { Layout, Bookmark as BookmarkIcon, FileText, CheckSquare, Clock, MessageSquare } from 'lucide-react';

interface EdgeMenuSettingsProps {
  visibleTabs: {
    bookmarks: boolean;
    notes: boolean;
    tasks: boolean;
    reminders: boolean;
    chat: boolean;
  };
  onToggleTab: (key: 'bookmarks' | 'notes' | 'tasks' | 'reminders' | 'chat', value: boolean) => void;
}

export const EdgeMenuSettings = ({ visibleTabs, onToggleTab }: EdgeMenuSettingsProps) => {
  return (
    <div style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid var(--panel-border)', borderRadius: 'var(--radius-md)', padding: '16px' }}>
      <h4 style={{ fontSize: '13px', fontWeight: 700, marginBottom: '6px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <Layout size={14} color="var(--primary)" /> Configure Edge Menus
      </h4>
      <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '10px' }}>
        Toggle visibility of vertical navigation items placed at screen boundaries.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
        <label className="form-checkbox-row" style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '6px 10px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--panel-border)', borderRadius: '6px' }}>
          <input
            type="checkbox"
            checked={visibleTabs.bookmarks}
            onChange={(e) => onToggleTab('bookmarks', e.target.checked)}
            style={{ cursor: 'pointer', width: '14px', height: '14px', accentColor: 'var(--primary)' }}
          />
          <span style={{ fontSize: '12px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <BookmarkIcon size={12} /> Bookmarks
          </span>
        </label>
        <label className="form-checkbox-row" style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '6px 10px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--panel-border)', borderRadius: '6px' }}>
          <input
            type="checkbox"
            checked={visibleTabs.notes}
            onChange={(e) => onToggleTab('notes', e.target.checked)}
            style={{ cursor: 'pointer', width: '14px', height: '14px', accentColor: 'var(--primary)' }}
          />
          <span style={{ fontSize: '12px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <FileText size={12} /> Notes
          </span>
        </label>
        <label className="form-checkbox-row" style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '6px 10px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--panel-border)', borderRadius: '6px' }}>
          <input
            type="checkbox"
            checked={visibleTabs.tasks}
            onChange={(e) => onToggleTab('tasks', e.target.checked)}
            style={{ cursor: 'pointer', width: '14px', height: '14px', accentColor: 'var(--primary)' }}
          />
          <span style={{ fontSize: '12px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckSquare size={12} /> Tasks
          </span>
        </label>
        <label className="form-checkbox-row" style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '6px 10px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--panel-border)', borderRadius: '6px' }}>
          <input
            type="checkbox"
            checked={visibleTabs.reminders}
            onChange={(e) => onToggleTab('reminders', e.target.checked)}
            style={{ cursor: 'pointer', width: '14px', height: '14px', accentColor: 'var(--primary)' }}
          />
          <span style={{ fontSize: '12px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={12} /> Reminders
          </span>
        </label>
        <label className="form-checkbox-row" style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '6px 10px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--panel-border)', borderRadius: '6px' }}>
          <input
            type="checkbox"
            checked={visibleTabs.chat}
            onChange={(e) => onToggleTab('chat', e.target.checked)}
            style={{ cursor: 'pointer', width: '14px', height: '14px', accentColor: 'var(--primary)' }}
          />
          <span style={{ fontSize: '12px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <MessageSquare size={12} /> Live Chat
          </span>
        </label>
      </div>
    </div>
  );
};
export default EdgeMenuSettings;
