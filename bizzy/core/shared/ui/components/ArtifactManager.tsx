import React, { useState } from 'react';
import ArtifactPanel from './ArtifactPanel';
import ArtifactRenderer from './ArtifactRenderer';
import ArtifactBrowser from './ArtifactBrowser';
import { artifactStorageService } from '../../services/ArtifactStorageService';
import type { TMessageContentParts, TAttachment } from '../../types/librechat-types';
import { ContentTypes } from '../../types/librechat-types';

// Farm management system types
interface FarmContext {
  currentField?: {
    id: string;
    name: string;
    cropType: string;
    size: number;
  };
  benchmarks?: {
    highYield: number;
    lowYield: number;
  };
  moistureTargets?: Record<string, number>;
  season?: string;
}

interface ArtifactManagerProps {
  farmContext?: FarmContext;
  isDevelopment?: boolean; // Flag to enable development features
  chatId?: string; // Current chat ID for context
}

/**
 * Manager component for handling LibreChat artifacts in AnythingLLM
 * Provides an interface for storing, displaying, and interacting with artifacts
 */
const ArtifactManager: React.FC<ArtifactManagerProps> = ({
  farmContext,
  isDevelopment = false,
  chatId
}) => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isBrowserOpen, setIsBrowserOpen] = useState(false);
  const [activeArtifact, setActiveArtifact] = useState<TMessageContentParts | null>(null);
  const [activeAttachments, setActiveAttachments] = useState<TAttachment[]>([]);
  const [savedArtifacts, setSavedArtifacts] = useState<any[]>([]);
  const [saveSuccess, setSaveSuccess] = useState<boolean | null>(null);
  const [saveMessage, setSaveMessage] = useState<string>('');

  // Function to show an artifact in the panel
  const showArtifact = (artifact: TMessageContentParts, attachments: TAttachment[] = []) => {
    setActiveArtifact(artifact);
    setActiveAttachments(attachments);
    setIsPanelOpen(true);
  };

  // Close the artifact panel
  const closePanel = () => {
    setIsPanelOpen(false);
    // Reset the success message when closing
    setTimeout(() => {
      setSaveSuccess(null);
      setSaveMessage('');
    }, 300);
  };

  // Open the artifact browser
  const openBrowser = () => {
    setIsBrowserOpen(true);
  };

  // Close the artifact browser
  const closeBrowser = () => {
    setIsBrowserOpen(false);
  };

  // Handle saving an artifact to vector storage
  const handleSaveArtifact = async (artifactData: any) => {
    try {
      // Clear any previous save status
      setSaveSuccess(null);
      setSaveMessage('');
      
      // Save the artifact using our storage service
      const result = await artifactStorageService.saveArtifact(
        artifactData,
        activeArtifact,
        {
          chatId,
          farmContext,
          // Additional metadata could be provided here
        }
      );
      
      if (result.success) {
        // Update local state
        setSavedArtifacts(prev => [
          ...prev, 
          {
            ...artifactData,
            id: result.id,
            savedAt: new Date().toISOString()
          }
        ]);
        
        // Show success message
        setSaveSuccess(true);
        setSaveMessage('Artifact saved successfully');
        
        // Hide success message after a delay
        setTimeout(() => {
          setSaveSuccess(null);
          setSaveMessage('');
        }, 3000);
      } else {
        // Show error message
        setSaveSuccess(false);
        setSaveMessage(result.message || 'Failed to save artifact');
      }
    } catch (error) {
      console.error('Error saving artifact:', error);
      setSaveSuccess(false);
      setSaveMessage('An unexpected error occurred');
    }
  };

  return (
    <>
      {/* The Artifact Panel */}
      <ArtifactPanel
        isOpen={isPanelOpen}
        onClose={closePanel}
        title={activeArtifact ? 'Artifact View' : 'No Artifact Selected'}
      >
        {activeArtifact ? (
          <>
            <ArtifactRenderer
              artifact={activeArtifact}
              attachments={activeAttachments}
              onSaveArtifact={handleSaveArtifact}
              farmContext={farmContext}
            />
            
            {/* Save status message */}
            {saveSuccess !== null && (
              <div className={`mt-4 p-3 rounded ${
                saveSuccess 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:bg-opacity-30 dark:text-green-400' 
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:bg-opacity-30 dark:text-red-400'
              }`}>
                {saveMessage}
              </div>
            )}
            
            {/* Browse artifacts button */}
            <div className="mt-4 flex justify-end">
              <button
                onClick={openBrowser}
                className="text-sm px-3 py-1.5 rounded bg-theme-overlay-hover text-theme-text-secondary hover:bg-theme-overlay-active"
              >
                Browse Saved Artifacts
              </button>
            </div>
          </>
        ) : (
          <div className="p-4 text-theme-text-secondary italic">
            No artifact is currently selected for viewing.
          </div>
        )}
      </ArtifactPanel>
      
      {/* Artifact Browser */}
      <ArtifactBrowser
        isOpen={isBrowserOpen}
        onClose={closeBrowser}
        farmContext={farmContext}
      />

      {/* For development/testing only - this would not be in the actual component */}
      {isDevelopment && (
        <div className="fixed bottom-4 right-4 z-10 flex flex-col gap-2">
          <button
            onClick={() => {
              // Example artifact for testing
              const testArtifact = {
                type: ContentTypes.TEXT,
                text: 'This is a test artifact with farm-related content about crop yields and soil moisture levels.'
              } as TMessageContentParts;
              
              showArtifact(testArtifact);
            }}
            className="px-4 py-2 bg-theme-primary text-white rounded-md shadow-md"
          >
            Test Artifact
          </button>
          
          <button
            onClick={openBrowser}
            className="px-4 py-2 bg-theme-bg-secondary text-theme-text-primary border border-theme-sidebar-border rounded-md shadow-md"
          >
            Open Browser
          </button>
        </div>
      )}
    </>
  );
};

export default ArtifactManager; 