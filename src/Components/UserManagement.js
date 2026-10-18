import React, { useState, useEffect } from "react";
import Footer from "./Footer";
import "../App.css";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    username: "",
    password: "",
    dob: "",
    gender: "Nam",
    address: "",
  });
  const [editIndex, setEditIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/user");
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        throw new Error("Không thể lấy dữ liệu người dùng");
      }
    } catch (error) {
      console.error(error);
      alert("Đã xảy ra lỗi khi tải người dùng.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleCancelEdit = () => {
    setEditIndex(null);
    setForm({
      fullName: "",
      email: "",
      phone: "",
      username: "",
      password: "",
      dob: "",
      gender: "Nam",
      address: "",
    });
  };

  const handleAdd = async (e) => {
    if (e) e.preventDefault();
    if (
      !form.fullName ||
      !form.email ||
      !form.phone ||
      !form.username ||
      !form.password ||
      !form.dob ||
      !form.gender ||
      !form.address
    ) {
      alert("Vui lòng điền đầy đủ tất cả thông tin người dùng.");
      return;
    }

    try {
      if (editIndex !== null) {
        const targetUser = filteredUsers[editIndex];
        const updatedUser = { ...form, id: targetUser.id };

        const response = await fetch(`/api/user/${updatedUser.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedUser),
        });

        if (response.ok) {
          alert("Cập nhật thông tin người dùng thành công!");
          fetchUsers();
          handleCancelEdit();
        } else {
          throw new Error("Cập nhật người dùng không thành công");
        }
      } else {
        const newUser = { ...form };
        const response = await fetch("/api/user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newUser),
        });

        if (response.ok) {
          alert("Thêm người dùng mới thành công!");
          fetchUsers();
          handleCancelEdit();
        } else {
          throw new Error("Thêm người dùng không thành công");
        }
      }
    } catch (error) {
      console.error(error);
      alert("Đã xảy ra lỗi khi thêm hoặc cập nhật người dùng.");
    }
  };

  const handleEdit = (indexOnPage) => {
    const realIndex = indexOnPage + (currentPage - 1) * itemsPerPage;
    setEditIndex(realIndex);
    setForm(filteredUsers[realIndex]);
    window.scrollTo({ top: 120, behavior: "smooth" });
  };

  const handleDelete = async (indexOnPage) => {
    const realIndex = indexOnPage + (currentPage - 1) * itemsPerPage;
    const userToDelete = filteredUsers[realIndex];

    if (!window.confirm(`Bạn có chắc chắn muốn xóa tài khoản "${userToDelete.fullName}" (${userToDelete.username})?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/user/${userToDelete.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Đã xóa người dùng thành công!");
        fetchUsers();
      } else {
        throw new Error("Xóa người dùng không thành công");
      }
    } catch (error) {
      console.error(error);
      alert("Đã xảy ra lỗi khi xóa người dùng.");
    }
  };

  // Filter users by search term
  const filteredUsers = users.filter((u) =>
    (u.fullName && u.fullName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (u.username && u.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (u.email && u.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (u.phone && u.phone.includes(searchTerm))
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const displayedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="admin_page_wrapper">
      <div className="admin_header_hero compact_hero">
        <div className="admin_hero_content">
          <span className="admin_badge_role">
            <i className="bi bi-people-fill me-2"></i> THÀNH VIÊN HỆ THỐNG
          </span>
          <h1>Quản Lý <span>Người Dùng</span></h1>
          <p className="admin_hero_subtitle">
            Theo dõi, tạo tài khoản mới và cập nhật phân quyền người dùng trong hệ sinh thái HomeSHOP.
          </p>
        </div>
      </div>

      <div className="admin_container">
        {/* Form Card */}
        <div className="admin_form_card">
          <div className="admin_card_header">
            <div>
              <h3>
                <i className={`bi ${editIndex !== null ? "bi-pencil-square text-warning" : "bi-person-plus-fill text-success"} me-2`}></i>
                {editIndex !== null ? "Cập Nhật Thông Tin Thành Viên" : "Tạo Tài Khoản Người Dùng Mới"}
              </h3>
              <p className="text-muted small mb-0">
                {editIndex !== null ? "Đang chỉnh sửa người dùng đã chọn, bấm 'Lưu Cập Nhật' để hoàn tất" : "Điền đầy đủ thông tin bên dưới để cấp tài khoản mới"}
              </p>
            </div>
            {editIndex !== null && (
              <button onClick={handleCancelEdit} className="admin_btn_cancel">
                <i className="bi bi-x-circle me-1"></i> Hủy Chỉnh Sửa
              </button>
            )}
          </div>

          <form onSubmit={handleAdd} className="admin_grid_form">
            <div className="admin_input_group">
              <label>Họ và Tên *</label>
              <input
                type="text"
                name="fullName"
                placeholder="VD: Nguyễn Văn An"
                value={form.fullName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="admin_input_group">
              <label>Địa Chỉ Email *</label>
              <input
                type="email"
                name="email"
                placeholder="VD: an.nguyen@gmail.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="admin_input_group">
              <label>Số Điện Thoại *</label>
              <input
                type="tel"
                name="phone"
                placeholder="VD: 0987654321"
                value={form.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="admin_input_group">
              <label>Tên Đăng Nhập *</label>
              <input
                type="text"
                name="username"
                placeholder="VD: nguyenvanan"
                value={form.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="admin_input_group">
              <label>Mật Khẩu *</label>
              <div className="admin_password_wrap">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Nhập mật khẩu"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="btn_toggle_eye"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i className={`bi ${showPassword ? "bi-eye-slash-fill" : "bi-eye-fill"}`}></i>
                </button>
              </div>
            </div>

            <div className="admin_input_group">
              <label>Ngày Sinh *</label>
              <input
                type="date"
                name="dob"
                value={form.dob}
                onChange={handleChange}
                required
              />
            </div>

            <div className="admin_input_group">
              <label>Giới Tính *</label>
              <select name="gender" value={form.gender} onChange={handleChange} required>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            </div>

            <div className="admin_input_group">
              <label>Địa Chỉ Thường Trú *</label>
              <input
                type="text"
                name="address"
                placeholder="VD: 123 Cầu Giấy, Hà Nội"
                value={form.address}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form_submit_row full_col">
              <button type="submit" className="admin_btn_primary btn_lg">
                <i className={`bi ${editIndex !== null ? "bi-check2-circle" : "bi-person-plus-fill"} me-2`}></i>
                {editIndex !== null ? "Lưu Cập Nhật Người Dùng" : "Thêm Người Dùng Ngay"}
              </button>
            </div>
          </form>
        </div>

        {/* Table & Search Card */}
        <div className="admin_card_box mt-4">
          <div className="admin_table_toolbar">
            <div className="table_title_block">
              <h3><i className="bi bi-people-fill me-2 text-success"></i> Danh Sách Người Dùng</h3>
              <span className="text-muted small">Tổng cộng {filteredUsers.length} tài khoản</span>
            </div>

            <div className="admin_search_box">
              <i className="bi bi-search"></i>
              <input
                type="text"
                placeholder="Tìm theo tên, username, email..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
              {searchTerm && (
                <button className="search_clear" onClick={() => setSearchTerm("")}>
                  <i className="bi bi-x-circle-fill"></i>
                </button>
              )}
            </div>
          </div>

          <div className="admin_table_responsive">
            <table className="admin_custom_table">
              <thead>
                <tr>
                  <th style={{ width: "50px" }}>STT</th>
                  <th>Họ và Tên</th>
                  <th>Tài Khoản</th>
                  <th>Liên Hệ</th>
                  <th>Ngày Sinh</th>
                  <th>Giới Tính</th>
                  <th>Địa Chỉ</th>
                  <th>Vai Trò</th>
                  <th style={{ width: "150px", textAlign: "center" }}>Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {displayedUsers.map((user, index) => (
                  <tr key={user.id || index}>
                    <td className="text-muted font-monospace">
                      {index + 1 + (currentPage - 1) * itemsPerPage}
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="user_initial_avatar me-2">
                          {(user.fullName || user.username || "U")[0].toUpperCase()}
                        </div>
                        <div>
                          <strong className="d-block text-dark">{user.fullName}</strong>
                          <span className="text-muted small">ID: #{user.id}</span>
                        </div>
                      </div>
                    </td>
                    <td><code>{user.username}</code></td>
                    <td>
                      <div className="user_contact_cell">
                        <div><i className="bi bi-envelope me-1 text-muted"></i>{user.email}</div>
                        <div><i className="bi bi-telephone me-1 text-muted"></i>{user.phone}</div>
                      </div>
                    </td>
                    <td className="small text-muted">{user.dob}</td>
                    <td>
                      <span className={`badge_gender ${user.gender === 'Nam' ? 'gender_male' : 'gender_female'}`}>
                        {user.gender}
                      </span>
                    </td>
                    <td className="small max_address_cell text-muted">{user.address}</td>
                    <td>
                      {user.username === "admin" ? (
                        <span className="badge_role badge_admin">
                          <i className="bi bi-shield-lock-fill me-1"></i> Admin
                        </span>
                      ) : (
                        <span className="badge_role badge_user">Khách hàng</span>
                      )}
                    </td>
                    <td>
                      <div className="table_actions">
                        <button 
                          onClick={() => handleEdit(index)} 
                          className="btn_action_edit"
                          title="Sửa người dùng"
                        >
                          <i className="bi bi-pencil-fill me-1"></i> Sửa
                        </button>
                        <button 
                          onClick={() => handleDelete(index)} 
                          className="btn_action_delete"
                          title="Xóa người dùng"
                          disabled={user.username === "admin"}
                        >
                          <i className="bi bi-trash3-fill me-1"></i> Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {displayedUsers.length === 0 && !loading && (
                  <tr>
                    <td colSpan="9" className="text-center py-5">
                      <i className="bi bi-people display-4 text-muted mb-2 d-block"></i>
                      <p className="text-muted mb-0">Không tìm thấy người dùng nào phù hợp!</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="admin_pagination_wrapper">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="admin_page_btn"
              >
                <i className="bi bi-chevron-left me-1"></i> Trước
              </button>
              
              <div className="admin_page_numbers">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`page_num_btn ${currentPage === i + 1 ? 'active' : ''}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="admin_page_btn"
              >
                Sau <i className="bi bi-chevron-right ms-1"></i>
              </button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default UserManagement;
