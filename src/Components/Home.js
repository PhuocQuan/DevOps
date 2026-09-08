import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Footer from "./Footer";

function Home({ addToCart }) {
  const navigate = useNavigate();

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
              <img src="../images/bannerhome.jpg" className="d-block w-100" alt="Banner 1"/>
            </div>
            <div className="carousel-item">
              <img src="../images/bannerhome2.jpg" className="d-block w-100" alt="Banner 2"/>
            </div>
            <div className="carousel-item">
              <img src="../images/bannerhome3.jpg" className="d-block w-100" alt="Banner 3"/>
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
      <div className="flash-sale-timer">
        <div className="flash-sale-text">FLASH SALE</div>
        <div className="timer-unit">{formatTime(timeLeft).split(":")[0]}</div>
        <div className="colon">:</div>
        <div className="timer-unit">{formatTime(timeLeft).split(":")[1]}</div>
        <div className="colon">:</div>
        <div className="timer-unit">{formatTime(timeLeft).split(":")[2]}</div>
      </div>

      {/* Alert Notification */}
      {showAlert && <div className="alert">{alertMessage}</div>}

      <main className="main">
        <div className="main_search">
          <div className="search_button">
            <input
              type="text"
              placeholder="Search..."
              className="search_in"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                const result = products.filter((product) =>
                  product.name.toLowerCase().includes(e.target.value.toLowerCase())
                );
                setFilteredProducts(result);
                setCurrentPage(1); // Reset to first page after search
              }}
            />
            <input
              type="submit"
              value="Search"
              className="search_sub"
              onClick={handleSearch}
            />
          </div>
          <div className="search_text">
            <h1>DANH SÁCH SẢN PHẨM</h1>
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
              <img
                src={product.imageLink}
                alt={product.name}
                className="product_image"
              />
              <div className="product_min">
                <h3>{product.name}</h3>
                <p>
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(product.price)}
                </p>
                <button
                  onClick={() => handleAddToCart(product)}
                  type="button"
                  className="main_cart"
                >
                  Thêm vào giỏ
                </button>
                <Link to={`/product/${product.name}`} className="product_link">
                  Xem thông tin
                </Link>
              </div>
              {hoveredProduct === product && (
                <button
                  className="quick_view_button"
                  onClick={() => setQuickViewProduct(product)}
                >
                  Xem nhanh
                </button>
              )}
            </div>
          ))}

          {/* Pagination */}
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

          {filteredProducts.length === 0 && <h2>KHÔNG TÌM THẤY SẢN PHẨM</h2>}
        </div>
      </main>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <div className="quick_view_modal">
          <div className="modal_content">
            <button className="close_button" onClick={() => setQuickViewProduct(null)}>
              X
            </button>
            <h2>{quickViewProduct.name}</h2>
            <img
              src={quickViewProduct.imageLink}
              alt={quickViewProduct.name}
              className="product_image"
            />
            <p>{quickViewProduct.description}</p>
            <p>
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(quickViewProduct.price)}
            </p>
            <button
              onClick={() => handleAddToCart(quickViewProduct)}
              className="main_cart"
            >
              Thêm vào giỏ
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default Home;
