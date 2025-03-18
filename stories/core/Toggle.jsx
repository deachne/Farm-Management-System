import React, { forwardRef, useId, useState } from 'react';

// Utility function to merge class names
const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

// Toggle container variants
const getContainerClasses = (orientation) => {
  const base = "flex items-center";
  const orientationClasses = {
    horizontal: "flex-row space-x-2",
    vertical: "flex-col items-start space-y-1.5",
  };
  
  return `${base} ${orientationClasses[orientation] || orientationClasses.horizontal}`;
};

// Toggle track (background) variants
const getTrackClasses = (variant, size, disabled) => {
  const base = "peer cursor-pointer rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:ring-offset-2";
  
  const variantClasses = {
    primary: "bg-gray-300 data-[state=checked]:bg-blue-600",
    success: "bg-gray-300 data-[state=checked]:bg-green-600",
    warning: "bg-gray-300 data-[state=checked]:bg-yellow-600",
    danger: "bg-gray-300 data-[state=checked]:bg-red-600",
  };
  
  const sizeClasses = {
    sm: "h-4 w-7",
    md: "h-5 w-9",
    lg: "h-6 w-11",
  };
  
  const disabledClass = disabled ? "cursor-not-allowed opacity-50" : "";
  
  return cn(
    base, 
    variantClasses[variant] || variantClasses.primary,
    sizeClasses[size] || sizeClasses.md,
    disabledClass
  );
};

// Toggle thumb (slider) variants
const getThumbClasses = (size) => {
  const base = "pointer-events-none block rounded-full bg-white shadow-lg ring-0 transition-transform";
  
  const sizeClasses = {
    sm: "h-3 w-3 data-[state=checked]:translate-x-3 data-[state=unchecked]:translate-x-0",
    md: "h-4 w-4 data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0",
    lg: "h-5 w-5 data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0",
  };
  
  return `${base} ${sizeClasses[size] || sizeClasses.md}`;
};

/**
 * Toggle component that follows the BizzyPerson design system
 */
export const Toggle = forwardRef(
  ({ 
    className,
    variant = 'primary',
    size = 'md',
    label,
    helperText,
    errorMessage,
    orientation = 'horizontal',
    containerClassName,
    checked,
    defaultChecked = false,
    onChange,
    id,
    disabled,
    ...props 
  }, ref) => {
    const [isChecked, setIsChecked] = useState(defaultChecked);
    const toggleId = id || useId();
    
    // Handle controlled and uncontrolled modes
    const handleChange = (e) => {
      if (onChange) {
        onChange(e);
      }
      if (checked === undefined) {
        setIsChecked(e.target.checked);
      }
    };
    
    // Determine the checked state for aria attributes and styling
    const effectiveChecked = checked !== undefined ? checked : isChecked;
    const dataState = effectiveChecked ? "checked" : "unchecked";
    
    return (
      <div className={cn(
        getContainerClasses(orientation),
        containerClassName
      )}>
        <div className="relative inline-flex items-center">
          <input
            type="checkbox"
            id={toggleId}
            ref={ref}
            checked={checked}
            defaultChecked={defaultChecked}
            onChange={handleChange}
            disabled={disabled}
            className="sr-only"
            aria-checked={effectiveChecked}
            {...props}
          />
          
          <label
            htmlFor={toggleId}
            data-state={dataState}
            className={cn(
              getTrackClasses(variant, size, disabled),
              className
            )}
          >
            <span 
              data-state={dataState}
              className={cn(
                getThumbClasses(size),
                "absolute left-0.5 top-0.5"
              )}
            />
            <span className="sr-only">{label || "Toggle"}</span>
          </label>
        </div>
        
        {label && (
          <label
            htmlFor={toggleId}
            className="text-sm font-medium text-gray-700"
          >
            {label}
          </label>
        )}
        
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

Toggle.displayName = "Toggle";

export default Toggle; 