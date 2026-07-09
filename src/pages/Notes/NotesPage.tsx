import { FileText, Plus } from 'lucide-react';
import type { Note } from '../../types';

import { NotesList } from './NotesList';
import { NoteEditor } from './NoteEditor';

interface NotesPageProps {
  notes: Note[];
  selectedNote: Note | null;
  setSelectedNote: (note: Note | null) => void;
  noteSavingStatus: 'saved' | 'saving' | 'dirty';
  setNoteSavingStatus: (status: 'saved' | 'saving' | 'dirty') => void;
  onCreateNote: () => void;
  onUpdateNote: () => void;
  onDeleteNote: (id: string) => void;
}

export const NotesPage = ({
  notes,
  selectedNote,
  setSelectedNote,
  noteSavingStatus,
  setNoteSavingStatus,
  onCreateNote,
  onUpdateNote,
  onDeleteNote
}: NotesPageProps) => {
  return (
    <div className="widget-container glass-panel">
      <div className="widget-header-row">
        <div>
          <h3 className="widget-title">
            <FileText size={20} color="var(--primary)" /> Workspace Notes
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Private notes are visible only to you. Shared notes sync in real-time with teammates.
          </p>
        </div>
        <button className="btn-primary" onClick={onCreateNote}>
          <Plus size={16} /> New Note
        </button>
      </div>

      <div className="notes-layout">
        {/* Left Side Note list */}
        <NotesList
          notes={notes}
          selectedNote={selectedNote}
          onSelectNote={setSelectedNote}
        />

        {/* Right Side Note Editor */}
        <NoteEditor
          selectedNote={selectedNote}
          onChangeSelectedNote={setSelectedNote}
          noteSavingStatus={noteSavingStatus}
          setNoteSavingStatus={setNoteSavingStatus}
          onUpdateNote={onUpdateNote}
          onDeleteNote={onDeleteNote}
        />
      </div>
    </div>
  );
};
export default NotesPage;
