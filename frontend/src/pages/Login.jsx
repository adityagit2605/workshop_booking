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
  const [showPassword, setShowPassword] = useState(false);

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
    <div className="login-wrapper">
      <div className="login-split-container">

        {/* Left Side: Split Graphic Cards */}
        <div className="login-left-column">
          <div className="login-left-hero">
            <img src="/hero.jpg" alt="FOSSEE Workshop Hero" className="login-hero-image" />
            <h1 className="banner-title">
              Build. Learn. Innovate
            </h1>
          </div>

          <div className="login-left-footer">
            <img src="/classroom.jpg" alt="FOSSEE Workshop Classroom" className="login-classroom-image" />
          </div>
        </div>

        {/* Right Side: Form Card */}
        <div className="login-right-column animate-fade-in-up">

          <div className="form-header-text">
            <h2>Where academic rigor meets open source innovation.</h2>
            <p>Ready to embark on your tech adventure? Log in now and let FOSSEE take you there. Your next achievement is just a click away!</p>
          </div>

          {error && (
            <div className="login-error animate-fade-in" id="login-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form" id="login-form">
            <div className="form-group">
              <label className="form-label" htmlFor="id_username">Username</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  id="id_username"
                  className="form-input"
                  placeholder="Input Username"
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
                <input
                  type={showPassword ? "text" : "password"}
                  id="id_password"
                  className="form-input has-icon-right"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex="-1"
                >
                  <span className="material-icons-round">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <div className="signup-prompt">
              New to FOSSEE? <Link to="/register">Create an Account</Link>
            </div>

            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" className="custom-checkbox" />
                <span className="remember-text">Remember me</span>
              </label>
              <a href="/reset/password_reset/" className="forgot-link">
                Forgot your password?
              </a>
            </div>

            <button
              type="submit"
              className="login-btn"
              disabled={loading}
              id="login-submit"
            >
              {loading ? (
                <span className="spinner"></span>
              ) : (
                "Login - Continue Exploring and Building"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
