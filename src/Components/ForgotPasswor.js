import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    dob: "",
    username: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [showNewPassword, setShowNewPassword] = useState(false); // Password visibility toggle
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false); // Confirm password visibility toggle
  const [success, setSuccess] = useState(false); // Success state to show success message
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Reset errors when the user starts typing
    if (value) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email là bắt buộc.";
    if (!formData.phone) newErrors.phone = "Số điện thoại là bắt buộc.";
    if (!formData.dob) newErrors.dob = "Ngày sinh là bắt buộc.";
    if (!formData.username) newErrors.username = "Tên đăng nhập là bắt buộc.";
    if (!formData.newPassword || formData.newPassword.length < 6)
      newErrors.newPassword = "Mật khẩu mới phải có ít nhất 6 ký tự.";
    if (formData.newPassword !== formData.confirmNewPassword)
      newErrors.confirmNewPassword = "Mật khẩu xác nhận không khớp.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      try {
        const response = await fetch("http://localhost:2300/user");
        const users = await response.json();
        
        // Find user matching the form data
        const user = users.find(
          (user) =>
            user.email === formData.email &&
            user.phone === formData.phone &&
            user.dob === formData.dob &&
            user.username === formData.username
        );

        if (user) {
          // Update the user's password
          user.password = formData.newPassword;

          // Send the updated user data back to the API
          const updateResponse = await fetch(`http://localhost:2300/user/${user.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
          });

          if (updateResponse.ok) {
            setSuccess(true);
            alert("Đặt lại mật khẩu thành công!");
            navigate("/login"); // Redirect to login page
          } else {
            setErrors({ general: "Có lỗi khi cập nhật mật khẩu. Vui lòng thử lại!" });
          }
        } else {
          setErrors({ general: "Thông tin không khớp. Vui lòng thử lại!" });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setErrors({ general: "Có lỗi xảy ra. Vui lòng thử lại sau!" });
      }
    }
  };

  return (
    <div className="forgot-password-container">
      <form className="forgot-password-form" onSubmit={handleSubmit}>
        <h2>Quên Mật Khẩu</h2>
        {errors.general && <small className="error">{errors.general}</small>}
        <input
          type="email"
          name="email"
          placeholder="Địa chỉ Email"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <small className="error">{errors.email}</small>}
        <input
          type="text"
          name="phone"
          placeholder="Số điện thoại"
          value={formData.phone}
          onChange={handleChange}
        />
        {errors.phone && <small className="error">{errors.phone}</small>}
        <input
          type="date"
          name="dob"
          placeholder="Ngày sinh (dd/mm/yyyy)"
          value={formData.dob}
          onChange={handleChange}
        />
        {errors.dob && <small className="error">{errors.dob}</small>}
        <input
          type="text"
          name="username"
          placeholder="Tên đăng nhập"
          value={formData.username}
          onChange={handleChange}
        />
        {errors.username && <small className="error">{errors.username}</small>}
        
        <div className="password-input-container">
          <input
            type={showNewPassword ? "text" : "password"}
            name="newPassword"
            placeholder="Mật khẩu mới"
            value={formData.newPassword}
            onChange={handleChange}
          />
          <span
            className="password-toggle"
            onClick={() => setShowNewPassword(!showNewPassword)}
          >
            {showNewPassword ? "👁️" : "🙈"}
          </span>
        </div>
        {errors.newPassword && <small className="error">{errors.newPassword}</small>}
        
        <div className="password-input-container">
          <input
            type={showConfirmNewPassword ? "text" : "password"}
            name="confirmNewPassword"
            placeholder="Xác nhận mật khẩu mới"
            value={formData.confirmNewPassword}
            onChange={handleChange}
          />
          <span
            className="password-toggle"
            onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
          >
            {showConfirmNewPassword ? "👁️" : "🙈"}
          </span>
        </div>
        {errors.confirmNewPassword && (
          <small className="error">{errors.confirmNewPassword}</small>
        )}
        
        <button type="submit">Đặt Lại Mật Khẩu</button>
        <button type="button" onClick={() => navigate("/login")}>
          Quay lại Đăng Nhập
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
