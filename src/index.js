
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

// Config
dotenv.config();
const app = express();

// Connect DB
connectDB();

// Gemini Configuration
// Ensure GEMINI_API_KEY is in your .env file
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Middleware


if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

// CORS Configuration
// Allow connections from your Frontend
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000","https://vrl-product-frontend-zwiz.vercel.app"], 
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- GEMINI CHATBOT ROUTE START ---
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }
    
    // *** FIX: Using 'gemini-pro' as it is the most stable model ***
    // If you updated npm package, you can try 'gemini-1.5-flash' later
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Prompt Engineering
    const prompt = `You are a helpful AI assistant for 'VRL Supply Chain Management'. 
    Answer questions related to:
    - Sourcing Raw Materials (Cocoa, Steel, etc.)
    - Logistics & Shipping
    - Supplier Information
    
    User Question: ${message}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ reply: text });

  } catch (error) {
    // Detailed Error Logging
    console.error("Gemini AI Error Details:", error);
    
    // Send a user-friendly error message
    res.status(500).json({ 
      error: "AI Service Error", 
      details: error.message || "Failed to fetch response" 
    });
  }
});
// --- GEMINI CHATBOT ROUTE END ---

// Existing Routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments/users", userPaymentRoutes);
app.use("/api/payments/suppliers", supplierPaymentRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/password", forgotPasswordRoutes);
app.use("/api/suppliers", supplierRoutes);

// Health check
app.get("/", (req, res) => res.send("API is running..."));

// Error handlers
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});