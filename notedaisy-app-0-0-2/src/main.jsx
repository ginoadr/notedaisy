import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import EditorComponent from './components/EditorComponent.jsx';
import Toolbar from './components/Toolbar.jsx';
import { createEditor } from 'slate';
import { Slate, withReact } from 'slate-react';
import { withHistory } from 'slate-history';
import { useState, useMemo } from 'react';

// Initial content - adjusted slightly for new block types
const initialValue = [
   {
    type: 'title', // Use 'title' type
    children: [{ text: 'My Document Title' }],
   },
   {
    type: 'paragraph',
    children: [
        { text: 'Welcome! Edit this text or use the toolbar above. Try inserting a ' },
        { text: 'page break using the button!', bold: true },
        { text: ' The text editing now happens directly inside the page layout.' }
    ],
  },
   {
    type: 'heading-two',
    children: [{ text: 'Another Section' }],
  },
  {
    type: 'paragraph',
    children: [
      { text: 'Apply formatting like ' },
      { text: 'different', fontColor: 'blue' },
      { text: ' ' },
      { text: 'font sizes', fontColor: 'blue', fontSize: '18px' },
      { text: ' and ' },
      { text: 'highlights', highlightColor: '#a0eade' },
      { text: '.' },
    ],
  },
   {
    type: 'heading-four', // Use heading-four type
    children: [ { text: 'A Sub-sub-section' } ],
   },
   {
    type: 'paragraph',
    children: [ { text: 'Keep typing to see how the content stays within the page container. Inserting a page break adds a visual separator.' } ],
  },
];


// Main App Structure Component
function App() {
  // Create editor instance, apply history, react bindings, and void element logic
  const editor = useMemo(() => {
      const baseEditor = withHistory(withReact(createEditor()));

      // --- Tell Slate that 'page-break' is void (KEEPING THIS) ---
      const { isVoid } = baseEditor;
      baseEditor.isVoid = element => {
          return element.type === 'page-break' ? true : isVoid(element);
      };
      // --- End Void Element Handling ---

      return baseEditor;
  }, []);

  // Manage editor state (value)
  const [value, setValue] = useState(initialValue);

  return (
    // Slate provider wraps Toolbar and Editor
    <Slate editor={editor} initialValue={value} onChange={newValue => setValue(newValue)}>
        <Toolbar />
        <div className="page-container">
           <EditorComponent />
        </div>
    </Slate>
  );
}


// Render the main App component
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);