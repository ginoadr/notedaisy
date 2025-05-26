import React, { useCallback } from 'react';
import { Editable, useSlateStatic } from 'slate-react'; // Use useSlateStatic if editor passed down
import Element from '../utils/Element';
import Leaf from '../utils/Leaf';
// import CustomEditor from '../utils/customEditor'; // For hotkeys if needed
// import isHotkey from 'is-hotkey';

// Removed useState, useMemo, createEditor, initialValue - handled in parent App component

const EditorComponent = () => {
  // If not using useSlateStatic, editor instance can be accessed via useSlate()
  // const editor = useSlate(); // Alternative way to get editor instance if needed directly

  // Define renderElement and renderLeaf callbacks
  const renderElement = useCallback(props => <Element {...props} />, []);
  const renderLeaf = useCallback(props => <Leaf {...props} />, []);

  // Hotkey handling (if desired)
  /*
  const handleKeyDown = event => {
     const editor = // get editor instance via useSlate() or useSlateStatic()
     // ... hotkey logic ...
  };
  */

  // No need for Slate provider here - it's in the parent
  return (
    // The Editable component renders the actual editor content
    // It will inherit the editor and value from the parent Slate context
    <Editable
      className="editable-area" // Add class for potential specific styling
      renderElement={renderElement}
      renderLeaf={renderLeaf}
      placeholder="Start typing your notes here..."
      spellCheck
      autoFocus
      // onKeyDown={handleKeyDown} // Add back if using hotkeys
    />
  );
};

export default EditorComponent;