import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Result, Spin, message, Button } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { checkGoogleConnection, getGoogleAuth } from '../../redux/features/documentSlice';
import { useAppDispatch } from '../../redux/app/hooks';
import debugLog from '../../utils/debugLog';
// Early logging to debug environment variables
console.log('GoogleAuthCallback component loaded');
console.log('Environment variables:', {
    apiBaseUrl: import.meta.env.VITE_REACT_APP_BASE_URL,
    googleCallbackUrl: import.meta.env.VITE_GOOGLE_AUTH_CALLBACK_URL,
    environment: import.meta.env.VITE_ENVIRONMENT,
    mode: import.meta.env.MODE
});
// More detailed environment information
console.log('=== Google Auth Callback Environment Details ===');
console.log('Full window.location:', window.location.href);
console.log('API Base URL:', import.meta.env.VITE_REACT_APP_BASE_URL);
console.log('Frontend callback URL:', import.meta.env.VITE_GOOGLE_AUTH_CALLBACK_URL);
console.log('Backend callback URL:', import.meta.env.VITE_GOOGLE_BACKEND_CALLBACK);
console.log('User ID from localStorage:', localStorage.getItem('userId'));
console.log('Has accessToken:', !!localStorage.getItem('accessToken'));
console.log('=============================================');
// Safely get environment variables
const getEnvVariable = (name, defaultValue) => {
    const value = import.meta.env[name];
    if (value !== undefined) {
        return value;
    }
    console.warn(`Environment variable ${name} not found, using default value: ${defaultValue}`);
    return defaultValue;
};
const getEnvironmentMode = () => {
    try {
        // Use import.meta.env instead of process.env for Vite
        if (import.meta.env.MODE) {
            return import.meta.env.MODE;
        }
    }
    catch (e) {
        console.warn('Error accessing environment mode:', e);
    }
    return 'production'; // Default to production for safety
};
const isDevelopment = () => {
    return (
        import.meta.env.MODE === 'development' || 
        window.location.hostname === 'localhost' || 
        window.location.hostname === '127.0.0.1'
    );
};
const getPreferredCallbackUrl = () => {
    if (isDevelopment()) {
        // For local development, use localhost
        const port = window.location.port ? `:${window.location.port}` : '';
        return `http://${window.location.hostname}${port}/auth-success`;
    } else {
        // For production, use the configured callback URL
        return import.meta.env.VITE_GOOGLE_AUTH_CALLBACK_URL || 'https://app.cxonego.me/auth-success';
    }
};
console.log('Environment details:');
console.log('Current hostname:', window.location.hostname);
console.log('isDevelopment:', isDevelopment());
console.log('Preferred callback URL:', getPreferredCallbackUrl());

// Add a function to handle the auth flow that includes the correct callback URL
const initiateAuthFlow = async () => {
    try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            console.error('No userId found in localStorage');
            return null;
        }
        
        // Construct the auth URL with the correct parameters
        const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL || 'http://localhost:8000/api/v1';
        const callbackUrl = getPreferredCallbackUrl();
        
        console.log('Initiating auth flow with:');
        console.log('- Base URL:', baseUrl);
        console.log('- Callback URL:', callbackUrl);
        console.log('- User ID:', userId);
        
        const url = `${baseUrl}/document/auth/google?userId=${userId}&redirect_uri=${encodeURIComponent(callbackUrl)}`;
        console.log('Full auth URL:', url);
        
        return url;
    } catch (error) {
        console.error('Error constructing auth URL:', error);
        return null;
    }
};

