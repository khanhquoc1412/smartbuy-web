const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const {
    getWishlist,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
} = require("../controllers/wishlist.controller");

router.use(auth);

router.get("/", getWishlist);
router.post("/", addToWishlist);
router.delete("/clear", clearWishlist); // Must be before /:productId
router.delete("/:productId", removeFromWishlist);

module.exports = router;
