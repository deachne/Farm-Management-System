import React, { useState, useRef } from "react";

interface KnowledgeSource {
  id: string;
  type: "note" | "document" | "web";
  title: string;
  active: boolean;
  source?: string;
}

interface ChatContextPanelProps {
  onAskQuestion?: (question: string) => void;
}

const ChatContextPanel: React.FC<ChatContextPanelProps> = ({ onAskQuestion }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [sections, setSections] = useState({
    knowledgeSources: true,
    suggestedQuestions: true
  });
  
  const contextPanelRef = useRef<HTMLDivElement>(null);
  
  const [knowledgeSources, setKnowledgeSources] = useState<KnowledgeSource[]>([
    {
      id: "ks1",
      type: "note",
      title: "Field Observation (Yesterday)",
      active: true
    },
    {
      id: "ks2",
      type: "document",
      title: "Tomato Diseases PDF",
      active: true
    },
    {
      id: "ks3",
      type: "web",
      title: "University Extension Articles",
      active: true,
      source: "extension.org"
    }
  ]);
  
  const suggestedQuestions = [
    "How do I prevent tomato blight?",
    "Will it spread to other plants?",
    "Show more resistant varieties"
  ];
  
  const toggleSection = (section: keyof typeof sections) => {
    setSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  const refreshContext = () => {
    setIsRefreshing(true);
    
    // Simulate refreshing context
    setTimeout(() => {
      setIsRefreshing(false);
      console.log("Context refreshed");
    }, 1500);
  };
  
  const toggleKnowledgeSource = (id: string) => {
    setKnowledgeSources(prev => 
      prev.map(source => 
        source.id === id
          ? { ...source, active: !source.active }
          : source
      )
    );
  };
  
  const askQuestion = (question: string) => {
    if (onAskQuestion) {
      onAskQuestion(question);
    } else {
      console.log(`Question asked: ${question}`);
    }
  };
  
  // Handle scroll event to prevent propagation when at boundaries
  const handleScrollWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const container = contextPanelRef.current;
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
    <div className="h-full bg-white border-l overflow-hidden flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="font-medium text-gray-800">Context</h2>
        <button 
          className="flex items-center text-sm text-gray-600 hover:text-gray-800"
          onClick={refreshContext}
          disabled={isRefreshing}
        >
          <svg className={`h-4 w-4 mr-1 ${isRefreshing ? "animate-spin" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {isRefreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>
      
      <div 
        ref={contextPanelRef}
        className="overflow-y-auto overflow-x-hidden px-4 py-3 space-y-6 flex-1"
        onWheel={handleScrollWheel}
      >
        {/* Knowledge Sources Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Knowledge Sources</h3>
            <button 
              className="text-gray-500 hover:text-gray-700"
              onClick={() => toggleSection("knowledgeSources")}
            >
              <svg 
                className={`h-5 w-5 transform transition-transform ${sections.knowledgeSources ? "rotate-0" : "-rotate-90"}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
          
          {sections.knowledgeSources && (
            <div className="space-y-4">
              {/* Your Notes Section */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Your Notes</h4>
                {knowledgeSources
                  .filter(source => source.type === "note")
                  .map(source => (
                    <div 
                      key={source.id}
                      className="flex items-center mb-2"
                    >
                      <div className="flex-1 flex items-center">
                        <svg className="h-4 w-4 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="text-sm">{source.title}</span>
                      </div>
                      <div>
                        <input 
                          type="checkbox" 
                          checked={source.active} 
                          onChange={() => toggleKnowledgeSource(source.id)}
                          className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  ))}
              </div>
              
              {/* Crop Knowledge Base Section */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Crop Knowledge Base</h4>
                {knowledgeSources
                  .filter(source => source.type === "document")
                  .map(source => (
                    <div 
                      key={source.id}
                      className="flex items-center mb-2"
                    >
                      <div className="flex-1 flex items-center">
                        <svg className="h-4 w-4 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm">{source.title}</span>
                      </div>
                      <div>
                        <input 
                          type="checkbox" 
                          checked={source.active} 
                          onChange={() => toggleKnowledgeSource(source.id)}
                          className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  ))}
              </div>
              
              {/* Web Sources Section */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Web Sources</h4>
                {knowledgeSources
                  .filter(source => source.type === "web")
                  .map(source => (
                    <div 
                      key={source.id}
                      className="flex items-center mb-2"
                    >
                      <div className="flex-1 flex items-center">
                        <svg className="h-4 w-4 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                        </svg>
                        <span className="text-sm">
                          {source.title}
                          {source.source && (
                            <span className="text-xs text-gray-500 ml-1">({source.source})</span>
                          )}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="text-gray-400 hover:text-gray-700">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </button>
                        <input 
                          type="checkbox" 
                          checked={source.active} 
                          onChange={() => toggleKnowledgeSource(source.id)}
                          className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Suggested Questions Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Suggested Questions</h3>
            <button 
              className="text-gray-500 hover:text-gray-700"
              onClick={() => toggleSection("suggestedQuestions")}
            >
              <svg 
                className={`h-5 w-5 transform transition-transform ${sections.suggestedQuestions ? "rotate-0" : "-rotate-90"}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
          
          {sections.suggestedQuestions && (
            <div className="space-y-2">
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  className="w-full text-left p-2 border rounded text-sm hover:bg-gray-50 transition-colors"
                  onClick={() => askQuestion(question)}
                >
                  {question}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatContextPanel; 