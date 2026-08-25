/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Login = ({ setIsLoggedIn, setIsAdmin, setUser }) => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State để kiểm soát hiển thị mật khẩu
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:2300/user");
      if (!response.ok) {
        throw new Error("Không thể lấy dữ liệu người dùng từ API.");
      }

      const users = await response.json();
      const user = users.find(
        (user) =>
          user.username === formData.username && user.password === formData.password
      );

      if (user) {
        localStorage.setItem("userData", JSON.stringify(user));
        setUser(user);

        if (user.username === "admin" && user.password === "admin123") {
          localStorage.setItem("isAdmin", "true");
          setIsAdmin(true);
        } else {
          localStorage.setItem("isAdmin", "false");
          setIsAdmin(false);
        }

        localStorage.setItem("isLoggedIn", "true");
        setIsLoggedIn(true);

        alert("Đăng nhập thành công!");
        
        // Kiểm tra và chuyển hướng về trang trước đó
        const returnUrl = localStorage.getItem('returnUrl');
        if (returnUrl) {
          localStorage.removeItem('returnUrl'); // Xóa returnUrl sau khi sử dụng
          navigate(returnUrl);
        } else {
          navigate(user.username === "admin" ? "/admin" : "/");
        }
      } else {
        setError("Tên đăng nhập hoặc mật khẩu không đúng.");
      }
    } catch (error) {
      setError("Đã xảy ra lỗi, vui lòng thử lại.");
      console.error(error);
    }
  };

  // Cập nhật trạng thái isLoggedIn và isAdmin khi component mount
  useEffect(() => {
    const loggedInStatus = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedInStatus); // Đảm bảo trạng thái đăng nhập đồng bộ với localStorage
  }, [setIsLoggedIn]);

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Đăng Nhập</h2>
        <input
          type="text"
          name="username"
          placeholder="Tên đăng nhập"
          value={formData.username}
          onChange={handleChange}
        />
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
            {showPassword ? "👁️" : "🙈"} {/* Biểu tượng con mắt */}
          </span>
        </div>
        <div className="link-container">
          <a href="#" onClick={() => navigate("/forgotpassword")}>Forgot Password</a>
          <a href="#" onClick={() => navigate("/signup")}>Sign</a>
        </div>
        {error && <small>{error}</small>}
        <button type="submit">Đăng Nhập</button>
      </form>
    </div>
  );
};

export default Login;
