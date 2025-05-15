import axios from "axios";
import { auth } from "./firebaseConfig";
import debugLog from "../utils/debugLog";

// Extend Window interface to include _env_ property
declare global {
  interface Window {
    _env_?: Record<string, string>;
  }
}

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
    fileSize: 1024 * 1024, // 1MB
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
    fileSize: 512 * 1024, // 512KB
    deletedAt: null,
    modifiedBy: null,
    id: "mock-doc-2" // Add id property for DataGrid compatibility
  }
];

// Update the BASE_URL declaration with more logging
const BASE_URL = import.meta.env.VITE_REACT_APP_BASE_URL;

if (!BASE_URL) {
  console.error('ERROR: VITE_REACT_APP_BASE_URL is not defined in environment variables!');
  console.warn('Falling back to default API URL: http://localhost:8000/api/v1');
}

// Log environment information for debugging
console.log('=== Document Service Environment ===');
console.log('API Base URL:', BASE_URL || 'http://localhost:8000/api/v1');
console.log('Environment:', import.meta.env.VITE_ENVIRONMENT || 'not specified');
console.log('Google Callback URLs:', {
  frontend: import.meta.env.VITE_GOOGLE_AUTH_CALLBACK_URL,
  backend: import.meta.env.VITE_GOOGLE_BACKEND_CALLBACK
});
console.log('===================================');

const accessToken = localStorage.getItem("accessToken");

// Debug logger function - replaced with the shared utility
const debugLog2 = (message: string, data?: any) => {
  if (DEBUG) {
    debugLog(`[DocumentService] ${message}`, data, 'DocumentService');
  }
};

/**
 * Validates if the string is a valid access token
 * @param str The string to validate
 * @returns True if the string is a valid access token
 */
function isAccessToken(str: string | null) {
  debugLog2(`Access token check: ${str ? 'Has token' : 'No token'}`);
  return typeof str === "string" && str !== null;
}

// Document Types
export interface Document {
  id: string;
  documentId: string;
  fileName: string;
  description: string;
  googleDriveLink: string;
  googleDriveFileId: string;
  contactId?: string;
  uploadedBy: {
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
  fileType: string;
  fileSize?: number;
  deletedAt: string | null;
  modifiedBy: string | null;
  documentType?: string;
  customDocumentType?: string;
  startTime?: string;
  endTime?: string;
}

export interface DocumentParams {
  page?: number;
  limit?: number;
  search?: string | null;
}

export interface UploadDocumentPayload {
  file: File;
  description: string;
  contactId?: string;
  accountId?: string;
  startTime?: string | null;
  endTime?: string | null;
  documentType?: string | null;
  customDocumentType?: string;
  endpoint?: string;
}

/**
 * Gets the url for connecting to Google Drive
 * Endpoint: GET /api/v1/document/auth/google
 * @param returnToContactId Optional contact ID to return to after authentication
 * @returns Object with url
 */
export const getGoogleAuthUrl = async (returnToContactId?: string) => {
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
    const endpoint = `${BASE_URL}/document/auth/google`;
    
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
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      // Handle specific status codes
      if (error.response.status === 404) {
        debugLog2('getGoogleAuthUrl - Endpoint not found (404)', 
          { url: error.config?.url, message: error.message });
        throw new Error('Google authentication endpoint not found. Please check API configuration.');
      }
      
      // Handle other API errors with response data
      debugLog2('getGoogleAuthUrl - API error response:', 
        { status: error.response.status, data: error.response.data });
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
    const fullUrl = `${BASE_URL}/document/auth/google/connection`;
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
  } catch (error) {
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
      } else if (error.response?.status === 403) {
        return { 
          connected: false, 
          message: 'You do not have permission to check Google Drive connection.',
          error: error.message,
          status: error.response?.status
        };
      } else if (error.response?.status === 404) {
        // For 404 errors, provide detailed context for troubleshooting
        const fullUrl = `${BASE_URL}/document/auth/google/connection`;
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
 * Endpoint: POST /api/v1/document/contact/:contactId or POST /api/v1/document/account/:accountId
 * @param payload The upload document payload including file, description, and contact/account ID
 * @returns The uploaded document
 */
export const uploadDocument = async (payload: UploadDocumentPayload) => {
  try {
    const userId = localStorage.getItem("userId");
    const accessToken = localStorage.getItem("accessToken");
    
    // Determine the API endpoint based on whether contactId or accountId is provided
    let endpointPath = '';
    
    if (payload.endpoint === 'account' && payload.accountId) {
      endpointPath = `/document/account/${payload.accountId}`;
    } else if (payload.contactId) {
      endpointPath = `/document/contact/${payload.contactId}`;
    } else {
      throw new Error('Either contactId or accountId must be provided');
    }
    
    // Create a FormData object to handle the multipart/form-data
    const formData = new FormData();
    formData.append('file', payload.file);
    formData.append('description', payload.description);
    
    // Add optional fields if provided
    if (payload.startTime) {
      formData.append('startTime', payload.startTime);
    }
    if (payload.endTime) {
      formData.append('endTime', payload.endTime);
    }
    if (payload.documentType) {
      formData.append('documentType', payload.documentType);
    }
    if (payload.documentType === 'OTHER' && payload.customDocumentType) {
      formData.append('customDocumentType', payload.customDocumentType);
    }
    
    const apiUrl = `${BASE_URL}${endpointPath}`;
    debugLog2(`Uploading document to ${apiUrl}`, { 
      fileSize: payload.file.size, 
      fileName: payload.file.name,
      endpoint: payload.endpoint,
      contactId: payload.contactId,
      accountId: payload.accountId
    });
    
    const response = await axios.post(apiUrl, formData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'multipart/form-data'
      },
    });
    
    debugLog2('Upload document response', response.data);
    return response.data;
  } catch (error) {
    // Handle different error types
    if (axios.isAxiosError(error) && error.response) {
      // API error with response
      const status = error.response.status;
      const errorData = error.response.data;
      
      debugLog2('Upload document API error', {
        status,
        data: errorData,
        message: error.message
      });
      
      // Handle specific error codes
      if (status === 413) {
        throw new Error('File is too large. Maximum size is 5MB.');
      } else if (status === 415) {
        throw new Error('Unsupported file format.');
      } else if (status === 401) {
        throw new Error('Authentication failed. Please log in again.');
      } else if (status === 403) {
        throw new Error('You do not have permission to upload documents.');
      } else if (errorData && errorData.message) {
        throw new Error(errorData.message);
      }
    }
    
    // For network errors or other unexpected errors
    debugLog2('Upload document error', error);
    
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error('An unknown error occurred while uploading the document.');
    }
  }
};

