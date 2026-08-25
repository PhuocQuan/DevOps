import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Logo Section */}
        <div className="footer-logo">
          <h1>HomeSHOP</h1>
          <p>Chất lượng - Uy tín - Tận tâm</p>
        </div>

        {/* Quick Links */}
        <div className="footer-links">
          <h3>Liên Kết Nhanh</h3>
          <ul>
            <li><a href="/contact">Giới Thiệu</a></li>
            <li><a href="/service">Chính Sách</a></li>
            <li><a href="/support">Hỗ Trợ</a></li>
          </ul>
        </div>

        {/* Social Media Section */}
        <div className="footer-socials">
          <h3>Theo Dõi Chúng Tôi</h3>
          <ul>
            <li><a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a></li>
            <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a></li>
            <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a></li>
            <li><a href="https://youtube.com" target="_blank" rel="noopener noreferrer">YouTube</a></li>
          </ul>
        </div>
      </div>
      {/* Footer Bottom */}
    </footer>
  );
};

export default Footer;