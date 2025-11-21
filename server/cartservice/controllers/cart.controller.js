const { StatusCodes } = require("http-status-codes");
const Cart = require("../models/cart");
const cartService = require("../services/cart.service");
const config = require("../config/config");

/**
 * Cart Controller
 * Xử lý HTTP requests cho giỏ hàng
 */
class CartController {
  /**
   * @route   POST /api/cart/add
   * @desc    Add item to cart
   * @access  Private (requires auth)
   */
  async addToCart(req, res) {
    try {
      const userId = req.user._id || req.user.id;
      const requestData = req.body;

      console.log("📥 Add to cart request:", {
        userId,
        body: requestData,
      });

      // Validate request data
      const { productId, variantId, quantity } =
        cartService.validateAddToCartRequest(requestData);

      // Get product and variant from Product Service
      const { product, variant } = await cartService.validateVariant(
        productId,
        variantId
      );

      console.log("✅ Product & Variant fetched:", {
        productName: product.name,
        productSlug: product.slug,
        variantPrice: variant.price,
        variantStock: variant.stock,
      });

      // Check stock availability
      cartService.checkStock(variant, quantity);

      // Get or create cart
      const cart = await Cart.getOrCreateCart(userId);

      // Check max items limit
      cartService.canAddMoreItems(cart, config.MAX_ITEMS_PER_CART);

      // Build cart item data
      const itemData = cartService.buildCartItemData(
        product,
        variant,
        quantity
      );

      console.log("✅ Built cart item data:", itemData);

      // Add item to cart
      cart.addItem(itemData);
      await cart.save();

      console.log("✅ Added to cart successfully:", {
        productName: product.name,
        quantity,
        totalItems: cart.totalItems,
        totalPrice: cart.totalPrice,
      });

      // Format response
      const formattedCart = cartService.formatCartResponse(cart);

      return res.status(StatusCodes.OK).json({
        success: true,
        message: "Đã thêm sản phẩm vào giỏ hàng",
        data: formattedCart,
      });
    } catch (error) {
      console.error("❌ Add to cart error:", error);
      console.error("❌ Error stack:", error.stack);

      // Handle specific errors
      if (error.message.includes("Không thể kết nối")) {
        return res.status(StatusCodes.SERVICE_UNAVAILABLE).json({
          success: false,
          message: "Dịch vụ tạm thời không khả dụng",
        });
      }

      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: error.message || "Lỗi khi thêm vào giỏ hàng",
      });
    }
  }

  /**
   * @route   GET /api/cart
   * @desc    Get user's cart
   * @access  Private (requires auth)
   */
  async getCart(req, res) {
    try {
      const userId = req.user._id || req.user.id;

      console.log("📋 Get cart for user:", userId);

      const cart = await Cart.getOrCreateCart(userId);

      console.log("✅ Cart found:", {
        itemCount: cart.items?.length || 0,
        totalPrice: cart.totalPrice,
      });

      // ✅ Build response data
      const responseData = {
        cart: {
          items: cart.items || [],
          totalItems: cart.items?.length || 0,
          itemCount: cart.totalItems || 0,
          totalPrice: cart.totalPrice || 0,
          finalTotal: cart.finalTotal || cart.totalPrice || 0,
          subtotal: cart.subtotal || 0,
          discount: cart.discount || 0,
          couponDiscount: cart.couponDiscount || 0,
          couponCode: cart.couponCode || null,
        },
      };

      // ✅ Build final response
      const finalResponse = {
        success: true,
        message: "Lấy giỏ hàng thành công",
        data: responseData,
      };

      console.log(
        "📤 Sending FINAL response:",
        JSON.stringify(finalResponse, null, 2)
      );

      return res.status(StatusCodes.OK).json(finalResponse);
    } catch (error) {
      console.error("❌ Get cart error:", error);
      console.error("❌ Error stack:", error.stack);

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || "Lỗi khi lấy giỏ hàng",
      });
    }
  }

  /**
   * ✅ Get cart count
   */
  async getCartCount(req, res) {
    try {
      const userId = req.user._id || req.user.id;

      console.log("📊 Get cart count for user:", userId);

      const cart = await Cart.getOrCreateCart(userId);
      const count = cart.items?.length || 0;

      console.log("✅ Cart count:", count);

      return res.status(StatusCodes.OK).json({
        success: true,
        data: {
          count,
          userId,
        },
      });
    } catch (error) {
      console.error("❌ Get cart count error:", error);

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || "Lỗi khi lấy số lượng giỏ hàng",
      });
    }
  }

  /**
   * @route   PATCH /api/cart/item/:cartItemId
   * @desc    Update item quantity
   * @access  Private (requires auth)
   */
  async updateQuantity(req, res) {
    try {
      const userId = req.user._id || req.user.id;
      const { cartItemId } = req.params;
      const { quantity } = req.body;

      console.log("🔄 Update quantity request:", {
        userId,
        cartItemId,
        newQuantity: quantity,
        bodyKeys: Object.keys(req.body),
      });

      // ✅ Validate cartItemId
      if (!cartItemId) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: "Thiếu ID sản phẩm",
        });
      }

      // Validate quantity
      if (typeof quantity !== "number" || quantity < 0 || quantity > 99) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: "Số lượng không hợp lệ (0-99)",
        });
      }

      // Get cart
      const cart = await Cart.findByUserId(userId);

      if (!cart) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: "Không tìm thấy giỏ hàng",
        });
      }

      // Update quantity (will remove item if quantity = 0)
      cart.updateQuantity(cartItemId, quantity);
      await cart.save();

      console.log("✅ Updated quantity:", {
        totalItems: cart.totalItems,
        totalPrice: cart.totalPrice,
      });

      // ✅ Transform response giống getCart
      const transformedItems = cart.items.map((item) => ({
        _id: item._id,
        id: item._id,
        productId: item.product,
        variantId: item.variant.variantId,
        quantity: item.quantity,
        price: item.priceAtAdd,

        productVariant: {
          _id: item.variant.variantId,
          price: item.variant.price,
          stock: item.variant.stock,

          color: item.variant.color
            ? {
                _id: item.variant.color.id,
                name: item.variant.color.name,
                hexCode: item.variant.color.code,
              }
            : null,

          memory: item.variant.memory
            ? {
                _id: item.variant.memory.id,
                ram: item.variant.memory.ram,
                rom: item.variant.memory.rom,
              }
            : null,

          product: {
            _id: item.product,
            name: item.productName,
            slug: item.productSlug,
            thumbUrl: item.thumbUrl,
            discountPercentage: item.discountPercentage,
          },
        },
      }));

      const responseData = {
        cart: {
          items: transformedItems,
          totalItems: cart.items?.length || 0,
          itemCount: cart.totalItems || 0,
          totalPrice: cart.totalPrice || 0,
          finalTotal: cart.finalTotal || cart.totalPrice || 0,
          subtotal: cart.subtotal || 0,
          discount: cart.discount || 0,
          couponDiscount: cart.couponDiscount || 0,
          couponCode: cart.couponCode || null,
        },
      };

      return res.status(StatusCodes.OK).json({
        success: true,
        message: quantity === 0 ? "Đã xóa sản phẩm" : "Đã cập nhật số lượng",
        data: responseData,
      });
    } catch (error) {
      console.error("❌ Update quantity error:", error);
      console.error("❌ Error stack:", error.stack);

      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: error.message || "Lỗi khi cập nhật số lượng",
      });
    }
  }

  /**
   * @route   DELETE /api/cart/item/:cartItemId
   * @desc    Remove item from cart
   * @access  Private (requires auth)
   */
  async removeItem(req, res) {
    try {
      const userId = req.user._id || req.user.id;
      const { cartItemId } = req.params;

      console.log("🗑️ Remove item request:", { userId, cartItemId });

      // ✅ Validate cartItemId
      if (!cartItemId) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: "Thiếu ID sản phẩm",
        });
      }

      // Get cart
      const cart = await Cart.findByUserId(userId);

      if (!cart) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: "Không tìm thấy giỏ hàng",
        });
      }

      // Remove item
      cart.removeItem(cartItemId);
      await cart.save();

      console.log("✅ Removed item:", {
        totalItems: cart.totalItems,
        totalPrice: cart.totalPrice,
      });

      // ✅ Transform response giống getCart
      const transformedItems = cart.items.map((item) => ({
        _id: item._id,
        id: item._id,
        productId: item.product,
        variantId: item.variant.variantId,
        quantity: item.quantity,
        price: item.priceAtAdd,

        productVariant: {
          _id: item.variant.variantId,
          price: item.variant.price,
          stock: item.variant.stock,

          color: item.variant.color
            ? {
                _id: item.variant.color.id,
                name: item.variant.color.name,
                hexCode: item.variant.color.code,
              }
            : null,

          memory: item.variant.memory
            ? {
                _id: item.variant.memory.id,
                ram: item.variant.memory.ram,
                rom: item.variant.memory.rom,
              }
            : null,

          product: {
            _id: item.product,
            name: item.productName,
            slug: item.productSlug,
            thumbUrl: item.thumbUrl,
            discountPercentage: item.discountPercentage,
          },
        },
      }));

      const responseData = {
        cart: {
          items: transformedItems,
          totalItems: cart.items?.length || 0,
          itemCount: cart.totalItems || 0,
          totalPrice: cart.totalPrice || 0,
          finalTotal: cart.finalTotal || cart.totalPrice || 0,
          subtotal: cart.subtotal || 0,
          discount: cart.discount || 0,
          couponDiscount: cart.couponDiscount || 0,
          couponCode: cart.couponCode || null,
        },
      };

      return res.status(StatusCodes.OK).json({
        success: true,
        message: "Đã xóa sản phẩm khỏi giỏ hàng",
        data: responseData,
      });
    } catch (error) {
      console.error("❌ Remove item error:", error);
      console.error("❌ Error stack:", error.stack);

      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: error.message || "Lỗi khi xóa sản phẩm",
      });
    }
  }

  /**
   * @route   DELETE /api/cart/clear
   * @desc    Clear entire cart
   * @access  Private (requires auth)
   */
  async clearCart(req, res) {
    try {
      const userId = req.user._id || req.user.id;

      console.log("🧹 Clear cart for user:", userId);

      // Get cart
      const cart = await Cart.findByUserId(userId);

      if (!cart) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: "Không tìm thấy giỏ hàng",
        });
      }

      // Clear cart
      cart.clearCart();
      await cart.save();

      console.log("✅ Cart cleared");

      // Format response
      const formattedCart = cartService.formatCartResponse(cart);

      return res.status(StatusCodes.OK).json({
        success: true,
        message: "Đã xóa toàn bộ giỏ hàng",
        data: formattedCart,
      });
    } catch (error) {
      console.error("❌ Clear cart error:", error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Lỗi khi xóa giỏ hàng",
      });
    }
  }

  /**
   * @route   POST /api/cart/coupon
   * @desc    Apply coupon code
   * @access  Private (requires auth)
   */
  async applyCoupon(req, res) {
    try {
      const userId = req.user._id || req.user.id;
      const { code } = req.body;

      console.log("🎟️ Apply coupon:", { userId, code });

      // Validate code
      if (!code || typeof code !== "string") {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: "Mã giảm giá không hợp lệ",
        });
      }

      // Get cart
      const cart = await Cart.findByUserId(userId);

      if (!cart || cart.totalItems === 0) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: "Giỏ hàng trống",
        });
      }

      // Validate coupon
      const couponValidation = await cartService.validateCoupon(
        code,
        cart.totalPrice
      );

      if (!couponValidation.isValid) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: couponValidation.message,
        });
      }

      // Apply coupon
      cart.applyCoupon(code, couponValidation.discountAmount);
      await cart.save();

      console.log("✅ Coupon applied:", {
        code: cart.couponCode,
        discount: cart.couponDiscount,
        finalTotal: cart.finalTotal,
      });

      // Format response
      const formattedCart = cartService.formatCartResponse(cart);

      return res.status(StatusCodes.OK).json({
        success: true,
        message: couponValidation.message,
        data: formattedCart,
      });
    } catch (error) {
      console.error("❌ Apply coupon error:", error);
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: error.message || "Lỗi khi áp dụng mã giảm giá",
      });
    }
  }

  /**
   * @route   DELETE /api/cart/coupon
   * @desc    Remove coupon code
   * @access  Private (requires auth)
   */
  async removeCoupon(req, res) {
    try {
      const userId = req.user._id || req.user.id;

      console.log("🎟️ Remove coupon for user:", userId);

      // Get cart
      const cart = await Cart.findByUserId(userId);

      if (!cart) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: "Không tìm thấy giỏ hàng",
        });
      }

      // Remove coupon
      cart.removeCoupon();
      await cart.save();

      console.log("✅ Coupon removed");

      // Format response
      const formattedCart = cartService.formatCartResponse(cart);

      return res.status(StatusCodes.OK).json({
        success: true,
        message: "Đã xóa mã giảm giá",
        data: formattedCart,
      });
    } catch (error) {
      console.error("❌ Remove coupon error:", error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Lỗi khi xóa mã giảm giá",
      });
    }
  }

  /**
   * @route   POST /api/cart/sync
   * @desc    Sync cart with latest product data
   * @access  Private (requires auth)
   */
  async syncCart(req, res) {
    try {
      const userId = req.user._id || req.user.id;

      console.log("🔄 Sync cart for user:", userId);

      // Get cart
      const cart = await Cart.findByUserId(userId);

      if (!cart || cart.items.length === 0) {
        return res.status(StatusCodes.OK).json({
          success: true,
          message: "Giỏ hàng trống",
          data: {
            items: [],
            totalItems: 0,
            totalPrice: 0,
            finalTotal: 0,
          },
        });
      }

      let hasChanges = false;
      const itemsToRemove = [];

      // Sync each item with Product Service
      for (const item of cart.items) {
        try {
          // Get latest product data
          const { product, variant } = await cartService.validateVariant(
            item.product.toString(),
            item.variant.variantId.toString()
          );

          // Check if price changed
          const currentPrice = cartService.calculateFinalPrice(
            product.basePrice,
            product.discountPercentage
          );

          if (currentPrice !== item.priceAtAdd) {
            console.log(
              `💰 Price changed for ${item.productName}: ${item.priceAtAdd} → ${currentPrice}`
            );
            item.priceAtAdd = currentPrice;
            item.subtotal = Math.round(
              currentPrice * item.quantity * (1 - item.discountPercentage / 100)
            );
            hasChanges = true;
          }

          // Check if stock changed
          if (variant.stock < item.quantity) {
            console.log(
              `📦 Stock changed for ${item.productName}: ${item.quantity} → ${variant.stock}`
            );

            if (variant.stock === 0) {
              // Out of stock - remove item
              itemsToRemove.push(item._id);
            } else {
              // Update to available stock
              item.quantity = variant.stock;
              item.subtotal = Math.round(
                item.priceAtAdd *
                  variant.stock *
                  (1 - item.discountPercentage / 100)
              );
            }
            hasChanges = true;
          }

          // Update variant info
          item.variant.stock = variant.stock;
          item.variant.price = currentPrice;
        } catch (error) {
          console.error(
            `❌ Error syncing item ${item.productName}:`,
            error.message
          );
          // Remove item if product/variant no longer exists
          if (error.message.includes("không tồn tại")) {
            itemsToRemove.push(item._id);
            hasChanges = true;
          }
        }
      }

      // Remove items that are out of stock or deleted
      for (const itemId of itemsToRemove) {
        cart.removeItem(itemId);
      }

      // Save if there are changes
      if (hasChanges) {
        await cart.save();
        console.log("✅ Cart synced with changes");
      } else {
        console.log("✅ Cart already up to date");
      }

      // Format response
      const formattedCart = cartService.formatCartResponse(cart);

      return res.status(StatusCodes.OK).json({
        success: true,
        message: hasChanges ? "Đã cập nhật giỏ hàng" : "Giỏ hàng đã cập nhật",
        data: formattedCart,
        changes: {
          hasChanges,
          removedItems: itemsToRemove.length,
        },
      });
    } catch (error) {
      console.error("❌ Sync cart error:", error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Lỗi khi đồng bộ giỏ hàng",
      });
    }
  }

  /**
   * @route   GET /api/cart/validate
   * @desc    Validate cart before checkout
   * @access  Private (requires auth)
   */
  async validateCart(req, res) {
    try {
      const userId = req.user._id || req.user.id;

      console.log("✅ Validate cart for user:", userId);

      // Get cart
      const cart = await Cart.findByUserId(userId);

      if (!cart || cart.items.length === 0) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: "Giỏ hàng trống",
        });
      }

      const errors = [];

      // Validate each item
      for (const item of cart.items) {
        try {
          const { variant } = await cartService.validateVariant(
            item.product.toString(),
            item.variant.variantId.toString()
          );

          // Check stock
          if (variant.stock < item.quantity) {
            errors.push({
              itemId: item._id,
              productName: item.productName,
              error: `Chỉ còn ${variant.stock} sản phẩm`,
              availableStock: variant.stock,
            });
          }
        } catch (error) {
          errors.push({
            itemId: item._id,
            productName: item.productName,
            error: "Sản phẩm không còn tồn tại",
          });
        }
      }

      const isValid = errors.length === 0;

      return res.status(StatusCodes.OK).json({
        success: true,
        data: {
          isValid,
          errors,
          cart: isValid ? cartService.formatCartResponse(cart) : null,
        },
      });
    } catch (error) {
      console.error("❌ Validate cart error:", error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Lỗi khi kiểm tra giỏ hàng",
      });
    }
  }
}

module.exports = new CartController();
