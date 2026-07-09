import type { Note } from '../../types';


interface NotesListProps {
  notes: Note[];
  selectedNote: Note | null;
  onSelectNote: (note: Note) => void;
}

export const NotesList = ({ notes, selectedNote, onSelectNote }: NotesListProps) => {
  return (
    <div className="notes-list">
      {notes.map((note) => (
        <div
          key={note.id}
          className={`note-item ${selectedNote?.id === note.id ? 'active' : ''}`}
          onClick={() => onSelectNote(note)}
        >
          <div className="note-item-title">{note.title}</div>
          <div className="note-item-meta">
            <span>By {note.user?.name || 'Teammate'}</span>
            {note.isShared && <span className="note-shared-badge">Shared</span>}
          </div>
        </div>
      ))}
    </div>
  );
};
