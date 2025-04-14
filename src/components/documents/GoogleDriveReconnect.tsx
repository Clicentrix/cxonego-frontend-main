import React, { useState, useEffect } from 'react';
import { Button, Typography, Card, message } from 'antd';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getGoogleReconnectUrl } from '../../services/documentService';
import { debugLog } from '../../utils/debugLog';

const { Title, Text, Paragraph } = Typography;

interface GoogleDriveReconnectProps {
  contactId?: string;
}

const GoogleDriveReconnect: React.FC<GoogleDriveReconnectProps> = ({ contactId }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [debugMode, setDebugMode] = useState(false);

  // Toggle debug information display
  const toggleDebugMode = () => {
    setDebugMode(!debugMode);
  };

  const handleReconnect = async () => {
    setLoading(true);
    setErrorDetails(null);
    
    try {
      debugLog('[Google Reconnect] Initiating reconnect process', 
        { contactId: contactId || 'none' }, 'GoogleDriveReconnect');
      
      const response = await getGoogleReconnectUrl(contactId);
      setApiResponse(response); // Store for debugging
      
      if (typeof response === 'string' && (response.startsWith('http') || response.startsWith('/'))) {
        // Valid URL response
        debugLog('[Google Reconnect] Received valid redirect URL', 
          { url: response.substring(0, 50) + '...' }, 'GoogleDriveReconnect');
        
        // Redirect to the given URL
        window.location.href = response;
        return;
      } else if (response && typeof response === 'object') {
        // Handle object response
        if (response.url && (response.url.startsWith('http') || response.url.startsWith('/'))) {
          debugLog('[Google Reconnect] Extracted URL from response object', 
            { url: response.url.substring(0, 50) + '...' }, 'GoogleDriveReconnect');
          
          // Redirect to the extracted URL
          window.location.href = response.url;
          return;
        } else if (response.error) {
          // Handle error in response object
          const errorMsg = response.error || 'Failed to get reconnect URL';
          
          // Special handling for specific error types
          if (response.status === 404 || (response.error && response.error.includes('not found'))) {
            const configError = 'Google Drive reconnect endpoint not available. This is likely a backend configuration issue.';
            message.error(configError);
            setErrorDetails(`${configError} The backend endpoint for Google Drive authorization is missing.`);
          } else {
            message.error(errorMsg);
            setErrorDetails(errorMsg);
          }
          
          debugLog('[Google Reconnect] Error in response object', response, 'GoogleDriveReconnect');
        }
      }
      
      // If we reach here, the response format was unexpected
      message.warning('Received unexpected response format from server');
      setErrorDetails('The server returned an unexpected response format. Please contact support.');
      debugLog('[Google Reconnect] Unexpected response format', response, 'GoogleDriveReconnect');
      
    } catch (error) {
      console.error('Error getting Google reconnect URL:', error);
      
      // Determine if this is a configuration issue
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      setApiResponse({ error: errorMsg });
      
      if (errorMsg.includes('404') || errorMsg.includes('not found')) {
        const configError = 'Google Drive reconnect endpoint not found. This appears to be a backend configuration issue.';
        message.error(configError);
        setErrorDetails(`${configError} The API endpoint for Google Drive authorization could not be reached.`);
        
        // Log detailed information about the error
        debugLog('[Google Reconnect] Backend endpoint not found', 
          { error: errorMsg, apiUrl: process.env.REACT_APP_API_URL || 'not set' }, 
          'GoogleDriveReconnect');
      } else {
        message.error('Failed to get Google Drive reconnect URL');
        setErrorDetails(`Error: ${errorMsg}`);
        debugLog('[Google Reconnect] Error getting reconnect URL', error, 'GoogleDriveReconnect');
      }
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <Card bordered={false} style={{ marginBottom: '20px' }}>
        <Title level={3}>Google Drive Connection Required</Title>
        <Paragraph>
          To access your documents in Google Drive, you need to connect your account. 
          This allows secure access to your files without storing them on our servers.
        </Paragraph>
        
        {errorDetails && (
          <div style={{ marginBottom: '20px', padding: '12px', backgroundColor: '#fff2f0', borderRadius: '4px', border: '1px solid #ffccc7' }}>
            <Text type="danger" strong>Connection Error</Text>
            <Paragraph type="danger" style={{ marginBottom: 0 }}>
              {errorDetails}
            </Paragraph>
            {errorDetails.includes('backend configuration') && (
              <Paragraph type="secondary" style={{ fontSize: '13px', marginTop: '8px' }}>
                This appears to be a server-side configuration issue. Please contact support or ensure the backend 
                API is running correctly at {process.env.REACT_APP_API_URL || 'http://localhost:8000'}.
              </Paragraph>
            )}
          </div>
        )}
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
          <Button onClick={goBack}>
            Go Back
          </Button>
          <Button 
            type="primary" 
            onClick={handleReconnect}
            loading={loading}
          >
            Connect to Google Drive
          </Button>
        </div>
        
        {/* Debug information section */}
        <div style={{ marginTop: '30px' }}>
          <Button 
            type="link" 
            size="small" 
            onClick={toggleDebugMode}
            style={{ padding: 0 }}
          >
            {debugMode ? 'Hide Debug Info' : 'Show Debug Info'}
          </Button>
          
          {debugMode && apiResponse && (
            <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '4px', overflow: 'auto' }}>
              <Text strong>Debug Information</Text>
              <pre style={{ fontSize: '12px' }}>
                API Response: {JSON.stringify(apiResponse, null, 2)}
                <br />
                API URL: {process.env.REACT_APP_API_URL || 'not set'}
                <br />
                Contact ID: {contactId || 'none'}
                <br />
                User ID: {localStorage.getItem('userId') || 'not found in localStorage'}
              </pre>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default GoogleDriveReconnect; 