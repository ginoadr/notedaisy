import React from 'react';

// Simple helper to render Font Awesome icons
const Icon = ({ icon }) => {
  return <i className={`fas fa-${icon}`}></i>;
};

export default Icon;