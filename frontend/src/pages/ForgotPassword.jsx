import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import '../pages/Login.css';
import './ForgotPassword.css';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your registered email address');
      return;
    }

    setLoading(true);
    try {
      // Use the existing Django password reset endpoint (server-rendered)
      // We POST to the Django form endpoint with form-urlencoded data
      const csrfRes = await fetch('/api/auth/csrf/', { credentials: 'include' });
      const csrfData = await csrfRes.json();

      const res = await fetch('/reset/forgotpassword/', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'X-CSRFToken': csrfData.csrfToken,
        },
        body: new URLSearchParams({ email }),
        redirect: 'follow',
      });

      // Django's password_reset view redirects on success, so any 2xx/3xx = success
      if (res.ok || res.redirected || res.status === 302) {
        setSuccess(true);
      } else {
        setError('Unable to process your request. Please check the email and try again.');
      }
    } catch {
      setError('Network error. Please try again later.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <SEO
        title="Forgot Password | FOSSEE Workshop Portal"
        description="Reset your password for the FOSSEE Workshop Portal."
        keywords="FOSSEE password reset, forgot password, IIT Bombay workshops"
      />
      <div className="login-wrapper">
        <div className="forgot-page-container">

          {/* Left Side: Hero Card */}
          <div className="forgot-left-column">
            <div className="login-left-hero">
              <img src="/hero.jpg" alt="FOSSEE Workshop Hero" className="login-hero-image" />
              <h1 className="banner-title">
                We've Got You
              </h1>
            </div>
          </div>

          {/* Right Side: Reset Form Card */}
          <div className="forgot-right-card animate-fade-in-up">

            {!success ? (
              <>
                <div className="forgot-icon-wrap">
                  <span className="material-icons-round forgot-lock-icon">lock_reset</span>
                </div>

                <div className="forgot-form-header">
                  <h2>Forgot Password?</h2>
                  <p>Enter your registered email address to reset your password. We'll send you a link to get back in.</p>
                </div>

                {error && (
                  <div className="login-error animate-fade-in" id="forgot-error">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="login-form" id="forgot-form">
                  <div className="form-group">
                    <label className="form-label" htmlFor="forgot_email">Email Address</label>
                    <div className="input-wrapper">
                      <input
                        type="email"
                        id="forgot_email"
                        className={`form-input ${error ? 'input-error' : ''}`}
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setError(''); }}
                        autoFocus
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  <div className="forgot-actions">
                    <button
                      type="submit"
                      className="login-btn"
                      disabled={loading}
                      id="forgot-submit"
                    >
                      {loading ? (
                        <span className="spinner"></span>
                      ) : (
                        'Request Reset Link'
                      )}
                    </button>

                    <button
                      type="button"
                      className="forgot-cancel-btn"
                      onClick={() => navigate('/login')}
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="signup-prompt" style={{ marginTop: '2rem' }}>
                    Remember your password? <Link to="/login">Sign In</Link>
                  </div>
                </form>
              </>
            ) : (
              <div className="forgot-success">
                <div className="forgot-icon-wrap success-icon-wrap">
                  <span className="material-icons-round forgot-lock-icon success-icon">mark_email_read</span>
                </div>
                <h2>Check Your Email</h2>
                <p>If an account with <strong>{email}</strong> exists, we've sent a password reset link. Please check your inbox and follow the instructions.</p>
                <Link to="/login" className="login-btn" style={{ marginTop: '2rem', textDecoration: 'none', display: 'flex', justifyContent: 'center' }}>
                  Back to Login
                </Link>
              </div>
            )}

          </div>

        </div>
      </div>
    </>
  );
}
