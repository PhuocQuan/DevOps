import React, { useState, useEffect } from "react";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    quantity: "",
    description: "",
    imageLink: "", // This will now accept an image URL
  });
  const [editIndex, setEditIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const itemsPerPage = 5; // Số sản phẩm trên mỗi trang

  // Lấy dữ liệu từ API khi component được mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:2300/products");
      if (response.ok) {
        const data = await response.json();
        setProducts(data); // Cập nhật danh sách sản phẩm
      } else {
        throw new Error("Không thể lấy dữ liệu sản phẩm");
      }
    } catch (error) {
      console.error(error);
      alert("Đã xảy ra lỗi khi tải sản phẩm.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Thêm hoặc cập nhật sản phẩm
  const handleAdd = async () => {
    if (
      !form.name ||
      !form.price ||
      !form.quantity ||
      !form.description ||
      !form.imageLink ||
      isNaN(form.quantity) ||
      form.quantity <= 0 ||
      isNaN(form.price) ||
      form.price <= 0
    ) {
      alert("Vui lòng điền đầy đủ thông tin và đảm bảo giá và số lượng phải lớn hơn 0.");
      return;
    }

    try {
      if (editIndex !== null) {
        // Cập nhật sản phẩm
        const updatedProduct = { ...form, id: products[editIndex].id };
        const response = await fetch(`http://localhost:2300/products/${updatedProduct.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedProduct),
        });

        if (response.ok) {
          fetchProducts(); // Lấy lại danh sách sản phẩm mới
          setEditIndex(null); // Reset form
        } else {
          throw new Error("Cập nhật sản phẩm không thành công");
        }
      } else {
        // Thêm sản phẩm mới
        const newProduct = { ...form };
        const response = await fetch("http://localhost:2300/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newProduct),
        });

        if (response.ok) {
          fetchProducts(); // Lấy lại danh sách sản phẩm mới
        } else {
          throw new Error("Thêm sản phẩm không thành công");
        }
      }
      setForm({ name: "", price: "", quantity: "", description: "", imageLink: "" });
    } catch (error) {
      console.error(error);
      alert("Đã xảy ra lỗi khi thêm hoặc cập nhật sản phẩm.");
    }
  };

  // Sửa sản phẩm
  const handleEdit = (index) => {
    setEditIndex(index + (currentPage - 1) * itemsPerPage);
    setForm(products[index + (currentPage - 1) * itemsPerPage]);
  };

  // Xóa sản phẩm
  const handleDelete = async (index) => {
    const globalIndex = index + (currentPage - 1) * itemsPerPage;
    const productToDelete = products[globalIndex];
    try {
      const response = await fetch(`http://localhost:2300/products/${productToDelete.id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchProducts(); // Cập nhật lại danh sách sản phẩm
      } else {
        throw new Error("Xóa sản phẩm không thành công");
      }
    } catch (error) {
      console.error(error);
      alert("Đã xảy ra lỗi khi xóa sản phẩm.");
    }
  };

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const displayedProducts = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="product-management">
      <h1>Quản Lý Sản Phẩm</h1>

      <div className="form">
        <input
          type="text"
          name="name"
          placeholder="Tên sản phẩm"
          value={form.name}
          onChange={handleChange}
        />
        <input
          type="text"
          name="price"
          placeholder="Giá sản phẩm"
          value={form.price}
          onChange={handleChange}
        />
        <input
          type="number"
          name="quantity"
          placeholder="Số lượng"
          value={form.quantity}
          onChange={handleChange}
        />
        <input
          type="text"
          name="description"
          placeholder="Mô tả"
          value={form.description}
          onChange={handleChange}
        />
        <input
          type="text"
          name="imageLink"
          placeholder="Link hình ảnh"
          value={form.imageLink}
          onChange={handleChange}
        />
        <button onClick={handleAdd}>
          {editIndex !== null ? "Cập Nhật" : "Thêm Sản Phẩm"}
        </button>
      </div>

      <div className="product-list">
        <h2>Danh sách sản phẩm</h2>
        <table border="1">
          <thead>
            <tr>
              <th>#</th>
              <th>Tên</th>
              <th>Giá</th>
              <th>Số lượng</th>
              <th>Mô tả</th>
              <th>Hình ảnh</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {displayedProducts.map((product, index) => (
              <tr key={index}>
                <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                <td>{product.name}</td>
                <td>{product.price}</td>
                <td>{product.quantity}</td>
                <td>{product.description}</td>
                <td>
                  <img src={product.imageLink} alt={product.name} width="50" />
                </td>
                <td>
                  <button onClick={() => handleEdit(index)}>Sửa</button>
                  <button onClick={() => handleDelete(index)}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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

export default ProductManagement;
