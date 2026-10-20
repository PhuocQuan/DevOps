import React from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import Footer from "./Footer";
import "../App.css";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Lấy dữ liệu từ location.state (hỗ trợ cả order object và formData)
  const { formData, order } = location.state || {};

  // Nếu không có dữ liệu, điều hướng về trang chính
  if (!formData && !order) {
    return (
      <div className="checkout_empty_state">
        <div className="empty_icon">
          <i className="bi bi-cart-x"></i>
        </div>
        <h3>Không tìm thấy thông tin đơn hàng</h3>
        <p>Vui lòng chọn sản phẩm và tiến hành đặt hàng lại.</p>
        <button onClick={() => navigate("/")} className="checkout_home_btn">
          <i className="bi bi-arrow-left me-2"></i> Quay về trang chủ
        </button>
      </div>
    );
  }

  const orderData = order || {
    orderCode: "HD-" + Math.floor(1000 + Math.random() * 9000),
    customerName: formData?.fullName || "Khách Hàng",
    customerEmail: formData?.email || "",
    customerPhone: formData?.phone || "",
    shippingAddress: formData?.address || "",
    notes: formData?.note || "",
    paymentMethod: formData?.paymentMethod || "Thanh toán khi nhận hàng (COD)",
    paymentStatus: formData?.paymentMethod?.includes("COD") ? "Chưa thanh toán" : "Đã thanh toán",
    status: "Chờ xác nhận",
    estimatedDelivery: "2 - 4 ngày làm việc",
    items: formData?.items || [],
    totalAmount: formData?.totalAmount || 0,
    createdAt: new Date().toISOString(),
  };

  return (
    <div className="checkout_page_wrapper">
      <div className="checkout_container">
        {/* Success Card Header */}
        <div className="checkout_success_hero">
          <div className="success_icon_animated">
            <i className="bi bi-check2-circle"></i>
          </div>
          <h2>Đặt Hàng Thành Công!</h2>
          <p className="order_code_tag">
            Mã đơn hàng: <strong>#{orderData.orderCode || "HD-8241"}</strong>
          </p>
          <p className="success_subtext">
            Cảm ơn bạn đã mua sắm tại <strong>HomeSHOP</strong>. Đơn hàng của bạn đã được chuyển đến 
            quản trị viên để <strong>xác nhận và chuẩn bị đóng gói</strong>.
          </p>
        </div>

        {/* Order Lifecycle Stepper */}
        <div className="order_stepper_card">
          <h4 className="stepper_title">
            <i className="bi bi-truck me-2 text-primary"></i> Tiến Độ Xử Lý Đơn Hàng
          </h4>
          <div className="order_steps_bar">
            {/* Step 1 */}
            <div className="step_item completed">
              <div className="step_circle">
                <i className="bi bi-check-lg"></i>
              </div>
              <div className="step_label">
                <strong>Đặt Hàng</strong>
                <span>Thành công</span>
              </div>
            </div>
            <div className="step_line completed"></div>

            {/* Step 2 */}
            <div className="step_item active">
              <div className="step_circle">
                <span className="step_pulse"></span>
                <i className="bi bi-shield-check"></i>
              </div>
              <div className="step_label">
                <strong>Chờ Admin Duyệt</strong>
                <span className="text-warning">Đang xử lý</span>
              </div>
            </div>
            <div className="step_line"></div>

            {/* Step 3 */}
            <div className="step_item">
              <div className="step_circle">
                <i className="bi bi-box-seam"></i>
              </div>
              <div className="step_label">
                <strong>Giao Hàng</strong>
                <span>Dự kiến 2-4 ngày</span>
              </div>
            </div>
            <div className="step_line"></div>

            {/* Step 4 */}
            <div className="step_item">
              <div className="step_circle">
                <i className="bi bi-house-check"></i>
              </div>
              <div className="step_label">
                <strong>Nhận Hàng</strong>
                <span>Hoàn tất</span>
              </div>
            </div>
          </div>

          <div className="delivery_alert_banner">
            <i className="bi bi-clock-history me-2 text-warning fs-5"></i>
            <div>
              <strong>Thời gian nhận hàng dự kiến: </strong>
              <span className="badge_estimate">{orderData.estimatedDelivery || "2 - 4 ngày làm việc"}</span>
              <p className="m-0 text-muted small">
                Ngay sau khi Admin kiểm tra và duyệt đơn, nhân viên giao hàng sẽ liên hệ với bạn qua số điện thoại 
                <strong> {orderData.customerPhone}</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* 2 Columns: Order Details & Products Breakdown */}
        <div className="checkout_details_grid">
          {/* Column 1: Customer & Delivery Info */}
          <div className="checkout_info_card">
            <h4><i className="bi bi-geo-alt-fill me-2 text-danger"></i> Thông Tin Nhận Hàng</h4>
            
            <div className="info_row">
              <span className="info_label">Họ và tên:</span>
              <span className="info_value fw-bold">{orderData.customerName}</span>
            </div>

            <div className="info_row">
              <span className="info_label">Số điện thoại:</span>
              <span className="info_value">{orderData.customerPhone}</span>
            </div>

            <div className="info_row">
              <span className="info_label">Email liên hệ:</span>
              <span className="info_value">{orderData.customerEmail || "Không cung cấp"}</span>
            </div>

            <div className="info_row">
              <span className="info_label">Địa chỉ nhận hàng:</span>
              <span className="info_value">{orderData.shippingAddress}</span>
            </div>

            {orderData.notes && (
              <div className="info_row">
                <span className="info_label">Ghi chú:</span>
                <span className="info_value text-muted fst-italic">{orderData.notes}</span>
              </div>
            )}

            <div className="info_row">
              <span className="info_label">Phương thức:</span>
              <span className="info_value text-primary fw-bold">
                <i className="bi bi-credit-card-2-front me-1"></i> {orderData.paymentMethod}
              </span>
            </div>

            <div className="info_row">
              <span className="info_label">Trạng thái thanh toán:</span>
              <span className={`badge_payment ${orderData.paymentStatus === "Đã thanh toán" ? "paid" : "unpaid"}`}>
                {orderData.paymentStatus || "Chưa thanh toán"}
              </span>
            </div>
          </div>

          {/* Column 2: Ordered Items List */}
          <div className="checkout_info_card">
            <h4><i className="bi bi-bag-check-fill me-2 text-success"></i> Sản Phẩm Đã Đặt</h4>
            
            {orderData.items && orderData.items.length > 0 ? (
              <div className="ordered_items_list">
                {orderData.items.map((item, idx) => (
                  <div key={idx} className="ordered_item_row">
                    <img 
                      src={item.imageLink || "/images/bannerhome.jpg"} 
                      alt={item.name} 
                      className="ordered_item_thumb"
                      onError={(e) => { e.target.src = "/images/bannerhome.jpg"; }}
                    />
                    <div className="ordered_item_info">
                      <div className="ordered_item_name">{item.name}</div>
                      <div className="ordered_item_qty">Số lượng: <strong>x{item.quantity}</strong></div>
                    </div>
                    <div className="ordered_item_price">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(Number(item.price) * Number(item.quantity))}
                    </div>
                  </div>
                ))}

                <div className="ordered_total_divider"></div>
                <div className="ordered_total_row">
                  <span>Tổng tiền thanh toán:</span>
                  <span className="ordered_total_price">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(orderData.totalAmount)}
                  </span>
                </div>
              </div>
            ) : (
              <div className="empty_items_note text-center py-4 text-muted">
                <i className="bi bi-box2 fs-2 d-block mb-2"></i>
                Chi tiết sản phẩm đã được gửi đến hệ thống quản trị đơn hàng.
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="checkout_bottom_actions">
          <Link to="/" className="checkout_btn_continue">
            <i className="bi bi-shop me-2"></i> Tiếp Tục Mua Sắm
          </Link>
          <Link to="/member4" className="checkout_btn_explore">
            <i className="bi bi-grid-fill me-2"></i> Khám Phá Sản Phẩm Khác
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;
