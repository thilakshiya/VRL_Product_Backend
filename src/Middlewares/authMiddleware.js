


// import jwt from "jsonwebtoken";
// import asyncHandler from "express-async-handler";
// import User from "../Models/userModel.js";

// export const protect = asyncHandler(async (req, res, next) => {
//   let token;
//   if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
//     try {
//       token = req.headers.authorization.split(" ")[1];
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       req.user = await User.findById(decoded.id).select("-password");
//       next();
//     } catch (error) {
//       res.status(401);
//       throw new Error("Not authorized, token failed");
//     }
//   } else {
//     res.status(401);
//     throw new Error("Not authorized, no token");
//   }
// });

// export const admin = (req, res, next) => {
//   if (req.user && req.user.role === "admin") next();
//   else {
//     res.status(403);
//     throw new Error("Not authorized as an admin");
//   }
// };

import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../Models/userModel.js";
import dotenv from "dotenv";

dotenv.config(); // Ensure env vars are loaded

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // 1. Get token from header
      token = req.headers.authorization.split(" ")[1];

      // 2. Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Get user from the token (exclude password)
      // Ensure your generateToken used 'id', otherwise change this to 'decoded._id'
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        res.status(401);
        throw new Error("User not found (Token valid but user deleted)");
      }

      next();
    } catch (error) {
      // --- DEBUGGING LOGS ---
      console.error("Auth Middleware Error:", error.message); 
      // This will print "jwt expired" or "invalid signature" in your terminal
      
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  } else {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

export const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403); // 403 Forbidden is better than 401 for permissions
    throw new Error("Not authorized as an admin");
  }
};

