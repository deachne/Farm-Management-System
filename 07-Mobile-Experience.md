# Farm Management System - Mobile Experience

This document outlines the mobile experience design and implementation for our agricultural knowledge management system, focusing on field usability and offline capabilities.

## Design Philosophy

The mobile experience follows these core principles:

1. **Field-First Design**
   - Optimized for outdoor visibility
   - Large touch targets for gloved operation
   - Simple, clear interface for in-field use

2. **Offline Capability**
   - Full functionality without constant connectivity
   - Local data storage and sync
   - Background synchronization when connected

3. **Resource Efficiency**
   - Minimal battery usage
   - Efficient data transfer
   - Optimized storage usage

4. **Context Awareness**
   - Location-based features
   - Weather-aware interface
   - Time-of-day adaptations

## Core Mobile Features

### 1. Field Observations Interface

```javascript
// Mobile observation component
const FieldObservationComponent = () => {
  const [location, setLocation] = useState(null);
  const [offline, setOffline] = useState(false);
  const [observations, setObservations] = useState([]);
  
  // Location tracking
  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      position => setLocation(position),
      error => console.error('Location error:', error),
      { enableHighAccuracy: true }
    );
    
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);
  
  // Offline detection
  useEffect(() => {
    const handleConnectionChange = () => {
      setOffline(!navigator.onLine);
    };
    
    window.addEventListener('online', handleConnectionChange);
    window.addEventListener('offline', handleConnectionChange);
    
    return () => {
      window.removeEventListener('online', handleConnectionChange);
      window.removeEventListener('offline', handleConnectionChange);
    };
  }, []);
  
  // Save observation
  const saveObservation = async (observation) => {
    try {
      if (offline) {
        // Save to local storage
        await saveToLocalStorage(observation);
      } else {
        // Save to server
        await saveToServer(observation);
      }
      
      setObservations([...observations, observation]);
    } catch (error) {
      console.error('Error saving observation:', error);
    }
  };
  
  return (
    <div className="field-observation">
      {/* Observation form */}
      <ObservationForm 
        location={location}
        offline={offline}
        onSave={saveObservation}
      />
      
      {/* Recent observations */}
      <RecentObservations 
        observations={observations}
        offline={offline}
      />
    </div>
  );
};
```

### 2. Offline Data Management

```javascript
// Offline data manager
class OfflineDataManager {
  constructor() {
    this.db = new IndexedDB('farm-data');
    this.syncQueue = [];
  }
  
  async saveObservation(observation) {
    // Save to local database
    await this.db.observations.add({
      ...observation,
      timestamp: new Date(),
      synced: false
    });
    
    // Add to sync queue
    this.syncQueue.push(observation);
    
    // Attempt sync if online
    if (navigator.onLine) {
      await this.syncData();
    }
  }
  
  async syncData() {
    const unsynced = await this.db.observations
      .where('synced')
      .equals(false)
      .toArray();
    
    for (const observation of unsynced) {
      try {
        // Attempt to sync with server
        await api.syncObservation(observation);
        
        // Mark as synced
        await this.db.observations.update(
          observation.id,
          { synced: true }
        );
      } catch (error) {
        console.error('Sync error:', error);
      }
    }
  }
  
  async getLocalObservations() {
    return await this.db.observations.toArray();
  }
}
```

### 3. Location-Aware Features

```javascript
// Location manager
class LocationManager {
  constructor() {
    this.currentLocation = null;
    this.nearbyFields = [];
  }
  
  async startTracking() {
    if (!navigator.geolocation) {
      throw new Error('Geolocation not supported');
    }
    
    return new Promise((resolve, reject) => {
      navigator.geolocation.watchPosition(
        position => {
          this.currentLocation = position;
          this.updateNearbyFields();
          resolve(position);
        },
        error => reject(error),
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    });
  }
  
  async updateNearbyFields() {
    if (!this.currentLocation) return;
    
    const { latitude, longitude } = this.currentLocation.coords;
    
    // Query nearby fields
    this.nearbyFields = await api.getNearbyFields(
      latitude,
      longitude,
      1000 // Search radius in meters
    );
  }
  
  getNearestField() {
    if (!this.nearbyFields.length) return null;
    
    return this.nearbyFields.reduce((nearest, field) => {
      const distance = this.calculateDistance(
        this.currentLocation.coords,
        field.coordinates
      );
      
      return distance < nearest.distance ? 
        { field, distance } : nearest;
    }, { distance: Infinity }).field;
  }
  
  calculateDistance(point1, point2) {
    // Haversine formula implementation
    // Calculate distance between two points
  }
}
```

