import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Footer from "./Footer";

function Home({ addToCart }) {

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [timeLeft, setTimeLeft] = useState(3600); // Countdown timer state
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Trạng thái trang hiện tại
  const [productsPerPage] = useState(6); // Số lượng sản phẩm hiển thị trên mỗi trang

  // Fetch products from the API
  useEffect(() => {
    fetch("/api/products")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
        setFilteredProducts(data); // Initially, show all products
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  // Search functionality
  const handleSearch = () => {
    const result = products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(result);
    setCurrentPage(1); // Reset to first page after search
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

    return () => clearInterval(timer); // Cleanup on component unmount
  }, []);

  const formatTime = (timeInSeconds) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  // Handle adding to cart
  const handleAddToCart = (product) => {
    addToCart(product);
    setAlertMessage(`${product.name} đã được thêm vào giỏ hàng!`);
    setShowAlert(true);
  
    // Thêm sản phẩm vào đầu danh sách (cập nhật filteredProducts)
    // setFilteredProducts(prevProducts => [product, ...prevProducts]);
  
    // Tự động ẩn thông báo sau 3 giây
    setTimeout(() => setShowAlert(false), 3000);
  };

  // Get products for the current page
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  // Change page
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="Home">
      <div className="paner">
        <div id="homeCarousel" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-indicators">
            <button type="button" data-bs-target="#homeCarousel" data-bs-slide-to="0" className="active"></button>
            <button type="button" data-bs-target="#homeCarousel" data-bs-slide-to="1"></button>
            <button type="button" data-bs-target="#homeCarousel" data-bs-slide-to="2"></button>
          </div>
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img src="/images/bannerhome.jpg" className="d-block w-100" alt="Banner 1"/>
            </div>
            <div className="carousel-item">
              <img src="/images/bannerhome2.jpg" className="d-block w-100" alt="Banner 2"/>
            </div>
            <div className="carousel-item">
              <img src="/images/bannerhome3.jpg" className="d-block w-100" alt="Banner 3"/>
            </div>
          </div>
          <button className="carousel-control-prev" type="button" data-bs-target="#homeCarousel" data-bs-slide="prev">
            <span className="carousel-control-prev-icon"></span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#homeCarousel" data-bs-slide="next">
            <span className="carousel-control-next-icon"></span>
          </button>
        </div>
      </div>

      {/* Flash Sale Countdown */}
      <div className="flash-sale-wrapper">
        <div className="flash-sale-timer">
          <div className="flash-sale-badge">
            <i className="bi bi-lightning-charge-fill"></i> FLASH SALE HÔM NAY
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
            <i className="bi bi-fire text-danger"></i> Giảm sốc đến 50% - Số lượng có hạn!
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
        {/* Features / Trust Badges */}
        <div className="trust_features_bar">
          <div className="trust_item">
            <i className="bi bi-truck trust_icon"></i>
            <div>
              <h6>Miễn Phí Vận Chuyển</h6>
              <p>Cho đơn hàng từ 500.000đ</p>
            </div>
          </div>
          <div className="trust_item">
            <i className="bi bi-shield-check trust_icon"></i>
            <div>
              <h6>100% Chính Hãng</h6>
              <p>Cam kết chất lượng cao</p>
            </div>
          </div>
          <div className="trust_item">
            <i className="bi bi-arrow-repeat trust_icon"></i>
            <div>
              <h6>Đổi Trả Dễ Dàng</h6>
              <p>30 ngày miễn phí đổi mới</p>
            </div>
          </div>
          <div className="trust_item">
            <i className="bi bi-headset trust_icon"></i>
            <div>
              <h6>Hỗ Trợ 24/7</h6>
              <p>Hotline: 1900 6868</p>
            </div>
          </div>
        </div>

        <div className="main_search">
          <div className="search_heading">
            <span className="section_badge">BỘ SƯU TẬP TIỆN ÍCH</span>
            <h2>Khám Phá Sản Phẩm Nổi Bật</h2>
            <p>Nâng tầm không gian sống với trang thiết bị tiện nghi hàng đầu</p>
          </div>
          <div className="search_bar_wrapper">
            <i className="bi bi-search search_icon"></i>
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm gia dụng, nhà bếp, phòng ngủ..."
              className="search_in"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                const result = products.filter((product) =>
                  product.name.toLowerCase().includes(e.target.value.toLowerCase())
                );
                setFilteredProducts(result);
                setCurrentPage(1);
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
          {currentProducts.map((product, index) => (
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
              <p>Hãy thử tìm bằng từ khóa khác hoặc xóa bộ lọc.</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredProducts.length > productsPerPage && (
          <div className="pagination">
            {Array.from({ length: Math.ceil(filteredProducts.length / productsPerPage) }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={index + 1 === currentPage ? "active" : ""}
              >
                {index + 1}
              </button>
            ))}
          </div>
        )}
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
                <span className="badge bg-danger mb-2">Chính hãng 100%</span>
                <h2>{quickViewProduct.name}</h2>
                <div className="product_rating mb-2">
                  <i className="bi bi-star-fill text-warning"></i>
                  <i className="bi bi-star-fill text-warning"></i>
                  <i className="bi bi-star-fill text-warning"></i>
                  <i className="bi bi-star-fill text-warning"></i>
                  <i className="bi bi-star-fill text-warning"></i>
                  <span className="ms-2 text-muted">Đã bán 1.2k+</span>
                </div>
                <p className="modal_desc">{quickViewProduct.description || "Sản phẩm gia dụng thông minh cao cấp, thiết kế tiện nghi, độ bền vượt trội."}</p>
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

export default Home;
