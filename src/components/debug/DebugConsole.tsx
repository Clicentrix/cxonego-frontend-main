import React, { useState, useEffect } from 'react';

interface DebugConsoleProps {
  enabled?: boolean;
}

const DebugConsole: React.FC<DebugConsoleProps> = ({ enabled = true }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [logs, setLogs] = useState<{ message: string; type: string; timestamp: string }[]>([]);
  
  // Add a keyboard shortcut to toggle the console
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.altKey && e.key === 'd') {
        setIsVisible(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    // Add a message to the normal console
    console.log('Debug console initialized! Press Ctrl+Alt+D to toggle');
    
    // Log global errors
    const handleError = (event: ErrorEvent) => {
      addLog(`ERROR: ${event.message}`, 'error');
    };
    
    window.addEventListener('error', handleError);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('error', handleError);
    };
  }, [enabled]);

  // A simple function to add logs to our console
  const addLog = (message: string, type: string = 'info') => {
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
  if (!isVisible || !enabled) return null;
  
  return (
    <div 
      style={{
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
      }}
    >
      <div style={{ padding: '8px', borderBottom: '1px solid #444', display: 'flex', justifyContent: 'space-between' }}>
        <span>Debug Console</span>
        <button onClick={() => setIsVisible(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
          Close
        </button>
      </div>
      
      <div style={{ overflow: 'auto', padding: '8px', flex: 1 }}>
        {logs.length === 0 ? (
          <div style={{ color: '#999', fontStyle: 'italic' }}>No logs yet. Actions will be recorded here.</div>
        ) : (
          logs.map((log, index) => (
            <div 
              key={index} 
              style={{
                borderBottom: '1px solid #333',
                padding: '4px',
                color: log.type === 'error' ? '#ff6b6b' : 
                       log.type === 'warn' ? '#ffdb4d' : '#a5d8ff'
              }}
            >
              <span style={{ color: '#999', marginRight: '8px' }}>{log.timestamp}</span>
              <span>{log.message}</span>
            </div>
          ))
        )}
      </div>
      
      <div style={{ padding: '8px', borderTop: '1px solid #444' }}>
        <button 
          onClick={() => addLog('Manual test log')} 
          style={{ background: '#333', border: 'none', color: 'white', padding: '4px 8px', marginRight: '8px' }}
        >
          Test Log
        </button>
        <button 
          onClick={() => setLogs([])} 
          style={{ background: '#333', border: 'none', color: 'white', padding: '4px 8px' }}
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default DebugConsole; 