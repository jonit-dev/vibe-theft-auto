import React, { FormHTMLAttributes } from 'react';

interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode;
  className?: string;
}

export const Form: React.FC<FormProps> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <form className={`space-y-4 ${className}`} {...props}>
      {children}
    </form>
  );
};

interface FormRowProps {
  children: React.ReactNode;
  className?: string;
}

export const FormRow: React.FC<FormRowProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`flex flex-col space-y-1 ${className}`}>{children}</div>
  );
};

interface FormLabelProps {
  htmlFor: string;
  children: React.ReactNode;
  required?: boolean;
  className?: string;
}

export const FormLabel: React.FC<FormLabelProps> = ({
  htmlFor,
  children,
  required = false,
  className = '',
}) => {
  return (
    <label
      htmlFor={htmlFor}
      className={`text-sm font-medium text-[#9D98B3] ${className}`}
    >
      {children}
      {required && <span className='text-[#FF3062] ml-1'>*</span>}
    </label>
  );
};

interface FormErrorProps {
  children: React.ReactNode;
  className?: string;
}

export const FormError: React.FC<FormErrorProps> = ({
  children,
  className = '',
}) => {
  if (!children) return null;

  return (
    <p className={`text-sm text-[#FF3062] mt-1 ${className}`}>{children}</p>
  );
};

interface FormDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export const FormDescription: React.FC<FormDescriptionProps> = ({
  children,
  className = '',
}) => {
  return (
    <p className={`text-xs text-[#9D98B3] mt-1 ${className}`}>{children}</p>
  );
};

interface FormActionProps {
  children: React.ReactNode;
  className?: string;
}

export const FormActions: React.FC<FormActionProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`flex justify-end space-x-3 mt-6 ${className}`}>
      {children}
    </div>
  );
};
