import React from 'react';

const Badge = ({ 
  children, 
  variant = 'blue', 
  className = '',
  icon: Icon
}) => {
  const variants = {
    green: 'badge-green',
    yellow: 'badge-yellow',
    red: 'badge-red',
    blue: 'badge-blue',
    purple: 'badge-purple'
  };

  const variantClass = variants[variant] || variants.blue;

  return (
    <span className={`${variantClass} ${className}`}>
      {Icon && <Icon className="w-3.5 h-3.5" />}
      {children}
    </span>
  );
};

export default Badge;
