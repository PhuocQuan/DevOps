import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import "../App.css";

const CheckoutForm = ({ clearCart, userData, cartItems = [] }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    address: "",
    phone: "",
    note: "",
    paymentMethod: "Thanh toán khi nhận hàng (COD)",
  });

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Tự động điền dữ liệu người dùng nếu đã đăng nhập
    const storedUser = JSON.parse(localStorage.getItem("userData") || "{}");
    const activeUser = userData || storedUser;

    if (activeUser && (activeUser.fullName || activeUser.username)) {
      setFormData((prev) => ({
        ...prev,
        fullName: activeUser.fullName || activeUser.username || "",
        email: activeUser.email || "",
        address: activeUser.address || "",
        phone: activeUser.phone || "",
      }));
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Tính tổng tiền giỏ hàng
  const totalAmount = cartItems.reduce(
    (acc, item) => acc + (Number(item.price) || 0) * (Number(item.quantity) || 1),
    0
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullName.trim()) {
      setError("Vui lòng nhập họ và tên người nhận.");
      return;
    }
    if (!formData.phone.trim()) {
      setError("Vui lòng nhập số điện thoại liên hệ.");
      return;
    }
    if (!formData.address.trim()) {
      setError("Vui lòng cung cấp địa chỉ nhận hàng.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      // Chuẩn bị danh sách sản phẩm gửi lên MongoDB
      const itemsPayload =
        cartItems.length > 0
          ? cartItems.map((item) => ({
              productId: item.id ? String(item.id) : undefined,
              name: item.name,
              price: Number(item.price) || 0,
              quantity: Number(item.quantity) || 1,
              imageLink: item.imageLink || "/images/bannerhome.jpg",
            }))
          : [
              {
                name: "Đơn hàng nội thất & gia dụng HomeShop",
                price: 500000,
                quantity: 1,
                imageLink: "/images/bannerhome.jpg",
              },
            ];

      const calculatedTotal =
        totalAmount > 0
          ? totalAmount
          : itemsPayload.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);

      const orderPayload = {
        customerName: formData.fullName.trim(),
        customerEmail: formData.email.trim() || "khachhang@homeshop.vn",
        customerPhone: formData.phone.trim(),
        shippingAddress: formData.address.trim(),
        notes: formData.note.trim(),
        paymentMethod: formData.paymentMethod,
        paymentStatus: formData.paymentMethod.includes("COD")
          ? "Chưa thanh toán"
          : "Đã thanh toán",
        items: itemsPayload,
        totalAmount: calculatedTotal,
      };

      // Gửi đơn hàng lên Backend lưu vào MongoDB Atlas
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderPayload),
      });

      if (!response.ok) {
        throw new Error("Không thể lưu đơn hàng vào hệ thống.");
      }

      const createdOrder = await response.json();

      // Xóa giỏ hàng sau khi đặt thành công
      if (typeof clearCart === "function") {
        clearCart();
      }

      // Điều hướng đến trang thông báo và tiến độ đơn hàng
      navigate("/checkout", {
        state: {
          order: createdOrder,
          formData,
        },
      });
    } catch (err) {
      console.error("Lỗi khi gửi đơn hàng:", err);
      setError("Có lỗi xảy ra khi xử lý đơn hàng. Vui lòng thử lại!");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="checkout_page_wrapper">
      <div className="checkout-form-container">
        <div className="checkout_form_header">
          <div className="checkout_header_badge">
            <i className="bi bi-shield-check me-1"></i> BẢO MẬT & TIỆN LỢI
          </div>
          <h2>Thông Tin Giao Hàng & Thanh Toán</h2>
          <p>
            Vui lòng điền thông tin người nhận. Đơn hàng sẽ được chuyển sang bộ phận quản trị 
            <strong> xác nhận trước khi giao</strong>.
          </p>
        </div>

        {error && (
          <div className="checkout_error_banner">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="checkout_styled_form">
          <div className="checkout_form_grid">
            {/* Cột 1: Thông tin người nhận */}
            <div className="form_section_box">
              <h4 className="section_title">
                <i className="bi bi-person-lines-fill me-2 text-primary"></i> 1. Thông Tin Người Nhận
              </h4>

              <div className="form-group mb-3">
                <label htmlFor="fullName">
                  Họ và tên <span className="text-danger">*</span>
                </label>
                <div className="input_with_icon">
                  <i className="bi bi-person"></i>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Ví dụ: Nguyễn Văn A"
                    required
                  />
                </div>
              </div>

              <div className="form-group mb-3">
                <label htmlFor="phone">
                  Số điện thoại <span className="text-danger">*</span>
                </label>
                <div className="input_with_icon">
                  <i className="bi bi-telephone"></i>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Ví dụ: 0912345678"
                    required
                  />
                </div>
              </div>

              <div className="form-group mb-3">
                <label htmlFor="email">Email nhận hóa đơn & cập nhật trạng thái</label>
                <div className="input_with_icon">
                  <i className="bi bi-envelope"></i>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Ví dụ: email@gmail.com"
                  />
                </div>
              </div>

              <div className="form-group mb-3">
                <label htmlFor="address">
                  Địa chỉ giao hàng chi tiết <span className="text-danger">*</span>
                </label>
                <div className="input_with_icon">
                  <i className="bi bi-geo-alt"></i>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành"
                    required
                  />
                </div>
              </div>

              <div className="form-group mb-3">
                <label htmlFor="note">Ghi chú cho người giao hàng (Tùy chọn)</label>
                <textarea
                  id="note"
                  name="note"
                  rows="3"
                  value={formData.note}
                  onChange={handleChange}
                  placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi giao..."
                />
              </div>
            </div>

            {/* Cột 2: Phương thức thanh toán & Tóm tắt giỏ hàng */}
            <div className="form_section_box">
              <h4 className="section_title">
                <i className="bi bi-credit-card me-2 text-primary"></i> 2. Phương Thức Thanh Toán
              </h4>

              <div className="payment_methods_list mb-4">
                <label className={`payment_method_option ${formData.paymentMethod.includes("COD") ? "selected" : ""}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Thanh toán khi nhận hàng (COD)"
                    checked={formData.paymentMethod === "Thanh toán khi nhận hàng (COD)"}
                    onChange={handleChange}
                  />
                  <div className="payment_icon_wrap">
                    <i className="bi bi-cash-stack text-success"></i>
                  </div>
                  <div className="payment_text_wrap">
                    <strong>Thanh toán khi nhận hàng (COD)</strong>
                    <span>Nhận hàng tận nơi, kiểm tra hàng rồi mới thanh toán tiền mặt</span>
                  </div>
                </label>

                <label className={`payment_method_option ${formData.paymentMethod.includes("QR") ? "selected" : ""}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Chuyển khoản ngân hàng (QR Banking)"
                    checked={formData.paymentMethod === "Chuyển khoản ngân hàng (QR Banking)"}
                    onChange={handleChange}
                  />
                  <div className="payment_icon_wrap">
                    <i className="bi bi-qr-code-scan text-primary"></i>
                  </div>
                  <div className="payment_text_wrap">
                    <strong>Chuyển khoản ngân hàng (QR Banking)</strong>
                    <span>Quét mã VietQR thanh toán nhanh 24/7 qua app ngân hàng</span>
                  </div>
                </label>

                <label className={`payment_method_option ${formData.paymentMethod.includes("MoMo") ? "selected" : ""}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Ví điện tử MoMo"
                    checked={formData.paymentMethod === "Ví điện tử MoMo"}
                    onChange={handleChange}
                  />
                  <div className="payment_icon_wrap">
                    <i className="bi bi-wallet2 text-danger"></i>
                  </div>
                  <div className="payment_text_wrap">
                    <strong>Ví điện tử MoMo</strong>
                    <span>Thanh toán an toàn, bảo mật qua ví MoMo</span>
                  </div>
                </label>

                <label className={`payment_method_option ${formData.paymentMethod.includes("tín dụng") ? "selected" : ""}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Thẻ tín dụng / Ghi nợ (Visa/Mastercard)"
                    checked={formData.paymentMethod === "Thẻ tín dụng / Ghi nợ (Visa/Mastercard)"}
                    onChange={handleChange}
                  />
                  <div className="payment_icon_wrap">
                    <i className="bi bi-credit-card-2-back text-info"></i>
                  </div>
                  <div className="payment_text_wrap">
                    <strong>Thẻ tín dụng / Ghi nợ quốc tế</strong>
                    <span>Hỗ trợ thẻ Visa, Mastercard, JCB</span>
                  </div>
                </label>
              </div>

              {/* Tóm tắt đơn hàng */}
              <div className="order_summary_preview">
                <h5><i className="bi bi-receipt me-2"></i> Tóm Tắt Đơn Hàng</h5>
                <div className="summary_row">
                  <span>Số lượng mặt hàng:</span>
                  <strong>{cartItems.length} món</strong>
                </div>
                <div className="summary_row">
                  <span>Phí vận chuyển:</span>
                  <strong className="text-success">Miễn phí giao hàng</strong>
                </div>
                <div className="summary_divider"></div>
                <div className="summary_row total">
                  <span>Tổng tiền thanh toán:</span>
                  <span className="summary_total_price">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(totalAmount || 500000)}
                  </span>
                </div>
              </div>

              <div className="order_process_notice mb-3">
                <i className="bi bi-info-circle me-2 text-primary"></i>
                Sau khi bấm <strong>"Xác nhận đặt hàng"</strong>, đơn hàng sẽ được lưu vào hệ thống và chuyển sang 
                bảng <strong>Admin để xác nhận & chuẩn bị đơn hàng</strong>.
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="checkout_submit_btn"
              >
                {submitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Đang lưu đơn hàng lên hệ thống...
                  </>
                ) : (
                  <>
                    <i className="bi bi-bag-check-fill me-2"></i> Xác Nhận Đặt Hàng
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default CheckoutForm;
