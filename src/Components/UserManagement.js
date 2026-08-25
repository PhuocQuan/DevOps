import React, { useState, useEffect } from "react";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    username: "",
    password: "",
    dob: "",
    gender: "",
    address: "",
  });
  const [editIndex, setEditIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const itemsPerPage = 5; // Số người dùng trên mỗi trang
  const [showPassword, setShowPassword] = useState(false); // Quản lý trạng thái hiển thị mật khẩu

  // Lấy dữ liệu từ API khi component được mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:2300/user");
      if (response.ok) {
        const data = await response.json();
        setUsers(data); // Cập nhật danh sách người dùng
      } else {
        throw new Error("Không thể lấy dữ liệu người dùng");
      }
    } catch (error) {
      console.error(error);
      alert("Đã xảy ra lỗi khi tải người dùng.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Thêm hoặc cập nhật người dùng
  // Thêm hoặc cập nhật người dùng
  const handleAdd = async () => {
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
      alert("Vui lòng điền đầy đủ thông tin.");
      return;
    }
  
    try {
      if (editIndex !== null) {
        const updatedUser = { ...form, id: users[editIndex].id };
        console.log("Updating user with ID:", updatedUser.id);
        console.log("Data being sent:", updatedUser);
  
        const response = await fetch(`http://localhost:2300/user/${updatedUser.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedUser),
        });
  
        if (response.ok) {
          fetchUsers();
          setEditIndex(null);
        } else {
          const errorData = await response.json();
          console.error("Error updating user:", errorData);
          throw new Error("Cập nhật người dùng không thành công");
        }
      } else {
        const newUser = { ...form };
        const response = await fetch("http://localhost:2300/user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newUser),
        });
  
        if (response.ok) {
          fetchUsers();
        } else {
          throw new Error("Thêm người dùng không thành công");
        }
      }
  
      setForm({
        fullName: "",
        email: "",
        phone: "",
        username: "",
        password: "",
        dob: "",
        gender: "",
        address: "",
      });
    } catch (error) {
      console.error(error);
      alert("Đã xảy ra lỗi khi thêm hoặc cập nhật người dùng.");
    }
  };

  

  // Sửa người dùng
  const handleEdit = (index) => {
    setEditIndex(index + (currentPage - 1) * itemsPerPage);
    setForm(users[index + (currentPage - 1) * itemsPerPage]);
  };

  // Xóa người dùng
  const handleDelete = async (index) => {
    const globalIndex = index + (currentPage - 1) * itemsPerPage;
    const userToDelete = users[globalIndex];
  
    // Hiển thị hộp thoại xác nhận trước khi xóa
    const isConfirmed = window.confirm(`Bạn chắc chắn muốn xóa người dùng ${userToDelete.fullName}?`);
  
    if (!isConfirmed) {
      return; // Nếu người dùng không xác nhận, dừng lại
    }
  
    try {
      const response = await fetch(`http://localhost:2300/user/${userToDelete.id}`, {
        method: "DELETE",
      });
  
      if (response.ok) {
        fetchUsers(); // Cập nhật lại danh sách người dùng sau khi xóa
      } else {
        throw new Error("Xóa người dùng không thành công");
      }
    } catch (error) {
      console.error(error);
      alert("Đã xảy ra lỗi khi xóa người dùng.");
    }
  };
  

  // Toggle hiển thị mật khẩu
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const totalPages = Math.ceil(users.length / itemsPerPage);
  const displayedUsers = users.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="user-management">
      <h1>Quản Lý Người Dùng</h1>

      {/* Form thêm/sửa người dùng */}
      <div className="form">
        <input
          type="text"
          name="fullName"
          placeholder="Họ và Tên"
          value={form.fullName}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />
        <input
          type="text"
          name="phone"
          placeholder="Số điện thoại"
          value={form.phone}
          onChange={handleChange}
        />
        <input
          type="text"
          name="username"
          placeholder="Tên đăng nhập"
          value={form.username}
          onChange={handleChange}
        />
        <div className="password-field">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Mật khẩu"
            value={form.password}
            onChange={handleChange}
          />
          <button type="button" onClick={togglePasswordVisibility}>
            {showPassword ? "Ẩn mật khẩu" : "Xem mật khẩu"}
          </button>
        </div>
        <input
          type="date"
          name="dob"
          placeholder="Ngày sinh"
          value={form.dob}
          onChange={handleChange}
        />
        <select name="gender" value={form.gender} onChange={handleChange}>
          <option value="">Chọn giới tính</option>
          <option value="Nam">Nam</option>
          <option value="Nữ">Nữ</option>
        </select>
        <input
          type="text"
          name="address"
          placeholder="Địa chỉ"
          value={form.address}
          onChange={handleChange}
        />
        <button onClick={handleAdd}>
          {editIndex !== null ? "Cập Nhật" : "Thêm Người Dùng"}
        </button>
      </div>

      {/* Danh sách người dùng */}
      <div className="user-list">
        <h2>Danh sách người dùng</h2>
        <table border="1">
          <thead>
            <tr>
              <th>#</th>
              <th>Họ và Tên</th>
              <th>Email</th>
              <th>Số điện thoại</th>
              <th>Tên đăng nhập</th>
              <th>Mật khẩu</th>
              <th>Ngày sinh</th>
              <th>Giới tính</th>
              <th>Địa chỉ</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {displayedUsers.map((user, index) => (
              <tr key={user.id}>
                <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                <td>{user.fullName}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{user.username}</td>
                <td>{user.password}</td> {/* Hiển thị mật khẩu người dùng */}
                <td>{user.dob}</td>
                <td>{user.gender}</td>
                <td>{user.address}</td>
                <td>
                  <button onClick={() => handleEdit(index)}>Sửa</button>
                  <button onClick={() => handleDelete(index)}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Phân trang */}
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={i + 1 === currentPage ? "active" : ""}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
