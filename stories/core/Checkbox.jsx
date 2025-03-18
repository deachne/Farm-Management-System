import React, { forwardRef, useId, useRef, useEffect } from 'react';

// Utility function to merge class names
const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

// Checkbox icons
export const Check = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

export const Minus = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

// Checkbox variants
const getCheckboxClasses = (size) => {
  const base = "peer rounded-sm border border-gray-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white";
  
  const sizeClasses = {
    sm: "h-3.5 w-3.5",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };
  
  return `${base} ${sizeClasses[size] || sizeClasses.md}`;
};

// Checkbox container variants
const getContainerClasses = (orientation) => {
  const base = "flex items-center";
  const orientationClasses = {
    horizontal: "flex-row",
    vertical: "flex-col items-start gap-1.5",
  };
  
  return `${base} ${orientationClasses[orientation] || orientationClasses.horizontal}`;
};

/**
 * Checkbox component that follows the BizzyPerson design system
 */
export const Checkbox = forwardRef(
  ({ 
    className, 
    size = 'md',
    label, 
    indeterminate = false,
    helperText,
    errorMessage,
    orientation = 'horizontal',
    containerClassName,
    checked,
    id,
    ...props 
  }, ref) => {
    // Use a callback ref to set the indeterminate property
    // since it's not available as a prop in React
    const innerRef = useRef(null);
    
    useEffect(() => {
      if (innerRef.current) {
        innerRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate]);
    
    // Combine refs
    const setRefs = (element) => {
      innerRef.current = element;
      if (typeof ref === 'function') {
        ref(element);
      } else if (ref) {
        ref.current = element;
      }
    };
    
    const checkboxId = id || useId();
    
    return (
      <div className={cn(
        getContainerClasses(orientation),
        containerClassName
      )}>
        <div className="flex items-center space-x-2">
          <div className="relative flex items-center">
            <input
              type="checkbox"
              id={checkboxId}
              ref={setRefs}
              checked={checked}
              className={cn(
                getCheckboxClasses(size),
                "appearance-none",
                className
              )}
              {...props}
            />
            {/* Custom checkbox appearance */}
            <div
              aria-hidden="true"
              className={cn(
                "pointer-events-none absolute inset-0 flex items-center justify-center",
                !checked && !indeterminate && "text-transparent"
              )}
            >
              {indeterminate ? (
                <Minus className="h-3 w-3 text-white" />
              ) : (
                <Check className="h-3 w-3 text-white" />
              )}
            </div>
          </div>
          
          {label && (
            <label
              htmlFor={checkboxId}
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

Checkbox.displayName = "Checkbox";

export default Checkbox; 