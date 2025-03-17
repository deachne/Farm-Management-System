/**
 * Multi-Modal UI Components Index
 * 
 * This file exports all the multi-modal UI components that are part of
 * the BizzyPerson core. These components provide a unified interface for
 * handling various media types within the application.
 */

// Core components
export * from './MediaRenderer';
export * from './MediaInput';
export * from './MediaGallery';
export * from './MediaSelector';

// Input-specific components
export * from './inputs/FileUpload';
export * from './inputs/AudioRecorder';
export * from './inputs/CameraCapture';

// Display-specific components
export * from './displays/ImageDisplay';
export * from './displays/VideoDisplay';
export * from './displays/AudioDisplay';
export * from './displays/DocumentDisplay';

// Integration utilities
export * from './utils/mediaTypeDetection';
export * from './utils/mediaProcessing';
export * from './integration/artifactIntegration'; 