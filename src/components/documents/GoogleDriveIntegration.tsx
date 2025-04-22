import React, { useEffect, useState } from 'react';
import { Button, Card, Divider, message, Space, Tooltip, Typography, Alert, Popconfirm } from 'antd';
import { 
  GoogleOutlined, 
  CheckCircleFilled, 
  CloseCircleFilled, 
  SyncOutlined, 
  InfoCircleOutlined, 
  ReloadOutlined,
  BugOutlined,
  DisconnectOutlined
} from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../../redux/app/hooks';
import { checkGoogleConnection, disconnectGoogle, getGoogleAuth, getGoogleReconnect } from '../../redux/features/documentSlice';
import { RootState } from '../../redux/app/store';
import debugLog from '../../utils/debugLog';

const { Text, Title, Paragraph } = Typography;

interface GoogleDriveIntegrationProps {
  onConnected?: () => void;
  showTitle?: boolean;
  condensed?: boolean;
  returnTo?: string;
  showDebugInfo?: boolean;
}

const GoogleDriveIntegration: React.FC<GoogleDriveIntegrationProps> = ({ 
  onConnected, 
  showTitle = true,
  condensed = false,
  returnTo,
  showDebugInfo = false
}) => {
  const dispatch = useAppDispatch();
  const { isGoogleConnected, checkingGoogleConnection } = useAppSelector(
    (state: RootState) => state.documents
  );
  const [connecting, setConnecting] = useState(false);
  const [reconnecting, setReconnecting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [debugVisible, setDebugVisible] = useState(showDebugInfo);
  const [connectionResponse, setConnectionResponse] = useState<any>(null);
  const [initialCheckPerformed, setInitialCheckPerformed] = useState(false);
  const [checkingConnection, setCheckingConnection] = useState(false);
  const [connectionError, setConnectionError] = useState('');

  useEffect(() => {
    // Only check connection once when component mounts
    if (!initialCheckPerformed) {
      const storedConnectionStatus = localStorage.getItem('googleDriveConnected');
      
      if (storedConnectionStatus === 'true') {
        // If we already know we're connected from localStorage, don't make a redundant API call
        debugLog('[Google Auth] Using stored connection status (true)', null, 'GoogleDriveIntegration');
        // Just mark the check as done
        setInitialCheckPerformed(true);
      } else {
        // Only make the API call if needed
        debugLog('[Google Auth] No stored connection status, checking with API', null, 'GoogleDriveIntegration');
        checkConnection();
        // Mark the check as done AFTER the checkConnection call completes
        // This is handled within the function to avoid race conditions
      }
    }
  }, [initialCheckPerformed]);

  useEffect(() => {
    if (isGoogleConnected && onConnected) {
      onConnected();
    }
  }, [isGoogleConnected, onConnected]);

  const checkConnection = async () => {
    setCheckingConnection(true);
    setConnectionError('');
    
    try {
      // Log the API URL being used
      const apiBaseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;
      debugLog('[GoogleDriveIntegration] Checking connection', 
        { apiBaseUrl, userId: localStorage.getItem("userId") }, 
        'GoogleDriveIntegration');
      
      const userId = localStorage.getItem("userId");
      const accessToken = localStorage.getItem("accessToken");
      
      if (!userId || !accessToken) {
        debugLog('[Google Auth] Missing userId or accessToken when checking connection', 
          { hasUserId: !!userId, hasToken: !!accessToken }, 'GoogleDriveIntegration');
        message.warning('Authentication information is incomplete. Please log in again.');
        setConnectionResponse({ 
          error: 'Authentication information incomplete', 
          hasUserId: !!userId, 
          hasToken: !!accessToken 
        });
        setInitialCheckPerformed(true); // Mark as completed even if there's an error
        return;
      }
      
      debugLog('[Google Auth] Checking Google Drive connection', 
        { userId }, 'GoogleDriveIntegration');
      
      try {
        const response = await dispatch(checkGoogleConnection()).unwrap();
        
        setConnectionResponse(response);
        setInitialCheckPerformed(true); // Mark check as completed after response
        
        debugLog('[Google Auth] Connection check response:', response, 'GoogleDriveIntegration');
        
        if (!response.connected) {
          if (response.status === 404 || (response.message && response.message.includes('not found'))) {
            if (response.detailedMessage) {
              debugLog('[Google Auth] Backend configuration issue detected:', response.detailedMessage, 'GoogleDriveIntegration');
            }
            
            const envApiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
            const mismatchWarning = envApiUrl !== 'http://localhost:8000' ? 
              ` Your configured API URL (${envApiUrl}) might be different from the expected server.` : '';
            
            message.error(
              <span>
                Google Drive connection check endpoint not found. This is a backend configuration issue.
                <br />
                <small>The backend API endpoint for checking Google Drive connection is missing.{mismatchWarning}</small>
              </span>, 
              6
            );
            
            setAuthError('Backend API endpoint for Google Drive connection check not found.');
          } else if (response.message) {
            message.info(`Google Drive status: ${response.message}`);
            
            if (response.status === 401) {
              setAuthError('Authentication failed. Please try logging out and back in.');
            } else {
              setAuthError(response.message);
            }
          }
        }
      } catch (apiError) {
        const errorObj = apiError instanceof Error 
          ? { error: apiError.message } 
          : { error: 'Unknown error' };
        
        setConnectionResponse(errorObj);
        setInitialCheckPerformed(true); // Mark check as completed even on error
        
        if (apiError instanceof Error && (apiError.message.includes('404') || apiError.message.includes('not found'))) {
          const errorMsg = 'Google Drive connection check endpoint not found. This might be a configuration issue.';
          debugLog('[Google Auth] API endpoint not found (404)', apiError, 'GoogleDriveIntegration');
          setAuthError(errorMsg);
          message.error(errorMsg);
        } else {
          message.error('Failed to check Google Drive connection status');
        }
        
        debugLog('[Google Auth] Error checking connection', apiError, 'GoogleDriveIntegration');
      }
    } catch (error) {
      console.error('Error checking Google Drive connection:', error);
      setConnectionResponse(error instanceof Error ? { error: error.message } : { error: 'Unknown error' });
      message.error('Failed to check Google Drive connection status');
    }
  };

  const handleConnect = async () => {
    try {
      setConnecting(true);
      setConnectionError('');
      
      // Log the environment and API URL for debugging
      const apiBaseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;
      const backendCallbackUrl = import.meta.env.VITE_GOOGLE_BACKEND_CALLBACK;
      
      // Enhanced logging
      debugLog('[GoogleDriveIntegration] Initiating connection', { 
        apiBaseUrl,
        backendCallbackUrl, 
        returnTo: returnTo || 'none',
        env: import.meta.env.MODE,
        userId: localStorage.getItem("userId") || 'not found'
      }, 'GoogleDriveIntegration');
      
      // Log to console for immediate visibility
      console.log('Connecting to Google Drive with:', {
        apiBaseUrl,
        backendCallbackUrl,
        hasUserId: !!localStorage.getItem("userId"),
        hasToken: !!localStorage.getItem("accessToken")
      });
      
      setAuthError(null);
      
      const userId = localStorage.getItem("userId");
      const accessToken = localStorage.getItem("accessToken");
      
      if (!userId) {
        const errorMsg = "You must be logged in to connect to Google Drive";
        debugLog('[Google Auth] Not logged in (missing userId)', null, 'GoogleDriveIntegration');
        message.error(errorMsg);
        setAuthError(errorMsg);
        setConnecting(false);
        return;
      }
      
      if (!accessToken) {
        const errorMsg = "Authentication token missing. Please log in again.";
        debugLog('[Google Auth] Not logged in (missing accessToken)', null, 'GoogleDriveIntegration');
        message.error(errorMsg);
        setAuthError(errorMsg);
        setConnecting(false);
        return;
      }
      
      if (returnTo) {
        localStorage.setItem('returnToContactId', returnTo);
        sessionStorage.setItem('returnToContactId', returnTo);
        
        const authInitiationTime = Date.now();
        localStorage.setItem('auth_initiation_time', authInitiationTime.toString());
        sessionStorage.setItem('auth_initiation_time', authInitiationTime.toString());
      }
      
      localStorage.setItem('google_auth_debug_timestamp', new Date().toISOString());
      localStorage.setItem('google_auth_debug_userId', userId);
      
      message.loading('Preparing Google Drive connection...', 1);
      
      try {
        const response = await dispatch(getGoogleAuth()).unwrap();
        debugLog('[Google Auth] Got response from getGoogleAuth:', response, 'GoogleDriveIntegration');
        
        const extractUrlFromResponse = (response: any): string | null => {
          if (typeof response === 'string') {
            return response;
          }
          
          if (response && typeof response === 'object') {
            const directUrl = response.url || response.authUrl || response.redirectUrl;
            if (directUrl && typeof directUrl === 'string') {
              return directUrl;
            }
            
            if (response.data) {
              if (typeof response.data === 'string') {
                return response.data;
              }
              
              if (typeof response.data === 'object') {
                const dataUrl = response.data.url || response.data.authUrl || response.data.redirectUrl;
                if (dataUrl && typeof dataUrl === 'string') {
                  return dataUrl;
                }
              }
            }
          }
          
          return null;
        };
        
        const url = extractUrlFromResponse(response);
        
        if (url) {
          debugLog('[Google Auth] Redirecting to Google auth URL', url, 'GoogleDriveIntegration');
          
          localStorage.setItem('google_auth_last_url', url);
          localStorage.setItem('google_auth_redirect_time', new Date().toISOString());
          
          window.location.href = url;
        } else {
          debugLog('[Google Auth] Failed to extract URL from response', response, 'GoogleDriveIntegration');
          throw new Error('Could not find a valid URL in the server response');
        }
      } catch (apiError) {
        if (apiError instanceof Error) {
          if (apiError.message.includes('404') || apiError.message.includes('not found')) {
            const errorMsg = 'Google Drive authentication endpoint not found. This might be a configuration issue.';
            debugLog('[Google Auth] API endpoint not found (404)', apiError, 'GoogleDriveIntegration');
            setAuthError(errorMsg);
            setConnectionResponse({ error: apiError.message, type: '404_endpoint_not_found' });
            message.error(errorMsg);
          } else {
            setAuthError(apiError.message);
            setConnectionResponse({ error: apiError.message });
            message.error(apiError.message);
          }
        } else {
          setAuthError('Unknown error occurred. Please try again.');
          setConnectionResponse({ error: 'Unknown error type' });
          message.error('Unknown error occurred. Please try again.');
        }
        
        debugLog('[Google Auth] Error getting auth URL', apiError, 'GoogleDriveIntegration');
        setConnecting(false);
        return;
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to initiate Google Drive connection';
      debugLog('[Google Auth] Connection error', error, 'GoogleDriveIntegration');
      message.error(errorMsg);
      setAuthError(errorMsg);
      setConnecting(false);
    }
  };

  const handleReconnect = async () => {
    try {
      setReconnecting(true);
      setAuthError(null);
      
      const userId = localStorage.getItem("userId");
      const accessToken = localStorage.getItem("accessToken");
      
      if (!userId) {
        const errorMsg = "You must be logged in to reconnect to Google Drive";
        debugLog('[Google Auth] Not logged in (missing userId)', null, 'GoogleDriveIntegration');
        message.error(errorMsg);
        setAuthError(errorMsg);
        setReconnecting(false);
        return;
      }
      
      if (!accessToken) {
        const errorMsg = "Authentication token missing. Please log in again.";
        debugLog('[Google Auth] Not logged in (missing accessToken)', null, 'GoogleDriveIntegration');
        message.error(errorMsg);
        setAuthError(errorMsg);
        setReconnecting(false);
        return;
      }
      
      if (returnTo) {
        localStorage.setItem('returnToContactId', returnTo);
        sessionStorage.setItem('returnToContactId', returnTo);
        
        const authInitiationTime = Date.now();
        localStorage.setItem('auth_initiation_time', authInitiationTime.toString());
        sessionStorage.setItem('auth_initiation_time', authInitiationTime.toString());
      }
      
      localStorage.setItem('google_auth_debug_timestamp', new Date().toISOString());
      localStorage.setItem('google_auth_debug_userId', userId);
      localStorage.setItem('google_auth_reconnect_attempt', 'true');
      
      message.loading('Preparing Google Drive reconnection...', 1);
      
      debugLog('[Google Auth] Requesting reconnect URL', { userId }, 'GoogleDriveIntegration');
      
      try {
        const response = await dispatch(getGoogleReconnect()).unwrap();
        debugLog('[Google Auth] Got response from getGoogleReconnect:', response, 'GoogleDriveIntegration');
        
        const extractUrlFromResponse = (response: any): string | null => {
          if (typeof response === 'string') {
            return response;
          }
          
          if (response && typeof response === 'object') {
            const directUrl = response.url || response.authUrl || response.redirectUrl;
            if (directUrl && typeof directUrl === 'string') {
              return directUrl;
            }
            
            if (response.data) {
              if (typeof response.data === 'string') {
                return response.data;
              }
              
              if (typeof response.data === 'object') {
                const dataUrl = response.data.url || response.data.authUrl || response.data.redirectUrl;
                if (dataUrl && typeof dataUrl === 'string') {
                  return dataUrl;
                }
              }
            }
          }
          
          return null;
        };
        
        const url = extractUrlFromResponse(response);
        
        if (url) {
          debugLog('[Google Auth] Redirecting to Google reconnect URL', url, 'GoogleDriveIntegration');
          
          localStorage.setItem('google_auth_last_url', url);
          localStorage.setItem('google_auth_redirect_time', new Date().toISOString());
          
          window.location.href = url;
        } else {
          debugLog('[Google Auth] Failed to extract URL from response', response, 'GoogleDriveIntegration');
          throw new Error('Could not find a valid URL in the server response');
        }
      } catch (apiError) {
        if (apiError instanceof Error) {
          if (apiError.message.includes('404') || apiError.message.includes('not found')) {
            const errorMsg = 'Google Drive reconnection endpoint not found. This might be a configuration issue.';
            debugLog('[Google Auth] API endpoint not found (404)', apiError, 'GoogleDriveIntegration');
            setAuthError(errorMsg);
            setConnectionResponse({ error: apiError.message, type: '404_endpoint_not_found' });
            message.error(errorMsg);
          } else {
            setAuthError(apiError.message);
            setConnectionResponse({ error: apiError.message });
            message.error(apiError.message);
          }
        } else {
          setAuthError('Unknown error occurred. Please try again.');
          setConnectionResponse({ error: 'Unknown error type' });
          message.error('Unknown error occurred. Please try again.');
        }
        
        debugLog('[Google Auth] Error getting reconnect URL', apiError, 'GoogleDriveIntegration');
        setReconnecting(false);
        return;
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to initiate Google Drive reconnection';
      debugLog('[Google Auth] Reconnection error', error, 'GoogleDriveIntegration');
      message.error(errorMsg);
      setAuthError(errorMsg);
      setReconnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      debugLog('[Google Auth] Attempting to disconnect from Google Drive', null, 'GoogleDriveIntegration');
      
      message.loading('Disconnecting from Google Drive...', 1);
      
      const response = await dispatch(disconnectGoogle()).unwrap();
      
      debugLog('[Google Auth] Disconnect response:', response, 'GoogleDriveIntegration');
      
      if (response.success) {
        setConnectionResponse(response);
      } else {
        setAuthError(response.error || 'Failed to disconnect from Google Drive');
        setConnectionResponse(response);
      }
      
      checkConnection();
    } catch (error) {
      debugLog('[Google Auth] Error during disconnect:', error, 'GoogleDriveIntegration');
      setAuthError(error instanceof Error ? error.message : 'Unknown error during disconnect');
      message.error('Failed to disconnect from Google Drive');
    }
  };
  
  const toggleDebugInfo = () => {
    setDebugVisible(!debugVisible);
  };

  const renderDebugInfo = () => {
    const userId = localStorage.getItem("userId");
    const accessToken = localStorage.getItem("accessToken");
    const lastRedirectTime = localStorage.getItem('google_auth_redirect_time');
    const lastUrl = localStorage.getItem('google_auth_last_url');
    
    const backendUrl = 'http://localhost:8000';
    const endpoints = {
      authUrl: `${backendUrl}/api/v1/document/auth/google`,
      reconnectUrl: `${backendUrl}/api/v1/document/auth/google/reconnect`,
      connectionCheckUrl: `${backendUrl}/api/v1/document/auth/google/connection`,
      disconnectUrl: `${backendUrl}/api/v1/document/google/disconnect`
    };
    
    return (
      <div style={{ marginTop: 16, padding: 16, background: '#f0f2f5', borderRadius: 4 }}>
        <Title level={5}>Connection Debug Information</Title>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          <li><Text strong>User ID:</Text> {userId ? userId : 'Not found'}</li>
          <li><Text strong>Access Token:</Text> {accessToken ? '✓ Present' : '✗ Missing'}</li>
          <li><Text strong>Connection Status:</Text> {isGoogleConnected ? 'Connected' : 'Not Connected'}</li>
          <li><Text strong>Last Redirect:</Text> {lastRedirectTime || 'None'}</li>
          {connectionResponse && (
            <li>
              <Text strong>Last Connection Check Response:</Text>
              <pre style={{ background: '#f6f8fa', padding: 8, borderRadius: 4, overflow: 'auto', maxHeight: 150 }}>
                {JSON.stringify(connectionResponse, null, 2)}
              </pre>
            </li>
          )}
        </ul>
        
        <div style={{ marginTop: 16 }}>
          <Text strong>API Endpoints:</Text>
          <ul style={{ listStyleType: 'none', padding: 8, background: '#f6f8fa', borderRadius: 4 }}>
            <li><Text code>Auth URL:</Text> {endpoints.authUrl}</li>
            <li><Text code>Reconnect URL:</Text> {endpoints.reconnectUrl}</li>
            <li><Text code>Connection Check:</Text> {endpoints.connectionCheckUrl}</li>
          </ul>
        </div>
        
        {lastUrl && (
          <div style={{ marginTop: 16 }}>
            <Text strong>Last Auth URL:</Text>
            <div style={{ wordBreak: 'break-all', background: '#f6f8fa', padding: 8, borderRadius: 4 }}>
              {lastUrl}
            </div>
          </div>
        )}
        
        <div style={{ marginTop: 16 }}>
          <Button 
            type="link" 
            onClick={() => navigator.clipboard.writeText(JSON.stringify({
              userId,
              hasToken: !!accessToken,
              connectionStatus: isGoogleConnected,
              lastRedirectTime,
              lastUrl,
              endpoints,
              connectionResponse
            }, null, 2))}
          >
            Copy Debug Info to Clipboard
          </Button>
        </div>
      </div>
    );
  };

  if (condensed) {
    return (
      <div style={{ marginBottom: 16 }}>
        <Space align="center">
          {checkingGoogleConnection ? (
            <SyncOutlined spin style={{ color: '#1890ff' }} />
          ) : isGoogleConnected ? (
            <CheckCircleFilled style={{ color: '#52c41a' }} />
          ) : (
            <CloseCircleFilled style={{ color: '#ff4d4f' }} />
          )}
          
          <Text>
            {checkingGoogleConnection
              ? 'Checking Google Drive connection...'
              : isGoogleConnected
              ? 'Connected to Google Drive'
              : 'Not connected to Google Drive'}
          </Text>

          {!isGoogleConnected && (
            <Button 
              icon={<GoogleOutlined />}
              type="primary"
              onClick={handleConnect}
              loading={connecting}
              size="small"
            >
              Connect
            </Button>
          )}

          {isGoogleConnected && (
            <>
              <Button
                icon={<ReloadOutlined />}
                onClick={handleReconnect}
                loading={reconnecting}
                size="small"
              >
                Reconnect
              </Button>
              
              <Popconfirm
                title="Disconnect Google Drive"
                description="Are you sure you want to disconnect from Google Drive? You will need to reconnect to upload documents."
                onConfirm={handleDisconnect}
                okText="Yes"
                cancelText="No"
              >
                <Button
                  icon={<DisconnectOutlined />}
                  danger
                  size="small"
                >
                  Disconnect
                </Button>
              </Popconfirm>
            </>
          )}
          
          <Button 
            type="text" 
            icon={<BugOutlined />} 
            size="small" 
            onClick={toggleDebugInfo}
            title="Toggle debug info"
          />
        </Space>
        
        {debugVisible && renderDebugInfo()}
      </div>
    );
  }

  return (
    <Card style={{ marginBottom: 16 }}>
      {showTitle && (
        <>
          <Title level={4}>
            <GoogleOutlined style={{ marginRight: 8 }} />
            Google Drive Integration
          </Title>
          <Divider />
        </>
      )}

      <div style={{ marginBottom: 16 }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <div>
            <Space align="center">
              {checkingGoogleConnection ? (
                <SyncOutlined spin style={{ color: '#1890ff', fontSize: 20 }} />
              ) : isGoogleConnected ? (
                <CheckCircleFilled style={{ color: '#52c41a', fontSize: 20 }} />
              ) : (
                <CloseCircleFilled style={{ color: '#ff4d4f', fontSize: 20 }} />
              )}
              
              <Text strong style={{ fontSize: 16 }}>
                {checkingGoogleConnection
                  ? 'Checking Google Drive connection...'
                  : isGoogleConnected
                  ? 'Connected to Google Drive'
                  : 'Not connected to Google Drive'}
              </Text>
              
              <Button 
                type="text" 
                icon={<BugOutlined />} 
                size="small" 
                onClick={toggleDebugInfo}
                title="Toggle debug info"
              />
            </Space>
          </div>

          {authError && (
            <Alert
              type="error"
              message="Connection Error"
              description={authError}
              showIcon
              style={{ marginBottom: 8 }}
            />
          )}

          <Paragraph>
            {isGoogleConnected ? (
              <>
                Your account is connected to Google Drive for document storage.
                <Tooltip title="Documents uploaded through this application are securely stored in your Google Drive account.">
                  <InfoCircleOutlined style={{ marginLeft: 8 }} />
                </Tooltip>
              </>
            ) : (
              <>
                Connect to Google Drive to enable document uploads and storage.
                <Tooltip title="This allows the application to store documents in your Google Drive account.">
                  <InfoCircleOutlined style={{ marginLeft: 8 }} />
                </Tooltip>
              </>
            )}
          </Paragraph>

          <Space>
            {!isGoogleConnected && (
              <Button 
                icon={<GoogleOutlined />}
                type="primary"
                onClick={handleConnect}
                loading={connecting}
              >
                Connect with Google Drive
              </Button>
            )}

            {isGoogleConnected && (
              <>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={handleReconnect}
                  loading={reconnecting}
                >
                  Reconnect with Google Drive
                </Button>
                
                <Popconfirm
                  title="Disconnect Google Drive"
                  description="Are you sure you want to disconnect from Google Drive? You will need to reconnect to upload documents."
                  onConfirm={handleDisconnect}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button
                    icon={<DisconnectOutlined />}
                    danger
                  >
                    Disconnect from Google Drive
                  </Button>
                </Popconfirm>
              </>
            )}

            <Button
              icon={<SyncOutlined />}
              onClick={checkConnection}
              loading={checkingGoogleConnection}
            >
              Check Connection Status
            </Button>
          </Space>
          
          {debugVisible && renderDebugInfo()}
        </Space>
      </div>
    </Card>
  );
};

export default GoogleDriveIntegration; 