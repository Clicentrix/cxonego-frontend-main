import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { getDebugLogs, clearDebugLogs } from '../../utils/debugLog';
const DebugViewer = () => {
    const [logs, setLogs] = useState([]);
    const [showViewer, setShowViewer] = useState(false);
    useEffect(() => {
        // Set up keyboard shortcut to toggle viewer
        const handleKeyDown = (e) => {
            if (e.ctrlKey && e.altKey && e.key === 'v') {
                setShowViewer(prev => !prev);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);
    useEffect(() => {
        if (showViewer) {
            // Refresh logs when viewer is opened
            setLogs(getDebugLogs());
            // Set up refresh interval
            const interval = setInterval(() => {
                setLogs(getDebugLogs());
            }, 2000);
            return () => clearInterval(interval);
        }
    }, [showViewer]);
    if (!showViewer)
        return null;
    return (_jsxs("div", { style: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            color: '#00ff00',
            fontFamily: 'monospace',
            fontSize: '12px',
            padding: '10px',
            zIndex: 9999,
            overflow: 'auto'
        }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }, children: [_jsx("h2", { style: { color: '#00ff00' }, children: "Debug Logs (Press Ctrl+Alt+V to toggle)" }), _jsxs("div", { children: [_jsx("button", { onClick: () => setLogs(getDebugLogs()), style: { backgroundColor: '#333', color: '#fff', border: 'none', marginRight: '10px' }, children: "Refresh" }), _jsx("button", { onClick: () => { clearDebugLogs(); setLogs([]); }, style: { backgroundColor: '#333', color: '#fff', border: 'none', marginRight: '10px' }, children: "Clear Logs" }), _jsx("button", { onClick: () => setShowViewer(false), style: { backgroundColor: '#333', color: '#fff', border: 'none' }, children: "Close" })] })] }), _jsxs("div", { children: [_jsx("h3", { children: "Google Auth & Document API Logs" }), logs.filter(log => log.message.includes('Google Auth') ||
                        log.message.includes('document')).map((log, index) => (_jsxs("div", { style: { marginBottom: '5px', borderBottom: '1px solid #333', padding: '5px' }, children: [_jsx("div", { children: log.message }), log.data && _jsx("pre", { children: log.data })] }, index)))] }), _jsxs("div", { style: { marginTop: '20px' }, children: [_jsx("h3", { children: "All Logs" }), logs.length === 0 ? (_jsx("div", { children: "No logs stored. Perform some actions to see logs." })) : (logs.map((log, index) => (_jsxs("div", { style: { marginBottom: '5px', borderBottom: '1px solid #333', padding: '5px' }, children: [_jsx("div", { children: log.message }), log.data && _jsx("pre", { children: log.data })] }, index))))] })] }));
};
export default DebugViewer;
