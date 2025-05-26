import React from 'react';

// Helper component for rendering the page break element (KEEPING THIS)
const PageBreakElement = ({ attributes, children, element }) => {
    return (
        <div {...attributes} className="page-break-element" contentEditable={false}>
             <span style={{ display: 'none' }}>{children}</span>
             <hr />
             <span style={{ fontSize: '0.8em', color: '#aaa', display: 'block', textAlign: 'center', margin: '5px 0' }}>
                 Page Break
             </span>
             <hr />
        </div>
    );
};

// Main component for rendering different block types
const Element = ({ attributes, children, element }) => {
  // Apply alignment style if the element has an 'align' property
  const style = { textAlign: element.align };

  switch (element.type) {
    // NEW: Title Style
    case 'title':
      return <h1 style={{ ...style, fontSize: '2.5em', marginBottom: '0.75em', borderBottom: '1px solid #eee', paddingBottom: '0.3em' }} {...attributes}>{children}</h1>;
    case 'heading-one':
      return <h1 style={style} {...attributes}>{children}</h1>;
    case 'heading-two':
      return <h2 style={style} {...attributes}>{children}</h2>;
    case 'heading-three':
      return <h3 style={style} {...attributes}>{children}</h3>;
    // NEW: Heading 4
    case 'heading-four':
      // Apply basic h4 styling or customize further
      return <h4 style={{ ...style, fontSize: '1em', fontWeight: 'bold', marginTop: '1.33em', marginBottom: '1.33em' }} {...attributes}>{children}</h4>;
    case 'page-break': // KEEPING THIS
        return <PageBreakElement attributes={attributes} element={element}>{children}</PageBreakElement>;
    // Add list cases here if implemented
    default: // Default to paragraph
      return <p style={style} {...attributes}>{children}</p>;
  }
};

export default Element;