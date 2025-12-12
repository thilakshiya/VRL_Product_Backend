// src/Routes/forgotPasswordRoutes.js
import express from "express";
import { requestPasswordReset, resetPassword } from "../Controllers/forgotPasswordController.js";

const router = express.Router();

router.post("/send-otp", requestPasswordReset);
router.post("/reset", resetPassword);

// export default router;


export default router;


 


