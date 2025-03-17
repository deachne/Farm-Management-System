import React, { useEffect, useRef, useState } from 'react';

// Using direct DOM manipulation as a fallback if react-dom is not available
const createPortal = (children: React.ReactNode, container: Element) => {
  // This is a simplified version; in production, you would use ReactDOM.createPortal
  return children;
};

interface ArtifactPanelProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

/**
 * A sliding panel component that appears from the right side of the screen
 * Used to display artifacts from LibreChat in AnythingLLM's UI
 */
const ArtifactPanel: React.FC<ArtifactPanelProps> = ({ 
  isOpen,
  onClose,
  title,
  children
}) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  // Mount the component
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Handle escape key press to close the panel
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Handle clicking outside the panel to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Render nothing if not mounted or not open
  if (!mounted || !isOpen) return null;

  // Create the panel content
  const panelContent = (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-25 transition-opacity" />
        <div className="fixed inset-y-0 right-0 max-w-full flex">
          <div 
            ref={panelRef}
            className="w-screen max-w-md transform transition ease-in-out duration-300"
          >
            <div className="h-full flex flex-col bg-theme-bg-primary shadow-xl overflow-y-auto border-l border-theme-sidebar-border">
              {/* Panel header */}
              <div className="px-4 py-3 border-b border-theme-sidebar-border bg-theme-bg-secondary flex items-center justify-between">
                <h2 className="text-lg font-medium text-theme-text-primary">{title}</h2>
                <button
                  onClick={onClose}
                  className="p-1 text-theme-text-secondary hover:text-theme-text-primary"
                >
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Panel content */}
              <div className="relative flex-1 px-4 py-6">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // In a real implementation, we would use ReactDOM.createPortal
  // For now, we'll just return the JSX directly to avoid dependency issues
  return panelContent;
};

export default ArtifactPanel; 