import React from 'react';
import { useLocation } from 'react-router-dom';

interface SEOHeadProps {
  title?: string;
  description?: string;
  canonical?: string;
}

const SEOHead: React.FC<SEOHeadProps> = ({ title, description, canonical }) => {
  const location = useLocation();
  
  const getPageInfo = () => {
    const path = location.pathname;
    
    switch (path) {
      case '/':
      case '/dashboard':
        return {
          title: 'Dashboard - MindWeave Journal',
          description: 'Your personal journaling dashboard with insights, statistics, and recent entries. Track your mental wellness journey.',
          canonical: '/dashboard'
        };
      
      case '/journal':
        return {
          title: 'Write Journal Entry - MindWeave',
          description: 'Create a new journal entry with mood tracking. Express your thoughts in a secure, private space.',
          canonical: '/journal'
        };
      
      case '/calendar':
        return {
          title: 'Journal Calendar - MindWeave',
          description: 'View your journal entries in calendar format. Track your journaling consistency and mood patterns over time.',
          canonical: '/calendar'
        };
      
      case '/reflections':
        return {
          title: 'AI Reflections - MindWeave',
          description: 'Explore AI-generated insights and analytics from your journaling journey. View mood trends and reflection patterns.',
          canonical: '/reflections'
        };
      
      case '/pricing':
        return {
          title: 'Pricing Plans - MindWeave Premium',
          description: 'Upgrade to MindWeave Premium for unlimited cloud sync, advanced features, and priority support. Choose monthly or lifetime plans.',
          canonical: '/pricing'
        };
      
      case '/settings':
        return {
          title: 'Settings - MindWeave',
          description: 'Customize your MindWeave experience. Manage notifications, privacy settings, themes, and data preferences.',
          canonical: '/settings'
        };
      
      case '/success':
        return {
          title: 'Payment Success - MindWeave',
          description: 'Thank you for upgrading to MindWeave Premium. Your subscription is now active with all premium features unlocked.',
          canonical: '/success'
        };
      
      default:
        return {
          title: 'MindWeave - Personal Journal & Mental Wellness',
          description: 'A beautiful, secure journaling app with mood tracking, insights, and cloud sync. Start your mental wellness journey today.',
          canonical: '/'
        };
    }
  };

  const pageInfo = getPageInfo();
  const finalTitle = title || pageInfo.title;
  const finalDescription = description || pageInfo.description;
  const finalCanonical = canonical || pageInfo.canonical;

  React.useEffect(() => {
    // Update document title
    document.title = finalTitle;
    
    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', finalDescription);
    
    // Update canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', `${window.location.origin}${finalCanonical}`);
    
    // Add structured data for journaling app
    let structuredData = document.querySelector('#structured-data');
    if (!structuredData) {
      structuredData = document.createElement('script');
      structuredData.setAttribute('type', 'application/ld+json');
      structuredData.setAttribute('id', 'structured-data');
      document.head.appendChild(structuredData);
    }
    
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "MindWeave",
      "description": "Personal journaling and mental wellness application",
      "url": window.location.origin,
      "applicationCategory": "HealthApplication",
      "operatingSystem": "Web Browser",
      "offers": {
        "@type": "Offer",
        "price": "6.99",
        "priceCurrency": "USD",
        "priceValidUntil": "2025-12-31"
      }
    };
    
    structuredData.textContent = JSON.stringify(jsonLd);
  }, [finalTitle, finalDescription, finalCanonical]);

  return null;
};

export default SEOHead;