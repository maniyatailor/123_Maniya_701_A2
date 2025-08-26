const express = require("express");
const router = express.Router();
const {
  createUser,
  getCart,
  addToCart
} = require("../controllers/userController");

// User CRUD (simplified)
router.post("/", createUser);

// Cart routes
router.get("/:userId/cart", getCart);
router.post("/cart", addToCart);

module.exports = router;
