// const axios = require("axios");
// const config = require("../config/config");

// class CartService {
//   /**
//    * ✅ Lấy thông tin sản phẩm từ Product Service
//    */
//   async getProductInfo(productId) {
//     try {
//       const url = `${config.PRODUCT_SERVICE_URL}/api/product/id/${productId}`;

//       console.log("🔍 Fetching product from Product Service:", productId);
//       console.log("🔍 URL:", url);

//       const response = await axios.get(url, {
//         timeout: 5000,
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });

//       console.log("✅ Product found:", response.data?.data?.name);

//       return response.data?.data || response.data;
//     } catch (error) {
//       console.error("❌ Error fetching product:", error.message);
//       console.error("❌ Response:", error.response?.data);

//       if (error.response?.status === 404) {
//         throw new Error("Sản phẩm không tồn tại");
//       }

//       if (error.code === "ECONNREFUSED") {
//         throw new Error(
//           "Product Service không hoạt động. Vui lòng kiểm tra service đang chạy chưa."
//         );
//       }

//       throw new Error("Không thể kết nối đến Product Service");
//     }
//   }

//   /**
//    * ✅ Lấy thông tin variant từ Product Service
//    */
//   async getVariantInfo(variantId) {
//     try {
//       const url = `${config.PRODUCT_SERVICE_URL}/api/product/variant/${variantId}`;

//       console.log("🔍 Fetching variant from Product Service:", variantId);
//       console.log("🔍 URL:", url);

//       const response = await axios.get(url, {
//         timeout: 5000,
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });

//       console.log("✅ Variant found");

//       return response.data?.data || response.data;
//     } catch (error) {
//       console.error("❌ Error fetching variant:", error.message);
//       console.error("❌ Response:", error.response?.data);

//       if (error.response?.status === 404) {
//         throw new Error("Phiên bản sản phẩm không tồn tại");
//       }

//       throw new Error("Không thể kết nối đến Product Service");
//     }
//   }

//   /**
//    * ✅ Validate variant
//    */
//   async validateVariant(productId, variantId) {
//     try {
//       console.log("🔍 Validating variant:", { productId, variantId });

//       const [product, variant] = await Promise.all([
//         this.getProductInfo(productId),
//         this.getVariantInfo(variantId),
//       ]);

//       if (!product) {
//         throw new Error("Sản phẩm không tồn tại");
//       }

//       if (!variant) {
//         throw new Error("Phiên bản sản phẩm không tồn tại");
//       }

//       const variantProductId = variant.productId || variant.product?._id || variant.product;

//       if (variantProductId && String(variantProductId) !== String(productId)) {
//         console.error("❌ Variant mismatch:", {
//           variantProductId,
//           expectedProductId: productId,
//         });
//         throw new Error("Phiên bản sản phẩm không khớp với sản phẩm");
//       }

//       if (variant.stock !== undefined && variant.stock <= 0) {
//         throw new Error("Sản phẩm đã hết hàng");
//       }

//       console.log("✅ Validation passed");

//       return { product, variant };
//     } catch (error) {
//       console.error("❌ Validate variant error:", error.message);
//       throw error;
//     }
//   }

//   /**
//    * Check stock availability
//    */
//   checkStock(variant, requestedQuantity) {
//     const availableStock = variant.stock || 0;

//     if (availableStock === 0) {
//       throw new Error("Sản phẩm đã hết hàng");
//     }

//     if (availableStock < requestedQuantity) {
//       throw new Error(`Chỉ còn ${availableStock} sản phẩm trong kho`);
//     }

//     return true;
//   }

//   /**
//    * Calculate final price after discount
//    */
//   calculateFinalPrice(basePrice, discountPercentage = 0) {
//     const discount = (basePrice * discountPercentage) / 100;
//     return Math.round(basePrice - discount);
//   }

//   /**
//    * ✅ Build cart item data - THÊM ĐẦY ĐỦ FIELDS
//    */
//   buildCartItemData(product, variant, quantity) {
//     // ✅ Tính giá cuối cùng sau discount
//     const variantPrice = variant.price || product.basePrice || 0;
//     const discountPercentage = product.discountPercentage || 0;
//     const finalPrice = this.calculateFinalPrice(variantPrice, discountPercentage);

//     // ✅ Tính subtotal
//     const subtotal = finalPrice * quantity;

//     // ✅ Tạo SKU (nếu chưa có)
//     const colorName = variant.colorId?.name || 'default';
//     const memoryRam = variant.memoryId?.ram || '0GB';
//     const memoryRom = variant.memoryId?.rom || '0GB';
//     const sku = `${product.slug || product.name}-${colorName}-${memoryRam}-${memoryRom}`.toLowerCase().replace(/\s+/g, '-');

