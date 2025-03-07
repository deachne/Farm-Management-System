// FarmLLM App JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the map if the element exists
    const mapElement = document.getElementById('field-map');
    if (mapElement) {
        initializeFieldMap(mapElement);
    }

    // Initialize mobile menu toggle
    initializeMobileMenu();

    // Initialize quick query buttons
    initializeQuickQueries();
});

/**
 * Initialize and render the field map with sample data
 */
function initializeFieldMap(mapElement) {
    // Create a Leaflet map instance
    const map = L.map(mapElement).setView([49.706, -97.203], 15);
    
    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // Sample field boundary coordinates for North 40 field (polygon)
    const fieldBoundary = [
        [49.708, -97.208],
        [49.708, -97.198],
        [49.704, -97.198],
        [49.704, -97.208],
        [49.708, -97.208]
    ];
    
    // Add the field boundary as a polygon
    const fieldPolygon = L.polygon(fieldBoundary, {
        color: '#28a745',
        weight: 2,
        fillColor: '#28a745',
        fillOpacity: 0.1
    }).addTo(map);
    
    // Fit the map to the field boundary
    map.fitBounds(fieldPolygon.getBounds());
    
    // Add sample observations as markers
    
    // Standing water observation
    const waterMarker = L.circleMarker([49.7075, -97.199], {
        radius: 10,
        color: '#fd7e14',
        fillColor: '#fd7e14',
        fillOpacity: 0.5
    }).addTo(map);
    
    waterMarker.bindPopup(`
        <div class="p-2">
            <h3 class="font-bold">Standing Water Observation</h3>
            <p class="text-sm">April 28, 2025</p>
            <p>Standing water in NE corner after recent rainfall.</p>
            <img src="https://placehold.co/300x200?text=Water+Photo" class="w-full h-auto mt-2 rounded">
        </div>
    `);
    
    // Field preparation marker
    const prepMarker = L.circleMarker([49.706, -97.203], {
        radius: 10,
        color: '#0d6efd',
        fillColor: '#0d6efd',
        fillOpacity: 0.5
    }).addTo(map);
    
    prepMarker.bindPopup(`
        <div class="p-2">
            <h3 class="font-bold">Field Preparation</h3>
            <p class="text-sm">May 2, 2025</p>
            <p>Started field preparation. Soil conditions favorable.</p>
            <p class="text-xs mt-2">Voice note available</p>
        </div>
    `);
    
    // Add a simple grid to represent field sections
    addFieldSections(map, fieldBoundary);
    
    // Add legend to the map
    addMapLegend(map);
}

/**
 * Add field sections/grid to the map
 */
function addFieldSections(map, fieldBoundary) {
    // Calculate the bounds
    const bounds = L.latLngBounds(fieldBoundary);
    const southWest = bounds.getSouthWest();
    const northEast = bounds.getNorthEast();
    
    // Calculate grid cells (2x2 grid for this example)
    const latDiff = (northEast.lat - southWest.lat) / 2;
    const lngDiff = (northEast.lng - southWest.lng) / 2;
    
    // Section A (North West)
    L.rectangle([
        [southWest.lat + latDiff, southWest.lng],
        [northEast.lat, southWest.lng + lngDiff]
    ], {
        color: '#ffc107',
        weight: 1,
        fillOpacity: 0.05,
        dashArray: '5,5'
    }).addTo(map).bindTooltip("Section A");
    
    // Section B (North East)
    L.rectangle([
        [southWest.lat + latDiff, southWest.lng + lngDiff],
        [northEast.lat, northEast.lng]
    ], {
        color: '#ffc107',
        weight: 1,
        fillOpacity: 0.05,
        dashArray: '5,5'
    }).addTo(map).bindTooltip("Section B");
    
    // Section C (South West)
    L.rectangle([
        [southWest.lat, southWest.lng],
        [southWest.lat + latDiff, southWest.lng + lngDiff]
    ], {
        color: '#ffc107',
        weight: 1,
        fillOpacity: 0.05,
        dashArray: '5,5'
    }).addTo(map).bindTooltip("Section C");
    
    // Section D (South East)
    L.rectangle([
        [southWest.lat, southWest.lng + lngDiff],
        [southWest.lat + latDiff, northEast.lng]
    ], {
        color: '#ffc107',
        weight: 1,
        fillOpacity: 0.05,
        dashArray: '5,5'
    }).addTo(map).bindTooltip("Section D");
}

/**
 * Add a legend to the map
 */
function addMapLegend(map) {
    const legend = L.control({ position: 'bottomright' });
    
    legend.onAdd = function(map) {
        const div = L.DomUtil.create('div', 'bg-white p-2 rounded shadow-md text-sm');
        div.innerHTML = `
            <div class="font-bold mb-1">Legend</div>
            <div class="flex items-center mb-1">
                <div class="w-4 h-4 rounded-full bg-blue-500 mr-2"></div>
                <span>Field Operation</span>
            </div>
            <div class="flex items-center mb-1">
                <div class="w-4 h-4 rounded-full bg-orange-500 mr-2"></div>
                <span>Observation</span>
            </div>
            <div class="flex items-center">
                <div class="w-4 h-4 border border-yellow-500 mr-2"></div>
                <span>Field Section</span>
            </div>
        `;
        return div;
    };
    
    legend.addTo(map);
}

/**
 * Initialize mobile menu toggle
 */
function initializeMobileMenu() {
    const menuButton = document.querySelector('header button');
    const mobileNav = document.querySelector('.md\\:hidden.bg-green-700');
    
    if (menuButton && mobileNav) {
        menuButton.addEventListener('click', function() {
            // Toggle the mobile navigation
            mobileNav.classList.toggle('hidden');
        });
    }
}

