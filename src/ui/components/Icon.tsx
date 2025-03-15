import React, { SVGProps } from 'react';

// Define the types of icons we might have
type IconName =
  | 'settings'
  | 'user'
  | 'logout'
  | 'menu'
  | 'close'
  | 'chevron-right'
  | 'chevron-down'
  | 'alert'
  | 'success'
  | 'info'
  | 'warn';

interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'name'> {
  name: IconName;
  size?: 'sm' | 'md' | 'lg';
  color?:
    | 'default'
    | 'tech-blue'
    | 'neon-purple'
    | 'cyber-green'
    | 'alert-red'
    | 'success-green';
  className?: string;
  pulse?: boolean;
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = 'md',
  color = 'default',
  className = '',
  pulse = false,
  ...props
}) => {
  // Size mappings
  const sizeMap = {
    sm: 16,
    md: 24,
    lg: 32,
  };

  // Color mappings
  const colorMap = {
    default: 'text-text-white',
    'tech-blue': 'text-tech-blue',
    'neon-purple': 'text-neon-purple',
    'cyber-green': 'text-cyber-green',
    'alert-red': 'text-alert-red',
    'success-green': 'text-success-green',
  };

  // Animation class
  const pulseClass = pulse ? 'pulse-glow' : '';

  // Combined classes
  const combinedClasses = `${colorMap[color]} ${pulseClass} ${className}`;

  const renderIcon = () => {
    const pixelSize = sizeMap[size];

    switch (name) {
      case 'settings':
        return (
          <svg
            width={pixelSize}
            height={pixelSize}
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            className={combinedClasses}
            {...props}
          >
            <circle cx='12' cy='12' r='3' />
            <path d='M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z' />
          </svg>
        );
      case 'user':
        return (
          <svg
            width={pixelSize}
            height={pixelSize}
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            className={combinedClasses}
            {...props}
          >
            <path d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2' />
            <circle cx='12' cy='7' r='4' />
          </svg>
        );
      case 'logout':
        return (
          <svg
            width={pixelSize}
            height={pixelSize}
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            className={combinedClasses}
            {...props}
          >
            <path d='M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4' />
            <polyline points='16 17 21 12 16 7' />
            <line x1='21' y1='12' x2='9' y2='12' />
          </svg>
        );
      case 'menu':
        return (
          <svg
            width={pixelSize}
            height={pixelSize}
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            className={combinedClasses}
            {...props}
          >
            <line x1='3' y1='12' x2='21' y2='12' />
            <line x1='3' y1='6' x2='21' y2='6' />
            <line x1='3' y1='18' x2='21' y2='18' />
          </svg>
        );
      case 'close':
        return (
          <svg
            width={pixelSize}
            height={pixelSize}
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            className={combinedClasses}
            {...props}
          >
            <line x1='18' y1='6' x2='6' y2='18' />
            <line x1='6' y1='6' x2='18' y2='18' />
          </svg>
        );
      case 'chevron-right':
        return (
          <svg
            width={pixelSize}
            height={pixelSize}
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            className={combinedClasses}
            {...props}
          >
            <polyline points='9 18 15 12 9 6' />
          </svg>
        );
      case 'chevron-down':
        return (
          <svg
            width={pixelSize}
            height={pixelSize}
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            className={combinedClasses}
            {...props}
          >
            <polyline points='6 9 12 15 18 9' />
          </svg>
        );
      case 'alert':
        return (
          <svg
            width={pixelSize}
            height={pixelSize}
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            className={combinedClasses}
            {...props}
          >
            <circle cx='12' cy='12' r='10' />
            <line x1='12' y1='8' x2='12' y2='12' />
            <line x1='12' y1='16' x2='12.01' y2='16' />
          </svg>
        );
      case 'success':
        return (
          <svg
            width={pixelSize}
            height={pixelSize}
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            className={combinedClasses}
            {...props}
          >
            <path d='M22 11.08V12a10 10 0 1 1-5.93-9.14' />
            <polyline points='22 4 12 14.01 9 11.01' />
          </svg>
        );
      case 'info':
        return (
          <svg
            width={pixelSize}
            height={pixelSize}
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            className={combinedClasses}
            {...props}
          >
            <circle cx='12' cy='12' r='10' />
            <line x1='12' y1='16' x2='12' y2='12' />
            <line x1='12' y1='8' x2='12.01' y2='8' />
          </svg>
        );
      case 'warn':
        return (
          <svg
            width={pixelSize}
            height={pixelSize}
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            className={combinedClasses}
            {...props}
          >
            <path d='M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z' />
            <line x1='12' y1='9' x2='12' y2='13' />
            <line x1='12' y1='17' x2='12.01' y2='17' />
          </svg>
        );
      default:
        return <></>;
    }
  };

  return renderIcon();
};
