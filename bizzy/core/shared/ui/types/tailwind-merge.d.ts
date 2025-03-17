declare module 'tailwind-merge' {
  /**
   * Merges Tailwind CSS classes without style conflicts
   */
  export function twMerge(...inputs: (string | undefined)[]): string;
  
  /**
   * Creates a function that merges Tailwind CSS classes based on provided configuration
   */
  export function twJoin(...inputs: (string | undefined)[]): string;
  
  /**
   * Creates a custom instance of twMerge with tailored configuration
   */
  export function createTailwindMerge(config: any): typeof twMerge;
} 