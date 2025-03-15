import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  id: string;
  className?: string;
  fullWidth?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  id,
  className = '',
  fullWidth = true,
  ...props
}) => {
  const inputBaseClasses =
    'bg-[#2A2044] border border-[#2A2044] text-white rounded-lg px-4 py-2 focus:outline-none focus:border-[#00A5E5] transition-all duration-200';
  const inputErrorClasses = error
    ? 'border-[#FF3062] focus:border-[#FF3062]'
    : '';
  const inputWidthClasses = fullWidth ? 'w-full' : '';
  const inputClasses = `${inputBaseClasses} ${inputErrorClasses} ${inputWidthClasses} ${className}`;

  const labelClasses = 'block text-[#9D98B3] mb-1 font-medium';
  const errorClasses = 'text-[#FF3062] text-sm mt-1';

  return (
    <div className={`mb-4 ${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label htmlFor={id} className={labelClasses}>
          {label}
        </label>
      )}
      <input id={id} className={inputClasses} {...props} />
      {error && <p className={errorClasses}>{error}</p>}
    </div>
  );
};