//     // ✅ Return ĐẦY ĐỦ FIELDS theo Cart Model yêu cầu
//     return {
//       // ✅ Product info (REQUIRED)
//       product: product._id,
//       productName: product.name,
//       productSlug: product.slug,
//       productImage: product.thumbUrl || "",

//       // ✅ Variant info (REQUIRED)
//       variant: {
//         variantId: variant._id,
//         sku: sku,
//         price: variantPrice,
//         colorName: colorName,
//         memorySize: `${memoryRam}/${memoryRom}`,
//         stock: variant.stock || 0,
//       },

//       // ✅ Pricing (REQUIRED)
//       quantity: quantity,
//       priceAtAdd: finalPrice,
//       discountPercentage: discountPercentage,
//       subtotal: subtotal,

//       // ✅ Optional fields
//       image: product.thumbUrl || "",
//       inStock: variant.stock > 0,
//       maxQuantity: variant.stock,
//     };
//   }

//   /**
//    * Validate add to cart request
//    */
//   validateAddToCartRequest(data) {
//     const { productId, variantId, quantity } = data;

//     if (!productId || !variantId) {
//       throw new Error("Thiếu thông tin sản phẩm");
//     }

//     if (!quantity || quantity < 1) {
//       throw new Error("Số lượng không hợp lệ");
//     }

//     if (quantity > 10) {
//       throw new Error("Số lượng tối đa là 10 sản phẩm");
//     }

//     return { productId, variantId, quantity };
//   }

//   /**
//    * Format cart response
//    */
//   formatCartResponse(cart) {
//     return {
//       items: cart.items || [],
//       totalItems: cart.totalItems || 0,
//       totalPrice: cart.totalPrice || 0,
//       finalTotal: cart.finalTotal || cart.totalPrice || 0,
//       couponDiscount: cart.couponDiscount || 0,
//       couponCode: cart.couponCode || null,
//     };
//   }

//   /**
//    * Can add more items to cart
//    */
//   canAddMoreItems(cart, maxItems) {
//     if (cart.items.length >= maxItems) {
//       throw new Error(`Giỏ hàng chỉ cho phép tối đa ${maxItems} sản phẩm`);
//     }
//     return true;
//   }

//   /**
//    * Validate coupon
//    */
//   async validateCoupon(code, totalPrice) {
//     return {
//       isValid: false,
//       message: "Mã giảm giá không hợp lệ",
//       discountAmount: 0,
//     };
//   }
// }

// module.exports = new CartService();

const axios = require("axios");
const config = require("../config/config");

