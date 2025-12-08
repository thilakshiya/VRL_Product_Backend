// // // import express from "express";
// // // import {
// // //   addOrder,
// // //   getOrderById,
// // //   updateOrderToPaid,
// // //   getMyOrders,
// // //   getOrders
// // // } from "../Controllers/orderController.js";
// // // import { protect, admin } from "../Middlewares/authMiddleware.js";

// // // const router = express.Router();

// // // router.route("/order").post(protect, addOrder).get(protect, admin, getOrders);
// // // router.route("/myorders").get(protect, getMyOrders);
// // // router.route("/:id").get(protect, getOrderById);
// // // router.route("/:id/pay").put(protect, updateOrderToPaid);

// // // export default router;




// // import express from "express";
// // import {
// //   addOrder,
// //   getOrderById,
// //   updateOrderToPaid,
// //   getMyOrders,
// //   getOrders
// // } from "../Controllers/orderController.js";
// // import { protect, admin } from "../Middlewares/authMiddleware.js";

// // const router = express.Router();

// // // POST /api/orders  ✔ (Correct)
// // router.route("/")
// //   .post(protect, addOrder)
// //   .get(protect, admin, getOrders);

// // // GET /api/orders/myorders


// // router.route("/myorders").get(protect, getMyOrders);

// // // GET /api/orders/:id
// // router.route("/:id").get(protect, getOrderById);

// // // PUT /api/orders/:id/pay
// // router.route("/:id/pay").put(protect, updateOrderToPaid);

// // export default router;





// import express from "express";
// import { 
//   createSupplier, 
//   getSuppliers, 
//   updateSupplier, 
//   getMySupplies // <--- Import the new function
// } from "../Controllers/suppilerController.js";
// import { protect, admin } from "../Middlewares/authMiddleware.js";

// const router = express.Router();

// router.post("/", protect, createSupplier);
// router.get("/mine", protect, getMySupplies); // <--- Add this route specifically
// router.get("/", protect, getSuppliers);
// router.put("/:id", protect, updateSupplier);

// export default router;





import express from "express";
import {
  createOrder,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
  getOrders,
} from "../Controllers/orderController.js";
import { protect, admin } from "../Middlewares/authMiddleware.js";

const router = express.Router();

// 1. User Routes (Anyone logged in can create)
router.route("/").post(protect, createOrder).get(protect, admin, getOrders);

// 2. My Orders (Must be BEFORE /:id)
router.route("/myorders").get(protect, getMyOrders);

// 3. Order by ID
router.route("/:id").get(protect, getOrderById);

// 4. Pay Route
router.route("/:id/pay").put(protect, updateOrderToPaid);

export default router;