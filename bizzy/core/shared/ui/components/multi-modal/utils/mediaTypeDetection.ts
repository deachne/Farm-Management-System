/**
 * Media Type Detection Utility
 * 
 * Provides functions for detecting and validating different types of media
 * files. This is used across the multi-modal components to ensure proper
 * handling of various media formats.
 */

/**
 * Media type categories
 */
export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  DOCUMENT = 'document',
  UNKNOWN = 'unknown'
}

/**
 * Media file information
 */
export interface MediaFileInfo {
  type: MediaType;
  mimeType: string;
  extension: string;
  isSupported: boolean;
}

/**
 * Maps file extensions to media types
 */
const EXTENSION_MAP: Record<string, MediaType> = {
  // Images
  jpg: MediaType.IMAGE,
  jpeg: MediaType.IMAGE,
  png: MediaType.IMAGE,
  gif: MediaType.IMAGE,
  webp: MediaType.IMAGE,
  svg: MediaType.IMAGE,
  
  // Videos
  mp4: MediaType.VIDEO,
  webm: MediaType.VIDEO,
  ogg: MediaType.VIDEO,
  mov: MediaType.VIDEO,
  
  // Audio
  mp3: MediaType.AUDIO,
  wav: MediaType.AUDIO,
  aac: MediaType.AUDIO,
  
  // Documents
  pdf: MediaType.DOCUMENT,
  doc: MediaType.DOCUMENT,
  docx: MediaType.DOCUMENT,
  xls: MediaType.DOCUMENT,
  xlsx: MediaType.DOCUMENT,
  ppt: MediaType.DOCUMENT,
  pptx: MediaType.DOCUMENT,
  txt: MediaType.DOCUMENT,
  csv: MediaType.DOCUMENT
};

/**
 * Supported mime types for each media type
 */
const SUPPORTED_MIME_TYPES: Record<MediaType, string[]> = {
  [MediaType.IMAGE]: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
  [MediaType.VIDEO]: ['video/mp4', 'video/webm', 'video/ogg'],
  [MediaType.AUDIO]: ['audio/mpeg', 'audio/wav', 'audio/aac'],
  [MediaType.DOCUMENT]: [
    'application/pdf', 
    'application/msword', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'text/csv'
  ],
  [MediaType.UNKNOWN]: []
};

/**
 * Gets the file extension from a filename
 */
export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || '';
}

/**
 * Detects the media type from a file object
 */
export function detectMediaType(file: File): MediaFileInfo {
  const extension = getFileExtension(file.name);
  const mimeType = file.type;
  
  // Try to determine the media type from the MIME type
  let type = Object.keys(MediaType).find(key => 
    mimeType.startsWith(MediaType[key as keyof typeof MediaType])
  );
  
  // If not found by MIME type, try the extension
  if (!type && EXTENSION_MAP[extension]) {
    type = EXTENSION_MAP[extension];
  } else {
    type = MediaType.UNKNOWN;
  }
  
  // Check if this media type and MIME type combination is supported
  const mediaType = type as MediaType;
  const isSupported = SUPPORTED_MIME_TYPES[mediaType]?.includes(mimeType) || false;
  
  return {
    type: mediaType,
    mimeType,
    extension,
    isSupported
  };
}

/**
 * Checks if a file is an image
 */
export function isImage(file: File): boolean {
  const { type } = detectMediaType(file);
  return type === MediaType.IMAGE;
}

/**
 * Checks if a file is a video
 */
export function isVideo(file: File): boolean {
  const { type } = detectMediaType(file);
  return type === MediaType.VIDEO;
}

/**
 * Checks if a file is audio
 */
export function isAudio(file: File): boolean {
  const { type } = detectMediaType(file);
  return type === MediaType.AUDIO;
}

/**
 * Checks if a file is a document
 */
export function isDocument(file: File): boolean {
  const { type } = detectMediaType(file);
  return type === MediaType.DOCUMENT;
}

/**
 * Gets all supported MIME types for file input accept attribute
 */
export function getSupportedMimeTypes(): string {
  return Object.values(SUPPORTED_MIME_TYPES)
    .flat()
    .join(',');
}

/**
 * Gets supported MIME types for a specific media type
 */
export function getSupportedMimeTypesForType(type: MediaType): string {
  return SUPPORTED_MIME_TYPES[type].join(',');
} 