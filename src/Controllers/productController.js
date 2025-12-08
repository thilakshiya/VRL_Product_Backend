
// import asyncHandler from "express-async-handler";
// import Product from "../Models/productModel.js";

// // @desc Get products (with optional search & pagination)
// // @route GET /api/products
// // @access Public
// export const getProducts = asyncHandler(async (req, res) => {
//   const pageSize = Number(req.query.limit) || 20;
//   const page = Number(req.query.page) || 1;
//   const keyword = req.query.keyword
//     ? { name: { $regex: req.query.keyword, $options: "i" } }
//     : {};
//   const count = await Product.countDocuments({ ...keyword });
//   const products = await Product.find({ ...keyword })
//     .skip(pageSize * (page - 1))
//     .limit(pageSize);
//   res.json({ products, page, pages: Math.ceil(count / pageSize) });
// });

// // @desc Get product by id
// // @route GET /api/products/:id
// // @access Public
// export const getProductById = asyncHandler(async (req, res) => {
//   const product = await Product.findById(req.params.id).populate("supplier", "name");
//   if (product) res.json(product);
//   else {
//     res.status(404);
//     throw new Error("Product not found");
//   }
// });

// // @desc Create product
// // @route POST /api/products
// // @access Private/Admin
// export const createProduct = asyncHandler(async (req, res) => {
//   const { name, sku, description, price, stock, unit, supplier, images } = req.body;
//   const product = new Product({ name, sku, description, price, stock, unit, supplier, images });
//   const created = await product.save();
//   res.status(201).json(created);
// });

// // @desc Update product
// // @route PUT /api/products/:id
// // @access Private/Admin
// export const updateProduct = asyncHandler(async (req, res) => {
//   const product = await Product.findById(req.params.id);
//   if (!product) {
//     res.status(404);
//     throw new Error("Product not found");
//   }
//   const updates = req.body;
//   Object.assign(product, updates);
//   const updated = await product.save();
//   res.json(updated);
// });

// // @desc Delete product
// // @route DELETE /api/products/:id
// // @access Private/Admin
// export const deleteProduct = asyncHandler(async (req, res) => {
//   const product = await Product.findById(req.params.id);
//   if (product) {
//     await product.remove();
//     res.json({ message: "Product removed" });
//   } else {
//     res.status(404);
//     throw new Error("Product not found");
//   }
// });



import asyncHandler from "express-async-handler";
import Product from "../Models/productModel.js";

// ======================================
// GET ALL PRODUCTS
// ======================================
export const getProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);   // return array only
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// ======================================
// GET SINGLE PRODUCT BY ID
// ======================================
// export const getProductById = asyncHandler(async (req, res) => {
//   const product = await Product.findById(req.params.id).populate("supplier", "name");

//   if (product) res.json(product);
//   else {
//     res.status(404);
//     throw new Error("Product not found");
//   }
// });



export const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  console.log("🔥 Backend received ID:", id);  // Debug line

  if (!id) {
    return res.status(400).json({ message: "Product ID is missing" });
  }

  const product = await Product.findById(id).populate("supplier", "name");

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json(product);
});


// ======================================
// CREATE PRODUCT
// ======================================
// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, stock, unit, images } = req.body;

  // Auto-generate SKU (e.g., SKU-<timestamp>-<random>)
  const sku = `SKU-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  const product = new Product({
    name,
    sku,
    description,
    price,
    stock,
    unit,
    images
  });

  const created = await product.save();
  res.status(201).json(created);
});

// ======================================
// UPDATE PRODUCT
// ======================================
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  Object.assign(product, req.body);
  const updated = await product.save();
  res.json(updated);
});

// ======================================
// DELETE PRODUCT
// ======================================
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await product.deleteOne();
    res.json({ message: "Product removed" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});
