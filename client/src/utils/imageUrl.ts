/**
 * Image URL Utility
 * Convert relative image paths to full URLs for display
 */

/**
 * Convert relative image path to full URL
 * @param imageUrl - Image URL (can be relative or absolute)
 * @returns Full URL for displaying image
 * 
 * ✅ UPDATED: No transformation needed - Docker volume mapping handles /src/assets/
 * Images are now served directly from mounted source directory
 */
export const getImageUrl = (imageUrl: string | undefined | null): string => {
  if (!imageUrl) return ''
  
  // Return as-is - Docker volume mapping serves /src/assets/ directly
  return imageUrl
}

/**
 * Check if image URL is a relative path
 * @param imageUrl - Image URL to check
 * @returns true if relative path, false if absolute URL
 */
export const isRelativePath = (imageUrl: string | undefined | null): boolean => {
  if (!imageUrl) return false
  return !imageUrl.startsWith('http://') && !imageUrl.startsWith('https://')
}

/**
 * Extract filename from image URL (works with both relative and absolute paths)
 * @param imageUrl - Image URL
 * @returns Filename only
 * 
 * @example
 * getFilename('/uploads/1761119443683-914560194.png')
 * // => '1761119443683-914560194.png'
 */
export const getFilename = (imageUrl: string | undefined | null): string => {
  if (!imageUrl) return ''
  const parts = imageUrl.split('/')
  return parts[parts.length - 1]
}
