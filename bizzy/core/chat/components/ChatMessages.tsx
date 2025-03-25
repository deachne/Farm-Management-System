import React, { RefObject, useState } from "react";
import { Message, Artifact } from "./ChatPage";

// Temporary cn utility function since the import is causing errors
function cn(...inputs: (string | boolean | undefined)[]) {
  return inputs.filter(Boolean).join(" ");
}

interface ChatMessagesProps {
  messages: Message[];
  isAiTyping: boolean;
  onSaveAsNote?: (messageId: string) => void;
  messagesEndRef: RefObject<HTMLDivElement>;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ 
  messages, 
  isAiTyping, 
  onSaveAsNote, 
  messagesEndRef 
}) => {
  const [expandedMessages, setExpandedMessages] = useState<Record<string, boolean>>({});
  
  const toggleMessageExpansion = (messageId: string) => {
    setExpandedMessages(prev => ({
      ...prev,
      [messageId]: !prev[messageId]
    }));
  };
  
  const copyMessageToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    console.log("Message copied to clipboard");
  };

  const renderStatusIcon = (status?: string) => {
    switch (status) {
      case "sending":
        return <span className="h-4 w-4 text-gray-400">⏱️</span>;
      case "sent":
        return <span className="h-4 w-4 text-gray-400">✓</span>;
      case "delivered":
        return <span className="h-4 w-4 text-green-500">✓</span>;
      case "error":
        return <span className="h-4 w-4 text-red-500">⚠️</span>;
      default:
        return null;
    }
  };

  const renderArtifact = (artifact: Artifact) => {
    switch (artifact.type) {
      case "table":
        return (
          <div className="mt-4 border rounded overflow-hidden">
            {artifact.title && (
              <div className="bg-gray-50 p-2 font-medium text-gray-700 border-b">
                {artifact.title}
              </div>
            )}
            <div className="overflow-x-auto">
              <table className="w-full">
                <tbody>
                  {artifact.content.rows.map((row: string[], i: number) => (
                    <tr key={i} className="border-b">
                      {row.map((cell, j) => (
                        <td 
                          key={`${i}-${j}`} 
                          className={cn(
                            "p-2",
                            j === 0 && "font-medium bg-gray-50"
                          )}
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case "image":
        return (
          <div className="mt-4">
            {artifact.title && (
              <div className="font-medium mb-2">{artifact.title}</div>
            )}
            <img 
              src={typeof artifact.content === 'string' ? artifact.content : ''}
              alt={artifact.title || "Image"} 
              className="max-w-full rounded border"
            />
          </div>
        );
      case "chart":
        return (
          <div className="mt-4 border rounded p-4">
            {artifact.title && (
              <div className="font-medium mb-2">{artifact.title}</div>
            )}
            <div className="bg-gray-100 h-40 flex items-center justify-center">
              [Chart Visualization]
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-full pr-4">
      <div className="space-y-6 pb-6">
        {messages.map(message => (
          <div 
            key={message.id} 
            className={cn(
              "rounded-lg p-4",
              message.sender === "user" 
                ? "bg-gray-100" 
                : "bg-white border border-blue-100",
              message.isNew && "animate-fade-in-up"
            )}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0 mr-4">
                {message.sender === "user" ? (
                  <div className="h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <div className="text-white font-medium">U</div>
                  </div>
                ) : (
                  <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <div className="text-white font-medium">AI</div>
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-gray-900 flex items-center">
                    {message.sender === "user" ? "You" : "Claude"}
                    {message.status && (
                      <span className="ml-2" title={message.status}>
                        {renderStatusIcon(message.status)}
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">{message.timestamp}</div>
                </div>
                
                <div className="mt-2">
                  <div className="text-gray-700 whitespace-pre-wrap">
                    {message.content}
                  </div>
                  
                  {/* Render artifacts if any */}
                  {message.artifacts && message.artifacts.length > 0 && (
                    <div>
                      {message.artifacts.map(artifact => (
                        <div key={artifact.id}>
                          {renderArtifact(artifact)}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {message.content.length > 100 && (
                    <button 
                      className="mt-2 text-sm text-gray-500 flex items-center"
                      onClick={() => toggleMessageExpansion(message.id)}
                    >
                      {expandedMessages[message.id] === false ? (
                        <>
                          <span className="mr-1">▼</span>
                          Show more
                        </>
                      ) : (
                        <>
                          <span className="mr-1">▲</span>
                          Show less
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
              
              <div className="flex-shrink-0 ml-4 flex flex-col space-y-2">
                <button 
                  className="text-gray-500 hover:text-gray-700 p-1"
                  onClick={() => copyMessageToClipboard(message.content)}
                  title="Copy to clipboard"
                >
                  📋
                </button>
                
                {message.sender === "ai" && onSaveAsNote && (
                  <button 
                    className="text-gray-500 hover:text-gray-700 p-1"
                    onClick={() => onSaveAsNote(message.id)}
                    title="Save as note"
                  >
                    💾
                  </button>
                )}
                
                <div className="relative">
                  <button 
                    className="text-gray-500 hover:text-gray-700 p-1"
                    title="More options"
                  >
                    ⋯
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {isAiTyping && (
          <div className="rounded-lg p-4 bg-white border border-blue-100 animate-pulse">
            <div className="flex items-start">
              <div className="flex-shrink-0 mr-4">
                <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <div className="text-white font-medium">AI</div>
                </div>
              </div>
              
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-gray-900">Claude</div>
                  <div className="text-sm text-gray-500">
                    <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                      Typing...
                    </span>
                  </div>
                </div>
                
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} className="h-20" />
      </div>
    </div>
  );
};

export default ChatMessages; 