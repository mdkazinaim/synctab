import React, { useState } from 'react';

interface LoginFormProps {
  onLogin: (email: string, password: string) => void;
  onGoogleLoginClick: () => void;
  onOfflineDemoLogin: () => void;
  isOnline: boolean;
  loading: boolean;
}

export const LoginForm = ({
  onLogin,
  onGoogleLoginClick,
  onOfflineDemoLogin,
  isOnline,
  loading
}: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    onLogin(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <div className="auth-input-group">
        <label className="auth-input-label">Email Address</label>
        <input
          type="email"
          required
          placeholder="name@company.com"
          className="auth-input-field"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="auth-input-group">
        <label className="auth-input-label">Password</label>
        <input
          type="password"
          required
          placeholder="••••••••"
          className="auth-input-field"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button type="submit" disabled={loading} className="btn-primary" style={{ padding: '12px', marginTop: '8px', fontSize: '13px', width: '100%' }}>
        {loading ? 'Signing In...' : 'Sign In'}
      </button>

      <div className="divider-container">Or Connect With</div>

      <button
        type="button"
        onClick={onGoogleLoginClick}
        className="google-auth-btn"
        style={{ width: '100%' }}
      >
        <svg className="google-icon-svg" viewBox="0 0 24 24" style={{ width: '18px', height: '18px' }}>
          <path
            fill="#EA4335"
            d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.54 14.98 1 12 1 7.35 1 3.37 3.68 1.48 7.58l3.96 3.07C6.39 7.42 9.01 5.04 12 5.04z"
          />
          <path
            fill="#4285F4"
            d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.29 1.48-1.14 2.73-2.4 3.58l3.73 2.89c2.18-2.01 3.7-4.99 3.7-8.62z"
          />
          <path
            fill="#FBBC05"
            d="M5.44 14.78c-.24-.72-.38-1.49-.38-2.28s.14-1.56.38-2.28L1.48 7.15C.53 9.07 0 11.22 0 13.5s.53 4.43 1.48 6.35l3.96-3.07z"
          />
          <path
            fill="#34A853"
            d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.73-2.89c-1.1.74-2.51 1.18-4.23 1.18-2.99 0-5.61-2.38-6.56-5.61l-3.96 3.07C3.37 20.32 7.35 23 12 23z"
          />
        </svg>
        Continue with Google
      </button>

      {!isOnline && (
        <div style={{ marginTop: '16px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '16px' }}>
          <button
            type="button"
            onClick={onOfflineDemoLogin}
            className="btn-secondary"
            style={{ width: '100%', padding: '10px', fontSize: '12px' }}
          >
            Enter Offline Demo Mode
          </button>
        </div>
      )}
    </form>
  );
};
export default LoginForm;
