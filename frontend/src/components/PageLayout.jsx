import React from 'react';

/**
 * Standard Layout wrapper for all pages to ensure consistent spacing and structure.
 */
export default function PageLayout({ children, className = '', fluid = false }) {
  const containerClass = fluid ? 'page-container-fluid' : 'page-container';
  
  return (
    <div className={`${containerClass} animate-fade-in ${className}`}>
      {children}
    </div>
  );
}
