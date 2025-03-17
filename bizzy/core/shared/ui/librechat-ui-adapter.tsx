import React, { useEffect } from 'react';
import { initializeTheming } from './theme-integration';

/**
 * LibreChat UI Adapter
 * 
 * This component initializes the theme integration and provides a way to use
 * the adapted LibreChat UI components within AnythingLLM.
 */
export const LibreChatUIAdapter: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    // Initialize theme integration
    const cleanup = initializeTheming();
    
    // Clean up when the component unmounts
    return () => {
      cleanup();
    };
  }, []);
  
  return <>{children}</>;
};

/**
 * Higher-order component that wraps a LibreChat component with the UI adapter
 * @param Component - The LibreChat component to wrap
 * @returns The wrapped component
 */
export function withAnythingLLMStyling<P>(Component: React.ComponentType<P>): React.FC<P> {
  const WrappedComponent: React.FC<P> = (props) => {
    return (
      <LibreChatUIAdapter>
        <Component {...props} />
      </LibreChatUIAdapter>
    );
  };
  
  // Set display name for debugging
  WrappedComponent.displayName = `withAnythingLLMStyling(${Component.displayName || Component.name || 'Component'})`;
  
  return WrappedComponent;
}

/**
 * Utility function to check if the component is running within AnythingLLM
 * @returns True if the component is running within AnythingLLM
 */
export function isRunningInAnythingLLM(): boolean {
  try {
    // Check if we're in an iframe
    if (window.self !== window.top) {
      // Check if the parent window has AnythingLLM-specific properties
      return window.parent.document.documentElement.hasAttribute('data-theme');
    }
    return false;
  } catch (e) {
    // If we can't access the parent window, we're probably not in AnythingLLM
    return false;
  }
}

/**
 * Conditionally apply AnythingLLM styling based on the runtime environment
 * @param Component - The component to potentially wrap with AnythingLLM styling
 * @returns The original component or the wrapped component
 */
export function adaptIfInAnythingLLM<P>(Component: React.ComponentType<P>): React.ComponentType<P> {
  if (isRunningInAnythingLLM()) {
    return withAnythingLLMStyling(Component);
  }
  return Component;
}

/**
 * Export adapted components
 */
export { default as AdaptedMessageRender } from '../../librechat/client/src/components/Chat/Messages/ui/AdaptedMessageRender';
export { default as AdaptedChatForm } from '../../librechat/client/src/components/Chat/Input/AdaptedChatForm'; 