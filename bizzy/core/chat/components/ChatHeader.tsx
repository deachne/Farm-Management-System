import React from "react";
import { ChatSession } from "./ChatPage";

interface ChatHeaderProps {
  activeChatSession: ChatSession;
  availableSessions: ChatSession[];
  onCreateNewChat: () => void;
  onSwitchSession: (sessionId: string) => void;
  onToggleContextPanel: () => void;
  showContextPanel: boolean;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ 
  activeChatSession,
  availableSessions,
  onCreateNewChat,
  onSwitchSession,
  onToggleContextPanel,
  showContextPanel
}) => {
  return (
    <div className="p-2 border-b flex justify-between items-center bg-white">
      <div className="text-lg font-medium">Chat</div>
      
      <div className="flex items-center space-x-2">
        {/* Farm Management Dropdown */}
        <div className="relative group">
          <button className="border rounded-md bg-white px-3 py-1.5 text-sm font-medium flex items-center">
            {activeChatSession.name}
            <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg hidden group-hover:block z-20">
            {availableSessions.map(session => (
              <button
                key={session.id}
                className={`block w-full text-left px-4 py-2 text-sm ${
                  session.id === activeChatSession.id
                    ? "bg-blue-50 text-blue-600"
                    : "hover:bg-gray-50"
                }`}
                onClick={() => onSwitchSession(session.id)}
              >
                {session.name}
              </button>
            ))}
          </div>
        </div>
        
        {/* Model Selection Dropdown */}
        <div className="relative group">
          <button className="border rounded-md bg-white px-3 py-1.5 text-sm font-medium flex items-center">
            {activeChatSession.model}
            <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg hidden group-hover:block z-20">
            <button
              className="block w-full text-left px-4 py-2 text-sm bg-blue-50 text-blue-600"
            >
              Claude 3.7 Sonnet
            </button>
            <button
              className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
            >
              Claude 3.5 Sonnet
            </button>
            <button
              className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
            >
              Claude 3 Haiku
            </button>
          </div>
        </div>
        
        {/* Hide/Show Context Button */}
        <button 
          className="border rounded-md flex items-center bg-white px-3 py-1.5 text-sm font-medium"
          onClick={onToggleContextPanel}
        >
          <svg className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          {showContextPanel ? "Hide Context" : "Show Context"}
        </button>
        
        {/* New Chat Button */}
        <button 
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-3 py-1.5 text-sm font-medium flex items-center"
          onClick={onCreateNewChat}
        >
          <svg className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Chat
        </button>
      </div>
    </div>
  );
};

export default ChatHeader; 