class CartService {
  /**
   * ✅ Lấy thông tin sản phẩm từ Product Service
   */
  async getProductInfo(productId) {
    try {
      const url = `${config.PRODUCT_SERVICE_URL}/api/product/id/${productId}`;

      console.log("🔍 Fetching product from Product Service:", productId);
      console.log("🔍 URL:", url);

      const response = await axios.get(url, {
        timeout: 5000,
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("✅ Product found:", response.data?.data?.name);

      return response.data?.data || response.data;
    } catch (error) {
      console.error("❌ Error fetching product:", error.message);
      console.error("❌ Response:", error.response?.data);

      if (error.response?.status === 404) {
        throw new Error("Sản phẩm không tồn tại");
      }

      if (error.code === "ECONNREFUSED") {
        throw new Error(
          "Product Service không hoạt động. Vui lòng kiểm tra service đang chạy chưa."
        );
      }

      throw new Error("Không thể kết nối đến Product Service");
    }
  }

  /**
   * ✅ Lấy thông tin variant từ Product Service
   */
  async getVariantInfo(variantId) {
    try {
      const url = `${config.PRODUCT_SERVICE_URL}/api/product/variant/${variantId}`;

      console.log("🔍 Fetching variant from Product Service:", variantId);
      console.log("🔍 URL:", url);

      const response = await axios.get(url, {
        timeout: 5000,
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("✅ Variant found");

      return response.data?.data || response.data;
    } catch (error) {
      console.error("❌ Error fetching variant:", error.message);
      console.error("❌ Response:", error.response?.data);

      if (error.response?.status === 404) {
        throw new Error("Phiên bản sản phẩm không tồn tại");
      }

      throw new Error("Không thể kết nối đến Product Service");
    }
  }

  /**
   * ✅ Validate variant
   */
  async validateVariant(productId, variantId) {
    try {
      console.log("🔍 Validating variant:", { productId, variantId });

      const [product, variant] = await Promise.all([
        this.getProductInfo(productId),
        this.getVariantInfo(variantId),
      ]);

      if (!product) {
        throw new Error("Sản phẩm không tồn tại");
      }

      if (!variant) {
        throw new Error("Phiên bản sản phẩm không tồn tại");
      }

      const variantProductId =
        variant.productId || variant.product?._id || variant.product;

      if (variantProductId && String(variantProductId) !== String(productId)) {
        console.error("❌ Variant mismatch:", {
          variantProductId,
          expectedProductId: productId,
        });
        throw new Error("Phiên bản sản phẩm không khớp với sản phẩm");
      }

      if (variant.stock !== undefined && variant.stock <= 0) {
        throw new Error("Sản phẩm đã hết hàng");
      }

      console.log("✅ Validation passed");

      return { product, variant };
    } catch (error) {
      console.error("❌ Validate variant error:", error.message);
      throw error;
    }
  }

  /**
   * Check stock availability
   */
  checkStock(variant, requestedQuantity) {
    const availableStock = variant.stock || 0;

    if (availableStock === 0) {
      throw new Error("Sản phẩm đã hết hàng");
    }

    if (availableStock < requestedQuantity) {
      throw new Error(`Chỉ còn ${availableStock} sản phẩm trong kho`);
    }

    return true;
  }

  /**
   * Calculate final price after discount
   */
  calculateFinalPrice(basePrice, discountPercentage = 0) {
    const discount = (basePrice * discountPercentage) / 100;
    return Math.round(basePrice - discount);
  }

  /**
   * ✅ Build cart item data - MATCH CHÍNH XÁC CART MODEL
   */
  buildCartItemData(product, variant, quantity) {
    // ✅ Lấy thông tin color và memory từ variant
    const colorId = variant.colorId || variant.color;
    const memoryId = variant.memoryId || variant.memory;

    // ✅ Tính giá cuối cùng sau discount
    const variantPrice = variant.price || product.basePrice || 0;
    const discountPercentage = product.discountPercentage || 0;
    const finalPrice = this.calculateFinalPrice(
      variantPrice,
      discountPercentage
    );

    // ✅ Tính subtotal (đã bao gồm discount)
    const subtotal = Math.round(finalPrice * quantity);

    // ✅ Tạo SKU
    const colorName = colorId?.name || "default";
    const memoryRam = memoryId?.ram || "0GB";
    const memoryRom = memoryId?.rom || "0GB";
    const sku = `${
      product.slug || product.name
    }-${colorName}-${memoryRam}-${memoryRom}`
      .toLowerCase()
      .replace(/\s+/g, "-");

    console.log("🔧 Building cart item:", {
      productName: product.name,
      variantPrice,
      discountPercentage,
      finalPrice,
      quantity,
      subtotal,
    });

    // ✅ Return ĐÚNG STRUCTURE của Cart Model
    return {
      // ========== PRODUCT INFO ==========
      product: product._id,
      productName: product.name,
      productSlug: product.slug,
      thumbUrl: product.thumbUrl || "",

      // ========== VARIANT INFO (MATCH CART MODEL) ==========
      variant: {
        variantId: variant._id,
        color: colorId
          ? {
              id: colorId._id || colorId.id,
              name: colorId.name,
              code: colorId.hexCode || colorId.code || "",
            }
          : undefined,
        memory: memoryId
          ? {
              id: memoryId._id || memoryId.id,
              ram: memoryId.ram,
              rom: memoryId.rom,
            }
          : undefined,
        sku: sku,
        price: variantPrice,
        stock: variant.stock || 0,
      },

      // ========== QUANTITY & PRICING ==========
      quantity: quantity,
      priceAtAdd: finalPrice,
      discountPercentage: discountPercentage,
      subtotal: subtotal,
    };
  }

  /**
   * Validate add to cart request
   */
  validateAddToCartRequest(data) {
    const { productId, variantId, quantity } = data;

    if (!productId || !variantId) {
      throw new Error("Thiếu thông tin sản phẩm");
    }

    if (!quantity || quantity < 1) {
      throw new Error("Số lượng không hợp lệ");
    }

    if (quantity > 10) {
      throw new Error("Số lượng tối đa là 10 sản phẩm");
    }

    return { productId, variantId, quantity };
  }

  /**
   * Format cart response
   */
  formatCartResponse(cart) {
    return {
      items: cart.items || [],
      totalItems: cart.totalItems || 0,
      totalPrice: cart.totalPrice || 0,
      finalTotal: cart.finalTotal || cart.totalPrice || 0,
      couponDiscount: cart.couponDiscount || 0,
      couponCode: cart.couponCode || null,
    };
  }

  /**
   * Can add more items to cart
   */
  canAddMoreItems(cart, maxItems) {
    if (cart.items.length >= maxItems) {
      throw new Error(`Giỏ hàng chỉ cho phép tối đa ${maxItems} sản phẩm`);
    }
    return true;
  }

  /**
   * Validate coupon
   */
  async validateCoupon(code, totalPrice) {
    return {
      isValid: false,
      message: "Mã giảm giá không hợp lệ",
      discountAmount: 0,
    };
  }
}

module.exports = new CartService();
