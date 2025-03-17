import React, { useState, useEffect } from 'react';
import { useThemeIntegration } from '../hooks/useThemeIntegration';
import { adaptClassNames } from '../css-mapping';

export interface NavItemProps {
  id: string;
  title: string;
  icon: React.ReactNode;
  href?: string;
  onClick?: () => void;
  isActive?: boolean;
  isExternal?: boolean;
  badge?: string | number;
  children?: React.ReactNode;
  subItems?: NavItemProps[];
}

export interface NavSectionProps {
  title: string;
  items: NavItemProps[];
  collapsible?: boolean;
  defaultExpanded?: boolean;
}

interface UnifiedNavigationProps {
  anythingLLMSections: NavSectionProps[];
  libreChatSections: NavSectionProps[];
  activePath: string;
  onNavigate: (path: string) => void;
  isCollapsed?: boolean;
  toggleCollapse?: () => void;
  className?: string;
}

const NavItem: React.FC<NavItemProps> = ({ 
  id, 
  title, 
  icon, 
  href, 
  onClick, 
  isActive, 
  badge, 
  children,
  subItems 
}) => {
  const [expanded, setExpanded] = useState(false);
  
  const hasSubItems = subItems && subItems.length > 0;
  
  const handleClick = () => {
    if (hasSubItems) {
      setExpanded(!expanded);
    }
    if (onClick) {
      onClick();
    }
  };

  const baseClasses = adaptClassNames(`
    flex items-center gap-x-2 py-2 px-3 rounded-md
    text-sm font-medium transition-all duration-200
    ${isActive 
      ? 'bg-theme-sidebar-item-selected font-bold text-white' 
      : 'bg-theme-sidebar-item-default hover:bg-theme-sidebar-item-hover text-white'}
  `);

  return (
    <div className="w-full">
      <button 
        className={baseClasses}
        onClick={handleClick}
      >
        <span className="flex-shrink-0">{icon}</span>
        <span className="flex-grow truncate">{title}</span>
        {badge && (
          <span className="ml-auto px-2 py-0.5 text-xs rounded-full bg-theme-badge-bg text-theme-badge-text">
            {badge}
          </span>
        )}
        {hasSubItems && (
          <span className={`transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4.5 9L7.5 6L4.5 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        )}
      </button>
      
      {hasSubItems && expanded && (
        <div className="pl-8 mt-1 space-y-1">
          {subItems.map((item) => (
            <NavItem 
              key={item.id} 
              {...item} 
            />
          ))}
        </div>
      )}
      
      {children}
    </div>
  );
};

const NavSection: React.FC<NavSectionProps> = ({ 
  title, 
  items, 
  collapsible = true, 
  defaultExpanded = true 
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const toggleExpanded = () => {
    if (collapsible) {
      setExpanded(!expanded);
    }
  };

  return (
    <div className="mb-4">
      {title && (
        <button
          className={adaptClassNames(`
            flex items-center w-full px-3 py-1 text-xs font-semibold 
            text-theme-sidebar-section-header uppercase tracking-wider
            ${collapsible ? 'cursor-pointer hover:text-theme-sidebar-section-header-hover' : 'cursor-default'}
          `)}
          onClick={toggleExpanded}
          disabled={!collapsible}
        >
          {title}
          {collapsible && (
            <span className={`ml-auto transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.5 9L7.5 6L4.5 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          )}
        </button>
      )}
      
      {expanded && (
        <div className="mt-2 space-y-1">
          {items.map((item) => (
            <NavItem key={item.id} {...item} />
          ))}
        </div>
      )}
    </div>
  );
};

export const UnifiedNavigation: React.FC<UnifiedNavigationProps> = ({
  anythingLLMSections,
  libreChatSections,
  activePath,
  onNavigate,
  isCollapsed = false,
  toggleCollapse,
  className = ''
}) => {
  const { theme } = useThemeIntegration();
  
  // Process navigation items to set active states based on current path
  const processedAnythingLLMSections = anythingLLMSections.map(section => ({
    ...section,
    items: section.items.map(item => ({
      ...item,
      isActive: item.href === activePath,
      onClick: () => {
        if (item.href) {
          onNavigate(item.href);
        }
        if (item.onClick) {
          item.onClick();
        }
      },
      subItems: item.subItems?.map(subItem => ({
        ...subItem,
        isActive: subItem.href === activePath,
        onClick: () => {
          if (subItem.href) {
            onNavigate(subItem.href);
          }
          if (subItem.onClick) {
            subItem.onClick();
          }
        }
      }))
    }))
  }));
  
  const processedLibreChatSections = libreChatSections.map(section => ({
    ...section,
    items: section.items.map(item => ({
      ...item,
      isActive: item.href === activePath,
      onClick: () => {
        if (item.href) {
          onNavigate(item.href);
        }
        if (item.onClick) {
          item.onClick();
        }
      },
      subItems: item.subItems?.map(subItem => ({
        ...subItem,
        isActive: subItem.href === activePath,
        onClick: () => {
          if (subItem.href) {
            onNavigate(subItem.href);
          }
          if (subItem.onClick) {
            subItem.onClick();
          }
        }
      }))
    }))
  }));

  return (
    <div 
      className={adaptClassNames(`
        flex flex-col h-full bg-theme-bg-sidebar overflow-y-auto
        ${isCollapsed ? 'w-16' : 'w-64'}
        transition-all duration-300 ease-in-out
        ${className}
      `)}
      data-theme={theme}
    >
      {toggleCollapse && (
        <div className="flex justify-end p-2">
          <button 
            onClick={toggleCollapse}
            className={adaptClassNames(`
              p-1 rounded-md text-theme-text-secondary 
              hover:bg-theme-sidebar-item-hover hover:text-theme-text-primary
            `)}
          >
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className={`transform transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}
            >
              <path 
                d="M15 19L8 12L15 5" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
            </svg>
          </button>
        </div>
      )}
      
      <div className="flex-grow overflow-y-auto px-2 py-2">
        {/* AnythingLLM Sections */}
        {processedAnythingLLMSections.map((section, index) => (
          <NavSection
            key={`anything-section-${index}`}
            title={isCollapsed ? '' : section.title}
            items={section.items}
            collapsible={section.collapsible}
            defaultExpanded={section.defaultExpanded}
          />
        ))}
        
        {/* Divider between AnythingLLM and LibreChat sections */}
        <div className={adaptClassNames(`
          my-4 border-t border-theme-sidebar-divider
        `)} />
        
        {/* LibreChat Sections */}
        {processedLibreChatSections.map((section, index) => (
          <NavSection
            key={`librechat-section-${index}`}
            title={isCollapsed ? '' : section.title}
            items={section.items}
            collapsible={section.collapsible}
            defaultExpanded={section.defaultExpanded}
          />
        ))}
      </div>
    </div>
  );
};

export default UnifiedNavigation; 