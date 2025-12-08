

import express from "express";
import { protect, admin } from "../Middlewares/authMiddleware.js";
import {
  createSupplier,
  getSuppliers,
  updateSupplier,
  getMySupplies
} from "../Controllers/suppilerController.js";
const router = express.Router();
// User must be logged in (protect)
// Supplier create (only suppliers)
router.post("/", protect, createSupplier);
// Admin sees all, supplier sees only own data
router.get("/", protect, getSuppliers);
// Update supplier details
router.put("/:id", protect, updateSupplier);
// This route MUST exist
router.get("/mine", protect, getMySupplies);
export default router;