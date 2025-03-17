# Multi-Modal UI Components Integration Testing

## Overview

This document outlines the testing strategy for the multi-modal UI components, with a specific focus on testing the integration between AnythingLLM and LibreChat components. The integration points are critical to ensure a seamless user experience across both systems.

## Integration Testing Approach

### 1. Component-Level Integration Tests

#### Test Setup

For component-level integration tests, we need to simulate the environment where components from both systems interact:

```jsx
// Example test setup
import { render, screen, fireEvent } from '@testing-library/react';
import { MediaInput } from '~/core/shared/ui/components/multi-modal/MediaInput';
import { AnythingLLMProvider } from '~/core/anythingllm/context/AnythingLLMContext';
import { LibreChatProvider } from '~/core/librechat/context/LibreChatContext';

describe('MediaInput Integration with AnythingLLM and LibreChat', () => {
  it('should submit media content correctly to both systems', async () => {
    // Mock the AnythingLLM media handling service
    const mockAnythingLLMMediaService = {
      saveMedia: jest.fn().mockResolvedValue({ id: 'test-media-id' }),
    };
    
    // Mock the LibreChat message service
    const mockLibreChatMessageService = {
      sendMessage: jest.fn().mockResolvedValue({ id: 'test-message-id' }),
    };
    
    // Render the component with both providers
    render(
      <AnythingLLMProvider mediaService={mockAnythingLLMMediaService}>
        <LibreChatProvider messageService={mockLibreChatMessageService}>
          <MediaInput onSubmit={jest.fn()} />
        </LibreChatProvider>
      </AnythingLLMProvider>
    );
    
    // Test the component interaction
    // ...
  });
});
```

#### Key Integration Test Cases

1. **Media File Handling Tests**
   - Test uploading media in AnythingLLM and verifying it's accessible in LibreChat
   - Test media saved as artifacts in AnythingLLM are properly referenced in LibreChat messages
   - Test that media metadata is preserved across both systems

2. **UI Styling Consistency Tests**
   - Test that components maintain AnythingLLM's design language when used within LibreChat
   - Test theme changes propagate correctly between both systems
   - Test responsive behavior is consistent in both contexts

3. **Data Flow Tests**
   - Test data passing between AnythingLLM and LibreChat components
   - Test state synchronization between both systems
   - Test event propagation across the integration boundary

### 2. End-to-End Integration Tests

End-to-end tests should test the complete user flow across both systems:

```jsx
// Example E2E test with Cypress
describe('Multi-Modal E2E Integration', () => {
  beforeEach(() => {
    cy.visit('/workspace/test-workspace');
    cy.login(); // Custom command to handle login
  });
  
  it('should upload an image, send it in a message, and save it as an artifact', () => {
    // Upload an image
    cy.get('[data-testid="media-input"]').find('button[aria-label="Upload media"]').click();
    cy.get('input[type=file]').attachFile('test-image.jpg');
    
    // Verify image preview appears
    cy.get('[data-testid="media-preview"]').should('be.visible');
    
    // Add text and send the message
    cy.get('textarea').type('Here is an image from the field');
    cy.get('button[type="submit"]').click();
    
    // Verify the message appears in the chat with the image
    cy.get('[data-testid="chat-message"]').should('contain.text', 'Here is an image from the field');
    cy.get('[data-testid="chat-message"] img').should('be.visible');
    
    // Save the image as an artifact
    cy.get('[data-testid="save-artifact-button"]').click();
    
    // Verify the artifact is saved
    cy.get('[data-testid="artifact-saved-notification"]').should('be.visible');
    
    // Navigate to artifacts and verify the image appears there
    cy.get('[data-testid="artifacts-nav-link"]').click();
    cy.get('[data-testid="artifact-gallery"]').find('img').should('have.length.at.least', 1);
  });
});
```

### 3. Cross-System State Management Tests

Testing state management between AnythingLLM and LibreChat is critical:

