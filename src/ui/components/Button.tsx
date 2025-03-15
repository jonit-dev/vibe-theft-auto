import React, { ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'tertiary';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  fullWidth?: boolean;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  fullWidth = false,
  className = '',
  ...props
}) => {
  // Base classes
  const baseClasses =
    'inline-flex items-center justify-center transition-all duration-200 focus:outline-none rounded-full';

  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-5 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  // Variant classes with simpler styling
  const variantClasses = {
    primary: 'bg-[#FF41A6] text-white hover:bg-pink-500',
    secondary:
      'bg-transparent border border-[#00A5E5] text-[#00A5E5] hover:bg-blue-900/20',
    tertiary: 'bg-transparent text-[#FF41A6] hover:underline',
  };

  // Width classes
  const widthClasses = fullWidth ? 'w-full' : '';

  // Disabled classes
  const disabledClasses = props.disabled ? 'opacity-50 cursor-not-allowed' : '';

  const classes = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${widthClasses} ${disabledClasses} ${className}`;

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};
