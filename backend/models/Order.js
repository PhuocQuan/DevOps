const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  productId: { type: String },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 1 },
  imageLink: { type: String, default: "" },
});

const orderSchema = new mongoose.Schema(
  {
    orderCode: {
      type: String,
      unique: true,
    },
    customerUsername: {
      type: String,
      default: "",
      trim: true,
    },
    customerName: {
      type: String,
      required: true,
      trim: true,
    },
    customerEmail: {
      type: String,
      required: true,
      trim: true,
    },
    customerPhone: {
      type: String,
      required: true,
      trim: true,
    },
    shippingAddress: {
      type: String,
      required: true,
      trim: true,
    },
    notes: {
      type: String,
      default: "",
    },
    items: [orderItemSchema],
    totalAmount: {
      type: Number,
      required: true,
      default: 0,
    },
    paymentMethod: {
      type: String,
      required: true,
      default: "Thanh toán khi nhận hàng (COD)",
    },
    paymentStatus: {
      type: String,
      enum: ["Chưa thanh toán", "Đã thanh toán"],
      default: "Chưa thanh toán",
    },
    status: {
      type: String,
      enum: ["Chờ xác nhận", "Đã xác nhận", "Đang giao hàng", "Đã nhận hàng", "Đã hủy"],
      default: "Chờ xác nhận",
    },
    estimatedDelivery: {
      type: String,
      default: "2 - 4 ngày làm việc",
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        return ret;
      },
    },
  }
);

// Pre-save hook to generate human-readable order code like HD-1001
orderSchema.pre("save", function (next) {
  if (!this.orderCode) {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    this.orderCode = `HD-${Date.now().toString().slice(-4)}${randomSuffix.toString().slice(-2)}`;
  }
  next();
});

module.exports = mongoose.model("Order", orderSchema);
