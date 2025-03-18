import React from "react";
import { cn } from "../../lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../Avatar";
import { TypingIndicator } from "./TypingIndicator";

export interface ChatMessageProps {
  /**
   * Message content
   */
  content: string;
  /**
   * Message role (user, assistant, system)
   */
  role: "user" | "assistant" | "system";
  /**
   * Avatar URL for the message sender
   */
  avatarSrc?: string;
  /**
   * Avatar fallback for the message sender (typically initials)
   */
  avatarFallback?: string;
  /**
   * Custom CSS class to apply to the message container
   */
  className?: string;
  /**
   * Indicates if message is currently being typed/generated
   */
  isTyping?: boolean;
  /**
   * Timestamp for when the message was sent
   */
  timestamp?: string;
  /**
   * Additional metadata for the message
   */
  metadata?: Record<string, any>;
  /**
   * Whether to show the timestamp
   */
  showTimestamp?: boolean;
  /**
   * Optional sender name to display
   */
  senderName?: string;
}

export function ChatMessage({
  content,
  role = "assistant",
  avatarSrc,
  avatarFallback,
  className,
  isTyping = false,
  timestamp,
  metadata,
  showTimestamp = false,
  senderName,
}: ChatMessageProps) {
  const isUser = role === "user";
  const isSystem = role === "system";
  
  // Generate avatar fallback if not provided
  const fallback = avatarFallback || (isUser ? "U" : isSystem ? "S" : "A");
  
  // Classes for different message types
  const messageContainerClasses = cn(
    "flex items-start gap-3 py-4 px-4 max-w-[85%]",
    isUser ? "ml-auto" : "mr-auto",
    className
  );
  
  const messageBubbleClasses = cn(
    "rounded-xl px-4 py-3",
    isUser 
      ? "bg-primary text-primary-foreground" 
      : isSystem 
        ? "bg-muted text-muted-foreground" 
        : "bg-accent text-accent-foreground",
    "shadow-sm"
  );

  return (
    <div className={messageContainerClasses}>
      {!isUser && (
        <Avatar className="h-8 w-8">
          {avatarSrc ? <AvatarImage src={avatarSrc} alt={role} /> : null}
          <AvatarFallback>{fallback}</AvatarFallback>
        </Avatar>
      )}
      <div className="flex flex-col gap-1">
        {senderName && (
          <span className="text-xs text-muted-foreground font-medium">
            {senderName}
          </span>
        )}
        <div className={messageBubbleClasses}>
          {isTyping ? (
            <TypingIndicator />
          ) : (
            <div className="whitespace-pre-wrap break-words">
              {content}
            </div>
          )}
        </div>
        {showTimestamp && timestamp && (
          <span className="text-xs text-muted-foreground mt-1">
            {timestamp}
          </span>
        )}
      </div>
      {isUser && (
        <Avatar className="h-8 w-8">
          {avatarSrc ? <AvatarImage src={avatarSrc} alt={role} /> : null}
          <AvatarFallback>{fallback}</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
} 