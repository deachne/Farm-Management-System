import React, { useState, useRef, useEffect } from "react";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInputBar from "./ChatInputBar";
import ChatContextPanel from "./ChatContextPanel";
// TODO: These components need to be created or properly imported
// import { SidebarProvider } from "../../shared/ui/components/sidebar";
// import NoteSidebar from "../../components/NoteSidebar";

export interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: string;
  isNew?: boolean;
  status?: "sending" | "sent" | "delivered" | "error";
  artifacts?: Artifact[];
}

export interface Artifact {
  id: string;
  type: "table" | "image" | "chart";
  content: any;
  title?: string;
}

export interface ChatSession {
  id: string;
  name: string;
  model: string;
}

/**
 * Main Chat page component
 * Implements state-based navigation as specified in dev-reference.md
 */
export const ChatPage: React.FC = () => {
  // State for messages in the current chat
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! How can I help with your farm management today? Feel free to ask about soil conditions, crop planning, or equipment maintenance.",
      sender: "ai",
      timestamp: "9:30 AM",
      status: "delivered"
    }
  ]);

  // State for chat sessions and navigation
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [activeChatSession, setActiveChatSession] = useState<ChatSession>({
    id: "cs1",
    name: "Farm Management",
    model: "Claude 3.7 Sonnet"
  });
  const [availableSessions, setAvailableSessions] = useState<ChatSession[]>([
    {
      id: "cs1",
      name: "Farm Management",
      model: "Claude 3.7 Sonnet"
    },
    {
      id: "cs2",
      name: "Crop Planning",
      model: "Claude 3.7 Sonnet"
    }
  ]);
  const [showContextPanel, setShowContextPanel] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "connecting" | "disconnected">("connected");
  
  // Refs for scrolling
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  
  // State for storing scroll positions
  const [scrollPositions, setScrollPositions] = useState<Record<string, number>>({});

  // Effect to scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.some(msg => msg.isNew)) {
      scrollToBottom();
    }
  }, [messages]);

  // Save scroll position when changing chat sessions
  useEffect(() => {
    if (messagesContainerRef.current && activeChatSession) {
      return () => {
        setScrollPositions(prev => ({
          ...prev,
          [activeChatSession.id]: messagesContainerRef.current?.scrollTop || 0
        }));
      };
    }
  }, [activeChatSession]);

  // Restore scroll position when switching sessions
  useEffect(() => {
    if (messagesContainerRef.current && scrollPositions[activeChatSession.id]) {
      messagesContainerRef.current.scrollTop = scrollPositions[activeChatSession.id];
    } else {
      scrollToBottom();
    }
  }, [activeChatSession.id, scrollPositions]);

  const scrollToBottom = () => {
    // Force scrolling with timeout to ensure DOM is updated
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      // Alternative direct scroll approach as fallback
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
      }
    }, 100);
  };

  // Handle sending a new message
  const handleSendMessage = (content: string) => {
    if (content.trim() === "") return;

    // Add user message
    const newUserMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: "delivered",
      isNew: true
    };

    setMessages(prev => [...prev, newUserMessage]);
    scrollToBottom(); // Force scroll after user message
    
    // Simulate AI typing
    setIsAiTyping(true);
    
    // Based on content, generate different responses
    setTimeout(() => {
      let aiResponse: Message;
      
      // If asking about tomato blight yield loss
      if (content.toLowerCase().includes("yield loss") && content.toLowerCase().includes("blight")) {
        aiResponse = {
          id: (Date.now() + 1).toString(),
          content: `With prompt treatment of early blight, you can expect to minimize yield losses significantly. Here's what you might expect:

- Prompt treatment (at first signs): Typically limits yield loss to 5-15%
- Delayed treatment (disease well-established): May result in 20-40% yield loss
- No treatment: Can lead to 50-80% yield reduction in severe cases

Factors affecting the impact include:
- Weather conditions (wet, humid conditions worsen spread)
- Variety susceptibility
- Plant vigor and overall health
- Treatment effectiveness
- Thoroughness of affected leaf removal

By implementing the preventative measures we discussed and treating promptly at the first signs of disease, you should be able to maintain good productivity despite the current infection.`,
          sender: "ai",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: "delivered",
          isNew: true
        };
      } else if (content.toLowerCase().includes("tomato") || content.toLowerCase().includes("blight")) {
        // For questions about tomatoes or blight
        aiResponse = {
          id: (Date.now() + 1).toString(),
          content: `Based on your description, it sounds like your tomato plants may have early blight, a common fungal disease. Early blight is caused by the fungus Alternaria solani and typically appears as dark spots with concentric rings, often on lower leaves first.

Here are some treatment options:`,
          sender: "ai",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: "delivered",
          isNew: true,
          artifacts: [
            {
              id: "a1",
              type: "table",
              title: "TREATMENT OPTIONS",
              content: {
                headers: ["Approach", "Methods"],
                rows: [
                  ["Organic", "Copper fungicide, neem oil, remove affected leaves"],
                  ["Chemical", "Chlorothalonil, mancozeb, or proprietary fungicides"],
                  ["Cultural", "Improve air circulation, avoid wetting foliage"]
                ]
              }
            }
          ]
        };
      } else {
        // Default response
        aiResponse = {
          id: (Date.now() + 1).toString(),
          content: `I understand you're asking about "${content}". This is a simulated response for demo purposes. In a real implementation, this would call an AI API with appropriate knowledge sources.`,
          sender: "ai",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: "delivered",
          isNew: true
        };
      }
      
      setMessages(prev => [...prev, aiResponse]);
      setIsAiTyping(false);
      scrollToBottom(); // Force scroll after AI response
    }, 1500);
  };

  // Handle toggling the context panel
  const toggleContextPanel = () => {
    setShowContextPanel(prev => !prev);
  };

  // Handle creating a new chat
  const handleNewChat = () => {
    setMessages([
      {
        id: "new-chat",
        content: "Hello! How can I help with your farm management today? Feel free to ask about soil conditions, crop planning, or equipment maintenance.",
        sender: "ai",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: "delivered"
      }
    ]);
  };

  // Handle switching between chat sessions
  const switchChatSession = (sessionId: string) => {
    const session = availableSessions.find(s => s.id === sessionId);
    if (session) {
      if (messagesContainerRef.current) {
        setScrollPositions(prev => ({
          ...prev,
          [activeChatSession.id]: messagesContainerRef.current?.scrollTop || 0
        }));
      }
      setActiveChatSession(session);
    }
  };

  // Handle saving a message as a note
  const saveMessageAsNote = (messageId: string) => {
    console.log(`Message ${messageId} saved as note`);
  };

  // Handle asking a suggested question
  const handleAskQuestion = (question: string) => {
    handleSendMessage(question);
  };

  // Handle scroll event to prevent propagation when at boundaries
  const handleScrollWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const container = messagesContainerRef.current;
    if (!container) return;

    // Check if we're at the top or bottom of the scroll container
    const isAtTop = container.scrollTop <= 1;
    const isAtBottom = container.scrollHeight - container.scrollTop - container.clientHeight <= 1;

    // If scrolling up when at top or scrolling down when at bottom, prevent propagation
    if ((isAtTop && e.deltaY < 0) || (isAtBottom && e.deltaY > 0)) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden max-h-screen">
      <div className="flex items-center p-2 bg-blue-600 text-white">
        <div className="font-bold text-xl mr-3">BizzyPerson</div>
        <div className="bg-white text-blue-600 px-4 py-1 rounded font-medium">Chat</div>
      </div>
      
      <ChatHeader 
        activeChatSession={activeChatSession}
        availableSessions={availableSessions}
        onCreateNewChat={handleNewChat}
        onSwitchSession={switchChatSession}
        onToggleContextPanel={toggleContextPanel}
        showContextPanel={showContextPanel}
      />
      
      <div className="flex flex-1 overflow-hidden h-[calc(100vh-140px)]">
        <div className={`${showContextPanel ? "w-full md:w-2/3" : "w-full"} flex flex-col border-r transition-all duration-300 overflow-hidden`}>
          <div 
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto overflow-x-hidden p-4 pb-20 scroll-smooth"
            style={{ maxHeight: 'calc(100vh - 200px)' }}
            onWheel={handleScrollWheel}
          >
            <ChatMessages 
              messages={messages} 
              isAiTyping={isAiTyping} 
              messagesEndRef={messagesEndRef}
              onSaveAsNote={saveMessageAsNote}
            />
          </div>
          
          <div className="sticky bottom-0 left-0 right-0 border-t p-4 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.05)] z-10">
            <ChatInputBar 
              onSendMessage={handleSendMessage}
              connectionStatus={connectionStatus}
            />
          </div>
        </div>
        
        {showContextPanel && (
          <div className="hidden md:block md:w-1/3 transition-all duration-300 overflow-hidden">
            <ChatContextPanel onAskQuestion={handleAskQuestion} />
          </div>
        )}
      </div>
      
      <div className="border-t p-2 text-sm text-gray-500 flex justify-end">
        <div>
          <span className="font-medium">Action Log:</span> 
          <span className="ml-2">Chat session active</span>
        </div>
      </div>
    </div>
  );
};

export default ChatPage; 