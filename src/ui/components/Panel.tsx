import React from 'react';

interface PanelProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'solid' | 'translucent';
  glowColor?: 'pink' | 'blue' | 'green' | 'orange' | 'none';
  bordered?: boolean;
  withScanlines?: boolean;
  withGrid?: boolean;
}

const Panel: React.FC<PanelProps> = ({
  children,
  className = '',
  variant = 'solid',
  glowColor = 'none',
  bordered = false,
  withScanlines = false,
  withGrid = false,
}) => {
  // Base classes
  const baseClasses = 'rounded-lg shadow-lg';

  // Variant classes
  const variantClasses = {
    solid: 'bg-[#1A1133]',
    translucent: 'bg-[#1A1133]/75 backdrop-blur-sm',
  };

  // Glow classes
  const glowClasses = {
    pink: 'shadow-[0_0_8px_rgba(255,65,166,0.6)]',
    blue: 'shadow-[0_0_8px_rgba(0,165,229,0.6)]',
    green: 'shadow-[0_0_8px_rgba(0,229,116,0.6)]',
    orange: 'shadow-[0_0_8px_rgba(255,142,66,0.6)]',
    none: '',
  };

  // Border classes
  const borderColors = {
    pink: 'border border-[#FF41A6]',
    blue: 'border border-[#00A5E5]',
    green: 'border border-[#00E574]',
    orange: 'border border-[#FF8E42]',
    none: 'border border-[#2A2044]',
  };

  const borderClasses = bordered ? borderColors[glowColor] : '';

  // Scanlines class
  const scanlinesClass = withScanlines ? 'scanlines' : '';

  // Grid class
  const gridClass = withGrid ? 'grid-background' : '';

  const classes = `${baseClasses} ${variantClasses[variant]} ${glowClasses[glowColor]} ${borderClasses} ${scanlinesClass} ${gridClass} ${className}`;

  return <div className={classes}>{children}</div>;
};

export default Panel;
