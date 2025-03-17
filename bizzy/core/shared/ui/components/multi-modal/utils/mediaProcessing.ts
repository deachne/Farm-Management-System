/**
 * Media Processing Utility
 * 
 * Provides functions for processing and optimizing different types of media
 * files before they are displayed or sent to the server.
 */

import { MediaType } from './mediaTypeDetection';

/**
 * Options for image processing
 */
export interface ImageProcessingOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  preserveAspectRatio?: boolean;
}

/**
 * Processes an image file to optimize it for upload or display
 * 
 * @param imageFile The original image file
 * @param options Processing options
 * @returns A promise that resolves to the processed image as a Blob
 */
export async function processImage(
  imageFile: File, 
  options: ImageProcessingOptions = {}
): Promise<Blob> {
  const {
    maxWidth = 1200,
    maxHeight = 1200,
    quality = 0.85,
    preserveAspectRatio = true
  } = options;
  
  // Create a new promise that wraps the image processing
  return new Promise((resolve, reject) => {
    // Create an image element to load the file
    const img = new Image();
    img.onload = () => {
      // Calculate the new dimensions
      let width = img.width;
      let height = img.height;
      
      // Resize if needed while preserving aspect ratio
      if (preserveAspectRatio) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      } else {
        width = Math.min(width, maxWidth);
        height = Math.min(height, maxHeight);
      }
      
      // Create a canvas to draw the resized image
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      
      // Draw the image on the canvas
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }
      
      ctx.drawImage(img, 0, 0, width, height);
      
      // Convert the canvas to a blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to convert canvas to blob'));
          }
        },
        'image/jpeg',
        quality
      );
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    
    // Load the image from the file
    img.src = URL.createObjectURL(imageFile);
  });
}

/**
 * Media file with processed data
 */
export interface ProcessedMediaFile {
  originalFile: File;
  processedBlob?: Blob;
  previewUrl?: string;
  mediaType: MediaType;
  dimensions?: {
    width: number;
    height: number;
  };
}

/**
 * Creates a processed media file object with preview URL
 * 
 * @param file The original file
 * @param mediaType The media type
 * @param processedBlob Optional processed blob
 * @returns ProcessedMediaFile object
 */
export function createProcessedMediaFile(
  file: File,
  mediaType: MediaType,
  processedBlob?: Blob
): ProcessedMediaFile {
  const blob = processedBlob || file;
  const previewUrl = URL.createObjectURL(blob);
  
  return {
    originalFile: file,
    processedBlob: processedBlob,
    previewUrl,
    mediaType
  };
}

/**
 * Adds image dimensions to a processed media file
 * 
 * @param processedFile The processed media file
 * @returns Promise that resolves to the processed file with dimensions
 */
export async function addImageDimensions(
  processedFile: ProcessedMediaFile
): Promise<ProcessedMediaFile> {
  if (processedFile.mediaType !== MediaType.IMAGE) {
    return processedFile;
  }
  
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        ...processedFile,
        dimensions: {
          width: img.width,
          height: img.height
        }
      });
      URL.revokeObjectURL(img.src);
    };
    
    img.onerror = () => {
      resolve(processedFile);
      URL.revokeObjectURL(img.src);
    };
    
    img.src = processedFile.previewUrl || URL.createObjectURL(processedFile.originalFile);
  });
}

/**
 * Optimizes a media file based on its type
 * 
 * @param file The original file
 * @param mediaType The media type
 * @returns Promise that resolves to the processed media file
 */
export async function optimizeMediaFile(
  file: File,
  mediaType: MediaType
): Promise<ProcessedMediaFile> {
  // Process based on media type
  if (mediaType === MediaType.IMAGE) {
    try {
      // Process the image
      const processedBlob = await processImage(file);
      
      // Create the processed media file
      const processedFile = createProcessedMediaFile(file, mediaType, processedBlob);
      
      // Add image dimensions
      return await addImageDimensions(processedFile);
    } catch (error) {
      console.error('Failed to process image:', error);
      // Fall back to the original file
      return createProcessedMediaFile(file, mediaType);
    }
  }
  
  // For other media types, just create a processed file with the original
  return createProcessedMediaFile(file, mediaType);
} 