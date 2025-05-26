import React, { useRef, useMemo } from 'react';
import ReactQuill, { Quill } from 'react-quill';

// ---> MAKE SURE THIS IMPORT IS PRESENT <---
import 'react-quill/dist/quill.snow.css';

// --- Custom Line Height Setup (same) ---
const Parchment = Quill.import('parchment');
const LineHeightClass = new Parchment.Attributor.Class('lineheight', 'ql-line-height', {
  scope: Parchment.Scope.BLOCK,
  whitelist: ['1', '1.5', '2', '2.5']
});
if (!Quill.imports['parchment'].query(LineHeightClass.attrName)) {
    Quill.register(LineHeightClass, true);
}

// --- Toolbar/Formats Config (Use standard array) ---
const TOOLBAR_OPTIONS = [
    [{ 'font': [] }, { 'size': [] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'header': [1, 2, 3, false] }],
    [{ 'lineheight': ['1', '1.5', '2', '2.5'] }],
    [{ 'align': [] }],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'indent': '-1'}, { 'indent': '+1' }],
    ['link', 'blockquote', 'code-block'],
    ['clean']
];

const QUILL_FORMATS = [
    'header', 'font', 'size', 'bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block', 'list', 'bullet', 'indent', 'link', 'image', 'video', 'color', 'background', 'align', 'lineheight'
];


function EditorComponent({ pageSettings, value, onChange }) {
  const quillRef = useRef(null);

  // Calculate styles for the page wrapper (Width/Height for Page mode)
  const pageWrapperStyles = useMemo(() => {
    if (pageSettings.mode === 'Page') {
      return {
        width: pageSettings.paperSizeInfo?.width || '210mm', // Default to A4 if not set
        height: pageSettings.paperSizeInfo?.height || '297mm',
        // Padding applied via CSS variable inside .ql-editor
      };
    }
    return {}; // No inline style needed for pageless wrapper size
  }, [pageSettings]);

  // Calculate the value for the --editor-padding CSS variable
  const editorStyleWithPaddingVar = useMemo(() => ({
    '--editor-padding': pageSettings.mode === 'Page'
        ? (pageSettings.margins || '1in') // Use the margin string '1in', '20mm' etc.
        : '40px' // Default padding for pageless
  }), [pageSettings]);

  return (
    // This wrapper helps with centering via CSS margin:auto
    <div
        className={`editor-component-wrapper ${pageSettings.mode === 'Page' ? 'page-wrapper' : 'editor-content-wrapper-pageless'}`}
        style={pageWrapperStyles} // Apply width/height here for Page mode
    >
         {/* ReactQuill renders toolbar and editor area together */}
         <ReactQuill
            ref={quillRef}
            theme="snow"
            value={value}
            onChange={onChange}
            placeholder="Start writing notes...."
            modules={{
                toolbar: TOOLBAR_OPTIONS, // Use the standard toolbar config array
            }}
            formats={QUILL_FORMATS}
            style={editorStyleWithPaddingVar} // Apply CSS variable to editor root
         />
    </div>
  );
}

export default EditorComponent;