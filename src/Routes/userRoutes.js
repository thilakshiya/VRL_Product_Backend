import express from "express";
import { registerUser, authUser, getUserProfile,getUsers } from "../Controllers/userController.js";
import { protect ,admin} from "../Middlewares/authMiddleware.js";
// import { protect, admin } from "../Middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", authUser);
router.get("/profile", protect, getUserProfile);
router.get("/", protect, admin, getUsers);

export default router;


