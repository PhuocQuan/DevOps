/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import "../App.css";

const Contact = () => {
  return (
    <div className="contact-container">
      {/* Banner Section */}
      <div className="banner">
        <div id="contactCarousel" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-indicators">
            <button type="button" data-bs-target="#contactCarousel" data-bs-slide-to="0" className="active"></button>
            <button type="button" data-bs-target="#contactCarousel" data-bs-slide-to="1"></button>
            <button type="button" data-bs-target="#contactCarousel" data-bs-slide-to="2"></button>
          </div>
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img src="../images/bannercontact.jpg" className="d-block w-100" alt="Banner 1" />
              <div className="carousel-caption">
                <div className="banner-content">
                  <div className="logo">
                    <img src="../images/logo.png" alt="Logo" />
                  </div>
                  <div className="navbar">
                    <a href="#">Home</a>
                    <a href="#">Products</a>
                    <a href="#">About</a>
                    <a href="#">Contact</a>
                  </div>
                </div>
              </div>
            </div>
            <div className="carousel-item">
              <img src="../images/bannercontact2.jpg" className="d-block w-100" alt="Banner 2" />
            </div>
            <div className="carousel-item">
              <img src="../images/bannercontact3.jpg" className="d-block w-100" alt="Banner 3" />
            </div>
          </div>
          <button className="carousel-control-prev" type="button" data-bs-target="#contactCarousel" data-bs-slide="prev">
            <span className="carousel-control-prev-icon"></span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#contactCarousel" data-bs-slide="next">
            <span className="carousel-control-next-icon"></span>
          </button>
        </div>
      </div>

      {/* Phần giới thiệu */}
      <div className="about-section">
        <h1>Giới thiệu về HomeShop</h1>
        <p>
          HomeShop là điểm đến lý tưởng cho mọi gia đình hiện đại, cung cấp các sản phẩm gia dụng chất lượng cao từ nồi cơm điện, tủ lạnh đến dụng cụ làm bếp. Chúng tôi tự hào mang đến sự tiện lợi và giá trị vượt trội, giúp bạn nâng cao chất lượng cuộc sống ngay tại ngôi nhà của mình. Với HomeShop, mọi thứ bạn cần đều nằm gọn trong tầm tay.
        </p>  
        <p>
          Tại HomeShop, chúng tôi hiểu rằng ngôi nhà là nơi khởi nguồn của hạnh phúc. Vì vậy, chúng tôi không chỉ cung cấp các thiết bị gia dụng mà còn mang đến những giải pháp thông minh để chăm sóc tổ ấm của bạn. Sản phẩm của chúng tôi cam kết đạt tiêu chuẩn chất lượng cao, giá cả hợp lý, và hỗ trợ khách hàng tận tâm mọi lúc, mọi nơi.
        </p>
        <p>
          HomeShop là trang web bán hàng gia dụng hàng đầu, nơi bạn tìm thấy mọi sản phẩm thiết yếu cho gia đình mình. Chúng tôi mang đến một trải nghiệm mua sắm trực tuyến tiện lợi với đa dạng mặt hàng từ các thương hiệu uy tín. Hãy để HomeShop trở thành người bạn đồng hành tin cậy trên hành trình xây dựng tổ ấm hoàn hảo của bạn.
        </p>
        <div className="about-images">
          <img src="../images/noicom1.png" alt="Nồi cơm điện" />
          <img src="../images/logo.png" alt="Logo" />
          <img src="../images/tulanh.webp" alt="Tủ lạnh" />
        </div>
      </div>
    </div>
  );
};

export default Contact;
