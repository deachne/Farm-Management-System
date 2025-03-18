import React from 'react';
import PropTypes from 'prop-types';

/**
 * Card component for containing content with consistent styling
 */
const Card = ({
  title,
  subtitle,
  children,
  footer,
  variant = 'default',
  onClick,
  interactive = false,
  ...props
}) => {
  const baseStyle = {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: variant === 'elevated' 
      ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' 
      : variant === 'bordered'
        ? 'none'
        : '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    border: variant === 'bordered' ? '1px solid #e5e7eb' : 'none',
    overflow: 'hidden',
    transition: 'all 0.2s ease',
    cursor: interactive ? 'pointer' : 'default',
    fontFamily: '"Inter", sans-serif',
  };

  const hoverStyle = interactive 
    ? {
        transform: 'translateY(-2px)',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      }
    : {};

  // Combine styles with hover effect if interactive
  const [style, setStyle] = React.useState(baseStyle);

  const handleMouseEnter = () => {
    if (interactive) {
      setStyle({ ...baseStyle, ...hoverStyle });
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setStyle(baseStyle);
    }
  };

  return (
    <div
      style={style}
      onClick={interactive ? onClick : undefined}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {(title || subtitle) && (
        <div style={{ padding: '16px 16px 0 16px' }}>
          {title && (
            <h3 style={{ 
              margin: '0', 
              fontSize: '18px', 
              fontWeight: '600', 
              color: '#111827'
            }}>
              {title}
            </h3>
          )}
          
          {subtitle && (
            <p style={{ 
              margin: subtitle && title ? '4px 0 0 0' : '0', 
              fontSize: '14px', 
              color: '#6b7280'
            }}>
              {subtitle}
            </p>
          )}
        </div>
      )}
      
      <div style={{ padding: '16px' }}>
        {children}
      </div>
      
      {footer && (
        <div style={{ 
          padding: '12px 16px', 
          borderTop: '1px solid #e5e7eb',
          backgroundColor: '#f9fafb'
        }}>
          {footer}
        </div>
      )}
    </div>
  );
};

Card.propTypes = {
  /**
   * Card title
   */
  title: PropTypes.node,
  /**
   * Card subtitle
   */
  subtitle: PropTypes.node,
  /**
   * Card content
   */
  children: PropTypes.node.isRequired,
  /**
   * Optional footer content
   */
  footer: PropTypes.node,
  /**
   * Card variant
   */
  variant: PropTypes.oneOf(['default', 'elevated', 'bordered']),
  /**
   * Click handler (only used if interactive is true)
   */
  onClick: PropTypes.func,
  /**
   * Whether the card is interactive (clickable with hover effects)
   */
  interactive: PropTypes.bool,
};

export default Card; 