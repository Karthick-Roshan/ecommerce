import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="container">
          <div className="footer-grid">
            {/* About Section */}
            <div className="footer-section">
              <h3>ABOUT</h3>
              <ul>
                <li><Link to="/contact">Contact Us</Link></li>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/careers">Careers</Link></li>
                <li><Link to="/press">Flipkart Stories</Link></li>
                <li><Link to="/press">Press</Link></li>
                <li><Link to="/wholesale">Flipkart Wholesale</Link></li>
                <li><Link to="/cleartrip">Corporate Information</Link></li>
              </ul>
            </div>

            {/* Help Section */}
            <div className="footer-section">
              <h3>HELP</h3>
              <ul>
                <li><Link to="/payments">Payments</Link></li>
                <li><Link to="/shipping">Shipping</Link></li>
                <li><Link to="/cancellation">Cancellation & Returns</Link></li>
                <li><Link to="/faq">FAQ</Link></li>
                <li><Link to="/report">Report Infringement</Link></li>
              </ul>
            </div>

            {/* Policy Section */}
            <div className="footer-section">
              <h3>POLICY</h3>
              <ul>
                <li><Link to="/returns">Return Policy</Link></li>
                <li><Link to="/terms">Terms Of Use</Link></li>
                <li><Link to="/security">Security</Link></li>
                <li><Link to="/privacy">Privacy</Link></li>
                <li><Link to="/sitemap">Sitemap</Link></li>
                <li><Link to="/grievance">Grievance Redressal</Link></li>
              </ul>
            </div>

            {/* Social Section */}
            <div className="footer-section">
              <h3>SOCIAL</h3>
              <ul>
                <li><a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a></li>
                <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a></li>
                <li><a href="https://youtube.com" target="_blank" rel="noopener noreferrer">YouTube</a></li>
                <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a></li>
              </ul>
            </div>

            {/* Mail Section */}
            <div className="footer-section">
              <h3>Mail Us</h3>
              <div className="address">
                <p>Flipkart Internet Private Limited,</p>
                <p>Buildings Alyssa, Begonia &</p>
                <p>Clover situated in Embassy Tech Village,</p>
                <p>Outer Ring Road, Devarabeesanahalli Village,</p>
                <p>Bengaluru, 560103,</p>
                <p>Karnataka, India</p>
              </div>
            </div>

            {/* Office Address */}
            <div className="footer-section">
              <h3>Registered Office Address</h3>
              <div className="address">
                <p>Flipkart Internet Private Limited,</p>
                <p>Buildings Alyssa, Begonia &</p>
                <p>Clover situated in Embassy Tech Village,</p>
                <p>Outer Ring Road, Devarabeesanahalli Village,</p>
                <p>Bengaluru, 560103,</p>
                <p>Karnataka, India</p>
                <p>CIN : U51109KA2012PTC066107</p>
                <p>Telephone: <a href="tel:044-45614700">044-45614700</a></p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <div className="footer-bottom-content">
            <div className="footer-features">
              <div className="feature-item">
                <div className="feature-icon">🛒</div>
                <span>Become a Seller</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">⭐</div>
                <span>Advertise</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🎁</div>
                <span>Gift Cards</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">❓</div>
                <span>Help Center</span>
              </div>
            </div>

            <div className="footer-copyright">
              <p>&copy; 2007-2024 Flipkart.com</p>
            </div>

            <div className="footer-payment">
              <img src="/images/payments/visa.png" alt="Visa" />
              <img src="/images/payments/mastercard.png" alt="Mastercard" />
              <img src="/images/payments/amex.png" alt="American Express" />
              <img src="/images/payments/upi.png" alt="UPI" />
              <img src="/images/payments/paytm.png" alt="Paytm" />
              <img src="/images/payments/phonepe.png" alt="PhonePe" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;