import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaArrowLeft } from 'react-icons/fa';
import Comments from './Comments';

function ProductDetail({ addToCart }) {
  const { productId } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/products");
        const data = await response.json();
        
        const foundProduct = data.find((p) => p.name === productId);
        if (!foundProduct) {
          setError("Sản phẩm không tồn tại");
          return;
        }

        setProduct(foundProduct);

        // Lọc sản phẩm liên quan dựa trên từ khóa trong tên sản phẩm
        const keywords = foundProduct.name.toLowerCase().split(' ');
        const related = data
          .filter(p => {
            // Kiểm tra xem sản phẩm có chứa từ khóa nào trong tên không
            const productName = p.name.toLowerCase();
            return keywords.some(keyword => 
              productName.includes(keyword) && 
              p.name !== foundProduct.name
            );
          })
          .slice(0, 4); // Lấy tối đa 4 sản phẩm liên quan
        
        setRelatedProducts(related);

      } catch (err) {
        setError("Lỗi khi tải dữ liệu sản phẩm");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    window.scrollTo(0, 0);
  }, [productId]);

  const handleAddToCart = () => {
    addToCart(product);
    // Hiển thị thông báo thành công
    const notification = document.createElement('div');
    notification.className = 'add-cart-notification';
    notification.textContent = 'Đã thêm vào giỏ hàng!';
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 2000);
  };

  if (loading) return <div className="loading">Đang tải...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!product) return <div className="not-found">Không tìm thấy sản phẩm</div>;

  return (
    <div className="product-detail-container">
      <div className="product-detail">
        <div className="product-image-section">
          <img
            src={product.imageLink}
            alt={product.name}
            className="product-detail-image"
          />
        </div>
        
        <div className="product-info">
          <h1 className="product-name">{product.name}</h1>
          <div className="product-price">
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(product.price)}
          </div>
          
          <div className="product-description">
            <h3>Mô tả sản phẩm</h3>
            <p>{product.description}</p>
          </div>
          
          <div className="product-quantity">
            Số lượng còn lại: <span>{product.quantity}</span>
          </div>

          <div className="button-group">
            <button
              onClick={handleAddToCart}
              className="add-to-cart-button"
              disabled={product.quantity === 0}
            >
              <FaShoppingCart /> Thêm vào giỏ
            </button>
            
            <button
              onClick={() => navigate(-1)}
              className="back-button"
            >
              <FaArrowLeft /> Quay lại
            </button>
          </div>
        </div>
      </div>

      {/* Thêm phần comments */}
      <Comments productId={product.name} />

      {/* Phần sản phẩm liên quan */}
      {relatedProducts.length > 0 && (
        <div className="related-products">
          <h2>Sản phẩm bạn có thể thích</h2>
          <div className="related-products-grid">
            {relatedProducts.map((relatedProduct) => (
              <div 
                key={relatedProduct.name} 
                className="related-product-card"
                onClick={() => navigate(`/product/${relatedProduct.name}`)}
              >
                <img 
                  src={relatedProduct.imageLink} 
                  alt={relatedProduct.name} 
                />
                <h3>{relatedProduct.name}</h3>
                <p className="related-product-price">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(relatedProduct.price)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetail;
