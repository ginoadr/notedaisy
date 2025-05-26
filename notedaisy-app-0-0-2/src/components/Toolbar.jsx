import React, { useState, useEffect } from 'react';
import { useSlate } from 'slate-react';
import CustomEditor from '../utils/customEditor.js';
import Icon from './Icon.jsx';
import { Editor } from 'slate';

// ToolbarButton component (no changes needed from previous working version)
const ToolbarButton = ({ format, icon, type = 'mark' }) => {
    const editor = useSlate();
    let isActive;
    if (type === 'mark') {
        if (format === 'highlight') { isActive = CustomEditor.isMarkActive(editor, 'highlight') || !!CustomEditor.getMarkValue(editor, 'highlightColor'); }
        else { isActive = CustomEditor.isMarkActive(editor, format); }
    } else { isActive = CustomEditor.isBlockActive(editor, format); }
    const handleMouseDown = (event) => {
        event.preventDefault();
         if (format === 'highlight' && type === 'mark') {
             const currentlyActive = CustomEditor.isMarkActive(editor, 'highlight') || !!CustomEditor.getMarkValue(editor, 'highlightColor');
             if (currentlyActive) { CustomEditor.changeHighlightColor(editor, null); Editor.removeMark(editor, 'highlight'); }
             else { CustomEditor.changeHighlightColor(editor, 'yellow'); }
         } else if (type === 'mark') { CustomEditor.toggleMark(editor, format); }
         else { CustomEditor.toggleBlock(editor, format); }
    };
    return (<button type="button" className={`toolbar-button ${isActive ? 'active' : ''}`} onMouseDown={handleMouseDown}><Icon icon={icon} /></button>);
};

