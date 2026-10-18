import React from "react";
import { Link } from "react-router-dom";
import Footer from "./Footer";
import "../App.css";

const Contact = () => {
  return (
    <div className="about_page_container">
      {/* Hero Header (No generic banner, sleek title section) */}
      <section className="about_hero_section">
        <div className="about_hero_content">
          <span className="about_badge">
            <i className="bi bi-stars me-1 text-warning"></i> CÂU CHUYỆN THƯƠNG HIỆU
          </span>
          <h1>Chào Mừng Đến Với <span>HomeSHOP</span></h1>
          <p className="about_hero_lead">
            Hệ sinh thái thiết bị gia dụng và nội thất thông minh hàng đầu, mang đến sự tiện nghi, 
            ấm cúng và đẳng cấp cho không gian sống của mọi gia đình Việt.
          </p>
          <div className="about_cta_group">
            <Link to="/" className="btn_primary_gradient">
              <i className="bi bi-bag-check-fill me-2"></i> Khám Phá Sản Phẩm
            </Link>
            <Link to="/support" className="btn_outline_modern">
              <i className="bi bi-headset me-2"></i> Liên Hệ Hỗ Trợ
            </Link>
          </div>
        </div>
      </section>

      {/* Main Story & Showcase */}
      <section className="about_story_section">
        <div className="about_grid_two_col">
          <div className="story_text_col">
            <span className="section_badge">KHỞI NGUỒN</span>
            <h2>Nơi Khởi Đầu Của Những Tổ Ấm Hạnh Phúc</h2>
            <p>
              Được thành lập với khát vọng đơn giản hóa cuộc sống gia đình thông qua các giải pháp công nghệ hiện đại, 
              <strong> HomeSHOP</strong> đã phát triển thành điểm đến tin cậy của hàng ngàn hộ gia đình trên khắp cả nước.
            </p>
            <p>
              Chúng tôi tin rằng ngôi nhà không chỉ là nơi để trở về, mà còn là không gian tận hưởng cuộc sống trọn vẹn nhất. 
              Từ một chiếc nồi cơm điện cao tần thông minh, chiếc máy lọc không khí êm ái đến những tiện ích nhà tắm tinh tế, 
              mỗi sản phẩm tại HomeSHOP đều được tuyển chọn nghiêm ngặt về chất lượng và độ bền.
            </p>
            
            <div className="story_highlights">
              <div className="highlight_item">
                <i className="bi bi-check-circle-fill text-primary"></i>
                <span>100% Sản phẩm chính hãng có nguồn gốc rõ ràng</span>
              </div>
              <div className="highlight_item">
                <i className="bi bi-check-circle-fill text-primary"></i>
                <span>Bảo hành chính hãng 12 - 24 tháng tận nhà</span>
              </div>
              <div className="highlight_item">
                <i className="bi bi-check-circle-fill text-primary"></i>
                <span>Giao hàng hỏa tốc trong 24 giờ tại các thành phố lớn</span>
              </div>
            </div>
          </div>

          <div className="story_image_col">
            <div className="about_image_card_stack">
              <div className="about_showcase_card main_card">
                <img src="/images/bannertulanh.jpg" alt="HomeSHOP Thiết Bị" />
                <div className="showcase_overlay">
                  <h4>Gia Dụng Thông Minh</h4>
                  <p>Tiết kiệm 40% điện năng tiêu thụ</p>
                </div>
              </div>
              <div className="about_floating_badge">
                <i className="bi bi-award-fill text-warning fs-3"></i>
                <div>
                  <strong>Top 10</strong>
                  <span>Thương hiệu Gia dụng Uy tín</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impressive Stats Section */}
      <section className="about_stats_section">
        <div className="stats_container">
          <div className="stat_card">
            <div className="stat_number">10.000+</div>
            <div className="stat_label">Khách Hàng Hài Lòng</div>
          </div>
          <div className="stat_card">
            <div className="stat_number">500+</div>
            <div className="stat_label">Sản Phẩm Đa Dạng</div>
          </div>
          <div className="stat_card">
            <div className="stat_number">99.8%</div>
            <div className="stat_label">Đánh Giá 5 Sao</div>
          </div>
          <div className="stat_card">
            <div className="stat_number">64</div>
            <div className="stat_label">Tỉnh Thành Phủ Sóng</div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="about_values_section">
        <div className="text-center mb-5">
          <span className="section_badge">GIÁ TRỊ CỐT LÕI</span>
          <h2>Kim Chỉ Nam Cho Mọi Hoạt Động</h2>
          <p className="text-muted">Chúng tôi cam kết giữ vững chuẩn mực trong từng sản phẩm và dịch vụ</p>
        </div>

        <div className="values_grid">
          <div className="value_card">
            <div className="value_icon_box icon_blue">
              <i className="bi bi-shield-check"></i>
            </div>
            <h4>Chất Lượng Tiên Quyết</h4>
            <p>Nói không với hàng giả, hàng nhái. Mọi sản phẩm đều có chứng nhận xuất xứ (CO/CQ) minh bạch.</p>
          </div>

          <div className="value_card">
            <div className="value_icon_box icon_amber">
              <i className="bi bi-lightning-charge"></i>
            </div>
            <h4>Công Nghệ Tiên Phong</h4>
            <p>Liên tục cập nhật các thiết bị công nghệ gia dụng thông minh nhất từ Nhật Bản, Hàn Quốc, Châu Âu.</p>
          </div>

          <div className="value_card">
            <div className="value_icon_box icon_green">
              <i className="bi bi-heart-pulse"></i>
            </div>
            <h4>Tận Tâm Phục Vụ</h4>
            <p>Đội ngũ chuyên viên tư vấn nhiệt tình, hỗ trợ kỹ thuật và bảo hành 24/7 không kể ngày lễ Tết.</p>
          </div>

          <div className="value_card">
            <div className="value_icon_box icon_purple">
              <i className="bi bi-wallet2"></i>
            </div>
            <h4>Giá Trị Vượt Trội</h4>
            <p>Mức giá cạnh tranh nhất thị trường cùng hàng loạt chương trình Flash Sale, ưu đãi tri ân khách hàng.</p>
          </div>
        </div>
      </section>

      {/* Technology & DevOps Statement */}
      <section className="about_tech_section">
        <div className="tech_box">
          <div className="tech_icon">
            <i className="bi bi-cloud-check-fill"></i>
          </div>
          <div className="tech_content">
            <h3>Hạ Tầng Công Nghệ Đám Mây Hiện Đại</h3>
            <p>
              Website HomeSHOP được vận hành trên nền tảng điện toán đám mây <strong>AWS EC2</strong>, 
              đóng gói container hóa bằng <strong>Docker</strong> và triển khai tự động qua quy trình <strong>CI/CD</strong>. 
              Đảm bảo hệ thống luôn sẵn sàng 24/7 với độ trễ thấp và độ bảo mật cao nhất cho người dùng.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
