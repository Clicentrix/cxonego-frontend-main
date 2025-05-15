import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
const DebugConsole = ({ enabled = true }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [logs, setLogs] = useState([]);
    // Add a keyboard shortcut to toggle the console
    useEffect(() => {
        if (!enabled)
            return;
        const handleKeyDown = (e) => {
            if (e.ctrlKey && e.altKey && e.key === 'd') {
                setIsVisible(prev => !prev);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        // Add a message to the normal console
        console.log('Debug console initialized! Press Ctrl+Alt+D to toggle');
        // Log global errors
        const handleError = (event) => {
            addLog(`ERROR: ${event.message}`, 'error');
        };
        window.addEventListener('error', handleError);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('error', handleError);
        };
    }, [enabled]);
    // A simple function to add logs to our console
    const addLog = (message, type = 'info') => {
        setLogs(prev => [
            ...prev,
            {
                message,
                type,
                timestamp: new Date().toLocaleTimeString()
            }
        ].slice(-100)); // Keep only the most recent 100 logs
    };
    // Hide if not visible or enabled
    if (!isVisible || !enabled)
        return null;
    return (_jsxs("div", { style: {
            position: 'fixed',
            bottom: 0,
            right: 0,
            width: '50%',
            height: '300px',
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            color: '#fff',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            fontFamily: 'monospace',
            fontSize: '12px',
            border: '1px solid #333',
        }, children: [_jsxs("div", { style: { padding: '8px', borderBottom: '1px solid #444', display: 'flex', justifyContent: 'space-between' }, children: [_jsx("span", { children: "Debug Console" }), _jsx("button", { onClick: () => setIsVisible(false), style: { background: 'none', border: 'none', color: 'white', cursor: 'pointer' }, children: "Close" })] }), _jsx("div", { style: { overflow: 'auto', padding: '8px', flex: 1 }, children: logs.length === 0 ? (_jsx("div", { style: { color: '#999', fontStyle: 'italic' }, children: "No logs yet. Actions will be recorded here." })) : (logs.map((log, index) => (_jsxs("div", { style: {
                        borderBottom: '1px solid #333',
                        padding: '4px',
                        color: log.type === 'error' ? '#ff6b6b' :
                            log.type === 'warn' ? '#ffdb4d' : '#a5d8ff'
                    }, children: [_jsx("span", { style: { color: '#999', marginRight: '8px' }, children: log.timestamp }), _jsx("span", { children: log.message })] }, index)))) }), _jsxs("div", { style: { padding: '8px', borderTop: '1px solid #444' }, children: [_jsx("button", { onClick: () => addLog('Manual test log'), style: { background: '#333', border: 'none', color: 'white', padding: '4px 8px', marginRight: '8px' }, children: "Test Log" }), _jsx("button", { onClick: () => setLogs([]), style: { background: '#333', border: 'none', color: 'white', padding: '4px 8px' }, children: "Clear" })] })] }));
};
export default DebugConsole;
