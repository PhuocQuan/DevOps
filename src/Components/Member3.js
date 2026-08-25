import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Footer from "./Footer";


function Member3({ addToCart }) {
  const navigate = useNavigate();

  const products = [
    {
      name: "Dao làm bếp MASAMOTO",
      price: 150000,
      quantity: 11795,
      description: "Stamm",
      imageLink: "../images/Dao1.jpg",
    },
    {
      name: "Dao Kyocera",
      price: 200000,
      quantity: 82692,
      description: "Stamm",
      imageLink: "../images/Dao2.jpg",
    },
    {
      name: "Nồi chiên không dầu Philips",
      price: 1500000,
      quantity: 65481,
      description: "Stamm",
      imageLink: "../images/noi-chien-ko-dau.jpg",
    },
    {
      name: "Thớt Gỗ Moriitalia",
      price: 412000,
      quantity: 94811,
      description: "Stamm",
      imageLink: "../images/thot1.jpg",
    },
    {
      name: "Thớt gỗ Vietnamese",
      price: 412000,
      quantity: 83108,
      description: "Stamm",
      imageLink: "../images/thot2.jpg",
    },
    {
      name: "Nồi chiên không dầu HDM",
      price: 1400000,
      quantity: 73243,
      description: "Stamm",
      imageLink: "../images/noi-chien-khong-dau2.jpg",
    },
    {
      name: "Lò vi sóng Sharp",
      price: 412000,
      quantity: 73243,
      description: "Stamm",
      imageLink: "../images/Lo-vi-song.jpg",
    },
    {
      name: "Lò vi sóng Galanz",
      price: 412000,
      quantity: 73243,
      description: "Stamm",
      imageLink: "../images/Lo-vi-song2.jpg",
    },
    {
      name: "Kéo làm bếp",
      price: 50000,
      quantity: 73243,
      description: "Stamm",
      imageLink: "../images/Keo-lam-bep.jpg",
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

    // Tự động ẩn thông báo sau 3 giây
    setTimeout(() => setShowAlert(false), 3000);
  };

  const handleCloseQuickView = () => setQuickViewProduct(null);

  return (
    <div className="Home">
      <div className="paner">
        {/* Add your banner image here */}
        <img src="../images/dao.jpg" alt="Banner" className="banner-image" />
      </div>

      {/* Flash Sale Countdown */}
      <div className="flash-sale-timer">
        <div className="flash-sale-text">FLASH SALE</div>
        <div className="timer-unit">{formatTime(timeLeft).split(':')[0]}</div>
        <div className="colon">:</div>
        <div className="timer-unit">{formatTime(timeLeft).split(':')[1]}</div>
        <div className="colon">:</div>
        <div className="timer-unit">{formatTime(timeLeft).split(':')[2]}</div>
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
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product, index) => (
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
            ))
          ) : (
            <h2>KHÔNG TÌM THẤY SẢN PHẨM</h2>
          )}
        </div>
      </main>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <div className="quick_view_modal">
          <div className="modal_content">
            <button className="close_button" onClick={handleCloseQuickView}>
              X
            </button>
            <h2>{quickViewProduct.name}</h2>
            <img
              src={quickViewProduct.imageLink}
              alt={quickViewProduct.name}
              className="product_image"
            />
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

      <footer className="footer"><Footer/></footer>
    </div>
  );
}

export default Member3;
