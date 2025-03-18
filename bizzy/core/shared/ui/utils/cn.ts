import { twMerge } from 'tailwind-merge';
import { clsx, type ClassValue } from 'clsx';

/**
 * Combines multiple class names and merges Tailwind classes efficiently
 * using the clsx and tailwind-merge libraries.
 * 
 * @param inputs - The class values to combine
 * @returns A string of combined and merged classes
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
} 