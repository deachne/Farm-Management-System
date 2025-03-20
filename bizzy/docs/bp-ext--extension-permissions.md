# Extension Permissions System

This document outlines the design and implementation of the extension permissions system in BizzyPerson.

## Overview

The extension permissions system provides a robust security mechanism to control what extensions can access and modify within the BizzyPerson platform. It ensures that extensions only have access to the resources they need, following the principle of least privilege. The system enforces permission checks at runtime and provides a clean API for extensions to request and verify permissions.

## Goals

- Ensure extensions can only access resources they explicitly request and are granted
- Provide a fine-grained permission model that balances security and usability
- Create a transparent permission approval workflow for users
- Develop a robust enforcement mechanism that prevents unauthorized access
- Implement permission validation during extension registration and activation
- Support dynamic permission changes during runtime

## Permission Model

The permission system uses a capability-based approach with predefined permission categories:

### Resource Access Permissions

These permissions control access to various resources in the system:

- `read-documents`: Access to read documents from the knowledge base
- `write-documents`: Ability to create or modify documents
- `delete-documents`: Ability to delete documents
- `read-chats`: Access to read chat history
- `write-chats`: Ability to create new chat messages
- `user-data`: Access to user profile and settings
- `system-settings`: Access to system configuration

### Action Permissions

These permissions control what operations extensions can perform:

- `network-access`: Ability to make external network requests
- `file-system`: Access to read/write files on the server
- `use-chat`: Ability to interact with the chat system
- `use-tools`: Access to system tools and integrations
- `use-embeddings`: Access to embedding and vectorization capabilities
- `use-ui`: Ability to inject UI components
- `store-data`: Ability to store persistent data

### Context Permissions

These permissions control when extensions can activate:

- `run-on-startup`: Permission to load and activate during system startup
- `run-in-background`: Permission to run background processes
- `run-on-schedule`: Permission to execute on a schedule
- `intercept-requests`: Permission to intercept and modify system requests

## Permission Declaration

Extensions must declare the permissions they require in their manifest file:

```json
{
  "name": "my-extension",
  "version": "1.0.0",
  "description": "My extension description",
  "permissions": [
    "read-documents",
    "write-documents",
    "network-access",
    "use-chat"
  ],
  "optionalPermissions": [
    "use-ui",
    "store-data"
  ]
}
```

The `permissions` field lists required permissions that are essential for the extension to function. The `optionalPermissions` field lists permissions that enhance functionality but aren't strictly required.

## Permission Validation

When an extension is registered or updated, the system validates its permission requests:

1. Check that all requested permissions are valid and follow the predefined schema
2. Verify that the extension doesn't request permissions that are mutually exclusive
3. Compare requested permissions with the extension's previous version (if an update)
4. Flag potentially dangerous permission combinations for special review

## Permission Enforcement

The permissions are enforced through several mechanisms:

### Runtime Permission Checks

All system APIs that require permissions implement runtime checks:

```javascript
function readDocument(docId, extensionId) {
  // Check if the extension has the required permission
  if (!permissionManager.hasPermission(extensionId, 'read-documents')) {
    throw new Error('Permission denied: read-documents is required');
  }
  
  // Proceed with reading the document
  return documentStore.get(docId);
}
```

### Permission Manager

A centralized Permission Manager maintains and enforces permissions:

```javascript
class PermissionManager {
  constructor() {
    this.permissions = new Map(); // Maps extension IDs to granted permissions
  }
  
  // Grant a permission to an extension
  grantPermission(extensionId, permission) {
    if (!this.permissions.has(extensionId)) {
      this.permissions.set(extensionId, new Set());
    }
    this.permissions.get(extensionId).add(permission);
    return true;
  }
  
  // Check if an extension has a permission
  hasPermission(extensionId, permission) {
    return this.permissions.has(extensionId) && 
           this.permissions.get(extensionId).has(permission);
  }
  
  // Revoke a permission from an extension
  revokePermission(extensionId, permission) {
    if (this.permissions.has(extensionId)) {
      return this.permissions.get(extensionId).delete(permission);
    }
    return false;
  }
  
  // Get all permissions for an extension
  getPermissions(extensionId) {
    if (this.permissions.has(extensionId)) {
      return Array.from(this.permissions.get(extensionId));
    }
    return [];
  }
  
  // Clear all permissions for an extension
  clearPermissions(extensionId) {
    return this.permissions.delete(extensionId);
  }
}
```

### Sandbox Environment

Extensions run in a controlled environment with restricted access to:

1. Global objects and properties
2. Access to system APIs is mediated through permission-checked wrappers
3. Network and file system access is controlled through allowed APIs

## User Approval Workflow

When an extension is installed or updated with new permission requests:

1. User is presented with a clear list of requested permissions and their implications
2. Each permission is explained in user-friendly language
3. Potentially dangerous permissions are highlighted with warnings
4. Permissions can be selectively granted or denied
5. User can choose to remember their decision for future updates

## Permission Management UI

The system includes a permission management UI that allows users to:

1. View all extensions and their granted permissions
2. Modify permissions for installed extensions
3. Reset permissions to defaults
4. Set global permission policies (e.g., never allow network-access for any extension)
5. View permission access logs to monitor extension behavior

## Integration with Lifecycle Management

The permission system integrates with the extension lifecycle management:

1. Permissions are validated during extension installation
2. Permission changes require extension deactivation and reactivation
3. Permission violations lead to extension suspension
4. Extension updates may require new permission approvals

## Permission API for Extensions

Extensions can interact with the permission system through:

### Requesting Permissions

