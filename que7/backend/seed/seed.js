const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Category = require("../models/Category");
const Product = require("../models/Product");
const User = require("../models/User");

connectDB();

const seed = async () => {
  try {
    // Clear existing data
    await Category.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    // Create top-level categories
    const electronics = new Category({ name: "Electronics" });
    const fashion = new Category({ name: "Fashion" });

    await electronics.save();
    await fashion.save();

    // Create sub-categories
    const mobiles = new Category({ name: "Mobiles", parent: electronics._id });
    const laptops = new Category({ name: "Laptops", parent: electronics._id });
    const men = new Category({ name: "Men", parent: fashion._id });
    const women = new Category({ name: "Women", parent: fashion._id });

    await mobiles.save();
    await laptops.save();
    await men.save();
    await women.save();

    // Create products
    const products = [
      { name: "iPhone 15", price: 999, category: mobiles._id, stock: 50 },
      { name: "Samsung Galaxy S23", price: 799, category: mobiles._id, stock: 40 },
      { name: "MacBook Pro", price: 1999, category: laptops._id, stock: 20 },
      { name: "Dell XPS 13", price: 1299, category: laptops._id, stock: 15 },
      { name: "Men T-Shirt", price: 25, category: men._id, stock: 100 },
      { name: "Women Dress", price: 50, category: women._id, stock: 80 }
    ];

    await Product.insertMany(products);

    // Create a test user
    const user = new User({ name: "Test User", email: "testuser@example.com" });
    await user.save();

    console.log("Database seeded successfully!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
