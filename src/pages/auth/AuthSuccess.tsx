import React, { useEffect, useState } from 'react';
import { Result, Spin, Button, message, Alert, Space, Typography } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch } from '../../redux/app/hooks';
import { checkGoogleConnection, getGoogleReconnect } from '../../redux/features/documentSlice';
import debugLog from '../../utils/debugLog';

const { Text, Paragraph } = Typography;

const AuthSuccess: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const [verificationComplete, setVerificationComplete] = useState(false);
  const [connectionSuccess, setConnectionSuccess] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [retrying, setRetrying] = useState(false);
  const [retryAttempts, setRetryAttempts] = useState(0);
  const [connectionResponse, setConnectionResponse] = useState<any>(null);
  const [showDebugInfo, setShowDebugInfo] = useState(false);

  const verifyConnection = async () => {
    try {
      // Show verification message
      message.loading('Verifying Google Drive connection...', 1);
      
      // Check authentication before verifying
      const accessToken = localStorage.getItem("accessToken");
      const userId = localStorage.getItem("userId");
      
      if (!accessToken || !userId) {
        debugLog('Auth Success - Missing authentication when verifying connection', 
          { hasToken: !!accessToken, hasUserId: !!userId }, 'AuthSuccess');
        message.error('Authentication information incomplete. Please log in first.');
        setConnectionSuccess(false);
        setVerificationComplete(true);
        setLoading(false);
        return;
      }
      
      // Log the verification attempt with userId
      debugLog('Auth Success - Verifying connection for user', { userId }, 'AuthSuccess');
      
      // Verify the connection with backend
      const connectionResult = await dispatch(checkGoogleConnection()).unwrap();
      debugLog('Auth Success - Connection check result:', connectionResult, 'AuthSuccess');
      
      // Store response for debugging
      setConnectionResponse(connectionResult);
      
      if (connectionResult && connectionResult.connected) {
        setConnectionSuccess(true);
        message.success('Google Drive connected successfully!');
        
        // Save connection status in localStorage for persistence across page refreshes
        localStorage.setItem('googleDriveConnected', 'true');
      } else {
        debugLog('Auth Success - Connection verification failed', connectionResult, 'AuthSuccess');
        
        // Check if there's a specific message in the response
        const errorMessage = connectionResult.message || 'Google Drive connection could not be verified';
        message.warning(errorMessage);
        
        localStorage.setItem('googleDriveConnected', 'false');
      }
      
      setVerificationComplete(true);
      setLoading(false);
    } catch (error) {
      debugLog('Auth Success - Error verifying connection', error, 'AuthSuccess');
      
      // Store error for debugging
      if (error instanceof Error) {
        setConnectionResponse({ error: error.message });
      } else {
        setConnectionResponse({ error: "Unknown error object" });
      }
      
      message.error('Error verifying connection');
      setVerificationComplete(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    const processSuccess = async () => {
      try {
        // Extract query parameters
        const urlParams = new URLSearchParams(window.location.search);
        const provider = urlParams.get('provider');
        const userIdParam = urlParams.get('userId');
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        const token = urlParams.get('token');
        
        // Enhanced logging with all parameters
        debugLog('Auth Success Page - Processing success', { 
          provider, 
          userId: userIdParam,
          hasCode: !!code, 
          hasState: !!state,
          hasToken: !!token,
          allParams: Object.fromEntries(urlParams.entries())
        }, 'AuthSuccess');
        
        // If token is provided in URL, save it to localStorage
        if (token) {
          debugLog('Auth Success - Received token in URL, saving to localStorage', null, 'AuthSuccess');
          localStorage.setItem('accessToken', token);
        }
        
        // Set the userId from URL parameter or localStorage
        if (userIdParam) {
          setUserId(userIdParam);
          // Store in localStorage to preserve context
          localStorage.setItem('userId', userIdParam);
        } else {
          // Fallback to userId in localStorage
          const storedUserId = localStorage.getItem('userId');
          setUserId(storedUserId);
        }

        // Add delay for clearer UX
        const waitBeforeVerifying = setTimeout(() => {
          // Only verify if this is a Google auth callback (has code or provider is google)
          if (provider === 'google' || code) {
            // Verify Google Drive connection only if we haven't already verified it
            const alreadyVerified = localStorage.getItem('googleDriveConnected') === 'true';
            
            if (!alreadyVerified) {
              debugLog('Auth Success - Verifying Google Drive connection', null, 'AuthSuccess');
              verifyConnection();
            } else {
              // If already verified, just update state and continue
              debugLog('Auth Success - Google Drive already verified via localStorage', null, 'AuthSuccess');
              setConnectionSuccess(true);
              setVerificationComplete(true);
              setLoading(false);
            }
          } else {
            setVerificationComplete(true);
            setLoading(false);
          }
        }, 1000);
        
        return () => clearTimeout(waitBeforeVerifying);
      } catch (error) {
        debugLog('Auth Success - Error processing success', error, 'AuthSuccess');
        message.error('Failed to verify connection status');
        setLoading(false);
        setVerificationComplete(true);
      }
    };
    
    processSuccess();
  }, [dispatch]);

  const handleRetryVerification = async () => {
    setRetrying(true);
    setRetryAttempts(prev => prev + 1);
    
    // Try to verify connection again after a short delay
    setTimeout(async () => {
      await verifyConnection();
      setRetrying(false);
    }, 2000);
  };

  const handleForcedReconnect = async () => {
    try {
      setRetrying(true);
      
      // Check authentication before reconnecting
      const accessToken = localStorage.getItem("accessToken");
      const userId = localStorage.getItem("userId");
      
      if (!accessToken || !userId) {
        debugLog('Auth Success - Missing authentication when attempting reconnect', 
          { hasToken: !!accessToken, hasUserId: !!userId }, 'AuthSuccess');
        message.error('Authentication information incomplete. Please log in first.');
        setRetrying(false);
        return;
      }
      
      // Store return path information
      const returnToContactId = localStorage.getItem('returnToContactId') || 
                               sessionStorage.getItem('returnToContactId');
      
      if (returnToContactId) {
        // Keep the return path if it exists
        localStorage.setItem('returnToContactId', returnToContactId);
        sessionStorage.setItem('returnToContactId', returnToContactId);
      }
      
      // Add debug information to localStorage
      localStorage.setItem('google_auth_reconnect_timestamp', new Date().toISOString());
      localStorage.setItem('google_auth_reconnect_from_success_page', 'true');
      
      message.loading('Preparing Google Drive reconnection...', 1);
      
      // Force a reconnect 
      const url = await dispatch(getGoogleReconnect()).unwrap();
      
      // Handle the URL response
      if (url && typeof url === 'string') {
        debugLog('Auth Success - Redirecting to reconnect URL', url, 'AuthSuccess');
        window.location.href = url;
      } else if (url && typeof url === 'object') {
        // Try to extract URL from object
        const extractedUrl = url.url || url.authUrl || url.redirectUrl;
        if (extractedUrl && typeof extractedUrl === 'string') {
          debugLog('Auth Success - Extracted URL from object, redirecting', extractedUrl, 'AuthSuccess');
          window.location.href = extractedUrl;
          return;
        } else {
          throw new Error('Could not extract URL from response object');
        }
      } else {
        throw new Error('Invalid reconnect URL');
      }
    } catch (error) {
      debugLog('Auth Success - Error initiating forced reconnect', error, 'AuthSuccess');
      message.error('Failed to initiate reconnection. Please try again later.');
      setRetrying(false);
    }
  };

  const handleReturn = () => {
    // Check for saved contactId to return to
    let returnToContactId = localStorage.getItem('returnToContactId');
    
    // If not in localStorage, try sessionStorage
    if (!returnToContactId || returnToContactId.trim() === '') {
      returnToContactId = sessionStorage.getItem('returnToContactId');
    }
    
    // Clean up storage
    localStorage.removeItem('returnToContactId');
    sessionStorage.removeItem('returnToContactId');
    localStorage.removeItem('auth_initiation_time');
    sessionStorage.removeItem('auth_initiation_time');
    
    if (returnToContactId && returnToContactId.trim() !== '') {
      // Navigate back to the contact page or other specific page
      navigate(`/contact/${returnToContactId}`);
    } else {
      // Or go to a default page
      navigate('/contacts');
    }
  };
  
  const toggleDebugInfo = () => {
    setShowDebugInfo(!showDebugInfo);
  };
  
  // Debug information component
  const DebugInfo = () => {
    const accessToken = localStorage.getItem("accessToken");
    return (
      <div style={{ textAlign: 'left', border: '1px solid #eee', padding: 16, borderRadius: 4, marginTop: 20 }}>
        <Paragraph>
          <Text strong>Debug Information:</Text>
        </Paragraph>
        <ul>
          <li><Text>User ID: {userId || 'Not found'}</Text></li>
          <li><Text>Access Token: {accessToken ? '✓ Present' : '✗ Missing'}</Text></li>
          <li><Text>Retry Attempts: {retryAttempts}</Text></li>
          <li><Text>Auth Initiation Time: {localStorage.getItem('auth_initiation_time') || 'Not found'}</Text></li>
          <li><Text>Connection Success: {connectionSuccess ? 'Yes' : 'No'}</Text></li>
        </ul>
        
        {connectionResponse && (
          <>
            <Paragraph><Text strong>Connection Response:</Text></Paragraph>
            <pre style={{ background: '#f6f8fa', padding: 8, borderRadius: 4, overflow: 'auto', maxHeight: 200 }}>
              {JSON.stringify(connectionResponse, null, 2)}
            </pre>
          </>
        )}
      </div>
    );
  };
  
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      {loading ? (
        <Result
          status="info"
          title="Verifying Connection"
          subTitle={
            <div>
              <p>Verifying your Google Drive connection...</p>
              <Spin />
            </div>
          }
        />
      ) : connectionSuccess ? (
        <Result
          status="success"
          title="Google Drive Connected Successfully"
          subTitle={
            <div>
              <p>Your account has been successfully connected to Google Drive.</p>
              {userId && (
                <p>
                  <small>User ID: {userId}</small>
                </p>
              )}
            </div>
          }
          extra={[
            <Button 
              key="return" 
              type="primary" 
              onClick={handleReturn}
              disabled={loading && !verificationComplete}>
              Return to Application
            </Button>,
            <Button
              key="debug"
              type="link"
              onClick={toggleDebugInfo}>
              {showDebugInfo ? 'Hide' : 'Show'} Debug Info
            </Button>
          ]}
        />
      ) : (
        <Result
          status="warning"
          title="Google Drive Connection Issue"
          subTitle={
            <div>
              <Alert
                message="Connection Verification Failed"
                description={
                  <span>
                    We couldn't confirm your Google Drive connection. This could be due to:
                    <ul style={{ textAlign: 'left', marginTop: 10 }}>
                      <li>The connection is still being established on the server</li>
                      <li>The authorization process didn't complete correctly</li>
                      <li>There might be permission issues with your Google account</li>
                      <li>Your authentication token might be missing or invalid</li>
                    </ul>
                  </span>
                }
                type="warning"
                showIcon
                style={{ marginBottom: 20, textAlign: 'left' }}
              />
              
              {userId && (
                <p>
                  <small>User ID: {userId}</small>
                </p>
              )}
            </div>
          }
          extra={
            <Space size="middle" direction="vertical">
              <Space>
                <Button 
                  type="primary" 
                  onClick={handleRetryVerification}
                  loading={retrying}>
                  Retry Verification
                </Button>
                
                <Button 
                  onClick={handleForcedReconnect}
                  loading={retrying}>
                  Force Reconnect
                </Button>
                
                <Button onClick={handleReturn}>
                  Return without Connecting
                </Button>
              </Space>
              
              <Button
                type="link"
                onClick={toggleDebugInfo}>
                {showDebugInfo ? 'Hide' : 'Show'} Debug Info
              </Button>
            </Space>
          }
        />
      )}
      
      {showDebugInfo && <DebugInfo />}
    </div>
  );
};

export default AuthSuccess; 