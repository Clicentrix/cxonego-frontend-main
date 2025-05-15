import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Button, Typography, Card, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { getGoogleReconnectUrl } from '../../services/documentService';
import { debugLog } from '../../utils/debugLog';
const { Title, Text, Paragraph } = Typography;
const GoogleDriveReconnect = ({ contactId }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [errorDetails, setErrorDetails] = useState(null);
    const [apiResponse, setApiResponse] = useState(null);
    const [debugMode, setDebugMode] = useState(false);
    // Toggle debug information display
    const toggleDebugMode = () => {
        setDebugMode(!debugMode);
    };
    const handleReconnect = async () => {
        setLoading(true);
        setErrorDetails(null);
        try {
            debugLog('[Google Reconnect] Initiating reconnect process', { contactId: contactId || 'none' }, 'GoogleDriveReconnect');
            const response = await getGoogleReconnectUrl(contactId);
            setApiResponse(response); // Store for debugging
            if (typeof response === 'string' && (response.startsWith('http') || response.startsWith('/'))) {
                // Valid URL response
                debugLog('[Google Reconnect] Received valid redirect URL', { url: response.substring(0, 50) + '...' }, 'GoogleDriveReconnect');
                // Redirect to the given URL
                window.location.href = response;
                return;
            }
            else if (response && typeof response === 'object') {
                // Handle object response
                if (response.url && (response.url.startsWith('http') || response.url.startsWith('/'))) {
                    debugLog('[Google Reconnect] Extracted URL from response object', { url: response.url.substring(0, 50) + '...' }, 'GoogleDriveReconnect');
                    // Redirect to the extracted URL
                    window.location.href = response.url;
                    return;
                }
                else if (response.error) {
                    // Handle error in response object
                    const errorMsg = response.error || 'Failed to get reconnect URL';
                    // Special handling for specific error types
                    if (response.status === 404 || (response.error && response.error.includes('not found'))) {
                        const configError = 'Google Drive reconnect endpoint not available. This is likely a backend configuration issue.';
                        message.error(configError);
                        setErrorDetails(`${configError} The backend endpoint for Google Drive authorization is missing.`);
                    }
                    else {
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
        }
        catch (error) {
            console.error('Error getting Google reconnect URL:', error);
            // Determine if this is a configuration issue
            const errorMsg = error instanceof Error ? error.message : 'Unknown error';
            setApiResponse({ error: errorMsg });
            if (errorMsg.includes('404') || errorMsg.includes('not found')) {
                const configError = 'Google Drive reconnect endpoint not found. This appears to be a backend configuration issue.';
                message.error(configError);
                setErrorDetails(`${configError} The API endpoint for Google Drive authorization could not be reached.`);
                // Log detailed information about the error
                debugLog('[Google Reconnect] Backend endpoint not found', { error: errorMsg, apiUrl: process.env.REACT_APP_API_URL || 'not set' }, 'GoogleDriveReconnect');
            }
            else {
                message.error('Failed to get Google Drive reconnect URL');
                setErrorDetails(`Error: ${errorMsg}`);
                debugLog('[Google Reconnect] Error getting reconnect URL', error, 'GoogleDriveReconnect');
            }
        }
        finally {
            setLoading(false);
        }
    };
    const goBack = () => {
        navigate(-1);
    };
    return (_jsx("div", { style: { padding: '20px', maxWidth: '800px', margin: '0 auto' }, children: _jsxs(Card, { bordered: false, style: { marginBottom: '20px' }, children: [_jsx(Title, { level: 3, children: "Google Drive Connection Required" }), _jsx(Paragraph, { children: "To access your documents in Google Drive, you need to connect your account. This allows secure access to your files without storing them on our servers." }), errorDetails && (_jsxs("div", { style: { marginBottom: '20px', padding: '12px', backgroundColor: '#fff2f0', borderRadius: '4px', border: '1px solid #ffccc7' }, children: [_jsx(Text, { type: "danger", strong: true, children: "Connection Error" }), _jsx(Paragraph, { type: "danger", style: { marginBottom: 0 }, children: errorDetails }), errorDetails.includes('backend configuration') && (_jsxs(Paragraph, { type: "secondary", style: { fontSize: '13px', marginTop: '8px' }, children: ["This appears to be a server-side configuration issue. Please contact support or ensure the backend API is running correctly at ", process.env.REACT_APP_API_URL || 'http://localhost:8000', "."] }))] })), _jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', marginTop: '20px' }, children: [_jsx(Button, { onClick: goBack, children: "Go Back" }), _jsx(Button, { type: "primary", onClick: handleReconnect, loading: loading, children: "Connect to Google Drive" })] }), _jsxs("div", { style: { marginTop: '30px' }, children: [_jsx(Button, { type: "link", size: "small", onClick: toggleDebugMode, style: { padding: 0 }, children: debugMode ? 'Hide Debug Info' : 'Show Debug Info' }), debugMode && apiResponse && (_jsxs("div", { style: { marginTop: '10px', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '4px', overflow: 'auto' }, children: [_jsx(Text, { strong: true, children: "Debug Information" }), _jsxs("pre", { style: { fontSize: '12px' }, children: ["API Response: ", JSON.stringify(apiResponse, null, 2), _jsx("br", {}), "API URL: ", process.env.REACT_APP_API_URL || 'not set', _jsx("br", {}), "Contact ID: ", contactId || 'none', _jsx("br", {}), "User ID: ", localStorage.getItem('userId') || 'not found in localStorage'] })] }))] })] }) }));
};
export default GoogleDriveReconnect;
