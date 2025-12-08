// import mongoose from "mongoose";

// const productSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   description: String,
//   price: { type: Number, required: true },
//   stock: { type: Number, required: true },
//   image: String,
// }, { timestamps: true });

// const Product = mongoose.model("Product", productSchema);
// export default Product;


// import mongoose from "mongoose";

// const productSchema = mongoose.Schema(
//   {
//     name: { type: String, required: true },
//     sku: { type: String, sparse: true, index: true },
//     description: { type: String },
//     price: { type: Number, required: true },
//     stock: { type: Number, default: 0 },
//     unit: { type: String, default: "kg" },
//     // supplier: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier" },
//     // images: [{ type: String }]
//   },
//   { timestamps: true }
// );

// const Product = mongoose.model("Product", productSchema);
// export default Product;



import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    sku: {
      type: String,
      sparse: true,
      index: true,
      unique: false, // optional
    },

    description: { type: String },

    price: {
      type: Number,
      required: true,
    },

    stock: {
      type: Number,
      default: 0,
    },

    unit: {
      type: String,
      default: "kg",
    },

    // Supplier reference
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: false,
    },

    // One main product image (frontend uses product.image)
    image: {
      type: String,
      default: "", // avoid undefined errors
    },

    // Multiple images support (optional)
    images: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