```jsx
// Example test for cross-system state management
describe('Cross-System State Management', () => {
  it('should maintain consistent state between AnythingLLM and LibreChat', () => {
    // Mock the shared state store
    const mockStore = {
      subscribe: jest.fn(),
      dispatch: jest.fn(),
      getState: jest.fn().mockReturnValue({
        mediaFiles: [],
        theme: 'dark',
      }),
    };
    
    // First render an AnythingLLM component with the store
    const { unmount: unmountAnythingLLM } = render(
      <SharedStateProvider store={mockStore}>
        <AnythingLLMMediaGallery />
      </SharedStateProvider>
    );
    
    // Then unmount and render a LibreChat component with the same store
    unmountAnythingLLM();
    render(
      <SharedStateProvider store={mockStore}>
        <LibreChatMediaInput />
      </SharedStateProvider>
    );
    
    // Test the state synchronization
    // ...
  });
});
```

## Integration Test Environment

### 1. Test Environment Setup

To properly test the integration, we need a specialized test environment:

1. **Combined Provider Setup**
   ```jsx
   // Combined provider for testing
   const TestProviders = ({ children }) => (
     <AnythingLLMThemeProvider>
       <AnythingLLMAuthProvider>
         <LibreChatProvider>
           <SharedStateProvider>
             {children}
           </SharedStateProvider>
         </LibreChatProvider>
       </AnythingLLMAuthProvider>
     </AnythingLLMThemeProvider>
   );
   ```

2. **Mock Services**
   ```jsx
   // Mock services for both systems
   const mockServices = {
     anythingLLM: {
       artifactService: createMockArtifactService(),
       workspaceService: createMockWorkspaceService(),
     },
     libreChat: {
       chatService: createMockChatService(),
       fileService: createMockFileService(),
     },
   };
   ```

3. **Test Database**
   - Use a shared in-memory database for integration tests
   - Seed with test data that spans both systems
   - Reset between tests to ensure isolation

### 2. Testing Cross-Component Rendering

Test that components from both systems render correctly together:

```jsx
it('should correctly render mixed components', () => {
  render(
    <TestProviders>
      <div data-testid="mixed-components">
        <AnythingLLMHeader />
        <LibreChatMessageList />
        <MediaInput /> {/* Our integrated component */}
      </div>
    </TestProviders>
  );
  
  expect(screen.getByTestId('mixed-components')).toBeInTheDocument();
  expect(screen.getByTestId('anythingllm-header')).toBeInTheDocument();
  expect(screen.getByTestId('librechat-message-list')).toBeInTheDocument();
  expect(screen.getByTestId('media-input')).toBeInTheDocument();
});
```

## Mobile-Specific Integration Testing

Special attention should be paid to testing the integration on mobile devices:

1. **Responsive Design Integration Tests**
   - Test component behavior at various screen sizes
   - Verify LibreChat mobile optimizations work within AnythingLLM
   - Ensure touch interactions work consistently across both systems

2. **Field-Use Testing**
   - Test in conditions simulating agricultural field use
   - Verify offline capabilities work seamlessly between systems
   - Test performance under constrained device capabilities

## Performance Integration Testing

Integration points can create performance bottlenecks:

1. **Cross-System Performance Tests**
   - Measure render time for components that bridge both systems
   - Test memory usage when both systems are active
   - Identify and optimize any performance bottlenecks at integration points

2. **Load Testing**
   - Test with large amounts of media data flowing between systems
   - Verify performance with many concurrent operations
   - Ensure responsiveness under heavy load

## Error Handling and Recovery Tests

Robust error handling at integration points is critical:

1. **Cross-System Error Handling**
   - Test behavior when AnythingLLM services fail but LibreChat is active
   - Test behavior when LibreChat services fail but AnythingLLM is active
   - Verify graceful fallbacks and error messages are consistent

2. **State Recovery Tests**
   - Test recovery after connection loss
   - Verify state consistency after errors
   - Test auto-retry mechanisms at integration points

## Continuous Integration Testing

To ensure ongoing integration quality:

1. **Integration Test CI Pipeline**
   - Run integration tests on every PR that affects both systems
   - Include screenshot comparison tests for UI consistency
   - Generate integration test reports highlighting cross-system issues

2. **Integration Monitoring**
   - Log and monitor integration points in production
   - Set up alerts for integration failures
   - Collect metrics on cross-system operations

## Conclusion

Thorough integration testing between AnythingLLM and LibreChat components is essential for the multi-modal UI implementation. By focusing on the integration points and testing both the technical integration and the user experience across both systems, we can ensure a seamless experience that leverages the strengths of both platforms while maintaining consistency and reliability. 