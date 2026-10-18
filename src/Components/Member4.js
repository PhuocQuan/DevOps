import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Footer from "./Footer";

function Member4({ addToCart }) {
  const products = [
    {
      name: "Tivi LG màn hình 4K 55 inch",
      price: 9500000,
      quantity: 11795,
      description: "Độ phân giải 4K Ultra HD sắc nét, âm thanh vòm Dolby Atmos, hệ điều hành webOS mượt mà.",
      imageLink: "/images/Tivi-LG.jpg",
    },
    {
      name: "Tivi CASPER Smart TV",
      price: 6200000,
      quantity: 82692,
      description: "Màn hình tràn viền vô cực, tìm kiếm giọng nói tiếng Việt, tiết kiệm điện năng chuẩn 5 sao.",
      imageLink: "/images/Tivi-casper.jpg",
    },
    {
      name: "Tivi SAMSUNG Crystal UHD",
      price: 10500000,
      quantity: 65481,
      description: "Công nghệ Dynamic Crystal Color 1 tỷ màu sắc, thiết kế siêu mỏng AirSlim tinh tế.",
      imageLink: "/images/Tivi-Samsung.jpg",
    },
    {
      name: "Máy lọc không khí PANASONIC",
      price: 5800000,
      quantity: 94811,
      description: "Công nghệ Nanoe-X ức chế 99.9% vi khuẩn virus, khử mùi thuốc lá và lọc bụi mịn PM2.5.",
      imageLink: "/images/May-loc-khong-khi1.jpg",
    },
    {
      name: "Máy lọc không khí DAIKIN",
      price: 6200000,
      quantity: 83108,
      description: "Công nghệ Streamer phân hủy chất độc hại kết hợp phin lọc HEPA tĩnh điện tuổi thọ 10 năm.",
      imageLink: "/images/May-loc-khong-khi2.jpg",
    },
    {
      name: "Máy lọc không khí LG PuriCare",
      price: 7500000,
      quantity: 73243,
      description: "Hệ thống lọc 360 độ độc quyền, quạt tăng cường Clean Booster đẩy khí sạch đi xa tới 7.5m.",
      imageLink: "/images/May-loc-khong-khi3.jpg",
    },
    {
      name: "Sofa Vải Nhung Bắc Âu",
      price: 4590000,
      quantity: 73243,
      description: "Chất liệu nỉ nhung cao cấp chống bám bụi, đệm mút D40 đàn hồi êm ái chống xẹp lún.",
      imageLink: "/images/Sofa1.jpg",
    },
    {
      name: "Sofa Băng Phòng Khách Hiện Đại",
      price: 3950000,
      quantity: 73243,
      description: "Khung gỗ sồi tự nhiên sấy khô chịu lực, màu sắc trang nhã phù hợp mọi căn hộ chung cư.",
      imageLink: "/images/Sofa2.jpg",
    },
    {
      name: "Sofa Góc Chữ L Sang Trọng",
      price: 6850000,
      quantity: 73243,
      description: "Thiết kế góc L tối ưu diện tích phòng khách, tích hợp gối tựa lưng êm ái thư giãn.",
      imageLink: "/images/Sofa3.jpg",
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
    addToCart(product);
    setAlertMessage(`${product.name} đã được thêm vào giỏ hàng!`);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  return (
    <div className="Home">
      {/* Banner Section */}
      <div className="paner">
        <img src="/images/Banner-living-room.jpg" alt="Nội Thất & Thiết Bị Phòng Khách" className="banner-image" />
      </div>

      {/* Flash Sale Countdown */}
      <div className="flash-sale-wrapper">
        <div className="flash-sale-timer">
          <div className="flash-sale-badge">
            <i className="bi bi-lightning-charge-fill"></i> FLASH SALE PHÒNG KHÁCH
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
            <i className="bi bi-fire text-danger"></i> Giảm sốc đến 40% Tivi & Máy lọc không khí
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
            <span className="section_badge">TRUNG TÂM TỔ ẤM</span>
            <h2>Nội Thất & Thiết Bị Phòng Khách</h2>
            <p>Không gian sang trọng, đón tiếp bạn bè và sum vầy gia đình với những tiện nghi hàng đầu</p>
          </div>
          <div className="search_bar_wrapper">
            <i className="bi bi-search search_icon"></i>
            <input
              type="text"
              placeholder="Tìm kiếm tivi, máy lọc không khí, ghế sofa..."
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
                  <span className="ms-2 text-muted">Đã bán 1.5k+</span>
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

export default Member4;
