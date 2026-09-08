import React from 'react';
import '../App.css';

const Banner = () => {
  return (
    <div id="bannerCarousel" className="carousel slide" data-bs-ride="carousel">
      {/* Indicators/dots */}
      <div className="carousel-indicators">
        <button type="button" data-bs-target="#bannerCarousel" data-bs-slide-to="0" className="active"></button>
        <button type="button" data-bs-target="#bannerCarousel" data-bs-slide-to="1"></button>
        <button type="button" data-bs-target="#bannerCarousel" data-bs-slide-to="2"></button>
      </div>

      {/* The slideshow/carousel */}
      <div className="carousel-inner">
        <div className="carousel-item active">
          <img src="/images/banner1.jpg" className="d-block w-100" alt="Banner 1" />
          <div className="carousel-caption">
            <h3>Khuyến mãi đặc biệt</h3>
            <p>Giảm giá lên đến 50% cho tất cả sản phẩm</p>
          </div>
        </div>
        <div className="carousel-item">
          <img src="/images/banner2.jpg" className="d-block w-100" alt="Banner 2" />
          <div className="carousel-caption">
            <h3>Sản phẩm mới</h3>
            <p>Khám phá các sản phẩm mới nhất của chúng tôi</p>
          </div>
        </div>
        <div className="carousel-item">
          <img src="/images/banner3.jpg" className="d-block w-100" alt="Banner 3" />
          <div className="carousel-caption">
            <h3>Miễn phí vận chuyển</h3>
            <p>Cho đơn hàng từ 500.000đ</p>
          </div>
        </div>
      </div>

      {/* Left and right controls/icons */}
      <button className="carousel-control-prev" type="button" data-bs-target="#bannerCarousel" data-bs-slide="prev">
        <span className="carousel-control-prev-icon"></span>
      </button>
      <button className="carousel-control-next" type="button" data-bs-target="#bannerCarousel" data-bs-slide="next">
        <span className="carousel-control-next-icon"></span>
      </button>
    </div>
  );
};

export default Banner; 
