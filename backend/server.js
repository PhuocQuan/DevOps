const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const Product = require("./models/Product");
const User = require("./models/User");

const app = express();
const PORT = process.env.PORT || 2300;
const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://admin:admin123@cluster0.jzdibrv.mongodb.net/homeshop?retryWrites=true&w=majority";

// Middlewares
app.use(cors());
app.use(express.json());

// Helper to find document by id (MongoDB _id or custom id)
const findByIdQuery = (id) => {
  if (mongoose.Types.ObjectId.isValid(id)) {
    return { _id: id };
  }
  return { _id: null };
};

// Auto seed initial data from bao.json if database is empty
async function seedInitialData() {
  try {
    const productCount = await Product.countDocuments();
    const userCount = await User.countDocuments();

    let seedFile = path.join(__dirname, "../src/bao.json");
    if (!fs.existsSync(seedFile)) {
      seedFile = path.join(__dirname, "bao.json");
    }

    if (fs.existsSync(seedFile)) {
      const data = JSON.parse(fs.readFileSync(seedFile, "utf-8"));

      if (productCount === 0 && data.products && data.products.length > 0) {
        console.log("Seeding products to MongoDB Atlas...");
        const cleanProducts = data.products.map((p) => ({
          name: p.name,
          price: Number(p.price) || 0,
          quantity: Number(p.quantity) || 0,
          description: p.description || "",
          imageLink: p.imageLink || "",
        }));
        await Product.insertMany(cleanProducts);
        console.log(`Đã thêm ${cleanProducts.length} sản phẩm lên MongoDB Atlas!`);
      }

      if (userCount === 0 && data.user && data.user.length > 0) {
        console.log("Seeding users to MongoDB Atlas...");
        const cleanUsers = data.user.map((u) => ({
          fullName: u.fullName || u.username,
          email: u.email || "",
          phone: u.phone || "",
          username: u.username,
          password: u.password,
          dob: u.dob || "",
          gender: u.gender || "Nam",
          address: u.address || "",
        }));
        await User.insertMany(cleanUsers);
        console.log(`Đã thêm ${cleanUsers.length} người dùng lên MongoDB Atlas!`);
      }
    }
  } catch (err) {
    console.error("Lỗi khi seed dữ liệu ban đầu:", err);
  }
}

// ==================== ROUTES: PRODUCTS ====================
const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách sản phẩm", error: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const newProduct = new Product({
      name: req.body.name,
      price: Number(req.body.price),
      quantity: Number(req.body.quantity),
      description: req.body.description || "",
      imageLink: req.body.imageLink || "",
    });
    const saved = await newProduct.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: "Lỗi khi tạo sản phẩm", error: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const query = findByIdQuery(id);
    const updated = await Product.findOneAndUpdate(
      query,
      {
        name: req.body.name,
        price: Number(req.body.price),
        quantity: Number(req.body.quantity),
        description: req.body.description,
        imageLink: req.body.imageLink,
      },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: "Lỗi khi cập nhật sản phẩm", error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const query = findByIdQuery(id);
    const deleted = await Product.findOneAndDelete(query);
    if (!deleted) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }
    res.json({ message: "Đã xóa sản phẩm thành công", id });
  } catch (error) {
    res.status(400).json({ message: "Lỗi khi xóa sản phẩm", error: error.message });
  }
};

// Support both /products and /api/products
app.get("/products", getProducts);
app.get("/api/products", getProducts);
app.post("/products", createProduct);
app.post("/api/products", createProduct);
app.put("/products/:id", updateProduct);
app.put("/api/products/:id", updateProduct);
app.delete("/products/:id", deleteProduct);
app.delete("/api/products/:id", deleteProduct);

// ==================== ROUTES: USER ====================
const getUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách người dùng", error: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    // Check if username already exists
    const existing = await User.findOne({ username: req.body.username });
    if (existing) {
      return res.status(400).json({ message: "Tên đăng nhập đã tồn tại" });
    }

    const newUser = new User(req.body);
    const saved = await newUser.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: "Lỗi khi tạo người dùng", error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const query = findByIdQuery(id);
    const updated = await User.findOneAndUpdate(query, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: "Lỗi khi cập nhật người dùng", error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const query = findByIdQuery(id);
    const deleted = await User.findOneAndDelete(query);
    if (!deleted) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }
    res.json({ message: "Đã xóa người dùng thành công", id });
  } catch (error) {
    res.status(400).json({ message: "Lỗi khi xóa người dùng", error: error.message });
  }
};

// Support both /user and /api/user
app.get("/user", getUsers);
app.get("/api/user", getUsers);
app.post("/user", createUser);
app.post("/api/user", createUser);
app.put("/user/:id", updateUser);
app.put("/api/user/:id", updateUser);
app.delete("/user/:id", deleteUser);
app.delete("/api/user/:id", deleteUser);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    database: "MongoDB Atlas Connected",
    timestamp: new Date().toISOString(),
  });
});

// Connect to MongoDB and start server
mongoose
  .connect(MONGODB_URI)
  .then(async () => {
    console.log("Connected successfully to MongoDB Atlas (Online Database)!");
    await seedInitialData();

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Backend Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB Atlas connection error:", err);
  });