/**
 * Initialize quick query buttons
 */
function initializeQuickQueries() {
    const queryInput = document.querySelector('input[placeholder="Ask anything about your farm data..."]');
    const quickQueryButtons = document.querySelectorAll('.bg-gray-200.hover\\:bg-gray-300.text-gray-800.text-sm.py-1.px-3.rounded-full');
    
    if (queryInput && quickQueryButtons.length > 0) {
        quickQueryButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Set the input value to the button text
                queryInput.value = button.textContent.trim();
                
                // You would typically trigger a search or query here
                // For demo purposes, we'll just focus the input
                queryInput.focus();
                
                // In a real implementation, this would send the query to the AnythingLLM backend
                // simulateLLMQuery(queryInput.value);
            });
        });
    }
}

/**
 * Simulate an LLM query response - in a real app, this would call the AnythingLLM API
 * This is included as a placeholder to show where you would integrate with AnythingLLM
 */
function simulateLLMQuery(query) {
    console.log('Sending query to AnythingLLM:', query);
    
    // In a real implementation, you would:
    // 1. Send the query to your AnythingLLM server
    // 2. Process the response
    // 3. Update the UI with the response
    
    // Example API call structure (commented out as it's just for reference)
    /*
    fetch('/api/workspaces/farm-data/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: query,
            chatId: 'farm-management-thread',
            // Other parameters as needed
        })
    })
    .then(response => response.json())
    .then(data => {
        // Process the LLM response
        displayLLMResponse(data);
    })
    .catch(error => {
        console.error('Error querying LLM:', error);
    });
    */
    
    // For demo purposes, we'll just log that we would process the query
    setTimeout(() => {
        console.log('Received simulated response from LLM for query:', query);
    }, 1000);
}

/**
 * Create a field observation - this would be called from a mobile interface
 * This is included as a placeholder to show field observation functionality
 */
function createFieldObservation(fieldId, observationType, content, location, mediaFiles) {
    // In a real implementation, this would:
    // 1. Format the observation data
    // 2. Send it to your server/AnythingLLM
    // 3. Update the UI with the new observation
    
    console.log('Creating field observation:', {
        fieldId,
        observationType,
        content,
        location,
        mediaFiles
    });
    
    // Example of what the data structure might look like
    const observation = {
        id: Date.now(), // Unique ID
        fieldId: fieldId,
        type: observationType, // 'note', 'issue', 'operation', etc.
        content: content,
        timestamp: new Date().toISOString(),
        location: location, // { lat, lng }
        media: mediaFiles, // Array of file references
        metadata: {
            createdBy: 'current-user',
            weather: {
                temperature: 68,
                conditions: 'Partly Cloudy',
                humidity: 45
            }
        }
    };
    
    // This would be sent to your backend storage
    // And then vectorized for retrieval in AnythingLLM
    
    return observation;
}

/**
 * Process soil test data - this shows how to handle specialized farm data
 * This is included as a reference for soil test analysis functionality
 */
function processSoilTestData(testData) {
    // Sample calculation based on soil test values and yield goals
    // In a real implementation, this would implement your specific formulas
    
    const nitrogenRequired = calculateNitrogenRequirement(testData.nitrogen, testData.organicMatter, testData.yieldGoal);
    const phosphorusRequired = calculatePhosphorusRequirement(testData.phosphorus, testData.yieldGoal);
    const potassiumRequired = calculatePotassiumRequirement(testData.potassium, testData.yieldGoal);
    
    return {
        recommendations: {
            nitrogen: nitrogenRequired,
            phosphorus: phosphorusRequired,
            potassium: potassiumRequired
        },
        cost: estimateFertilizerCost(nitrogenRequired, phosphorusRequired, potassiumRequired),
        application: generateApplicationPlan(testData.fieldId, nitrogenRequired, phosphorusRequired, potassiumRequired)
    };
}

// Helper functions for soil test processing (simplified examples)
function calculateNitrogenRequirement(soilN, organicMatter, yieldGoal) {
    // Example formula: (2.5 * yieldGoal) - soilN - (10 * organicMatter)
    return Math.max(0, (2.5 * yieldGoal) - soilN - (10 * organicMatter));
}

function calculatePhosphorusRequirement(soilP, yieldGoal) {
    // Example formula: (0.4 * yieldGoal) - (0.05 * soilP)
    return Math.max(0, (0.4 * yieldGoal) - (0.05 * soilP));
}

function calculatePotassiumRequirement(soilK, yieldGoal) {
    // Example formula: (1.5 * yieldGoal) - (0.1 * soilK)
    return Math.max(0, (1.5 * yieldGoal) - (0.1 * soilK));
}

function estimateFertilizerCost(n, p, k) {
    // Example cost calculation based on current rates
    const nCost = n * 0.55; // $0.55 per lb of N
    const pCost = p * 0.65; // $0.65 per lb of P
    const kCost = k * 0.45; // $0.45 per lb of K
    
    return {
        nitrogen: nCost,
        phosphorus: pCost,
        potassium: kCost,
        total: nCost + pCost + kCost
    };
}

function generateApplicationPlan(fieldId, n, p, k) {
    // Generate an application plan based on requirements
    // This is a simplified example
    return {
        fieldId: fieldId,
        applications: [
            {
                product: "Urea (46-0-0)",
                rate: Math.round(n / 0.46 * 100) / 100, // Convert to product rate
                timing: "Pre-planting"
            },
            {
                product: "Monoammonium Phosphate (11-52-0)",
                rate: Math.round(p / 0.52 * 100) / 100,
                timing: "With seed"
            },
            {
                product: "Potassium Chloride (0-0-60)",
                rate: Math.round(k / 0.60 * 100) / 100,
                timing: "Pre-planting"
            }
        ]
    };
}