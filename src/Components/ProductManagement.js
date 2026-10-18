import React, { useState, useEffect } from "react";
import Footer from "./Footer";
import "../App.css";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [form, setForm] = useState({
    name: "",
    price: "",
    quantity: "",
    description: "",
    imageLink: "",
  });
  const [editIndex, setEditIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/products");
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        throw new Error("Không thể lấy dữ liệu sản phẩm");
      }
    } catch (error) {
      console.error(error);
      alert("Đã xảy ra lỗi khi tải sản phẩm.");
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
    setForm({ name: "", price: "", quantity: "", description: "", imageLink: "" });
  };

  const handleAdd = async (e) => {
    if (e) e.preventDefault();
    if (
      !form.name ||
      !form.price ||
      !form.quantity ||
      !form.description ||
      !form.imageLink ||
      isNaN(form.quantity) ||
      Number(form.quantity) <= 0 ||
      isNaN(form.price) ||
      Number(form.price) <= 0
    ) {
      alert("Vui lòng điền đầy đủ thông tin và đảm bảo giá cùng số lượng lớn hơn 0.");
      return;
    }

    try {
      if (editIndex !== null) {
        // Cập nhật sản phẩm
        const targetProduct = filteredProducts[editIndex];
        const updatedProduct = { ...form, id: targetProduct.id };
        const response = await fetch(`/api/products/${updatedProduct.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedProduct),
        });

        if (response.ok) {
          alert("Cập nhật sản phẩm thành công!");
          fetchProducts();
          handleCancelEdit();
        } else {
          throw new Error("Cập nhật sản phẩm không thành công");
        }
      } else {
        // Thêm sản phẩm mới
        const newProduct = { ...form };
        const response = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newProduct),
        });

        if (response.ok) {
          alert("Thêm sản phẩm mới thành công!");
          fetchProducts();
          handleCancelEdit();
        } else {
          throw new Error("Thêm sản phẩm không thành công");
        }
      }
    } catch (error) {
      console.error(error);
      alert("Đã xảy ra lỗi khi thêm hoặc cập nhật sản phẩm.");
    }
  };

  const handleEdit = (indexOnPage) => {
    const realIndex = indexOnPage + (currentPage - 1) * itemsPerPage;
    setEditIndex(realIndex);
    setForm(filteredProducts[realIndex]);
    window.scrollTo({ top: 120, behavior: "smooth" });
  };

  const handleDelete = async (indexOnPage) => {
    const realIndex = indexOnPage + (currentPage - 1) * itemsPerPage;
    const productToDelete = filteredProducts[realIndex];
    
    if (!window.confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${productToDelete.name}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/products/${productToDelete.id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        alert("Đã xóa sản phẩm thành công!");
        fetchProducts();
      } else {
        throw new Error("Xóa sản phẩm không thành công");
      }
    } catch (error) {
      console.error(error);
      alert("Đã xảy ra lỗi khi xóa sản phẩm.");
    }
  };

  // Filter products by search term
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const displayedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="admin_page_wrapper">
      <div className="admin_header_hero compact_hero">
        <div className="admin_hero_content">
          <span className="admin_badge_role">
            <i className="bi bi-box-seam me-2"></i> KHO SẢN PHẨM
          </span>
          <h1>Quản Lý <span>Sản Phẩm</span></h1>
          <p className="admin_hero_subtitle">
            Thêm mới, cập nhật giá thành, số lượng tồn kho và thông tin chi tiết các mặt hàng gia dụng.
          </p>
        </div>
      </div>

      <div className="admin_container">
        {/* Form Card */}
        <div className="admin_form_card">
          <div className="admin_card_header">
            <div>
              <h3>
                <i className={`bi ${editIndex !== null ? "bi-pencil-square text-warning" : "bi-plus-circle-fill text-primary"} me-2`}></i>
                {editIndex !== null ? "Cập Nhật Thông Tin Sản Phẩm" : "Thêm Sản Phẩm Mới Vào Kho"}
              </h3>
              <p className="text-muted small mb-0">
                {editIndex !== null ? "Đang chỉnh sửa sản phẩm đã chọn, bấm 'Lưu Cập Nhật' để hoàn tất" : "Điền đầy đủ thông tin bên dưới để đăng sản phẩm lên gian hàng"}
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
              <label>Tên Sản Phẩm *</label>
              <input
                type="text"
                name="name"
                placeholder="VD: Nồi chiên không dầu Philips 5L"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="admin_input_group">
              <label>Đơn Giá (VNĐ) *</label>
              <input
                type="number"
                name="price"
                placeholder="VD: 1500000"
                value={form.price}
                onChange={handleChange}
                required
              />
            </div>

            <div className="admin_input_group">
              <label>Số Lượng Tồn Kho *</label>
              <input
                type="number"
                name="quantity"
                placeholder="VD: 150"
                value={form.quantity}
                onChange={handleChange}
                required
              />
            </div>

            <div className="admin_input_group">
              <label>Đường Dẫn Hình Ảnh (URL / Path) *</label>
              <input
                type="text"
                name="imageLink"
                placeholder="VD: /images/noi-chien-ko-dau.jpg"
                value={form.imageLink}
                onChange={handleChange}
                required
              />
            </div>

            <div className="admin_input_group full_col">
              <label>Mô Tả Sản Phẩm *</label>
              <textarea
                rows="3"
                name="description"
                placeholder="Nhập thông tin tính năng, thông số kỹ thuật và ưu điểm nổi bật..."
                value={form.description}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            {form.imageLink && (
              <div className="image_preview_row full_col">
                <span className="text-muted small me-3">Xem trước ảnh:</span>
                <img 
                  src={form.imageLink} 
                  alt="Xem trước" 
                  className="preview_thumb" 
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
            )}

            <div className="form_submit_row full_col">
              <button type="submit" className="admin_btn_primary btn_lg">
                <i className={`bi ${editIndex !== null ? "bi-check2-circle" : "bi-plus-lg"} me-2`}></i>
                {editIndex !== null ? "Lưu Cập Nhật Sản Phẩm" : "Thêm Sản Phẩm Ngay"}
              </button>
            </div>
          </form>
        </div>

        {/* Table & Search Card */}
        <div className="admin_card_box mt-4">
          <div className="admin_table_toolbar">
            <div className="table_title_block">
              <h3><i className="bi bi-list-check me-2 text-primary"></i> Danh Sách Sản Phẩm</h3>
              <span className="text-muted small">Tổng cộng {filteredProducts.length} sản phẩm</span>
            </div>

            <div className="admin_search_box">
              <i className="bi bi-search"></i>
              <input
                type="text"
                placeholder="Tìm kiếm theo tên sản phẩm..."
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
                  <th style={{ width: "60px" }}>STT</th>
                  <th style={{ width: "90px" }}>Hình Ảnh</th>
                  <th>Tên Sản Phẩm</th>
                  <th>Đơn Giá</th>
                  <th>Số Lượng</th>
                  <th>Mô Tả</th>
                  <th style={{ width: "150px", textAlign: "center" }}>Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {displayedProducts.map((product, index) => (
                  <tr key={product.id || index}>
                    <td className="text-muted font-monospace">
                      {index + 1 + (currentPage - 1) * itemsPerPage}
                    </td>
                    <td>
                      <img 
                        src={product.imageLink} 
                        alt={product.name} 
                        className="admin_thumb_img"
                        onError={(e) => { e.target.src = "/images/bannerhome.jpg"; }}
                      />
                    </td>
                    <td className="fw-bold text-dark">{product.name}</td>
                    <td className="text-danger fw-bold">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(product.price)}
                    </td>
                    <td>
                      <span className={`badge_stock ${Number(product.quantity) < 10 ? 'low_stock' : 'in_stock'}`}>
                        {product.quantity} cái
                      </span>
                    </td>
                    <td className="text-muted small max_desc_cell">
                      {product.description}
                    </td>
                    <td>
                      <div className="table_actions">
                        <button 
                          onClick={() => handleEdit(index)} 
                          className="btn_action_edit"
                          title="Sửa sản phẩm"
                        >
                          <i className="bi bi-pencil-fill me-1"></i> Sửa
                        </button>
                        <button 
                          onClick={() => handleDelete(index)} 
                          className="btn_action_delete"
                          title="Xóa sản phẩm"
                        >
                          <i className="bi bi-trash3-fill me-1"></i> Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {displayedProducts.length === 0 && !loading && (
                  <tr>
                    <td colSpan="7" className="text-center py-5">
                      <i className="bi bi-inbox display-4 text-muted mb-2 d-block"></i>
                      <p className="text-muted mb-0">Không tìm thấy sản phẩm nào phù hợp!</p>
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

export default ProductManagement;
