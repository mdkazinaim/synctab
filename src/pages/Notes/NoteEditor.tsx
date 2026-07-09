import { Save, Trash2 } from 'lucide-react';
import type { Note } from '../../types';


interface NoteEditorProps {
  selectedNote: Note | null;
  onChangeSelectedNote: (note: Note) => void;
  noteSavingStatus: 'saved' | 'saving' | 'dirty';
  setNoteSavingStatus: (status: 'saved' | 'saving' | 'dirty') => void;
  onUpdateNote: () => void;
  onDeleteNote: (id: string) => void;
}

export const NoteEditor = ({
  selectedNote,
  onChangeSelectedNote,
  noteSavingStatus,
  setNoteSavingStatus,
  onUpdateNote,
  onDeleteNote
}: NoteEditorProps) => {
  if (!selectedNote) {
    return (
      <div className="empty-state" style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <span className="empty-state-icon">📝</span>
        <span>Select or create a note on the left panel to begin editing.</span>
      </div>
    );
  }

  return (
    <div className="notes-editor">
      <input
        type="text"
        className="note-title-input"
        value={selectedNote.title}
        onChange={(e) => {
          onChangeSelectedNote({ ...selectedNote, title: e.target.value });
          setNoteSavingStatus('dirty');
        }}
      />
      <textarea
        className="note-textarea"
        placeholder="Write note contents... Supports standard text formatting."
        value={selectedNote.content}
        onChange={(e) => {
          onChangeSelectedNote({ ...selectedNote, content: e.target.value });
          setNoteSavingStatus('dirty');
        }}
      />
      <div className="note-editor-footer">
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <label className="form-checkbox-row">
            <input
              type="checkbox"
              checked={selectedNote.isShared}
              onChange={(e) => {
                onChangeSelectedNote({ ...selectedNote, isShared: e.target.checked });
                setNoteSavingStatus('dirty');
              }}
            />
            Share with team
          </label>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            {noteSavingStatus === 'saving' && 'Saving updates...'}
            {noteSavingStatus === 'saved' && 'Draft Saved'}
            {noteSavingStatus === 'dirty' && 'Unsaved changes'}
          </span>
          <button className="btn-primary" onClick={onUpdateNote}>
            <Save size={14} /> Save Note
          </button>
          <button
            className="btn-secondary"
            style={{ background: 'rgba(244, 63, 94, 0.1)', color: 'var(--color-meeting)', border: '1px solid rgba(244, 63, 94, 0.2)' }}
            onClick={() => onDeleteNote(selectedNote.id)}
          >
            <Trash2 size={14} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
};
