import React, { useState, useRef, useEffect } from 'react';
import API from '../utils/api';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export default function OTPPage({ identifier, devOtp }) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(20);
  const [canResend, setCanResend] = useState(false);
  const inputs = useRef([]);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (resendTimer > 0) {
      const t = setTimeout(() => setResendTimer(v => v - 1), 1000);
      return () => clearTimeout(t);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  const handleChange = (idx, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    setError('');
    if (val && idx < 5) inputs.current[idx + 1]?.focus();
  };

  const handleKeyDown = (idx, e) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      inputs.current[idx - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const next = [...otp];
    pasted.split('').forEach((ch, i) => { next[i] = ch; });
    setOtp(next);
    inputs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    const code = otp.join('');
    if (code.length < 6) {
      setError('Please enter all 6 digits');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await API.post('/auth/verify-otp', { identifier, otp: code });
      login(res.data.token, res.data.user);
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    try {
      await API.post('/auth/resend-otp', { identifier });
      setResendTimer(20);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
      inputs.current[0]?.focus();
    } catch (err) {
      setError('Failed to resend OTP');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg" />
      <div className="auth-bg-shapes">
        <span /><span /><span />
      </div>
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">🔥</div>
          <span className="auth-logo-text">Productr</span>
        </div>
        <h1 className="auth-title">Login to your Productr Account</h1>
        {devOtp && (
          <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 8, padding: '8px 12px', marginBottom: 16, fontSize: 12, color: '#166534' }}>
            Dev mode — Your OTP: <strong>{devOtp}</strong>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 4 }}>
            <label className="auth-label">Enter OTP</label>
            <div className="otp-inputs" onPaste={handlePaste}>
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={el => inputs.current[idx] = el}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  className="otp-input"
                  value={digit}
                  onChange={e => handleChange(idx, e.target.value)}
                  onKeyDown={e => handleKeyDown(idx, e)}
                  autoFocus={idx === 0}
                />
              ))}
            </div>
            {error && <p className="field-error">{error}</p>}
          </div>
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? <span className="spinner" /> : 'Enter your OTP'}
          </button>
        </form>
        <div className="resend-row">
          Didn't receive OTP?{' '}
          {canResend ? (
            <button className="resend-btn" onClick={handleResend}>Resend</button>
          ) : (
            <button className="resend-btn" disabled>Resend in {resendTimer}s</button>
          )}
        </div>
      </div>
    </div>
  );
}
