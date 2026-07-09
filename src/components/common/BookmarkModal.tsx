import { useState } from 'react';
import { X } from 'lucide-react';

interface BookmarkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (bookmarkData: { title: string; url: string; category: string; isShared: boolean }) => void;
}

export const BookmarkModal = ({ isOpen, onClose, onSubmit }: BookmarkModalProps) => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState('Work');
  const [isShared, setIsShared] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !url) return;
    onSubmit({ title, url, category, isShared });
    // Reset state
    setTitle('');
    setUrl('');
    setCategory('Work');
    setIsShared(false);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-panel">
        <div className="modal-header">
          <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Add Launch Bookmark</h3>
          <button className="modal-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="form-group">
            <label className="form-label">Title</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Office Outlook"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">URL</label>
            <input
              type="url"
              className="form-input"
              placeholder="https://outlook.office.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Work">Work</option>
                <option value="Development">Development</option>
                <option value="Design">Design</option>
                <option value="Tech News">Tech News</option>
                <option value="General">General</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-checkbox-row">
              <input
                type="checkbox"
                checked={isShared}
                onChange={(e) => setIsShared(e.target.checked)}
              />
              Share with teammates dashboard
            </label>
          </div>
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save Bookmark
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default BookmarkModal;
