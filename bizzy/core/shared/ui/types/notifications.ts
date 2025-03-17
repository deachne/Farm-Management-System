import React from 'react';

/**
 * Notification severity enum - matches both AnythingLLM and LibreChat notification types
 */
export enum NotificationSeverity {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
}

/**
 * Toast notification props
 */
export interface ToastProps {
  id: string;
  title?: string;
  description: string;
  action?: React.ReactNode;
  severity?: NotificationSeverity;
  duration?: number;
  showIcon?: boolean;
  source?: 'anythingllm' | 'librechat';
  onDismiss?: () => void;
  open?: boolean;
}

/**
 * Show toast notification options
 */
export interface ShowToastOptions {
  message: string;
  type?: NotificationSeverity | 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  showIcon?: boolean;
  source?: 'anythingllm' | 'librechat';
  title?: string;
  action?: React.ReactNode;
} 