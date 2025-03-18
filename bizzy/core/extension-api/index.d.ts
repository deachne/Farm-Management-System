/**
 * BizzyPerson Extension API TypeScript Definitions
 */

import { EventEmitter } from 'events';

/**
 * Extension State enum
 */
export enum ExtensionState {
  PENDING = 'pending',
  LOADING = 'loading',
  LOADED = 'loaded',
  ERROR = 'error'
}

/**
 * Extension Lifecycle State enum
 */
export enum LifecycleState {
  INSTALLED = 'installed',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  UPDATABLE = 'updatable',
  UPDATING = 'updating',
  UNINSTALLING = 'uninstalling',
  ERROR = 'error'
}

/**
 * Extension registry state
 */
export type RegistryState = 'registered' | 'initializing' | 'initialized' | 'error' | 'unknown';

/**
 * Extension dependency
 */
export interface Dependency {
  name: string;
  versionRange: string;
  actualVersion?: string;
  reason?: string;
}

/**
 * Extension initialization context
 */
export interface InitializationContext {
  registry: ExtensionRegistry;
  hooks: Record<string, Function>;
  capabilities: Record<string, any>;
}

/**
 * Document processing context
 */
export interface DocumentProcessingContext {
  text: string;
  metadata: Record<string, any>;
}

/**
 * Document processing result
 */
export interface DocumentProcessingResult {
  text: string;
  metadata: Record<string, any>;
}

/**
 * Document processing extension
 */
export interface DocumentProcessingExtension {
  process: (document: DocumentProcessingContext) => Promise<DocumentProcessingResult>;
}

/**
 * Chat message
 */
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

/**
 * Chat context
 */
export interface ChatContext {
  query: string;
  history: ChatMessage[];
  metadata?: Record<string, any>;
}

/**
 * Chat response
 */
export interface ChatResponse {
  type: string;
  content: string | Record<string, any>;
}

/**
 * Chat extension
 */
export interface ChatExtension {
  processQuery: (context: ChatContext) => Promise<ChatResponse | null>;
}

/**
 * UI component props
 */
export interface UIComponentProps {
  theme: 'light' | 'dark';
  [key: string]: any;
}

/**
 * UI component
 */
export interface UIComponent {
  (props: UIComponentProps): any;
}

/**
 * UI extension
 */
export interface UIExtension {
  components: Record<string, UIComponent>;
}

/**
 * Extension manifest
 */
export interface ExtensionManifest {
  name: string;
  version: string;
  description: string;
  author: string;
  license: string;
  dependencies?: Record<string, string>;
  hooks?: string[];
  permissions?: string[];
}

/**
 * Extension object
 */
export interface Extension {
  name: string;
  version: string;
  description?: string;
  author?: string;
  dependencies?: Record<string, string>;
  deactivate?: () => Promise<void>;
  initialize?: (context: InitializationContext) => Promise<void>;
  initializeDocumentProcessing?: () => DocumentProcessingExtension;
  initializeChat?: () => ChatExtension;
  initializeUI?: () => UIExtension;
  initializeAnythingLLM?: (api: any) => any;
  initializeLibreChat?: (api: any) => any;
  
  // Extension capabilities
  documentProcessingExtension?: DocumentProcessingExtension;
  chatTools?: Record<string, any>;
  uiComponents?: Record<string, any>;
  dataModels?: Record<string, any>;
  anythingLLMIntegration?: Record<string, any>;
  libreChatIntegration?: Record<string, any>;
}

/**
 * Extension dependency check result
 */
export interface DependencyCheckResult {
  satisfied: boolean;
  missing: Dependency[];
}

/**
 * Extension state
 */
export interface ExtensionStateInfo {
  state: string;
  manifest?: ExtensionManifest;
  error?: string;
  timestamp?: number;
}

/**
 * Extension lifecycle state
 */
export interface LifecycleStateInfo {
  state: LifecycleState;
  timestamp: number;
  reason?: string;
  previousState?: LifecycleState;
  version?: string;
  installPath?: string;
}

/**
 * Extension installation options
 */
