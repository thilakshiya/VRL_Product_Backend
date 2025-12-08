import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from "../Controllers/productController.js";
import { protect, admin } from "../Middlewares/authMiddleware.js";

const router = express.Router();

// router.route("/products").get(getProducts).post(protect, admin, createProduct);

router.route("/").get(getProducts).post(protect, admin, createProduct);

router.route("/:id").get(getProductById).put(protect, admin, updateProduct).delete(protect, admin, deleteProduct);

export default router;




// import express from "express";
// import { getProducts, getProductById } from "../Controllers/productController.js";
// const router = express.Router();

// router.route("/").get(getProducts);
// router.route("/:id").get(getProductById);

// export default router;

