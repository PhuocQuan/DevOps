import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Footer from "./Footer";
import "../App.css";

const getTodayDate = () => new Date().toISOString().split("T")[0];
const getTomorrowDate = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
};
const getAfterTwoDaysDate = () => {
  const d = new Date();
  d.setDate(d.getDate() + 2);
  return d.toISOString().split("T")[0];
};
const formatDisplayDate = (dateStr) => {
  if (!dateStr) return "";
  const parts = dateStr.split("-");
  if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
  return dateStr;
};

const Admin = () => {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // State cho Modal Lên lịch giao hàng & Xác nhận
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [schedulingOrder, setSchedulingOrder] = useState(null);
  const [deliveryDate, setDeliveryDate] = useState(getTomorrowDate());
  const [deliveryTime, setDeliveryTime] = useState("14:00 - 16:30 (Buổi Chiều)");
  const [customTime, setCustomTime] = useState("");
  const [deliveryNote, setDeliveryNote] = useState("");
  const [scheduleLoading, setScheduleLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, userRes, orderRes] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/user"),
          fetch("/api/orders"),
        ]);
        if (prodRes.ok) {
          const prodData = await prodRes.json();
          setProducts(prodData);
        }
        if (userRes.ok) {
          const userData = await userRes.json();
          setUsers(userData);
        }
        if (orderRes.ok) {
          const orderData = await orderRes.json();
          setOrders(orderData);
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu admin:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const openScheduleModal = (order) => {
    setSchedulingOrder(order);
    setDeliveryDate(order.deliveryDate || getTomorrowDate());
    setDeliveryTime(order.deliveryTime || "14:00 - 16:30 (Buổi Chiều)");
    setCustomTime("");
    setDeliveryNote(order.deliveryNote || "Shipper gọi trước khi tới 15 phút");
    setShowScheduleModal(true);
  };

  const handleConfirmWithSchedule = async (e) => {
    if (e) e.preventDefault();
    if (!schedulingOrder) return;
    try {
      setScheduleLoading(true);
      const orderId = schedulingOrder.id || schedulingOrder._id;
      const finalTime = customTime.trim() ? customTime.trim() : deliveryTime;
      const formattedDate = formatDisplayDate(deliveryDate);
      const estimatedDelivery = `${finalTime}, Ngày ${formattedDate}`;

      const payload = {
        status: "Đã xác nhận",
        deliveryDate,
        deliveryTime: finalTime,
        deliveryNote: deliveryNote.trim(),
        estimatedDelivery,
      };

      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const updated = await res.json();
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId || o._id === orderId ? updated : o))
        );
      }
      setShowScheduleModal(false);
    } catch (err) {
      console.error(err);
    } finally {
      setScheduleLoading(false);
    }
  };

  const totalStock = products.reduce((acc, curr) => acc + (Number(curr.quantity) || 0), 0);
  const pendingOrders = orders.filter((o) => o.status === "Chờ xác nhận");
  const deliveredOrders = orders.filter((o) => o.status === "Đã nhận hàng");
  const totalRevenue = deliveredOrders.reduce(
    (acc, curr) => acc + (Number(curr.totalAmount) || 0),
    0
  );

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
            Hệ thống quản lý thời gian thực thiết bị gia dụng, tiếp nhận duyệt đơn hàng khách đặt, 
            ấn định ngày giờ giao hàng và giám sát hạ tầng AWS Cloud.
          </p>
        </div>
        <div className="admin_quick_actions">
          <Link to="/ordermanagement" className="admin_btn_primary position-relative">
            <i className="bi bi-receipt me-2"></i> Quản Lý Đơn Hàng
            {pendingOrders.length > 0 && (
              <span className="badge_notify_pulse">{pendingOrders.length}</span>
            )}
          </Link>
          <Link to="/productmanagement" className="admin_btn_secondary">
            <i className="bi bi-box-seam me-2"></i> Sản Phẩm
          </Link>
          <Link to="/usermanagement" className="admin_btn_secondary">
            <i className="bi bi-people-fill me-2"></i> Người Dùng
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

          <div className="admin_metric_card card_amber">
            <div className="metric_icon">
              <i className="bi bi-bell-fill text-warning"></i>
            </div>
            <div className="metric_info">
              <span className="metric_title">Đơn Cần Hẹn Giờ Giao</span>
              <h3 className="text-warning">
                {loading ? "..." : orders.length}
                {pendingOrders.length > 0 && (
                  <span className="sub_pending_tag">({pendingOrders.length} chờ duyệt)</span>
                )}
              </h3>
              <p className="metric_sub">
                <Link to="/ordermanagement" className="text-warning fw-bold text-decoration-none">
                  Lên lịch giao ngay <i className="bi bi-arrow-right"></i>
                </Link>
              </p>
            </div>
          </div>

          <div className="admin_metric_card card_green">
            <div className="metric_icon">
              <i className="bi bi-cash-coin"></i>
            </div>
            <div className="metric_info">
              <span className="metric_title">Doanh Thu Thực Tế</span>
              <h3 className="text-success">
                {loading
                  ? "..."
                  : new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                      maximumFractionDigits: 0,
                    }).format(totalRevenue)}
              </h3>
              <p className="metric_sub">
                <i className="bi bi-check-circle me-1"></i> Tính từ <strong>{deliveredOrders.length}</strong> đơn đã nhận hàng
              </p>
            </div>
          </div>

          <div className="admin_metric_card card_purple">
            <div className="metric_icon">
              <i className="bi bi-people-fill"></i>
            </div>
            <div className="metric_info">
              <span className="metric_title">Người Dùng Đăng Ký</span>
              <h3>{loading ? "..." : users.length}</h3>
              <p className="metric_sub">
                <i className="bi bi-person-check me-1"></i> Khách hàng & Quản trị
              </p>
            </div>
          </div>
        </div>

        {/* Section: Đơn hàng mới nhất cần xác nhận & lên lịch */}
        <div className="admin_card_box mb-4">
          <div className="admin_card_header">
            <div>
              <h4>
                <i className="bi bi-receipt-cutoff me-2 text-warning"></i> 
                Đơn Hàng Gần Đây Cần Xác Nhận & Lên Lịch Giao
              </h4>
              <p>Khách hàng vừa đặt đơn và chờ ban quản trị duyệt & hẹn giờ giao tận nơi</p>
            </div>
            <Link to="/ordermanagement" className="admin_link_viewall">
              Vào trang Quản Lý Đơn Hàng <i className="bi bi-arrow-right ms-1"></i>
            </Link>
          </div>

          <div className="admin_table_responsive">
            <table className="admin_custom_table">
              <thead>
                <tr>
                  <th>Mã Đơn</th>
                  <th>Khách Hàng</th>
                  <th>Địa Chỉ Giao</th>
                  <th>Sản Phẩm</th>
                  <th>Tổng Tiền</th>
                  <th>Trạng Thái & Lịch Hẹn</th>
                  <th className="text-center">Xác Nhận & Hẹn Giờ</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map((order) => {
                  const orderId = order.id || order._id;

                  return (
                    <tr key={orderId} className={order.status === "Chờ xác nhận" ? "row_highlight_pending" : ""}>
                      <td>
                        <strong>#{order.orderCode || "HD-" + String(orderId).slice(-4)}</strong>
                        <div className="order_date_small">
                          {order.createdAt ? new Date(order.createdAt).toLocaleDateString("vi-VN") : "Hôm nay"}
                        </div>
                      </td>
                      <td>
                        <div className="fw-bold">{order.customerName}</div>
                        <span className="text-muted small">{order.customerPhone}</span>
                      </td>
                      <td>
                        <div className="max_address_cell" title={order.shippingAddress}>
                          {order.shippingAddress}
                        </div>
                      </td>
                      <td>
                        <span className="badge_items_count">
                          {order.items ? order.items.length : 0} món
                        </span>
                      </td>
                      <td className="fw-bold text-danger">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(order.totalAmount || 0)}
                      </td>
                      <td>
                        <span className={`badge_order_status_mini ${order.status === "Chờ xác nhận" ? "pending" : "confirmed"}`}>
                          {order.status}
                        </span>
                        {order.deliveryTime || order.deliveryDate ? (
                          <div className="text-primary fw-bold small mt-1">
                            <i className="bi bi-alarm-fill me-1"></i>
                            {order.deliveryTime} ({formatDisplayDate(order.deliveryDate) || order.estimatedDelivery})
                          </div>
                        ) : (
                          <div className="text-muted small mt-1">Chưa xếp lịch</div>
                        )}
                      </td>
                      <td className="text-center">
                        {order.status === "Chờ xác nhận" ? (
                          <button
                            type="button"
                            className="btn_quick_confirm_sm"
                            onClick={() => openScheduleModal(order)}
                          >
                            <i className="bi bi-calendar2-check-fill me-1"></i> Hẹn Giờ & Duyệt
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="btn_edit_schedule_link"
                            onClick={() => openScheduleModal(order)}
                            title="Đổi lịch hẹn giao hàng"
                          >
                            <i className="bi bi-pencil me-1"></i> Đổi Giờ
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {orders.length === 0 && !loading && (
                  <tr>
                    <td colSpan="7" className="text-center py-4 text-muted">
                      Chưa có đơn hàng nào được ghi nhận.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
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

      {/* Modal Lên Lịch Giao Hàng & Xác Nhận trong Dashboard */}
      {showScheduleModal && schedulingOrder && (
        <div className="modal_backdrop_admin" onClick={() => setShowScheduleModal(false)}>
          <div className="modal_box_admin schedule_modal_box" onClick={(e) => e.stopPropagation()}>
            <div className="modal_header_admin">
              <div>
                <h4 className="modal-title">
                  <i className="bi bi-calendar2-check text-primary me-2"></i>
                  Xác Nhận Đơn & Quyết Định Lịch Giao Hàng
                </h4>
                <p className="modal_sub">
                  Đơn hàng <strong>#{schedulingOrder.orderCode || schedulingOrder.id}</strong> — Khách: <strong>{schedulingOrder.customerName}</strong>
                </p>
              </div>
              <button
                type="button"
                className="btn_close_admin_modal"
                onClick={() => setShowScheduleModal(false)}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <form onSubmit={handleConfirmWithSchedule}>
              <div className="modal_body_admin">
                <div className="delivery_dest_summary mb-3">
                  <div className="dest_icon"><i className="bi bi-geo-alt-fill text-danger"></i></div>
                  <div>
                    <strong>Địa chỉ giao hàng:</strong>
                    <p className="m-0 text-muted">{schedulingOrder.shippingAddress}</p>
                    {schedulingOrder.notes && (
                      <span className="badge_cust_note">Khách nhắn: "{schedulingOrder.notes}"</span>
                    )}
                  </div>
                </div>

                <div className="form-group mb-3">
                  <label className="fw-bold mb-1">
                    <i className="bi bi-calendar-event text-primary me-1"></i> Ngày Giao Hàng:
                  </label>
                  <div className="quick_chips_row mb-2">
                    <button
                      type="button"
                      className={`btn_date_chip ${deliveryDate === getTodayDate() ? "active" : ""}`}
                      onClick={() => setDeliveryDate(getTodayDate())}
                    >
                      Hôm Nay ({formatDisplayDate(getTodayDate())})
                    </button>
                    <button
                      type="button"
                      className={`btn_date_chip ${deliveryDate === getTomorrowDate() ? "active" : ""}`}
                      onClick={() => setDeliveryDate(getTomorrowDate())}
                    >
                      Ngày Mai ({formatDisplayDate(getTomorrowDate())})
                    </button>
                    <button
                      type="button"
                      className={`btn_date_chip ${deliveryDate === getAfterTwoDaysDate() ? "active" : ""}`}
                      onClick={() => setDeliveryDate(getAfterTwoDaysDate())}
                    >
                      Sau 2 Ngày ({formatDisplayDate(getAfterTwoDaysDate())})
                    </button>
                  </div>
                  <input
                    type="date"
                    className="form-control admin_date_input"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group mb-3">
                  <label className="fw-bold mb-1">
                    <i className="bi bi-clock-history text-primary me-1"></i> Giờ Giao Hàng:
                  </label>
                  <div className="time_slots_grid mb-2">
                    <button
                      type="button"
                      className={`btn_time_slot ${deliveryTime === "09:00 - 11:30 (Buổi Sáng)" && !customTime ? "active" : ""}`}
                      onClick={() => { setDeliveryTime("09:00 - 11:30 (Buổi Sáng)"); setCustomTime(""); }}
                    >
                      Sáng (09:00 - 11:30)
                    </button>
                    <button
                      type="button"
                      className={`btn_time_slot ${deliveryTime === "14:00 - 16:30 (Buổi Chiều)" && !customTime ? "active" : ""}`}
                      onClick={() => { setDeliveryTime("14:00 - 16:30 (Buổi Chiều)"); setCustomTime(""); }}
                    >
                      Chiều (14:00 - 16:30)
                    </button>
                    <button
                      type="button"
                      className={`btn_time_slot ${deliveryTime === "17:30 - 20:00 (Buổi Tối)" && !customTime ? "active" : ""}`}
                      onClick={() => { setDeliveryTime("17:30 - 20:00 (Buổi Tối)"); setCustomTime(""); }}
                    >
                      Tối (17:30 - 20:00)
                    </button>
                  </div>

                  <div className="custom_time_wrap">
                    <span className="small text-muted me-2">Hoặc nhập giờ chính xác:</span>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="VD: 15:30"
                      value={customTime}
                      onChange={(e) => setCustomTime(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group mb-3">
                  <label className="fw-bold mb-1">
                    <i className="bi bi-pencil-square text-primary me-1"></i> Ghi Chú Giao Hàng:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="VD: Gọi trước khi giao, đồng kiểm hàng..."
                    value={deliveryNote}
                    onChange={(e) => setDeliveryNote(e.target.value)}
                  />
                </div>

                <div className="schedule_preview_box">
                  <div className="preview_badge_tag">LỊCH HẸN GIAO HÀNG SẼ HIỂN THỊ CHO KHÁCH:</div>
                  <div className="preview_appointment_text">
                    <i className="bi bi-alarm-fill text-primary me-2 fs-5"></i>
                    <strong>{customTime ? customTime : deliveryTime}</strong> — Ngày <strong>{formatDisplayDate(deliveryDate)}</strong>
                  </div>
                </div>
              </div>

              <div className="modal_footer_admin">
                <button
                  type="button"
                  className="btn_modal_close me-2"
                  onClick={() => setShowScheduleModal(false)}
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  disabled={scheduleLoading}
                  className="btn_confirm_schedule_submit"
                >
                  {scheduleLoading ? "Đang lưu..." : "Xác Nhận & Lên Lịch Giao"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Admin;
