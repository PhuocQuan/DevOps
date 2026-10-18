import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Footer from "./Footer";

function Member3({ addToCart }) {
  const navigate = useNavigate();
  const products = [
    {
      name: "Dao làm bếp MASAMOTO",
      price: "150000",
      quantity: 11795,
      description: "Dao thép không gỉ nguyên khối Nhật Bản, sắc bén bền lâu, cầm đầm tay dễ thái gọt.",
      imageLink: "/images/Dao1.jpg",
    },
    {
      name: "Dao Kyocera",
      price: "200000",
      quantity: 82692,
      description: "Dao gốm ceramic công nghệ cao, không gỉ sét, giữ nguyên hương vị thực phẩm tươi ngon.",
      imageLink: "/images/Dao2.jpg",
    },
    {
      name: "Nồi chiên không dầu Philips",
      price: "1500000",
      quantity: 65481,
      description: "Công nghệ Rapid Air giảm đến 90% lượng dầu mỡ, dung tích 4.5L nướng gà nguyên con.",
      imageLink: "/images/noi-chien-ko-dau.jpg",
    },
    {
      name: "Thớt Gỗ Moriitalia",
      price: "412000",
      quantity: 94811,
      description: "Thớt gỗ Teak tự nhiên kháng khuẩn, bề mặt vân gỗ sang trọng, không tạo mùn gỗ.",
      imageLink: "/images/thot1.jpg",
    },
    {
      name: "Thớt gỗ Vietnamese",
      price: "412000",
      quantity: 83108,
      description: "Gỗ nghiến tự nhiên siêu bền, đã qua xử lý sấy chống ẩm mốc, an toàn tuyệt đối.",
      imageLink: "/images/thot2.jpg",
    },
    {
      name: "Nồi chiên không dầu HDM",
      price: "1400000",
      quantity: 73243,
      description: "Lòng nồi phủ men chống dính ceramic cao cấp, bảng điều khiển cảm ứng một chạm thông minh.",
      imageLink: "/images/noi-chien-khong-dau2.jpg",
    },
    {
      name: "Lò vi sóng Sharp",
      price: "1850000",
      quantity: 73243,
      description: "Tích hợp nướng đối lưu, công suất 800W, rã đông thực phẩm nhanh chóng theo trọng lượng.",
      imageLink: "/images/Lo-vi-song.jpg",
    },
    {
      name: "Lò vi sóng Galanz",
      price: "1650000",
      quantity: 73243,
      description: "Dung tích 20L tiện dụng cho gia đình, khoang lò tráng men dễ dàng lau chùi vệ sinh.",
      imageLink: "/images/Lo-vi-song2.jpg",
    },
    {
      name: "Kéo làm bếp Đa Năng",
      price: "50000",
      quantity: 73243,
      description: "Lưỡi kéo răng cưa chống trượt cắt gà, xương vịt, mở nắp chai và kẹp càng cua tiện lợi.",
      imageLink: "/images/Keo-lam-bep.jpg",
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
      {/* Banner Section */}
      <div className="paner">
        <img src="/images/bannerhome2.jpg" alt="Dụng Cụ Phòng Bếp" className="banner-image" />
      </div>

      {/* Flash Sale Countdown */}
      <div className="flash-sale-wrapper">
        <div className="flash-sale-timer">
          <div className="flash-sale-badge">
            <i className="bi bi-lightning-charge-fill"></i> FLASH SALE PHÒNG BẾP
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
            <i className="bi bi-fire text-danger"></i> Giảm đến 50% dụng cụ & thiết bị nhà bếp
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
            <span className="section_badge">BẾP ẤM YÊU THƯƠNG</span>
            <h2>Dụng Cụ & Thiết Bị Phòng Bếp</h2>
            <p>Trang bị căn bếp hiện đại giúp việc nấu nướng trở nên dễ dàng và đầy cảm hứng</p>
          </div>
          <div className="search_bar_wrapper">
            <i className="bi bi-search search_icon"></i>
            <input
              type="text"
              placeholder="Tìm kiếm nồi chiên, dao thớt, lò vi sóng..."
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
                  <span className="ms-2 text-muted">Đã bán 950+</span>
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

export default Member3;
