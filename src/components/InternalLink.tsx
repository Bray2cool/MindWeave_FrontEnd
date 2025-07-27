import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

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
  const { getThemeColors } = useTheme();
  const colors = getThemeColors();

  const getVariantClasses = () => {
    switch (variant) {
      case 'button':
        return `inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r ${colors.primary} hover:${colors.primaryHover} text-white font-medium rounded-lg transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 ${colors.ring} focus:ring-offset-2`;
      
      case 'subtle':
        return `${colors.text} hover:${colors.text.replace('600', '700')} dark:text-${colors.accent} dark:hover:text-${colors.accent.replace('500', '300')} transition-colors hover:underline`;
      
      case 'cta':
        return `inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r ${colors.primary} hover:${colors.primaryHover} text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-${colors.accent}/25 focus:outline-none focus:ring-2 ${colors.ring} focus:ring-offset-2`;
      
      default:
        return `${colors.text} hover:${colors.text.replace('600', '700')} dark:text-${colors.accent} dark:hover:text-${colors.accent.replace('500', '300')} transition-colors hover:underline focus:outline-none focus:ring-2 ${colors.ring} focus:ring-offset-1 rounded`;
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