/**
 * Gets documents for a contact
 * Endpoint: GET /api/v1/document/contact/:contactId
 * @param contactId The contact ID
 * @param params Parameters for pagination and filtering
 * @returns List of documents for the contact
 */
export const getContactDocuments = async (contactId: string, params: DocumentParams) => {
  try {
    const userId = localStorage.getItem("userId");
    const accessToken = localStorage.getItem("accessToken");
    
    // Build the query string from params
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.search) queryParams.append('search', params.search);
    
    const apiUrl = `${BASE_URL}/document/contact/${contactId}?${queryParams.toString()}`;
    
    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    
    debugLog2('getContactDocuments response', response.data);
    return response.data;
  } catch (error) {
    // Handle API errors
    if (axios.isAxiosError(error) && error.response) {
      debugLog2('getContactDocuments API error', {
        status: error.response.status,
        data: error.response.data
      });
      
      // Provide a fallback to prevent breaking UI
      return { documents: [], pagination: { page: 1, limit: 10, total: 0 } };
    }
    
    // For network errors or unexpected errors
    debugLog2('getContactDocuments error', error);
    console.error('Error fetching contact documents:', error);
    
    // Return empty data to prevent breaking UI
    return { documents: [], pagination: { page: 1, limit: 10, total: 0 } };
  }
};

/**
 * Gets documents for an account
 * Endpoint: GET /api/v1/document/account/:accountId
 * @param accountId The account ID
 * @param params Parameters for pagination and filtering
 * @returns List of documents for the account
 */
export const getAccountDocuments = async (accountId: string, params: DocumentParams) => {
  try {
    const userId = localStorage.getItem("userId");
    const accessToken = localStorage.getItem("accessToken");
    
    // Build the query string from params
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.search) queryParams.append('search', params.search);
    
    const apiUrl = `${BASE_URL}/document/account/${accountId}?${queryParams.toString()}`;
    
    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    
    debugLog2('getAccountDocuments response', response.data);
    return response.data;
  } catch (error) {
    // Handle API errors
    if (axios.isAxiosError(error) && error.response) {
      debugLog2('getAccountDocuments API error', {
        status: error.response.status,
        data: error.response.data
      });
      
      // Provide a fallback to prevent breaking UI
      return { documents: [], pagination: { page: 1, limit: 10, total: 0 } };
    }
    
    // For network errors or unexpected errors
    debugLog2('getAccountDocuments error', error);
    console.error('Error fetching account documents:', error);
    
    // Return empty data to prevent breaking UI
    return { documents: [], pagination: { page: 1, limit: 10, total: 0 } };
  }
};

/**
 * Deletes a document by ID
 * Endpoint: DELETE /api/v1/document/:documentId
 * @param documentId The ID of the document to delete
 * @returns Success response
 */
export const deleteDocument = async (documentId: string) => {
  debugLog2('Deleting Document:', { documentId });
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${
          isAccessToken(accessToken) ? accessToken : undefined
        }`,
      },
    };
    
    debugLog2('DELETE request to /document/' + documentId, config);
    
    const response = await axios.delete(
      `${BASE_URL}/document/${documentId}`,
      config
    );
    
    debugLog2('Delete Document Response:', response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("ERROR", error);
      debugLog2('Axios Error in deleteDocument:', { 
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
    } else {
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
export const getGoogleReconnectUrl = async (returnToContactId?: string) => {
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
    const endpoint = `${BASE_URL}/document/auth/google/reconnect`;
    
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
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      // Handle specific status codes
      if (error.response.status === 404) {
        debugLog2('getGoogleReconnectUrl - Endpoint not found (404)', 
          { url: error.config?.url, message: error.message });
        throw new Error('Google reconnection endpoint not found. Please check API configuration.');
      }
      
      // Handle other API errors with response data
      debugLog2('getGoogleReconnectUrl - API error response:', 
        { status: error.response.status, data: error.response.data });
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
    const endpoint = `${BASE_URL}/document/google/disconnect`;
    
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
    
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      // Handle specific status codes
      if (error.response.status === 404) {
        debugLog2('disconnectGoogleDrive - Endpoint not found (404)', 
          { url: error.config?.url, message: error.message });
        return { success: false, error: 'Google Drive disconnect endpoint not found. Please check API configuration.' };
      }
      
      if (error.response.status === 401) {
        debugLog2('disconnectGoogleDrive - Unauthorized (401)', 
          { message: error.message });
        return { success: false, error: 'Authentication failed. Please log in again.' };
      }
      
      // Handle other API errors with response data
      debugLog2('disconnectGoogleDrive - API error response:', 
        { status: error.response.status, data: error.response.data });
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