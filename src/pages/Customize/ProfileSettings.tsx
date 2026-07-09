import { useState, useEffect } from 'react';
import { User as UserIcon, Mail, KeyRound, AlertCircle, Shield } from 'lucide-react';
import type { User } from '../../types';
import { AvatarDisplay } from '../../components/common/AvatarDisplay';

interface ProfileSettingsProps {
  currentUser: User;
  onSaveProfile: (updates: { name?: string; email?: string; password?: string }) => Promise<void>;
  isOnline: boolean;
  profileSaving: boolean;
  profileSaveMsg: { type: 'success' | 'error'; text: string } | null;
  onLogout: () => void;
}

export const ProfileSettings = ({
  currentUser,
  onSaveProfile,
  isOnline,
  profileSaving,
  profileSaveMsg,
  onLogout
}: ProfileSettingsProps) => {
  const [profileName, setProfileName] = useState(currentUser.name);
  const [profileEmail, setProfileEmail] = useState(currentUser.email || '');
  const [profilePassword, setProfilePassword] = useState('');
  const [profileConfirmPassword, setProfileConfirmPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    setProfileName(currentUser.name);
    setProfileEmail(currentUser.email || '');
  }, [currentUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (profilePassword && profilePassword !== profileConfirmPassword) {
      setLocalError('Passwords do not match.');
      return;
    }

    const updates: { name?: string; email?: string; password?: string } = {};
    if (profileName.trim() && profileName !== currentUser.name) updates.name = profileName.trim();
    if (profileEmail.trim() && profileEmail !== currentUser.email) updates.email = profileEmail.trim();
    if (profilePassword.trim()) updates.password = profilePassword.trim();

    await onSaveProfile(updates);
    setProfilePassword('');
    setProfileConfirmPassword('');
  };

  const isStaleSessionError = (msg: string) =>
    /user not found|not found|invalid session/i.test(msg);

  const displayMsg = localError ? { type: 'error' as const, text: localError } : profileSaveMsg;

  return (
    <div style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid var(--panel-border)', borderRadius: 'var(--radius-md)', padding: '16px' }}>
      <h4 style={{ fontSize: '13px', fontWeight: 700, marginBottom: '6px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <UserIcon size={14} color="var(--primary)" /> Profile &amp; Account
      </h4>
      <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
        Update your display name, login email, or set a new password.
      </p>

      {/* Profile picture preview */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--panel-border)' }}>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <AvatarDisplay avatar={currentUser.avatar} name={currentUser.name} size={56} />
          {(currentUser.avatar.startsWith('http') || currentUser.avatar.startsWith('data:')) && (
            <div style={{ position: 'absolute', bottom: -2, right: -2, background: '#34a853', borderRadius: '50%', width: '14px', height: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--panel-bg)' }}>
              <svg width="8" height="8" viewBox="0 0 24 24" fill="white"><path d="M12 0C5.374 0 0 5.373 0 12c0 6.628 5.374 12 12 12 6.628 0 12-5.372 12-12 0-6.627-5.372-12-12-12z"/></svg>
            </div>
          )}
        </div>
        <div>
          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>{currentUser.name}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{currentUser.email || 'No email set'}</div>
          {(currentUser.avatar.startsWith('http') || currentUser.avatar.startsWith('data:')) && (
            <div style={{ fontSize: '10px', color: '#34a853', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Shield size={10} /> Google Profile Photo
            </div>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div>
          <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
            <UserIcon size={11} /> Display Name
          </label>
          <input
            type="text"
            className="form-input"
            placeholder="Your display name"
            value={profileName}
            onChange={(e) => setProfileName(e.target.value)}
          />
        </div>
        <div>
          <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
            <Mail size={11} /> Email Address
          </label>
          <input
            type="email"
            className="form-input"
            placeholder="your@email.com"
            value={profileEmail}
            onChange={(e) => setProfileEmail(e.target.value)}
          />
        </div>
        <div>
          <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
            <KeyRound size={11} /> New Password
          </label>
          <input
            type="password"
            className="form-input"
            placeholder="Leave blank to keep current"
            value={profilePassword}
            onChange={(e) => setProfilePassword(e.target.value)}
          />
        </div>
        {profilePassword && (
          <div>
            <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>
              Confirm New Password
            </label>
            <input
              type="password"
              className="form-input"
              placeholder="Repeat new password"
              value={profileConfirmPassword}
              onChange={(e) => setProfileConfirmPassword(e.target.value)}
            />
          </div>
        )}

        {displayMsg && (
          <div style={{
            fontSize: '11px',
            padding: '7px 10px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            flexWrap: 'wrap',
            background: displayMsg.type === 'success' ? 'rgba(52, 168, 83, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            border: `1px solid ${displayMsg.type === 'success' ? 'rgba(52,168,83,0.25)' : 'rgba(239,68,68,0.25)'}`,
            color: displayMsg.type === 'success' ? '#34a853' : '#ef4444',
          }}>
            <AlertCircle size={11} />
            <span style={{ flex: 1 }}>{displayMsg.text}</span>
            {displayMsg.type === 'error' && isStaleSessionError(displayMsg.text) && (
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

        <button
          type="submit"
          disabled={profileSaving || !isOnline}
          className="btn-primary"
          style={{ alignSelf: 'flex-start', padding: '7px 14px', fontSize: '11px', gap: '4px', marginTop: '2px' }}
        >
          {profileSaving ? 'Saving...' : 'Save Changes'}
        </button>
        {!isOnline && (
          <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
            Profile editing requires an online connection.
          </span>
        )}
      </form>
    </div>
  );
};
