import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  type = 'button', 
  disabled = false, 
  onClick,
  ...props 
}) => {
  const baseStyles = 'btn'; // assuming a base 'btn' class or using existing ones
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    danger: 'btn-danger',
    outline: 'border border-white/10 hover:bg-white/5 text-gray-300 rounded-xl px-6 py-3 transition-all duration-200'
  };

  const variantClass = variants[variant] || variants.primary;

  return (
    <button
      type={type}
      className={`${variantClass} ${className}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
