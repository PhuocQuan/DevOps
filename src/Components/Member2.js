import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Footer from "./Footer";


function Member2({ addToCart }) {
  const navigate = useNavigate();

  const products = [
    {
      name: "Máy Sấy Panasonic 1400W",
      price: "800000",
      quantity: 11795,
      description: "Stamm",
      imageLink: "../images/May Say Panasonic.jpg",
    },
    {
      name: "Máy Sấy Elmich 1900W",
      price: "900000",
      quantity: 82692,
      description: "Stamm",
      imageLink: "../images/maysayElmich.jpg",
    },
    {
      name: "Đèn ngủ MSI",
      price: "2000000",
      quantity: 65481,
      description: "Stamm",
      imageLink: "../images/Den-ngu1.jpg",
    },
    {
      name: "Đèn Ngủ ASUS",
      price: "1500000",
      quantity: 65481,
      description: "Stamm",
      imageLink: "../images/Den-ngu2.jpg",
    },
    {
      name: "Tủ đựng áo, quần MAC",
      price: "3000000",
      quantity: 65481,
      description: "Stamm",
      imageLink: "../images/tu-quan-ao2.jpg",
    },
    {
      name: "Bàn ủi HAYATO",
      price: "1450000",
      quantity: 65481,
      description: "Stamm",
      imageLink: "../images/ban-ui1.jpg",
    },
    {
      name: "Bàn ủi SOREVY",
      price: "3000000",
      quantity: 65481,
      description: "Stamm",
      imageLink: "../images/ban-ui2.jpg",
    },
    {
      name: "Bàn ủi hơi nước",
      price: "3000000",
      quantity: 65481,
      description: "Stamm",
      imageLink: "../images/ban-ui3.jpg",
    },
    {
      name: "Tủ đựng áo, quần MAXIM",
      price: "3000000",
      quantity: 65481,
      description: "Stamm",
      imageLink: "../images/tu-quan-ao1.jpg",
    },
  ];

  const [searchTerm, setSearchTerm] = useState("");  // Lưu trữ từ khóa tìm kiếm
  const [filteredProducts, setFilteredProducts] = useState(products);  // Lưu trữ sản phẩm đã lọc
  const [timeLeft, setTimeLeft] = useState(3600);  // Thời gian đếm ngược (mặc định 3600 giây = 1 giờ)
  const [alertMessage, setAlertMessage] = useState("");  // Thông báo khi thêm sản phẩm vào giỏ
  const [showAlert, setShowAlert] = useState(false);  // Trạng thái hiển thị thông báo
  const [hoveredProduct, setHoveredProduct] = useState(null);  // Lưu trữ sản phẩm đang được hover
  const [quickViewProduct, setQuickViewProduct] = useState(null);  // Lưu trữ sản phẩm đang xem nhanh
  
  // Hàm tìm kiếm sản phẩm
  const handleSearch = () => {
    // Lọc sản phẩm dựa trên tên sản phẩm chứa từ khóa tìm kiếm
    const result = products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(result);  // Cập nhật danh sách sản phẩm đã lọc
  };
  
  // Hiệu ứng đếm ngược thời gian
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(timer);  // Dừng timer khi hết thời gian
          return 0;
        }
        return prevTime - 1;  // Giảm thời gian còn lại mỗi giây
      });
    }, 1000);
  
    return () => clearInterval(timer);  // Cleanup khi component unmount
  }, []);
  
  // Hàm định dạng thời gian đếm ngược (giờ:phút:giây)
  const formatTime = (timeInSeconds) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };
  
  // Hàm thêm sản phẩm vào giỏ hàng
  const handleAddToCart = (product) => {
    addToCart(product);  // Thêm sản phẩm vào giỏ hàng
    setAlertMessage(`${product.name} đã được thêm vào giỏ hàng!`);  // Cập nhật thông báo
    setShowAlert(true);  // Hiển thị thông báo
  
    // Tự động ẩn thông báo sau 3 giây
    setTimeout(() => setShowAlert(false), 3000);
  };
  
  // Hàm đóng xem nhanh sản phẩm
  const handleCloseQuickView = () => setQuickViewProduct(null);  // Đặt sản phẩm xem nhanh về null
  

  return (
    <div className="Home">
      <div className="paner">
        {/* Add your banner image here */}
        <img src="../images/banner-bedroom.jpg" alt="Banner" className="banner-image" />
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

export default Member2;
