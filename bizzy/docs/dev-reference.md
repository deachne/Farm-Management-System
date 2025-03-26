## Reference Implementation Guidelines

### Working Directory Structure
1. **Primary Development Location**
   - All Bizzy-specific code MUST be developed within `/bizzy/` directory
   - Never develop in AnythingLLM or LibreChat source directories
   - Reference implementations should be used as guides only, not direct copies

2. **Project Structure**
   ```
   /bizzy/
     /core/
       /admin/              # BizzyPerson core components
         /components/       # Reusable UI components 
         /demo/            # Demo implementations for testing
       /shared/
         /ui/components/   # Base UI components (Button, Input, Card, etc.)
       /anythingllm/       # AnythingLLM integration
       /librechat/         # LibreChat integration
     /extensions/          # Industry-specific extensions
     /docs/               # Documentation files
     /main.tsx           # Main application entry point
     /vite.config.ts     # Vite configuration
   ```

### Navigation Pattern - STATE ONLY
1. **Critical Pattern**
   - ⚠️ ABSOLUTELY NO ROUTING
   - ✅ Use state-based navigation ONLY
   - Reference implementation shows the correct approach:
     ```typescript
     const [activeChatSession, setActiveChatSession] = useState<ChatSession>({
       id: "cs1",
       name: "Farm Management",
       model: "Claude 3.7 Sonnet"
     });

     const switchChatSession = (sessionId: string) => {
       const session = availableSessions.find(s => s.id === sessionId);
       if (session) {
         setActiveChatSession(session);
       }
     };
     ```

2. **Common Mistakes to Avoid**
   - ❌ Don't add React Router
   - ❌ Don't create route configurations
   - ❌ Don't use URL-based navigation
   - ❌ Don't implement history management
   - ❌ Don't add route parameters
   - ❌ Don't use window.location or any other direct URL manipulation

3. **Correct Navigation Approach**
   - ✅ Use state variables to track current view/session
   - ✅ Implement state-based view switching
   - ✅ Manage navigation through state updates
   - ✅ Follow the reference implementation's state pattern
   - ✅ Use simple conditional rendering based on state
   - ✅ Store related state (e.g., scroll positions) when switching views
   - ✅ Restore state when returning to a previous view

4. **Button Implementation Best Practices**
   - ✅ Create handler functions for all navigation actions
   - ✅ Use consistent naming: toggle* for showing/hiding, switch* for changing view
   - ✅ Preserve state when switching between views
   - ✅ Always check if target state exists before switching
   - ✅ Implement proper state cleanup when needed
   - Example of proper toggle implementation:
     ```typescript
     const toggleContextPanel = () => {
       setShowContextPanel(prev => !prev);
     };
     ```

### Scroll Handling Best Practices
1. **Proper Scroll Container Setup**
   - ✅ Use `overflow-hidden` on parent containers to prevent page scrolling
   - ✅ Use `overflow-y-auto` on scrollable containers
   - ✅ Add `overflow-x-hidden` to prevent horizontal scrolling
   - ✅ Use refs to access scroll containers for programmatic scrolling
   - Example of proper scroll container:
     ```tsx
     <div 
       ref={messagesContainerRef}
       className="flex-1 overflow-y-auto overflow-x-hidden p-4 pb-20 scroll-smooth"
     >
       {/* Content goes here */}
     </div>
     ```

2. **Preventing Scroll Propagation**
   - ✅ Handle wheel events to prevent propagation at boundaries
   - ✅ Use `preventDefault()` and `stopPropagation()` to halt scroll events
   - ✅ Check for scroll boundaries before preventing events
   - Example implementation:
     ```typescript
     const handleScrollWheel = (e: React.WheelEvent<HTMLDivElement>) => {
       const container = containerRef.current;
       if (!container) return;
       
       const isAtTop = container.scrollTop <= 1;
       const isAtBottom = container.scrollHeight - container.scrollTop - container.clientHeight <= 1;
       
       if ((isAtTop && e.deltaY < 0) || (isAtBottom && e.deltaY > 0)) {
         e.preventDefault();
         e.stopPropagation();
       }
     };
     ```

3. **Scroll Position Management**
   - ✅ Store scroll positions when switching between views
   - ✅ Restore scroll positions when returning to a view
   - ✅ Use timeout for scroll actions to ensure DOM updates complete
   - ✅ Provide fallback scrolling methods for different browsers
   - Example implementation:
     ```typescript
     // Save scroll position when changing views
     if (containerRef.current) {
       setScrollPositions(prev => ({
         ...prev,
         [activeViewId]: containerRef.current?.scrollTop || 0
       }));
     }
     
     // Restore scroll position
     useEffect(() => {
       if (containerRef.current && scrollPositions[activeViewId]) {
         containerRef.current.scrollTop = scrollPositions[activeViewId];
       }
     }, [activeViewId]);
     ```

### UI Reference and Styling
1. **Color Palette**
   - Sidebar: `bg-gradient-to-b from-blue-600 to-blue-700`
   - Headers: `bg-gradient-to-r from-blue-500 to-blue-700`
   - Border accents: `border-blue-300`, `border-blue-500`
   - Icon colors: Various (`text-blue-300`, `text-pink-300`, etc.)
   - Text: White for dark backgrounds, dark for light backgrounds

