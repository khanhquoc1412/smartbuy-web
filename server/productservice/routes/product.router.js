const { Router } = require("express");
const productController = require("../controllers/product.controller");
const topSellingController = require("../controllers/topSelling.controller");
const upload = require("../middleware/multer");

const router = Router();

// Top selling products endpoint
router.get("/top-selling", topSellingController.getTopSellingProducts);
router.get("/suggestions", productController.getSuggestions);
router.get("/brands", productController.getAllBrands);

router.get("/get-all/:categoryName", productController.getAll);
router.get("/get-all", productController.getAll);
// router.get("/search/:keyword", productController.getAll);

// router.get("/category/:categoryName", productController.getAll); // /api/product/category/mobile
router.get("/search/:keyword", productController.getAll); // /api/product/search/iphone
router.get("/", productController.getAll); // /api/product?page=1&brand=apple
// ✅ THÊM ROUTE MỚI - Lấy product theo ID (đặt TRƯỚC :slug)
router.get("/id/:id", productController.getProductById);
router.get("/variant/:id", productController.getProductVariant);

router.get("/sale", productController.getProductSale);
router.post("/create", productController.createProduct);
router.get("/:slug", productController.getProductBySlug);
router.post("/add/image", upload.any(), productController.addImageProduct);
// router.get("/:slug/reviews", productController.getProductReviewsBySlug);

// ✅ Stock management
router.patch("/stock", productController.updateStock);

module.exports = router;
