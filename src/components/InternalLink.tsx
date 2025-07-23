import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';

interface InternalLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'button' | 'subtle' | 'cta';
  showIcon?: boolean;
  title?: string;
  'aria-label'?: string;
  rel?: string;
}

const InternalLink: React.FC<InternalLinkProps> = ({
  to,
  children,
  className = '',
  variant = 'default',
  showIcon = false,
  title,
  'aria-label': ariaLabel,
  rel = 'noopener',
  ...props
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'button':
        return 'inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium rounded-lg transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2';
      
      case 'subtle':
        return 'text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 transition-colors hover:underline';
      
      case 'cta':
        return 'inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-purple-500/25 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2';
      
      default:
        return 'text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 transition-colors hover:underline focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-1 rounded';
    }
  };

  return (
    <Link
      to={to}
      className={`${getVariantClasses()} ${className}`}
      title={title}
      aria-label={ariaLabel}
      rel={rel}
      {...props}
    >
      {children}
      {showIcon && (
        <ExternalLink className="w-4 h-4 ml-1" aria-hidden="true" />
      )}
    </Link>
  );
};

export default InternalLink;