// import mongoose from "mongoose";

// const orderSchema = new mongoose.Schema({
//   user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   orderItems: [{ product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" }, qty: Number }],
//   totalPrice: { type: Number, required: true },
//   status: { type: String, enum: ["pending", "completed", "cancelled"], default: "pending" },
// }, { timestamps: true });

// const Order = mongoose.model("Order", orderSchema);
// export default Order;



// import mongoose from "mongoose";

// const orderItemSchema = mongoose.Schema({
//   product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
//   name: { type: String },
//   qty: { type: Number, required: true },
//   price: { type: Number, required: true }
// });

// const orderSchema = mongoose.Schema(
//   {
//     user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     orderItems: [orderItemSchema],
//     shippingAddress: {
//       address: String,
//       city: String,
//       postalCode: String,
//       country: String
//     },
//     paymentMethod: { type: String, default: "card" },
//     paymentResult: {
//       id: String,
//       status: String,
//       update_time: String,
//       email_address: String
//     },
//     itemsPrice: { type: Number, required: true },
//     taxPrice: { type: Number, default: 0 },
//     shippingPrice: { type: Number, default: 0 },
//     totalPrice: { type: Number, required: true },
//     isPaid: { type: Boolean, default: false },
//     paidAt: { type: Date },
//     isDelivered: { type: Boolean, default: false },
//     deliveredAt: { type: Date }
//   },
//   { timestamps: true }
// );

// const Order = mongoose.model("Order", orderSchema);
// export default Order;





import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  name: { type: String, required: true },
  qty: { type: Number, required: true },
  price: { type: Number, required: true }
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    orderItems: [orderItemSchema],

    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      // postalCode: { type: String, required: true },
      country: { type: String, required: true }
    },

    // Removed paymentMethod, paymentResult, isPaid, paidAt

    itemsPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },

    // Order delivery details
    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date }
  },
  {
    timestamps: true
  }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;



