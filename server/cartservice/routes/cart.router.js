const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart.controller");
const authMiddleware = require("../middleware/auth");

/**
 * Cart Routes
 * Base path: /api/cart
 * All routes require authentication
 */

// ========== CART MANAGEMENT ==========

/**
 * @route   GET /api/cart
 * @desc    Get user's cart
 * @access  Private
 */
router.get("/", authMiddleware, cartController.getCart);

/**
 * @route   GET /api/cart/count
 * @desc    Get cart items count
 * @access  Private
 */
router.get("/count", authMiddleware, cartController.getCartCount);

/**
 * @route   POST /api/cart/add
 * @desc    Add item to cart
 * @body    { productId, variantId, quantity }
 * @access  Private
 */
router.post("/add", authMiddleware, cartController.addToCart);

/**
 * @route   PUT /api/cart/update/:itemId
 * @desc    Update item quantity
 * @access  Private
 */
router.put("/update/:itemId", authMiddleware, cartController.updateQuantity);

/**
 * @route   DELETE /api/cart/remove/:itemId
 * @desc    Remove item from cart
 * @access  Private
 */
router.delete("/remove/:itemId", authMiddleware, cartController.removeItem);

/**
 * @route   DELETE /api/cart/clear
 * @desc    Clear entire cart
 * @access  Private
 */
router.delete("/clear", authMiddleware, cartController.clearCart);

// ========== ITEM MANAGEMENT (Alternative routes) ==========

/**
 * @route   PATCH /api/cart/item/:cartItemId
 * @desc    Update item quantity (alternative)
 * @body    { quantity }
 * @access  Private
 */
router.patch(
  "/item/:cartItemId",
  authMiddleware,
  cartController.updateQuantity
);

/**
 * @route   DELETE /api/cart/item/:cartItemId
 * @desc    Remove item from cart (alternative)
 * @access  Private
 */
router.delete("/item/:cartItemId", authMiddleware, cartController.removeItem);

/**
 * ✅ NEW: Remove multiple items from cart
 * @route   DELETE /api/cart/items
 * @desc    Remove multiple items at once
 * @body    { itemIds: [id1, id2, ...] }
 * @access  Private
 */
router.delete("/items", authMiddleware, cartController.removeMultipleItems);

// ========== COUPON MANAGEMENT ==========

/**
 * @route   POST /api/cart/coupon
 * @desc    Apply coupon code
 * @body    { code }
 * @access  Private
 */
router.post("/coupon", authMiddleware, cartController.applyCoupon);

/**
 * @route   DELETE /api/cart/coupon
 * @desc    Remove coupon code
 * @access  Private
 */
router.delete("/coupon", authMiddleware, cartController.removeCoupon);

// ========== VALIDATION & SYNC ==========

/**
 * @route   POST /api/cart/sync
 * @desc    Sync cart with latest product data
 * @access  Private
 */
router.post("/sync", authMiddleware, cartController.syncCart);

/**
 * @route   GET /api/cart/validate
 * @desc    Validate cart before checkout
 * @access  Private
 */
router.get("/validate", authMiddleware, cartController.validateCart);

module.exports = router;