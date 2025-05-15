import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Result, Button, Typography, Divider, Alert, message } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { getGoogleAuth, getGoogleReconnect } from '../../redux/features/documentSlice';
import { useAppDispatch } from '../../redux/app/hooks';
import debugLog from '../../utils/debugLog';
const { Text, Paragraph } = Typography;
const AuthError = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useAppDispatch();
    const [errorDetails, setErrorDetails] = useState('');
    const [errorType, setErrorType] = useState('');
    const [userId, setUserId] = useState(null);
    const [loginRequired, setLoginRequired] = useState(false);
    const [showDebugInfo, setShowDebugInfo] = useState(false);
    const [errorResponse, setErrorResponse] = useState(null);
    useEffect(() => {
        const processError = () => {
            try {
                // Extract query parameters
                const urlParams = new URLSearchParams(window.location.search);
                const errorParam = urlParams.get('error');
                const errorDescription = urlParams.get('error_description');
                const provider = urlParams.get('provider');
                const userIdParam = urlParams.get('userId');
                const accessToken = localStorage.getItem("accessToken");
                // Capture all URL parameters for debugging
                const allParams = Object.fromEntries(urlParams.entries());
                setErrorResponse(allParams);
                debugLog('Auth Error Page - Processing error', {
                    error: errorParam,
                    errorDescription,
                    provider,
                    userId: userIdParam,
                    hasToken: !!accessToken,
                    allParams
                }, 'AuthError');
                // Set user ID from URL or localStorage
                if (userIdParam) {
                    setUserId(userIdParam);
                }
                else {
                    // Try to get userId from localStorage
                    const storedUserId = localStorage.getItem('userId');
                    setUserId(storedUserId);
                    // If neither URL nor localStorage has userId, we need login
                    if (!storedUserId) {
                        setLoginRequired(true);
                    }
                }
                // Access token check
                if (!accessToken) {
                    debugLog('Auth Error - No access token found', null, 'AuthError');
                    setLoginRequired(true);
                }
                // Set error type if available
                if (provider) {
                    setErrorType(provider);
                }
                // Set error details
                if (errorDescription) {
                    setErrorDetails(errorDescription);
                    // Check for specific authentication errors
                    if (errorDescription.includes('authentication required') ||
                        errorDescription.includes('not authenticated') ||
                        errorDescription.includes('login required')) {
                        setLoginRequired(true);
                    }
                }
                else if (errorParam) {
                    setErrorDetails(errorParam);
                    // Check for authentication errors
                    if (errorParam === 'auth_required' ||
                        errorParam === 'not_authenticated' ||
                        errorParam === 'login_required') {
                        setLoginRequired(true);
                    }
                }
                else {
                    setErrorDetails('An unknown error occurred during authentication.');
                }
            }
            catch (error) {
                debugLog('Auth Error - Error processing error parameters', error, 'AuthError');
                setErrorDetails('An unexpected error occurred while processing the authentication response.');
                if (error instanceof Error) {
                    setErrorResponse({ processingError: error.message });
                }
            }
        };
        processError();
    }, [location]);
    const handleRetry = async () => {
        try {
            // First ensure we have a userId and access token
            const userId = localStorage.getItem('userId');
            const accessToken = localStorage.getItem('accessToken');
            if (!userId || !accessToken) {
                // Redirect to login page first
                debugLog('Auth Error - Missing authentication info for retry', { hasUserId: !!userId, hasToken: !!accessToken }, 'AuthError');
                message.error('Authentication information is incomplete. Please log in first.');
                navigate('/login', { state: { redirectAfterLogin: '/profile/google-drive' } });
                return;
            }
            // Store debug information
            localStorage.setItem('google_auth_retry_from_error', 'true');
            localStorage.setItem('google_auth_retry_timestamp', new Date().toISOString());
            // Get Google auth URL
            debugLog('[Google Auth] Requesting auth URL for retry', { userId }, 'AuthError');
            const url = await dispatch(getGoogleAuth()).unwrap();
            if (url && typeof url === 'string') {
                debugLog('[Google Auth] Redirecting to Google auth URL', url, 'AuthError');
                window.location.href = url;
            }
            else if (url && typeof url === 'object') {
                // Try to extract URL from object
                const extractedUrl = url.url || url.authUrl || url.redirectUrl;
                if (extractedUrl && typeof extractedUrl === 'string') {
                    debugLog('[Google Auth] Extracted URL from object, redirecting', extractedUrl, 'AuthError');
                    window.location.href = extractedUrl;
                    return;
                }
                else {
                    throw new Error('Could not extract URL from response object');
                }
            }
            else {
                throw new Error('Invalid auth URL returned');
            }
        }
        catch (error) {
            debugLog('[Google Auth] Retry error', error, 'AuthError');
            message.error('Failed to initiate Google authentication. Please try again later.');
        }
    };
    const handleForceReconnect = async () => {
        try {
            // First ensure we have a userId and access token
            const userId = localStorage.getItem('userId');
            const accessToken = localStorage.getItem('accessToken');
            if (!userId || !accessToken) {
                // Redirect to login page first
                debugLog('Auth Error - Missing authentication info for reconnect', { hasUserId: !!userId, hasToken: !!accessToken }, 'AuthError');
                message.error('Authentication information is incomplete. Please log in first.');
                navigate('/login', { state: { redirectAfterLogin: '/profile/google-drive' } });
                return;
            }
            // Store debug information
            localStorage.setItem('google_auth_force_reconnect_from_error', 'true');
            localStorage.setItem('google_auth_force_reconnect_timestamp', new Date().toISOString());
            // Get Google reconnect URL (with force consent)
            debugLog('[Google Auth] Requesting reconnect URL', { userId }, 'AuthError');
            const url = await dispatch(getGoogleReconnect()).unwrap();
            if (url && typeof url === 'string') {
                debugLog('[Google Auth] Redirecting to Google reconnect URL', url, 'AuthError');
                window.location.href = url;
            }
            else if (url && typeof url === 'object') {
                // Try to extract URL from object
                const extractedUrl = url.url || url.authUrl || url.redirectUrl;
                if (extractedUrl && typeof extractedUrl === 'string') {
                    debugLog('[Google Auth] Extracted URL from object, redirecting', extractedUrl, 'AuthError');
                    window.location.href = extractedUrl;
                    return;
                }
                else {
                    throw new Error('Could not extract URL from response object');
                }
            }
            else {
                throw new Error('Invalid reconnect URL returned');
            }
        }
        catch (error) {
            debugLog('[Google Auth] Force reconnect error', error, 'AuthError');
            message.error('Failed to initiate Google reconnection. Please try again later.');
        }
    };
    const handleGoBack = () => {
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
    const handleLogin = () => {
        // Save return path for after login
        localStorage.setItem('returnAfterLogin', '/profile/google-drive');
        navigate('/login');
    };
    const toggleDebugInfo = () => {
        setShowDebugInfo(!showDebugInfo);
    };
    // Debug information component
    const DebugInfo = () => {
        const accessToken = localStorage.getItem("accessToken");
        const initTime = localStorage.getItem('auth_initiation_time');
        return (_jsxs("div", { style: { textAlign: 'left', border: '1px solid #eee', padding: 16, borderRadius: 4, marginTop: 20 }, children: [_jsx(Paragraph, { children: _jsx(Text, { strong: true, children: "Debug Information:" }) }), _jsxs("ul", { children: [_jsx("li", { children: _jsxs(Text, { children: ["User ID: ", userId || 'Not found'] }) }), _jsx("li", { children: _jsxs(Text, { children: ["Access Token: ", accessToken ? '✓ Present' : '✗ Missing'] }) }), _jsx("li", { children: _jsxs(Text, { children: ["Login Required: ", loginRequired ? 'Yes' : 'No'] }) }), _jsx("li", { children: _jsxs(Text, { children: ["Error Type: ", errorType || 'Not specified'] }) }), _jsx("li", { children: _jsxs(Text, { children: ["Auth Initiation Time: ", initTime || 'Not found'] }) })] }), errorResponse && (_jsxs(_Fragment, { children: [_jsx(Paragraph, { children: _jsx(Text, { strong: true, children: "Error Details:" }) }), _jsx("pre", { style: { background: '#f6f8fa', padding: 8, borderRadius: 4, overflow: 'auto', maxHeight: 200 }, children: JSON.stringify(errorResponse, null, 2) })] }))] }));
    };
    return (_jsxs("div", { style: { padding: '2rem', textAlign: 'center' }, children: [loginRequired && (_jsx(Alert, { message: "Authentication Required", description: "You need to be logged in to connect to Google Drive.", type: "warning", showIcon: true, style: { marginBottom: 20 } })), _jsxs(Result, { status: "error", title: loginRequired ? "Login Required" : "Authentication Failed", subTitle: _jsxs("div", { children: [_jsx("p", { children: loginRequired
                                ? "You must be logged in to your account before connecting to Google Drive."
                                : "There was a problem with the Google Drive authentication process." }), errorDetails && _jsx("p", { children: _jsx(Text, { type: "danger", children: errorDetails }) }), userId && _jsx("p", { children: _jsxs("small", { children: ["User ID: ", userId] }) })] }), extra: loginRequired ? [
                    _jsx(Button, { type: "primary", onClick: handleLogin, children: "Log In Now" }, "login"),
                    _jsx(Button, { onClick: handleGoBack, children: "Go Back" }, "back"),
                    _jsxs(Button, { type: "link", onClick: toggleDebugInfo, children: [showDebugInfo ? 'Hide' : 'Show', " Debug Info"] }, "debug")
                ] : [
                    _jsx(Button, { type: "primary", onClick: handleRetry, children: "Try Again" }, "retry"),
                    _jsx(Button, { onClick: handleForceReconnect, children: "Force Reconnect" }, "force"),
                    _jsx(Button, { onClick: handleGoBack, children: "Go Back" }, "back"),
                    _jsxs(Button, { type: "link", onClick: toggleDebugInfo, children: [showDebugInfo ? 'Hide' : 'Show', " Debug Info"] }, "debug")
                ], children: [_jsx(Divider, {}), _jsx(Paragraph, { children: _jsx(Text, { strong: true, children: "Why did this happen?" }) }), _jsxs(Paragraph, { children: ["This error may occur if:", _jsxs("ul", { style: { textAlign: 'left' }, children: [_jsx("li", { children: "You are not logged in to your account" }), _jsx("li", { children: "Your session has expired" }), _jsx("li", { children: "You denied permission to access your Google Drive" }), _jsx("li", { children: "Your Google account has security restrictions" }), _jsx("li", { children: "There was a network or server issue" }), _jsx("li", { children: "Your previous authorization token has expired" })] })] }), _jsx(Paragraph, { children: _jsx(Text, { strong: true, children: "What to do next:" }) }), _jsx(Paragraph, { children: _jsxs("ul", { style: { textAlign: 'left' }, children: [_jsx("li", { children: loginRequired ? "Log in to your account first" : "Make sure you are logged in to your account" }), _jsx("li", { children: "Try authenticating again with the \"Try Again\" button" }), _jsx("li", { children: "Use \"Force Reconnect\" if you've previously connected but are having issues" }), _jsx("li", { children: "Contact support if the problem persists" })] }) })] }), showDebugInfo && _jsx(DebugInfo, {})] }));
};
export default AuthError;
