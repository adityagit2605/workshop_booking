import './Footer.css';

export default function Footer() {
  return (
    <footer className="app-footer" id="main-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="material-icons-round footer-icon">science</span>
          <span>FOSSEE Workshops</span>
        </div>
        <p className="footer-text">
          Developed by FOSSEE group, IIT Bombay
        </p>
      </div>
    </footer>
  );
}
