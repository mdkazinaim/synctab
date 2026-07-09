import { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { LoginForm } from '../../components/Auth/LoginForm';
import { RegisterForm } from '../../components/Auth/RegisterForm';
import { GoogleSimModal } from '../../components/Auth/GoogleSimModal';

interface AuthPageProps {
  onLogin: (email: string, password: string) => void;
  onRegister: (name: string, email: string, password: string) => void;
  onGoogleLogin: (email: string, name: string, avatar: string) => void;
  onOfflineDemoLogin: () => void;
  isOnline: boolean;
  loading: boolean;
  authError: string | null;
}

export const AuthPage = ({
  onLogin,
  onRegister,
  onGoogleLogin,
  onOfflineDemoLogin,
  isOnline,
  loading,
  authError
}: AuthPageProps) => {
  const [authTab, setAuthTab] = useState<'signin' | 'register'>('signin');
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);

  return (
    <div className="auth-screen-container">
      <div className="auth-card glass-panel">
        <div className="auth-logo-section">
          <div className="auth-logo-badge">
            <span style={{ fontSize: '24px' }}>⚡</span>
          </div>
          <h2 className="auth-brand-title">SyncTab Workspace</h2>
          <p className="auth-brand-subtitle">
            Synchronized dashboard panels, bookmarks, tasks, and real-time team synchronization.
          </p>
        </div>

        <div className="auth-tabs-row">
          <button
            className={`auth-tab-btn ${authTab === 'signin' ? 'active' : ''}`}
            onClick={() => setAuthTab('signin')}
          >
            Sign In
          </button>
          <button
            className={`auth-tab-btn ${authTab === 'register' ? 'active' : ''}`}
            onClick={() => setAuthTab('register')}
          >
            Create Account
          </button>
        </div>

        {authError && (
          <div className="auth-error-box">
            <AlertCircle size={14} /> {authError}
          </div>
        )}

        {authTab === 'signin' ? (
          <LoginForm
            onLogin={onLogin}
            onGoogleLoginClick={() => setIsGoogleModalOpen(true)}
            onOfflineDemoLogin={onOfflineDemoLogin}
            isOnline={isOnline}
            loading={loading}
          />
        ) : (
          <RegisterForm
            onRegister={onRegister}
            loading={loading}
          />
        )}
      </div>

      <GoogleSimModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        onSelectAccount={(email, name, avatar) => {
          onGoogleLogin(email, name, avatar);
          setIsGoogleModalOpen(false);
        }}
      />
    </div>
  );
};
export default AuthPage;