```javascript
const { requestPermission } = require('@bizzy/extension-api');

// Request an optional permission at runtime
async function requestNetworkAccess() {
  try {
    const granted = await requestPermission('network-access', {
      reason: 'Needed to fetch weather data for crop planning'
    });
    
    if (granted) {
      // Permission was granted, proceed with network request
      return fetchWeatherData();
    } else {
      // Handle the case where permission was denied
      return useOfflineData();
    }
  } catch (error) {
    console.error('Error requesting permission:', error);
  }
}
```

### Checking Permissions

```javascript
const { hasPermission } = require('@bizzy/extension-api');

function enhancedFeature() {
  if (hasPermission('use-ui')) {
    // Implement enhanced UI feature
    return createAdvancedUI();
  } else {
    // Fall back to basic functionality
    return createBasicFunctionality();
  }
}
```

## Permission Context API

The system also provides a permission-aware context for API calls:

```javascript
const { withPermissions } = require('@bizzy/extension-api');

// Create a permission-aware API client
const apiClient = withPermissions(['network-access'], {
  fetchData: async (url) => {
    // This will only execute if the extension has network-access permission
    const response = await fetch(url);
    return response.json();
  }
});

// Usage
async function getData() {
  try {
    return await apiClient.fetchData('https://api.example.com/data');
  } catch (error) {
    if (error.code === 'PERMISSION_DENIED') {
      console.error('Missing network-access permission');
    }
    throw error;
  }
}
```

## Permission Storage

Permissions are stored in a secure database with the following structure:

```javascript
{
  "extensions": {
    "example-extension": {
      "grantedPermissions": [
        "read-documents",
        "write-documents",
        "use-chat"
      ],
      "deniedPermissions": [
        "network-access"
      ],
      "permissionHistory": [
        {
          "permission": "network-access",
          "action": "denied",
          "timestamp": "2023-03-15T14:30:45Z",
          "reason": "User denied during installation"
        },
        {
          "permission": "read-documents",
          "action": "granted",
          "timestamp": "2023-03-15T14:30:42Z",
          "reason": "Required permission"
        }
      ]
    }
  },
  "policies": {
    "globalDenyList": [
      "file-system",
      "system-settings"
    ],
    "requireApprovalFor": [
      "network-access",
      "user-data"
    ]
  }
}
```

## TypeScript Definitions

The permission system includes TypeScript definitions for type safety:

```typescript
// Permission types
export type ResourcePermission = 
  | 'read-documents' 
  | 'write-documents'
  | 'delete-documents'
  | 'read-chats'
  | 'write-chats'
  | 'user-data'
  | 'system-settings';

export type ActionPermission = 
  | 'network-access'
  | 'file-system'
  | 'use-chat'
  | 'use-tools'
  | 'use-embeddings'
  | 'use-ui'
  | 'store-data';

export type ContextPermission = 
  | 'run-on-startup'
  | 'run-in-background'
  | 'run-on-schedule'
  | 'intercept-requests';

export type Permission = ResourcePermission | ActionPermission | ContextPermission;

// Permission request options
export interface PermissionRequestOptions {
  reason?: string;
  detail?: string;
  temporary?: boolean;
}

// Permission manager interface
export interface PermissionManager {
  grantPermission(extensionId: string, permission: Permission): boolean;
  hasPermission(extensionId: string, permission: Permission): boolean;
  revokePermission(extensionId: string, permission: Permission): boolean;
  getPermissions(extensionId: string): Permission[];
  clearPermissions(extensionId: string): boolean;
  requestPermission(
    extensionId: string, 
    permission: Permission, 
    options?: PermissionRequestOptions
  ): Promise<boolean>;
}

// Extension API
export interface PermissionAPI {
  hasPermission(permission: Permission): boolean;
  requestPermission(
    permission: Permission, 
    options?: PermissionRequestOptions
  ): Promise<boolean>;
  withPermissions<T extends object>(
    permissions: Permission[], 
    api: T
  ): T;
}
```

## Implementation Plan

The implementation of the permission system will proceed in phases:

1. **Phase 1: Core Permission System**
   - Define permission schema and validation
   - Implement PermissionManager class
   - Add permission validation to extension registration
   - Create basic permission storage

2. **Phase 2: Enforcement Mechanism**
   - Implement runtime permission checking
   - Add permission wrappers to system APIs
   - Create permission context helpers
   - Develop sandbox restrictions

3. **Phase 3: User Interface**
   - Implement permission approval workflow
   - Create permission management UI
   - Develop permission monitoring and logs
   - Add permission policies configuration

4. **Phase 4: Extension API**
   - Add permission API for extensions
   - Implement permission requesting
   - Create permission-aware context factory
   - Develop TypeScript definitions

## Security Considerations

- Permissions must be validated at multiple levels to prevent bypass
- All permission changes must be logged for auditing
- Permission storage should be secured against tampering
- Default deny approach for all sensitive operations
- Regular security reviews of permission implementation

## Best Practices for Extension Developers

1. **Request Minimum Permissions**: Only request permissions your extension truly needs.
2. **Explain Why**: Always provide clear explanations for why each permission is needed.
3. **Graceful Degradation**: Design extensions to work with reduced functionality when permissions are denied.
4. **Handle Permission Changes**: Be prepared for permissions to change during runtime.
5. **Security First**: Treat all user data accessed through permissions as sensitive.
6. **Document Permissions**: Clearly document what permissions your extension uses and why in your documentation.
7. **Test Permission Denial**: Test your extension with various permission configurations, including denial of optional permissions.

## Future Enhancements

- Dynamic permission sets based on extension behavior
- Machine learning for permission anomaly detection
- Permission profiles for different user types
- Time-limited or context-aware permissions
- Permission delegation between extensions 