const GoogleAuthCallback = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useAppDispatch();
    const [status, setStatus] = useState('loading');
    const [errorMessage, setErrorMessage] = useState('');
    const [debugInfo, setDebugInfo] = useState(null);
    // Function to handle manual retry
    const handleRetry = async () => {
        try {
            // Use our custom auth flow function instead of Redux
            const url = await initiateAuthFlow();
            
                if (url && typeof url === 'string') {
                    debugLog('Retrying Google Auth - Redirecting to:', url, 'GoogleAuthCallback');
                    window.location.href = url;
            } else {
                // Fallback to Redux method if our custom function fails
                dispatch(getGoogleAuth())
                    .unwrap()
                    .then(reduxUrl => {
                        if (reduxUrl && typeof reduxUrl === 'string') {
                            debugLog('Retrying Google Auth (Redux fallback) - Redirecting to:', reduxUrl, 'GoogleAuthCallback');
                            window.location.href = reduxUrl;
                        } else {
                    setErrorMessage('Could not get authentication URL for retry.');
                    setStatus('error');
                }
            })
                .catch(err => {
                debugLog('Error getting Google Auth URL for retry:', err, 'GoogleAuthCallback');
                setErrorMessage('Failed to initiate authentication. Please try again later.');
                setStatus('error');
            });
        }
        } catch (error) {
            debugLog('Manual retry failed:', error, 'GoogleAuthCallback');
            setErrorMessage('Failed to retry authentication. Please try again.');
            setStatus('error');
        }
    };
    useEffect(() => {
        const processCallback = async () => {
            try {
                // Log all URL data for debugging
                const urlParams = new URLSearchParams(window.location.search);
                const allParams = {};
                urlParams.forEach((value, key) => {
                    allParams[key] = value;
                });
                debugLog('Google Auth Callback - All URL parameters:', allParams, 'GoogleAuthCallback');
                debugLog('Google Auth Callback - Current path:', location.pathname, 'GoogleAuthCallback');
                // Enhanced debug information
                const queryString = window.location.search;
                const fullUrl = window.location.href;
                // Store debug info for potential display
                setDebugInfo({
                    path: location.pathname,
                    params: allParams,
                    fullUrl,
                    queryString,
                    timestamp: new Date().toISOString(),
                    origin: window.location.origin,
                    localStorage: {
                        returnToContactId: localStorage.getItem('returnToContactId'),
                        redirectCount: localStorage.getItem('google_auth_redirect_count')
                    }
                });
                // Check for status parameter first
                const status = urlParams.get('status');
                if (status === 'success') {
                    debugLog('Google Auth Callback - Success status parameter found', null, 'GoogleAuthCallback');
                    // Automatically mark as successful
                    setStatus('success');
                    // Show a success message
                    message.success('Google Drive connected successfully!');
                    // After a short delay, redirect to the saved contact page or contacts page
                    setTimeout(() => {
                        // Check for saved contactId to return to - try both localStorage and sessionStorage
                        let returnToContactId = localStorage.getItem('returnToContactId');
                        // If not in localStorage, try sessionStorage
                        if (!returnToContactId || returnToContactId.trim() === '') {
                            returnToContactId = sessionStorage.getItem('returnToContactId');
                            if (returnToContactId) {
                                debugLog('Google Auth Callback - Found contact ID in sessionStorage:', returnToContactId, 'GoogleAuthCallback');
                            }
                        }
                        else {
                            debugLog('Google Auth Callback - Found contact ID in localStorage:', returnToContactId, 'GoogleAuthCallback');
                        }
                        if (returnToContactId && returnToContactId.trim() !== '') {
                            // If we have a contact ID, navigate back to the contact page
                            navigate(`/contact/${returnToContactId}`);
                            // Clear the stored IDs after use
                            localStorage.removeItem('returnToContactId');
                            sessionStorage.removeItem('returnToContactId');
                            localStorage.removeItem('auth_initiation_time');
                            sessionStorage.removeItem('auth_initiation_time');
                        }
                        else {
                            // Otherwise go to the general contacts page as fallback
                            navigate('/contacts');
                        }
                    }, 2000);
                    return;
                }
                // Check for errors first
                const error = urlParams.get('error');
                if (error) {
                    debugLog('Google Auth Callback - Error parameter found:', error, 'GoogleAuthCallback');
                    setStatus('error');
                    setErrorMessage(`Authentication error: ${error}`);
                    return;
                }
                // Look for the authorization code
                const code = urlParams.get('code');
                const state = urlParams.get('state'); // Optional state parameter
                const provider = urlParams.get('provider');
                if (!code) {
                    debugLog('Google Auth Callback - No code parameter found in URL params:', Object.fromEntries(urlParams.entries()), 'GoogleAuthCallback');
                    // If provider=google parameter is present but no code, this might be the initial navigation
                    // so we should initiate the auth flow rather than show an error
                    if (provider === 'google') {
                        // EMERGENCY LOOP BREAKER: If URL contains a 'loopBreak=true' parameter, don't redirect again
                        if (urlParams.get('loopBreak') === 'true') {
                            debugLog('Google Auth Callback - Loop break flag detected, showing configuration instructions', null, 'GoogleAuthCallback');
                            setStatus('error');
                            setErrorMessage('Authentication loop detected and stopped. Your Google OAuth configuration needs to be updated. Please check the detailed instructions.');
                            // Reset all tracking data
                            localStorage.removeItem('google_auth_last_redirect');
                            localStorage.removeItem('google_auth_redirect_count');
                            return;
                        }
                        
                        // ENHANCED ANTI-LOOP MECHANISM:
                        // Check if we're in a potential redirect loop by looking at localStorage
                        const lastRedirectTime = localStorage.getItem('google_auth_last_redirect');
                        const redirectCount = parseInt(localStorage.getItem('google_auth_redirect_count') || '0');
                        const now = Date.now();
                        
                        // ULTRA AGGRESSIVE: If this isn't the first attempt, immediately show error
                        if (redirectCount > 0) {
                            debugLog('Google Auth Callback - Preventing any more redirects after first attempt', { redirectCount }, 'GoogleAuthCallback');
                            setStatus('error');
                            setErrorMessage(`
                🛑 REDIRECT PREVENTION ACTIVATED 🛑
                
                To avoid an infinite loop, we've stopped the Google authentication process.
                
                THE PROBLEM:
                Your Google OAuth is not correctly configured. The most common issue is 
                that the redirect URI in your Google Cloud Console is incorrect.
                
                See the "Show Setup Guide" button below for detailed instructions.
              `);
                            // Reset our loop detection
                            localStorage.removeItem('google_auth_last_redirect');
                            localStorage.removeItem('google_auth_redirect_count');
                            return;
                        }
                        
                        // Update redirect tracking
                        localStorage.setItem('google_auth_last_redirect', now.toString());
                        localStorage.setItem('google_auth_redirect_count', (redirectCount + 1).toString());
                        
                        // Attempt to start the auth flow, but with a loop break parameter in case we're looping
                        try {
                            // Use our custom auth function instead of Redux
                            debugLog('Google Auth Callback - Provider=google detected, using custom auth function', { redirectCount: redirectCount + 1 }, 'GoogleAuthCallback');
                            message.info('Initiating Google authentication flow...');
                            
                            // Get the auth URL using our custom function
                            const authUrl = await initiateAuthFlow();
                            
                            if (authUrl && typeof authUrl === 'string') {
                                debugLog('Google Auth - Redirecting to custom-generated URL:', authUrl, 'GoogleAuthCallback');
                                
                                // Add a loopBreak parameter if we've already redirected once
                                if (redirectCount > 0) {
                                    const urlObj = new URL(authUrl);
                                    urlObj.searchParams.append('loopBreak', 'true');
                                    window.location.href = urlObj.toString();
                                } else {
                                    window.location.href = authUrl;
                                }
                            } else {
                                // Fallback to Redux approach if our custom function fails
                            const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Auth URL request timed out')), 5000));
                                
                            // Race between getting the URL and timeout
                            Promise.race([
                                dispatch(getGoogleAuth()).unwrap(),
                                timeoutPromise
                            ])
                                .then(url => {
                                if (url && typeof url === 'string') {
                                            debugLog('Google Auth - Redirecting to Redux-generated URL:', url, 'GoogleAuthCallback');
                                            
                                    // Add a loopBreak parameter if we've already redirected once
                                    if (redirectCount > 0) {
                                        const urlObj = new URL(url);
                                        urlObj.searchParams.append('loopBreak', 'true');
                                        window.location.href = urlObj.toString();
                                            } else {
                                        window.location.href = url;
                                    }
                                        } else {
                                    setStatus('error');
                                    setErrorMessage('Could not get authentication URL from server.');
                                    // Reset redirect tracking on error
                                    localStorage.removeItem('google_auth_last_redirect');
                                    localStorage.removeItem('google_auth_redirect_count');
                                }
                            })
                                    .catch(error => {
                                        debugLog('Google Auth - Error getting auth URL:', error, 'GoogleAuthCallback');
                                setStatus('error');
                                        setErrorMessage(`Failed to get authentication URL: ${error.message}`);
                                // Reset redirect tracking on error
                                localStorage.removeItem('google_auth_last_redirect');
                                localStorage.removeItem('google_auth_redirect_count');
                            });
                            }
                        } catch (error) {
                            debugLog('Google Auth Callback - Error initiating auth flow:', error, 'GoogleAuthCallback');
                            setStatus('error');
                            setErrorMessage(`Authentication error: ${error.message}`);
                            // Reset redirect tracking on error
                            localStorage.removeItem('google_auth_last_redirect');
                            localStorage.removeItem('google_auth_redirect_count');
                        }
                        return;
                    }
                    // If we reach here, we couldn't handle the request properly
                    setStatus('error');
                    setErrorMessage('Authentication failed. No authorization code received from Google. This may be due to a canceled authentication flow or a misconfigured OAuth application.');
                    return;
                }
                // We have a code, so reset the redirect tracking
                localStorage.removeItem('google_auth_last_redirect');
                localStorage.removeItem('google_auth_redirect_count');
                // Log success of finding code, but don't log the code itself for security
                debugLog('Google Auth Callback - Authorization code found, verifying connection...', { hasCode: true, hasState: !!state }, 'GoogleAuthCallback');
                // Verify the connection with backend
                message.loading('Verifying Google Drive connection...', 1);
                const connectionResult = await dispatch(checkGoogleConnection()).unwrap();
                debugLog('Google Auth Callback - Connection result:', connectionResult, 'GoogleAuthCallback');
                if (!connectionResult || !connectionResult.connected) {
                    debugLog('Google Auth Callback - Connection check failed:', connectionResult, 'GoogleAuthCallback');
                    setStatus('error');
                    setErrorMessage('Failed to verify Google Drive connection. Please try again.');
                    return;
                }
                // Authentication successful
                debugLog('Google Auth Callback - Authentication successful', null, 'GoogleAuthCallback');
                setStatus('success');
                // Show a success message
                message.success('Google Drive connected successfully!');
                // After a short delay, redirect to the saved contact page or contacts page
                setTimeout(() => {
                    // Check for saved contactId to return to - try both localStorage and sessionStorage
                    let returnToContactId = localStorage.getItem('returnToContactId');
                    // If not in localStorage, try sessionStorage
                    if (!returnToContactId || returnToContactId.trim() === '') {
                        returnToContactId = sessionStorage.getItem('returnToContactId');
                        if (returnToContactId) {
                            debugLog('Google Auth Callback - Found contact ID in sessionStorage:', returnToContactId, 'GoogleAuthCallback');
                        }
                    }
                    else {
                        debugLog('Google Auth Callback - Found contact ID in localStorage:', returnToContactId, 'GoogleAuthCallback');
                    }
                    if (returnToContactId && returnToContactId.trim() !== '') {
                        // If we have a contact ID, navigate back to the contact page
                        navigate(`/contact/${returnToContactId}`);
                        // Clear the stored IDs after use
                        localStorage.removeItem('returnToContactId');
                        sessionStorage.removeItem('returnToContactId');
                        localStorage.removeItem('auth_initiation_time');
                        sessionStorage.removeItem('auth_initiation_time');
                    }
                    else {
                        // Otherwise go to the general contacts page as fallback
                        navigate('/contacts');
                    }
                }, 2000);
            }
            catch (error) {
                debugLog('Google Auth Callback - Error processing callback:', error, 'GoogleAuthCallback');
                setStatus('error');
                setErrorMessage('Failed to complete Google authentication. Please try again.');
            }
        };
        processCallback();
    }, [dispatch, navigate, location]);
    if (status === 'loading') {
        return (_jsx("div", { className: "auth-callback-container", children: _jsx(Spin, { size: "large", tip: "Processing Google authentication..." }) }));
    }
    if (status === 'error') {
        // Generate a more specific error message based on the error
        let errorTitle = "Authentication Failed";
        let errorActions = [];
        // Add standard retry button
        errorActions.push(_jsx(Button, { type: "primary", onClick: handleRetry, children: "Retry Authentication" }, "retry"));
        // Add back button
        errorActions.push(_jsx(Button, { className: "auth-back-button", onClick: () => {
                // Reset any tracking variables that could cause issues
                localStorage.removeItem('google_auth_last_redirect');
                localStorage.removeItem('google_auth_redirect_count');
                // Check for saved contactId in both localStorage and sessionStorage
                let returnToContactId = localStorage.getItem('returnToContactId');
                // If not in localStorage, try sessionStorage
                if (!returnToContactId || returnToContactId.trim() === '') {
                    returnToContactId = sessionStorage.getItem('returnToContactId');
                }
                // Clean up all storage items
                localStorage.removeItem('returnToContactId');
                sessionStorage.removeItem('returnToContactId');
                localStorage.removeItem('auth_initiation_time');
                sessionStorage.removeItem('auth_initiation_time');
                if (returnToContactId && returnToContactId.trim() !== '') {
                    navigate(`/contact/${returnToContactId}`);
                }
                else {
                    navigate('/contacts');
                }
            }, children: "Go Back" }, "back"));
        // Add configuration help button
        errorActions.push(_jsx(Button, { type: "link", onClick: () => {
                // Clear localStorage items that might be causing loops
                localStorage.removeItem('google_auth_last_redirect');
                localStorage.removeItem('google_auth_redirect_count');
                // Build the correct redirect URI
                const backendUrl = getEnvVariable('REACT_APP_API_URL', 'http://13.235.48.242:8000');
                const correctRedirectUri = `${backendUrl}/api/v1/document/auth/google/callback`;
                // Show instructions to the user
                message.info('Important OAuth configuration instructions provided');
                // We'll open a detailed alert with clear configuration instructions
                setTimeout(() => {
                    alert("🚨 GOOGLE OAUTH CONFIGURATION ISSUE 🚨\n\n" +
                        "The authentication loop is happening because Google is sending the authorization response to the wrong URL.\n\n" +
                        "STEP-BY-STEP FIX:\n\n" +
                        "1. Go to your Google Cloud Console: https://console.cloud.google.com\n" +
                        "2. Navigate to: APIs & Services > Credentials\n" +
                        "3. Find your OAuth 2.0 Client ID used for this app\n" +
                        "4. Edit the client ID and update the Authorized redirect URIs\n" +
                        "5. THE CORRECT REDIRECT URI IS:\n" +
                        `   ${correctRedirectUri}\n\n` +
                        "6. DO NOT use your frontend URL as the redirect URI\n" +
                        "7. Click SAVE and wait a few minutes for changes to propagate\n" +
                        "8. Clear your browser cookies for this site\n" +
                        "9. Try the authentication again\n\n" +
                        "NOTE: Changes in Google Cloud Console can take a few minutes to become effective.\n\n" +
                        "VERIFICATION: Your backend API should be configured to receive the OAuth callback at:\n" +
                        `${correctRedirectUri}`);
                }, 500);
            }, children: "Configuration Help" }, "help"));
        // Add a direct link to Google API Console
        errorActions.push(_jsx(Button, { type: "default", onClick: () => {
                window.open('https://console.cloud.google.com/apis/credentials', '_blank');
            }, children: "Open Google Console" }, "google-console"));
        // Customize error details based on error message pattern
        if (errorMessage.includes('loop detected') || errorMessage.includes('AUTHENTICATION LOOP DETECTED')) {
            errorTitle = "Authentication Loop Detected";
            // Get OAuth configuration details for help
            const backendUrl = getEnvVariable('REACT_APP_API_URL', 'http://13.235.48.242:8000');
            const correctRedirectUri = `${backendUrl}/api/v1/document/auth/google/callback`;
            // Add a manual setup guide button
            errorActions.push(_jsx(Button, { type: "primary", style: { backgroundColor: '#1677ff', borderColor: '#1677ff' }, onClick: () => {
                    // Clear all loop tracking
                    localStorage.removeItem('google_auth_last_redirect');
                    localStorage.removeItem('google_auth_redirect_count');
                    // Show a detailed guide
                    message.info('Manual OAuth configuration guide displayed');
                    // Show setup instructions with clickable links
                    setTimeout(() => {
                        const setupGuideElement = document.createElement('div');
                        setupGuideElement.innerHTML = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                  <h2 style="color: #d32f2f; margin-top: 0;">Manual Google OAuth Setup</h2>
                  
                  <p style="font-weight: bold;">Your Google OAuth configuration needs to be updated:</p>
                  
                  <ol style="line-height: 1.6;">
                    <li>Go to <a href="https://console.cloud.google.com/apis/credentials" target="_blank">Google Cloud Console Credentials</a></li>
                    <li>Select your OAuth 2.0 Client ID</li>
                    <li>In the "Authorized redirect URIs" section, add:</li>
                    <div style="background: #e9f5ff; padding: 10px; border-radius: 4px; font-family: monospace; margin: 10px 0;">
                      ${correctRedirectUri}
                    </div>
                    <li>Click "Save" and wait a few minutes for changes to take effect</li>
                    <li><a href="/contacts" style="color: #1677ff;">Return to contacts page</a> and try again</li>
                  </ol>
                  
                  <p style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #ddd;">
                    <strong>Common issues:</strong>
                  </p>
                  <ul style="line-height: 1.5;">
                    <li>Ensure your backend API is running at: ${backendUrl}</li>
                    <li>Check that your API has the endpoint: <code>/api/v1/document/auth/google/callback</code></li>
                    <li>Verify you're using the correct OAuth client ID in both frontend and backend</li>
                  </ul>
                </div>
              `;
                        // Create a modal-like container
                        const modalContainer = document.createElement('div');
                        modalContainer.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 9999;';
                        // Add close functionality
                        modalContainer.onclick = (e) => {
                            if (e.target === modalContainer) {
                                document.body.removeChild(modalContainer);
                            }
                        };
                        // Add close button
                        const closeButton = document.createElement('button');
                        closeButton.innerText = '×';
                        closeButton.style.cssText = 'position: absolute; top: 10px; right: 15px; background: none; border: none; font-size: 24px; cursor: pointer; color: #666;';
                        closeButton.onclick = () => document.body.removeChild(modalContainer);
                        const guideDiv = setupGuideElement.querySelector('div');
                        if (guideDiv) {
                            guideDiv.appendChild(closeButton);
                        }
                        // Show the modal
                        modalContainer.appendChild(setupGuideElement);
                        document.body.appendChild(modalContainer);
                    }, 100);
                }, children: "Show Setup Guide" }, "manual-setup"));
            // Add an emergency reset button
            errorActions.push(_jsx(Button, { danger: true, onClick: () => {
                    // Clear all authentication-related storage
                    localStorage.clear();
                    sessionStorage.clear();
                    try {
                        // Attempt to clear cookies for this domain
                        document.cookie.split(';').forEach(cookie => {
                            const trimmedCookie = cookie.trim();
                            const cookieName = trimmedCookie.split('=')[0];
                            document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
                        });
                    }
                    catch (e) {
                        console.error('Error clearing cookies:', e);
                    }
                    // Show success message
                    message.success('Authentication cache cleared. Redirecting...');
                    // Redirect to contacts page after a short delay
                    setTimeout(() => {
                        window.location.href = '/contacts';
                    }, 1500);
                }, children: "Emergency Reset" }, "emergency-reset"));
        }
        else if (errorMessage.includes('No authorization code')) {
            errorTitle = "Missing Authorization Code";
        }
        else if (errorMessage.includes('verify Google Drive connection')) {
            errorTitle = "Connection Verification Failed";
            // Add special button for connection issues
            errorActions.push(_jsx(Button, { type: "dashed", onClick: () => {
                    const supportEmail = "support@yourcompany.com";
                    window.location.href = `mailto:${supportEmail}?subject=Google Drive Connection Issue&body=I'm having trouble connecting to Google Drive. Error: ${encodeURIComponent(errorMessage)}`;
                }, children: "Contact Support" }, "contact-support"));
        }
        return (_jsx(Result, { status: "error", title: errorTitle, subTitle: errorMessage || "There was a problem connecting to Google Drive. Please try again.", extra: errorActions, children: getEnvironmentMode() !== 'production' && debugInfo && (_jsx("div", { style: { marginTop: '20px', textAlign: 'left', maxWidth: '600px', margin: '0 auto' }, children: _jsxs("details", { children: [_jsx("summary", { style: { cursor: 'pointer', fontWeight: 'bold' }, children: "Technical Details" }), _jsx("pre", { style: {
                                backgroundColor: '#f8f8f8',
                                padding: '10px',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                overflow: 'auto',
                                fontSize: '12px'
                            }, children: JSON.stringify(debugInfo, null, 2) })] }) })) }));
    }
    return (_jsx(Result, { status: "success", title: "Google Drive Connected Successfully", subTitle: "You can now upload and manage documents through Google Drive. You will be redirected to the contacts page." }));
};
export default GoogleAuthCallback;
