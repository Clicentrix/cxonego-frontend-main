import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Result, Spin, Button, message, Alert, Space, Typography } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch } from '../../redux/app/hooks';
import { checkGoogleConnection, getGoogleReconnect } from '../../redux/features/documentSlice';
import debugLog from '../../utils/debugLog';
const { Text, Paragraph } = Typography;
const AuthSuccess = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(true);
    const [verificationComplete, setVerificationComplete] = useState(false);
    const [connectionSuccess, setConnectionSuccess] = useState(false);
    const [userId, setUserId] = useState(null);
    const [retrying, setRetrying] = useState(false);
    const [retryAttempts, setRetryAttempts] = useState(0);
    const [connectionResponse, setConnectionResponse] = useState(null);
    const [showDebugInfo, setShowDebugInfo] = useState(false);
    const verifyConnection = async () => {
        try {
            // Show verification message
            message.loading('Verifying Google Drive connection...', 1);
            // Check authentication before verifying
            const accessToken = localStorage.getItem("accessToken");
            const userId = localStorage.getItem("userId");
            if (!accessToken || !userId) {
                debugLog('Auth Success - Missing authentication when verifying connection', { hasToken: !!accessToken, hasUserId: !!userId }, 'AuthSuccess');
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
            }
            else {
                debugLog('Auth Success - Connection verification failed', connectionResult, 'AuthSuccess');
                // Check if there's a specific message in the response
                const errorMessage = connectionResult.message || 'Google Drive connection could not be verified';
                message.warning(errorMessage);
                localStorage.setItem('googleDriveConnected', 'false');
            }
            setVerificationComplete(true);
            setLoading(false);
        }
        catch (error) {
            debugLog('Auth Success - Error verifying connection', error, 'AuthSuccess');
            // Store error for debugging
            if (error instanceof Error) {
                setConnectionResponse({ error: error.message });
            }
            else {
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
                }
                else {
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
                        }
                        else {
                            // If already verified, just update state and continue
                            debugLog('Auth Success - Google Drive already verified via localStorage', null, 'AuthSuccess');
                            setConnectionSuccess(true);
                            setVerificationComplete(true);
                            setLoading(false);
                        }
                    }
                    else {
                        setVerificationComplete(true);
                        setLoading(false);
                    }
                }, 1000);
                return () => clearTimeout(waitBeforeVerifying);
            }
            catch (error) {
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
                debugLog('Auth Success - Missing authentication when attempting reconnect', { hasToken: !!accessToken, hasUserId: !!userId }, 'AuthSuccess');
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
            }
            else if (url && typeof url === 'object') {
                // Try to extract URL from object
                const extractedUrl = url.url || url.authUrl || url.redirectUrl;
                if (extractedUrl && typeof extractedUrl === 'string') {
                    debugLog('Auth Success - Extracted URL from object, redirecting', extractedUrl, 'AuthSuccess');
                    window.location.href = extractedUrl;
                    return;
                }
                else {
                    throw new Error('Could not extract URL from response object');
                }
            }
            else {
                throw new Error('Invalid reconnect URL');
            }
        }
        catch (error) {
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
        }
        else {
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
        return (_jsxs("div", { style: { textAlign: 'left', border: '1px solid #eee', padding: 16, borderRadius: 4, marginTop: 20 }, children: [_jsx(Paragraph, { children: _jsx(Text, { strong: true, children: "Debug Information:" }) }), _jsxs("ul", { children: [_jsx("li", { children: _jsxs(Text, { children: ["User ID: ", userId || 'Not found'] }) }), _jsx("li", { children: _jsxs(Text, { children: ["Access Token: ", accessToken ? '✓ Present' : '✗ Missing'] }) }), _jsx("li", { children: _jsxs(Text, { children: ["Retry Attempts: ", retryAttempts] }) }), _jsx("li", { children: _jsxs(Text, { children: ["Auth Initiation Time: ", localStorage.getItem('auth_initiation_time') || 'Not found'] }) }), _jsx("li", { children: _jsxs(Text, { children: ["Connection Success: ", connectionSuccess ? 'Yes' : 'No'] }) })] }), connectionResponse && (_jsxs(_Fragment, { children: [_jsx(Paragraph, { children: _jsx(Text, { strong: true, children: "Connection Response:" }) }), _jsx("pre", { style: { background: '#f6f8fa', padding: 8, borderRadius: 4, overflow: 'auto', maxHeight: 200 }, children: JSON.stringify(connectionResponse, null, 2) })] }))] }));
    };
    return (_jsxs("div", { style: { padding: '2rem', textAlign: 'center' }, children: [loading ? (_jsx(Result, { status: "info", title: "Verifying Connection", subTitle: _jsxs("div", { children: [_jsx("p", { children: "Verifying your Google Drive connection..." }), _jsx(Spin, {})] }) })) : connectionSuccess ? (_jsx(Result, { status: "success", title: "Google Drive Connected Successfully", subTitle: _jsxs("div", { children: [_jsx("p", { children: "Your account has been successfully connected to Google Drive." }), userId && (_jsx("p", { children: _jsxs("small", { children: ["User ID: ", userId] }) }))] }), extra: [
                    _jsx(Button, { type: "primary", onClick: handleReturn, disabled: loading && !verificationComplete, children: "Return to Application" }, "return"),
                    _jsxs(Button, { type: "link", onClick: toggleDebugInfo, children: [showDebugInfo ? 'Hide' : 'Show', " Debug Info"] }, "debug")
                ] })) : (_jsx(Result, { status: "warning", title: "Google Drive Connection Issue", subTitle: _jsxs("div", { children: [_jsx(Alert, { message: "Connection Verification Failed", description: _jsxs("span", { children: ["We couldn't confirm your Google Drive connection. This could be due to:", _jsxs("ul", { style: { textAlign: 'left', marginTop: 10 }, children: [_jsx("li", { children: "The connection is still being established on the server" }), _jsx("li", { children: "The authorization process didn't complete correctly" }), _jsx("li", { children: "There might be permission issues with your Google account" }), _jsx("li", { children: "Your authentication token might be missing or invalid" })] })] }), type: "warning", showIcon: true, style: { marginBottom: 20, textAlign: 'left' } }), userId && (_jsx("p", { children: _jsxs("small", { children: ["User ID: ", userId] }) }))] }), extra: _jsxs(Space, { size: "middle", direction: "vertical", children: [_jsxs(Space, { children: [_jsx(Button, { type: "primary", onClick: handleRetryVerification, loading: retrying, children: "Retry Verification" }), _jsx(Button, { onClick: handleForcedReconnect, loading: retrying, children: "Force Reconnect" }), _jsx(Button, { onClick: handleReturn, children: "Return without Connecting" })] }), _jsxs(Button, { type: "link", onClick: toggleDebugInfo, children: [showDebugInfo ? 'Hide' : 'Show', " Debug Info"] })] }) })), showDebugInfo && _jsx(DebugInfo, {})] }));
};
export default AuthSuccess;
