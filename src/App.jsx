import React, { useState } from 'react';
import PageSetup from './components/PageSetup.jsx';
import EditorComponent from './components/EditorComponent.jsx';
import './App.css';

function App() {
  const [appMode, setAppMode] = useState('initial');
  const [pageSettings, setPageSettings] = useState(null);
  const [editorHtml, setEditorHtml] = useState('');

  // ... handlers (handleCreateClick, handleSetupSubmit, handleEditorChange) ...
    const handleCreateClick = () => setAppMode('setup');
    const handleSetupSubmit = (settings) => {
        setPageSettings(settings);
        setAppMode('editing');
        setEditorHtml('');
    };
    const handleEditorChange = (html) => setEditorHtml(html);


  const renderContent = () => {
    switch (appMode) {
      case 'initial':
        return (
          <div className="initial-screen">
            <h1>Welcome!</h1>
            <button onClick={handleCreateClick}>Create Notes</button>
          </div>
        );
      case 'setup':
        return <PageSetup onSubmit={handleSetupSubmit} />;
      case 'editing':
        if (!pageSettings) return null;
        // Render EditorComponent directly when editing
        return (
          <EditorComponent
            pageSettings={pageSettings}
            value={editorHtml}
            onChange={handleEditorChange}
          />
        );
      default:
        return null;
    }
  };

  // app-container class is always present
  return (
    <div className="app-container">
      {renderContent()}
    </div>
  );
}

export default App;