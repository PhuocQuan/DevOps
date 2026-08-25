import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
function Cart({ cartItems = [], setCartItems }) {
  const navigate = useNavigate();
  const [notification, setNotification] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [products, setProducts] = useState([]); // State to hold products from API

  useEffect(() => {
    const loggedInStatus = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedInStatus);

    // Fetch products from API
    fetch("http://localhost:2300/products")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data); // Set the fetched products data
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  const handleCheckout = () => {
    if (!isLoggedIn) {
      setNotification("Bạn cần đăng nhập để thanh toán.");
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000); // Hide notification after 3 seconds
    } else {
      navigate("/checkout-form");
    }
  };

  const increaseQuantity = (index) => {
    const updatedCart = cartItems.map((item, i) =>
      i === index ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCartItems(updatedCart);
  };

  const decreaseQuantity = (index) => {
    const updatedCart = cartItems
      .map((item, i) =>
        i === index && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
      .filter((item) => item.quantity > 0); // Remove item if quantity is 0
    setCartItems(updatedCart);
  };

  const updateQuantity = (index, value) => {
    const quantity = value === "" ? 0 : parseInt(value, 10);
    if (!isNaN(quantity)) {
      const updatedCart = cartItems.map((item, i) =>
        i === index ? { ...item, quantity } : item
      );
      setCartItems(updatedCart);
    }
  };

  const validateQuantity = (index) => {
    const updatedCart = cartItems.map((item, i) =>
      i === index && item.quantity <= 0 ? { ...item, quantity: 1 } : item
    );
    setCartItems(updatedCart);
  };

  const removeFromCart = (index) => {
    const updatedCart = cartItems.filter((_, i) => i !== index);
    setCartItems(updatedCart);
  };

  const totalAmount = cartItems
    .reduce((acc, item) => acc + parseFloat(item.price) * item.quantity, 0)
    .toFixed(2);

  return (
    <div className="cart">
      <h2>Giỏ hàng của bạn</h2>
      {showNotification && (
        <div className="notification-bar">
          <p>{notification}</p>
        </div>
      )}
      {cartItems.length === 0 ? (
        <p>Giỏ hàng của bạn trống</p>
      ) : (
        <div>
          {cartItems.map((item, index) => {
            // Find product details from products array
            const product = products.find((p) => p.id === item.id);

            return (
              <div key={index} className="cart-item">
                <img src={product?.imageLink} alt={product?.name} />
                <div className="cart-details">
                  <h3>{product?.name}</h3>
                  <p>Giá: {product?.price}đ</p>
                  <div className="quantity-controls">
                    <button onClick={() => decreaseQuantity(index)}>-</button>
                    <input
                      type="text"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(index, e.target.value)}
                      onBlur={() => validateQuantity(index)}
                      className="quantity-input"
                    />
                    <button onClick={() => increaseQuantity(index)}>+</button>
                  </div>
                  <p>
                    Tổng giá trị:{" "}
                    {(product?.price * item.quantity).toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </p>
                  <button onClick={() => removeFromCart(index)}>Xóa</button>
                </div>
              </div>
            );
          })}
          <div className="cart-total">
            <h3>
              Tổng tiền:{" "}
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(totalAmount)}
            </h3>
          </div>
          <button className="checkout-button" onClick={handleCheckout}>
            Thanh toán
          </button>
        </div>
      )}

      {/* Back Button */}
      <button onClick={() => navigate(-1)} className="back-button-cart">
        Quay lại
      </button>
    </div>
  );
}

export default Cart;
