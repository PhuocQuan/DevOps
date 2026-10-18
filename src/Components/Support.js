import React, { useState } from 'react';
import Footer from './Footer';
import "../App.css";

const Support = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    topic: 'Tư vấn sản phẩm',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({ name: '', phone: '', email: '', topic: 'Tư vấn sản phẩm', message: '' });
      setTimeout(() => setSubmitSuccess(false), 5000);
    }, 1500);
  };

  return (
    <div className="support_page_container">
      {/* Hero Header */}
      <section className="support_hero_section">
        <div className="support_hero_content">
          <span className="section_badge">CHĂM SÓC KHÁCH HÀNG 24/7</span>
          <h1>Chúng Tôi Có Thể Giúp Gì Cho Bạn?</h1>
          <p className="support_hero_sub">
            Đội ngũ tư vấn viên và chuyên viên kỹ thuật HomeSHOP luôn sẵn sàng giải đáp mọi thắc mắc và hỗ trợ bạn nhanh nhất.
          </p>
        </div>
      </section>

      {/* 4 Contact Channels */}
      <section className="support_channels_section">
        <div className="channels_grid">
          <div className="channel_card">
            <div className="channel_icon icon_phone">
              <i className="bi bi-telephone-fill"></i>
            </div>
            <h4>Tổng Đài Miễn Phí</h4>
            <p className="channel_highlight">1900 6868</p>
            <span className="channel_subtext">8:00 - 21:30 (Thứ 2 - CN)</span>
          </div>

          <div className="channel_card">
            <div className="channel_icon icon_chat">
              <i className="bi bi-chat-dots-fill"></i>
            </div>
            <h4>Hỗ Trợ Trực Tuyến</h4>
            <p className="channel_highlight">Zalo / Messenger</p>
            <span className="channel_subtext">Phản hồi tức thì trong 5 phút</span>
          </div>

          <div className="channel_card">
            <div className="channel_icon icon_email">
              <i className="bi bi-envelope-fill"></i>
            </div>
            <h4>Gửi Email Hỗ Trợ</h4>
            <p className="channel_highlight">support@homeshop.vn</p>
            <span className="channel_subtext">Giải quyết yêu cầu trong 24h</span>
          </div>

          <div className="channel_card">
            <div className="channel_icon icon_store">
              <i className="bi bi-geo-alt-fill"></i>
            </div>
            <h4>Trực Tiếp Tại Showroom</h4>
            <p className="channel_highlight">Hệ Thống Toàn Quốc</p>
            <span className="channel_subtext">Hà Nội • Đà Nẵng • TP.HCM</span>
          </div>
        </div>
      </section>

      {/* Interactive Form & FAQ Grid */}
      <section className="support_body_section">
        <div className="support_split_container">
          {/* Form */}
          <div className="support_form_card">
            <h3><i className="bi bi-pencil-square me-2 text-primary"></i> Gửi Yêu Cầu Hỗ Trợ</h3>
            <p className="text-muted small mb-4">Điền thông tin bên dưới, chuyên viên CSKH sẽ liên hệ lại bạn trong thời gian sớm nhất.</p>

            {submitSuccess && (
              <div className="alert alert-success d-flex align-items-center mb-4">
                <i className="bi bi-check-circle-fill fs-4 me-2"></i>
                <div>
                  <strong>Gửi yêu cầu thành công!</strong> Cảm ơn bạn, chúng tôi sẽ liên hệ lại trong vòng 15 phút.
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form_group_row">
                <div className="form_group">
                  <label>Họ và tên *</label>
                  <input
                    type="text"
                    required
                    placeholder="Nguyễn Văn A"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="form_group">
                  <label>Số điện thoại *</label>
                  <input
                    type="tel"
                    required
                    placeholder="0987 654 321"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>

              <div className="form_group">
                <label>Địa chỉ Email</label>
                <input
                  type="email"
                  placeholder="example@gmail.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <div className="form_group">
                <label>Chủ đề cần hỗ trợ</label>
                <select
                  value={formData.topic}
                  onChange={(e) => setFormData({...formData, topic: e.target.value})}
                >
                  <option value="Tư vấn sản phẩm">Tư vấn mua hàng & thông số kỹ thuật</option>
                  <option value="Bảo hành sửa chữa">Yêu cầu bảo hành / đổi mới sản phẩm</option>
                  <option value="Đơn hàng & Giao vận">Tra cứu tình trạng vận chuyển đơn hàng</option>
                  <option value="Khác">Góp ý dịch vụ hoặc yêu cầu khác</option>
                </select>
              </div>

              <div className="form_group">
                <label>Nội dung chi tiết *</label>
                <textarea
                  rows="4"
                  required
                  placeholder="Mô tả cụ thể vấn đề hoặc mã sản phẩm/đơn hàng cần hỗ trợ..."
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                ></textarea>
              </div>

              <button type="submit" className="btn_submit_support" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Đang gửi thông tin...
                  </>
                ) : (
                  <>
                    <i className="bi bi-send-fill me-2"></i> Gửi Yêu Cầu Ngay
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Quick FAQ List */}
          <div className="support_quick_faq">
            <h3><i className="bi bi-lightbulb-fill text-warning me-2"></i> Hướng Dẫn Nhanh</h3>
            <div className="quick_faq_item">
              <h6>1. Tra cứu bảo hành như thế nào?</h6>
              <p>Bạn chỉ cần nhắn tin số điện thoại đã mua hàng tới Zalo HomeSHOP Official để nhận phiếu bảo hành điện tử tức thì.</p>
            </div>
            <div className="quick_faq_item">
              <h6>2. Sản phẩm bị móp méo khi vận chuyển?</h6>
              <p>Quý khách vui lòng từ chối nhận hàng và báo ngay hotline 1900 6868, HomeSHOP sẽ gửi đơn hàng mới ngay trong ngày.</p>
            </div>
            <div className="quick_faq_item">
              <h6>3. Hình thức thanh toán khi nhận hàng (COD)?</h6>
              <p>HomeSHOP hỗ trợ thanh toán tiền mặt trực tiếp hoặc quét mã VietQR khi nhận hàng từ bưu tá.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Support;
