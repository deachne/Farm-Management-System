import React from "react";
import { cn } from "../../lib/utils";

export interface TypingIndicatorProps {
  /**
   * Optional CSS class for the typing indicator
   */
  className?: string;
}

export function TypingIndicator({ className }: TypingIndicatorProps) {
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className="h-2 w-2 animate-bounce rounded-full bg-current opacity-60 [animation-delay:-0.3s]"></div>
      <div className="h-2 w-2 animate-bounce rounded-full bg-current opacity-60 [animation-delay:-0.15s]"></div>
      <div className="h-2 w-2 animate-bounce rounded-full bg-current opacity-60"></div>
    </div>
  );
} 