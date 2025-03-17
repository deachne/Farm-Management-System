/**
 * Mock types for LibreChat integration
 * These will be replaced with actual imports from librechat-data-provider
 * when we properly integrate with LibreChat
 */

export enum ContentTypes {
  TEXT = 'text',
  IMAGE_FILE = 'image_file',
  IMAGE_URL = 'image_url',
  TOOL_CALL = 'tool_call',
  CODE = 'code'
}

export interface TextContent {
  value: string;
}

export interface ImageContent {
  url?: string;
  filepath?: string;
  filename?: string;
  width?: number;
  height?: number;
  alt_text?: string;
}

export interface ToolCall {
  name?: string;
  args?: any;
  output?: any;
  language?: string;
}

export interface TMessageContentParts {
  type: ContentTypes;
  text?: string | TextContent;
  [ContentTypes.IMAGE_FILE]?: ImageContent;
  [ContentTypes.IMAGE_URL]?: ImageContent;
  [ContentTypes.TOOL_CALL]?: ToolCall;
  code?: {
    language: string;
    value: string;
  };
}

export interface TAttachment {
  id: string;
  filename: string;
  filepath: string;
  type: string;
  size: number;
  width?: number;
  height?: number;
} 