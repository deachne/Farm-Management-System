import React, { useState } from 'react';

interface ImageArtifactProps {
  imagePath: string;
  altText?: string;
  width?: number;
  height?: number;
  isExpanded?: boolean;
  onSave?: (artifactData: any) => void;
}

/**
 * Component for rendering image artifacts
 * Provides image display with download, full-screen view, and saving capabilities
 */
const ImageArtifact: React.FC<ImageArtifactProps> = ({
  imagePath,
  altText = 'Generated image',
  width,
  height,
  isExpanded = true,
  onSave
}) => {
  const [expanded, setExpanded] = useState(isExpanded);
  const [fullscreen, setFullscreen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if the image is a base64 encoded string
  const isBase64Image = imagePath.startsWith('data:image');
  
  // Extract filename from path for download
  const filename = altText || imagePath.split('/').pop() || 'generated-image.png';

  // Handle saving/downloading the image
  const handleSave = () => {
    if (onSave) {
      onSave({
        type: 'image',
        path: imagePath,
        altText,
        dimensions: { width, height },
        timestamp: new Date().toISOString()
      });
    } else {
      // If no save handler is provided, just download the image
      downloadImage();
    }
  };

  // Download image directly
  const downloadImage = () => {
    try {
      const a = document.createElement('a');
      a.href = imagePath;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.error('Failed to download image:', err);
      setError('Failed to download image');
    }
  };

  // Toggle fullscreen view
  const toggleFullscreen = () => {
    setFullscreen(!fullscreen);
  };

  // Handle image load event
  const handleImageLoad = () => {
    setImageLoaded(true);
    setError(null);
  };

  // Handle image load error
  const handleImageError = () => {
    setImageLoaded(false);
    setError('Failed to load image');
  };

  return (
    <div className="mb-4 border border-theme-sidebar-border rounded-md overflow-hidden bg-theme-bg-secondary">
      {/* Header with controls */}
      <div className="flex items-center justify-between px-4 py-2 bg-theme-bg-primary border-b border-theme-sidebar-border">
        <div className="flex items-center">
          <span className="font-medium text-theme-text-primary mr-2">
            Image
          </span>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs px-2 py-1 rounded bg-theme-overlay-hover text-theme-text-secondary hover:bg-theme-overlay-active"
          >
            {expanded ? 'Collapse' : 'Expand'}
          </button>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={toggleFullscreen}
            className="text-xs px-2 py-1 rounded bg-theme-overlay-hover text-theme-text-secondary hover:bg-theme-overlay-active"
            disabled={!imageLoaded}
          >
            {fullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          </button>
          <button
            onClick={handleSave}
            className="text-xs px-2 py-1 rounded bg-theme-overlay-hover text-theme-text-secondary hover:bg-theme-overlay-active"
            disabled={!imageLoaded}
          >
            {onSave ? 'Save' : 'Download'}
          </button>
        </div>
      </div>

      {/* Image display */}
      {expanded && (
        <div className={`p-4 flex justify-center ${error ? 'items-center' : ''}`}>
          {!error ? (
            <div className="relative">
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-theme-bg-tertiary">
                  <span className="text-theme-text-secondary">Loading image...</span>
                </div>
              )}
              <img
                src={imagePath}
                alt={altText}
                className={`max-w-full ${fullscreen ? 'fixed inset-0 z-50 w-screen h-screen object-contain bg-black/80 p-4' : 'max-h-[500px] object-contain'}`}
                style={{ display: imageLoaded ? 'block' : 'none' }}
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
              {fullscreen && (
                <div 
                  className="fixed inset-0 z-50 flex items-start justify-end p-4"
                  onClick={toggleFullscreen}
                >
                  <button 
                    className="bg-theme-bg-secondary text-theme-text-primary rounded-full p-2 shadow-lg"
                    onClick={toggleFullscreen}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-theme-text-error p-4">{error}</div>
          )}
        </div>
      )}
      
      {/* Image metadata (optional) */}
      {expanded && imageLoaded && (width || height) && (
        <div className="px-4 py-2 border-t border-theme-sidebar-border bg-theme-bg-tertiary text-sm text-theme-text-secondary">
          Dimensions: {width || '?'}×{height || '?'}
        </div>
      )}
    </div>
  );
};

export default ImageArtifact; 