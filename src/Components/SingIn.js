/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    username: "",
    password: "",
    confirmPassword: "",
    dob: "",
    gender: "Khác",
    address: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false); // Hiển thị mật khẩu
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Hiển thị mật khẩu xác nhận
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Kiểm tra lại từng giá trị khi thay đổi
    if (name === "fullName" && value) {
      setErrors((prevErrors) => ({ ...prevErrors, fullName: "" }));
    }
    if (name === "email" && /\S+@\S+\.\S+/.test(value)) {
      setErrors((prevErrors) => ({ ...prevErrors, email: "" }));
    }
    if (name === "phone" && value.length >= 10) {
      setErrors((prevErrors) => ({ ...prevErrors, phone: "" }));
    }
    if (name === "username" && value) {
      setErrors((prevErrors) => ({ ...prevErrors, username: "" }));
    }
    if (name === "password" && value.length >= 6) {
      setErrors((prevErrors) => ({ ...prevErrors, password: "" }));
    }
    if (name === "confirmPassword" && value === formData.password) {
      setErrors((prevErrors) => ({ ...prevErrors, confirmPassword: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Kiểm tra các trường bắt buộc
    const newErrors = {};
  
    // Kiểm tra các trường thông tin
    if (!formData.fullName) {
      newErrors.fullName = "Tên đầy đủ là bắt buộc.";
    }
    if (!formData.email) {
      newErrors.email = "Email là bắt buộc.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ.";
    }
    if (!formData.phone) {
      newErrors.phone = "Số điện thoại là bắt buộc.";
    } else if (formData.phone.length < 10) {
      newErrors.phone = "Số điện thoại phải ít nhất 10 chữ số.";
    }
    if (!formData.username) {
      newErrors.username = "Tên đăng nhập là bắt buộc.";
    }
    if (!formData.password) {
      newErrors.password = "Mật khẩu là bắt buộc.";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải ít nhất 6 ký tự.";
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Xác nhận mật khẩu là bắt buộc.";
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp.";
    }
    if (!formData.dob) {
      newErrors.dob = "Ngày sinh là bắt buộc.";
    }
    if (formData.gender === "Khác") {
      newErrors.gender = "Giới tính là bắt buộc.";
    }
    if (!formData.address) {
      newErrors.address = "Địa chỉ là bắt buộc.";
    }
  
    // Nếu có lỗi thì hiển thị thông báo lỗi và không gửi dữ liệu
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      alert("Vui lòng điền đầy đủ tất cả các thông tin yêu cầu để đăng ký.");
      return; // Dừng quá trình đăng ký nếu có lỗi
    }
  
    try {
      // Kiểm tra xem thông tin đã tồn tại hay chưa (trùng lặp)
      const checkResponse = await fetch("http://localhost:2300/user");
      const users = await checkResponse.json();
  
      let duplicateErrors = {};
      const isDuplicateEmail = users.some(user => user.email === formData.email);
      const isDuplicatePhone = users.some(user => user.phone === formData.phone);
      const isDuplicateUsername = users.some(user => user.username === formData.username);
  
      if (isDuplicateEmail) duplicateErrors.email = "Email này đã được đăng ký.";
      if (isDuplicatePhone) duplicateErrors.phone = "Số điện thoại này đã tồn tại.";
      if (isDuplicateUsername) duplicateErrors.username = "Tên đăng nhập này đã có người sử dụng.";
  
      if (Object.keys(duplicateErrors).length > 0) {
        setErrors(duplicateErrors);
        return; // Dừng quá trình nếu có lỗi trùng lặp
      }
  
      // Nếu không có lỗi, gửi dữ liệu đăng ký lên API
      const { confirmPassword, ...dataToSend } = formData;
  
      const response = await fetch("http://localhost:2300/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });
  
      if (response.ok) {
        alert("Đăng ký thành công!");
        navigate("/login");
      } else {
        const errorData = await response.json();
        alert(`Đăng ký thất bại: ${errorData.message || "Lỗi không xác định."}`);
      }
    } catch (error) {
      alert(`Đăng ký thất bại: ${error.message}`);
    }
  };
  
  
  

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Đăng Ký</h2>
        {/* Form như cũ */}
        <input
          type="text"
          name="fullName"
          placeholder="Tên đầy đủ của bạn"
          value={formData.fullName}
          onChange={handleChange}
        />
        {errors.fullName && <small>{errors.fullName}</small>}
        <input
          type="email"
          name="email"
          placeholder="Địa chỉ email"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <small>{errors.email}</small>}
        <input
          type="text"
          name="phone"
          placeholder="Số điện thoại"
          value={formData.phone}
          onChange={handleChange}
        />
        {errors.phone && <small>{errors.phone}</small>}
        <input
          type="text"
          name="username"
          placeholder="Tên đăng nhập"
          value={formData.username}
          onChange={handleChange}
        />
        {errors.username && <small>{errors.username}</small>}
        <div className="password-input-container">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Mật khẩu"
            value={formData.password}
            onChange={handleChange}
          />
          <span
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "👁️" : "🙈"}
          </span>
        </div>
        {errors.password && <small>{errors.password}</small>}
        <div className="password-input-container">
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Xác nhận mật khẩu"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          <span
            className="password-toggle"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? "👁️" : "🙈"}
          </span>
        </div>
        {errors.confirmPassword && <small>{errors.confirmPassword}</small>}
        <input
          type="date"
          name="dob"
          placeholder="dd/mm/yyyy"
          value={formData.dob}
          onChange={handleChange}
        />
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
        >
          <option value="Khác">Giới tính (Khác)</option>
          <option value="Nam">Nam</option>
          <option value="Nữ">Nữ</option>
        </select>
        <input
          type="text"
          name="address"
          placeholder="Địa chỉ"
          value={formData.address}
          onChange={handleChange}
        />
        <a href="#" onClick={() => navigate("/login")}>
          Đăng Nhập
        </a>
        <button type="submit">Đăng Ký</button>
      </form>
    </div>
  );
};

export default SignUp;
