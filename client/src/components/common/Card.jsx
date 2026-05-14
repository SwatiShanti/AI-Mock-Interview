import React from 'react';

const Card = ({ 
  children, 
  hover = false, 
  className = '',
  ...props 
}) => {
  const baseClass = hover ? 'glass-card-hover' : 'glass-card';
  
  return (
    <div className={`${baseClass} ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Card;
