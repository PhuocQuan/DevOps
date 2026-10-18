import React from 'react';
import Footer from './Footer';
import "../App.css";

const Service = () => {

  const faqs = [
    {
      q: "Làm thế nào để kích hoạt bảo hành điện tử?",
      a: "Tất cả sản phẩm mua tại HomeSHOP đều được tự động kích hoạt bảo hành qua số điện thoại đặt hàng của quý khách ngay khi đơn hàng hoàn tất giao nhận."
    },
    {
      q: "Quy trình đổi trả hàng trong 30 ngày diễn ra như thế nào?",
      a: "Nếu sản phẩm gặp lỗi kỹ thuật từ nhà sản xuất trong vòng 30 ngày, quý khách chỉ cần liên hệ hotline 1900 6868, nhân viên kỹ thuật sẽ đến tận nhà kiểm tra và đổi sản phẩm mới 100% hoàn toàn miễn phí."
    },
    {
      q: "Tôi có được kiểm tra hàng trước khi thanh toán không?",
      a: "Chắc chắn có! HomeSHOP luôn áp dụng chính sách 'Đồng kiểm khi nhận hàng'. Quý khách được mở hộp kiểm tra ngoại quan sản phẩm trước khi thanh toán tiền cho nhân viên giao hàng."
    },
    {
      q: "Thời gian giao hàng mất bao lâu?",
      a: "Nội thành các thành phố lớn (Hà Nội, TP.HCM, Đà Nẵng): Giao nhanh từ 2 - 4 giờ hoặc trong ngày. Các tỉnh thành khác: Giao từ 1 - 3 ngày làm việc qua các đối tác vận chuyển uy tín."
    }
  ];

  return (
    <div className="policy_page_container">
      {/* Header Section */}
      <section className="policy_hero_section">
        <div className="policy_hero_content">
          <span className="section_badge">TRUNG TÂM MINH BẠCH</span>
          <h1>Chính Sách & Điều Khoản Dịch Vụ</h1>
          <p className="policy_hero_sub">
            Cam kết quyền lợi tối đa cho khách hàng với quy trình bảo hành, đổi trả và giao nhận rõ ràng, nhanh chóng và tận tâm.
          </p>
        </div>
      </section>

      {/* 4 Pillars of Policy */}
      <section className="policy_pillars_section">
        <div className="policy_grid">
          <div className="policy_card">
            <div className="policy_icon_wrap icon_blue">
              <i className="bi bi-shield-check"></i>
            </div>
            <h3>Bảo Hành Chính Hãng</h3>
            <ul>
              <li>Bảo hành 12 - 24 tháng theo tiêu chuẩn của nhà sản xuất.</li>
              <li>Bảo hành điện tử thông minh qua SĐT, không cần giữ giấy tờ.</li>
              <li>Hỗ trợ kỹ thuật viên kiểm tra và sửa chữa tận nhà.</li>
            </ul>
          </div>

          <div className="policy_card">
            <div className="policy_icon_wrap icon_amber">
              <i className="bi bi-arrow-repeat"></i>
            </div>
            <h3>Đổi Trả 30 Ngày</h3>
            <ul>
              <li>Đổi mới 1 - 1 miễn phí trong 30 ngày nếu phát sinh lỗi kỹ thuật.</li>
              <li>Hoàn tiền 100% nếu phát hiện hàng không đúng mô tả.</li>
              <li>Thủ tục tinh gọn, xử lý nhanh trong 24 giờ làm việc.</li>
            </ul>
          </div>

          <div className="policy_card">
            <div className="policy_icon_wrap icon_green">
              <i className="bi bi-truck"></i>
            </div>
            <h3>Giao Nhận Toàn Quốc</h3>
            <ul>
              <li>Miễn phí vận chuyển cho tất cả đơn hàng từ 500.000đ.</li>
              <li>Giao hàng hỏa tốc trong 2 giờ tại khu vực nội thành.</li>
              <li>Cho phép mở hộp đồng kiểm tra trước khi thanh toán.</li>
            </ul>
          </div>

          <div className="policy_card">
            <div className="policy_icon_wrap icon_purple">
              <i className="bi bi-lock-fill"></i>
            </div>
            <h3>Bảo Mật & Thanh Toán</h3>
            <ul>
              <li>Mã hóa dữ liệu chuẩn SSL 256-bit an toàn tuyệt đối.</li>
              <li>Đa dạng hình thức: Tiền mặt (COD), Thẻ ATM/Visa, Ví điện tử.</li>
              <li>Cam kết bảo mật 100% thông tin cá nhân của khách hàng.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="policy_faq_section">
        <div className="faq_container">
          <div className="text-center mb-4">
            <span className="section_badge">GIẢI ĐÁP NHANH</span>
            <h2>Câu Hỏi Thường Gặp Về Chính Sách</h2>
          </div>
          <div className="faq_list">
            {faqs.map((item, index) => (
              <div key={index} className="faq_item_card">
                <div className="faq_question">
                  <i className="bi bi-question-circle-fill text-primary me-2"></i>
                  <h5>{item.q}</h5>
                </div>
                <p className="faq_answer">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Service;