## Mobile-Specific UI Components

### 1. Touch-Optimized Controls

```javascript
// Touch-optimized button component
const TouchButton = ({ 
  label, 
  onPress, 
  size = 'normal',
  disabled = false 
}) => {
  const buttonSize = {
    small: 'h-12 w-12',
    normal: 'h-16 w-16',
    large: 'h-20 w-20'
  }[size];
  
  return (
    <button
      className={`
        rounded-full
        ${buttonSize}
        flex
        items-center
        justify-center
        bg-primary-500
        active:bg-primary-600
        disabled:bg-gray-300
        shadow-lg
        ${disabled ? 'opacity-50' : ''}
      `}
      onClick={onPress}
      disabled={disabled}
    >
      <span className="text-white font-bold">
        {label}
      </span>
    </button>
  );
};
```

### 2. Field-Optimized Forms

```javascript
// Field-optimized form component
const FieldForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({});
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  return (
    <form 
      onSubmit={handleSubmit}
      className="space-y-6 p-4"
    >
      {/* Large, easy-to-tap form fields */}
      <div className="space-y-2">
        <label className="text-lg font-bold">
          Observation Type
        </label>
        <select 
          className="
            w-full 
            h-12 
            text-lg 
            border-2 
            rounded-lg
            bg-white
          "
          onChange={e => setFormData({
            ...formData,
            type: e.target.value
          })}
        >
          <option value="crop">Crop Condition</option>
          <option value="pest">Pest Issue</option>
          <option value="soil">Soil Condition</option>
        </select>
      </div>
      
      {/* Voice input option */}
      <div className="space-y-2">
        <label className="text-lg font-bold">
          Description
        </label>
        <VoiceInput
          onTranscription={text => setFormData({
            ...formData,
            description: text
          })}
        />
      </div>
      
      {/* Image capture */}
      <div className="space-y-2">
        <label className="text-lg font-bold">
          Photos
        </label>
        <ImageCapture
          onCapture={images => setFormData({
            ...formData,
            images
          })}
        />
      </div>
      
      <TouchButton
        label="Save"
        size="large"
        onPress={handleSubmit}
      />
    </form>
  );
};
```

### 3. Offline Status Indicator

```javascript
// Offline status indicator component
const OfflineIndicator = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [syncPending, setSyncPending] = useState(false);
  
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  return (
    <div className={`
      fixed
      bottom-4
      right-4
      rounded-full
      px-4
      py-2
      ${isOffline ? 'bg-red-500' : 'bg-green-500'}
      text-white
      font-bold
      flex
      items-center
      space-x-2
    `}>
      <div className={`
        w-3
        h-3
        rounded-full
        ${isOffline ? 'bg-red-300' : 'bg-green-300'}
      `} />
      <span>
        {isOffline ? 'Offline' : 'Online'}
      </span>
      {syncPending && (
        <span className="ml-2">
          (Sync Pending)
        </span>
      )}
    </div>
  );
};
```

## Performance Optimization

### 1. Image Optimization

```javascript
// Image optimization utility
const optimizeImage = async (file) => {
  // Create canvas for resizing
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  // Load image
  const img = await createImageBitmap(file);
  
  // Calculate new dimensions
  const maxSize = 1200;
  const scale = Math.min(
    maxSize / img.width,
    maxSize / img.height
  );
  
  // Set canvas size
  canvas.width = img.width * scale;
  canvas.height = img.height * scale;
  
  // Draw resized image
  ctx.drawImage(
    img,
    0,
    0,
    canvas.width,
    canvas.height
  );
  
  // Convert to blob
  return new Promise(resolve => {
    canvas.toBlob(
      blob => resolve(blob),
      'image/jpeg',
      0.8
    );
  });
};
```

### 2. Data Caching

```javascript
// Cache manager
class CacheManager {
  constructor() {
    this.cache = new Cache('farm-data-cache');
  }
  
  async cacheFieldData(fieldId, data) {
    const key = `field-${fieldId}`;
    await this.cache.put(key, new Response(
      JSON.stringify(data)
    ));
  }
  
  async getCachedFieldData(fieldId) {
    const key = `field-${fieldId}`;
    const response = await this.cache.match(key);
    
    if (!response) return null;
    
    return response.json();
  }
  
  async clearCache() {
    await this.cache.delete();
  }
}
```

