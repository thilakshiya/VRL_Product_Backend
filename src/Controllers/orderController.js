// import asyncHandler from "express-async-handler";
// import Order from "../Models/orderModel.js";
// import Product from "../Models/productModel.js";





// export const addOrder = asyncHandler(async (req, res) => {
//   const { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;

//   if (!orderItems || orderItems.length === 0) {
//     res.status(400);
//     throw new Error("No order items");
//   }

//   const order = new Order({
//     user: req.user._id,
//     orderItems,
//     shippingAddress,
//     paymentMethod,
//     itemsPrice,
//     taxPrice,
//     shippingPrice,
//     totalPrice
//   });

//   const createdOrder = await order.save();

//   // decrease stock
//   for (const item of orderItems) {
//     if (item.product) {
//       await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.qty } });
//     }
//   }

//   res.status(201).json(createdOrder);
// });






// // });

// // @desc Get order by id
// // @route GET /api/orders/:id
// // @access Private (owner or admin)
// export const getOrderById = asyncHandler(async (req, res) => {
//   const order = await Order.findById(req.params.id).populate("user", "name email");
//   if (!order) {
//     res.status(404);
//     throw new Error("Order not found");
//   }
//   // allow if owner or admin
//   if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
//     res.status(403);
//     throw new Error("Not authorized to view this order");
//   }
//   res.json(order);
// });

// // @desc Update order to paid
// // @route PUT /api/orders/:id/pay
// // @access Private
// export const updateOrderToPaid = asyncHandler(async (req, res) => {
//   const order = await Order.findById(req.params.id);
//   if (!order) {
//     res.status(404);
//     throw new Error("Order not found");
//   }
//   order.isPaid = true;
//   order.paidAt = Date.now();
//   order.paymentResult = {
//     id: req.body.id,
//     status: req.body.status,
//     update_time: req.body.update_time,
//     email_address: req.body.email_address
//   };
//   const updatedOrder = await order.save();
//   res.json(updatedOrder);
// });

// // @desc Get logged in user's orders
// // @route GET /api/orders/myorders
// // @access Private
// export const getMyOrders = asyncHandler(async (req, res) => {
//   const orders = await Order.find({ user: req.user._id });
//   res.json(orders);
// });

// // @desc Get all orders (admin)
// // @route GET /api/orders
// // @access Private/Admin
// export const getOrders = asyncHandler(async (req, res) => {
//   const orders = await Order.find({}).populate("user", "id name");
//   res.json(orders);
// });



import asyncHandler from "express-async-handler";
import Order from "../Models/orderModel.js";
import Product from "../Models/productModel.js";

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = asyncHandler(async (req, res) => {
  const { 
    orderItems, 
    shippingAddress, 
    paymentMethod, 
    itemsPrice, 
    taxPrice, 
    shippingPrice, 
    totalPrice 
  } = req.body;

  // 1. Validate Items
  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error("No order items");
  }

  // 2. Create Order
  const order = new Order({
    user: req.user._id, // Ensure 'protect' middleware is used in routes
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice
  });

  const createdOrder = await order.save();

  // 3. Decrease Stock (Optional but recommended)
  for (const item of orderItems) {
    // Ensure item.product is the ID passed from frontend
    if (item.product) {
        const product = await Product.findById(item.product);
        if (product) {
            product.stock = product.stock - item.qty;
            await product.save();
        }
    }
  }

  res.status(201).json(createdOrder);
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate("user", "name email");

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  // Check permission: Admin OR Owner
  // Ensure req.user exists (middleware issue if undefined)
  if (req.user.role !== "admin" && order.user._id.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to view this order");
  }

  res.json(order);
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
export const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  order.isPaid = true;
  order.paidAt = Date.now();
  // Payment Result from Stripe/PayPal/Cash Logic
  order.paymentResult = {
    id: req.body.id || "cash_id",
    status: req.body.status || "completed",
    update_time: req.body.update_time || String(Date.now()),
    email_address: req.body.email_address || req.user.email,
  };

  const updatedOrder = await order.save();
  res.json(updatedOrder);
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
export const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate("user", "id name").sort({ createdAt: -1 });
  res.json(orders);
});