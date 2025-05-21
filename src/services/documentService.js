import axios from "axios";
import debugLog, { debugApiResponse } from "../utils/debugLog";
// Add a debug flag to enable/disable detailed logging
const DEBUG = true;
// Add mock data for testing/fallback
const mockDocuments = [
    {
        documentId: "mock-doc-1",
        fileName: "Sample Document 1.pdf",
        description: "This is a sample document for testing",
        googleDriveLink: "#",
        googleDriveFileId: "mock-id-1",
        contactId: "mock-contact-id",
        uploadedBy: {
            userId: "mock-user-id",
            firstName: "John",
            lastName: "Doe",
            email: "john@example.com"
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        fileType: "pdf",
        fileSize: 1024 * 1024,
        deletedAt: null,
        modifiedBy: null,
        id: "mock-doc-1" // Add id property for DataGrid compatibility
    },
    {
        documentId: "mock-doc-2",
        fileName: "Sample Document 2.docx",
        description: "Another sample document for testing",
        googleDriveLink: "#",
        googleDriveFileId: "mock-id-2",
        contactId: "mock-contact-id",
        uploadedBy: {
            userId: "mock-user-id",
            firstName: "Jane",
            lastName: "Smith",
            email: "jane@example.com"
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        fileType: "docx",
        fileSize: 512 * 1024,
        deletedAt: null,
        modifiedBy: null,
        id: "mock-doc-2" // Add id property for DataGrid compatibility
    }
];
// Add type definitions as JSDoc comments for JavaScript
/**
 * @typedef {Object} UploadDocumentPayload
 * @property {File} file - The document file to upload
 * @property {string} description - Document description
 * @property {string} [contactId] - Contact ID to attach document to
 * @property {string} [accountId] - Account ID to attach document to
 * @property {string} [startTime] - Start date for document validity
 * @property {string} [endTime] - End date for document validity
 * @property {string} [documentType] - Type of document (NDA, MSA, SOW, etc.)
 * @property {string} [customDocumentType] - Custom document type if documentType is OTHER
 * @property {string} [endpoint] - Endpoint type ('contact' or 'account')
 */
// Update the BASE_URL declaration with more logging and better fallbacks
const PREFERRED_BASE_URL = import.meta.env.VITE_REACT_APP_BASE_URL;
const FALLBACK_BASE_URL = 'http://localhost:8000/api/v1';

// Determine the actual BASE_URL to use
let BASE_URL = PREFERRED_BASE_URL;

if (!BASE_URL) {
    console.error('ERROR: VITE_REACT_APP_BASE_URL is not defined in environment variables!');
    console.warn(`Falling back to default API URL: ${FALLBACK_BASE_URL}`);
    BASE_URL = FALLBACK_BASE_URL;
}

// Remove any trailing slash to ensure consistent URL formation
if (BASE_URL.endsWith('/')) {
    BASE_URL = BASE_URL.slice(0, -1);
    console.log(`Removed trailing slash from BASE_URL, now: ${BASE_URL}`);
}

// Log environment information for debugging
console.log('=== Document Service Environment ===');
console.log('API Base URL:', BASE_URL);
console.log('Environment:', import.meta.env.VITE_ENVIRONMENT || 'not specified');
console.log('Google Callback URLs:', {
    frontend: import.meta.env.VITE_GOOGLE_AUTH_CALLBACK_URL,
    backend: import.meta.env.VITE_GOOGLE_BACKEND_CALLBACK
});
console.log('===================================');
const accessToken = localStorage.getItem("accessToken");
// Debug logger function - replaced with the shared utility
const debugLog2 = (message, data) => {
    if (DEBUG) {
        debugLog(`[DocumentService] ${message}`, data, 'DocumentService');
    }
};
/**
 * Validates if the string is a valid access token
 * @param str The string to validate
 * @returns True if the string is a valid access token
 */
function isAccessToken(str) {
    debugLog2(`Access token check: ${str ? 'Has token' : 'No token'}`);
    return typeof str === "string" && str !== null;
}
/**
 * Helper function to correctly join API paths and prevent double slashes
 * @param {string} basePath - The base URL
 * @param {string} path - The path to append
 * @returns {string} - The correctly joined URL
 */
const joinApiPaths = (basePath, path) => {
    if (!basePath) return path;
    if (!path) return basePath;
    
    // Remove trailing slash from base if present
    const baseNormalized = basePath.endsWith('/') ? basePath.slice(0, -1) : basePath;
    
    // Remove leading slash from path if present
    const pathNormalized = path.startsWith('/') ? path.slice(1) : path;
    
    return `${baseNormalized}/${pathNormalized}`;
};
/**
 * Gets the url for connecting to Google Drive
 * Endpoint: GET /api/v1/document/auth/google
 * @param returnToContactId Optional contact ID to return to after authentication
 * @returns Object with url
 */
export const getGoogleAuthUrl = async (returnToContactId) => {
    try {
        const userId = localStorage.getItem("userId");
        const accessToken = localStorage.getItem("accessToken");
        if (!userId) {
            debugLog2('getGoogleAuthUrl - No userId found in localStorage', null);
            return { error: "User ID not found", errorCode: "NO_USER_ID" };
        }
        if (!isAccessToken(accessToken)) {
            debugLog2('getGoogleAuthUrl - Invalid or missing access token', { hasToken: !!accessToken });
            return { error: "Invalid access token", errorCode: "INVALID_TOKEN" };
        }
        // Set up the query parameters
        const params = new URLSearchParams();
        if (returnToContactId) {
            params.append('returnToContactId', returnToContactId);
        }
        params.append('userId', userId);
        // Construct the API endpoint using BASE_URL
        const endpoint = joinApiPaths(BASE_URL, 'document/auth/google');
        // Log the request
        debugLog2('getGoogleAuthUrl - Making request to:', { endpoint, params: Object.fromEntries(params.entries()) });
        const response = await axios.get(`${endpoint}?${params.toString()}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        // Log the response
        debugLog2('getGoogleAuthUrl - Response received:', response.data);
        // For debugging - log the actual response data
        if (typeof response.data === 'object' && response.data.data) {
            debugLog2('Response data:', response.data.data);
        }
        // Handle different response formats:
        // 1. Direct URL string
        if (typeof response.data === 'string') {
            return response.data;
        }
        // 2. Object with URL property
        if (response.data && typeof response.data === 'object') {
            // Check for common URL properties
            const url = response.data.url || response.data.authUrl || response.data.redirectUrl;
            if (url && typeof url === 'string') {
                return url;
            }
            // Check for data property containing the URL (common API pattern)
            if (response.data.data) {
                // If data property is a string, it might be the URL directly
                if (typeof response.data.data === 'string') {
                    return response.data.data;
                }
                // If data is an object, look for URL properties
                if (typeof response.data.data === 'object') {
                    const dataUrl = response.data.data.url ||
                        response.data.data.authUrl ||
                        response.data.data.redirectUrl;
                    if (dataUrl && typeof dataUrl === 'string') {
                        return dataUrl;
                    }
                }
            }
        }
        // If we get here, we have an unexpected response format, but we'll try to be lenient
        debugLog2('getGoogleAuthUrl - Unexpected response format:', response.data);
        // As a last resort, return the entire response so the component can try to handle it
        return response.data;
    }
    catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            // Handle specific status codes
            if (error.response.status === 404) {
                debugLog2('getGoogleAuthUrl - Endpoint not found (404)', { url: error.config?.url, message: error.message });
                throw new Error('Google authentication endpoint not found. Please check API configuration.');
            }
            // Handle other API errors with response data
            debugLog2('getGoogleAuthUrl - API error response:', { status: error.response.status, data: error.response.data });
            throw new Error(error.response.data?.message || 'Failed to get Google authentication URL');
        }
        // Handle network or other errors
        debugLog2('getGoogleAuthUrl - Error:', {
            message: error instanceof Error ? error.message : 'Unknown error'
        });
        throw error;
    }
};
/**
 * Checks if the user is connected to Google Drive
 * Endpoint: GET /api/v1/document/auth/google/connection
 * @returns Object with connected status
 */
export const checkGoogleDriveConnection = async () => {
    debugLog2('Checking Google Drive Connection');
    try {
        // Get the current user ID from localStorage
        const userId = localStorage.getItem("userId");
        // Make sure the user ID is available
        if (!userId) {
            debugLog2('User ID not found when checking Google Drive connection');
            return { connected: false, message: 'User not authenticated' };
        }
        // Ensure we have a valid access token
        if (!isAccessToken(accessToken)) {
            debugLog2('Invalid or missing access token when checking Google Drive connection');
            return { connected: false, message: 'Missing or invalid access token' };
        }
        debugLog2('Preparing config for Google Drive connection check', {
            userId,
            hasToken: !!accessToken
        });
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            // Pass the userId as a query parameter to ensure backend gets it
            params: {
                userId: userId
            }
        };
        // Construct full endpoint URL for improved debugging
        const fullUrl = joinApiPaths(BASE_URL, 'document/auth/google/connection');
        debugLog2('GET request to check Google Drive connection', {
            url: fullUrl,
            config: { params: config.params }
        });
        const response = await axios.get(fullUrl, config);
        debugLog2('Google Drive Connection Response:', response.data);
        // Handle different response formats
        if (response.data && typeof response.data === 'object') {
            // If it's an object with 'connected' property
            if ('connected' in response.data) {
                return response.data;
            }
            // If it's an object with 'data' property that has 'connected'
            else if (response.data.data && 'connected' in response.data.data) {
                return {
                    connected: response.data.data.connected,
                    message: response.data.message || '',
                    data: response.data.data
                };
            }
        }
        // Default response if we can't find a clear connected status
        debugLog2('Invalid response format from Google Drive connection check', response.data);
        return { connected: false, message: 'Invalid response format', rawResponse: response.data };
    }
    catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("ERROR in checkGoogleDriveConnection:", error);
            debugLog2('Axios Error in checkGoogleDriveConnection:', {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message
            });
            // Provide specific error messages for common issues
            if (error.response?.status === 401) {
                return {
                    connected: false,
                    message: 'Authentication failed. Please log in again.',
                    error: error.message,
                    status: error.response?.status
                };
            }
            else if (error.response?.status === 403) {
                return {
                    connected: false,
                    message: 'You do not have permission to check Google Drive connection.',
                    error: error.message,
                    status: error.response?.status
                };
            }
            else if (error.response?.status === 404) {
                // For 404 errors, provide detailed context for troubleshooting
                const fullUrl = joinApiPaths(BASE_URL, 'document/auth/google/connection');
                debugLog2('URL not found (404) during connection check:', {
                    url: fullUrl,
                    userId: localStorage.getItem("userId")
                });
                return {
                    connected: false,
                    message: 'API endpoint for Google Drive connection check not found.',
                    detailedMessage: `The backend endpoint (${fullUrl}) does not exist. This is typically a server configuration issue. Please ensure your backend has implemented this endpoint.`,
                    error: error.message,
                    status: error.response?.status,
                    endpoint: fullUrl
                };
            }
            // Return more specific error information
            return {
                connected: false,
                message: error.response?.data?.message || error.message,
                error: error.message,
                status: error.response?.status,
                details: error.response?.data || {}
            };
        }
        console.error("ERROR in checkGoogleDriveConnection:", error);
        debugLog2('Unknown Error in checkGoogleDriveConnection:', error);
        return {
            connected: false,
            message: error instanceof Error ? error.message : 'Unknown error',
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
};
/**
 * Uploads a document for a contact or account
 * Endpoint: POST /api/v1/document/upload/:contactId or POST /api/v1/document/account/:accountId
 * @param {UploadDocumentPayload} payload - The upload document payload including file, description, and IDs
 * @returns The uploaded document
 */
export const uploadDocument = async (payload) => {
    debugLog2('[uploadDocument Service] Starting upload process', {
        fileName: payload.file.name,
        contactId: payload.contactId,
        accountId: payload.accountId,
        endpoint: payload.endpoint,
        documentType: payload.documentType
    });
    
    // Define endpointPath outside the try block to ensure it's accessible in the catch block
    let endpointPath = '';
    let documentType = '';
    let customDocumentType = '';
    
    try {
        // Step 1: Validate user authentication
        const userId = localStorage.getItem("userId");
        if (!userId) {
            debugLog2('[uploadDocument Service] Failed: User ID not found');
            throw new Error('User not authenticated. Please log in first.');
        }
        debugLog2('[uploadDocument Service] Passed: User ID found', { userId });
        
        // Step 2: Validate access token
        const currentAccessToken = localStorage.getItem("accessToken"); // Fetch current token
        if (!isAccessToken(currentAccessToken)) {
            debugLog2('[uploadDocument Service] Failed: Invalid or missing access token', { hasToken: !!currentAccessToken });
            throw new Error('Authentication token is missing or invalid. Please log in again.');
        }
        debugLog2('[uploadDocument Service] Passed: Access token valid');
        
        // Step 3: Verify Google Drive connection
        debugLog2('[uploadDocument Service] Checking Google Drive connection before upload');
        const connectionStatus = await checkGoogleDriveConnection();
        if (!connectionStatus.connected) {
            debugLog2('[uploadDocument Service] Failed: Google Drive not connected', connectionStatus);
            // Construct a more informative error message
            const connectErrorMsg = connectionStatus.message
                ? `Google Drive is not connected: ${connectionStatus.message}. Please connect/reconnect.`
                : 'Google Drive is not connected. Please connect to Google Drive first.';
            throw new Error(connectErrorMsg);
        }
        debugLog2('[uploadDocument Service] Passed: Google Drive connected');
        
        // Step 4: Determine the API endpoint based on whether contactId or accountId is provided
        if (payload.endpoint === 'account' && payload.accountId) {
            endpointPath = `/document/account/${payload.accountId}`;
        } else if (payload.contactId) {
            endpointPath = `/document/upload/${payload.contactId}`;
        } else {
            throw new Error('Either contactId or accountId must be provided');
        }
        
        // Step 5: Prepare FormData and Config
        const config = {
            headers: {
                Authorization: `Bearer ${currentAccessToken}`,
                "Content-Type": "multipart/form-data",
            },
        };
        
        const { file, description, startTime, endTime } = payload;
        documentType = payload.documentType || '';
        customDocumentType = payload.customDocumentType || '';
        
        const formData = new FormData();
        formData.append("file", file);
        formData.append("description", description);
        formData.append("userId", userId); // Ensure userId is included in the form data
        
        // Add new fields if provided
        if (startTime) {
            formData.append("startTime", startTime);
        }
        if (endTime) {
            formData.append("endTime", endTime);
        }
        if (documentType) {
            formData.append("documentType", documentType);
            // Only add customDocumentType if documentType is 'OTHER'
            if (documentType === 'OTHER' && customDocumentType) {
                formData.append("customDocumentType", customDocumentType);
            }
        }
        
        debugLog2('[uploadDocument Service] FormData prepared', {
            description,
            contactId: payload.contactId,
            accountId: payload.accountId,
            endpoint: payload.endpoint,
            userId,
            hasStartTime: !!startTime,
            hasEndTime: !!endTime,
            documentType,
            hasCustomType: !!customDocumentType
        });
        
        // Step 6: Make the API call
        const uploadUrl = joinApiPaths(BASE_URL, endpointPath);

        // More detailed URL debugging
        console.log('==== DOCUMENT UPLOAD DEBUG ====');
        console.log('Upload URL:', uploadUrl);
        console.log('Upload endpoint path:', endpointPath);
        console.log('BASE_URL used:', BASE_URL);
        console.log('File details:', {
            name: file.name,
            size: file.size,
            type: file.type
        });
        console.log('Document type:', documentType);
        console.log('Request method:', 'POST');
        console.log('============================');

        debugLog2('[uploadDocument Service] Making POST request to upload document', {
            url: uploadUrl,
            fileSize: file.size,
            hasUserId: !!userId
        });

        // First try to check if the endpoint is reachable
        try {
            // Make a quick HEAD request to check endpoint availability
            await axios.head(uploadUrl, {
                headers: { Authorization: `Bearer ${currentAccessToken}` },
                timeout: 5000 // 5 second timeout
            });
            console.log(`✅ Endpoint verification successful: ${uploadUrl} is available`);
        } catch (headError) {
            console.warn(`⚠️ Endpoint verification failed: ${uploadUrl} may not be available`, {
                status: headError.response?.status,
                statusText: headError.response?.statusText
            });
            // Continue with the actual request even if head check fails
        }

        const response = await axios.post(uploadUrl, formData, config);
        
        // Step 7: Log success
        debugLog2('[uploadDocument Service] Upload successful, API response received', {
            fileName: file.name,
            responseData: response.data
        });
        
        // Process the response to ensure consistent format
        let processedResponse;
        if (response.data?.data) {
            // If the response is wrapped in a data field
            processedResponse = response.data.data;
        } else if (typeof response.data === 'object' && response.data !== null) {
            // Direct object response
            processedResponse = response.data;
        } else {
            // Fallback to a minimal document object
            processedResponse = {
                fileName: file.name,
                description,
                uploadedAt: new Date().toISOString(),
                id: `temp-${Math.random().toString(36).substring(2, 11)}`
            };
        }

        // Ensure the document has an id for DataGrid
        if (!processedResponse.id && processedResponse.documentId) {
            processedResponse.id = processedResponse.documentId;
        } else if (!processedResponse.id) {
            processedResponse.id = `doc-${Math.random().toString(36).substring(2, 11)}`;
        }

        return processedResponse;
    } catch (error) {
        // Step 8: Log detailed error
        debugLog2("[uploadDocument Service] Error during upload process:", error);
        
        if (error instanceof Error) {
            localStorage.setItem('document_upload_error', error.message);
            localStorage.setItem('document_upload_error_time', new Date().toISOString());
        }
        
        if (axios.isAxiosError(error)) {
            const statusCode = error.response?.status;
            const responseData = error.response?.data;
            const errorMessage = responseData?.message || error.message;
            
            debugLog2(`[uploadDocument Service] Axios Error Details: Status ${statusCode}`, {
                response: responseData,
                headers: error.response?.headers,
                requestUrl: error.config?.url
            });
            
            // Re-throw a more specific error based on status code
            if (statusCode === 401)
                throw new Error('Authentication failed (401). Please log in again or reconnect Google Drive.');
            if (statusCode === 403)
                throw new Error('Permission denied (403). Check Google Drive permissions or reconnect.');
            if (statusCode === 413)
                throw new Error('File too large (413). Maximum size is 5MB.');
            if (statusCode === 400)
                throw new Error(`Upload failed (400): ${errorMessage}. Check connection or file.`);
            if (statusCode === 404) {
                console.error('==== 404 ERROR DIAGNOSTIC INFO ====');
                console.error('Endpoint not found:', error.config?.url);
                console.error('BASE_URL being used:', BASE_URL);
                console.error('Upload endpoint path:', endpointPath);
                console.error('Document types provided:', { documentType, customDocumentType });
                console.error('Contact/Account ID:', payload.contactId || payload.accountId);
                console.error('Response data:', error.response?.data);
                console.error('================================');
                
                // Get the hostname part of the URL for troubleshooting
                let hostname = 'unknown';
                try {
                    hostname = new URL(error.config?.url).hostname;
                } catch(e) {}
                
                throw new Error(`Upload endpoint not found (404): ${error.config?.url}. 
                This could be due to:
                1. The API server at ${hostname} is not running
                2. The endpoint does not exist on the server
                3. The path is incorrect (check for typos)
                4. CORS is blocking the request
                
                Please check that your backend server is running and has these endpoints configured.`);
            }
            
            // General Axios error
            throw new Error(`Document upload failed: ${errorMessage}`);
        }
        
        throw error;
    }
};
/**
 * Gets a list of documents for a specific contact
 * Endpoint: GET /api/v1/document/contact/:contactId
 * @param contactId The ID of the contact
 * @param params Pagination and search parameters
 * @returns List of documents and pagination information
 */
export const getContactDocuments = async (contactId, params) => {
    try {
        const userId = localStorage.getItem("userId");
        const accessToken = localStorage.getItem("accessToken");
        
        // Build the query string from params
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append('page', params.page.toString());
        if (params.limit) queryParams.append('limit', params.limit.toString());
        if (params.search) queryParams.append('search', params.search);
        
        // Ensure the contact ID is valid
        if (!contactId || contactId === 'undefined' || contactId === 'null') {
            console.error('Invalid contact ID provided:', contactId);
            return { 
                documents: [],
                pagination: { page: params.page || 1, limit: params.limit || 10, total: 0 } 
            };
        }
        
        // Construct the endpoint URL - try without the initial slash to match working account endpoint pattern
        const apiUrl = joinApiPaths(BASE_URL, `document/contact/${contactId}`) + `?${queryParams.toString()}`;
        
        // More detailed URL debugging
        console.log('==== GET CONTACT DOCUMENTS DEBUG ====');
        console.log('API URL:', apiUrl);
        console.log('Contact ID:', contactId);
        console.log('Params:', params);
        console.log('BASE_URL used:', BASE_URL);
        console.log('Authorization header present:', !!accessToken);
        console.log('Request method:', 'GET');
        console.log('==============================');
        
        // Try a direct axios request instead of axios.get to have more control
        const response = await axios({
            method: 'GET',
            url: apiUrl,
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            timeout: 10000 // 10 second timeout
        });
        
        // Use the new debug utility to analyze the structure
        debugApiResponse(`GET ${apiUrl}`, response, 'ContactDocuments');
        debugLog2('getContactDocuments raw response', response);
        debugLog2('getContactDocuments response.data', response.data);
        
        // Handle different response formats from the backend
        let transformedData;
        
        // IMPORTANT - log the exact data structure for debugging
        console.log('Contact Documents Response Structure:', {
            hasData: !!response.data,
            isObject: typeof response.data === 'object',
            isArray: Array.isArray(response.data),
            topLevelKeys: response.data && typeof response.data === 'object' ? Object.keys(response.data) : [],
            hasNestedData: response.data && response.data.data && typeof response.data.data === 'object',
            hasDocuments: response.data && response.data.documents && Array.isArray(response.data.documents),
            documentCount: response.data && response.data.documents && Array.isArray(response.data.documents) ? response.data.documents.length : 0
        });
        
        // If the response has a nested data.data structure (common in many APIs)
        if (response.data?.data?.data) {
            transformedData = {
                documents: Array.isArray(response.data.data.data) 
                    ? response.data.data.data.map(doc => ({
                    ...doc,
                        id: doc.documentId || doc.id || `doc-${Math.random()}`, // Ensure each doc has an id for DataGrid
                    fileName: doc.fileName || 'Unnamed Document',
                    description: doc.description || '',
                    fileType: doc.fileType || 'unknown',
                    fileSize: doc.fileSize || 0,
                    uploadedBy: doc.uploadedBy || { firstName: 'Unknown', lastName: 'User' },
                    createdAt: doc.createdAt || new Date().toISOString()
                    }))
                    : [],
                pagination: {
                    page: response.data.data.page || params.page || 1,
                    limit: response.data.data.limit || params.limit || 10,
                    total: response.data.data.total || 0
                }
            };
        } 
        // If the response has a direct documents array
        else if (response.data?.documents) {
            transformedData = {
                documents: Array.isArray(response.data.documents)
                    ? response.data.documents.map(doc => ({
                        ...doc,
                        id: doc.documentId || doc.id || `doc-${Math.random()}`,
                    }))
                    : [],
                pagination: response.data.pagination || {
                    page: params.page || 1,
                    limit: params.limit || 10,
                    total: response.data.documents?.length || 0
                }
            };
        }
        // If response.data is the documents array itself
        else if (Array.isArray(response.data)) {
            transformedData = {
                documents: response.data.map(doc => ({
                    ...doc,
                    id: doc.documentId || doc.id || `doc-${Math.random()}`,
                })),
                pagination: {
                    page: params.page || 1,
                    limit: params.limit || 10,
                    total: response.data.length
                }
            };
        }
        // NEW: If response.data.data is the documents array (common format)
        else if (Array.isArray(response.data?.data)) {
            transformedData = {
                documents: response.data.data.map(doc => ({
                    ...doc,
                    id: doc.documentId || doc.id || `doc-${Math.random()}`,
                })),
                pagination: {
                    page: params.page || 1,
                    limit: params.limit || 10,
                    total: response.data.data.length
                }
            };
        }
        // Fallback to default format
        else {
            transformedData = {
                documents: [],
                pagination: {
                    page: params.page || 1,
                    limit: params.limit || 10,
                    total: 0
                }
            };
        }
        
        debugLog2('Transformed contact document data', transformedData);
        return transformedData;
    } catch (error) {
        // Handle API errors
        if (axios.isAxiosError(error) && error.response) {
            debugLog2('getContactDocuments API error', {
                status: error.response.status,
                data: error.response.data
            });
            
            // For 404 errors, provide more diagnostic information
            if (error.response.status === 404) {
                console.error('==== 404 ERROR DIAGNOSTIC INFO (getContactDocuments) ====');
                console.error('Endpoint not found:', error.config?.url);
                console.error('BASE_URL being used:', BASE_URL);
                console.error('Contact ID:', contactId);
                console.error('Params:', params);
                console.error('Response data:', error.response?.data);
                console.error('================================================');
                
                // Get the hostname part of the URL for troubleshooting
                let hostname = 'unknown';
                try {
                    hostname = new URL(error.config?.url).hostname;
                } catch(e) {}
                
                console.error(`Contact documents endpoint not found (404): ${error.config?.url}. 
                This could be due to:
                1. The API server at ${hostname} is not running
                2. The endpoint does not exist on the server
                3. The path is incorrect (check for typos)
                4. CORS is blocking the request
                
                Please check that your backend server is running and has these endpoints configured.`);
            }
            
            // Provide a fallback to prevent breaking UI
            return { 
                documents: [],
                pagination: { page: params.page || 1, limit: params.limit || 10, total: 0 } 
            };
        }
        
        // For network errors or unexpected errors
        debugLog2('getContactDocuments error', error);
        console.error('Error fetching contact documents:', error);
        
        // Return empty data to prevent breaking UI
        return { 
            documents: [],
            pagination: { page: params.page || 1, limit: params.limit || 10, total: 0 } 
        };
    }
};
/**
 * Gets documents for an account
 * Endpoint: GET /api/v1/document/account/:accountId
 * @param accountId The account ID
 * @param params Parameters for pagination and filtering
 * @returns List of documents for the account
 */
export const getAccountDocuments = async (accountId, params) => {
    try {
        const userId = localStorage.getItem("userId");
        const accessToken = localStorage.getItem("accessToken");
        
        // Build the query string from params
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append('page', params.page.toString());
        if (params.limit) queryParams.append('limit', params.limit.toString());
        if (params.search) queryParams.append('search', params.search);
        
        // Ensure the account ID is valid
        if (!accountId || accountId === 'undefined' || accountId === 'null') {
            console.error('Invalid account ID provided:', accountId);
            return { 
                documents: [],
                pagination: { page: params.page || 1, limit: params.limit || 10, total: 0 } 
            };
        }
        
        const apiUrl = joinApiPaths(BASE_URL, `document/account/${accountId}`) + `?${queryParams.toString()}`;
        
        // More detailed URL debugging
        console.log('==== GET ACCOUNT DOCUMENTS DEBUG ====');
        console.log('API URL:', apiUrl);
        console.log('Account ID:', accountId);
        console.log('Params:', params);
        console.log('BASE_URL used:', BASE_URL);
        console.log('Authorization header present:', !!accessToken);
        console.log('Request method:', 'GET');
        console.log('==============================');
        
        // Try a direct axios request instead of axios.get to have more control
        const response = await axios({
            method: 'GET',
            url: apiUrl,
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            timeout: 10000 // 10 second timeout
        });
        
        // Use the new debug utility to analyze the structure
        debugApiResponse(`GET ${apiUrl}`, response, 'AccountDocuments');
        debugLog2('getAccountDocuments raw response', response);
        debugLog2('getAccountDocuments response.data', response.data);
        
        // Handle different response formats from the backend
        let transformedData;
        
        // IMPORTANT - log the exact data structure for debugging
        console.log('Account Documents Response Structure:', {
            hasData: !!response.data,
            isObject: typeof response.data === 'object',
            isArray: Array.isArray(response.data),
            topLevelKeys: response.data && typeof response.data === 'object' ? Object.keys(response.data) : [],
            hasNestedData: response.data && response.data.data && typeof response.data.data === 'object',
            hasDocuments: response.data && response.data.documents && Array.isArray(response.data.documents),
            documentCount: response.data && response.data.documents && Array.isArray(response.data.documents) ? response.data.documents.length : 0
        });
        
        // If the response has a nested data.data structure (common in many APIs)
        if (response.data?.data?.data) {
            transformedData = {
                documents: Array.isArray(response.data.data.data) 
                    ? response.data.data.data.map(doc => ({
                        ...doc,
                        id: doc.documentId || doc.id || `doc-${Math.random()}`, // Ensure each doc has an id for DataGrid
                        fileName: doc.fileName || 'Unnamed Document',
                        description: doc.description || '',
                        fileType: doc.fileType || 'unknown',
                        fileSize: doc.fileSize || 0,
                        uploadedBy: doc.uploadedBy || { firstName: 'Unknown', lastName: 'User' },
                        createdAt: doc.createdAt || new Date().toISOString()
                    }))
                    : [],
            pagination: {
                    page: response.data.data.page || params.page || 1,
                    limit: response.data.data.limit || params.limit || 10,
                    total: response.data.data.total || 0
                }
            };
        } 
        // If the response has a direct documents array
        else if (response.data?.documents) {
            transformedData = {
                documents: Array.isArray(response.data.documents)
                    ? response.data.documents.map(doc => ({
                        ...doc,
                        id: doc.documentId || doc.id || `doc-${Math.random()}`,
                    }))
                    : [],
                pagination: response.data.pagination || {
                page: params.page || 1,
                limit: params.limit || 10,
                    total: response.data.documents?.length || 0
                }
            };
        }
        // If response.data is the documents array itself
        else if (Array.isArray(response.data)) {
            transformedData = {
                documents: response.data.map(doc => ({
                    ...doc,
                    id: doc.documentId || doc.id || `doc-${Math.random()}`,
                })),
                pagination: {
                    page: params.page || 1,
                    limit: params.limit || 10,
                    total: response.data.length
                }
            };
        }
        // NEW: If response.data.data is the documents array (common format)
        else if (Array.isArray(response.data?.data)) {
            transformedData = {
                documents: response.data.data.map(doc => ({
                    ...doc,
                    id: doc.documentId || doc.id || `doc-${Math.random()}`,
                })),
                pagination: {
                    page: params.page || 1,
                    limit: params.limit || 10,
                    total: response.data.data.length
                }
            };
        }
        // Fallback to default format
        else {
            transformedData = {
                documents: [],
                pagination: {
                    page: params.page || 1,
                    limit: params.limit || 10,
                    total: 0
                }
            };
        }
        
        debugLog2('Transformed account document data', transformedData);
        return transformedData;
    } catch (error) {
        // Handle API errors
        if (axios.isAxiosError(error) && error.response) {
            debugLog2('getAccountDocuments API error', {
                status: error.response.status,
                data: error.response.data
            });
            
            // For 404 errors, provide more diagnostic information
            if (error.response.status === 404) {
                console.error('==== 404 ERROR DIAGNOSTIC INFO (getAccountDocuments) ====');
                console.error('Endpoint not found:', error.config?.url);
                console.error('BASE_URL being used:', BASE_URL);
                console.error('Account ID:', accountId);
                console.error('Params:', params);
                console.error('Response data:', error.response?.data);
                console.error('================================================');
                
                // Get the hostname part of the URL for troubleshooting
                let hostname = 'unknown';
                try {
                    hostname = new URL(error.config?.url).hostname;
                } catch(e) {}
                
                console.error(`Account documents endpoint not found (404): ${error.config?.url}. 
                This could be due to:
                1. The API server at ${hostname} is not running
                2. The endpoint does not exist on the server
                3. The path is incorrect (check for typos)
                4. CORS is blocking the request
                
                Please check that your backend server is running and has these endpoints configured.`);
            }
            
            // Provide a fallback to prevent breaking UI
            return { 
                documents: [],
                pagination: { page: params.page || 1, limit: params.limit || 10, total: 0 } 
            };
        }
        
        // For network errors or unexpected errors
        debugLog2('getAccountDocuments error', error);
        console.error('Error fetching account documents:', error);
        
        // Return empty data to prevent breaking UI
        return { 
            documents: [],
            pagination: { page: params.page || 1, limit: params.limit || 10, total: 0 } 
        };
    }
};
/**
 * Deletes a document by ID
 * Endpoint: DELETE /api/v1/document/:documentId
 * @param documentId The ID of the document to delete
 * @returns Success response
 */
export const deleteDocument = async (documentId) => {
    debugLog2('Deleting Document:', { documentId });
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${isAccessToken(accessToken) ? accessToken : undefined}`,
            },
        };
        debugLog2('DELETE request to /document/' + documentId, config);
        const response = await axios.delete(joinApiPaths(BASE_URL, `document/${documentId}`), config);
        debugLog2('Delete Document Response:', response.data);
        return response.data;
    }
    catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("ERROR", error);
            debugLog2('Axios Error in deleteDocument:', {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message
            });
        }
        else {
            console.error("ERROR", error);
            debugLog2('Unknown Error in deleteDocument:', error);
        }
        throw error;
    }
};
/**
 * Gets the Google authentication URL that forces a reconnection (shows consent screen)
 * Endpoint: GET /api/v1/document/auth/google/reconnect
 * @param returnToContactId Optional contact ID to return to after authentication
 * @returns The URL to redirect the user for Google reconnection with forced consent
 */
