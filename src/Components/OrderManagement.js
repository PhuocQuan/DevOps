import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Footer from "./Footer";
import "../App.css";

const getTodayDate = () => {
  return new Date().toISOString().split("T")[0];
};

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
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateStr;
};

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [alertMsg, setAlertMsg] = useState("");

  // State cho Modal Xác nhận & Lên lịch giao hàng
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [schedulingOrder, setSchedulingOrder] = useState(null);
  const [deliveryDate, setDeliveryDate] = useState(getTomorrowDate());
  const [deliveryTime, setDeliveryTime] = useState("14:00 - 16:30 (Buổi Chiều)");
  const [customTime, setCustomTime] = useState("");
  const [deliveryNote, setDeliveryNote] = useState("");
  const [scheduleLoading, setScheduleLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      } else {
        throw new Error("Không thể tải danh sách đơn hàng");
      }
    } catch (err) {
      console.error("Lỗi khi tải đơn hàng:", err);
      showAlert("Đã xảy ra lỗi khi tải dữ liệu đơn hàng.", "danger");
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (msg, type = "success") => {
    setAlertMsg({ text: msg, type });
    setTimeout(() => setAlertMsg(""), 4500);
  };

  // Mở modal lên lịch giao hàng & xác nhận
  const openScheduleModal = (order) => {
    setSchedulingOrder(order);
    setDeliveryDate(order.deliveryDate || getTomorrowDate());
    setDeliveryTime(order.deliveryTime || "14:00 - 16:30 (Buổi Chiều)");
    setCustomTime("");
    setDeliveryNote(order.deliveryNote || "Shipper gọi trước khi tới 15 phút");
    setShowScheduleModal(true);
  };

  // Lưu lịch giao hàng và xác nhận đơn
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

      if (!res.ok) throw new Error("Cập nhật lịch giao hàng thất bại");

      const updated = await res.json();
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId || o._id === orderId ? updated : o))
      );

      if (selectedOrder && (selectedOrder.id === orderId || selectedOrder._id === orderId)) {
        setSelectedOrder(updated);
      }

      setShowScheduleModal(false);
      showAlert(
        `Đã xác nhận đơn #${schedulingOrder.orderCode || orderId} và ấn định giờ giao: ${estimatedDelivery}!`,
        "success"
      );
    } catch (err) {
      console.error(err);
      showAlert("Lỗi khi xác nhận và lên lịch giao hàng.", "danger");
    } finally {
      setScheduleLoading(false);
    }
  };

  // Cập nhật trạng thái đơn hàng thông thường
  const handleUpdateStatus = async (orderId, newStatus, newPaymentStatus = null) => {
    try {
      setActionLoading(orderId);
      const payload = { status: newStatus };
      if (newPaymentStatus) {
        payload.paymentStatus = newPaymentStatus;
      } else if (newStatus === "Đã nhận hàng") {
        payload.paymentStatus = "Đã thanh toán";
      }

      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Cập nhật trạng thái thất bại");

      const updated = await res.json();
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId || o._id === orderId ? updated : o))
      );

      if (selectedOrder && (selectedOrder.id === orderId || selectedOrder._id === orderId)) {
        setSelectedOrder(updated);
      }

      showAlert(`Đã cập nhật đơn hàng sang: "${newStatus}" thành công!`, "success");
    } catch (err) {
      console.error(err);
      showAlert("Có lỗi khi cập nhật trạng thái đơn hàng.", "danger");
    } finally {
      setActionLoading(null);
    }
  };

  // Xóa đơn hàng
  const handleDeleteOrder = async (orderId, orderCode) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa đơn hàng #${orderCode || orderId} khỏi hệ thống không?`)) {
      return;
    }

    try {
      setActionLoading(orderId);
      const res = await fetch(`/api/orders/${orderId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Không thể xóa đơn hàng");

      setOrders((prev) => prev.filter((o) => o.id !== orderId && o._id !== orderId));
      if (showDetailModal && selectedOrder && (selectedOrder.id === orderId || selectedOrder._id === orderId)) {
        setShowDetailModal(false);
      }
      showAlert(`Đã xóa đơn hàng #${orderCode || orderId} thành công!`, "success");
    } catch (err) {
      console.error(err);
      showAlert("Lỗi khi xóa đơn hàng.", "danger");
    } finally {
      setActionLoading(null);
    }
  };

  // Xem chi tiết đơn hàng
  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  // Lọc dữ liệu
  const filteredOrders = orders.filter((order) => {
    const matchesFilter =
      activeFilter === "ALL" || order.status === activeFilter;

    const term = searchTerm.toLowerCase();
    const matchesSearch =
      !searchTerm ||
      (order.orderCode && order.orderCode.toLowerCase().includes(term)) ||
      (order.customerName && order.customerName.toLowerCase().includes(term)) ||
      (order.customerPhone && order.customerPhone.toLowerCase().includes(term)) ||
      (order.customerEmail && order.customerEmail.toLowerCase().includes(term));

    return matchesFilter && matchesSearch;
  });

  // Số lượng theo từng trạng thái
  const pendingCount = orders.filter((o) => o.status === "Chờ xác nhận").length;
  const confirmedCount = orders.filter((o) => o.status === "Đã xác nhận").length;
  const shippingCount = orders.filter((o) => o.status === "Đang giao hàng").length;
  const deliveredCount = orders.filter((o) => o.status === "Đã nhận hàng").length;
  const cancelledCount = orders.filter((o) => o.status === "Đã hủy").length;

  // QUY TẮC CHUẨN: CHỈ TÍNH DOANH THU KHI ĐÃ GIAO HÀNG THÀNH CÔNG (ĐÃ NHẬN HÀNG)
  const totalRevenue = orders
    .filter((o) => o.status === "Đã nhận hàng")
    .reduce((acc, curr) => acc + (Number(curr.totalAmount) || 0), 0);

  // Helper render badge trạng thái
  const renderStatusBadge = (status) => {
    switch (status) {
      case "Chờ xác nhận":
        return (
          <span className="badge_order_status status_pending">
            <span className="status_dot_pulse"></span>
            <i className="bi bi-hourglass-split me-1"></i> Chờ xác nhận
          </span>
        );
      case "Đã xác nhận":
        return (
          <span className="badge_order_status status_confirmed">
            <i className="bi bi-check2-circle me-1"></i> Đã xác nhận
          </span>
        );
      case "Đang giao hàng":
        return (
          <span className="badge_order_status status_shipping">
            <i className="bi bi-truck me-1"></i> Đang giao hàng
          </span>
        );
      case "Đã nhận hàng":
        return (
          <span className="badge_order_status status_delivered">
            <i className="bi bi-box2-heart me-1"></i> Đã nhận hàng
          </span>
        );
      case "Đã hủy":
        return (
          <span className="badge_order_status status_cancelled">
            <i className="bi bi-x-circle me-1"></i> Đã hủy
          </span>
        );
      default:
        return <span className="badge_order_status">{status}</span>;
    }
  };

  return (
    <div className="admin_management_wrapper">
      {/* Top Banner / Hero */}
      <div className="admin_header_hero">
        <div className="admin_hero_content">
          <div className="admin_badge_role">
            <i className="bi bi-receipt-cutoff me-2"></i> QUẢN LÝ ĐƠN HÀNG & LÊN LỊCH GIAO
          </div>
          <h1>Quản Lý Đơn Hàng <span>HomeSHOP</span></h1>
          <p className="admin_hero_subtitle">
            Hệ thống tiếp nhận duyệt đơn hàng từ khách, ấn định chính xác ngày giờ giao hàng, 
            điều phối vận chuyển và tự động ghi nhận doanh thu khi khách nhận hàng thành công.
          </p>
        </div>
        <div className="admin_quick_actions">
          <Link to="/admin" className="admin_btn_secondary">
            <i className="bi bi-speedometer2 me-2"></i> Về Dashboard
          </Link>
          <Link to="/productmanagement" className="admin_btn_secondary">
            <i className="bi bi-box-seam me-2"></i> Quản Lý Sản Phẩm
          </Link>
        </div>
      </div>

      <div className="admin_container">
        {/* Thông báo Alert */}
        {alertMsg && (
          <div className={`admin_alert_bar ${alertMsg.type === "danger" ? "alert_error" : "alert_success"}`}>
            <i className={`bi ${alertMsg.type === "danger" ? "bi-exclamation-octagon" : "bi-check-circle-fill"} me-2 fs-5`}></i>
            {alertMsg.text}
          </div>
        )}

        {/* 4 Metric Cards */}
        <div className="admin_metrics_grid mb-4">
          <div className="admin_metric_card card_blue">
            <div className="metric_icon">
              <i className="bi bi-receipt"></i>
            </div>
            <div className="metric_info">
              <span className="metric_title">Tổng Đơn Hàng</span>
              <h3>{loading ? "..." : orders.length}</h3>
              <p className="metric_sub">
                <i className="bi bi-arrow-repeat me-1"></i> Lưu trực tiếp trên Cloud MongoDB
              </p>
            </div>
          </div>

          <div className="admin_metric_card card_amber">
            <div className="metric_icon">
              <i className="bi bi-bell-fill text-warning"></i>
            </div>
            <div className="metric_info">
              <span className="metric_title">Cần Xác Nhận & Hẹn Giờ</span>
              <h3 className="text-warning">{loading ? "..." : pendingCount}</h3>
              <p className="metric_sub">
                <i className="bi bi-calendar2-event me-1"></i> Đang chờ Admin ấn định lịch giao
              </p>
            </div>
          </div>

          <div className="admin_metric_card card_purple">
            <div className="metric_icon">
              <i className="bi bi-truck"></i>
            </div>
            <div className="metric_info">
              <span className="metric_title">Đang Giao Hàng</span>
              <h3>{loading ? "..." : shippingCount}</h3>
              <p className="metric_sub">
                <i className="bi bi-geo-alt me-1"></i> Đang vận chuyển tới địa chỉ khách
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
                <i className="bi bi-check2-all me-1"></i> Tính từ <strong>{deliveredCount}</strong> đơn giao thành công
              </p>
            </div>
          </div>
        </div>

        {/* Main Orders Table Box */}
        <div className="admin_card_box">
          <div className="admin_table_toolbar">
            <div className="table_title_block">
              <h3>
                <i className="bi bi-bag-check-fill me-2 text-primary"></i>
                Danh Sách Đơn Hàng ({filteredOrders.length})
              </h3>
              <p>Dữ liệu đồng bộ trực tuyến với cơ sở dữ liệu MongoDB Atlas</p>
            </div>

            <div className="admin_search_box">
              <i className="bi bi-search"></i>
              <input
                type="text"
                placeholder="Tìm theo Mã đơn, Tên, Số điện thoại..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  type="button"
                  className="search_clear"
                  onClick={() => setSearchTerm("")}
                >
                  <i className="bi bi-x"></i>
                </button>
              )}
            </div>
          </div>

          {/* Filter Status Tabs */}
          <div className="order_filter_tabs">
            <button
              className={`filter_tab_btn ${activeFilter === "ALL" ? "active" : ""}`}
              onClick={() => setActiveFilter("ALL")}
            >
              Tất Cả ({orders.length})
            </button>
            <button
              className={`filter_tab_btn tab_pending ${activeFilter === "Chờ xác nhận" ? "active" : ""}`}
              onClick={() => setActiveFilter("Chờ xác nhận")}
            >
              <i className="bi bi-hourglass-split me-1"></i> Chờ Xác Nhận ({pendingCount})
            </button>
            <button
              className={`filter_tab_btn tab_confirmed ${activeFilter === "Đã xác nhận" ? "active" : ""}`}
              onClick={() => setActiveFilter("Đã xác nhận")}
            >
              <i className="bi bi-check2-circle me-1"></i> Đã Xác Nhận ({confirmedCount})
            </button>
            <button
              className={`filter_tab_btn tab_shipping ${activeFilter === "Đang giao hàng" ? "active" : ""}`}
              onClick={() => setActiveFilter("Đang giao hàng")}
            >
              <i className="bi bi-truck me-1"></i> Đang Giao ({shippingCount})
            </button>
            <button
              className={`filter_tab_btn tab_delivered ${activeFilter === "Đã nhận hàng" ? "active" : ""}`}
              onClick={() => setActiveFilter("Đã nhận hàng")}
            >
              <i className="bi bi-box2-heart me-1"></i> Đã Nhận Hàng ({deliveredCount})
            </button>
            <button
              className={`filter_tab_btn tab_cancelled ${activeFilter === "Đã hủy" ? "active" : ""}`}
              onClick={() => setActiveFilter("Đã hủy")}
            >
              <i className="bi bi-x-circle me-1"></i> Đã Hủy ({cancelledCount})
            </button>
          </div>

          {/* Table */}
          {loading ? (
            <div className="admin_loading_state">
              <div className="spinner-border text-primary" role="status"></div>
              <p>Đang tải đơn hàng từ MongoDB Atlas...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="admin_empty_state py-5">
              <i className="bi bi-inbox fs-1 text-muted d-block mb-3"></i>
              <h4>Không tìm thấy đơn hàng nào</h4>
              <p className="text-muted">
                {searchTerm
                  ? `Không có kết quả khớp với "${searchTerm}". Hãy thử từ khóa khác.`
                  : "Chưa có đơn hàng nào trong mục này."}
              </p>
            </div>
          ) : (
            <div className="admin_table_responsive">
              <table className="admin_custom_table">
                <thead>
                  <tr>
                    <th>Mã Đơn</th>
                    <th>Khách Hàng</th>
                    <th>Địa Chỉ Nhận</th>
                    <th>Sản Phẩm</th>
                    <th>Tổng Tiền</th>
                    <th>Thanh Toán</th>
                    <th>Trạng Thái & Lịch Giao</th>
                    <th className="text-center">Thao Tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => {
                    const orderId = order.id || order._id;
                    const isOrderLoading = actionLoading === orderId;

                    return (
                      <tr key={orderId} className={order.status === "Chờ xác nhận" ? "row_highlight_pending" : ""}>
                        {/* Mã Đơn */}
                        <td>
                          <div className="order_code_badge">
                            <strong>#{order.orderCode || "HD-" + String(orderId).slice(-4)}</strong>
                          </div>
                          <div className="order_date_small">
                            {order.createdAt
                              ? new Date(order.createdAt).toLocaleDateString("vi-VN", {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "Vừa xong"}
                          </div>
                        </td>

                        {/* Khách Hàng */}
                        <td>
                          <div className="customer_name_cell">
                            <strong>{order.customerName}</strong>
                          </div>
                          <div className="customer_sub_contact">
                            <span><i className="bi bi-telephone me-1 text-muted"></i>{order.customerPhone}</span>
                            {order.customerEmail && (
                              <span className="text-muted small"><i className="bi bi-envelope me-1"></i>{order.customerEmail}</span>
                            )}
                          </div>
                        </td>

                        {/* Địa Chỉ */}
                        <td>
                          <div className="max_address_cell" title={order.shippingAddress}>
                            <i className="bi bi-geo-alt text-danger me-1"></i>
                            {order.shippingAddress}
                          </div>
                          {order.notes && (
                            <div className="order_note_badge" title={order.notes}>
                              <i className="bi bi-chat-left-text me-1"></i> {order.notes}
                            </div>
                          )}
                        </td>

                        {/* Sản Phẩm */}
                        <td>
                          <div className="order_items_brief">
                            <span className="badge_items_count">
                              <i className="bi bi-boxes me-1"></i>
                              {order.items ? order.items.length : 0} món
                            </span>
                            <button
                              type="button"
                              className="btn_view_items_link"
                              onClick={() => handleViewDetails(order)}
                            >
                              Chi tiết <i className="bi bi-chevron-right"></i>
                            </button>
                          </div>
                        </td>

                        {/* Tổng Tiền */}
                        <td>
                          <div className="order_price_cell">
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(order.totalAmount || 0)}
                          </div>
                        </td>

                        {/* Thanh Toán */}
                        <td>
                          <div className="payment_cell_info">
                            <span className="payment_method_tag" title={order.paymentMethod}>
                              {order.paymentMethod || "COD"}
                            </span>
                            <span className={`payment_status_pill ${order.paymentStatus === "Đã thanh toán" ? "paid" : "unpaid"}`}>
                              {order.paymentStatus || "Chưa thanh toán"}
                            </span>
                          </div>
                        </td>

                        {/* Trạng Thái & Lịch Giao Hàng */}
                        <td>
                          {renderStatusBadge(order.status)}
                          
                          {/* Lịch giao hàng cụ thể */}
                          {order.deliveryDate || order.deliveryTime ? (
                            <div
                              className="status_scheduled_pill"
                              onClick={() => openScheduleModal(order)}
                              title="Bấm để chỉnh sửa ngày giờ giao hàng"
                            >
                              <i className="bi bi-calendar-check-fill text-primary me-1"></i>
                              <span>{order.deliveryTime || "Trong ngày"}</span>
                              <span className="ms-1 fw-bold">({formatDisplayDate(order.deliveryDate) || order.estimatedDelivery})</span>
                              <i className="bi bi-pencil-fill ms-1 edit_hint_icon"></i>
                            </div>
                          ) : (
                            <div className="status_estimate_text">
                              <i className="bi bi-clock me-1"></i>
                              {order.status === "Chờ xác nhận"
                                ? "Chưa ấn định giờ giao"
                                : order.estimatedDelivery || "2 - 4 ngày"}
                            </div>
                          )}
                        </td>

                        {/* Thao Tác */}
                        <td>
                          <div className="order_action_group">
                            {/* Nút bấm Xác Nhận Kèm Lên Lịch Giao */}
                            {order.status === "Chờ xác nhận" && (
                              <button
                                type="button"
                                className="btn_quick_confirm"
                                disabled={isOrderLoading}
                                onClick={() => openScheduleModal(order)}
                                title="Xác nhận đơn và quyết định ngày giờ giao hàng"
                              >
                                <i className="bi bi-calendar2-check-fill me-1"></i> Xác Nhận & Hẹn Giờ
                              </button>
                            )}

                            {/* Dropdown chuyển trạng thái bất kỳ */}
                            <select
                              className="order_status_select"
                              value={order.status}
                              disabled={isOrderLoading}
                              onChange={(e) => handleUpdateStatus(orderId, e.target.value)}
                            >
                              <option value="Chờ xác nhận">Chờ xác nhận</option>
                              <option value="Đã xác nhận">Đã xác nhận</option>
                              <option value="Đang giao hàng">Đang giao hàng</option>
                              <option value="Đã nhận hàng">Đã nhận hàng</option>
                              <option value="Đã hủy">Đã hủy</option>
                            </select>

                            <button
                              type="button"
                              className="btn_order_action btn_detail"
                              onClick={() => handleViewDetails(order)}
                              title="Xem chi tiết đầy đủ đơn hàng"
                            >
                              <i className="bi bi-eye-fill"></i>
                            </button>

                            <button
                              type="button"
                              className="btn_order_action btn_delete"
                              disabled={isOrderLoading}
                              onClick={() => handleDeleteOrder(orderId, order.orderCode)}
                              title="Xóa đơn hàng này"
                            >
                              <i className="bi bi-trash-fill"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ==================== MODAL 1: LÊN LỊCH GIAO HÀNG & XÁC NHẬN ĐƠN ==================== */}
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
                  Đơn hàng <strong>#{schedulingOrder.orderCode || schedulingOrder.id}</strong> — Khách: <strong>{schedulingOrder.customerName}</strong> ({schedulingOrder.customerPhone})
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
                {/* Thông tin nhận hàng của khách */}
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

                {/* 1. Chọn ngày giao hàng */}
                <div className="form-group mb-3">
                  <label className="fw-bold mb-1">
                    <i className="bi bi-calendar-event text-primary me-1"></i> Ngày Giao Hàng Dự Kiến:
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

                {/* 2. Chọn khung giờ hoặc giờ cụ thể */}
                <div className="form-group mb-3">
                  <label className="fw-bold mb-1">
                    <i className="bi bi-clock-history text-primary me-1"></i> Giờ Giao Hàng Cụ Thể:
                  </label>
                  <div className="time_slots_grid mb-2">
                    <button
                      type="button"
                      className={`btn_time_slot ${deliveryTime === "09:00 - 11:30 (Buổi Sáng)" && !customTime ? "active" : ""}`}
                      onClick={() => { setDeliveryTime("09:00 - 11:30 (Buổi Sáng)"); setCustomTime(""); }}
                    >
                      <i className="bi bi-sun me-1 text-warning"></i> Sáng (09:00 - 11:30)
                    </button>
                    <button
                      type="button"
                      className={`btn_time_slot ${deliveryTime === "14:00 - 16:30 (Buổi Chiều)" && !customTime ? "active" : ""}`}
                      onClick={() => { setDeliveryTime("14:00 - 16:30 (Buổi Chiều)"); setCustomTime(""); }}
                    >
                      <i className="bi bi-brightness-high me-1 text-primary"></i> Chiều (14:00 - 16:30)
                    </button>
                    <button
                      type="button"
                      className={`btn_time_slot ${deliveryTime === "17:30 - 20:00 (Buổi Tối)" && !customTime ? "active" : ""}`}
                      onClick={() => { setDeliveryTime("17:30 - 20:00 (Buổi Tối)"); setCustomTime(""); }}
                    >
                      <i className="bi bi-moon-stars me-1 text-indigo"></i> Tối (17:30 - 20:00)
                    </button>
                  </div>

                  <div className="custom_time_wrap">
                    <span className="small text-muted me-2">Hoặc nhập giờ chính xác (VD: 15:30):</span>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="VD: 10:15 hoặc 15:30"
                      value={customTime}
                      onChange={(e) => setCustomTime(e.target.value)}
                    />
                  </div>
                </div>

                {/* 3. Ghi chú điều phối */}
                <div className="form-group mb-3">
                  <label className="fw-bold mb-1">
                    <i className="bi bi-pencil-square text-primary me-1"></i> Lời Nhắn Cho Shipper & Khách Hàng:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="VD: Shipper gọi trước 15 phút, khách đồng kiểm hàng..."
                    value={deliveryNote}
                    onChange={(e) => setDeliveryNote(e.target.value)}
                  />
                </div>

                {/* Preview Hẹn Giờ */}
                <div className="schedule_preview_box">
                  <div className="preview_badge_tag">LỊCH HẸN GIAO HÀNG SẼ HIỂN THỊ CHO KHÁCH:</div>
                  <div className="preview_appointment_text">
                    <i className="bi bi-alarm-fill text-primary me-2 fs-5"></i>
                    <strong>{customTime ? customTime : deliveryTime}</strong> — Ngày <strong>{formatDisplayDate(deliveryDate)}</strong>
                  </div>
                  <div className="preview_sub_hint">
                    Sau khi Admin bấm xác nhận, khách hàng vào mục <strong>Tài Khoản</strong> sẽ thấy ngay lịch hẹn này để chờ nhận hàng.
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
                  {scheduleLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span> Đang lưu...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check2-circle me-1"></i> Xác Nhận Đơn & Lên Lịch Giao
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== MODAL 2: XEM CHI TIẾT ĐƠN HÀNG ==================== */}
      {showDetailModal && selectedOrder && (
        <div className="modal_backdrop_admin" onClick={() => setShowDetailModal(false)}>
          <div className="modal_box_admin order_detail_modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal_header_admin">
              <div>
                <h4 className="modal-title">
                  <i className="bi bi-receipt me-2 text-primary"></i>
                  Chi Tiết Đơn Hàng #{selectedOrder.orderCode || selectedOrder.id}
                </h4>
                <p className="modal_sub">
                  Ngày đặt: {selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleString("vi-VN") : "Hôm nay"}
                </p>
              </div>
              <button
                type="button"
                className="btn_close_admin_modal"
                onClick={() => setShowDetailModal(false)}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <div className="modal_body_admin">
              {/* Stepper trong modal */}
              <div className="modal_order_status_card">
                <div className="status_row_modal">
                  <span>Trạng thái hiện tại:</span>
                  <div>{renderStatusBadge(selectedOrder.status)}</div>
                </div>
                <div className="status_row_modal">
                  <span>Lịch giao đã ấn định:</span>
                  <strong className="text-primary">
                    {selectedOrder.estimatedDelivery || "Chưa ấn định"}
                  </strong>
                </div>
              </div>

              {/* Thông tin khách hàng */}
              <div className="modal_customer_grid">
                <div className="customer_info_block">
                  <h5><i className="bi bi-person-circle me-2 text-primary"></i> Khách Hàng</h5>
                  <p><strong>Họ tên:</strong> {selectedOrder.customerName}</p>
                  <p><strong>Số điện thoại:</strong> {selectedOrder.customerPhone}</p>
                  <p><strong>Email:</strong> {selectedOrder.customerEmail || "Không có"}</p>
                </div>

                <div className="customer_info_block">
                  <h5><i className="bi bi-geo-alt-fill me-2 text-danger"></i> Giao Hàng & Thanh Toán</h5>
                  <p><strong>Địa chỉ:</strong> {selectedOrder.shippingAddress}</p>
                  <p><strong>Phương thức:</strong> {selectedOrder.paymentMethod}</p>
                  <p>
                    <strong>Thanh toán: </strong>
                    <span className={`badge_payment ${selectedOrder.paymentStatus === "Đã thanh toán" ? "paid" : "unpaid"}`}>
                      {selectedOrder.paymentStatus || "Chưa thanh toán"}
                    </span>
                  </p>
                  {selectedOrder.notes && (
                    <p className="order_modal_note">
                      <strong>Ghi chú:</strong> {selectedOrder.notes}
                    </p>
                  )}
                  {selectedOrder.deliveryNote && (
                    <p className="order_modal_note mt-1 text-primary">
                      <strong>Lời nhắn shipper:</strong> {selectedOrder.deliveryNote}
                    </p>
                  )}
                </div>
              </div>

              {/* Danh sách món hàng đã đặt */}
              <div className="modal_items_section">
                <h5>
                  <i className="bi bi-box-seam me-2 text-success"></i> 
                  Danh Sách Món Hàng ({selectedOrder.items ? selectedOrder.items.length : 0})
                </h5>
                <div className="modal_items_table_wrapper">
                  <table className="modal_items_table">
                    <thead>
                      <tr>
                        <th>Ảnh</th>
                        <th>Tên Sản Phẩm</th>
                        <th>Đơn Giá</th>
                        <th>Số Lượng</th>
                        <th className="text-end">Thành Tiền</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items && selectedOrder.items.length > 0 ? (
                        selectedOrder.items.map((item, idx) => (
                          <tr key={idx}>
                            <td>
                              <img
                                src={item.imageLink || "/images/bannerhome.jpg"}
                                alt={item.name}
                                className="modal_item_thumb"
                                onError={(e) => { e.target.src = "/images/bannerhome.jpg"; }}
                              />
                            </td>
                            <td className="fw-bold">{item.name}</td>
                            <td>
                              {new Intl.NumberFormat("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              }).format(Number(item.price) || 0)}
                            </td>
                            <td className="fw-bold text-center">x{item.quantity}</td>
                            <td className="text-end fw-bold text-danger">
                              {new Intl.NumberFormat("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              }).format((Number(item.price) || 0) * (Number(item.quantity) || 1))}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="text-center py-3 text-muted">
                            Không có thông tin chi tiết các món
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="modal_total_summary">
                  <span>Tổng cộng thanh toán:</span>
                  <span className="modal_total_amount">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(selectedOrder.totalAmount || 0)}
                  </span>
                </div>
              </div>

              {/* Điều khiển đổi trạng thái nhanh trong modal */}
              <div className="modal_status_controller">
                <label className="fw-bold me-2">Chuyển trạng thái đơn hàng:</label>
                <div className="modal_status_buttons">
                  <button
                    type="button"
                    className="btn_status_change btn_confirm"
                    onClick={() => {
                      setShowDetailModal(false);
                      openScheduleModal(selectedOrder);
                    }}
                  >
                    <i className="bi bi-calendar-check me-1"></i> Đổi Lịch Giao / Xác Nhận
                  </button>

                  {selectedOrder.status !== "Đang giao hàng" && (
                    <button
                      type="button"
                      className="btn_status_change btn_ship"
                      onClick={() => handleUpdateStatus(selectedOrder.id || selectedOrder._id, "Đang giao hàng")}
                    >
                      <i className="bi bi-truck me-1"></i> Bắt Đầu Giao Hàng
                    </button>
                  )}
                  {selectedOrder.status !== "Đã nhận hàng" && (
                    <button
                      type="button"
                      className="btn_status_change btn_deliver"
                      onClick={() => handleUpdateStatus(selectedOrder.id || selectedOrder._id, "Đã nhận hàng", "Đã thanh toán")}
                    >
                      <i className="bi bi-box2-heart me-1"></i> Hoàn Tất Đã Nhận Hàng
                    </button>
                  )}
                  {selectedOrder.status !== "Đã hủy" && (
                    <button
                      type="button"
                      className="btn_status_change btn_cancel"
                      onClick={() => handleUpdateStatus(selectedOrder.id || selectedOrder._id, "Đã hủy")}
                    >
                      <i className="bi bi-x-circle me-1"></i> Hủy Đơn Hàng
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="modal_footer_admin">
              <button
                type="button"
                className="btn_modal_close"
                onClick={() => setShowDetailModal(false)}
              >
                Đóng Cửa Sổ
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default OrderManagement;
