import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

const CheckoutForm = ({ clearCart, userData }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    address: "",
    phone: "",
    note: "",
    paymentMethod: "Thẻ tín dụng", // Phương thức thanh toán mặc định
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (userData) {
      setFormData({
        fullName: userData.fullName || "",
        email: userData.email || "",
        address: userData.address || "",
        phone: userData.phone || "",
        note: "",
        paymentMethod: "Thẻ tín dụng",
      });
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !formData.address || !formData.phone) {
      setError("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    setError("");
    clearCart(); // Xóa giỏ hàng

    // Chuyển sang trang Checkout và truyền dữ liệu
    navigate("/checkout", { state: { formData } });
  };

  return (
    <div className="checkout-form-container">
      <h2>Thông Tin Thanh Toán</h2>
      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="fullName">Họ và tên:</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Nhập họ và tên"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Nhập email"
          />
        </div>

        <div className="form-group">
          <label htmlFor="address">Địa chỉ giao hàng:</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Nhập địa chỉ"
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Số điện thoại:</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Nhập số điện thoại"
          />
        </div>

        <div className="form-group">
          <label htmlFor="note">Ghi chú (tuỳ chọn):</label>
          <textarea
            id="note"
            name="note"
            value={formData.note}
            onChange={handleChange}
            placeholder="Ghi chú thêm cho đơn hàng..."
          />
        </div>

        <div className="form-group">
          <label>Phương thức thanh toán:</label>
          <select
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
          >
            <option value="Thẻ tín dụng">Thẻ tín dụng</option>
            <option value="Thanh toán khi nhận hàng">Thanh toán khi nhận hàng</option>
          </select>
        </div>

        <button type="submit" className="submit-button">
          Đặt hàng
        </button>
      </form>
    </div>
  );
};

export default CheckoutForm;
