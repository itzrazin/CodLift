import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../utils/config';

/* ─────────────────────────────────────────────
   Sub-component: InputField
   Renders a labelled input with a left Material Symbol icon
   and an optional password-visibility toggle eye on the right.
───────────────────────────────────────────── */
const InputField = ({ type, placeholder, icon, value, onChange, name, required, minLength }) => {
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const isPassword = type === 'password';

  return (
    <div style={styles.inputWrapper}>
      <input
        type={isPassword && isPasswordShown ? 'text' : type}
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        minLength={minLength}
        autoComplete={isPassword ? 'current-password' : 'email'}
        style={styles.inputField}
        /* focus styles applied via className + global CSS injected below */
        className="auth-input-field"
      />
      {/* Left icon */}
      <i className="material-symbols-rounded" style={styles.inputIcon}>{icon}</i>

      {/* Eye toggle — only visible once the field has content (CSS :valid trick) */}
      {isPassword && (
        <i
          className="material-symbols-rounded auth-eye-icon"
          onClick={() => setIsPasswordShown(prev => !prev)}
          style={styles.eyeIcon}
          title={isPasswordShown ? 'Hide password' : 'Show password'}
        >
          {isPasswordShown ? 'visibility' : 'visibility_off'}
        </i>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────
   Sub-component: SocialButton
   A bordered button for OAuth providers.
───────────────────────────────────────────── */
const SocialButton = ({ label, icon, onClick, disabled }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className="auth-social-btn"
    style={styles.socialButton}
  >
    {icon}
    <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.95rem', fontWeight: 500 }}>
      {label}
    </span>
  </button>
);

/* ─────────────────────────────────────────────
   Google SVG logo
───────────────────────────────────────────── */
const GoogleLogo = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

/* ─────────────────────────────────────────────
   Apple SVG logo
───────────────────────────────────────────── */
const AppleLogo = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.4c1.42.07 2.41.74 3.23.8.97-.2 1.89-.77 3.19-.83 1.52.06 2.65.6 3.4 1.6-3.12 1.87-2.38 5.98.48 7.13-.5 1.42-1.16 2.82-2.3 4.18zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
  </svg>
);

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
const AuthPage = () => {
  const [isLogin, setIsLogin]   = useState(true);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError]       = useState(null);
  const [loading, setLoading]   = useState(false);

  const { login } = useAuth();
  const navigate  = useNavigate();

  /* ── handlers ─────────────────────────────── */
  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const endpoint = isLogin ? `${API_URL}/auth/login` : `${API_URL}/auth/signup`;
      const payload  = isLogin
        ? { email: formData.email, password: formData.password }
        : formData;

      const response = await axios.post(endpoint, payload);
      login(response.data.token, response.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/auth/google`;
  };

  const switchMode = () => {
    setIsLogin(prev => !prev);
    setFormData({ username: '', email: '', password: '' });
    setError(null);
  };

  /* ── render ───────────────────────────────── */
  return (
    <>
      {/* Scoped styles — injected once, no external file needed */}
      <style>{SCOPED_CSS}</style>

      <div style={styles.pageWrapper}>
        <div style={styles.card} className="auth-card">

          {/* Title */}
          <h2 style={styles.formTitle}>
            {isLogin ? 'Log in with' : 'Sign up with'}
          </h2>

          {/* Social buttons */}
          <div style={styles.socialRow}>
            <SocialButton
              label="Google"
              icon={<GoogleLogo />}
              onClick={handleGoogleLogin}
            />
            <SocialButton
              label="Apple"
              icon={<AppleLogo />}
              disabled
              onClick={() => {}}
            />
          </div>

          {/* OR separator */}
          <div style={styles.separatorWrapper} className="auth-separator">
            <span style={styles.separatorSpan}>or</span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate>

            {/* Username — signup only */}
            {!isLogin && (
              <InputField
                type="text"
                name="username"
                placeholder="Username"
                icon="person"
                value={formData.username}
                onChange={handleChange}
                required
              />
            )}

            {/* Email */}
            <InputField
              type="email"
              name="email"
              placeholder="Email address"
              icon="mail"
              value={formData.email}
              onChange={handleChange}
              required
            />

            {/* Password */}
            <InputField
              type="password"
              name="password"
              placeholder="Password"
              icon="lock"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={!isLogin ? 8 : undefined}
            />

            {/* Forgot password — login only */}
            {isLogin && (
              <a href="#" style={styles.forgotLink} tabIndex={0}
                onClick={e => e.preventDefault()}>
                Forgot password?
              </a>
            )}

            {/* Error message */}
            {error && (
              <div style={styles.errorBox} role="alert">
                <i className="material-symbols-rounded" style={{ fontSize: '1rem', flexShrink: 0 }}>
                  error
                </i>
                {error}
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              style={styles.loginButton}
              className="auth-login-btn"
            >
              {loading ? (
                <span style={styles.spinner} className="auth-spinner" />
              ) : (
                isLogin ? 'Log In' : 'Create Account'
              )}
            </button>
          </form>

          {/* Footer switch */}
          <p style={styles.signupPrompt}>
            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              type="button"
              onClick={switchMode}
              style={styles.switchBtn}
              className="auth-switch-btn"
            >
              {isLogin ? 'Sign up' : 'Log in'}
            </button>
          </p>

        </div>
      </div>
    </>
  );
};

/* ─────────────────────────────────────────────
   Inline style objects  (pixel-perfect to tutorial)
───────────────────────────────────────────── */
const PRIMARY = '#5F41E4';
const PRIMARY_DARK = '#4320df';
const BORDER_COLOR = '#D5CBFF';

const styles = {
  pageWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: PRIMARY,
    padding: '0.75rem',
    fontFamily: "'Montserrat', sans-serif",
  },
  card: {
    width: '100%',
    maxWidth: '410px',
    padding: '2rem 1.75rem',
    borderRadius: '0.5rem',
    background: '#fff',
    boxShadow: '0 10px 28px rgba(0, 0, 0, 0.15)',
  },
  formTitle: {
    textAlign: 'center',
    fontSize: '1.35rem',
    fontWeight: 600,
    color: '#1a1a2e',
    marginBottom: '1.75rem',
    fontFamily: "'Montserrat', sans-serif",
  },
  socialRow: {
    display: 'flex',
    gap: '1.25rem',
  },
  socialButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.65rem',
    width: '100%',
    padding: '0.7rem 0',
    borderRadius: '0.3rem',
    border: `1px solid ${BORDER_COLOR}`,
    background: '#F9F8FF',
    cursor: 'pointer',
    transition: 'all 0.25s ease',
    fontFamily: "'Montserrat', sans-serif",
  },
  separatorWrapper: {
    position: 'relative',
    margin: '1.5rem 0',
    textAlign: 'center',
  },
  separatorSpan: {
    position: 'relative',
    zIndex: 1,
    display: 'inline-block',
    background: '#fff',
    padding: '0 0.9rem',
    color: '#6652BE',
    fontWeight: 500,
    fontSize: '1rem',
    fontFamily: "'Montserrat', sans-serif",
  },
  inputWrapper: {
    position: 'relative',
    height: '54px',
    width: '100%',
    marginBottom: '1.4rem',
  },
  inputField: {
    width: '100%',
    height: '100%',
    outline: 'none',
    fontSize: '1rem',
    borderRadius: '0.3rem',
    border: `1px solid ${BORDER_COLOR}`,
    padding: '0 3rem 0 3rem',
    transition: 'border-color 0.2s ease',
    fontFamily: "'Montserrat', sans-serif",
    color: '#1a1a2e',
    background: '#fff',
  },
  inputIcon: {
    position: 'absolute',
    top: '50%',
    left: '0.9rem',
    transform: 'translateY(-50%)',
    color: '#a395e0',
    fontSize: '1.3rem',
    pointerEvents: 'none',
    userSelect: 'none',
    transition: 'color 0.2s ease',
    fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24",
  },
  eyeIcon: {
    position: 'absolute',
    top: '50%',
    right: '0.9rem',
    transform: 'translateY(-50%)',
    color: '#917DE8',
    fontSize: '1.2rem',
    cursor: 'pointer',
    userSelect: 'none',
    transition: 'color 0.2s ease',
    fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24",
  },
  forgotLink: {
    display: 'block',
    textAlign: 'right',
    marginTop: '-0.5rem',
    marginBottom: '0.5rem',
    color: PRIMARY,
    fontSize: '0.875rem',
    fontWeight: 500,
    textDecoration: 'none',
    fontFamily: "'Montserrat', sans-serif",
  },
  errorBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginTop: '0.25rem',
    marginBottom: '0.75rem',
    padding: '0.75rem 1rem',
    borderRadius: '0.3rem',
    background: '#fff0f0',
    border: '1px solid #fca5a5',
    color: '#b91c1c',
    fontSize: '0.875rem',
    fontWeight: 500,
    fontFamily: "'Montserrat', sans-serif",
  },
  loginButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '54px',
    marginTop: '1.75rem',
    border: 'none',
    outline: 'none',
    borderRadius: '0.3rem',
    background: PRIMARY,
    color: '#fff',
    fontSize: '1.1rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background 0.25s ease',
    fontFamily: "'Montserrat', sans-serif",
    letterSpacing: '0.02em',
  },
  spinner: {
    display: 'inline-block',
    width: '22px',
    height: '22px',
    borderRadius: '50%',
    border: '3px solid rgba(255,255,255,0.3)',
    borderTopColor: '#fff',
    animation: 'auth-spin 0.7s linear infinite',
  },
  signupPrompt: {
    textAlign: 'center',
    marginTop: '1.75rem',
    fontSize: '0.95rem',
    fontWeight: 500,
    color: '#4a4a6a',
    fontFamily: "'Montserrat', sans-serif",
  },
  switchBtn: {
    background: 'none',
    border: 'none',
    padding: 0,
    color: PRIMARY,
    fontWeight: 600,
    fontSize: '0.95rem',
    cursor: 'pointer',
    fontFamily: "'Montserrat', sans-serif",
    textDecoration: 'none',
  },
};

/* ─────────────────────────────────────────────
   Scoped CSS — handles pseudo-selectors and
   animations that can't be done with inline styles.
───────────────────────────────────────────── */
const SCOPED_CSS = `
  /* spinner animation */
  @keyframes auth-spin {
    to { transform: rotate(360deg); }
  }

  /* card entrance */
  .auth-card {
    animation: auth-card-in 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }
  @keyframes auth-card-in {
    from { opacity: 0; transform: translateY(24px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0)    scale(1); }
  }

  /* input focus border */
  .auth-input-field:focus {
    border-color: #5F41E4 !important;
    box-shadow: 0 0 0 3px rgba(95, 65, 228, 0.12);
  }
  .auth-input-field::placeholder {
    color: #9284c8;
  }

  /* social button hover */
  .auth-social-btn:hover:not(:disabled) {
    border-color: #5F41E4 !important;
    background: #f1eff9 !important;
  }
  .auth-social-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* login button hover */
  .auth-login-btn:hover:not(:disabled) {
    background: #4320df !important;
  }
  .auth-login-btn:disabled {
    opacity: 0.75;
    cursor: not-allowed;
  }

  /* switch button hover */
  .auth-switch-btn:hover {
    text-decoration: underline;
  }

  /* forgot password hover */
  .auth-forgot:hover {
    text-decoration: underline;
  }

  /* separator line via pseudo-element */
  .auth-separator::after {
    content: "";
    position: absolute;
    left: 0;
    top: 50%;
    height: 1px;
    width: 100%;
    background: #bfb3f2;
    z-index: 0;
  }

  /* Page background override — ensures the page is fully purple */
  body {
    background: #5F41E4 !important;
  }

  /* Responsive padding on small screens */
  @media (max-width: 440px) {
    .auth-card {
      padding: 1.75rem 1.25rem !important;
    }
  }
`;

export default AuthPage;
