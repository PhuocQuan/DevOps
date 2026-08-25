import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../App.css";
const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Lấy dữ liệu từ location.state
  const { formData } = location.state || {};

  // Nếu không có dữ liệu, điều hướng về trang chính
  if (!formData) {
    navigate("/");
    return null;
  }

  return (
    <div className="checkout">
      <div className="checkout-message">
        <h2>Đặt Hàng Thành Công!</h2>

        <div className="order-details">
          <p><strong>Họ và tên:</strong> {formData.fullName}</p>
          <p><strong>Email:</strong> {formData.email}</p>
          <p><strong>Địa chỉ giao hàng:</strong> {formData.address}</p>
          <p><strong>Số điện thoại:</strong> {formData.phone}</p>
          {formData.note && <p><strong>Ghi chú:</strong> {formData.note}</p>}
        </div>

        <div className="payment-method">
          <p><strong>Phương thức thanh toán:</strong> {formData.paymentMethod} </p>
        </div>

        <h5>Cảm ơn bạn đã mua hàng tại chúng tôi!</h5>
        <button onClick={() => navigate("/")}>Quay về trang chủ</button>
      </div>
    </div>
  );
};

export default Checkout;
