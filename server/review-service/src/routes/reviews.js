const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");

// Admin routes (đặt trước để tránh conflict với :id)
// router.get("/stats/overview", reviewController.getStats);
router.get("/stats", reviewController.getStats);
router.get("/stats/rating-distribution", reviewController.getRatingDistribution);
router.get("/stats/top-products", reviewController.getTopReviewedProducts);
router.get("/stats/trends", reviewController.getReviewTrends);
router.get("/stats/images", reviewController.getImageStats);
router.patch("/:id/visibility", reviewController.toggleVisibility);

// Public routes
router.get("/", reviewController.getAllReviews);
router.get("/product/:productId", reviewController.getReviewsByProduct);
router.get("/user/:userId", reviewController.getReviewsByUser);
router.get("/:id", reviewController.getReviewById);
router.post("/", reviewController.createReview);
router.put("/:id", reviewController.updateReview);
router.delete("/:id", reviewController.deleteReview);
router.post("/:id/helpful", reviewController.markHelpful);

module.exports = router;
