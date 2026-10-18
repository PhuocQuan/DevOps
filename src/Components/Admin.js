import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Footer from "./Footer";
import "../App.css";

const Admin = () => {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, userRes] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/user")
        ]);
        if (prodRes.ok) {
          const prodData = await prodRes.json();
          setProducts(prodData);
        }
        if (userRes.ok) {
          const userData = await userRes.json();
          setUsers(userData);
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu admin:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalStock = products.reduce((acc, curr) => acc + (Number(curr.quantity) || 0), 0);

  return (
    <div className="admin_dashboard_wrapper">
      {/* Top Banner / Welcome */}
      <div className="admin_header_hero">
        <div className="admin_hero_content">
          <div className="admin_badge_role">
            <i className="bi bi-shield-check me-2"></i> QUẢN TRỊ VIÊN HỆ THỐNG
          </div>
          <h1>Trung Tâm Điều Hành <span>HomeADMIN</span></h1>
          <p className="admin_hero_subtitle">
            Hệ thống quản lý thời gian thực thiết bị gia dụng, tài khoản người dùng và giám sát hạ tầng AWS Cloud.
          </p>
        </div>
        <div className="admin_quick_actions">
          <Link to="/productmanagement" className="admin_btn_primary">
            <i className="bi bi-box-seam me-2"></i> Quản Lý Sản Phẩm
          </Link>
          <Link to="/usermanagement" className="admin_btn_secondary">
            <i className="bi bi-people-fill me-2"></i> Quản Lý Người Dùng
          </Link>
        </div>
      </div>

      <div className="admin_container">
        {/* KPI Metric Cards */}
        <div className="admin_metrics_grid">
          <div className="admin_metric_card card_blue">
            <div className="metric_icon">
              <i className="bi bi-box-seam-fill"></i>
            </div>
            <div className="metric_info">
              <span className="metric_title">Tổng Sản Phẩm</span>
              <h3>{loading ? "..." : products.length}</h3>
              <p className="metric_sub">
                <i className="bi bi-boxes me-1"></i> Kho: <strong>{totalStock.toLocaleString()}</strong> món hàng
              </p>
            </div>
          </div>

          <div className="admin_metric_card card_green">
            <div className="metric_icon">
              <i className="bi bi-people-fill"></i>
            </div>
            <div className="metric_info">
              <span className="metric_title">Người Dùng Đăng Ký</span>
              <h3>{loading ? "..." : users.length}</h3>
              <p className="metric_sub">
                <i className="bi bi-person-check me-1"></i> Tài khoản hợp lệ trên hệ thống
              </p>
            </div>
          </div>

          <div className="admin_metric_card card_amber">
            <div className="metric_icon">
              <i className="bi bi-cloud-check-fill"></i>
            </div>
            <div className="metric_info">
              <span className="metric_title">Máy Chủ AWS EC2</span>
              <h3 className="text-success">ONLINE</h3>
              <p className="metric_sub">
                <i className="bi bi-hdd-network me-1"></i> Port 80 (Web) & Port 2300 (API)
              </p>
            </div>
          </div>

          <div className="admin_metric_card card_purple">
            <div className="metric_icon">
              <i className="bi bi-shield-lock-fill"></i>
            </div>
            <div className="metric_info">
              <span className="metric_title">Container Docker</span>
              <h3>Hoạt Động</h3>
              <p className="metric_sub">
                <i className="bi bi-cpu me-1"></i> Nginx Alpine + Node JSON Server
              </p>
            </div>
          </div>
        </div>

        {/* 2 Columns: Recent Products & Recent Users */}
        <div className="admin_content_grid">
          {/* Recent Products */}
          <div className="admin_card_box">
            <div className="admin_card_header">
              <div>
                <h4><i className="bi bi-tag-fill me-2 text-primary"></i> Sản Phẩm Mới Cập Nhật</h4>
                <p>Danh sách các mặt hàng vừa được đồng bộ gần đây</p>
              </div>
              <Link to="/productmanagement" className="admin_link_viewall">
                Xem tất cả <i className="bi bi-arrow-right ms-1"></i>
              </Link>
            </div>

            <div className="admin_table_responsive">
              <table className="admin_custom_table">
                <thead>
                  <tr>
                    <th>Ảnh</th>
                    <th>Tên Sản Phẩm</th>
                    <th>Đơn Giá</th>
                    <th>Số Lượng</th>
                  </tr>
                </thead>
                <tbody>
                  {products.slice(0, 5).map((prod, idx) => (
                    <tr key={prod.id || idx}>
                      <td>
                        <img 
                          src={prod.imageLink} 
                          alt={prod.name} 
                          className="admin_thumb_img"
                          onError={(e) => { e.target.src = "/images/bannerhome.jpg"; }}
                        />
                      </td>
                      <td className="fw-bold">{prod.name}</td>
                      <td className="text-danger fw-bold">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(prod.price)}
                      </td>
                      <td>
                        <span className="badge_stock in_stock">{prod.quantity} chiếc</span>
                      </td>
                    </tr>
                  ))}
                  {products.length === 0 && !loading && (
                    <tr>
                      <td colSpan="4" className="text-center py-4 text-muted">Chưa có sản phẩm nào.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Users */}
          <div className="admin_card_box">
            <div className="admin_card_header">
              <div>
                <h4><i className="bi bi-person-lines-fill me-2 text-success"></i> Người Dùng Hệ Thống</h4>
                <p>Khách hàng và quản trị viên đã đăng ký</p>
              </div>
              <Link to="/usermanagement" className="admin_link_viewall">
                Xem tất cả <i className="bi bi-arrow-right ms-1"></i>
              </Link>
            </div>

            <div className="admin_table_responsive">
              <table className="admin_custom_table">
                <thead>
                  <tr>
                    <th>Họ và Tên</th>
                    <th>Tài Khoản</th>
                    <th>Email</th>
                    <th>Vai Trò</th>
                  </tr>
                </thead>
                <tbody>
                  {users.slice(0, 5).map((u, idx) => (
                    <tr key={u.id || idx}>
                      <td className="fw-bold">
                        <div className="d-flex align-items-center">
                          <div className="user_initial_avatar me-2">
                            {(u.fullName || u.username || "U")[0].toUpperCase()}
                          </div>
                          <span>{u.fullName || "Chưa đặt tên"}</span>
                        </div>
                      </td>
                      <td><code>{u.username}</code></td>
                      <td className="text-muted small">{u.email || "N/A"}</td>
                      <td>
                        {u.username === "admin" ? (
                          <span className="badge_role badge_admin">Admin</span>
                        ) : (
                          <span className="badge_role badge_user">Khách hàng</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && !loading && (
                    <tr>
                      <td colSpan="4" className="text-center py-4 text-muted">Chưa có người dùng nào.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* DevOps Infrastructure Status Card */}
        <div className="admin_card_box mt-4">
          <div className="admin_card_header">
            <div>
              <h4><i className="bi bi-terminal-split me-2 text-info"></i> Kiến Trúc Hạ Tầng & Triển Khai DevOps</h4>
              <p>Môi trường vận hành máy chủ đám mây trực tiếp</p>
            </div>
            <span className="badge_health">
              <i className="bi bi-check-circle-fill text-success me-1"></i> Hệ thống ổn định 100%
            </span>
          </div>

          <div className="devops_status_grid">
            <div className="devops_item">
              <span className="devops_label">Hệ Điều Hành Host</span>
              <strong>Ubuntu 22.04 LTS (AWS EC2)</strong>
            </div>
            <div className="devops_item">
              <span className="devops_label">Địa chỉ Public IP</span>
              <strong>32.236.224.186</strong>
            </div>
            <div className="devops_item">
              <span className="devops_label">Container Engine</span>
              <strong>Docker (Image: front_dep)</strong>
            </div>
            <div className="devops_item">
              <span className="devops_label">Web Server & Reverse Proxy</span>
              <strong>Nginx Alpine (Port 80)</strong>
            </div>
            <div className="devops_item">
              <span className="devops_label">Database & Backend API</span>
              <strong>MongoDB Atlas Cloud + Express.js (Port 2300)</strong>
            </div>
            <div className="devops_item">
              <span className="devops_label">Quy Trình Tự Động Hóa</span>
              <strong>Git CI/CD Pipeline (Branch: main)</strong>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Admin;
