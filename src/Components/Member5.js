import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Footer from "./Footer";

function Member5({ addToCart }) {

  const products = [
    {
      name: "Máy lọc nước KANGAROO",
      price: "4200000",
      quantity: 11795,
      description: "Hệ thống lọc RO 10 lõi kháng khuẩn, bù khoáng tự nhiên, thiết kế mặt kính cường lực hiện đại.",
      imageLink: "/images/may-loc-nuoc1.jpg",
    },
    {
      name: "Máy lọc nước KAROFI",
      price: "5600000",
      quantity: 82692,
      description: "Công nghệ thông minh Aiotec kiểm soát độ tinh khiết từ xa, thiết kế sang trọng đẳng cấp.",
      imageLink: "/images/may-loc-nuoc2.jpg",
    },
    {
      name: "Robot hút bụi KELLY",
      price: "3700000",
      quantity: 65481,
      description: "Cảm biến laser thế hệ mới điều hướng chính xác, lực hút mạnh mẽ 4000Pa, tự động vẽ bản đồ phòng.",
      imageLink: "/images/robot-hut-bui1.jpg",
    },
    {
      name: "Robot hút bụi MAXIM",
      price: "4500000",
      quantity: 94811,
      description: "Tích hợp hút bụi và lau nhà 2 trong 1, hoạt động êm ái, pin trâu lên đến 180 phút.",
      imageLink: "/images/robot-hut-bui2.jpg",
    },
    {
      name: "Bộ chén đĩa cao cấp",
      price: "850000",
      quantity: 83108,
      description: "Sứ xương cao cấp viền mạ vàng phong cách hoàng gia, chịu nhiệt và chống trầy xước tối ưu.",
      imageLink: "/images/bo-chen-dia1.jpg",
    },
    {
      name: "Bộ chén đĩa MOCO",
      price: "990000",
      quantity: 73243,
      description: "Bộ bàn ăn 28 món men ngọc sáng bóng, phong cách tối giản Bắc Âu sang trọng.",
      imageLink: "/images/bo-chen-dia2.jpg",
    },
    {
      name: "Ấm siêu tốc MUZAN",
      price: "450000",
      quantity: 83108,
      description: "Dung tích 1.8L ruột inox 304 nguyên khối cách nhiệt 2 lớp an toàn tuyệt đối chống bỏng.",
      imageLink: "/images/am-sieu-toc1.jpg",
    },
    {
      name: "Ấm siêu tốc AKAZA",
      price: "590000",
      quantity: 73243,
      description: "Công suất lớn 2200W đun sôi cực nhanh, rơ le tự ngắt thông minh đạt chuẩn Châu Âu.",
      imageLink: "/images/am-sieu-toc2.jpg",
    },
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [timeLeft, setTimeLeft] = useState(3600); // Countdown timer state
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Search functionality
  const handleSearch = () => {
    const result = products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(result);
  };

  // Countdown timer effect
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
    addToCart(product);
    setAlertMessage(`${product.name} đã được thêm vào giỏ hàng!`);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  return (
    <div className="Home">
      {/* Banner Section */}
      <div className="paner">
        <img src="/images/banner-khac.jpg" alt="Thiết Bị Tiện Ích Gia Đình" className="banner-image" />
      </div>

      {/* Flash Sale Countdown */}
      <div className="flash-sale-wrapper">
        <div className="flash-sale-timer">
          <div className="flash-sale-badge">
            <i className="bi bi-lightning-charge-fill"></i> FLASH SALE TIỆN ÍCH GIA ĐÌNH
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
            <i className="bi bi-fire text-danger"></i> Giảm sốc tới 45% máy lọc nước & robot hút bụi
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
            <span className="section_badge">TIỆN ÍCH ĐỜI SỐNG</span>
            <h2>Gia Dụng Thông Minh & Đồ Dùng Khác</h2>
            <p>Trang bị công nghệ tiện ích nâng niu và tối ưu cuộc sống gia đình mỗi ngày</p>
          </div>
          <div className="search_bar_wrapper">
            <i className="bi bi-search search_icon"></i>
            <input
              type="text"
              placeholder="Tìm kiếm máy lọc nước, robot hút bụi, ấm siêu tốc..."
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
              <div className="product_badge_hot">Bán chạy</div>
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
                  <i className="bi bi-star-fill"></i>
                  <span>(5.0)</span>
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
                  <Link to={`/product/${product.name}`} className="product_link">
                    <i className="bi bi-info-circle me-1"></i> Chi tiết
                  </Link>
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

export default Member5;
