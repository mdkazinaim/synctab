import { useState } from 'react';
import { X } from 'lucide-react';

interface CustomPageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string) => void;
}

export const CustomPageModal = ({ isOpen, onClose, onCreate }: CustomPageModalProps) => {
  const [newCustomPageName, setNewCustomPageName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomPageName.trim()) return;
    onCreate(newCustomPageName.trim());
    setNewCustomPageName('');
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-panel" style={{ maxWidth: '400px' }}>
        <div className="modal-header">
          <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Create Custom Page</h3>
          <button className="modal-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label">Page Name</label>
            <input
              type="text"
              required
              className="form-input"
              placeholder="e.g., Work Dashboard, Personal, Finance"
              value={newCustomPageName}
              onChange={(e) => setNewCustomPageName(e.target.value)}
              autoFocus
            />
          </div>
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Create Page
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default CustomPageModal;
