/**
 * Image Utility Module
 * 
 * This module provides utility functions for processing images,
 * such as getting image dimensions and optimizing images.
 */

const sharp = require('sharp');

/**
 * Get image dimensions from buffer
 * 
 * @param {Buffer} buffer - Image buffer
 * @returns {Promise<{width: number, height: number}>} Image dimensions
 */
async function getImageDimensions(buffer) {
  try {
    const metadata = await sharp(buffer).metadata();
    return {
      width: metadata.width,
      height: metadata.height
    };
  } catch (error) {
    console.error('Error getting image dimensions:', error);
    throw error;
  }
}

/**
 * Optimize image for web
 * 
 * @param {Buffer} buffer - Image buffer
 * @param {Object} options - Optimization options
 * @param {number} options.width - Target width
 * @param {number} options.height - Target height
 * @param {number} options.quality - JPEG quality (1-100)
 * @param {boolean} options.webp - Convert to WebP format
 * @returns {Promise<Buffer>} Optimized image buffer
 */
async function optimizeImage(buffer, options = {}) {
  try {
    const {
      width,
      height,
      quality = 80,
      webp = false
    } = options;
    
    let image = sharp(buffer);
    
    // Resize if width or height is specified
    if (width || height) {
      image = image.resize({
        width,
        height,
        fit: 'inside',
        withoutEnlargement: true
      });
    }
    
    // Convert to WebP if specified
    if (webp) {
      image = image.webp({ quality });
    } else {
      // Otherwise optimize based on original format
      image = image.jpeg({ quality });
    }
    
    return await image.toBuffer();
  } catch (error) {
    console.error('Error optimizing image:', error);
    throw error;
  }
}

/**
 * Generate thumbnail from image
 * 
 * @param {Buffer} buffer - Image buffer
 * @param {Object} options - Thumbnail options
 * @param {number} options.width - Thumbnail width
 * @param {number} options.height - Thumbnail height
 * @param {string} options.fit - Fit method (cover, contain, fill, inside, outside)
 * @returns {Promise<Buffer>} Thumbnail buffer
 */
async function generateThumbnail(buffer, options = {}) {
  try {
    const {
      width = 200,
      height = 200,
      fit = 'cover'
    } = options;
    
    return await sharp(buffer)
      .resize({
        width,
        height,
        fit
      })
      .jpeg({ quality: 80 })
      .toBuffer();
  } catch (error) {
    console.error('Error generating thumbnail:', error);
    throw error;
  }
}

module.exports = {
  getImageDimensions,
  optimizeImage,
  generateThumbnail
}; 