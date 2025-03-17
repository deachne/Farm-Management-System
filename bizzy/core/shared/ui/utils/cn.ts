import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge class names with tailwind-merge
 * This is useful for conditionally applying classes
 * and merging tailwind utility classes.
 * 
 * @example cn('font-bold', { 'text-red-500': isError })
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
} 