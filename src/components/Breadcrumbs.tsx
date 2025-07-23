import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface BreadcrumbItem {
  label: string;
  path: string;
  description?: string;
}

const Breadcrumbs: React.FC = () => {
  const { isDarkMode } = useTheme();
  const location = useLocation();

  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const path = location.pathname;
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Dashboard', path: '/dashboard', description: 'Your journaling overview' }
    ];

    switch (path) {
      case '/':
      case '/dashboard':
        return [{ label: 'Dashboard', path: '/dashboard', description: 'Your journaling overview' }];
      
      case '/journal':
        breadcrumbs.push({ 
          label: 'Write Entry', 
          path: '/journal', 
          description: 'Create a new journal entry' 
        });
        break;
      
      case '/calendar':
        breadcrumbs.push({ 
          label: 'Calendar', 
          path: '/calendar', 
          description: 'View your journaling timeline' 
        });
        break;
      
      case '/pricing':
        breadcrumbs.push({ 
          label: 'Pricing', 
          path: '/pricing', 
          description: 'Upgrade to premium features' 
        });
        break;
      
      case '/settings':
        breadcrumbs.push({ 
          label: 'Settings', 
          path: '/settings', 
          description: 'Customize your experience' 
        });
        break;
      
      case '/success':
        breadcrumbs.push(
          { label: 'Pricing', path: '/pricing', description: 'Upgrade to premium features' },
          { label: 'Success', path: '/success', description: 'Payment confirmation' }
        );
        break;
      
      default:
        return breadcrumbs;
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();
  
  if (breadcrumbs.length <= 1) {
    return null;
  }

  const textClass = isDarkMode ? 'text-white/70' : 'text-gray-600';
  const linkClass = isDarkMode ? 'text-white/90 hover:text-white' : 'text-gray-800 hover:text-gray-900';
  const currentClass = isDarkMode ? 'text-purple-300' : 'text-purple-600';

  return (
    <nav 
      className="flex items-center space-x-2 mb-6"
      aria-label="Breadcrumb navigation"
    >
      <Home className={`w-4 h-4 ${textClass}`} />
      {breadcrumbs.map((crumb, index) => (
        <React.Fragment key={crumb.path}>
          {index > 0 && (
            <ChevronRight className={`w-4 h-4 ${textClass}`} />
          )}
          {index === breadcrumbs.length - 1 ? (
            <span 
              className={`text-sm font-medium ${currentClass}`}
              aria-current="page"
              title={crumb.description}
            >
              {crumb.label}
            </span>
          ) : (
            <Link
              to={crumb.path}
              className={`text-sm font-medium ${linkClass} transition-colors hover:underline`}
              title={crumb.description}
              aria-label={`Navigate to ${crumb.label}: ${crumb.description}`}
            >
              {crumb.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumbs;