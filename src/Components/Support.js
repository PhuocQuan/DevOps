import React, { useState } from 'react';
import "../App.css";

const Support = () => {
    const [showSupportForm, setShowSupportForm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false); // Trạng thái khi đang gửi
    const [submitMessage, setSubmitMessage] = useState(''); // Thông báo sau khi gửi

    const handleSupportClick = () => {
        setShowSupportForm(true);
    };

    const handleFormClose = () => {
        setShowSupportForm(false);
        setIsSubmitting(false); // Reset trạng thái
        setSubmitMessage(''); // Reset thông báo
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true); // Hiển thị trạng thái "Đang gửi yêu cầu..."
        setSubmitMessage(''); // Xóa thông báo cũ

        // Mô phỏng thời gian gửi yêu cầu
        setTimeout(() => {
            setIsSubmitting(false); // Kết thúc trạng thái "đang gửi"
            setSubmitMessage('Gửi yêu cầu thành công!'); // Hiển thị thông báo thành công
        }, 3000); // Giả lập thời gian gửi (3 giây)
    };

    return (
        <div className="support-container">
            {/* Banner Section */}
            <div className="banner-sp">
                <img src="../images/bannersp.jpg" alt="Banner" className="banner-image" />
                <div className="banner-content">
                    <h1>Xin chào, HomeShop có thể giúp gì cho bạn?</h1>
                    <div className="search-container">
                        <input type="text" placeholder="Nhập từ khóa hoặc nội dung cần tìm" className="search-input" />
                        <span className="search-icon">🔍</span>
                    </div>
                </div>
            </div>

            {/* Danh mục */}
            <div className="category-title">
                <h2>Danh mục</h2>
            </div>
            <div className="support-sections">
                <div className="support-section">
                    <span className="icon">🛒</span>
                    <h3>Mua sắm cùng HomeShop</h3>
                </div>
                <div className="support-section">
                    <span className="icon">🏷️</span>
                    <h3>Khuyến mãi & Ưu đãi</h3>
                </div>
                <div className="support-section">
                    <span className="icon">💵</span>
                    <h3>Thanh toán</h3>
                </div>
                <div className="support-section">
                    <span className="icon">🚚</span>
                    <h3>Đơn hàng & Vận chuyển</h3>
                </div>
                <div className="support-section">
                    <span className="icon">🔄</span>
                    <h3>Trả hàng & Hoàn tiền</h3>
                </div>
                <div className="support-section">
                    <span className="icon">⋯</span>
                    <h3>Thông tin chung</h3>
                </div>
            </div>
            <div className="faq">
                <h3>Câu hỏi thường gặp</h3>
                <ul>
                    <li>[Cảnh báo lừa đảo] Mua sắm an toàn cùng HomeShop</li>
                    <li>[Dịch vụ] Cách liên hệ Chăm sóc khách hàng, Hotline, Tổng đài HomeShop</li>
                </ul>
            </div>
            <div className="contact-shopee centered">
                <p>Bạn có muốn tìm thêm thông tin gì không?</p>
                <button onClick={handleSupportClick}><span className="phone-icon">✏️</span>Gửi yêu cầu hỗ trợ</button>
            </div>

            {showSupportForm && (
                <div className="support-form-overlay">
                    <div className="support-form">
                        <h2>Hỗ trợ khách hàng</h2>
                        {!isSubmitting && !submitMessage && (
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="name">Tên:</label>
                                    <input
                                        type="text"
                                        id="name"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">Email:</label>
                                    <input
                                        type="email"
                                        id="email"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="message">Thông điệp:</label>
                                    <textarea
                                        id="message"
                                        required
                                    />
                                </div>
                                <button type="submit" className="submit-btn">
                                    Gửi yêu cầu
                                </button>
                            </form>
                        )}

                        {/* Hiển thị trạng thái khi gửi */}
                        {isSubmitting && (
                            <div className="submitting-message">
                                <p className="moving-text">Đang gửi yêu cầu...</p>
                            </div>
                        )}

                        {/* Hiển thị thông báo thành công */}
                        {submitMessage && <p className="submit-message">{submitMessage}</p>}

                        <button onClick={handleFormClose} className="close-btn">Đóng</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Support;