## Testing and Quality Assurance

### 1. Mobile Testing Strategy

- Device testing matrix covering common devices
- Field testing under various conditions
- Network condition testing
- Battery impact testing

### 2. Performance Metrics

- Page load times
- Offline functionality
- Sync performance
- Battery usage
- Data usage

### 3. Field Testing Protocol

- Regular testing under actual field conditions
- Testing with various network conditions
- Testing with different weather conditions
- User feedback collection

## Security Considerations

### 1. Data Security

- Encryption of cached data
- Secure sync protocols
- Access control for offline data
- Secure credential storage

### 2. Location Privacy

- User control over location tracking
- Clear indication of location usage
- Option to disable precise location
- Regular location data cleanup

## Future Enhancements

1. **Augmented Reality Features**
   - Field boundary visualization
   - Equipment guidance
   - Pest and disease identification

2. **Advanced Offline Capabilities**
   - Predictive data caching
   - Smart sync prioritization
   - Compressed data transfer

3. **Enhanced Field Tools**
   - Advanced measurement tools
   - 3D terrain visualization
   - Real-time collaboration features

## Implementation Tools

### PWABuilder

To simplify the development of our browser-based mobile experience, we recommend using [PWABuilder](https://github.com/pwa-builder/PWABuilder), a Microsoft-backed tool designed to streamline PWA creation:

#### Key PWABuilder Components

1. **PWA Starter**: A production-tested template for creating new PWA projects with:
   - Pre-configured service workers
   - Web app manifest
   - Modern web components
   - Responsive design foundation

2. **PWA Studio**: A VS Code extension that provides:
   - Manifest validation and generation
   - Service worker creation and testing
   - Debugging tools for PWA features
   - Development guidance

3. **Web Components**: Ready-made components like pwa-install for better installation experiences

#### Implementation Strategy with PWABuilder

1. **Foundation Phase**:
   - Start with the PWA Starter template
   - Configure the manifest for farm-specific branding
   - Customize the service worker for offline field data

2. **Feature Development**:
   - Implement the field observation components
   - Create the offline data management system
   - Build the location-aware features

3. **Testing and Optimization**:
   - Use PWA Studio tools to validate the implementation
   - Test offline functionality in various conditions
   - Optimize for field use cases

4. **Distribution Options**:
   - Direct browser access via URL
   - Home screen installation
   - Optional packaging for app stores if desired

Using PWABuilder will significantly reduce development time while ensuring best practices for PWA implementation, allowing us to focus on the agricultural-specific features rather than PWA infrastructure.

### Speech-to-Text Implementation

For voice input in field conditions, we'll implement a hybrid approach:

#### Browser Speech Recognition API

The primary method will use the Web Speech API where supported:

```javascript
// Speech recognition implementation
class VoiceInputManager {
  constructor() {
    this.recognition = null;
    this.isSupported = 'SpeechRecognition' in window || 
                       'webkitSpeechRecognition' in window;
    this.isListening = false;
    this.transcript = '';
    this.onTranscriptUpdate = null;
  }
  
  initialize() {
    if (!this.isSupported) {
      console.warn('Speech recognition not supported in this browser');
      return false;
    }
    
    const SpeechRecognition = window.SpeechRecognition || 
                             window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    
    // Configure recognition
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';
    
    // Set up event handlers
    this.recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }
      
      this.transcript = finalTranscript;
      
      if (this.onTranscriptUpdate) {
        this.onTranscriptUpdate(finalTranscript, interimTranscript);
      }
    };
    
    this.recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
    };
    
    return true;
  }
  
  start() {
    if (!this.recognition && !this.initialize()) {
      return false;
    }
    
    try {
      this.recognition.start();
      this.isListening = true;
      return true;
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      return false;
    }
  }
  
  stop() {
    if (!this.recognition) return false;
    
    try {
      this.recognition.stop();
      this.isListening = false;
      return true;
    } catch (error) {
      console.error('Failed to stop speech recognition:', error);
      return false;
    }
  }
}
```

#### Fallback for iOS and Offline Use

For iOS Safari or offline scenarios, we'll implement:

1. **Audio Recording Fallback**: Capture audio for later processing
2. **Guided Template Input**: Structured forms with voice button per field
3. **Server-Side Processing**: When connection is available, process saved audio

### Camera Integration

Our camera implementation will support both photo capture and vision model integration:

#### Photo Capture Component

```javascript
// Camera component for field observations
class CameraManager {
  constructor() {
    this.stream = null;
    this.videoElement = null;
    this.canvasElement = null;
    this.facingMode = 'environment'; // Use rear camera by default
  }
  
  async initialize(videoElement, canvasElement) {
    this.videoElement = videoElement;
    this.canvasElement = canvasElement;
    
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: this.facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });
      
      this.videoElement.srcObject = this.stream;
      await new Promise(resolve => {
        this.videoElement.onloadedmetadata = () => {
          this.videoElement.play();
          resolve();
        };
      });
      
      // Set canvas dimensions to match video
      this.canvasElement.width = this.videoElement.videoWidth;
      this.canvasElement.height = this.videoElement.videoHeight;
      
      return true;
    } catch (error) {
      console.error('Camera initialization failed:', error);
      return false;
    }
  }
  
  switchCamera() {
    this.facingMode = this.facingMode === 'environment' ? 'user' : 'environment';
    this.stop();
    return this.initialize(this.videoElement, this.canvasElement);
  }
  
  capturePhoto() {
    if (!this.stream) return null;
    
    const context = this.canvasElement.getContext('2d');
    context.drawImage(this.videoElement, 0, 0);
    
    // Get image as data URL (JPEG format, 0.85 quality)
    return this.canvasElement.toDataURL('image/jpeg', 0.85);
  }
  
  async captureAndOptimize() {
    const imageData = this.capturePhoto();
    if (!imageData) return null;
    
    // Optimize image for field use and AI processing
    return await this.optimizeImage(imageData);
  }
  
  async optimizeImage(imageData) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        // Target size for efficient storage and transfer
        const maxSize = 1200;
        
        // Calculate new dimensions
        let width = img.width;
        let height = img.height;
        if (width > height && width > maxSize) {
          height = Math.round((height * maxSize) / width);
          width = maxSize;
        } else if (height > maxSize) {
          width = Math.round((width * maxSize) / height);
          height = maxSize;
        }
        
        // Create canvas for resizing
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to blob with compression
        canvas.toBlob((blob) => {
          // Create object URL for the blob
          const optimizedImageUrl = URL.createObjectURL(blob);
          resolve({
            original: imageData,
            optimized: optimizedImageUrl,
            blob: blob,
            width: width,
            height: height,
            size: blob.size
          });
        }, 'image/jpeg', 0.85);
      };
      
      img.src = imageData;
    });
  }
  
  stop() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
  }
}
```

#### Vision Model Integration

For plant, weed, and pest identification, we'll implement:

1. **Local Image Capture and Storage**: Save images with metadata
2. **Offline Queuing**: Store images for later processing
3. **AI Processing Pipeline**: When online, send to vision models
4. **Result Integration**: Associate AI analysis with field observations

This implementation will allow for:
- Immediate photo capture in the field
- Offline storage of images
- Later processing with vision models
- Integration of results with observation data

### AI-Generated Template System

Our template system will use a hybrid approach combining predefined templates with AI-generated customizations:

#### Template Generation Flow

```javascript
// Template manager for field observations
class TemplateManager {
  constructor(apiClient, offlineStorage) {
    this.apiClient = apiClient;
    this.storage = offlineStorage;
    this.activeTemplates = [];
  }
  
  async initialize() {
    // Load cached templates from storage
    this.activeTemplates = await this.storage.getTemplates();
    
    // If online, sync with server
    if (navigator.onLine) {
      await this.syncTemplates();
    }
    
    return this.activeTemplates.length > 0;
  }
  
  async syncTemplates() {
    try {
      // Get last sync timestamp
      const lastSync = localStorage.getItem('lastTemplateSync') || 0;
      
      // Fetch templates from server
      const response = await this.apiClient.getTemplates(lastSync);
      
      if (response.templates && response.templates.length > 0) {
        // Store new templates
        await this.storage.saveTemplates(response.templates);
        
        // Update active templates
        this.activeTemplates = [
          ...this.activeTemplates.filter(t => !response.templates.find(rt => rt.id === t.id)),
          ...response.templates
        ];
        
        // Update sync timestamp
        localStorage.setItem('lastTemplateSync', Date.now());
      }
      
      return true;
    } catch (error) {
      console.error('Template sync failed:', error);
      return false;
    }
  }
  
  async getTemplateForActivity(activity, context) {
    // Find matching template
    const template = this.findBestTemplate(activity, context);
    
    if (template) {
      return template;
    }
    
    // If online, request AI-generated template
    if (navigator.onLine) {
      try {
        const generatedTemplate = await this.apiClient.generateTemplate(activity, context);
        
        if (generatedTemplate) {
          // Save for future use
          await this.storage.saveTemplate(generatedTemplate);
          this.activeTemplates.push(generatedTemplate);
          
          return generatedTemplate;
        }
      } catch (error) {
        console.error('Template generation failed:', error);
      }
    }
    
    // Fallback to basic template
    return this.getBasicTemplate(activity);
  }
  
  findBestTemplate(activity, context) {
    // Find template matching activity and context
    const matches = this.activeTemplates.filter(template => {
      // Check activity match
      const activityMatch = template.activities.some(a => 
        activity.toLowerCase().includes(a.toLowerCase())
      );
      
      if (!activityMatch) return false;
      
      // Check context match (crop, season, etc.)
      const contextScore = this.calculateContextScore(template, context);
      
      return contextScore > 0.7; // Threshold for good match
    });
    
    // Sort by relevance
    matches.sort((a, b) => 
      this.calculateContextScore(b, context) - this.calculateContextScore(a, context)
    );
    
    return matches.length > 0 ? matches[0] : null;
  }
  
  calculateContextScore(template, context) {
    let score = 0;
    let factors = 0;
    
    // Check crop match
    if (template.crop && context.crop) {
      score += template.crop.toLowerCase() === context.crop.toLowerCase() ? 1 : 0;
      factors++;
    }
    
    // Check season match
    if (template.season && context.season) {
      score += template.season.toLowerCase() === context.season.toLowerCase() ? 1 : 0;
      factors++;
    }
    
    // Check growth stage
    if (template.growthStage && context.growthStage) {
      score += template.growthStage.toLowerCase() === context.growthStage.toLowerCase() ? 1 : 0;
      factors++;
    }
    
    return factors > 0 ? score / factors : 0;
  }
  
  getBasicTemplate(activity) {
    // Create a simple template based on activity
    return {
      id: `basic-${Date.now()}`,
      name: `Basic ${activity} Template`,
      description: `Auto-generated template for ${activity}`,
      activities: [activity],
      sections: [
        {
          title: 'General Information',
          fields: [
            {
              id: 'notes',
              type: 'textarea',
              label: 'Notes',
              required: true
            },
            {
              id: 'photos',
              type: 'photo',
              label: 'Photos',
              required: false,
              multiple: true
            }
          ]
        }
      ]
    };
  }
}
```

#### Template Rendering

```javascript
// Template renderer component
class TemplateRenderer {
  constructor(templateManager, voiceInput, cameraManager) {
    this.templateManager = templateManager;
    this.voiceInput = voiceInput;
    this.cameraManager = cameraManager;
    this.currentTemplate = null;
    this.formData = {};
  }
  
  async renderTemplate(activity, context, container) {
    // Get appropriate template
    this.currentTemplate = await this.templateManager.getTemplateForActivity(activity, context);
    
    if (!this.currentTemplate) {
      container.innerHTML = '<p>No template available for this activity.</p>';
      return false;
    }
    
    // Reset form data
    this.formData = {
      templateId: this.currentTemplate.id,
      activity: activity,
      context: context,
      timestamp: new Date().toISOString(),
      location: await this.getCurrentLocation(),
      sections: {}
    };
    
    // Render template
    container.innerHTML = '';
    
    // Create header
    const header = document.createElement('div');
    header.className = 'template-header';
    header.innerHTML = `
      <h2>${this.currentTemplate.name}</h2>
      <p>${this.currentTemplate.description || ''}</p>
    `;
    container.appendChild(header);
    
    // Create sections
    this.currentTemplate.sections.forEach(section => {
      const sectionElement = this.renderSection(section);
      container.appendChild(sectionElement);
    });
    
    // Create submit button
    const submitButton = document.createElement('button');
    submitButton.className = 'submit-button';
    submitButton.textContent = 'Save Observation';
    submitButton.addEventListener('click', () => this.submitForm());
    container.appendChild(submitButton);
    
    return true;
  }
  
  renderSection(section) {
    const sectionElement = document.createElement('div');
    sectionElement.className = 'template-section';
    
    // Create section header
    const header = document.createElement('h3');
    header.textContent = section.title;
    sectionElement.appendChild(header);
    
    // Initialize section data
    this.formData.sections[section.id] = {};
    
    // Create fields
    section.fields.forEach(field => {
      const fieldElement = this.renderField(section.id, field);
      sectionElement.appendChild(fieldElement);
    });
    
    return sectionElement;
  }
  
  renderField(sectionId, field) {
    const fieldElement = document.createElement('div');
    fieldElement.className = 'template-field';
    
    // Create label
    const label = document.createElement('label');
    label.textContent = field.label;
    if (field.required) {
      const required = document.createElement('span');
      required.className = 'required';
      required.textContent = '*';
      label.appendChild(required);
    }
    fieldElement.appendChild(label);
    
    // Create input based on field type
    let input;
    
    switch (field.type) {
      case 'text':
        input = document.createElement('input');
        input.type = 'text';
        input.id = field.id;
        input.required = field.required;
        break;
        
      case 'textarea':
        input = document.createElement('textarea');
        input.id = field.id;
        input.required = field.required;
        break;
        
      case 'select':
        input = document.createElement('select');
        input.id = field.id;
        input.required = field.required;
        
        // Add options
        if (field.options) {
          field.options.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option.value || option;
            optionElement.textContent = option.label || option;
            input.appendChild(optionElement);
          });
        }
        break;
        
      case 'number':
        input = document.createElement('input');
        input.type = 'number';
        input.id = field.id;
        input.required = field.required;
        if (field.min !== undefined) input.min = field.min;
        if (field.max !== undefined) input.max = field.max;
        break;
        
      case 'photo':
        input = this.createPhotoInput(field);
        break;
        
      default:
        input = document.createElement('input');
        input.type = 'text';
        input.id = field.id;
    }
    
    // Add change handler
    input.addEventListener('change', (e) => {
      this.formData.sections[sectionId][field.id] = e.target.value;
    });
    
    fieldElement.appendChild(input);
    
    // Add voice input button for text fields
    if (field.type === 'text' || field.type === 'textarea') {
      const voiceButton = this.createVoiceButton(input);
      fieldElement.appendChild(voiceButton);
    }
    
    return fieldElement;
  }
  
  createVoiceButton(targetInput) {
    const button = document.createElement('button');
    button.className = 'voice-input-button';
    button.innerHTML = '<i class="microphone-icon"></i>';
    
    // Add voice input functionality
    button.addEventListener('touchstart', () => {
      // Start voice recognition
      this.voiceInput.onTranscriptUpdate = (final, interim) => {
        targetInput.value = final;
        targetInput.dispatchEvent(new Event('change'));
      };
      this.voiceInput.start();
      button.classList.add('recording');
    });
    
    button.addEventListener('touchend', () => {
      // Stop voice recognition
      this.voiceInput.stop();
      button.classList.remove('recording');
    });
    
    return button;
  }
  
  createPhotoInput(field) {
    const container = document.createElement('div');
    container.className = 'photo-input-container';
    
    // Create photo preview area
    const previewArea = document.createElement('div');
    previewArea.className = 'photo-preview-area';
    container.appendChild(previewArea);
    
    // Create capture button
    const captureButton = document.createElement('button');
    captureButton.className = 'capture-button';
    captureButton.textContent = 'Take Photo';
    captureButton.addEventListener('click', async () => {
      // Initialize camera if needed
      if (!this.cameraManager.videoElement) {
        const video = document.createElement('video');
        const canvas = document.createElement('canvas');
        
        await this.cameraManager.initialize(video, canvas);
      }
      
      // Show camera UI
      this.showCameraUI(previewArea, field.id);
    });
    container.appendChild(captureButton);
    
    return container;
  }
  
  showCameraUI(previewArea, fieldId) {
    // Create camera UI
    const cameraUI = document.createElement('div');
    cameraUI.className = 'camera-ui';
    
    // Add video element
    cameraUI.appendChild(this.cameraManager.videoElement);
    
    // Add capture button
    const captureButton = document.createElement('button');
    captureButton.className = 'camera-capture-button';
    captureButton.textContent = 'Capture';
    captureButton.addEventListener('click', async () => {
      const imageData = await this.cameraManager.captureAndOptimize();
      
      // Store image data
      if (!this.formData.photos) {
        this.formData.photos = {};
      }
      this.formData.photos[fieldId] = imageData;
      
      // Update preview
      this.updatePhotoPreview(previewArea, imageData);
      
      // Close camera UI
      this.cameraManager.stop();
      cameraUI.remove();
    });
    cameraUI.appendChild(captureButton);
    
    // Add switch camera button
    const switchButton = document.createElement('button');
    switchButton.className = 'switch-camera-button';
    switchButton.textContent = 'Switch Camera';
    switchButton.addEventListener('click', () => {
      this.cameraManager.switchCamera();
    });
    cameraUI.appendChild(switchButton);
    
    // Add close button
    const closeButton = document.createElement('button');
    closeButton.className = 'close-camera-button';
    closeButton.textContent = 'Cancel';
    closeButton.addEventListener('click', () => {
      this.cameraManager.stop();
      cameraUI.remove();
    });
    cameraUI.appendChild(closeButton);
    
    // Add to document
    document.body.appendChild(cameraUI);
  }
  
  updatePhotoPreview(previewArea, imageData) {
    previewArea.innerHTML = '';
    
    const img = document.createElement('img');
    img.src = imageData.optimized;
    img.className = 'photo-preview';
    previewArea.appendChild(img);
  }
  
  async getCurrentLocation() {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(null);
        return;
      }
      
      navigator.geolocation.getCurrentPosition(
        position => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
        },
        error => {
          console.error('Geolocation error:', error);
          resolve(null);
        }
      );
    });
  }
  
  async submitForm() {
    // Validate form
    const isValid = this.validateForm();
    
    if (!isValid) {
      alert('Please fill in all required fields.');
      return;
    }
    
    // Save observation
    try {
      const result = await this.saveObservation();
      
      if (result.success) {
        alert('Observation saved successfully!');
        // Reset form or navigate away
      } else {
        alert('Failed to save observation: ' + result.error);
      }
    } catch (error) {
      console.error('Error saving observation:', error);
      alert('An error occurred while saving the observation.');
    }
  }
  
  validateForm() {
    // Check required fields
    let valid = true;
    
    this.currentTemplate.sections.forEach(section => {
      section.fields.forEach(field => {
        if (field.required) {
          const value = this.formData.sections[section.id]?.[field.id];
          if (!value) {
            valid = false;
          }
        }
      });
    });
    
    return valid;
  }
  
  async saveObservation() {
    // Save to offline storage
    try {
      const storage = await getOfflineStorage();
      const id = await storage.saveObservation(this.formData);
      
      // If online, sync immediately
      if (navigator.onLine) {
        const syncManager = new SyncManager(storage);
        await syncManager.syncObservation(id);
      }
      
      return { success: true, id };
    } catch (error) {
      console.error('Error saving observation:', error);
      return { success: false, error: error.message };
    }
  }
}

### Data Flow Between Mobile App and AnythingLLM

The data flow between the mobile app and AnythingLLM follows this pattern:

1. **Template Distribution**:
   - AnythingLLM generates templates based on farm context
   - Templates are distributed to mobile devices
   - Templates are cached locally for offline use

2. **Field Data Collection**:
   - User selects appropriate template
   - Data is collected using form, voice, and camera
   - Observations are stored locally with IndexedDB

3. **Synchronization Process**:
   - When connectivity is available, data is synced to server
   - Sync manager prioritizes critical data
   - Background sync handles large media files

4. **AI Processing**:
   - AnythingLLM processes synced observations
   - AI extracts insights and patterns
   - Vision models analyze field images
   - Results are stored in vector database

5. **Knowledge Distribution**:
   - Insights are made available to all devices
   - Recommendations are pushed to relevant users
   - Historical patterns inform future templates

This bidirectional flow ensures that:
- Field data is captured reliably even offline
- AI processing happens when connectivity is available
- Knowledge is distributed back to field operations
- The system continuously improves with more data

The implementation leverages modern web technologies to create a robust, offline-capable mobile experience that integrates seamlessly with AnythingLLM's powerful AI capabilities. 