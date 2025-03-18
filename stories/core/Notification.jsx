import React from 'react';
import PropTypes from 'prop-types';

/**
 * Notification component for displaying alerts and messages
 */
const Notification = ({
  title,
  message,
  type = 'info',
  onDismiss,
  autoClose = true,
  duration = 5000,
  showIcon = true,
  ...props
}) => {
  const [visible, setVisible] = React.useState(true);
  const timer = React.useRef(null);
  
  // Set up auto-dismiss timer
  React.useEffect(() => {
    if (autoClose && visible) {
      timer.current = setTimeout(() => {
        handleDismiss();
      }, duration);
    }
    
    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
  }, [autoClose, duration, visible]);
  
  // Create a style tag for the animation
  React.useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      @keyframes progressBar {
        0% { width: 100%; }
        100% { width: 0%; }
      }
    `;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);
  
  const handleDismiss = () => {
    setVisible(false);
    if (onDismiss) {
      onDismiss();
    }
  };
  
  if (!visible) {
    return null;
  }
  
  // Configure styles based on notification type
  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          backgroundColor: '#ecfdf5',
          borderColor: '#10b981',
          iconColor: '#10b981',
          icon: '✓',
        };
      case 'error':
        return {
          backgroundColor: '#fef2f2',
          borderColor: '#ef4444',
          iconColor: '#ef4444',
          icon: '✗',
        };
      case 'warning':
        return {
          backgroundColor: '#fffbeb',
          borderColor: '#f59e0b',
          iconColor: '#f59e0b',
          icon: '⚠',
        };
      case 'info':
      default:
        return {
          backgroundColor: '#eff6ff',
          borderColor: '#3b82f6',
          iconColor: '#3b82f6',
          icon: 'ℹ',
        };
    }
  };
  
  const typeStyles = getTypeStyles();
  
  const notificationStyle = {
    display: 'flex',
    alignItems: 'flex-start',
    padding: '12px 16px',
    backgroundColor: typeStyles.backgroundColor,
    borderLeft: `4px solid ${typeStyles.borderColor}`,
    borderRadius: '6px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    marginBottom: '16px',
    maxWidth: '400px',
    fontFamily: '"Inter", sans-serif',
    position: 'relative',
    overflow: 'hidden',
  };
  
  const contentStyle = {
    flex: 1,
  };
  
  const titleStyle = {
    margin: '0 0 4px 0',
    fontSize: '14px',
    fontWeight: '600',
    color: '#111827',
  };
  
  const messageStyle = {
    margin: 0,
    fontSize: '14px',
    color: '#4b5563',
  };
  
  const iconStyle = {
    color: typeStyles.iconColor,
    fontSize: '16px',
    marginRight: '12px',
    marginTop: '2px',
  };
  
  const dismissButtonStyle = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    color: '#9ca3af',
    padding: '4px',
    marginLeft: '12px',
    marginTop: '-4px',
  };
  
  const progressBarStyle = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: '2px',
    backgroundColor: typeStyles.borderColor,
    width: '100%',
    animation: autoClose ? `progressBar ${duration}ms linear` : 'none',
  };
  
  return (
    <div style={notificationStyle} {...props}>
      {showIcon && <div style={iconStyle}>{typeStyles.icon}</div>}
      
      <div style={contentStyle}>
        {title && <h4 style={titleStyle}>{title}</h4>}
        {message && <p style={messageStyle}>{message}</p>}
      </div>
      
      <button style={dismissButtonStyle} onClick={handleDismiss} aria-label="Dismiss">
        ×
      </button>
      
      {autoClose && <div style={progressBarStyle} />}
    </div>
  );
};

Notification.propTypes = {
  /**
   * The title of the notification
   */
  title: PropTypes.string,
  /**
   * The message content
   */
  message: PropTypes.string,
  /**
   * The type of notification
   */
  type: PropTypes.oneOf(['info', 'success', 'warning', 'error']),
  /**
   * Function to call when notification is dismissed
   */
  onDismiss: PropTypes.func,
  /**
   * Whether the notification should automatically close
   */
  autoClose: PropTypes.bool,
  /**
   * Duration in milliseconds before auto-closing
   */
  duration: PropTypes.number,
  /**
   * Whether to show the notification icon
   */
  showIcon: PropTypes.bool,
};

export default Notification; 