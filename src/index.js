




import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import connectDB from "./Config/db.js";
import { notFound, errorHandler } from "./Middlewares/errorMiddleware.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Routes Imports
import userRoutes from "./Routes/userRoutes.js";
import productRoutes from "./Routes/productRoutes.js";
import orderRoutes from "./Routes/orderRoutes.js";
import userPaymentRoutes from "./Routes/userPaymentRoutes.js";
import supplierPaymentRoutes from "./Routes/supplierPaymentRoutes.js";
import feedbackRoutes from "./Routes/feedbackRoutes.js";
import forgotPasswordRoutes from "./Routes/forgotPasswordRoutes.js";
import supplierRoutes from "./Routes/suppilerRoutes.js";
import cloudinaryRoutes from "./Routes/cloudinaryRoutes.js";

// Config
dotenv.config();
const app = express();

// Connect Database
connectDB();

// Gemini (Google AI Studio) Configuration
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS Configuration
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://vrl-product-frontend-zwiz.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Morgan Logs
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// --- GEMINI CHATBOT ROUTE ---
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Recommended stable model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are a helpful AI assistant for 'VRL Supply Chain Management'.
      Answer questions related to:
      - Sourcing Raw Materials
      - Logistics & Shipping
      - Supplier Details
      - Order / Delivery Clarification
      
      User Question: ${message}
    `;

    const result = await model.generateContent(prompt);
    const reply = result.response.text();

    res.json({ reply });
  } catch (error) {
    console.error("Gemini AI Route Error:", error.message);
    res.status(500).json({
      error: "AI Service Error",
      details: error.message,
    });
  }
});
// --- END CHAT ROUTE ---

// Register Routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments/users", userPaymentRoutes);
app.use("/api/payments/suppliers", supplierPaymentRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/password", forgotPasswordRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/upload", cloudinaryRoutes);

// Health Check Endpoint
app.get("/", (req, res) => res.send("API is running..."));

// Error Middlewares
app.use(notFound);
app.use(errorHandler);

// Server Start
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
