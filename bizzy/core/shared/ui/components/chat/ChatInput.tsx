import React, { useState, useRef, useEffect, KeyboardEvent } from "react";
import { cn } from "../../lib/utils";
import { Button } from "../Button";
import { PaperPlaneIcon } from "./icons/PaperPlaneIcon";
import { AttachmentIcon } from "./icons/AttachmentIcon";
import { MicrophoneIcon } from "./icons/MicrophoneIcon";

export interface ChatInputProps {
  /**
   * Function called when a message is submitted
   */
  onSubmit?: (message: string) => void;
  /**
   * Function called when the input value changes
   */
  onChange?: (value: string) => void;
  /**
   * Initial value for the input
   */
  initialValue?: string;
  /**
   * Placeholder text for the input
   */
  placeholder?: string;
  /**
   * Whether the input is disabled
   */
  disabled?: boolean;
  /**
   * Whether to show the send button
   */
  showSendButton?: boolean;
  /**
   * Whether to show the attachment button
   */
  showAttachmentButton?: boolean;
  /**
   * Whether to show the voice input button
   */
  showVoiceButton?: boolean;
  /**
   * Custom CSS class for the input container
   */
  className?: string;
  /**
   * Maximum height of the input area in pixels
   */
  maxHeight?: number;
  /**
   * Function called when a file is attached
   */
  onAttachment?: (files: FileList) => void;
  /**
   * Function called when voice input is toggled
   */
  onVoiceInputToggle?: (isRecording: boolean) => void;
  /**
   * Whether a message is currently being processed/generated
   */
  isProcessing?: boolean;
}

export function ChatInput({
  onSubmit,
  onChange,
  initialValue = "",
  placeholder = "Type a message...",
  disabled = false,
  showSendButton = true,
  showAttachmentButton = true,
  showVoiceButton = true,
  className,
  maxHeight = 200,
  onAttachment,
  onVoiceInputToggle,
  isProcessing = false,
}: ChatInputProps) {
  const [message, setMessage] = useState(initialValue);
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Auto-resize the textarea as content grows
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = 
        `${Math.min(scrollHeight, maxHeight)}px`;
    }
  }, [message, maxHeight]);
  
  // Handle message submission
  const handleSubmit = () => {
    if (message.trim() && !disabled && !isProcessing) {
      onSubmit?.(message.trim());
      setMessage("");
      
      // Reset height after submission
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };
  
  // Handle text changes
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    onChange?.(e.target.value);
  };
  
  // Handle keyboard shortcuts (Ctrl/Cmd + Enter to submit)
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };
  
  // Handle attachment button click
  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };
  
  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onAttachment?.(e.target.files);
    }
  };
  
  // Handle voice input toggle
  const handleVoiceToggle = () => {
    const newState = !isRecording;
    setIsRecording(newState);
    onVoiceInputToggle?.(newState);
  };

  return (
    <div 
      className={cn(
        "flex flex-col rounded-lg border bg-background p-2",
        disabled && "opacity-50",
        className
      )}
    >
      <div className="relative flex w-full items-end gap-1.5">
        {showAttachmentButton && (
          <>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="h-8 w-8 shrink-0"
              onClick={handleAttachmentClick}
              disabled={disabled || isProcessing}
              aria-label="Attach files"
            >
              <AttachmentIcon className="h-5 w-5" />
            </Button>
            <input 
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
              multiple
            />
          </>
        )}
        
        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled || isProcessing}
          className={cn(
            "flex-1 resize-none border-0 bg-transparent p-2 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0",
            "max-h-[inherit] min-h-[40px] w-full"
          )}
          style={{ overflow: message.length > 150 ? "auto" : "hidden" }}
        />
        
        {showVoiceButton && (
          <Button
            type="button"
            size="sm"
            variant={isRecording ? "primary" : "ghost"}
            className={cn("h-8 w-8 shrink-0", isRecording && "text-red-500")}
            onClick={handleVoiceToggle}
            disabled={disabled || isProcessing}
            aria-label={isRecording ? "Stop recording" : "Start voice input"}
          >
            <MicrophoneIcon className="h-5 w-5" />
          </Button>
        )}
        
        {showSendButton && (
          <Button
            type="button"
            size="sm"
            variant="primary"
            className="h-8 w-8 shrink-0"
            onClick={handleSubmit}
            disabled={!message.trim() || disabled || isProcessing}
            aria-label="Send message"
          >
            <PaperPlaneIcon className="h-5 w-5" />
          </Button>
        )}
      </div>
    </div>
  );
} 