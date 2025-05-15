import React from 'react';

interface DebugOverlayProps {
  data: any;
  title?: string;
  expanded?: boolean;
}

/**
 * A simple component to display debug information in the UI
 * Useful for debugging data issues without having to open the console
 */
const DebugOverlay: React.FC<DebugOverlayProps> = ({ 
  data, 
  title = 'Debug Info', 
  expanded = false 
}) => {
  const [isExpanded, setIsExpanded] = React.useState(expanded);

  // Don't render anything in production
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div 
      style={{
        position: 'relative',
        margin: '10px 0',
        padding: '10px',
        border: '1px dashed #ff6b6b',
        borderRadius: '4px',
        backgroundColor: 'rgba(255, 107, 107, 0.1)',
        fontFamily: 'monospace',
        fontSize: '12px',
      }}
    >
      <div 
        style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '8px',
          cursor: 'pointer'
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <strong style={{ color: '#ff6b6b' }}>{title}</strong>
        <span>{isExpanded ? '▼' : '▶'}</span>
      </div>
      
      {isExpanded && (
        <pre
          style={{
            margin: 0,
            padding: '8px',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: '#a5d8ff',
            borderRadius: '4px',
            overflow: 'auto',
            maxHeight: '300px'
          }}
        >
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default DebugOverlay; 