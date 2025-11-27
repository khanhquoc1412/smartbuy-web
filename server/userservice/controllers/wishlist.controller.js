const Wishlist = require("../models/wishlist");

// GET /api/user/wishlist
exports.getWishlist = async (req, res) => {
    try {
        const userId = req.userId;

        // ✅ DON'T populate product - Product model doesn't exist in userservice
        // Client will fetch product details separately from product service
        let wishlist = await Wishlist.findOne({ userId });

        if (!wishlist) {
            wishlist = await Wishlist.create({ userId, items: [] });
        }

        res.json({
            success: true,
            data: wishlist,
        });
    } catch (error) {
        console.error('❌ Get wishlist error:', error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// POST /api/user/wishlist
exports.addToWishlist = async (req, res) => {
    try {
        const userId = req.userId;
        const { productId, variantId, colorId, memoryId } = req.body;

        console.log('👉 [addToWishlist] Request:', { userId, body: req.body });

        let wishlist = await Wishlist.findOne({ userId });

        if (!wishlist) {
            console.log('👉 [addToWishlist] Creating new wishlist for user');
            wishlist = new Wishlist({ userId, items: [] });
        } else {
            console.log('👉 [addToWishlist] Found existing wishlist:', wishlist._id);
        }

        // Check if product already exists (check by variant if provided)
        const exists = wishlist.items.some((item) => {
            if (variantId) {
                return item.variantId === variantId;
            }
            return item.product.toString() === productId;
        });

        if (exists) {
            console.log('👉 [addToWishlist] Item already exists');
            return res.status(400).json({
                success: false,
                message: "Sản phẩm đã có trong danh sách yêu thích",
            });
        }

        const newItem = {
            product: productId,
            variantId: variantId || null,
            colorId: colorId || null,
            memoryId: memoryId || null
        };

        console.log('👉 [addToWishlist] Pushing new item:', newItem);
        wishlist.items.push(newItem);

        const savedWishlist = await wishlist.save();
        console.log('✅ [addToWishlist] Saved wishlist. Items count:', savedWishlist.items.length);

        res.json({
            success: true,
            message: "Đã thêm vào danh sách yêu thích",
            data: savedWishlist,
        });
    } catch (error) {
        console.error('❌ [addToWishlist] Error:', error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }

}


// DELETE /api/user/wishlist/:productId
exports.removeFromWishlist = async (req, res) => {
    try {
        const userId = req.userId;
        const { productId } = req.params; // This can be productId OR itemId
        const { variantId } = req.query;

        const wishlist = await Wishlist.findOne({ userId });

        if (!wishlist) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy danh sách yêu thích",
            });
        }

        const initialLength = wishlist.items.length;

        // ✅ Check if productId is actually an Item ID (unique _id of the item in array)
        const isItemId = wishlist.items.some(item => item._id.toString() === productId);

        if (isItemId) {
            // Remove by specific Item ID
            wishlist.items = wishlist.items.filter(item => item._id.toString() !== productId);
        } else {
            // Remove by Product ID (and optional Variant ID)
            wishlist.items = wishlist.items.filter((item) => {
                const isSameProduct = item.product.toString() === productId;

                if (!isSameProduct) return true; // Keep other products

                // If same product, check variant
                if (variantId) {
                    // If variantId provided, only remove if variant matches
                    return String(item.variantId) !== String(variantId);
                }

                // If no variantId provided, remove all instances of this product
                return false;
            });
        }

        if (wishlist.items.length === initialLength) {
            return res.status(404).json({
                success: false,
                message: "Sản phẩm không có trong danh sách yêu thích",
            });
        }

        await wishlist.save();

        res.json({
            success: true,
            message: "Đã xóa khỏi danh sách yêu thích",
            data: wishlist,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// DELETE /api/user/wishlist/clear
exports.clearWishlist = async (req, res) => {
    try {
        const userId = req.userId;

        const wishlist = await Wishlist.findOne({ userId });

        if (!wishlist) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy danh sách yêu thích",
            });
        }

        wishlist.items = [];
        await wishlist.save();

        res.json({
            success: true,
            message: "Đã xóa toàn bộ danh sách yêu thích",
            data: wishlist,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
