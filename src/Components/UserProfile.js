import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Footer from "./Footer";
import "../App.css";

function UserProfile() {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("orders"); // "profile" hoặc "orders"
  
  // Profile edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);

  // Orders state
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [confirmingOrderId, setConfirmingOrderId] = useState(null);
  const [toastMsg, setToastMsg] = useState("");

  useEffect(() => {
    const loggedInStatus = localStorage.getItem("isLoggedIn") === "true";
    if (!loggedInStatus) {
      navigate("/login");
      return;
    }
    fetchUserProfile();
    fetchUserOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const showToast = (msg, type = "success") => {
    setToastMsg({ text: msg, type });
    setTimeout(() => setToastMsg(""), 4000);
  };

  const fetchUserProfile = async () => {
    try {
      const userData = localStorage.getItem("userData");
      if (!userData) {
        throw new Error("Vui lòng đăng nhập để xem thông tin.");
      }

      const { username } = JSON.parse(userData);

      const response = await fetch("/api/user");
      if (!response.ok) {
        throw new Error("Không thể lấy thông tin người dùng.");
      }

      const users = await response.json();
      const currentUser = users.find((u) => u.username === username);

      if (currentUser) {
        setUserProfile(currentUser);
        setEditedProfile(currentUser);
      } else {
        // Fallback to localStorage data
        const parsed = JSON.parse(userData);
        setUserProfile(parsed);
        setEditedProfile(parsed);
      }
    } catch (err) {
      console.error("Lỗi khi tải thông tin user:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserOrders = async () => {
    try {
      setOrdersLoading(true);
      const res = await fetch("/api/orders");
      if (res.ok) {
        const allOrders = await res.json();
        const storedUserData = JSON.parse(localStorage.getItem("userData") || "{}");
        const currentUsername = storedUserData.username || "";
        const currentEmail = storedUserData.email || "";
        const currentPhone = storedUserData.phone || "";

        // Lọc các đơn hàng thuộc về người dùng này
        const userOrders = allOrders.filter((order) => {
          if (order.customerUsername && order.customerUsername === currentUsername) {
            return true;
          }
          if (order.customerEmail && currentEmail && order.customerEmail === currentEmail) {
            return true;
          }
          if (order.customerPhone && currentPhone && order.customerPhone === currentPhone) {
            return true;
          }
          // Nếu đơn hàng mới đặt trùng tên
          if (storedUserData.fullName && order.customerName === storedUserData.fullName) {
            return true;
          }
          return false;
        });

        // Nếu người dùng chưa có đơn riêng biệt, hiển thị các đơn đã lưu để dễ theo dõi
        setOrders(userOrders.length > 0 ? userOrders : allOrders);
      }
    } catch (err) {
      console.error("Lỗi khi tải đơn hàng user:", err);
    } finally {
      setOrdersLoading(false);
    }
  };

  // Khách bấm "Đã nhận được hàng"
  const handleConfirmReceived = async (orderId, orderCode) => {
    const isConfirmed = window.confirm(
      `Bạn xác nhận đã nhận đầy đủ sản phẩm cho đơn hàng #${orderCode || orderId}?\nTrạng thái sẽ được cập nhật thành "Đã nhận hàng" và hoàn tất đơn hàng.`
    );
    if (!isConfirmed) return;

    try {
      setConfirmingOrderId(orderId);
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "Đã nhận hàng",
          paymentStatus: "Đã thanh toán",
        }),
      });

      if (!res.ok) throw new Error("Cập nhật trạng thái nhận hàng thất bại");

      const updated = await res.json();
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId || o._id === orderId ? updated : o))
      );

      showToast(`Chúc mừng bạn đã nhận hàng thành công cho đơn #${orderCode}! Cảm ơn bạn.`);
    } catch (err) {
      console.error(err);
      showToast("Có lỗi xảy ra khi xác nhận nhận hàng.", "danger");
    } finally {
      setConfirmingOrderId(null);
    }
  };

  // Khách bấm "Hủy đơn hàng" (khi còn đang Chờ xác nhận)
  const handleCancelOrder = async (orderId, orderCode) => {
    const isConfirmed = window.confirm(`Bạn có chắc chắn muốn hủy đơn hàng #${orderCode || orderId}?`);
    if (!isConfirmed) return;

    try {
      setConfirmingOrderId(orderId);
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Đã hủy" }),
      });

      if (!res.ok) throw new Error("Hủy đơn hàng thất bại");

      const updated = await res.json();
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId || o._id === orderId ? updated : o))
      );

      showToast(`Đã hủy đơn hàng #${orderCode} thành công.`, "success");
    } catch (err) {
      console.error(err);
      showToast("Lỗi khi hủy đơn hàng.", "danger");
    } finally {
      setConfirmingOrderId(null);
    }
  };

  // Lưu chỉnh sửa thông tin cá nhân
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaveLoading(true);
      const userId = editedProfile.id || editedProfile._id;
      const updateResponse = await fetch(`/api/user/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedProfile),
      });

      if (!updateResponse.ok) {
        throw new Error("Không thể cập nhật thông tin cá nhân.");
      }

      const updatedUser = await updateResponse.json();
      setUserProfile(updatedUser);
      localStorage.setItem("userData", JSON.stringify(updatedUser));
      setIsEditing(false);
      showToast("Cập nhật thông tin cá nhân thành công!");
    } catch (err) {
      console.error("Lỗi khi cập nhật profile:", err);
      showToast("Lỗi khi lưu thông tin: " + err.message, "danger");
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="user_profile_loading">
        <div className="spinner-border text-primary" role="status"></div>
        <p>Đang tải thông tin tài khoản...</p>
      </div>
    );
  }

  if (error && !userProfile) {
    return (
      <div className="user_profile_error">
        <i className="bi bi-exclamation-triangle fs-1 text-danger mb-2"></i>
        <h3>{error}</h3>
        <button onClick={() => navigate("/login")} className="btn_back_login">
          Đăng nhập lại
        </button>
      </div>
    );
  }

  return (
    <div className="user_profile_page_wrapper">
      <div className="user_profile_container">
        {/* Toast Alert */}
        {toastMsg && (
          <div className={`user_toast_alert ${toastMsg.type === "danger" ? "toast_error" : "toast_success"}`}>
            <i className={`bi ${toastMsg.type === "danger" ? "bi-x-circle-fill" : "bi-check-circle-fill"} me-2 fs-5`}></i>
            {toastMsg.text}
          </div>
        )}

        {/* User Hero Banner */}
        <div className="user_hero_card">
          <div className="user_avatar_circle">
            {(userProfile?.fullName || userProfile?.username || "U")[0].toUpperCase()}
          </div>
          <div className="user_hero_info">
            <div className="user_badge_pill">
              <i className="bi bi-star-fill text-warning me-1"></i> 
              {userProfile?.username === "admin" ? "Quản Trị Viên" : "Khách Hàng Thân Thiết"}
            </div>
            <h2>{userProfile?.fullName || userProfile?.username}</h2>
            <p className="user_hero_sub">
              <span><i className="bi bi-person-badge me-1"></i> @{userProfile?.username}</span>
              {userProfile?.email && (
                <span><i className="bi bi-envelope me-1 ms-3"></i> {userProfile?.email}</span>
              )}
              {userProfile?.phone && (
                <span><i className="bi bi-telephone me-1 ms-3"></i> {userProfile?.phone}</span>
              )}
            </p>
          </div>
        </div>

        {/* Navigation Tabs: Thông Tin Cá Nhân vs Đơn Hàng Của Tôi */}
        <div className="user_tabs_nav">
          <button
            className={`user_tab_btn ${activeTab === "orders" ? "active" : ""}`}
            onClick={() => setActiveTab("orders")}
          >
            <i className="bi bi-bag-check-fill me-2"></i> 
            Đơn Hàng Của Tôi
            <span className="user_tab_badge">{orders.length}</span>
          </button>
          <button
            className={`user_tab_btn ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            <i className="bi bi-person-lines-fill me-2"></i> 
            Thông Tin Cá Nhân
          </button>
        </div>

        {/* ==================== TAB 1: ĐƠN HÀNG CỦA TÔI ==================== */}
        {activeTab === "orders" && (
          <div className="orders_tab_section">
            <div className="section_title_row">
              <div>
                <h3><i className="bi bi-box2-heart text-primary me-2"></i> Lịch Sử & Tiến Độ Đơn Hàng</h3>
                <p>Theo dõi tình trạng đơn hàng từ lúc đặt, chờ giao hàng đến khi nhận hàng thành công</p>
              </div>
              <Link to="/member4" className="btn_order_more">
                <i className="bi bi-cart-plus me-1"></i> Mua Thêm Sản Phẩm
              </Link>
            </div>

            {ordersLoading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status"></div>
                <p className="mt-2 text-muted">Đang kiểm tra đơn hàng từ MongoDB Atlas...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="user_empty_orders_box">
                <i className="bi bi-cart-x fs-1 text-muted d-block mb-3"></i>
                <h4>Bạn chưa có đơn hàng nào</h4>
                <p className="text-muted">Hãy chọn mua các sản phẩm gia dụng và nội thất tuyệt vời của chúng tôi ngay hôm nay!</p>
                <Link to="/" className="btn_start_shopping">
                  Khám phá sản phẩm ngay
                </Link>
              </div>
            ) : (
              <div className="orders_cards_grid">
                {orders.map((order) => {
                  const orderId = order.id || order._id;
                  const isConfirming = confirmingOrderId === orderId;

                  // Tính trạng thái stepper
                  const isPending = order.status === "Chờ xác nhận";
                  const isConfirmed = order.status === "Đã xác nhận";
                  const isShipping = order.status === "Đang giao hàng";
                  const isDelivered = order.status === "Đã nhận hàng";
                  const isCancelled = order.status === "Đã hủy";

                  return (
                    <div key={orderId} className={`user_order_card ${isDelivered ? "delivered_border" : ""}`}>
                      {/* Order Card Header */}
                      <div className="order_card_top">
                        <div className="order_code_meta">
                          <span className="order_code_label">
                            Mã đơn: <strong>#{order.orderCode || "HD-" + String(orderId).slice(-4)}</strong>
                          </span>
                          <span className="order_date_label">
                            <i className="bi bi-calendar-event me-1"></i>
                            {order.createdAt
                              ? new Date(order.createdAt).toLocaleDateString("vi-VN", {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "Vừa xong"}
                          </span>
                        </div>

                        <div className="order_status_wrap">
                          {isPending && (
                            <span className="badge_user_status status_pending">
                              <span className="status_dot_pulse"></span>
                              <i className="bi bi-hourglass-split me-1"></i> Chờ Admin Xác Nhận
                            </span>
                          )}
                          {isConfirmed && (
                            <span className="badge_user_status status_confirmed">
                              <i className="bi bi-check2-circle me-1"></i> Đã Xác Nhận (Đang đóng gói)
                            </span>
                          )}
                          {isShipping && (
                            <span className="badge_user_status status_shipping">
                              <i className="bi bi-truck me-1"></i> Đang Giao Hàng (Chờ nhận)
                            </span>
                          )}
                          {isDelivered && (
                            <span className="badge_user_status status_delivered">
                              <i className="bi bi-patch-check-fill me-1"></i> Đã Nhận Hàng (Hoàn tất)
                            </span>
                          )}
                          {isCancelled && (
                            <span className="badge_user_status status_cancelled">
                              <i className="bi bi-x-circle me-1"></i> Đã Hủy
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Visual Stepper */}
                      {!isCancelled && (
                        <div className="user_order_stepper">
                          <div className={`user_step ${isPending || isConfirmed || isShipping || isDelivered ? "done" : ""}`}>
                            <div className="circle"><i className="bi bi-bag-check"></i></div>
                            <span>Đặt hàng</span>
                          </div>
                          <div className={`line ${isConfirmed || isShipping || isDelivered ? "done" : ""}`}></div>

                          <div className={`user_step ${isConfirmed || isShipping || isDelivered ? "done" : (isPending ? "current" : "")}`}>
                            <div className="circle"><i className="bi bi-shield-check"></i></div>
                            <span>Xác nhận</span>
                          </div>
                          <div className={`line ${isShipping || isDelivered ? "done" : ""}`}></div>

                          <div className={`user_step ${isShipping || isDelivered ? "done" : (isConfirmed ? "current" : "")}`}>
                            <div className="circle"><i className="bi bi-truck"></i></div>
                            <span>Giao hàng</span>
                          </div>
                          <div className={`line ${isDelivered ? "done" : ""}`}></div>

                          <div className={`user_step ${isDelivered ? "done" : (isShipping ? "current" : "")}`}>
                            <div className="circle"><i className="bi bi-box2-heart"></i></div>
                            <span>Đã nhận</span>
                          </div>
                        </div>
                      )}

                      {/* Delivery Info Notification */}
                      <div className="order_shipping_notice">
                        <i className="bi bi-clock-history text-primary me-2 fs-5"></i>
                        <div>
                          <strong>Dự kiến nhận hàng: </strong>
                          <span className="text-primary fw-bold">{order.estimatedDelivery || "2 - 4 ngày làm việc"}</span>
                          <div className="text-muted small mt-1">
                            Giao tới: <strong>{order.shippingAddress}</strong> (SĐT: {order.customerPhone})
                          </div>
                        </div>
                      </div>

                      {/* Items List */}
                      <div className="user_order_items_box">
                        {order.items && order.items.length > 0 ? (
                          order.items.map((item, idx) => (
                            <div key={idx} className="user_order_item_row">
                              <img
                                src={item.imageLink || "/images/bannerhome.jpg"}
                                alt={item.name}
                                className="item_img_thumb"
                                onError={(e) => { e.target.src = "/images/bannerhome.jpg"; }}
                              />
                              <div className="item_meta">
                                <div className="item_name">{item.name}</div>
                                <div className="item_qty text-muted">Số lượng: <strong>x{item.quantity}</strong></div>
                              </div>
                              <div className="item_price">
                                {new Intl.NumberFormat("vi-VN", {
                                  style: "currency",
                                  currency: "VND",
                                }).format(Number(item.price) * Number(item.quantity))}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-muted small py-2">Chi tiết sản phẩm đã được gửi tới hệ thống.</div>
                        )}
                      </div>

                      {/* Order Footer & Actions */}
                      <div className="order_card_bottom">
                        <div className="order_summary_left">
                          <div>
                            <span className="text-muted small">Phương thức: </span>
                            <span className="fw-bold">{order.paymentMethod || "COD"}</span>
                          </div>
                          <div>
                            <span className="text-muted small">Thanh toán: </span>
                            <span className={`badge_pay_small ${order.paymentStatus === "Đã thanh toán" ? "paid" : "unpaid"}`}>
                              {order.paymentStatus || "Chưa thanh toán"}
                            </span>
                          </div>
                        </div>

                        <div className="order_summary_right">
                          <div className="order_total_display">
                            <span className="total_title">Tổng thanh toán:</span>
                            <span className="total_price_number">
                              {new Intl.NumberFormat("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              }).format(order.totalAmount || 0)}
                            </span>
                          </div>

                          <div className="order_action_buttons">
                            {/* NÚT QUAN TRỌNG: Khách bấm "Đã nhận được hàng" */}
                            {(isShipping || isConfirmed) && (
                              <button
                                type="button"
                                className="btn_confirm_received"
                                disabled={isConfirming}
                                onClick={() => handleConfirmReceived(orderId, order.orderCode)}
                              >
                                {isConfirming ? (
                                  <span className="spinner-border spinner-border-sm me-1"></span>
                                ) : (
                                  <i className="bi bi-box2-heart-fill me-1"></i>
                                )}
                                Đã Nhận Được Hàng
                              </button>
                            )}

                            {/* Nút hủy đơn nếu còn chờ duyệt */}
                            {isPending && (
                              <button
                                type="button"
                                className="btn_cancel_user_order"
                                disabled={isConfirming}
                                onClick={() => handleCancelOrder(orderId, order.orderCode)}
                              >
                                <i className="bi bi-x-circle me-1"></i> Hủy Đơn
                              </button>
                            )}

                            {/* Thông báo đã nhận thành công */}
                            {isDelivered && (
                              <div className="received_success_tag">
                                <i className="bi bi-check-circle-fill me-1"></i> Giao dịch thành công
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ==================== TAB 2: THÔNG TIN CÁ NHÂN ==================== */}
        {activeTab === "profile" && (
          <div className="profile_tab_section">
            <div className="section_title_row">
              <div>
                <h3><i className="bi bi-person-gear text-primary me-2"></i> Hồ Sơ Tài Khoản</h3>
                <p>Quản lý thông tin cá nhân và địa chỉ nhận hàng mặc định của bạn</p>
              </div>
              {!isEditing && (
                <button
                  type="button"
                  className="btn_toggle_edit"
                  onClick={() => setIsEditing(true)}
                >
                  <i className="bi bi-pencil-square me-1"></i> Chỉnh Sửa Thông Tin
                </button>
              )}
            </div>

            <div className="profile_card_box">
              {isEditing ? (
                <form onSubmit={handleProfileSubmit} className="profile_edit_form">
                  <div className="form_row_grid">
                    <div className="profile_field_group">
                      <label><i className="bi bi-person me-1"></i> Họ và tên:</label>
                      <input
                        type="text"
                        name="fullName"
                        value={editedProfile.fullName || ""}
                        onChange={(e) => setEditedProfile({ ...editedProfile, fullName: e.target.value })}
                        required
                      />
                    </div>

                    <div className="profile_field_group">
                      <label><i className="bi bi-envelope me-1"></i> Email:</label>
                      <input
                        type="email"
                        name="email"
                        value={editedProfile.email || ""}
                        onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
                        required
                      />
                    </div>

                    <div className="profile_field_group">
                      <label><i className="bi bi-telephone me-1"></i> Số điện thoại:</label>
                      <input
                        type="tel"
                        name="phone"
                        value={editedProfile.phone || ""}
                        onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
                        required
                      />
                    </div>

                    <div className="profile_field_group">
                      <label><i className="bi bi-person-badge me-1"></i> Tên đăng nhập (Cố định):</label>
                      <input
                        type="text"
                        name="username"
                        value={editedProfile.username || ""}
                        disabled
                        className="bg-light"
                      />
                    </div>

                    <div className="profile_field_group">
                      <label><i className="bi bi-calendar3 me-1"></i> Ngày sinh:</label>
                      <input
                        type="date"
                        name="dob"
                        value={editedProfile.dob || ""}
                        onChange={(e) => setEditedProfile({ ...editedProfile, dob: e.target.value })}
                      />
                    </div>

                    <div className="profile_field_group">
                      <label><i className="bi bi-gender-ambiguous me-1"></i> Giới tính:</label>
                      <select
                        name="gender"
                        value={editedProfile.gender || "Nam"}
                        onChange={(e) => setEditedProfile({ ...editedProfile, gender: e.target.value })}
                      >
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                        <option value="Khác">Khác</option>
                      </select>
                    </div>

                    <div className="profile_field_group full_width">
                      <label><i className="bi bi-geo-alt me-1"></i> Địa chỉ nhận hàng mặc định:</label>
                      <input
                        type="text"
                        name="address"
                        value={editedProfile.address || ""}
                        onChange={(e) => setEditedProfile({ ...editedProfile, address: e.target.value })}
                        placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành..."
                        required
                      />
                    </div>
                  </div>

                  <div className="profile_form_actions">
                    <button type="submit" disabled={saveLoading} className="btn_save_profile">
                      {saveLoading ? "Đang lưu..." : "Lưu Thay Đổi"}
                    </button>
                    <button
                      type="button"
                      className="btn_cancel_edit"
                      onClick={() => {
                        setIsEditing(false);
                        setEditedProfile(userProfile);
                      }}
                    >
                      Hủy Bỏ
                    </button>
                  </div>
                </form>
              ) : (
                <div className="profile_info_display_grid">
                  <div className="profile_info_card">
                    <div className="info_icon_wrapper">
                      <i className="bi bi-person-fill"></i>
                    </div>
                    <div>
                      <span className="info_label_text">Họ và Tên</span>
                      <strong className="info_val_text">{userProfile?.fullName || "Chưa cập nhật"}</strong>
                    </div>
                  </div>

                  <div className="profile_info_card">
                    <div className="info_icon_wrapper">
                      <i className="bi bi-envelope-fill"></i>
                    </div>
                    <div>
                      <span className="info_label_text">Địa Chỉ Email</span>
                      <strong className="info_val_text">{userProfile?.email || "Chưa cập nhật"}</strong>
                    </div>
                  </div>

                  <div className="profile_info_card">
                    <div className="info_icon_wrapper">
                      <i className="bi bi-telephone-fill"></i>
                    </div>
                    <div>
                      <span className="info_label_text">Số Điện Thoại</span>
                      <strong className="info_val_text">{userProfile?.phone || "Chưa cập nhật"}</strong>
                    </div>
                  </div>

                  <div className="profile_info_card">
                    <div className="info_icon_wrapper">
                      <i className="bi bi-person-circle"></i>
                    </div>
                    <div>
                      <span className="info_label_text">Tên Đăng Nhập</span>
                      <strong className="info_val_text">@{userProfile?.username}</strong>
                    </div>
                  </div>

                  <div className="profile_info_card">
                    <div className="info_icon_wrapper">
                      <i className="bi bi-calendar-heart-fill"></i>
                    </div>
                    <div>
                      <span className="info_label_text">Ngày Sinh</span>
                      <strong className="info_val_text">{userProfile?.dob || "Chưa cập nhật"}</strong>
                    </div>
                  </div>

                  <div className="profile_info_card">
                    <div className="info_icon_wrapper">
                      <i className="bi bi-gender-ambiguous"></i>
                    </div>
                    <div>
                      <span className="info_label_text">Giới Tính</span>
                      <strong className="info_val_text">{userProfile?.gender || "Nam"}</strong>
                    </div>
                  </div>

                  <div className="profile_info_card full_width">
                    <div className="info_icon_wrapper">
                      <i className="bi bi-geo-alt-fill text-danger"></i>
                    </div>
                    <div>
                      <span className="info_label_text">Địa Chỉ Nhận Hàng Mặc Định</span>
                      <strong className="info_val_text">{userProfile?.address || "Chưa cập nhật địa chỉ"}</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default UserProfile;
