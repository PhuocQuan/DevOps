import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Logo Section */}
        <div className="footer-logo">
          <div className="footer_brand">
            <i className="bi bi-shop-window me-2 text-primary"></i>
            <span>Home<span className="text-warning">SHOP</span></span>
          </div>
          <p className="footer_tagline">Hệ thống gia dụng & nội thất thông minh hàng đầu. Chất lượng - Uy tín - Tận tâm đồng hành cùng mọi gia đình.</p>
          <div className="footer_contact_item">
            <i className="bi bi-geo-alt-fill text-danger me-2"></i>
            <span>Đà Nẵng, Việt Nam</span>
          </div>
          <div className="footer_contact_item">
            <i className="bi bi-telephone-fill text-success me-2"></i>
            <span>Hotline: 1900 6868 - (0236) 3888 999</span>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-links">
          <h3>Liên Kết Nhanh</h3>
          <ul>
            <li><Link to="/"><i className="bi bi-chevron-right me-1"></i> Trang Chủ</Link></li>
            <li><Link to="/contact"><i className="bi bi-chevron-right me-1"></i> Giới Thiệu Nhóm</Link></li>
            <li><Link to="/service"><i className="bi bi-chevron-right me-1"></i> Chính Sách Đổi Trả</Link></li>
            <li><Link to="/support"><i className="bi bi-chevron-right me-1"></i> Trung Tâm Hỗ Trợ</Link></li>
            <li><Link to="/cart"><i className="bi bi-chevron-right me-1"></i> Giỏ Hàng Của Bạn</Link></li>
          </ul>
        </div>

        {/* Categories */}
        <div className="footer-links">
          <h3>Danh Mục Sản Phẩm</h3>
          <ul>
            <li><Link to="/member1"><i className="bi bi-chevron-right me-1"></i> Thiết Bị Phòng Tắm</Link></li>
            <li><Link to="/member2"><i className="bi bi-chevron-right me-1"></i> Nội Thất Phòng Ngủ</Link></li>
            <li><Link to="/member3"><i className="bi bi-chevron-right me-1"></i> Dụng Cụ Phòng Bếp</Link></li>
            <li><Link to="/member4"><i className="bi bi-chevron-right me-1"></i> Thiết Bị Phòng Khách</Link></li>
            <li><Link to="/member5"><i className="bi bi-chevron-right me-1"></i> Tiện Ích Đời Sống</Link></li>
          </ul>
        </div>

        {/* Social Media Section */}
        <div className="footer-socials">
          <h3>Kết Nối Với Chúng Tôi</h3>
          <p className="text-muted small">Đăng ký nhận thông tin khuyến mãi & voucher giảm giá 20%</p>
          <div className="social_icons_row">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social_circle fb" title="Facebook">
              <i className="bi bi-facebook"></i>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social_circle ig" title="Instagram">
              <i className="bi bi-instagram"></i>
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social_circle yt" title="YouTube">
              <i className="bi bi-youtube"></i>
            </a>
            <a href="https://github.com/PhuocQuan/DevOps" target="_blank" rel="noopener noreferrer" className="social_circle gh" title="GitHub">
              <i className="bi bi-github"></i>
            </a>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="footer-bottom-container">
          <p>© 2026 HomeSHOP DevOps Project. Thực hiện bởi Huỳnh Phước Quân & Team.</p>
          <div className="payment_badges">
            <span className="badge bg-secondary me-2"><i className="bi bi-credit-card me-1"></i> Visa / Master</span>
            <span className="badge bg-secondary me-2"><i className="bi bi-wallet2 me-1"></i> Momo</span>
            <span className="badge bg-secondary"><i className="bi bi-shield-check me-1"></i> SSL Secured</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
