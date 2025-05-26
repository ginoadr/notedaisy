import React from 'react';

const Leaf = ({ attributes, children, leaf }) => {
  let styledChildren = children; // Start with original children

  if (leaf.bold) {
    styledChildren = <strong>{styledChildren}</strong>;
  }
  if (leaf.italic) {
    styledChildren = <em>{styledChildren}</em>;
  }
  if (leaf.underline) {
    styledChildren = <u>{styledChildren}</u>;
  }

  // --- Apply Colors and Highlights ---
  const styles = {};
  if (leaf.fontColor) {
    styles.color = leaf.fontColor;
  }

  // Handle both simple highlight (yellow) and specific highlight colors
  if (leaf.highlight) { // Simple yellow toggle
    styles.backgroundColor = 'yellow';
  } else if (leaf.highlightColor) { // Custom color picker
    styles.backgroundColor = leaf.highlightColor;
  }


  if (leaf.fontSize) {
    styles.fontSize = leaf.fontSize;
  }

  // Apply styles only if needed
  if (Object.keys(styles).length > 0) {
      styledChildren = <span style={styles}>{styledChildren}</span>
  }


  // Render the final children with attributes (important for Slate)
  // Apply attributes to the outermost element being returned for this leaf
  return <span {...attributes}>{styledChildren}</span>;
};

export default Leaf;