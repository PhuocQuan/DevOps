import { BrowserRouter as Router, Route, Routes, Link, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./Components/Home";
import Login from "./Components/Login";
import SignUp from "./Components/SingIn";
import ForgotPassword from "./Components/ForgotPasswor";
import ProductDetail from "./Components/ProductDetail";
import Cart from "./Components/Cart";
import Checkout from "./Components/Checkout";
import CheckoutForm from "./Components/CheckoutForm";
import Member1 from "./Components/Member1";
import Member2 from "./Components/Member2";
import Member3 from "./Components/Member3";
import Member4 from "./Components/Member4";
import Member5 from "./Components/Member5";
import ScrollToTop from "./Components/ScrollToTop";
import Service from "./Components/Service";
import Contact from "./Components/Contact";
import Support from "./Components/Support";
import Admin from "./Components/Admin"
import UserManagemant from "./Components/UserManagement"
import ProductManagement from "./Components/ProductManagement";
import UserProfile from "./Components/UserProfile";
import "./App.css";

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); // Xác định trạng thái admin
  const [user, setUser] = useState(null);

  // Thêm sản phẩm vào giỏ hàng hoặc tăng số lượng nếu đã tồn tại
  const addToCart = (product) => {
    const existingProductIndex = cartItems.findIndex(
      (item) => item.name === product.name
    );

    if (existingProductIndex !== -1) {
      const updatedCart = [...cartItems];
      updatedCart[existingProductIndex].quantity += 1;
      setCartItems(updatedCart);
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };


  const removeFromCart = (index) => {
    const newCartItems = [...cartItems];
    newCartItems.splice(index, 1);
    setCartItems(newCartItems);
  };

  const clearCart = () => {
    setCartItems([]);
  };


  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false); // Reset trạng thái admin
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("isAdmin");
  };

  useEffect(() => {
    const loggedInStatus = localStorage.getItem("isLoggedIn") === "true";
    const adminStatus = localStorage.getItem("isAdmin") === "true";
    const storedUserData = JSON.parse(localStorage.getItem("userData") || "{}");
  
    setIsLoggedIn(loggedInStatus);
    setIsAdmin(adminStatus);
    setUser(storedUserData); // Lưu thông tin user vào state
  }, []);
  
  // Navbar cho admin
const AdminNavbar = () => (
  <nav className="nav admin_navbar_glass">
    <Link to="/admin" className="nav_brand">
      <div className="brand_icon admin_brand_icon">
        <i className="bi bi-shield-lock-fill"></i>
      </div>
      <div className="brand_text">
        <span className="brand_title">Home<span className="brand_accent">ADMIN</span></span>
        <span className="brand_subtitle">Bảng Quản Trị Hệ Thống</span>
      </div>
    </Link>
    <div className="nav_links">
      <Link to="/admin" className="nav_link">
        <i className="bi bi-speedometer2"></i> Tổng Quan
      </Link>
      <Link to="/productmanagement" className="nav_link">
        <i className="bi bi-box-seam"></i> Quản Lý Sản Phẩm
      </Link>
      <Link to="/usermanagement" className="nav_link">
        <i className="bi bi-people"></i> Quản Lý Người Dùng
      </Link>
      <button onClick={handleLogout} className="nav_link nav_logout_btn">
        <i className="bi bi-box-arrow-right"></i> Đăng xuất
      </button>
    </div>
  </nav>
);

