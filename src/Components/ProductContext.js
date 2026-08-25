import React, { createContext, useState } from "react";

export const ProductContext = createContext();

const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([
    // Danh sách sản phẩm ban đầu
    {
      name: "Máy Sấy Panasonic 1400W",
      price: "800000",
      quantity: 11795,
      description: "Máy sấy tóc Panasonic công suất 1400W, nhỏ gọn, tiện lợi.",
      imageLink: "../images/May Say Panasonic.jpg",
    },
    {
      name: "Tivi LG màn hình 4K",
      price: 5000000,
      quantity: 11795,
      description: "Smart Tivi LG 4K, tích hợp AI, chất lượng hình ảnh sắc nét.",
      imageLink: "../images/Tivi-LG.jpg",
    },
    // Thêm các sản phẩm khác nếu cần
  ]);

  return (
    <ProductContext.Provider value={{ products, setProducts }}>
      {children}
    </ProductContext.Provider>
  );
};

export default ProductProvider;
