import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
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
  <nav className="nav">
    <div className="nav_logo">Admin Panel</div>
    <div className="nav_links">
      <Link to="/" className="nav_link">
        Trang Chủ
      </Link>
      <Link to="/cart" className="nav_cart">
        Giỏ hàng ({cartItems.length})
       </Link>
       <Link to="/admin" className="nav_link">
        Admin
      </Link>
      <Link to="/productmanagement" className="nav_link">
        Quản Lý Sản Phẩm
      </Link>
      <Link to="/usermanagement" className="nav_link">
        Quản Lý Người Dùng
      </Link>
      <button to="/login" onClick={handleLogout} className="nav_link">
        Đăng xuất
      </button>
    </div>
  </nav>
);

// Navbar cho người dùng thường
const UserNavbar = () => (
  <nav className="nav">
          <div className="nav_logo">
          <img src="/images/logo.png" alt="Logo" className="nav_logo-image" />
          </div>
          <div className="nav_links">
            <Link to="/" className="nav_link">
              Trang Chủ
            </Link>
            <Link to="/contact" className="nav_link">
              Giới thiệu
            </Link>
            <Link to="/service" className="nav_link">
              Chính sách
            </Link>
            <div className="dropdown">
              <span className="nav_link dropdown_toggle">Sản Phẩm</span>
              <div className="dropdown_content">
                <Link to="/member1" className="dropdown_item">
                  Phòng Tắm
                </Link>
                <Link to="/member2" className="dropdown_item">
                  Phòng Ngủ
                </Link>
                <Link to="/member3" className="dropdown_item">
                  Phòng Bếp
                </Link>
                <Link to="/member4" className="dropdown_item">
                  Phòng Khách 
                </Link>
                <Link to="/member5" className="dropdown_item">
                  Sản Phẩm khác
                </Link>
              </div>
            </div>
            <Link to="/support" className="nav_link">
              Hỗ trợ
            </Link>
            <Link to="/cart" className="nav_cart">
              Giỏ hàng ({cartItems.length})
            </Link>
            <Link to="/profile" className="nav_link">
              Tài khoản
            </Link>
            {isLoggedIn ? (
              <button onClick={handleLogout} className="nav_link">
                Đăng xuất
              </button>
            ) : (
              <Link to="/login" className="nav_link">
                Đăng nhập/Đăng ký
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
          <Route path="/" element={<Home addToCart={addToCart} />} />
          <Route path="/service" element={<Service />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/support" element={<Support />} />
          <Route path="/cart" element={<Cart cartItems={cartItems} setCartItems={setCartItems} removeFromCart={removeFromCart} />} />
          <Route path="/checkout" element={<Checkout clearCart={clearCart} />} />
          <Route path="/checkout-form" element={<CheckoutForm clearCart={clearCart} userData={user}/>} />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setIsAdmin={setIsAdmin} setUser={setUser} />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/usermanagement" element={<UserManagemant />} />
          <Route path="/productmanagement" element={<ProductManagement />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/product/:productId" element={<ProductDetail addToCart={addToCart} />} />
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
