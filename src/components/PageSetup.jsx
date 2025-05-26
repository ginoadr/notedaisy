import React, { useState } from 'react';

// Constants for Page Size (Can keep these if needed for reference, but not used directly for styling anymore)
const PAGE_SIZES = {
    A4: { width: '210mm', height: '297mm' },
    Letter: { width: '8.5in', height: '11in' },
    Legal: { width: '8.5in', height: '14in' },
};

function PageSetup({ onSubmit }) {
    const [mode, setMode] = useState('Page'); // 'Page' or 'Pageless'
    const [paperSize, setPaperSize] = useState('A4'); // Still used for display/reference

    // --- State for Custom Margins ---
    const [customMarginValue, setCustomMarginValue] = useState('1'); // Default margin value
    const [customMarginUnit, setCustomMarginUnit] = useState('in'); // Default unit

    const handleSubmit = (e) => {
        e.preventDefault();
        let finalMargins = null;
        if (mode === 'Page') {
            // Combine value and unit for the margin string
            finalMargins = `${customMarginValue}${customMarginUnit}`;
        }

        onSubmit({
            mode,
            // Pass size info if needed elsewhere, otherwise optional
            paperSizeInfo: mode === 'Page' ? PAGE_SIZES[paperSize] : null,
            margins: finalMargins, // Pass the combined string '1in', '20mm' etc. or null
        });
    };

    return (
        <div className="page-setup-screen">
            <h2>Document Setup</h2>
            <form onSubmit={handleSubmit} className="setup-options">
                {/* Mode Selection */}
                <div className="radio-group">
                    <label>Mode:</label>
                     {/* ... (radio buttons same as before) ... */}
                     <label>
                        <input
                            type="radio"
                            name="mode"
                            value="Page"
                            checked={mode === 'Page'}
                            onChange={(e) => setMode(e.target.value)}
                        />
                        Page
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="mode"
                            value="Pageless"
                            checked={mode === 'Pageless'}
                            onChange={(e) => setMode(e.target.value)}
                        />
                        Pageless
                    </label>
                </div>

                {/* Conditional Options for Page Mode */}
                {mode === 'Page' && (
                    <>
                        {/* Paper Size Selection (Kept for visual reference) */}
                        <div>
                            <label htmlFor="paper-size">Paper Size:</label>
                            <select
                                id="paper-size"
                                value={paperSize}
                                onChange={(e) => setPaperSize(e.target.value)}
                            >
                                {Object.keys(PAGE_SIZES).map((key) => (
                                    <option key={key} value={key}>
                                        {key} ({PAGE_SIZES[key].width} x {PAGE_SIZES[key].height})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* --- Custom Margins Input --- */}
                        <div>
                            <label htmlFor="custom-margin-value">Margins:</label>
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                <input
                                    type="number"
                                    id="custom-margin-value"
                                    value={customMarginValue}
                                    onChange={(e) => setCustomMarginValue(e.target.value)}
                                    min="0"
                                    step="0.1" // Allow decimals
                                    style={{ flexGrow: 1, padding: '8px' }} // Basic styling
                                    required // Ensure a value is entered
                                />
                                <select
                                    id="custom-margin-unit"
                                    value={customMarginUnit}
                                    onChange={(e) => setCustomMarginUnit(e.target.value)}
                                    style={{ padding: '8px' }}
                                >
                                    <option value="in">in</option>
                                    <option value="mm">mm</option>
                                    <option value="cm">cm</option>
                                </select>
                            </div>
                        </div>
                    </>
                )}

                <button type="submit" style={{ alignSelf: 'center', marginTop: '15px' }}>Start Editing</button>
            </form>
        </div>
    );
}

// Export constants if they are needed elsewhere, otherwise remove
// export { PAGE_SIZES };
export default PageSetup;