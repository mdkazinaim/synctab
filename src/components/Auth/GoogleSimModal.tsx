import { X } from 'lucide-react';

interface GoogleSimModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAccount: (email: string, name: string, avatar: string) => void;
}

export const GoogleSimModal = ({ isOpen, onClose, onSelectAccount }: GoogleSimModalProps) => {
  if (!isOpen) return null;

  const simAccounts = [
    { name: 'Md Naim', email: 'naimdev@gmail.com', avatar: 'avatar-2' },
    { name: 'John Doe', email: 'johndoe@gmail.com', avatar: 'avatar-5' },
    { name: 'Google Workspace Demo', email: 'teammate@company.com', avatar: 'avatar-1' }
  ];

  return (
    <div className="modal-overlay" style={{ zIndex: 9999 }}>
      <div className="modal-content glass-panel" style={{ maxWidth: '380px', padding: '20px' }}>
        <div className="modal-header" style={{ marginBottom: '14px' }}>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 800 }}>Sign in with Google</h3>
            <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Choose a simulated Google Account to log in
            </p>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={16} />
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {simAccounts.map((acct) => (
            <button
              key={acct.email}
              onClick={() => onSelectAccount(acct.email, acct.name, acct.avatar)}
              className="google-sim-row"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                border: '1px solid var(--panel-border)',
                borderRadius: '8px',
                background: 'rgba(255,255,255,0.015)',
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%',
                transition: 'all 0.2s'
              }}
            >
              <div className={`avatar-circle ${acct.avatar}`} style={{ width: '32px', height: '32px', fontSize: '12px', flexShrink: 0 }}>
                {acct.name.charAt(0)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>{acct.name}</div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{acct.email}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
export default GoogleSimModal;
