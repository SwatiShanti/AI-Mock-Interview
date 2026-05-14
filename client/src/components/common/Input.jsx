import React from 'react';

const Input = ({ 
  label, 
  error, 
  id, 
  className = '', 
  ...props 
}) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-gray-300 mb-1.5 block">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`input-field ${error ? 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50' : ''}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
};

export default Input;
