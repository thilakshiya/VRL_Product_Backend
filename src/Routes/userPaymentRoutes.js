// import express from "express";
// import { createUserPayment, getUserPayments ,stripeCheckout} from "../Controllers/userPaymentController.js";
// import { protect, admin } from "../Middlewares/authMiddleware.js";


// const router = express.Router();

// router.post("/", protect, createUserPayment);
// router.post("/stripe-checkout", protect, stripeCheckout);
// router.get("/:userId", protect, getUserPayments);
// router.get("/", protect, admin, async (req, res) => {
//   // optional admin listing - quick implementation
//   res.status(200).json({ msg: "implement listing if needed" });
// });

// export default router;


import express from "express";
import { 
    createUserPayment, 
    getUserPayments, 
    stripeCheckout 
} from "../Controllers/userPaymentController.js";
import { protect, admin } from "../Middlewares/authMiddleware.js";

const router = express.Router();

// Process standard payment recording (e.g. Cash)
router.post("/", protect, createUserPayment);

// Process Stripe Checkout Session
router.post("/stripe-checkout", protect, stripeCheckout);

// Get specific user payments
router.get("/:userId", protect, getUserPayments);

// Admin route example
router.get("/", protect, admin, async (req, res) => {
  res.status(200).json({ msg: "Admin payment listing logic here" });
});

export default router;