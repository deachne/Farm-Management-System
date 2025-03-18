import React, { useState } from 'react';
import PropTypes from 'prop-types';

/**
 * Input component with validation capabilities
 */
const Input = ({
  id,
  name,
  value,
  onChange,
  label,
  placeholder,
  type = 'text',
  disabled = false,
  required = false,
  error = '',
  helperText = '',
  validation = null,
  onValidate = () => {},
  fullWidth = false,
  size = 'medium',
  className = '',
  ...props
}) => {
  const [focused, setFocused] = useState(false);
  const [localError, setLocalError] = useState('');
  const [touched, setTouched] = useState(false);
  
  // Combined error from props and local validation
  const displayError = error || localError;
  
  // Handle input changes
  const handleChange = (e) => {
    const newValue = e.target.value;
    
    // Call the parent onChange handler
    if (onChange) {
      onChange(e);
    }
    
    // Run validation if provided
    if (validation && touched) {
      try {
        const validationResult = validation(newValue);
        if (validationResult !== true) {
          setLocalError(validationResult);
          onValidate(false, validationResult);
        } else {
          setLocalError('');
          onValidate(true, '');
        }
      } catch (err) {
        setLocalError('Validation error');
        onValidate(false, 'Validation error');
      }
    }
  };
  
  // Handle blur events for validation
  const handleBlur = (e) => {
    setFocused(false);
    setTouched(true);
    
    if (validation) {
      try {
        const validationResult = validation(e.target.value);
        if (validationResult !== true) {
          setLocalError(validationResult);
          onValidate(false, validationResult);
        } else {
          setLocalError('');
          onValidate(true, '');
        }
      } catch (err) {
        setLocalError('Validation error');
        onValidate(false, 'Validation error');
      }
    }
    
    if (props.onBlur) {
      props.onBlur(e);
    }
  };
  
  // Size-specific styles
  const sizeStyles = {
    small: {
      padding: '6px 10px',
      fontSize: '12px',
      borderRadius: '4px',
    },
    medium: {
      padding: '8px 12px',
      fontSize: '14px',
      borderRadius: '6px',
    },
    large: {
      padding: '10px 14px',
      fontSize: '16px',
      borderRadius: '8px',
    },
  };
  
  // Base styles
  const containerStyle = {
    display: 'inline-flex',
    flexDirection: 'column',
    width: fullWidth ? '100%' : 'auto',
    marginBottom: '16px',
    backgroundColor: 'transparent',
  };
  
  const labelStyle = {
    marginBottom: '6px',
    fontSize: '14px',
    fontWeight: 500,
    color: disabled ? '#9ca3af' : '#374151',
    backgroundColor: 'transparent',
  };
  
  const inputStyle = {
    ...sizeStyles[size],
    width: '100%',
    border: `1px solid ${displayError ? '#f87171' : focused ? '#38bdf8' : '#d1d5db'}`,
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    outline: 'none',
    backgroundColor: disabled ? '#f3f4f6' : '#ffffff',
    color: disabled ? '#9ca3af' : '#1f2937',
    boxShadow: focused ? `0 0 0 2px ${displayError ? 'rgba(248, 113, 113, 0.2)' : 'rgba(56, 189, 248, 0.2)'}` : 'none',
  };
  
  const helperTextStyle = {
    fontSize: '12px',
    marginTop: '4px',
    color: '#6b7280',
  };
  
  const errorTextStyle = {
    fontSize: '12px',
    marginTop: '4px',
    color: '#dc2626',
  };
  
  return (
    <div style={containerStyle} className={className}>
      {label && (
        <label 
          htmlFor={id || name} 
          style={labelStyle}
        >
          {label}
          {required && <span style={{ color: '#ef4444', marginLeft: '4px' }}>*</span>}
        </label>
      )}
      
      <input
        id={id || name}
        name={name}
        type={type}
        value={value}
        onChange={handleChange}
        onFocus={() => setFocused(true)}
        onBlur={handleBlur}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        style={inputStyle}
        aria-invalid={!!displayError}
        aria-describedby={
          (displayError ? `${id || name}-error` : '') ||
          (helperText ? `${id || name}-helper` : '')
        }
        {...props}
      />
      
      {/* Helper text */}
      {helperText && !displayError && (
        <p 
          id={`${id || name}-helper`}
          style={helperTextStyle}
        >
          {helperText}
        </p>
      )}
      
      {/* Error message */}
      {displayError && (
        <p 
          id={`${id || name}-error`}
          style={errorTextStyle}
          role="alert"
        >
          {displayError}
        </p>
      )}
    </div>
  );
};

Input.propTypes = {
  /**
   * Input id
   */
  id: PropTypes.string,
  /**
   * Input name
   */
  name: PropTypes.string,
  /**
   * Input value
   */
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  /**
   * Function called on input change
   */
  onChange: PropTypes.func,
  /**
   * Input label
   */
  label: PropTypes.string,
  /**
   * Input placeholder
   */
  placeholder: PropTypes.string,
  /**
   * Input type
   */
  type: PropTypes.oneOf([
    'text', 'email', 'password', 'number', 'tel', 'url', 'search', 'date'
  ]),
  /**
   * Is input disabled?
   */
  disabled: PropTypes.bool,
  /**
   * Is input required?
   */
  required: PropTypes.bool,
  /**
   * Error message to display
   */
  error: PropTypes.string,
  /**
   * Helper text for additional information
   */
  helperText: PropTypes.string,
  /**
   * Validation function that returns true if valid, or error message if invalid
   */
  validation: PropTypes.func,
  /**
   * Function called after validation
   */
  onValidate: PropTypes.func,
  /**
   * Should input take full width of container?
   */
  fullWidth: PropTypes.bool,
  /**
   * Input size variant
   */
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  /**
   * Additional CSS class
   */
  className: PropTypes.string,
};

export default Input; 