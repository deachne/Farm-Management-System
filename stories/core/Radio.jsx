import React, { forwardRef, useId } from 'react';

// Utility function to merge class names
const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

// Radio variants
const getRadioClasses = (size) => {
  const base = "peer rounded-full border border-gray-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 checked:bg-blue-600 checked:text-white";
  
  const sizeClasses = {
    sm: "h-3.5 w-3.5",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };
  
  return `${base} ${sizeClasses[size] || sizeClasses.md}`;
};

// Radio container variants
const getContainerClasses = (orientation) => {
  const base = "flex items-center";
  const orientationClasses = {
    horizontal: "flex-row",
    vertical: "flex-col items-start gap-1.5",
  };
  
  return `${base} ${orientationClasses[orientation] || orientationClasses.horizontal}`;
};

/**
 * Radio component that follows the BizzyPerson design system
 */
export const Radio = forwardRef(
  ({ 
    className, 
    size = 'md',
    label, 
    helperText,
    errorMessage,
    orientation = 'horizontal',
    containerClassName,
    id,
    ...props 
  }, ref) => {
    const radioId = id || useId();
    
    return (
      <div className={cn(
        getContainerClasses(orientation),
        containerClassName
      )}>
        <div className="flex items-center space-x-2">
          <div className="relative flex items-center">
            <input
              type="radio"
              id={radioId}
              ref={ref}
              className={cn(
                getRadioClasses(size),
                className
              )}
              {...props}
            />
            {/* Custom radio dot */}
            <div 
              className={cn(
                "pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white hidden peer-checked:block",
                {
                  "h-1.5 w-1.5": size === "sm",
                  "h-2 w-2": size === "md" || !size,
                  "h-2.5 w-2.5": size === "lg",
                }
              )}
              aria-hidden="true" 
            />
          </div>
          
          {label && (
            <label
              htmlFor={radioId}
              className={cn(
                "text-sm font-medium text-gray-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              )}
            >
              {label}
            </label>
          )}
        </div>
        
        {errorMessage && (
          <p className="mt-1 text-sm text-red-600">
            {errorMessage}
          </p>
        )}
        
        {!errorMessage && helperText && (
          <p className="mt-1 text-sm text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Radio.displayName = "Radio";

export default Radio; 