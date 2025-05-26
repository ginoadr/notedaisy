import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Make sure your CSS is imported
import EditorComponent from './components/EditorComponent.jsx'; // Ensure .jsx extension if you renamed it

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* Wrap the editor inside the page container */}
    <div className="page-container">
      <EditorComponent />
    </div>
  </React.StrictMode>
);