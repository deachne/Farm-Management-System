import React from 'react';
import { NavigationWrapper } from './NavigationWrapper';
import { adaptClassNames } from '../css-mapping';

interface UnifiedLayoutProps {
  children: React.ReactNode;
}

/**
 * Unified layout component that provides a consistent layout structure
 * across both AnythingLLM and LibreChat features
 */
export const UnifiedLayout: React.FC<UnifiedLayoutProps> = ({ children }) => {
  return (
    <div className={adaptClassNames(`
      flex w-full h-screen bg-theme-bg-container overflow-hidden
    `)}>
      {/* Navigation sidebar */}
      <NavigationWrapper />
      
      {/* Main content area */}
      <main className={adaptClassNames(`
        flex-1 flex flex-col relative overflow-hidden
      `)}>
        {/* Content wrapper with padding and scrolling */}
        <div className={adaptClassNames(`
          flex-1 overflow-y-auto p-4 md:p-6
          bg-theme-bg-secondary
          md:m-4 md:rounded-lg
        `)}>
          {children}
        </div>
      </main>
    </div>
  );
};

export default UnifiedLayout; 