/**
 * Utility functions for internal linking and SEO optimization
 */

export interface LinkAttributes {
  rel?: string;
  'aria-label'?: string;
  title?: string;
  'data-analytics'?: string;
}

/**
 * Generate SEO-friendly anchor text variations
 */
export const anchorTextVariations = {
  dashboard: [
    'dashboard overview',
    'journaling statistics',
    'your journal dashboard',
    'view insights',
    'personal overview'
  ],
  
  journal: [
    'write new entry',
    'create journal entry',
    'start journaling',
    'express your thoughts',
    'capture your mood'
  ],
  
  calendar: [
    'view calendar',
    'journal timeline',
    'track your journey',
    'see past entries',
    'monthly overview'
  ],
  
  pricing: [
    'upgrade to premium',
    'view pricing plans',
    'unlock premium features',
    'subscription options',
    'premium benefits'
  ],
  
  settings: [
    'customize settings',
    'manage preferences',
    'account settings',
    'personalize experience',
    'privacy controls'
  ]
};

/**
 * Get appropriate link attributes based on context
 */
export const getLinkAttributes = (
  targetPage: string,
  context: 'navigation' | 'contextual' | 'cta' | 'breadcrumb' = 'contextual'
): LinkAttributes => {
  const baseAttributes: LinkAttributes = {
    rel: 'noopener'
  };

  switch (targetPage) {
    case '/dashboard':
      return {
        ...baseAttributes,
        'aria-label': 'Navigate to dashboard to view your journaling overview and statistics',
        title: 'View your journaling dashboard with insights and recent entries'
      };
    
    case '/journal':
      return {
        ...baseAttributes,
        'aria-label': 'Start writing a new journal entry with mood tracking',
        title: 'Create a new journal entry and track your mood'
      };
    
    case '/calendar':
      return {
        ...baseAttributes,
        'aria-label': 'View your journal entries in calendar format to track patterns',
        title: 'Browse your journal entries by date and track your journaling consistency'
      };
    
    case '/pricing':
      return {
        ...baseAttributes,
        'aria-label': 'View premium subscription plans and upgrade options',
        title: 'Explore MindWeave Premium features and pricing plans'
      };
    
    case '/settings':
      return {
        ...baseAttributes,
        'aria-label': 'Customize your MindWeave experience and manage preferences',
        title: 'Manage your account settings, privacy, and app preferences'
      };
    
    default:
      return baseAttributes;
  }
};

/**
 * Generate contextual anchor text based on current page and target
 */
export const getContextualAnchorText = (
  currentPage: string,
  targetPage: string,
  context: 'empty-state' | 'related' | 'navigation' | 'cta' = 'related'
): string => {
  const variations = anchorTextVariations[targetPage.replace('/', '') as keyof typeof anchorTextVariations] || [];
  
  if (context === 'empty-state') {
    switch (targetPage) {
      case '/journal':
        return 'Start your first journal entry';
      case '/calendar':
        return 'Explore the calendar view';
      case '/settings':
        return 'Customize your experience';
      default:
        return variations[0] || 'Learn more';
    }
  }
  
  if (context === 'cta') {
    switch (targetPage) {
      case '/pricing':
        return 'Upgrade to Premium';
      case '/journal':
        return 'Write New Entry';
      case '/calendar':
        return 'View Calendar';
      default:
        return variations[0] || 'Learn more';
    }
  }
  
  // Return a random variation for natural link diversity
  return variations[Math.floor(Math.random() * variations.length)] || 'Learn more';
};

/**
 * URL structure best practices
 */
export const urlStructure = {
  // Clean, descriptive URLs
  routes: {
    '/': 'Dashboard',
    '/dashboard': 'Dashboard',
    '/journal': 'Write Journal Entry',
    '/calendar': 'Journal Calendar',
    '/pricing': 'Premium Pricing',
    '/settings': 'Account Settings',
    '/success': 'Payment Success'
  },
  
  // URL parameters for enhanced functionality
  withParams: {
    '/calendar?date=YYYY-MM-DD': 'Calendar with specific date',
    '/journal?prompt=daily': 'Journal with daily prompt',
    '/pricing?plan=premium': 'Pricing with highlighted plan'
  }
};

/**
 * Link juice distribution strategy
 */
export const linkStrategy = {
  // High-priority pages that should receive most internal links
  highPriority: ['/dashboard', '/journal', '/calendar'],
  
  // Medium-priority pages
  mediumPriority: ['/pricing', '/settings'],
  
  // Low-priority pages (utility pages)
  lowPriority: ['/success'],
  
  // Recommended internal links per page
  recommendations: {
    '/dashboard': ['/journal', '/calendar', '/pricing'],
    '/journal': ['/calendar', '/dashboard'],
    '/calendar': ['/journal', '/dashboard'],
    '/pricing': ['/dashboard', '/journal'],
    '/settings': ['/dashboard'],
    '/success': ['/dashboard', '/journal']
  }
};