// Reworked Dropdown for Block Types (with new options)
const BlockFormatDropdown = () => {
    const editor = useSlate();
    const currentBlockType = CustomEditor.getActiveBlockType(editor);
    // console.log("Current Block Type:", currentBlockType); // DEBUG

    const blockOptions = [
        // UPDATED Options
        { value: 'title', label: 'Title' },
        { value: 'heading-one', label: 'Heading 1' },
        { value: 'heading-two', label: 'Heading 2' },
        { value: 'heading-three', label: 'Heading 3' },
        { value: 'heading-four', label: 'Heading 4' },
        { value: 'paragraph', label: 'Paragraph' },
    ];

    const handleChange = (event) => {
        const newType = event.target.value;
        console.log("Block Dropdown onChange:", newType); // DEBUG
        CustomEditor.toggleBlock(editor, newType);
    };

    return (
        <select
            className="toolbar-select"
            value={currentBlockType} // Reflects the current state from useSlate
            onChange={handleChange}
            onMouseDown={event => event.preventDefault()} // Keep preventing focus loss
        >
            {/* Handle case where current type isn't in the list (e.g. list-item) */}
            {!blockOptions.some(opt => opt.value === currentBlockType) && (
                <option value={currentBlockType} disabled hidden>{currentBlockType}</option>
            )}
            {blockOptions.map(option => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    );
};


// Reworked Font Size Input with Datalist (new options)
const FontSizeInput = () => {
    const editor = useSlate();
    // State to manage the input field's value directly
    const [inputValue, setInputValue] = useState('');

    // Update input value when Slate selection/marks change
    useEffect(() => {
        const markValue = CustomEditor.getMarkValue(editor, 'fontSize');
        const numValue = markValue ? parseInt(markValue, 10) : '';
        setInputValue(numValue);
         // console.log("Effect - Mark:", markValue, "Input:", numValue); // DEBUG
    }, [editor.selection, editor.marks]); // Re-run when selection or marks change

    const fontSizes = [8, 9, 11, 12, 14, 16, 18, 21, 24, 28, 32, 36, 38, 42, 48, 52, 56, 64, 72, 80, 96, 102, 108];

    const handleInputChange = (event) => {
        setInputValue(event.target.value); // Update local state immediately
    };

    const applyFontSize = (value) => {
        const size = parseInt(value, 10);
        if (!isNaN(size) && size > 0) {
            const finalSize = `${size}px`;
            console.log("Applying Font Size:", finalSize); // DEBUG
            CustomEditor.changeFontSize(editor, finalSize);
        } else if (value === '') { // Handle clearing the input
            console.log("Removing Font Size"); // DEBUG
            CustomEditor.changeFontSize(editor, null);
        }
        // No need to manually update inputValue here, useEffect will handle it
    };

    const handleBlur = (event) => {
        applyFontSize(event.target.value); // Apply on blur
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') { // Apply on Enter
            event.preventDefault();
            applyFontSize(event.target.value);
            event.target.blur(); // Optional: remove focus after Enter
        }
    };

    return (
        <div className="font-size-input-wrapper">
            <input
                type="number"
                className="toolbar-input font-size-input"
                value={inputValue}
                onChange={handleInputChange}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                placeholder="Size"
                list="font-sizes-list"
                min="1"
                step="1"
                onMouseDown={e => e.preventDefault()}
            />
            <datalist id="font-sizes-list">
                {fontSizes.map(size => (
                    <option key={size} value={size}></option>
                ))}
            </datalist>
        </div>
    );
};


// ColorPicker component (no changes needed from previous working version)
const ColorPicker = ({ format, icon }) => {
    const editor = useSlate();
    const handleChange = (event) => {
        const color = event.target.value;
        if (format === 'fontColor') { CustomEditor.changeFontColor(editor, color); }
        else if (format === 'highlightColor') { CustomEditor.changeHighlightColor(editor, color || null); if (color) { Editor.removeMark(editor, 'highlight'); } }
    };
    const handleRemoveColor = (event) => {
        event.preventDefault();
         if (format === 'fontColor') { CustomEditor.changeFontColor(editor, null); }
         else if (format === 'highlightColor') { CustomEditor.changeHighlightColor(editor, null); Editor.removeMark(editor, 'highlight'); }
    };
    const currentColor = CustomEditor.getMarkValue(editor, format);
    return (
       <div className="color-picker-wrapper">
            <label htmlFor={`${format}-picker-${icon}`} className="toolbar-button" aria-label={format === 'fontColor' ? 'Font color picker' : 'Highlight color picker'}>
                 <Icon icon={icon} />
                <input id={`${format}-picker-${icon}`} type="color" defaultValue={currentColor || (format === 'fontColor' ? '#000000' : '#ffffff')} onInput={handleChange} onMouseDown={e => e.preventDefault()} style={{ width: '1px', height: '1px', position: 'absolute', opacity: 0, pointerEvents: 'none', }} />
            </label>
            <button type="button" title={`Remove ${format === 'fontColor' ? 'Font Color' : 'Highlight'}`} className="toolbar-button" onMouseDown={handleRemoveColor}><Icon icon="ban" /></button>
        </div>
    );
};


// Main Toolbar Component
const Toolbar = () => {
  const editor = useSlate(); // Get editor instance for page break handler

  // Handler for Page Break Button (KEEPING THIS)
  const handleInsertPageBreak = (event) => {
      event.preventDefault();
      CustomEditor.insertPageBreak(editor);
  };

  return (
    <div className="toolbar">
       <BlockFormatDropdown /> {/* Updated Block Dropdown */}
       <div className="toolbar-separator"></div>
       <FontSizeInput /> {/* Updated Font Size Input */}
       <div className="toolbar-separator"></div>

      {/* Mark Buttons */}
      <ToolbarButton format="bold" icon="bold" />
      <ToolbarButton format="italic" icon="italic" />
      <ToolbarButton format="underline" icon="underline" />
      <div className="toolbar-separator"></div>

      {/* Font Color Picker */}
      <ColorPicker format="fontColor" icon="palette" />
      <div className="toolbar-separator"></div>

      {/* Highlight Color Picker */}
      <ColorPicker format="highlightColor" icon="fill-drip" />
      <div className="toolbar-separator"></div>

      {/* Page Break Button (KEEPING THIS) */}
      <button
          type="button"
          title="Insert Page Break"
          className="toolbar-button"
          onMouseDown={handleInsertPageBreak}
      >
          <Icon icon="file-lines" /> {/* Or other suitable icon */}
      </button>

    </div>
  );
};

export default Toolbar;