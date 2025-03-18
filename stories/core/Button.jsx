import React from 'react';
import PropTypes from 'prop-types';

/**
 * Primary UI component for user interaction
 */
const Button = ({
  primary = false,
  size = 'medium',
  variant = 'default',
  backgroundColor,
  label,
  onClick,
  disabled = false,
  ...props
}) => {
  const baseStyle = {
    fontFamily: '"Inter", sans-serif',
    fontWeight: 500,
    border: 0,
    borderRadius: '6px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    lineHeight: 1,
    opacity: disabled ? 0.6 : 1,
  };

  // Size styles
  const sizeStyles = {
    small: {
      fontSize: '12px',
      padding: '8px 12px',
    },
    medium: {
      fontSize: '14px',
      padding: '10px 16px',
    },
    large: {
      fontSize: '16px',
      padding: '12px 20px',
    },
  };

  // Variant styles based on AnythingLLM design
  const variantStyles = {
    default: {
      color: primary ? 'white' : '#1a1a1a',
      backgroundColor: primary ? '#3b82f6' : '#e5e7eb',
      boxShadow: 'none',
      ':hover': {
        backgroundColor: primary ? '#2563eb' : '#d1d5db',
      },
    },
    outline: {
      color: primary ? '#3b82f6' : '#4b5563',
      backgroundColor: 'transparent',
      boxShadow: `inset 0 0 0 1px ${primary ? '#3b82f6' : '#d1d5db'}`,
      ':hover': {
        backgroundColor: primary ? 'rgba(59, 130, 246, 0.05)' : 'rgba(0, 0, 0, 0.02)',
      },
    },
    ghost: {
      color: primary ? '#3b82f6' : '#4b5563',
      backgroundColor: 'transparent',
      boxShadow: 'none',
      ':hover': {
        backgroundColor: primary ? 'rgba(59, 130, 246, 0.05)' : 'rgba(0, 0, 0, 0.02)',
      },
    },
  };

  // Combine styles
  const style = {
    ...baseStyle,
    ...sizeStyles[size],
    ...variantStyles[variant],
    backgroundColor: backgroundColor || (variantStyles[variant]?.backgroundColor || 'transparent'),
  };

  return (
    <button
      type="button"
      disabled={disabled}
      style={style}
      onClick={onClick}
      {...props}
    >
      {label}
    </button>
  );
};

Button.propTypes = {
  /**
   * Is this the principal call to action on the page?
   */
  primary: PropTypes.bool,
  /**
   * What background color to use
   */
  backgroundColor: PropTypes.string,
  /**
   * Button contents
   */
  label: PropTypes.string.isRequired,
  /**
   * Optional click handler
   */
  onClick: PropTypes.func,
  /**
   * How large should the button be?
   */
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  /**
   * Button variant
   */
  variant: PropTypes.oneOf(['default', 'outline', 'ghost']),
  /**
   * Is the button disabled?
   */
  disabled: PropTypes.bool,
};

export default Button; 