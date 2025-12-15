/**
 * Calculate discounted price from original price and discount percentage
 * @param originalPrice - The original price before discount
 * @param discountPercentage - Discount percentage (0-100)
 * @returns The price after applying discount
 */
export const getDiscountedPrice = (
  originalPrice: number,
  discountPercentage: number
): number => {
  if (discountPercentage <= 0) return originalPrice;
  return Math.round(originalPrice * (1 - discountPercentage / 100));
};
