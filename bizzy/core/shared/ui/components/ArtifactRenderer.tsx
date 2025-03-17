import React from 'react';
import { ContentTypes } from '../../types/librechat-types';
import type { TMessageContentParts, TAttachment } from '../../types/librechat-types';

// Import components from the artifacts directory
import { 
  CodeArtifact,
  TableArtifact,
  ImageArtifact,
  ChartArtifact,
  TextArtifact
} from './artifacts';

interface ArtifactRendererProps {
  artifact: TMessageContentParts;
  attachments?: TAttachment[];
  isExpanded?: boolean;
  onSaveArtifact?: (artifactData: any) => void;
  farmContext?: any; // Optional farm-specific context data
}

/**
 * A component that renders different types of artifacts based on their content type
 * Adapts LibreChat artifacts to AnythingLLM's styling
 */
const ArtifactRenderer: React.FC<ArtifactRendererProps> = ({
  artifact,
  attachments,
  isExpanded = true,
  onSaveArtifact,
  farmContext
}) => {
  if (!artifact) {
    return (
      <div className="p-4 text-theme-text-secondary italic border border-theme-sidebar-border rounded-md bg-theme-bg-primary">
        No artifact data available
      </div>
    );
  }

  // Determine the artifact type and render the appropriate component
  switch (artifact.type) {
    case ContentTypes.TEXT:
      return (
        <TextArtifact 
          textContent={typeof artifact.text === 'string' ? artifact.text : artifact.text?.value || ''}
          isExpanded={isExpanded}
          onSave={onSaveArtifact}
        />
      );
      
    case ContentTypes.TOOL_CALL:
      const toolCall = artifact[ContentTypes.TOOL_CALL];
      
      // Check if toolCall exists
      if (!toolCall) {
        return <div className="text-theme-text-secondary">Invalid tool call data</div>;
      }
      
      // Handle code execution artifacts
      if ('args' in toolCall && toolCall.name === 'execute_code') {
        return (
          <CodeArtifact
            language={toolCall.language || 'javascript'}
            code={typeof toolCall.args === 'string' ? toolCall.args : JSON.stringify(toolCall.args, null, 2)}
            output={toolCall.output || ''}
            isExpanded={isExpanded}
            onSave={onSaveArtifact}
          />
        );
      }
      
      // Handle chart or graph artifacts (assumed to be in a specific format)
      if ('args' in toolCall && (toolCall.name === 'create_chart' || toolCall.name === 'generate_chart')) {
        return (
          <ChartArtifact
            chartData={toolCall.args}
            result={toolCall.output || ''}
            isExpanded={isExpanded}
            onSave={onSaveArtifact}
          />
        );
      }
      
      // Handle table artifacts
      if ('args' in toolCall && (toolCall.name === 'create_table' || toolCall.name === 'generate_table')) {
        return (
          <TableArtifact
            tableData={toolCall.args}
            isExpanded={isExpanded}
            onSave={onSaveArtifact}
            farmContext={farmContext}
          />
        );
      }
      
      // Fallback for other tool calls
      return (
        <div className="p-4 border border-theme-sidebar-border rounded-md bg-theme-bg-secondary">
          <h3 className="font-medium text-theme-text-primary mb-2">{toolCall.name || 'Tool Result'}</h3>
          <pre className="whitespace-pre-wrap text-sm overflow-auto max-h-96 p-3 bg-theme-bg-primary rounded border border-theme-sidebar-border">
            {typeof toolCall.output === 'string' 
              ? toolCall.output 
              : JSON.stringify(toolCall.output, null, 2)
            }
          </pre>
        </div>
      );
      
    case ContentTypes.IMAGE_FILE:
      const imageFile = artifact[ContentTypes.IMAGE_FILE];
      return (
        <ImageArtifact
          imagePath={imageFile?.filepath || ''}
          altText={imageFile?.filename || 'Generated Image'}
          height={imageFile?.height}
          width={imageFile?.width}
          isExpanded={isExpanded}
          onSave={onSaveArtifact}
        />
      );
      
    default:
      // Default artifact display for unknown types
      return (
        <div className="p-4 border border-theme-sidebar-border rounded-md bg-theme-bg-secondary">
          <h3 className="font-medium text-theme-text-primary mb-2">Unknown Artifact Type</h3>
          <pre className="whitespace-pre-wrap text-sm overflow-auto max-h-96 p-3 bg-theme-bg-primary rounded border border-theme-sidebar-border">
            {JSON.stringify(artifact, null, 2)}
          </pre>
        </div>
      );
  }
};

export default ArtifactRenderer; 