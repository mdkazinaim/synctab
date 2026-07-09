import { useState } from 'react';
import { Shield, Unlink, Link2, AlertCircle } from 'lucide-react';
import type { LinkedGoogleAccount } from '../../types';

interface LinkedAccountsSettingsProps {
  linkedAccounts: LinkedGoogleAccount[];
  onUnlinkAccount: (email: string) => void;
  onLinkViaPopup: () => void;
  onLinkByEmail: (email: string) => Promise<void>;
  isOnline: boolean;
  linkingGoogle: boolean;
  linkGoogleMsg: { type: 'success' | 'error'; text: string } | null;
  onLogout: () => void;
}

export const LinkedAccountsSettings = ({
  linkedAccounts,
  onUnlinkAccount,
  onLinkViaPopup,
  onLinkByEmail,
  isOnline,
  linkingGoogle,
  linkGoogleMsg,
  onLogout
}: LinkedAccountsSettingsProps) => {
  const [newGoogleEmail, setNewGoogleEmail] = useState('');

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoogleEmail.trim()) return;
    await onLinkByEmail(newGoogleEmail.trim());
    setNewGoogleEmail('');
  };

  const isStaleSessionError = (msg: string) =>
    /user not found|not found|invalid session/i.test(msg);

  return (
    <div style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid var(--panel-border)', borderRadius: 'var(--radius-md)', padding: '16px' }}>
      <h4 style={{ fontSize: '13px', fontWeight: 700, marginBottom: '6px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <Shield size={14} color="var(--primary)" /> Linked Google Accounts
      </h4>
      <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
        Link multiple Google accounts to this profile. Any linked Google account can sign in and access your bookmarks, tasks, and configuration.
      </p>

      {/* Linked accounts list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' }}>
        {linkedAccounts.length === 0 && (
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontStyle: 'italic', padding: '10px', textAlign: 'center', background: 'rgba(255,255,255,0.01)', borderRadius: '6px', border: '1px dashed var(--panel-border)' }}>
            No Google accounts linked yet
          </div>
        )}
        {linkedAccounts.map((acct) => (
          <div key={acct.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--panel-border)', borderRadius: '8px' }}>
            {acct.avatarUrl ? (
              <img src={acct.avatarUrl} alt={acct.googleEmail} referrerPolicy="no-referrer" style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
            ) : (
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--primary-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: 'var(--primary)', flexShrink: 0 }}>
                {acct.googleEmail.charAt(0).toUpperCase()}
              </div>
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {acct.displayName || acct.googleEmail}
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {acct.googleEmail}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <svg width="12" height="12" viewBox="0 0 24 24"><path fill="#34a853" d="M12 0C5.374 0 0 5.373 0 12c0 6.628 5.374 12 12 12 6.628 0 12-5.372 12-12 0-6.627-5.372-12-12-12z"/></svg>
              <button
                type="button"
                onClick={() => onUnlinkAccount(acct.googleEmail)}
                title={`Unlink ${acct.googleEmail}`}
                style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '6px', padding: '4px 6px', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px', fontSize: '10px', fontWeight: 600 }}
              >
                <Unlink size={10} /> Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add via Google OAuth popup */}
      {isOnline && (
        <button
          type="button"
          onClick={onLinkViaPopup}
          disabled={linkingGoogle}
          className="google-auth-btn"
          style={{ width: '100%', marginBottom: '10px', fontSize: '11px', padding: '8px' }}
        >
          <svg viewBox="0 0 24 24" style={{ width: '14px', height: '14px' }}>
            <path fill="#EA4335" d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.54 14.98 1 12 1 7.35 1 3.37 3.68 1.48 7.58l3.96 3.07C6.39 7.42 9.01 5.04 12 5.04z"/>
            <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.29 1.48-1.14 2.73-2.4 3.58l3.73 2.89c2.18-2.01 3.7-4.99 3.7-8.62z"/>
            <path fill="#FBBC05" d="M5.44 14.78c-.24-.72-.38-1.49-.38-2.28s.14-1.56.38-2.28L1.48 7.15C.53 9.07 0 11.22 0 13.5s.53 4.43 1.48 6.35l3.96-3.07z"/>
            <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.73-2.89c-1.1.74-2.51 1.18-4.23 1.18-2.99 0-5.61-2.38-6.56-5.61l-3.96 3.07C3.37 20.32 7.35 23 12 23z"/>
          </svg>
          {linkingGoogle ? 'Linking...' : 'Link Another Google Account'}
        </button>
      )}

      {/* Manual email fallback */}
      <form onSubmit={handleManualSubmit} style={{ display: 'flex', gap: '6px' }}>
        <input
          type="email"
          className="form-input"
          placeholder="or type Google email manually…"
          value={newGoogleEmail}
          onChange={(e) => setNewGoogleEmail(e.target.value)}
          style={{ flex: 1, fontSize: '11px' }}
        />
        <button type="submit" disabled={linkingGoogle || !newGoogleEmail.trim() || !isOnline} className="btn-primary" style={{ padding: '6px 10px', fontSize: '11px', flexShrink: 0 }}>
          <Link2 size={12} />
        </button>
      </form>

      {linkGoogleMsg && (
        <div style={{
          fontSize: '11px', padding: '7px 10px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px', flexWrap: 'wrap',
          background: linkGoogleMsg.type === 'success' ? 'rgba(52,168,83,0.1)' : 'rgba(239,68,68,0.1)',
          border: `1px solid ${linkGoogleMsg.type === 'success' ? 'rgba(52,168,83,0.25)' : 'rgba(239,68,68,0.25)'}`,
          color: linkGoogleMsg.type === 'success' ? '#34a853' : '#ef4444',
        }}>
          <AlertCircle size={11} />
          <span style={{ flex: 1 }}>{linkGoogleMsg.text}</span>
          {linkGoogleMsg.type === 'error' && isStaleSessionError(linkGoogleMsg.text) && (
            <button
              type="button"
              onClick={onLogout}
              style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '4px', padding: '3px 8px', color: '#ef4444', cursor: 'pointer', fontSize: '10px', fontWeight: 700, whiteSpace: 'nowrap' }}
            >
              Sign Out Now
            </button>
          )}
        </div>
      )}

      {!isOnline && (
        <p style={{ fontSize: '10px', color: 'var(--text-muted)', fontStyle: 'italic', marginTop: '8px' }}>
          Linking accounts requires an online connection.
        </p>
      )}
    </div>
  );
};
