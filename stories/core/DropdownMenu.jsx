import React from 'react';
// Import the actual DropdownMenu component from the bizzy directory
import { 
  DropdownMenu as OriginalDropdownMenu, 
  DropdownMenuItem as OriginalDropdownMenuItem,
  DropdownMenuSeparator as OriginalDropdownMenuSeparator,
  DropdownMenuLabel as OriginalDropdownMenuLabel
} from '../../bizzy/core/shared/ui/components/DropdownMenu';

// Re-export the components
export const DropdownMenu = OriginalDropdownMenu;
export const DropdownMenuItem = OriginalDropdownMenuItem;
export const DropdownMenuSeparator = OriginalDropdownMenuSeparator;
export const DropdownMenuLabel = OriginalDropdownMenuLabel;

export default DropdownMenu; 