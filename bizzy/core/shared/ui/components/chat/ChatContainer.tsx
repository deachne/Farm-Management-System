import React, { useState, useRef, useEffect } from "react";
import { cn } from "../../lib/utils";
import { ChatMessage, ChatMessageProps } from "./ChatMessage";
import { ChatInput } from "./ChatInput";

export interface ChatContainerProps {
  /**
   * List of messages to display
   */
  messages: ChatMessageProps[];
  /**
   * Function called when a new message is submitted
   */
  onSendMessage?: (message: string) => void;
  /**
   * Whether a message is currently being processed/generated
   */
  isProcessing?: boolean;
  /**
   * Custom CSS class for the chat container
   */
  className?: string;
  /**
   * Text to show in the input placeholder
   */
  inputPlaceholder?: string;
  /**
   * Whether the input should be disabled
   */
  inputDisabled?: boolean;
  /**
   * Whether to auto-scroll to the bottom on new messages
   */
  autoScroll?: boolean;
  /**
   * Whether to show file attachment option
   */
  showAttachment?: boolean;
  /**
   * Whether to show voice input option
   */
  showVoiceInput?: boolean;
  /**
   * Function called when files are attached
   */
  onAttachment?: (files: FileList) => void;
}

export function ChatContainer({
  messages = [],
  onSendMessage,
  isProcessing = false,
  className,
  inputPlaceholder,
  inputDisabled = false,
  autoScroll = true,
  showAttachment = true,
  showVoiceInput = true,
  onAttachment,
}: ChatContainerProps) {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  
  // Auto-scroll to bottom when new messages are added
  const scrollToBottom = () => {
    if (messagesEndRef.current && autoScroll) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages, isProcessing, autoScroll]);
  
  return (
    <div className={cn("flex h-full flex-col overflow-hidden", className)}>
      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex flex-col gap-4">
          {messages.map((message, index) => (
            <ChatMessage key={index} {...message} />
          ))}
          
          {/* Typing indicator message */}
          {isProcessing && (
            <ChatMessage
              content=""
              role="assistant"
              isTyping={true}
            />
          )}
          
          {/* Reference for auto-scrolling */}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      <div className="border-t p-4">
        <ChatInput
          onSubmit={onSendMessage}
          placeholder={inputPlaceholder}
          disabled={inputDisabled}
          isProcessing={isProcessing}
          showAttachmentButton={showAttachment}
          showVoiceButton={showVoiceInput}
          onAttachment={onAttachment}
        />
      </div>
    </div>
  );
} 