export const getGoogleReconnectUrl = async (returnToContactId) => {
    try {
        const userId = localStorage.getItem("userId");
        const accessToken = localStorage.getItem("accessToken");
        if (!userId) {
            debugLog2('getGoogleReconnectUrl - No userId found in localStorage', null);
            return { error: "User ID not found", errorCode: "NO_USER_ID" };
        }
        if (!isAccessToken(accessToken)) {
            debugLog2('getGoogleReconnectUrl - Invalid or missing access token', { hasToken: !!accessToken });
            return { error: "Invalid access token", errorCode: "INVALID_TOKEN" };
        }
        // Set up the query parameters
        const params = new URLSearchParams();
        if (returnToContactId) {
            params.append('returnToContactId', returnToContactId);
        }
        params.append('userId', userId);
        params.append('forceConsent', 'true'); // Force the consent screen to appear for reconnection
        // Construct the API endpoint using BASE_URL
        const endpoint = joinApiPaths(BASE_URL, 'document/auth/google/reconnect');
        // Log the request
        debugLog2('getGoogleReconnectUrl - Making request to:', { endpoint, params: Object.fromEntries(params.entries()) });
        const response = await axios.get(`${endpoint}?${params.toString()}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        // Log the response
        debugLog2('getGoogleReconnectUrl - Response received:', response.data);
        // For debugging - log the actual response data
        if (typeof response.data === 'object' && response.data.data) {
            debugLog2('Response data:', response.data.data);
        }
        // Handle different response formats:
        // 1. Direct URL string
        if (typeof response.data === 'string') {
            return response.data;
        }
        // 2. Object with URL property
        if (response.data && typeof response.data === 'object') {
            // Check for common URL properties
            const url = response.data.url || response.data.authUrl || response.data.redirectUrl;
            if (url && typeof url === 'string') {
                return url;
            }
            // Check for data property containing the URL (common API pattern)
            if (response.data.data) {
                // If data property is a string, it might be the URL directly
                if (typeof response.data.data === 'string') {
                    return response.data.data;
                }
                // If data is an object, look for URL properties
                if (typeof response.data.data === 'object') {
                    const dataUrl = response.data.data.url ||
                        response.data.data.authUrl ||
                        response.data.data.redirectUrl;
                    if (dataUrl && typeof dataUrl === 'string') {
                        return dataUrl;
                    }
                }
            }
        }
        // If we get here, we have an unexpected response format, but we'll try to be lenient
        debugLog2('getGoogleReconnectUrl - Unexpected response format:', response.data);
        // As a last resort, return the entire response so the component can try to handle it
        return response.data;
    }
    catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            // Handle specific status codes
            if (error.response.status === 404) {
                debugLog2('getGoogleReconnectUrl - Endpoint not found (404)', { url: error.config?.url, message: error.message });
                throw new Error('Google reconnection endpoint not found. Please check API configuration.');
            }
            // Handle other API errors with response data
            debugLog2('getGoogleReconnectUrl - API error response:', { status: error.response.status, data: error.response.data });
            throw new Error(error.response.data?.message || 'Failed to get Google reconnection URL');
        }
        // Handle network or other errors
        debugLog2('getGoogleReconnectUrl - Error:', {
            message: error instanceof Error ? error.message : 'Unknown error'
        });
        throw error;
    }
};
/**
 * Disconnects the user from Google Drive
 * Endpoint: DELETE /api/v1/document/google/disconnect
 * @returns Object with success status and message
 */
export const disconnectGoogleDrive = async () => {
    try {
        const userId = localStorage.getItem("userId");
        const accessToken = localStorage.getItem("accessToken");
        if (!userId) {
            debugLog2('disconnectGoogleDrive - No userId found in localStorage', null);
            return { error: "User ID not found", errorCode: "NO_USER_ID" };
        }
        if (!isAccessToken(accessToken)) {
            debugLog2('disconnectGoogleDrive - Invalid or missing access token', { hasToken: !!accessToken });
            return { error: "Invalid access token", errorCode: "INVALID_TOKEN" };
        }
        // Set up the query parameters
        const params = new URLSearchParams();
        params.append('userId', userId);
        // Construct the API endpoint using BASE_URL
        const endpoint = joinApiPaths(BASE_URL, 'document/google/disconnect');
        // Log the request
        debugLog2('disconnectGoogleDrive - Making request to:', { endpoint, params: Object.fromEntries(params.entries()) });
        const response = await axios.delete(`${endpoint}?${params.toString()}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        // Log the response
        debugLog2('disconnectGoogleDrive - Response received:', response.data);
        // Parse the response
        if (response.data && typeof response.data === 'object') {
            // Check for success message or status
            if (response.data.success === true || response.data.disconnected === true) {
                return { success: true, message: "Successfully disconnected from Google Drive" };
            }
            // If the response has a specific message, return it
            if (response.data.message) {
                return { success: true, message: response.data.message };
            }
        }
        // Default success response if we don't have more specific information
        return { success: true, message: "Disconnected from Google Drive" };
    }
    catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            // Handle specific status codes
            if (error.response.status === 404) {
                debugLog2('disconnectGoogleDrive - Endpoint not found (404)', { url: error.config?.url, message: error.message });
                return { success: false, error: 'Google Drive disconnect endpoint not found. Please check API configuration.' };
            }
            if (error.response.status === 401) {
                debugLog2('disconnectGoogleDrive - Unauthorized (401)', { message: error.message });
                return { success: false, error: 'Authentication failed. Please log in again.' };
            }
            // Handle other API errors with response data
            debugLog2('disconnectGoogleDrive - API error response:', { status: error.response.status, data: error.response.data });
            return {
                success: false,
                error: error.response.data?.message || 'Failed to disconnect from Google Drive',
                status: error.response.status
            };
        }
        // Handle network or other errors
        debugLog2('disconnectGoogleDrive - Error:', {
            message: error instanceof Error ? error.message : 'Unknown error'
        });
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred while disconnecting from Google Drive'
        };
    }
};
