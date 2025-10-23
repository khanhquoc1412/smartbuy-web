/**
 * Image URL Utility
 * Convert relative image paths to full URLs for display
 */

/**
 * Convert relative image path to full URL
 * @param imageUrl - Image URL (can be relative or absolute)
 * @returns Full URL for displaying image
 * 
 * @example
 * getImageUrl('/uploads/1761119443683-914560194.png')
 * // => '/uploads/1761119443683-914560194.png' (Vite proxy will handle it)
 * 
 * getImageUrl('http://example.com/image.png')
 * // => 'http://example.com/image.png' (unchanged)
 */
export const getImageUrl = (imageUrl: string | undefined | null): string => {
  if (!imageUrl) return ''
  
  // If already absolute URL, return as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl
  }
  
  // For relative paths (including /uploads/), return as is
  // Vite dev server proxy will forward /uploads/* to localhost:5002
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
