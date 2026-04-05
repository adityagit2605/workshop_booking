import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, isAuthenticated, isInstructor, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
    setProfileOpen(false);
  }, [location]);

  useEffect(() => {
    function handleOutsideClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  async function handleLogout() {
    await logout();
  }

  return (
    <nav className="navbar" id="main-navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand" id="nav-brand">
          <span className="brand-icon material-icons-round">science</span>
          <span className="brand-text">FOSSEE Workshops</span>
        </Link>

        <button
          className="navbar-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
          id="nav-toggle"
        >
          <span className="material-icons-round">
            {menuOpen ? 'close' : 'menu'}
          </span>
        </button>

        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <div className="nav-left">
            <Link
              to="/"
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
              id="nav-home"
            >
              Home
            </Link>
            <Link
              to="/statistics"
              className={`nav-link ${location.pathname === '/statistics' ? 'active' : ''}`}
              id="nav-statistics"
            >
              Workshop Statistics
            </Link>

            {isAuthenticated && (
              <>
                {isInstructor && (
                  <Link
                    to="/team-statistics"
                    className={`nav-link ${location.pathname === '/team-statistics' ? 'active' : ''}`}
                    id="nav-team-stats"
                  >
                    Team Statistics
                  </Link>
                )}
                <Link
                  to={isInstructor ? '/dashboard' : '/status'}
                  className={`nav-link ${['/dashboard', '/status'].includes(location.pathname) ? 'active' : ''}`}
                  id="nav-workshop-status"
                >
                  Workshop Status
                </Link>
                {!isInstructor && (
                  <Link
                    to="/propose"
                    className={`nav-link ${location.pathname === '/propose' ? 'active' : ''}`}
                    id="nav-propose"
                  >
                    Propose Workshop
                  </Link>
                )}
                <Link
                  to="/workshop-types"
                  className={`nav-link ${location.pathname === '/workshop-types' ? 'active' : ''}`}
                  id="nav-workshop-types"
                >
                  Workshop Types
                </Link>
              </>
            )}
          </div>

          <div className="nav-right">
            {isAuthenticated ? (
              <div className="nav-profile" ref={dropdownRef}>
                <button
                  className="nav-profile-trigger"
                  onClick={() => setProfileOpen(!profileOpen)}
                  id="nav-profile-btn"
                >
                  <span className="profile-avatar">
                    {user?.first_name?.[0] || 'U'}
                    {user?.last_name?.[0] || ''}
                  </span>
                  <span className="profile-name">
                    {user?.first_name || 'User'} {user?.last_name || ''}
                  </span>
                  <span className="material-icons-round profile-arrow">
                    {profileOpen ? 'expand_less' : 'expand_more'}
                  </span>
                </button>

                {profileOpen && (
                  <div className="profile-dropdown animate-scale-in" id="nav-dropdown">
                    <Link to="/profile" className="dropdown-item" id="nav-profile-link">
                      <span className="material-icons-round">person</span>
                      Profile
                    </Link>
                    <hr className="divider" />
                    <button onClick={handleLogout} className="dropdown-item logout-btn" id="nav-logout">
                      <span className="material-icons-round">logout</span>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="nav-auth-links">
                <Link to="/login" className="btn btn-secondary btn-sm" id="nav-login">
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm" id="nav-register">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
