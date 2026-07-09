import React, { useState } from 'react';

interface RegisterFormProps {
  onRegister: (name: string, email: string, password: string) => void;
  loading: boolean;
}

export const RegisterForm = ({ onRegister, loading }: RegisterFormProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    onRegister(name.trim(), email.trim(), password);
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      {error && (
        <div style={{ color: '#ef4444', fontSize: '11px', background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239,68,68,0.2)', padding: '8px', borderRadius: '6px', marginBottom: '10px' }}>
          {error}
        </div>
      )}

      <div className="auth-input-group">
        <label className="auth-input-label">Display Name</label>
        <input
          type="text"
          required
          placeholder="Md Naim"
          className="auth-input-field"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

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
          placeholder="Minimum 6 characters"
          className="auth-input-field"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div className="auth-input-group">
        <label className="auth-input-label">Confirm Password</label>
        <input
          type="password"
          required
          placeholder="Repeat password"
          className="auth-input-field"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>

      <button type="submit" disabled={loading} className="btn-primary" style={{ padding: '12px', marginTop: '12px', fontSize: '13px', width: '100%' }}>
        {loading ? 'Creating Account...' : 'Register'}
      </button>
    </form>
  );
};
export default RegisterForm;
