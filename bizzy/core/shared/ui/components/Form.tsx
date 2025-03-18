import React, { forwardRef } from 'react';
import { cn } from '../utils/cn';

/**
 * Form component props
 */
export interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  /**
   * Whether to show the form in a vertical layout (default)
   * or horizontal layout
   * @default true
   */
  vertical?: boolean;
}

/**
 * Form component that follows the BizzyPerson design system
 */
export const Form = forwardRef<HTMLFormElement, FormProps>(
  ({ className, vertical = true, ...props }, ref) => (
    <form
      ref={ref}
      className={cn(
        "w-full",
        vertical ? "space-y-4" : "",
        className
      )}
      {...props}
    />
  )
);
Form.displayName = "Form";

/**
 * FormGroup component props
 */
export interface FormGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Whether to show the form group in a vertical layout (default)
   * or horizontal layout
   * @default true 
   */
  vertical?: boolean;

  /**
   * When in horizontal layout, this controls the width of the label
   * @default '1/3'
   */
  labelWidth?: '1/4' | '1/3' | '1/2' | '2/3' | '3/4';
}

/**
 * FormGroup component
 */
export const FormGroup = forwardRef<HTMLDivElement, FormGroupProps>(
  ({ className, vertical = true, labelWidth = '1/3', ...props }, ref) => {
    const labelWidthClass = {
      '1/4': 'w-1/4',
      '1/3': 'w-1/3',
      '1/2': 'w-1/2',
      '2/3': 'w-2/3',
      '3/4': 'w-3/4',
    }[labelWidth];

    return (
      <div
        ref={ref}
        className={cn(
          "w-full",
          vertical ? "flex flex-col space-y-1.5" : "flex flex-row items-start",
          className
        )}
        data-label-width={labelWidth}
        data-vertical={vertical}
        {...props}
      />
    );
  }
);
FormGroup.displayName = "FormGroup";

/**
 * FormLabel component props
 */
export interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  /**
   * Whether this label is for a required field
   */
  required?: boolean;
}

/**
 * FormLabel component
 */
export const FormLabel = forwardRef<HTMLLabelElement, FormLabelProps>(
  ({ className, required, children, ...props }, ref) => {
    const parentFormGroup = React.useContext(FormGroupContext);
    const isHorizontal = parentFormGroup && !parentFormGroup.vertical;
    const labelWidth = parentFormGroup?.labelWidth || '1/3';
    
    const labelWidthClass = isHorizontal ? {
      '1/4': 'w-1/4',
      '1/3': 'w-1/3',
      '1/2': 'w-1/2', 
      '2/3': 'w-2/3',
      '3/4': 'w-3/4',
    }[labelWidth] : '';

    return (
      <label
        ref={ref}
        className={cn(
          "text-sm font-medium text-theme-text-primary",
          isHorizontal && `${labelWidthClass} pr-4 py-2`,
          className
        )}
        {...props}
      >
        {children}
        {required && <span className="text-theme-status-error ml-1">*</span>}
      </label>
    );
  }
);
FormLabel.displayName = "FormLabel";

/**
 * FormField component props
 */
export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * FormField component
 */
export const FormField = forwardRef<HTMLDivElement, FormFieldProps>(
  ({ className, ...props }, ref) => {
    const parentFormGroup = React.useContext(FormGroupContext);
    const isHorizontal = parentFormGroup && !parentFormGroup.vertical;
    
    return (
      <div
        ref={ref}
        className={cn(
          "w-full",
          isHorizontal && "flex-1",
          className
        )}
        {...props}
      />
    );
  }
);
FormField.displayName = "FormField";

/**
 * FormDescription component props
 */
export interface FormDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

/**
 * FormDescription component
 */
export const FormDescription = forwardRef<HTMLParagraphElement, FormDescriptionProps>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-sm text-theme-text-secondary", className)}
      {...props}
    />
  )
);
FormDescription.displayName = "FormDescription";

/**
 * FormMessage component props
 */
export interface FormMessageProps extends React.HTMLAttributes<HTMLParagraphElement> {
  /**
   * Type of message to display - error, warning, or success
   * @default 'error'
   */
  type?: 'error' | 'warning' | 'success';
}

/**
 * FormMessage component
 */
export const FormMessage = forwardRef<HTMLParagraphElement, FormMessageProps>(
  ({ className, type = 'error', ...props }, ref) => {
    const messageColorClass = {
      'error': 'text-theme-status-error',
      'warning': 'text-theme-status-warning',
      'success': 'text-theme-status-success',
    }[type];

    return (
      <p
        ref={ref}
        className={cn(
          "text-sm mt-1.5", 
          messageColorClass,
          className
        )}
        {...props}
      />
    );
  }
);
FormMessage.displayName = "FormMessage";

// Create a context to pass down form group properties to children
interface FormGroupContextValue {
  vertical: boolean;
  labelWidth: FormGroupProps['labelWidth'];
}

const FormGroupContext = React.createContext<FormGroupContextValue | null>(null);

// Update FormGroup to provide context
export const FormGroupWithContext = forwardRef<HTMLDivElement, FormGroupProps>(
  ({ className, vertical = true, labelWidth = '1/3', children, ...props }, ref) => {
    return (
      <FormGroupContext.Provider value={{ vertical, labelWidth }}>
        <div
          ref={ref}
          className={cn(
            "w-full",
            vertical ? "flex flex-col space-y-1.5" : "flex flex-row items-start",
            className
          )}
          {...props}
        >
          {children}
        </div>
      </FormGroupContext.Provider>
    );
  }
);
FormGroupWithContext.displayName = "FormGroup";

// Export the context-enabled version instead
export { FormGroupWithContext as FormGroup };

export default Form; 