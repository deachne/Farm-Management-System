import React, { createContext, forwardRef, useContext, useId } from 'react';
import { cn } from '../lib/utils';

type RadioGroupContextValue = {
  name: string;
  value?: string;
  onChange?: (value: string) => void;
};

const RadioGroupContext = createContext<RadioGroupContextValue | undefined>(undefined);

export interface RadioGroupProps extends Omit<React.FieldsetHTMLAttributes<HTMLFieldSetElement>, 'onChange'> {
  /**
   * Name attribute to group radio buttons
   */
  name: string;
  /**
   * Selected value for the radio group
   */
  value?: string;
  /**
   * Handler for change events
   */
  onChange?: (value: string) => void;
  /**
   * Label for the radio group (will be rendered as a legend)
   */
  label?: string;
  /**
   * Whether to display the label
   */
  hideLabel?: boolean;
  /**
   * Helper text to display below the radio group
   */
  helperText?: string;
  /**
   * Error message to display below the radio group
   */
  errorMessage?: string;
  /**
   * Orientation of radio options
   */
  orientation?: 'vertical' | 'horizontal';
  /**
   * Additional class names for the radio group
   */
  className?: string;
}

/**
 * RadioGroup component for grouping multiple Radio buttons
 */
export const RadioGroup = forwardRef<HTMLFieldSetElement, RadioGroupProps>(
  ({
    name,
    value,
    onChange,
    label,
    hideLabel = false,
    helperText,
    errorMessage,
    orientation = 'vertical',
    className,
    children,
    ...props
  }, ref) => {
    const id = useId();
    const groupId = props.id || `radio-group-${id}`;
    
    return (
      <RadioGroupContext.Provider value={{ name, value, onChange }}>
        <fieldset
          ref={ref}
          id={groupId}
          className={cn(
            'space-y-2',
            className
          )}
          {...props}
        >
          {label && !hideLabel && (
            <legend className={cn(
              "text-sm font-medium text-theme-text-primary mb-2",
              errorMessage && "text-theme-status-error"
            )}>
              {label}
            </legend>
          )}
          
          <div className={cn(
            "space-y-2",
            orientation === 'horizontal' && "flex items-center space-y-0 space-x-4"
          )}>
            {children}
          </div>
          
          {errorMessage && (
            <p className="mt-1 text-sm text-theme-status-error">
              {errorMessage}
            </p>
          )}
          
          {!errorMessage && helperText && (
            <p className="mt-1 text-sm text-theme-text-secondary">
              {helperText}
            </p>
          )}
        </fieldset>
      </RadioGroupContext.Provider>
    );
  }
);

RadioGroup.displayName = "RadioGroup";

/**
 * Hook to get radio group context
 */
export const useRadioGroup = () => {
  const context = useContext(RadioGroupContext);
  if (context === undefined) {
    throw new Error("useRadioGroup must be used within a RadioGroup");
  }
  return context;
};

export default RadioGroup; 