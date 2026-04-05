import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

export default function Login() {
  const { login, isAuthenticated, isInstructor } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  if (isAuthenticated) {
    navigate(isInstructor ? '/dashboard' : '/status');
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password');
      return;
    }

    setLoading(true);
    try {
      await login(username, password);
      navigate('/');
    } catch (err) {
      setError(err.data?.error || err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      {/* Animated Background */}
      <div className="login-bg">
        <div className="login-bg-orb orb-1"></div>
        <div className="login-bg-orb orb-2"></div>
        <div className="login-bg-orb orb-3"></div>
      </div>

      <div className="login-container animate-fade-in-up">
        <div className="login-card glass-card">
          {/* Header */}
          <div className="login-header">
            <div className="login-logo">
              <span className="material-icons-round">science</span>
            </div>
            <h1 className="login-title">Welcome Back</h1>
            <p className="login-subtitle">Sign in to FOSSEE Workshop Portal</p>
          </div>

          {/* Error */}
          {error && (
            <div className="login-error animate-fade-in" id="login-error">
              <span className="material-icons-round">error_outline</span>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="login-form" id="login-form">
            <div className="form-group">
              <label className="form-label" htmlFor="id_username">Username</label>
              <div className="input-wrapper">
                <span className="input-icon material-icons-round">person</span>
                <input
                  type="text"
                  id="id_username"
                  className="form-input has-icon"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoFocus
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="id_password">Password</label>
              <div className="input-wrapper">
                <span className="input-icon material-icons-round">lock</span>
                <input
                  type="password"
                  id="id_password"
                  className="form-input has-icon"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg login-btn"
              disabled={loading}
              id="login-submit"
            >
              {loading ? (
                <>
                  <span className="spinner" style={{width:18,height:18,borderWidth:2}}></span>
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <span className="material-icons-round">arrow_forward</span>
                </>
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className="login-footer">
            <div className="login-divider">
              <span>or</span>
            </div>
            <div className="login-links">
              <Link to="/register" className="login-link" id="register-link">
                <span className="material-icons-round">person_add</span>
                New around here? <strong>Sign up</strong>
              </Link>
              <a href="/reset/password_reset/" className="login-link forgot-link" id="forgot-link">
                <span className="material-icons-round">help_outline</span>
                Forgot password?
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
