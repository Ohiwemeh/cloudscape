import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js";

dotenv.config();

const products = [
  {
    name: "Classic White Tee",
    description: "Essential crew neck t-shirt in soft cotton",
    price: 24.99,
    category: "T-Shirts",
    sizes: ["XS", "S", "M", "L", "XL"],
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800",
    ],
    inStock: true,
  },
  {
    name: "Slim Fit Jeans",
    description: "Modern slim fit jeans in dark wash",
    price: 79.99,
    category: "Pants",
    sizes: ["30x30", "32x30", "34x30", "36x30"],
    images: [
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800",
    ],
    inStock: true,
  },
  {
    name: "Casual Hoodie",
    description: "Comfortable cotton blend hoodie",
    price: 49.99,
    category: "Hoodies",
    sizes: ["S", "M", "L", "XL"],
    images: [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800",
    ],
    inStock: true,
  },
  {
    name: "Bomber Jacket",
    description: "Classic bomber jacket in navy",
    price: 129.99,
    category: "Jackets",
    sizes: ["S", "M", "L"],
    images: [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800",
    ],
    inStock: true,
  },
  {
    name: "Striped Polo",
    description: "Cotton polo with contrast stripes",
    price: 39.99,
    category: "Polos",
    sizes: ["S", "M", "L", "XL"],
    images: [
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800",
    ],
    inStock: true,
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB...");

    // Clear existing products
    await Product.deleteMany({});
    console.log("Cleared existing products");

    // Insert new products
    await Product.insertMany(products);
    console.log("Added sample products");

    mongoose.connection.close();
  } catch (err) {
    console.error("Error seeding database:", err);
    process.exit(1);
  }
};

seedDB();