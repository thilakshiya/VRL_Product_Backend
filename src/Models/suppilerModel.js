// import mongoose from "mongoose";
// const supplierSchema = mongoose.Schema(
//   {
//     name: { type: String, required: true },
//     quantity: { type: Number, required: true },      // Supplier bottle no
//     contactNo: { type: String, required: true },     // Supplier contact number
//     Price: { type: Number, default: 1 },       // 1 bottle = ₹1
//     role: { type: String, default: "supplier" },
//     user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
//   },
//   { timestamps: true }
// );
// const Supplier = mongoose.model("Supplier", supplierSchema);
// export default Supplier;



// src/Models/supplierModel.js
import mongoose from "mongoose";

// Define the supplier schema
const supplierSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    quantity: { type: Number, required: true },     
    contactNo: { type: String, required: true },    
    price: { type: Number, default: 1 },            
    role: { type: String, default: "supplier" },
   
  },
  { timestamps: true }
);

// Create the Supplier model
const Supplier = mongoose.model("Supplier", supplierSchema);

// Export the model
export default Supplier;