2. **Layout Structure**
   ```tsx
   <section className="mb-10">
     <h2 className="text-xl font-bold mb-5 text-gray-900 dark:text-white border-b pb-2 border-gray-200 dark:border-gray-700">
       Section Title
     </h2>
     {/* Content goes here */}
   </section>
   ```

### Import Path Patterns and Common Issues
1. **Correct Import Patterns**
   ```tsx
   // From admin components importing shared UI components
   import { Button } from '../../../shared/ui/components/Button';
   import { Card, CardContent } from '../../../shared/ui/components/Card';

   // From demo components importing shared UI components
   import { Button } from '../../../shared/ui/components/Button';
   import { Input } from '../../../shared/ui/components/Input';

   // For admin components importing other admin components
   import { Dashboard } from '../Dashboard';
   import { SystemStatus } from '../SystemStatus';
   ```

2. **Common Import Issues and Solutions**
   - Wrong path depth: Check your path depth if seeing "Failed to resolve import"
   - Import from index vs direct import: Verify if component needs direct import
   - Default vs Named exports: Check component source for correct import style
   - Component dependencies: Ensure all required components are properly imported

3. **Troubleshooting Import Errors**
   - Use `ls -la` to verify exact component path
   - Check similar component imports in existing files
   - Update import path with correct relative path
   - Verify component export in index file if needed

### Reference Implementation Usage
1. **Current Reference Components**
   - Location: `/bizzy/core/chat/components/`
   - Reference Components:
     * `ChatPage.tsx` - Main chat interface implementation
     * `ChatMessages.tsx` - Message display component
     * `ChatInputBar.tsx` - Message input interface
     * `ChatHeader.tsx` - Chat header with controls
     * `ChatContextPanel.tsx` - Context panel implementation

2. **How to Use Reference Code**
   - ✅ DO study the structure and patterns
     * State management approach (useState, useEffect patterns)
     * Interface definitions (e.g., Message, Document, etc.)
     * Component organization
     * Error handling and user feedback
     * Mobile responsiveness patterns
   
   - ✅ DO implement similar patterns
     * Follow the same state management style
     * Use similar TypeScript interfaces
     * Match the component hierarchy
     * Copy the responsive design approach
   
   - ❌ DON'T directly copy code
     * Don't copy-paste implementations
     * Don't duplicate business logic
     * Don't reuse specific UI content

3. **Pattern Examples By Component Type**
   
   Chat Components:
   ```typescript
   export interface Message {
     id: string;
     content: string;
     sender: "user" | "ai";
     timestamp: string;
     artifacts?: Artifact[];
     isNew?: boolean;
     status?: "sending" | "sent" | "delivered" | "error";
   }
   ```

### Component Integration
1. **Existing Component Structure**
   - Always check for existing providers and components:
     * `SidebarProvider` - Main sidebar context provider
     * `NoteSidebar` - Sidebar implementation
     * Base UI components in `/bizzy/core/shared/ui/components/`

2. **Integration Points**
   - Understand the component hierarchy:
     ```tsx
     <SidebarProvider>
       <NoteSidebar />
       <div className="flex-1 flex flex-col h-screen overflow-hidden">
         <ChatHeader />
         {/* Your new components go here */}
       </div>
     </SidebarProvider>
     ```
   - Use existing layout patterns:
     * Flex container structure
     * Responsive classes
     * Transition handling
     * Z-index management

3. **Common Integration Mistakes to Avoid**
   - ❌ Don't create new providers when existing ones are available
   - ❌ Don't implement new navigation when sidebar exists
   - ❌ Don't duplicate existing components
   - ✅ Do use existing providers and components
   - ✅ Do follow established layout patterns
   - ✅ Do maintain consistent styling

### Implementation Checklist
1. **Before Starting**
   - [ ] Review reference implementation thoroughly
   - [ ] Identify key patterns and structures
   - [ ] Check for existing components and providers
   - [ ] Verify correct working directory
   - [ ] Understand component hierarchy
   - [ ] Review all relevant documentation in the `/bizzy/docs/` directory
   - [ ] Verify that you're implementing the correct task from the project checklist

2. **During Development**
   - [ ] Stay within `/bizzy/` directory
   - [ ] Use existing providers
   - [ ] Follow reference patterns
   - [ ] Implement with your own code
   - [ ] Maintain consistent styling
   - [ ] Use state-based navigation only
   - [ ] Handle scroll events properly
   - [ ] Implement mobile-responsive design
   - [ ] Test as you go with small, incremental changes

3. **Common Implementation Challenges**
   - [ ] Scroll handling and event propagation
   - [ ] State persistence between view changes
   - [ ] Integration with the dashboard demo
   - [ ] Import path resolution and component dependencies
   - [ ] Responsive design for different screen sizes
   - [ ] Optimizing for mobile with conditional rendering
   - [ ] Ensuring proper component isolation and reusability

4. **Testing**
   - [ ] Test against reference functionality
   - [ ] Verify mobile responsiveness matches reference
   - [ ] Check integration with existing components
   - [ ] Validate state management
   - [ ] Confirm proper error handling
   - [ ] Test edge cases (empty states, long content, etc.)
   - [ ] Verify scroll behavior on different content lengths
   - [ ] Test navigation between different components
   - [ ] Check integration with the DashboardDemo