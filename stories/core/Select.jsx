import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * Select component for choosing from a list of options
 */
const Select = ({
  id,
  name,
  value = '',
  onChange,
  options = [],
  label,
  placeholder = 'Select an option',
  disabled = false,
  required = false,
  error = '',
  helperText = '',
  fullWidth = false,
  size = 'medium',
  className = '',
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const dropdownRef = useRef(null);
  
  // Find the selected option based on the current value
  const selectedOption = options.find(option => 
    option.value === value || option.value === String(value) || String(option.value) === value
  );
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Handle option selection
  const handleSelectOption = (option) => {
    if (disabled) return;
    
    if (onChange) {
      // Create a synthetic event similar to a native change event
      const syntheticEvent = {
        target: {
          name,
          value: option.value,
        },
      };
      onChange(syntheticEvent);
    }
    
    setIsOpen(false);
  };
  
  // Toggle dropdown
  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };
  
  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (disabled) return;
    
    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        toggleDropdown();
        break;
      case 'Escape':
        setIsOpen(false);
        break;
      case 'ArrowDown':
        if (!isOpen) {
          setIsOpen(true);
        } else {
          // Focus next option
          e.preventDefault();
          const currentIndex = selectedOption 
            ? options.findIndex(option => option.value === selectedOption.value) 
            : -1;
          const nextIndex = currentIndex < options.length - 1 ? currentIndex + 1 : 0;
          handleSelectOption(options[nextIndex]);
        }
        break;
      case 'ArrowUp':
        if (!isOpen) {
          setIsOpen(true);
        } else {
          // Focus previous option
          e.preventDefault();
          const currentIndex = selectedOption 
            ? options.findIndex(option => option.value === selectedOption.value) 
            : 0;
          const prevIndex = currentIndex > 0 ? currentIndex - 1 : options.length - 1;
          handleSelectOption(options[prevIndex]);
        }
        break;
      default:
        break;
    }
  };
  
  // Size-specific styles
  const sizeStyles = {
    small: {
      height: '32px',
      fontSize: '12px',
      borderRadius: '4px',
      padding: '0 8px',
    },
    medium: {
      height: '40px',
      fontSize: '14px',
      borderRadius: '6px',
      padding: '0 12px',
    },
    large: {
      height: '48px',
      fontSize: '16px',
      borderRadius: '8px',
      padding: '0 16px',
    },
  };
  
  // Base styles
  const containerStyle = {
    display: 'inline-flex',
    flexDirection: 'column',
    width: fullWidth ? '100%' : '240px',
    marginBottom: '16px',
    position: 'relative',
    backgroundColor: 'transparent',
  };
  
  const labelStyle = {
    marginBottom: '6px',
    fontSize: '14px',
    fontWeight: 500,
    color: disabled ? '#9ca3af' : '#374151',
    backgroundColor: 'transparent',
  };
  
  const selectStyle = {
    ...sizeStyles[size],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    border: `1px solid ${error ? '#f87171' : focused ? '#38bdf8' : '#d1d5db'}`,
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    outline: 'none',
    backgroundColor: disabled ? '#f3f4f6' : '#ffffff',
    color: disabled ? '#9ca3af' : selectedOption ? '#1f2937' : '#6b7280',
    boxShadow: focused ? `0 0 0 2px ${error ? 'rgba(248, 113, 113, 0.2)' : 'rgba(56, 189, 248, 0.2)'}` : 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    userSelect: 'none',
  };
  
  const dropdownStyle = {
    position: 'absolute',
    top: '100%',
    left: 0,
    width: '100%',
    maxHeight: '200px',
    overflowY: 'auto',
    backgroundColor: '#ffffff',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    zIndex: 10,
    marginTop: '4px',
    display: isOpen ? 'block' : 'none',
  };
  
  const optionStyle = (isSelected) => ({
    padding: '8px 12px',
    fontSize: '14px',
    cursor: 'pointer',
    backgroundColor: isSelected ? '#f3f4f6' : '#ffffff',
    color: isSelected ? '#1f2937' : '#4b5563',
    ':hover': {
      backgroundColor: '#f9fafb',
    },
  });
  
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
  
  const iconStyle = {
    marginLeft: '8px',
    transition: 'transform 0.2s ease',
    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
  };
  
  return (
    <div 
      style={containerStyle} 
      className={className}
      ref={dropdownRef}
    >
      {label && (
        <label 
          htmlFor={id || name} 
          style={labelStyle}
        >
          {label}
          {required && <span style={{ color: '#ef4444', marginLeft: '4px' }}>*</span>}
        </label>
      )}
      
      <div
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={`${id || name}-listbox`}
        aria-labelledby={`${id || name}-label`}
        aria-disabled={disabled}
        id={id || name}
        tabIndex={disabled ? -1 : 0}
        style={selectStyle}
        onClick={toggleDropdown}
        onKeyDown={handleKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...props}
      >
        <div>
          {selectedOption ? selectedOption.label : placeholder}
        </div>
        <div style={iconStyle}>▼</div>
      </div>
      
      {isOpen && (
        <ul
          id={`${id || name}-listbox`}
          role="listbox"
          aria-labelledby={`${id || name}-label`}
          style={dropdownStyle}
        >
          {options.length === 0 ? (
            <li style={{ padding: '8px 12px', color: '#6b7280' }}>No options available</li>
          ) : (
            options.map(option => (
              <li
                key={option.value}
                role="option"
                aria-selected={value === option.value}
                style={optionStyle(value === option.value)}
                onClick={() => handleSelectOption(option)}
              >
                {option.label}
              </li>
            ))
          )}
        </ul>
      )}
      
      {/* Helper text */}
      {helperText && !error && (
        <p 
          id={`${id || name}-helper`}
          style={helperTextStyle}
        >
          {helperText}
        </p>
      )}
      
      {/* Error message */}
      {error && (
        <p 
          id={`${id || name}-error`}
          style={errorTextStyle}
          role="alert"
        >
          {error}
        </p>
      )}
      
      {/* Hidden native select for form submission */}
      <input 
        type="hidden" 
        name={name} 
        value={value || ''}
        required={required}
      />
    </div>
  );
};

Select.propTypes = {
  /**
   * Select id
   */
  id: PropTypes.string,
  /**
   * Select name
   */
  name: PropTypes.string,
  /**
   * Selected value
   */
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  /**
   * Function called when selection changes
   */
  onChange: PropTypes.func,
  /**
   * Array of options to display
   */
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
      ]).isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
  /**
   * Select label
   */
  label: PropTypes.string,
  /**
   * Placeholder text when no option is selected
   */
  placeholder: PropTypes.string,
  /**
   * Is select disabled?
   */
  disabled: PropTypes.bool,
  /**
   * Is select required?
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
   * Should select take full width of container?
   */
  fullWidth: PropTypes.bool,
  /**
   * Select size variant
   */
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  /**
   * Additional CSS class
   */
  className: PropTypes.string,
};

// Ensure the component has an explicit displayName
Select.displayName = 'Select';

export default Select; 