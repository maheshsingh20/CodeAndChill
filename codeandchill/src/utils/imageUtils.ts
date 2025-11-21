/**
 * Utility functions for handling image URLs
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

/**
 * Converts a relative profile picture URL to an absolute URL
 * @param url - The profile picture URL (can be relative or absolute)
 * @returns Absolute URL for the profile picture
 */
export function getAbsoluteImageUrl(url: string | undefined | null): string {
  if (!url) {
    return "https://github.com/shadcn.png"; // Default avatar
  }
  
  // If already absolute URL, return as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // Convert relative URL to absolute
  return `${API_BASE_URL}${url}`;
}

/**
 * Validates if a file is an image
 * @param file - The file to validate
 * @returns true if the file is an image
 */
export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/');
}

/**
 * Validates image file size
 * @param file - The file to validate
 * @param maxSizeMB - Maximum size in megabytes (default: 5MB)
 * @returns true if the file size is within the limit
 */
export function isValidImageSize(file: File, maxSizeMB: number = 5): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
}

/**
 * Creates a preview URL for an image file
 * @param file - The image file
 * @returns Promise that resolves to a data URL
 */
export function createImagePreview(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
