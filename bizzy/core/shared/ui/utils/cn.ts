import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * A utility function that combines clsx and tailwind-merge to allow for conditional
 * class names and proper handling of Tailwind CSS class conflicts.
 * 
 * @param inputs - Class names or conditional class name objects to merge
 * @returns A merged string of class names with Tailwind conflicts resolved
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
} 