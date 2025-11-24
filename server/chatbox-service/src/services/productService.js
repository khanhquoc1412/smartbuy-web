const axios = require('axios');

const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || 'http://localhost:5002';

/**
 * Search products by category and price range
 * @param {Object} filters - Search filters
 * @returns {Promise<Array>} List of products
 */
exports.searchProducts = async (filters) => {
  try {
    const { category, priceRange, brand, limit = 5 } = filters;

    const params = {
      limit,
      ...(category && { category }),
      ...(priceRange && { priceRange }),
      ...(brand && { brand })
    };

    const response = await axios.get(`${PRODUCT_SERVICE_URL}/api/products/search`, {
      params,
      timeout: 5000
    });

    return response.data?.data?.products || [];
  } catch (error) {
    console.error('Error searching products:', error.message);
    return [];
  }
};

/**
 * Search products by brand
 * @param {Object} filters - Search filters
 * @returns {Promise<Array>} List of products
 */
exports.searchProductsByBrand = async (filters) => {
  try {
    const { brand, category, limit = 5 } = filters;

    const params = {
      limit,
      brand,
      ...(category && { category })
    };

    const response = await axios.get(`${PRODUCT_SERVICE_URL}/api/products/search`, {
      params,
      timeout: 5000
    });

    return response.data?.data?.products || [];
  } catch (error) {
    console.error('Error searching products by brand:', error.message);
    return [];
  }
};

/**
 * Search products by price range
 * @param {Object} filters - Price filters
 * @returns {Promise<Array>} List of products
 */
exports.searchProductsByPrice = async (filters) => {
  try {
    const { minPrice, maxPrice, category, brand, limit = 5 } = filters;

    const params = {
      limit,
      minPrice,
      maxPrice,
      ...(category && { category }),
      ...(brand && { brand })
    };

    const response = await axios.get(`${PRODUCT_SERVICE_URL}/api/products/search`, {
      params,
      timeout: 5000
    });

    return response.data?.data?.products || [];
  } catch (error) {
    console.error('Error searching products by price:', error.message);
    return [];
  }
};

/**
 * Search products by color
 * @param {Object} filters - Color filters
 * @returns {Promise<Array>} List of products
 */
exports.searchProductsByColor = async (filters) => {
  try {
    const { color, brand, priceRange, category, limit = 5 } = filters;

    const params = {
      limit,
      color,
      ...(brand && { brand }),
      ...(priceRange && { priceRange }),
      ...(category && { category })
    };

    const response = await axios.get(`${PRODUCT_SERVICE_URL}/api/products/search`, {
      params,
      timeout: 5000
    });

    return response.data?.data?.products || [];
  } catch (error) {
    console.error('Error searching products by color:', error.message);
    return [];
  }
};

/**
 * Search products by memory capacity
 * @param {Object} filters - Memory filters
 * @returns {Promise<Array>} List of products
 */
exports.searchProductsByMemory = async (filters) => {
  try {
    const { memory, brand, priceRange, category, limit = 5 } = filters;

    const params = {
      limit,
      memory,
      ...(brand && { brand }),
      ...(priceRange && { priceRange }),
      ...(category && { category })
    };

    const response = await axios.get(`${PRODUCT_SERVICE_URL}/api/products/search`, {
      params,
      timeout: 5000
    });

    return response.data?.data?.products || [];
  } catch (error) {
    console.error('Error searching products by memory:', error.message);
    return [];
  }
};

/**
 * Get product by name
 * @param {String} productName - Product name
 * @returns {Promise<Object|null>} Product details
 */
exports.getProductByName = async (productName) => {
  try {
    const response = await axios.get(`${PRODUCT_SERVICE_URL}/api/products/search`, {
      params: {
        keyword: productName,
        limit: 1
      },
      timeout: 5000
    });

    const products = response.data?.data?.products || [];
    return products[0] || null;
  } catch (error) {
    console.error('Error getting product by name:', error.message);
    return null;
  }
};

/**
 * Get product by ID
 * @param {String} productId - Product ID
 * @returns {Promise<Object|null>} Product details
 */
exports.getProductById = async (productId) => {
  try {
    const response = await axios.get(`${PRODUCT_SERVICE_URL}/api/products/${productId}`, {
      timeout: 5000
    });

    return response.data?.data || null;
  } catch (error) {
    console.error('Error getting product by ID:', error.message);
    return null;
  }
};

/**
 * Get featured products
 * @param {Number} limit - Number of products to return
 * @returns {Promise<Array>} List of featured products
 */
exports.getFeaturedProducts = async (limit = 5) => {
  try {
    const response = await axios.get(`${PRODUCT_SERVICE_URL}/api/products/featured`, {
      params: { limit },
      timeout: 5000
    });

    return response.data?.data || [];
  } catch (error) {
    console.error('Error getting featured products:', error.message);
    return [];
  }
};
