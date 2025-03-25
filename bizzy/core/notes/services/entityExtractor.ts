/**
 * Service for extracting entities from note content with agricultural focus
 */
export class EntityExtractor {
  // Agricultural entity categories with common terms
  private agriculturalEntities = {
    crops: [
      'corn', 'soybean', 'wheat', 'cotton', 'rice', 'barley', 'oat', 'canola',
      'sunflower', 'sugarcane', 'alfalfa', 'hay', 'potato', 'tomato', 'lettuce'
    ],
    livestock: [
      'cattle', 'cow', 'calf', 'beef', 'dairy', 'sheep', 'lamb', 'goat', 'pig', 
      'hog', 'poultry', 'chicken', 'turkey', 'duck'
    ],
    equipment: [
      'tractor', 'planter', 'harvester', 'combine', 'spreader', 'sprayer', 'seeder',
      'drill', 'plow', 'cultivator', 'baler', 'implement', 'attachment', 'equipment'
    ],
    fields: [
      'field', 'plot', 'acre', 'pasture', 'farmland', 'north', 'south', 'east', 
      'west', 'irrigated', 'dry', 'southwest', 'northeast'
    ],
    inputs: [
      'fertilizer', 'nitrogen', 'phosphorus', 'potassium', 'herbicide', 'pesticide',
      'fungicide', 'insecticide', 'seed', 'chemical', 'lime', 'manure', 'compost'
    ],
    weather: [
      'rain', 'precipitation', 'drought', 'flood', 'frost', 'snow', 'hail', 
      'temperature', 'humidity', 'heat', 'degree', 'forecast', 'storm', 'wind'
    ],
    soil: [
      'soil', 'sandy', 'clay', 'loam', 'organic', 'ph', 'nutrient', 'compaction',
      'tilth', 'erosion', 'drainage', 'moisture', 'fertility', 'structure'
    ],
    irrigation: [
      'irrigation', 'water', 'pivot', 'sprinkler', 'drip', 'tile', 'drainage',
      'pump', 'well', 'reservoir', 'moisture', 'flow', 'pressure'
    ],
    management: [
      'rotation', 'conservation', 'tillage', 'no-till', 'organic', 'conventional',
      'sustainable', 'precision', 'program', 'plan', 'budget', 'schedule'
    ],
    financial: [
      'price', 'cost', 'expense', 'budget', 'profit', 'loss', 'margin', 'market',
      'sale', 'contract', 'insurance', 'loan', 'finance', 'subsidy', 'grant'
    ]
  };
  
  /**
   * Extract entities from content with agricultural focus
   */
  extractEntities(content: string): string[] {
    if (!content || content.trim().length === 0) {
      return [];
    }
    
    const normalizedContent = content.toLowerCase();
    const extractedTags = new Set<string>();
    
    // Extract categories and specific terms
    Object.entries(this.agriculturalEntities).forEach(([category, terms]) => {
      // First check for category mentions as general tags
      if (this.containsWord(normalizedContent, category)) {
        extractedTags.add(category);
      }
      
      // Then look for specific terms
      terms.forEach(term => {
        if (this.containsWord(normalizedContent, term)) {
          extractedTags.add(term);
          
          // Also add the category as a tag for better organization
          if (category !== term) {
            extractedTags.add(category);
          }
        }
      });
    });
    
    // Detect specific patterns - amounts and measurements
    this.extractPatterns(normalizedContent, extractedTags);
    
    return Array.from(extractedTags);
  }
  
  /**
   * Check if content contains a word, avoiding partial matches
   */
  private containsWord(content: string, word: string): boolean {
    // Create a regex pattern that matches the word as a whole word
    const pattern = new RegExp(`\\b${word}\\b`, 'i');
    return pattern.test(content);
  }
  
  /**
   * Extract specific patterns like measurements
   */
  private extractPatterns(content: string, tags: Set<string>): void {
    // Date patterns
    if (/\b(plant|planting|sow|seeding)\b/i.test(content)) {
      tags.add('planting');
    }
    
    if (/\b(harvest|harvesting|yield)\b/i.test(content)) {
      tags.add('harvest');
    }
    
    // Measurement patterns
    if (/\b\d+\s*(bushel|bu|bsh)\b/i.test(content)) {
      tags.add('yield');
    }
    
    if (/\b\d+\s*(acre|hectare|field)\b/i.test(content)) {
      tags.add('acreage');
    }
    
    // Financial patterns
    if (/\$\d+|\d+\s*dollars/i.test(content)) {
      tags.add('financial');
    }
    
    // Weather patterns
    if (/\b\d+\s*(degree|°|f|c)\b/i.test(content) || 
        /\b(hot|cold|warm|cool|temp|temperature)\b/i.test(content)) {
      tags.add('temperature');
    }
    
    if (/\b\d+\s*(inch|in|mm|cm)\s*(rain|rainfall|precipitation)\b/i.test(content)) {
      tags.add('rainfall');
    }
  }
} 