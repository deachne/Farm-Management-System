# Extension Lifecycle Management

This document describes the extension lifecycle management system in BizzyPerson, which provides comprehensive control over the entire lifecycle of extensions, from installation to uninstallation.

## Overview

The extension lifecycle management system provides a robust and flexible way to manage the complete lifecycle of BizzyPerson extensions. It allows for:

- Installation and uninstallation of extensions
- Activation and deactivation of extensions
- Suspension and resumption of extensions
- Updating extensions
- Tracking extension states throughout their lifecycle

The system is built on a state machine design pattern that enforces valid state transitions and provides clear visibility into extension status at all times.

## Extension Lifecycle States

Extensions can be in one of the following lifecycle states:

- **Installed**: The extension is installed but not active
- **Active**: The extension is installed and active
- **Inactive**: The extension is intentionally disabled
- **Suspended**: The extension is temporarily disabled due to errors or conflicts
- **Updatable**: The extension has an update available
- **Updating**: The extension is in the process of updating
- **Uninstalling**: The extension is being uninstalled
- **Error**: The extension is in an error state

The system strictly enforces allowed state transitions to ensure integrity and consistency. For example, an extension must be deactivated before it can be uninstalled, and a suspended extension cannot immediately transition to inactive without being resumed first.

## Lifecycle State Transitions

The following state transitions are allowed:

- **Installed** → Active, Uninstalling, Updating, Error
- **Active** → Inactive, Suspended, Uninstalling, Updating, Error
- **Inactive** → Active, Uninstalling, Updating, Error
- **Suspended** → Active, Inactive, Uninstalling, Error
- **Updatable** → Updating, Active, Inactive, Error
- **Updating** → Active, Inactive, Error
- **Uninstalling** → Error
- **Error** → Installed, Inactive, Suspended, Uninstalling

Attempting to perform an invalid state transition will result in an error.

## Using the Lifecycle Management System

The lifecycle management system is accessible through the extension API:

```javascript
const { lifecycle } = require('@bizzy/extension-api');
```

### Getting the Lifecycle State

```javascript
const state = lifecycle.getLifecycleState('example-extension');
console.log(`Extension state: ${state.state}`);
```

### Updating Lifecycle State

```javascript
const updated = lifecycle.updateLifecycleState(
  'example-extension',
  lifecycle.LifecycleState.INACTIVE,
  'User disabled the extension'
);
```

### Installing an Extension

```javascript
const result = await lifecycle.installExtension(
  '/path/to/extension',
  { activate: true }
);

if (result.success) {
  console.log(`Extension ${result.name} v${result.version} installed successfully.`);
} else {
  console.error(`Installation failed: ${result.error}`);
}
```

### Uninstalling an Extension

```javascript
const result = await lifecycle.uninstallExtension('example-extension');

if (result.success) {
  console.log(`Extension uninstalled successfully.`);
} else {
  console.error(`Uninstallation failed: ${result.error}`);
}
```

### Activating an Extension

```javascript
const activated = await lifecycle.activateExtension('example-extension');

if (activated) {
  console.log('Extension activated successfully.');
} else {
  console.error('Activation failed.');
}
```

### Deactivating an Extension

```javascript
const deactivated = await lifecycle.deactivateExtension('example-extension');

if (deactivated) {
  console.log('Extension deactivated successfully.');
} else {
  console.error('Deactivation failed.');
}
```

### Suspending an Extension

```javascript
const suspended = await lifecycle.suspendExtension(
  'example-extension',
  'Extension is causing conflicts with other extensions.'
);

if (suspended) {
  console.log('Extension suspended successfully.');
} else {
  console.error('Suspension failed.');
}
```

### Resuming a Suspended Extension

```javascript
const resumed = await lifecycle.resumeExtension('example-extension');

if (resumed) {
  console.log('Extension resumed successfully.');
} else {
  console.error('Resumption failed.');
}
```

### Checking for Updates

```javascript
const updateCheck = await lifecycle.checkForUpdate('example-extension');

if (updateCheck.hasUpdate) {
  console.log(`Update available: ${updateCheck.currentVersion} → ${updateCheck.latestVersion}`);
} else {
  console.log('No updates available.');
}
```

### Getting All Extensions with States

