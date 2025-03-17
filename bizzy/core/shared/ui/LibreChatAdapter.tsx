import React, { useEffect, ReactNode } from 'react';
import { initializeTheming } from './theme-integration';
import { processClassName } from './css-mapping';

/**
 * Props for the LibreChatAdapter component
 */
interface LibreChatAdapterProps {
  /**
   * Child components to wrap with the adapter
   */
  children: ReactNode;
  
  /**
   * Whether to add a wrapper div with the libre-chat-component class
   * @default true
   */
  withWrapper?: boolean;
  
  /**
   * Additional class names to add to the wrapper
   */
  className?: string;
}

/**
 * LibreChatAdapter Component
 * 
 * This component initializes theme integration and provides a context for
 * adapting LibreChat UI components to the AnythingLLM design system.
 */
export const LibreChatAdapter: React.FC<LibreChatAdapterProps> = ({
  children,
  withWrapper = true,
  className = '',
}) => {
  // Initialize theming on mount and clean up on unmount
  useEffect(() => {
    const cleanup = initializeTheming();
    return cleanup;
  }, []);
  
  if (withWrapper) {
    return (
      <div className={`libre-chat-component ${className}`}>
        {children}
      </div>
    );
  }
  
  return <>{children}</>;
};

/**
 * Higher-order component (HOC) that wraps a LibreChat component with the UI adapter
 * 
 * @param Component The LibreChat component to wrap
 * @param options Optional configuration options
 * @returns The wrapped component with AnythingLLM styling
 */
export function withAnythingLLMStyling<P extends { className?: string }>(
  Component: React.ComponentType<P>,
  options: { withWrapper?: boolean } = { withWrapper: true }
): React.FC<P> {
  const AdaptedComponent: React.FC<P> = (props) => {
    // Process the className to map LibreChat classes to AnythingLLM classes
    const processedClassName = processClassName(props.className);
    
    // Create a new props object with the processed className
    const newProps = {
      ...props,
      className: processedClassName,
    } as P;
    
    return (
      <LibreChatAdapter withWrapper={options.withWrapper}>
        <Component {...newProps} />
      </LibreChatAdapter>
    );
  };
  
  // Set display name for easier debugging
  const displayName = Component.displayName || Component.name || 'Component';
  AdaptedComponent.displayName = `withAnythingLLMStyling(${displayName})`;
  
  return AdaptedComponent;
}

/**
 * Props for defining AdaptedComponent
 */
interface AdaptedComponentProps<P> {
  /**
   * The original LibreChat component to adapt
   */
  originalComponent: React.ComponentType<P>;
  
  /**
   * The adapted component with AnythingLLM styling
   */
  adaptedComponent: React.FC<P>;
}

/**
 * Creates an adapted version of a LibreChat component
 * 
 * This is useful for registering adapted components in the LibreChat UI
 * 
 * @param originalComponent The original LibreChat component
 * @param withWrapper Whether to add a wrapper div
 * @returns An object with the original and adapted components
 */
export function createAdaptedComponent<P extends { className?: string }>(
  originalComponent: React.ComponentType<P>,
  withWrapper: boolean = true
): AdaptedComponentProps<P> {
  return {
    originalComponent,
    adaptedComponent: withAnythingLLMStyling(originalComponent, { withWrapper }),
  };
}

/**
 * Props for the AdaptedMessage component
 */
interface MessageProps {
  role: 'user' | 'assistant' | 'system';
  content: string;
  className?: string;
}

/**
 * Example adapted message component for displaying chat messages
 */
export const AdaptedMessage: React.FC<MessageProps> = withAnythingLLMStyling(
  ({ role, content, className = '' }) => {
    const roleClasses = {
      user: 'bg-theme-bg-secondary text-theme-text-primary self-end',
      assistant: 'bg-theme-accent-primary text-white self-start',
      system: 'bg-theme-bg-secondary text-theme-text-secondary italic self-start',
    };
    
    return (
      <div className={`p-3 my-2 rounded-lg max-w-3/4 ${roleClasses[role]} ${className}`}>
        {content}
      </div>
    );
  }
);

/**
 * Props for the AdaptedInput component
 */
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

/**
 * Example adapted input component
 */
export const AdaptedInput: React.FC<InputProps> = withAnythingLLMStyling(
  ({ className = '', ...props }) => {
    return (
      <input
        className={`w-full p-2 border border-theme-chat-input-border bg-theme-bg-chat-input text-theme-text-primary rounded-md ${className}`}
        {...props}
      />
    );
  }
);

export default {
  LibreChatAdapter,
  withAnythingLLMStyling,
  createAdaptedComponent,
  AdaptedMessage,
  AdaptedInput,
}; 