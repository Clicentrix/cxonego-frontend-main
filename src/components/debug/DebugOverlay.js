import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
/**
 * A simple component to display debug information in the UI
 * Useful for debugging data issues without having to open the console
 */
const DebugOverlay = ({ data, title = 'Debug Info', expanded = false }) => {
    const [isExpanded, setIsExpanded] = React.useState(expanded);
    // Don't render anything in production
    if (process.env.NODE_ENV === 'production') {
        return null;
    }
    return (_jsxs("div", { style: {
            position: 'relative',
            margin: '10px 0',
            padding: '10px',
            border: '1px dashed #ff6b6b',
            borderRadius: '4px',
            backgroundColor: 'rgba(255, 107, 107, 0.1)',
            fontFamily: 'monospace',
            fontSize: '12px',
        }, children: [_jsxs("div", { style: {
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '8px',
                    cursor: 'pointer'
                }, onClick: () => setIsExpanded(!isExpanded), children: [_jsx("strong", { style: { color: '#ff6b6b' }, children: title }), _jsx("span", { children: isExpanded ? '▼' : '▶' })] }), isExpanded && (_jsx("pre", { style: {
                    margin: 0,
                    padding: '8px',
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    color: '#a5d8ff',
                    borderRadius: '4px',
                    overflow: 'auto',
                    maxHeight: '300px'
                }, children: JSON.stringify(data, null, 2) }))] }));
};
export default DebugOverlay;