export interface InstallationOptions {
  activate?: boolean;
  upgrade?: boolean;
}

/**
 * Extension deactivation options
 */
export interface DeactivationOptions {
  suspended?: boolean;
  force?: boolean;
  reason?: string;
}

/**
 * Extension installation result
 */
export interface InstallationResult {
  name?: string;
  version?: string;
  path?: string;
  success: boolean;
  error?: string;
}

/**
 * Extension update check result
 */
export interface UpdateCheckResult {
  name: string;
  currentVersion?: string;
  latestVersion?: string;
  hasUpdate?: boolean;
  success?: boolean;
  error?: string;
}

/**
 * Extension registry
 */
export interface ExtensionRegistry extends EventEmitter {
  extensions: Map<string, Extension>;
  capabilities: {
    documentProcessors: Map<string, DocumentProcessingExtension>;
    chatTools: Map<string, any>;
    uiComponents: Map<string, any>;
    dataModels: Map<string, any>;
    anythingLLMIntegrations: Map<string, any>;
    libreChatIntegrations: Map<string, any>;
  };
  hooks: Map<string, Record<string, Function>>;
  states: Map<string, ExtensionStateInfo>;
  dependencies: Map<string, Map<string, string>>;
  
  register(extension: Extension): Extension;
  unregister(extensionName: string): boolean;
  getExtension(name: string): Extension | null;
  getAllExtensions(): Extension[];
  hasExtension(name: string): boolean;
  getExtensionsByCapability(capabilityType: string): Extension[];
  getCapability(extensionName: string, capabilityType: string, capabilityName?: string): any;
  getDependentExtensions(extensionName: string): Map<string, string>;
  checkDependencies(extension: Extension): DependencyCheckResult;
  getExtensionState(extensionName: string): ExtensionStateInfo;
  getAllExtensionStates(): Record<string, ExtensionStateInfo>;
  initializeExtension(extensionName: string): Promise<boolean>;
}

/**
 * Extension lifecycle management
 */
export interface ExtensionLifecycle {
  LifecycleState: typeof LifecycleState;
  getLifecycleState(extensionName: string): LifecycleStateInfo | null;
  updateLifecycleState(extensionName: string, newState: LifecycleState, reason?: string): boolean;
  installExtension(extensionPath: string, options?: InstallationOptions): Promise<InstallationResult>;
  uninstallExtension(extensionName: string): Promise<InstallationResult>;
  activateExtension(extensionName: string): Promise<boolean>;
  deactivateExtension(extensionName: string, options?: DeactivationOptions): Promise<boolean>;
  suspendExtension(extensionName: string, reason: string): Promise<boolean>;
  resumeExtension(extensionName: string): Promise<boolean>;
  checkForUpdate(extensionName: string): Promise<UpdateCheckResult>;
  getAllExtensionsWithStates(): Array<Extension & { lifecycleState: LifecycleStateInfo }>;
}

/**
 * Extension API interface
 */
export interface ExtensionAPI {
  register: (extension: Extension) => Extension;
  getExtension: (name: string) => Extension | null;
  getAllExtensions: () => Extension[];
  hasExtension: (name: string) => boolean;
  unregister: (name: string) => boolean;
  loadExtension: (extensionDir: string, extensionsDir: string) => Promise<any>;
  parseManifest: (manifestPath: string) => Promise<ExtensionManifest>;
  checkDependencies: (manifest: ExtensionManifest) => Promise<DependencyCheckResult>;
  sortExtensionsByDependency: (extensionDirs: string[], extensionsDir: string) => Promise<string[]>;
  getExtensionLoadingStatus: () => Record<string, ExtensionStateInfo>;
  getDependentExtensions: (extensionName: string) => string[];
  getExtensionsByCapability: (capabilityType: string) => Extension[];
  getCapability: (extensionName: string, capabilityType: string, capabilityName?: string) => any;
  ExtensionState: typeof ExtensionState;
  registry: ExtensionRegistry;
  lifecycle: ExtensionLifecycle;
}

/**
 * Default export
 */
declare const api: ExtensionAPI;
export default api; 