// Navbar cho người dùng thường
const UserNavbar = () => (
  <nav className="nav">
    <Link to="/" className="nav_brand">
      <div className="brand_icon">
        <i className="bi bi-shop-window"></i>
      </div>
      <div className="brand_text">
        <span className="brand_title">Home<span className="brand_accent">SHOP</span></span>
        <span className="brand_subtitle">Gia Dụng & Nội Thất</span>
      </div>
    </Link>
    <div className="nav_links">
      <Link to="/" className="nav_link">
        <i className="bi bi-house-door"></i> Trang Chủ
      </Link>
      <Link to="/contact" className="nav_link">
        <i className="bi bi-info-circle"></i> Giới thiệu
      </Link>
      <Link to="/service" className="nav_link">
        <i className="bi bi-shield-check"></i> Chính sách
      </Link>
      <div className="dropdown">
        <span className="nav_link dropdown_toggle">
          <i className="bi bi-grid"></i> Sản Phẩm <i className="bi bi-chevron-down ms-1"></i>
        </span>
        <div className="dropdown_content">
          <Link to="/member1" className="dropdown_item">
            <i className="bi bi-droplet me-2"></i> Phòng Tắm
          </Link>
          <Link to="/member2" className="dropdown_item">
            <i className="bi bi-moon-stars me-2"></i> Phòng Ngủ
          </Link>
          <Link to="/member3" className="dropdown_item">
            <i className="bi bi-cup-hot me-2"></i> Phòng Bếp
          </Link>
          <Link to="/member4" className="dropdown_item">
            <i className="bi bi-tv me-2"></i> Phòng Khách 
          </Link>
          <Link to="/member5" className="dropdown_item">
            <i className="bi bi-stars me-2"></i> Sản Phẩm Khác
          </Link>
        </div>
      </div>
      <Link to="/support" className="nav_link">
        <i className="bi bi-headset"></i> Hỗ trợ
      </Link>
      <Link to={isLoggedIn ? "/cart" : "/login"} className="nav_cart">
        <i className="bi bi-cart3"></i>
        <span>Giỏ hàng</span>
        <span className="cart_badge">{cartItems.length}</span>
      </Link>
      <Link to={isLoggedIn ? "/profile" : "/login"} className="nav_link">
        <i className="bi bi-person-circle"></i> Tài khoản
      </Link>
      {isLoggedIn ? (
        <button onClick={handleLogout} className="nav_link nav_logout_btn">
          <i className="bi bi-box-arrow-right"></i> Đăng xuất
        </button>
      ) : (
        <Link to="/login" className="nav_link nav_login_btn">
          <i className="bi bi-person-lock"></i> Đăng nhập
        </Link>
      )}
    </div>
  </nav>
);

  return (
    <Router>
      <ScrollToTop />
      <div className="TONG">
        {/* Hiển thị Navbar dựa trên trạng thái isAdmin */}
        {isAdmin ? <AdminNavbar /> : <UserNavbar />}
        <Routes>
          <Route path="/" element={isAdmin ? <Navigate to="/admin" replace /> : <Home addToCart={addToCart} />} />
          <Route path="/service" element={<Service />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/support" element={<Support />} />
          <Route path="/cart" element={isAdmin ? <Navigate to="/admin" replace /> : (isLoggedIn ? <Cart cartItems={cartItems} setCartItems={setCartItems} removeFromCart={removeFromCart} /> : <Navigate to="/login" replace />)} />
          <Route path="/checkout" element={<Checkout clearCart={clearCart} />} />
          <Route path="/checkout-form" element={<CheckoutForm clearCart={clearCart} userData={user}/>} />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setIsAdmin={setIsAdmin} setUser={setUser} />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/admin" element={isAdmin ? <Admin /> : <Navigate to="/login" replace />} />
          <Route path="/usermanagement" element={isAdmin ? <UserManagemant /> : <Navigate to="/login" replace />} />
          <Route path="/productmanagement" element={isAdmin ? <ProductManagement /> : <Navigate to="/login" replace />} />
          <Route path="/profile" element={isLoggedIn ? <UserProfile /> : <Navigate to="/login" replace />} />
          <Route path="/product/:productId" element={isLoggedIn ? <ProductDetail addToCart={addToCart} /> : <Navigate to="/login" replace />} />
          <Route path="/member1" element={<Member1 addToCart={addToCart} />} />
          <Route path="/member2" element={<Member2 addToCart={addToCart} />} />
          <Route path="/member3" element={<Member3 addToCart={addToCart} />} />
          <Route path="/member4" element={<Member4 addToCart={addToCart} />} />
          <Route path="/member5" element={<Member5 addToCart={addToCart} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
