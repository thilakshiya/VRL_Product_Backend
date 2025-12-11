
// import asyncHandler from "express-async-handler";
// import UserPayment from "../Models/userPaymentModel.js";
// import dotenv from "dotenv";



// dotenv.config();

// // create payment record (mock)
// export const createUserPayment = asyncHandler(async (req, res) => {
//   const { userId, orderId, amount, method, transactionId, status } = req.body;
//   const payment = await UserPayment.create({
//     user: userId,
//     order: orderId,
//     amount,
//     method,
//     transactionId,
//     status: status || "completed"
//   });
//   res.status(201).json(payment);
// });

// // get payments for a user
// export const getUserPayments = asyncHandler(async (req, res) => {
//   const userId = req.params.userId || req.user._id;
//   const payments = await UserPayment.find({ user: userId }).populate("order");
//   res.json(payments);
// });
// import Stripe from "stripe";
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// export const stripeCheckout = async (req, res) => {
//   try {
//     const { orderId, amount } = req.body;

//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       mode: "payment",
//       line_items: [
//         {
//           price_data: {
//             currency: "lkr",
//             product_data: { name: `Order #${orderId}` },
//             unit_amount: amount * 100, 
//           },
//           quantity: 1,
//         },
//       ],
//       success_url: "http://localhost:5173/payment-success",
//       cancel_url: "http://localhost:5173/payment-failed",
//     });

//     res.json({ sessionId: session.id });

//   } catch (error) {
//     console.error("Stripe Error:", error);
//     res.status(500).json({ message: "Stripe checkout failed" });
//   }
// };


import asyncHandler from "express-async-handler";
import UserPayment from "../Models/userPaymentModel.js";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();
console.log("stripe key",process.env.STRIPE_SECRET_KEY)

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


// @desc    Create payment record (Cash/DB)
// @route   POST /api/payments/users
// @access  Private
export const createUserPayment = asyncHandler(async (req, res) => {
  // 1. Get data from Body
  const { orderId, amount, method, status } = req.body;

  // 2. Validation
  if (!amount) {
    res.status(400);
    throw new Error("Amount is required");
  }

  // 3. Create Record
  // We use req.user._id (from the 'protect' middleware) to ensure the user matches the token
  const payment = await UserPayment.create({
    user: req.user._id,  // <--- FIXED: Gets ID from the Auth Token
    order: orderId,
    amount: Number(amount),
    method: method || "cash",
    transactionId: `COD-${Date.now()}`,
    status: status || "pending"
  });

  res.status(201).json(payment);
});

// ... (Keep getUserPayments and stripeCheckout as they are)
export const getUserPayments = asyncHandler(async (req, res) => {
  const userId = req.params.userId || req.user._id;
  const payments = await UserPayment.find({ user: userId }).populate("order").sort({ createdAt: -1 });
  res.json(payments);
});

// export const stripeCheckout = async (req, res) => {
//   try {
//     const { orderId, amount } = req.body;
//     const parsedAmount = Number(amount);
    
//     if (!parsedAmount || parsedAmount <= 0) return res.status(400).json({ message: "Invalid amount" });
//     if (parsedAmount < 150) return res.status(400).json({ message: "Amount must be at least LKR 150" });

//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       mode: "payment",
//       line_items: [{
//           price_data: {
//             currency: "lkr",
//             product_data: { name: `Order #${orderId || 'N/A'}` },
//             unit_amount: Math.round(parsedAmount * 100),
//           },
//           quantity: 1,
//       }],
//       success_url: "http://localhost:5173/payment-success",
//       cancel_url: "http://localhost:5173/payment-failed",
//     });
//     res.json({ sessionId: session.id });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: error.message });
//   }
// };


// ... imports
export const stripeCheckout = async (req, res) => {
  try {
    const { orderId, amount } = req.body;
    const parsedAmount = Number(amount);

    if (!parsedAmount || parsedAmount < 150) {
      return res.status(400).json({ message: "Amount must be at least LKR 150" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "lkr",
            product_data: { name: `Order #${orderId || 'N/A'}` },
            unit_amount: Math.round(parsedAmount * 100),
          },
          quantity: 1,
        },
      ],
      success_url: "http://localhost:5173/payment-success",
      cancel_url: "http://localhost:5173/payment-failed",
    });

    // ✅ CORRECT: Send the full URL to the frontend
    res.json({ url: session.url });

  } catch (error) {
    console.error("Stripe Error:", error);
    res.status(500).json({ message: error.message });
  }
};