```javascript
const extensions = lifecycle.getAllExtensionsWithStates();

extensions.forEach(ext => {
  console.log(`${ext.name} v${ext.version}: ${ext.lifecycleState.state}`);
});
```

## Extension Lifecycle Events

The system emits the following events via the registry event emitter:

- **extension:lifecycle-change**: Emitted when an extension's lifecycle state changes
- **extension:installed**: Emitted when an extension is installed
- **extension:uninstalled**: Emitted when an extension is uninstalled
- **extension:installation-failed**: Emitted when an extension installation fails
- **extension:uninstallation-failed**: Emitted when an extension uninstallation fails
- **extension:activated**: Emitted when an extension is activated
- **extension:deactivated**: Emitted when an extension is deactivated
- **extension:activation-failed**: Emitted when an extension activation fails
- **extension:deactivation-failed**: Emitted when an extension deactivation fails
- **extension:resumption-failed**: Emitted when an extension resumption fails

Listening for these events:

```javascript
const { registry } = require('@bizzy/extension-api');

registry.on('extension:lifecycle-change', (name, state) => {
  console.log(`Extension ${name} lifecycle state changed to ${state.state}`);
});

registry.on('extension:installed', (name, manifest) => {
  console.log(`Extension ${name} v${manifest.version} installed`);
});
```

## Integrating Lifecycle Management in Extensions

Extensions can integrate with the lifecycle management system by providing deactivation functions.

### Implementing a Deactivate Function

```javascript
const { register } = require('@bizzy/extension-api');

register({
  name: 'my-extension',
  version: '1.0.0',
  
  // Initialization function
  async initialize(context) {
    // Initialize the extension
    console.log('Extension initialized');
  },
  
  // Deactivation function
  async deactivate() {
    // Cleanup resources
    console.log('Extension deactivated');
  }
});
```

The `deactivate` function is called when an extension is deactivated, suspended, or uninstalled, giving the extension an opportunity to clean up resources or save state.

## Implementation Details

### State Management

The lifecycle management system maintains a map of extension lifecycle states that is updated whenever an extension's state changes. The system also synchronizes with the core extension registry to ensure consistency.

### State Derivation

If a lifecycle state is not explicitly set for an extension, the system can derive an appropriate state from the registry's state, providing a fallback mechanism for extensions that were registered before the lifecycle management system was active.

### State Transitions

The system enforces allowed state transitions through an explicit transition mapping, ensuring that extensions follow a valid lifecycle path.

### Installation and Uninstallation

The installation process includes:
1. Validating the extension path and manifest
2. Checking for an existing installation
3. Copying extension files to the extensions directory
4. Setting the lifecycle state to `INSTALLED`
5. Optionally activating the extension

The uninstallation process includes:
1. Deactivating the extension
2. Removing the extension from the registry
3. Removing the extension's filesystem artifacts
4. Emitting appropriate events

## Best Practices

1. **Always check dependencies**: Before activating an extension, check if its dependencies are satisfied.
2. **Handle errors gracefully**: When an extension operation fails, ensure proper error handling and state rollback.
3. **Listen for lifecycle events**: Use the events emitted by the lifecycle system to coordinate with other parts of your application.
4. **Implement deactivate functions**: Extensions should always implement a deactivate function to clean up resources.
5. **Use appropriate state transitions**: Follow the allowed state transitions to ensure system integrity.
6. **Check lifecycle state before operations**: Always check an extension's current state before performing operations to prevent invalid state transitions.
7. **Provide clear error messages**: When operations fail, provide clear error messages to help users and developers understand the issue.

## Troubleshooting

### Extension Won't Activate

- Check if all dependencies are satisfied
- Check for error events in the console
- Ensure the extension has been properly installed
- Verify that the extension is not in an error state

### Extension Won't Deactivate

- Check if there are other extensions that depend on it
- Force deactivation if necessary, but be aware of potential side effects
- Check the console for error events

### Invalid State Transition

- Check the current state of the extension
- Make sure you're following the allowed state transitions
- Consider using a different transition path (e.g., suspend then uninstall instead of directly uninstalling)

## Conclusion

The extension lifecycle management system provides comprehensive control over the entire lifecycle of extensions in BizzyPerson. By following the patterns and best practices described in this document, you can ensure reliable and consistent extension behavior throughout their lifecycle. 