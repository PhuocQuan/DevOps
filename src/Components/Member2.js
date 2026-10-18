import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Footer from "./Footer";

function Member2({ addToCart }) {
  const navigate = useNavigate();
  const products = [
    {
      name: "Máy Sấy Panasonic 1400W",
      price: "800000",
      quantity: 11795,
      description: "Máy sấy tóc ion âm bảo vệ tóc, 3 mức nhiệt linh hoạt, tay cầm gập gọn tiện dụng.",
      imageLink: "/images/May Say Panasonic.jpg",
    },
    {
      name: "Máy Sấy Elmich 1900W",
      price: "900000",
      quantity: 82692,
      description: "Công suất mạnh mẽ 1900W, sấy khô nhanh chóng, không gây khô xơ hư tổn tóc.",
      imageLink: "/images/maysayElmich.jpg",
    },
    {
      name: "Đèn ngủ MSI",
      price: "2000000",
      quantity: 65481,
      description: "Đèn ngủ thông minh điều chỉnh độ sáng cảm ứng, ánh sáng vàng ấm thư giãn giấc ngủ.",
      imageLink: "/images/Den-ngu1.jpg",
    },
    {
      name: "Đèn Ngủ ASUS",
      price: "1500000",
      quantity: 65481,
      description: "Tích hợp cổng sạc không dây cho smartphone, thiết kế tối giản phong cách Bắc Âu.",
      imageLink: "/images/Den-ngu2.jpg",
    },
    {
      name: "Tủ đựng áo, quần MAC",
      price: "3000000",
      quantity: 65481,
      description: "Tủ quần áo gỗ công nghiệp cao cấp chống ẩm mốc, phân chia nhiều ngăn chứa đồ rộng rãi.",
      imageLink: "/images/tu-quan-ao2.jpg",
    },
    {
      name: "Bàn ủi HAYATO",
      price: "1450000",
      quantity: 65481,
      description: "Bàn ủi chống dính cao cấp, tỏa nhiệt đều, ủi thẳng mọi nếp nhăn nhanh chóng.",
      imageLink: "/images/ban-ui1.jpg",
    },
    {
      name: "Bàn ủi SOREVY",
      price: "3000000",
      quantity: 65481,
      description: "Công nghệ phun hơi tăng cường, khử mùi và diệt khuẩn sợi vải hiệu quả.",
      imageLink: "/images/ban-ui2.jpg",
    },
    {
      name: "Bàn ủi hơi nước",
      price: "3000000",
      quantity: 65481,
      description: "Thiết kế cầm tay nhỏ gọn, ủi đứng tiện lợi, phù hợp mang đi du lịch công tác.",
      imageLink: "/images/ban-ui3.jpg",
    },
    {
      name: "Tủ đựng áo, quần MAXIM",
      price: "3000000",
      quantity: 65481,
      description: "Tủ quần áo cánh trượt tiết kiệm diện tích phòng ngủ, bản lề giảm chấn êm ái.",
      imageLink: "/images/tu-quan-ao1.jpg",
    },
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [timeLeft, setTimeLeft] = useState(3600);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const handleSearch = () => {
    const result = products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(result);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (timeInSeconds) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleAddToCart = (product) => {
    const loggedInStatus = localStorage.getItem("isLoggedIn") === "true";
    if (!loggedInStatus) {
      navigate("/login");
      return;
    }

    addToCart(product);
    setAlertMessage(`${product.name} đã được thêm vào giỏ hàng!`);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const handleViewDetail = (productName) => {
    const loggedInStatus = localStorage.getItem("isLoggedIn") === "true";
    if (!loggedInStatus) {
      navigate("/login");
    } else {
      navigate(`/product/${productName}`);
    }
  };

  return (
    <div className="Home">
      {/* Banner Section (Sử dụng ảnh banner phòng ngủ mới do người dùng gửi) */}
      <div className="paner">
        <img src="/images/banner_bedroom.png" alt="Sản Phẩm Giường Ngủ & Tiện Ích Phòng Ngủ" className="banner-image" />
      </div>

      {/* Flash Sale Countdown */}
      <div className="flash-sale-wrapper">
        <div className="flash-sale-timer">
          <div className="flash-sale-badge">
            <i className="bi bi-lightning-charge-fill"></i> FLASH SALE PHÒNG NGỦ
          </div>
          <div className="timer-container">
            <div className="timer-unit-box">
              <span className="timer-number">{formatTime(timeLeft).split(":")[0]}</span>
              <span className="timer-label">Giờ</span>
            </div>
            <div className="colon">:</div>
            <div className="timer-unit-box">
              <span className="timer-number">{formatTime(timeLeft).split(":")[1]}</span>
              <span className="timer-label">Phút</span>
            </div>
            <div className="colon">:</div>
            <div className="timer-unit-box">
              <span className="timer-number">{formatTime(timeLeft).split(":")[2]}</span>
              <span className="timer-label">Giây</span>
            </div>
          </div>
          <div className="flash-sale-sub">
            <i className="bi bi-fire text-danger"></i> Giảm sốc đến 45% nội thất phòng ngủ
          </div>
        </div>
      </div>

      {/* Alert Notification */}
      {showAlert && (
        <div className="custom_toast_alert">
          <i className="bi bi-check-circle-fill me-2"></i>
          <span>{alertMessage}</span>
        </div>
      )}

      <main className="main">
        <div className="main_search">
          <div className="search_heading">
            <span className="section_badge">KHÔNG GIAN NGHỈ NGƠI</span>
            <h2>Nội Thất & Thiết Bị Phòng Ngủ</h2>
            <p>Tận hưởng giấc ngủ an lành với các sản phẩm tiện nghi, êm ái và hiện đại</p>
          </div>
          <div className="search_bar_wrapper">
            <i className="bi bi-search search_icon"></i>
            <input
              type="text"
              placeholder="Tìm kiếm máy sấy, đèn ngủ, tủ quần áo, bàn ủi..."
              className="search_in"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                const result = products.filter((product) =>
                  product.name.toLowerCase().includes(e.target.value.toLowerCase())
                );
                setFilteredProducts(result);
              }}
            />
            {searchTerm && (
              <button 
                className="search_clear_btn" 
                onClick={() => {
                  setSearchTerm("");
                  setFilteredProducts(products);
                }}
              >
                <i className="bi bi-x-circle-fill"></i>
              </button>
            )}
            <button className="search_sub" onClick={handleSearch}>
              Tìm kiếm
            </button>
          </div>
        </div>

        <div className="main_products">
          {filteredProducts.map((product, index) => (
            <div
              key={index}
              className="main_product"
              onMouseEnter={() => setHoveredProduct(product)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              <div className="product_badge_hot">Hot Deal</div>
              <div className="product_img_wrapper">
                <img
                  src={product.imageLink}
                  alt={product.name}
                  className="product_image"
                />
              </div>
              <div className="product_min">
                <div className="product_rating">
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-half"></i>
                  <span>(4.9)</span>
                </div>
                <h3>{product.name}</h3>
                <div className="product_price_row">
                  <span className="product_price">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(product.price)}
                  </span>
                </div>
                <div className="product_btn_group">
                  <button
                    onClick={() => handleAddToCart(product)}
                    type="button"
                    className="main_cart"
                  >
                    <i className="bi bi-cart-plus me-1"></i> Thêm giỏ hàng
                  </button>
                  <button
                    type="button"
                    onClick={() => handleViewDetail(product.name)}
                    className="product_link"
                  >
                    <i className="bi bi-info-circle me-1"></i> Chi tiết
                  </button>
                </div>
              </div>
              {hoveredProduct === product && (
                <button
                  className="quick_view_button"
                  onClick={() => setQuickViewProduct(product)}
                >
                  <i className="bi bi-eye me-1"></i> Xem nhanh
                </button>
              )}
            </div>
          ))}

          {filteredProducts.length === 0 && (
            <div className="no_products_found">
              <i className="bi bi-search display-3 text-muted mb-3"></i>
              <h3>Không tìm thấy sản phẩm nào!</h3>
            </div>
          )}
        </div>
      </main>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <div className="quick_view_modal">
          <div className="modal_content animate_modal">
            <button className="close_button" onClick={() => setQuickViewProduct(null)}>
              <i className="bi bi-x-lg"></i>
            </button>
            <div className="modal_body_flex">
              <div className="modal_img_col">
                <img
                  src={quickViewProduct.imageLink}
                  alt={quickViewProduct.name}
                  className="product_image_modal"
                />
              </div>
              <div className="modal_info_col">
                <span className="badge bg-primary mb-2">Chính hãng 100%</span>
                <h2>{quickViewProduct.name}</h2>
                <div className="product_rating mb-2">
                  <i className="bi bi-star-fill text-warning"></i>
                  <i className="bi bi-star-fill text-warning"></i>
                  <i className="bi bi-star-fill text-warning"></i>
                  <i className="bi bi-star-fill text-warning"></i>
                  <i className="bi bi-star-fill text-warning"></i>
                  <span className="ms-2 text-muted">Đã bán 1.1k+</span>
                </div>
                <p className="modal_desc">{quickViewProduct.description}</p>
                <div className="modal_price">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(quickViewProduct.price)}
                </div>
                <button
                  onClick={() => {
                    handleAddToCart(quickViewProduct);
                    setQuickViewProduct(null);
                  }}
                  className="main_cart modal_cart_btn"
                >
                  <i className="bi bi-bag-check-fill me-2"></i> Thêm vào giỏ hàng ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default Member2;
