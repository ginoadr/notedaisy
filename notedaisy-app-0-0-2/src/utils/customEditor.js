import { Editor, Transforms, Text, Element, Range } from 'slate';

const LIST_TYPES = ['numbered-list', 'bulleted-list'];
const TEXT_ALIGN_TYPES = ['left', 'center', 'right', 'justify'];

const CustomEditor = {
  // --- Mark Checks ---
  isMarkActive(editor, format) {
    const marks = Editor.marks(editor);
    return marks ? marks[format] === true : false;
  },
  getMarkValue(editor, format) {
      const marks = Editor.marks(editor);
      return marks?.[format]; // Returns value (e.g., color code, font size) or undefined
  },

  // --- Block Checks ---
  isBlockActive(editor, format, blockType = 'type') {
    const { selection } = editor;
    if (!selection) return false;
    const [match] = Array.from(
      Editor.nodes(editor, {
        at: Editor.unhangRange(editor, selection),
        match: n => !Editor.isEditor(n) && Element.isElement(n) && n[blockType] === format,
        mode: 'all',
      })
    );
    return !!match;
  },
  getActiveBlockType(editor) {
      const { selection } = editor;
      if (!selection) return 'paragraph';
      const [match] = Editor.nodes(editor, {
          at: Editor.unhangRange(editor, selection),
          match: n => !Editor.isEditor(n) && Element.isElement(n) && n.type !== 'list-item', // Exclude list-items for dropdown display
          mode: 'lowest',
      });
      // Return matched type or 'paragraph' if no specific block found (e.g., empty editor)
      return match ? match[0].type : 'paragraph';
  },

  // --- Mark Toggles ---
  toggleMark(editor, format) {
    const isActive = CustomEditor.isMarkActive(editor, format);
    if (isActive) {
        Editor.removeMark(editor, format);
    } else {
        if (format === 'highlight') {
            Editor.removeMark(editor, 'highlightColor');
        }
        Editor.addMark(editor, format, true);
    }
  },

  // --- Block Toggles ---
  toggleBlock(editor, format) {
    console.log(`toggleBlock called with format: ${format}`); // DEBUG
    const isActive = CustomEditor.isBlockActive(
       editor,
       format,
       TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type'
    );
    const isList = LIST_TYPES.includes(format); // Still check for potential future list toggling

    // Handle unwrapping from lists (remains the same)
    Transforms.unwrapNodes(editor, {
        match: n => !Editor.isEditor(n) && Element.isElement(n) && LIST_TYPES.includes(n.type) && !TEXT_ALIGN_TYPES.includes(format),
        split: true,
    });

    let newProperties;
    // Determine target type - handles 'title', 'heading-four', etc. via 'format'
    const targetType = isActive ? 'paragraph' : isList ? 'list-item' : format;

     if (TEXT_ALIGN_TYPES.includes(format)) {
         // Alignment logic (remains the same)
         newProperties = { align: isActive ? undefined : format };
         Transforms.setNodes(editor, newProperties, { match: n => Element.isElement(n) && Editor.isBlock(editor, n) });
     } else {
         // Block type change logic
         console.log(`Setting block type to: ${targetType}`); // DEBUG
         newProperties = {
             type: targetType,
             align: undefined, // Reset alignment
         };
         Transforms.setNodes(editor, newProperties); // Apply to selected blocks

          // List wrapping logic (remains the same, for future use)
          if (!isActive && isList) {
               const listBlock = { type: format, children: [] };
               Transforms.wrapNodes(editor, listBlock, { match: n => !Editor.isEditor(n) && Element.isElement(n) && n.type === 'list-item' });
          }
     }
     // Force update check (sometimes helps React hooks recognize deep state changes)
     editor.onChange();
 },

  // --- Font Size ---
  changeFontSize(editor, fontSize) {
    if (fontSize) {
        Editor.addMark(editor, 'fontSize', fontSize);
    } else {
        Editor.removeMark(editor, 'fontSize');
    }
  },

  // --- Font Color ---
  changeFontColor(editor, color) {
    if (color) {
      Editor.addMark(editor, 'fontColor', color);
    } else {
      Editor.removeMark(editor, 'fontColor');
    }
  },

  // --- Highlight Color ---
  changeHighlightColor(editor, color) {
    if (color) {
      Editor.removeMark(editor, 'highlight');
      Editor.addMark(editor, 'highlightColor', color);
    } else {
      Editor.removeMark(editor, 'highlightColor');
      Editor.removeMark(editor, 'highlight');
    }
  },

  // --- Insert Page Break (KEEPING THIS) ---
  insertPageBreak(editor) {
      const pageBreakNode = {
          type: 'page-break',
          children: [{ text: '' }], // Void elements need a text child
      };
      Transforms.insertNodes(editor, pageBreakNode);
      Transforms.move(editor); // Move cursor after the break
  }
};

export default CustomEditor;