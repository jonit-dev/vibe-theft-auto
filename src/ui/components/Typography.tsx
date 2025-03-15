import React, { ElementType } from 'react';

// Heading component
interface HeadingProps {
  level?: 1 | 2 | 3;
  children: React.ReactNode;
  className?: string;
  color?: string;
}

export const Heading: React.FC<HeadingProps> = ({
  level = 1,
  children,
  className = '',
  color = 'text-white',
}) => {
  const sizeClasses = {
    1: 'text-4xl',
    2: 'text-2xl',
    3: 'text-xl',
  };

  const HeadingTag = `h${level}` as ElementType;

  const classes = `font-bold ${sizeClasses[level]} ${color} ${className}`;

  return <HeadingTag className={classes}>{children}</HeadingTag>;
};

// Text component for paragraphs
interface TextProps {
  children: React.ReactNode;
  size?: 'sm' | 'base' | 'lg';
  color?: string;
  className?: string;
  mono?: boolean;
}

export const Text: React.FC<TextProps> = ({
  children,
  size = 'base',
  color = 'text-white',
  className = '',
  mono = false,
}) => {
  const sizeClasses = {
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
  };

  const fontClasses = mono ? 'font-mono' : 'font-sans';

  const classes = `${sizeClasses[size]} ${color} ${fontClasses} ${className}`;

  return <p className={classes}>{children}</p>;
};
