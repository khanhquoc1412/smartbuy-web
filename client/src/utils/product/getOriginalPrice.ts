// Tính giá gốc từ giá giảm
export const getOriginalPrice = (
  discountedPrice: number,
  discountPercentage: number
): number => {
  if (discountPercentage <= 0) {
    return discountedPrice;
  }

  // Công thức: discountedPrice = originalPrice * (1 - discount/100)
  // => originalPrice = discountedPrice / (1 - discount/100)
  const originalPrice = discountedPrice / (1 - discountPercentage / 100);

  return Math.round(originalPrice);
};
