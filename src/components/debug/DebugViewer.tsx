import React, { useState, useEffect } from 'react';
import { getDebugLogs, clearDebugLogs } from '../../utils/debugLog';

const DebugViewer: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [showViewer, setShowViewer] = useState(false);

  useEffect(() => {
    // Set up keyboard shortcut to toggle viewer
    const handleKeyDown = (e: KeyboardEvent) => {
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

  if (!showViewer) return null;

  return (
    <div style={{
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
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
        <h2 style={{ color: '#00ff00' }}>Debug Logs (Press Ctrl+Alt+V to toggle)</h2>
        <div>
          <button 
            onClick={() => setLogs(getDebugLogs())} 
            style={{ backgroundColor: '#333', color: '#fff', border: 'none', marginRight: '10px' }}
          >
            Refresh
          </button>
          <button 
            onClick={() => { clearDebugLogs(); setLogs([]); }} 
            style={{ backgroundColor: '#333', color: '#fff', border: 'none', marginRight: '10px' }}
          >
            Clear Logs
          </button>
          <button 
            onClick={() => setShowViewer(false)} 
            style={{ backgroundColor: '#333', color: '#fff', border: 'none' }}
          >
            Close
          </button>
        </div>
      </div>
      
      <div>
        <h3>Google Auth & Document API Logs</h3>
        {logs.filter(log => 
          log.message.includes('Google Auth') || 
          log.message.includes('document')
        ).map((log, index) => (
          <div key={index} style={{ marginBottom: '5px', borderBottom: '1px solid #333', padding: '5px' }}>
            <div>{log.message}</div>
            {log.data && <pre>{log.data}</pre>}
          </div>
        ))}
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <h3>All Logs</h3>
        {logs.length === 0 ? (
          <div>No logs stored. Perform some actions to see logs.</div>
        ) : (
          logs.map((log, index) => (
            <div key={index} style={{ marginBottom: '5px', borderBottom: '1px solid #333', padding: '5px' }}>
              <div>{log.message}</div>
              {log.data && <pre>{log.data}</pre>}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DebugViewer; 