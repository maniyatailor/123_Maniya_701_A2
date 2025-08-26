const User = require("../models/User");
const Product = require("../models/Product");
const Cart = require("../models/Cart"); // Correct path


// Create user
exports.createUser = async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = new User({ name, email });
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get user cart
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.params.userId }).populate("products.product");
    res.json(cart || { products: [], totalPrice: 0 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add product to cart
exports.addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, products: [] });
    }
    const existing = cart.products.find(p => p.product.toString() === productId);
    if (existing) existing.quantity += quantity;
    else cart.products.push({ product: productId, quantity });
    
    // Calculate total
    await cart.populate("products.product");
    cart.totalPrice = cart.products.reduce((sum, p) => sum + p.product.price * p.quantity, 0);
    await cart.save();
    
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
