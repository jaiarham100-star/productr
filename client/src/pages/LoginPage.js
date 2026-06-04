import React, { useState } from 'react';
import API from '../utils/api';
import { useAuth } from '../hooks/useAuth';
import OTPPage from './OTPPage';

const ProductrLogo = () => (
  <div className="auth-logo">
    <div className="auth-logo-icon">🔥</div>
    <span className="auth-logo-text">Productr</span>
  </div>
);

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [devOtp, setDevOtp] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setError('Please enter your email or phone number');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await API.post('/auth/login', { identifier: identifier.trim() });
      if (res.data.otp) setDevOtp(res.data.otp); // dev mode
      setOtpSent(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (otpSent) {
    return <OTPPage identifier={identifier} devOtp={devOtp} />;
  }

  return (
    <div className="auth-page">
      <div className="auth-bg" />
      <div className="auth-bg-shapes">
        <span /><span /><span />
      </div>
      <div className="auth-card">
        <ProductrLogo />
        <h1 className="auth-title">Login to your Productr Account</h1>
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: 16 }}>
            <label className="auth-label">Email or Phone number</label>
            <input
              type="text"
              className={`auth-input${error ? ' form-input error' : ''}`}
              placeholder="Enter email or phone number"
              value={identifier}
              onChange={e => { setIdentifier(e.target.value); setError(''); }}
              autoFocus
            />
            {error && <p className="field-error">{error}</p>}
          </div>
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? <span className="spinner" /> : 'Login'}
          </button>
        </form>
        <div className="auth-footer-box" style={{ marginTop: 28 }}>
          <p className="auth-footer-small">Don't have a Productr Account?</p>
          <span className="auth-link">Sign Up Here</span>
        </div>
      </div>
    </div>
  );
}
