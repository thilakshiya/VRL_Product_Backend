








// import asyncHandler from "express-async-handler";
// import Supplier from "../Models/suppilerModel.js"; // make sure the model path is correct

// // Create Supplier Info
// export const createSupplier = asyncHandler(async (req, res) => {
//   // Only users with role 'supplier' can create supplier info
//   if (req.user.role !== "supplier") {
//     res.status(403);
//     throw new Error("Only suppliers can create supplier details");
//   }

//   const { name, quantity, contactNo, price } = req.body;

//   // Validate required fields
//   if (!name || !quantity || !contactNo) {
//     res.status(400);
//     throw new Error("Please provide name, quantity, and contact number");
//   }

//   // Check if supplier already exists for this user
//   const existingSupplier = await Supplier.findOne({ user: req.user._id });
//   if (existingSupplier) {
//     res.status(400);
//     throw new Error("Supplier profile already exists for this user");
//   }

  

//   // Create supplier
//   const supplier = await Supplier.create({
//     name,
//     quantity,
//     contactNo,
//     price: price || 1,   // default price = 1
//     user: req.user._id
//   });

//   res.status(201).json({
//     success: true,
//     data: supplier
//   });
// });

// // Get suppliers
// export const getSuppliers = asyncHandler(async (req, res) => {
//   if (req.user.role !== "admin" && req.user.role !== "supplier") {
//     res.status(403);
//     throw new Error("Not allowed");
//   }

//   // Admin → get all suppliers
//   if (req.user.role === "admin") {
//     const suppliers = await Supplier.find({});
//     return res.json(suppliers);
//   }

//   // Supplier → get only own data
//   const supplier = await Supplier.findOne({ user: req.user._id });
//   res.json(supplier);
// });

// // Update supplier
// export const updateSupplier = asyncHandler(async (req, res) => {
//   const supplier = await Supplier.findById(req.params.id);
//   if (!supplier) {
//     res.status(404);
//     throw new Error("Supplier not found");
//   }

//   // Supplier → can edit only their own details
//   if (req.user.role === "supplier" && supplier.user.toString() !== req.user._id.toString()) {
//     res.status(403);
//     throw new Error("You can update only your own details");
//   }

//   // Update fields
//   supplier.name = req.body.name || supplier.name;
//   supplier.quantity = req.body.quantity || supplier.quantity;
//   supplier.contactNo = req.body.contactNo || supplier.contactNo;
//   supplier.price = req.body.price || supplier.price;

//   const updatedSupplier = await supplier.save();
//   res.json({
//     success: true,
//     data: updatedSupplier
//   });



// // This function MUST exist to fetch data based on the logged-in user
// const getMySupplies = asyncHandler(async (req, res) => {
//   // "req.user._id" comes from the token. It finds only THIS supplier's data.
//   const supplies = await Supplier.find({ user: req.user._id }).sort({ createdAt: -1 }); 
//   res.json(supplies);
// });


// });





import asyncHandler from "express-async-handler";
import Supplier from "../Models/suppilerModel.js"; // Check spelling: 'suppilerModel' vs 'supplierModel'

// @desc    Create Supplier Supply Record
// @route   POST /api/suppliers
export const createSupplier = asyncHandler(async (req, res) => {
  if (req.user.role !== "supplier") {
    res.status(403);
    throw new Error("Only suppliers can create supplier details");
  }

  const { name, quantity, contactNo, price, address, email } = req.body;

  if (!name || !quantity || !contactNo) {
    res.status(400);
    throw new Error("Please provide name, quantity, and contact number");
  }

  // Note: We removed the "existingSupplier" check because a supplier 
  // might want to add MULTIPLE supply entries over time.
  
  const supplier = await Supplier.create({
    user: req.user._id,
    name,
    quantity,
    contactNo,
    address, // added address
    email,   // added email
    price: price || 10
  });

  res.status(201).json({
    success: true,
    data: supplier
  });
});

// @desc    Get Logged-in Supplier's History
// @route   GET /api/suppliers/mine
export const getMySupplies = asyncHandler(async (req, res) => {
  // Find all supplies belonging to this user
  const supplies = await Supplier.find({ user: req.user._id }).sort({ createdAt: -1 }); 
  res.json(supplies);
});

// @desc    Get All Suppliers (Admin) or Single Profile (Legacy)
// @route   GET /api/suppliers
export const getSuppliers = asyncHandler(async (req, res) => {
  if (req.user.role === "admin") {
    const suppliers = await Supplier.find({});
    return res.json(suppliers);
  }
  
  // Fallback for supplier fetching their own list via this route
  const supplies = await Supplier.find({ user: req.user._id });
  res.json(supplies);
});

// @desc    Update Supplier Record
// @route   PUT /api/suppliers/:id
export const updateSupplier = asyncHandler(async (req, res) => {
  const supplier = await Supplier.findById(req.params.id);

  if (!supplier) {
    res.status(404);
    throw new Error("Supplier record not found");
  }

  // Ensure user owns this record (or is admin)
  if (req.user.role !== "admin" && supplier.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("You can update only your own details");
  }

  supplier.name = req.body.name || supplier.name;
  supplier.quantity = req.body.quantity || supplier.quantity;
  supplier.contactNo = req.body.contactNo || supplier.contactNo;
  supplier.price = req.body.price || supplier.price;
  supplier.address = req.body.address || supplier.address;
  supplier.email = req.body.email || supplier.email;

  const updatedSupplier = await supplier.save();

  res.json({
    success: true,
    data: updatedSupplier
  });
});