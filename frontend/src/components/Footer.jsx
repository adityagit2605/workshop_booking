import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="professional-footer">
      <div className="footer-glow"></div>
      <div className="footer-container">

        <div className="footer-main">

          <div className="footer-brand-col">
            <div className="footer-logo">
              <span className="material-icons-round footer-logo-icon">school</span>
              <span className="footer-logo-text">FOSSEE</span>
            </div>
            <p className="footer-description">
              Empowering cutting-edge tech education through Free and Open Source Software. An initiative by IIT Bombay to provide high-quality educational content and scientific tools for all.
            </p>
            <div className="footer-contact-pills">
              <a href="mailto:fossee@iitb.ac.in" className="contact-pill">
                <span className="material-icons-round">email</span>
                fossee@iitb.ac.in
              </a>
            </div>
          </div>

          <div className="footer-links-grid">
            <div className="footer-nav-col">
              <h4 className="footer-heading">Platform</h4>
              <ul className="footer-nav-list">
                <li><Link to="/">Dashboard</Link></li>
                <li><Link to="/statistics">Analytics &amp; Stats</Link></li>
                <li><Link to="#">Our Workshops</Link></li>
                <li><Link to="#">Instructors</Link></li>
              </ul>
            </div>

            <div className="footer-nav-col">
              <h4 className="footer-heading">Resources</h4>
              <ul className="footer-nav-list">
                <li><Link to="#">Documentation</Link></li>
                <li><Link to="#">Help Center</Link></li>
                <li><Link to="#">Community</Link></li>
                <li><Link to="#">IIT Bombay Portal</Link></li>
              </ul>
            </div>

            <div className="footer-nav-col social-connect">
              <h4 className="footer-heading">Connect</h4>
              <p className="social-text">Join our community to stay updated on the latest tech events.</p>
              <div className="premium-social-icons">
                <a href="#" aria-label="LinkedIn" className="social-pill">
                  <span className="social-txt">in</span>
                </a>
                <a href="#" aria-label="Twitter" className="social-pill">
                  <span className="social-txt">X</span>
                </a>
                <a href="#" aria-label="YouTube" className="social-pill">
                  <span className="social-txt">Yt</span>
                </a>
                <a href="#" aria-label="GitHub" className="social-pill">
                  <span className="social-txt">Git</span>
                </a>
              </div>
            </div>
          </div>

        </div>

        <div className="footer-divider"></div>

        <div className="footer-bottom">
          <p className="copyright">
            © {new Date().getFullYear()} FOSSEE, IIT Bombay. All rights reserved.
          </p>
          <div className="footer-bottom-links">
            <Link to="#">Privacy Policy</Link>
            <Link to="#">Terms of Service</Link>
            <span className="developer-tag">Designed <span className="heart"></span> by Aditya Pandey</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
