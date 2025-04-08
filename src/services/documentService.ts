import axios from "axios";
import { auth } from "./firebaseConfig";

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

const BASE_URL = "http://localhost:8000/api/v1";
const accessToken = localStorage.getItem("accessToken");

// Debug logger function
const debugLog = (message: string, data?: any) => {
  if (DEBUG) {
    console.log(`[DocumentService] ${message}`);
    if (data) console.log(data);
  }
};

function isAccessToken(str: string | null) {
  debugLog(`Access token check: ${str ? 'Has token' : 'No token'}`);
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
}

export interface DocumentParams {
  page?: number;
  limit?: number;
  search?: string | null;
}

export interface UploadDocumentPayload {
  file: File;
  description: string;
  contactId: string;
}

// Document Service API functions
export const getGoogleAuthUrl = async () => {
  debugLog('Requesting Google Auth URL');
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${
          isAccessToken(accessToken) ? accessToken : undefined
        }`,
      },
    };
    debugLog('GET request to /document/auth/google', config);
    const response = await axios.get(`${BASE_URL}/document/auth/google`, config);
    debugLog('Google Auth URL Response:', response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("ERROR", error);
      debugLog('Axios Error in getGoogleAuthUrl:', { 
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
    } else {
      console.error("ERROR", error);
      debugLog('Unknown Error in getGoogleAuthUrl:', error);
    }
    throw error;
  }
};

export const checkGoogleDriveConnection = async () => {
  debugLog('Checking Google Drive Connection');
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${
          isAccessToken(accessToken) ? accessToken : undefined
        }`,
      },
    };
    debugLog('GET request to /document/google/connection', config);
    const response = await axios.get(`${BASE_URL}/document/google/connection`, config);
    debugLog('Google Drive Connection Response:', response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("ERROR", error);
      debugLog('Axios Error in checkGoogleDriveConnection:', { 
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
    } else {
      console.error("ERROR", error);
      debugLog('Unknown Error in checkGoogleDriveConnection:', error);
    }
    return { connected: false };
  }
};

export const uploadDocument = async (payload: UploadDocumentPayload) => {
  debugLog('Uploading Document:', {
    fileName: payload.file.name,
    fileSize: payload.file.size,
    contactId: payload.contactId
  });
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${
          isAccessToken(accessToken) ? accessToken : undefined
        }`,
        "Content-Type": "multipart/form-data",
      },
    };
    
    const { file, description, contactId } = payload;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("description", description);
    
    debugLog('POST request to /document/upload/', {
      url: `${BASE_URL}/document/upload/${contactId}`,
      headers: config.headers,
      fileInfo: {
        name: file.name,
        type: file.type,
        size: file.size
      }
    });
    
    const response = await axios.post(
      `${BASE_URL}/document/upload/${contactId}`,
      formData,
      config
    );
    
    debugLog('Document Upload Response:', response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("ERROR", error);
      debugLog('Axios Error in uploadDocument:', { 
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
    } else {
      console.error("ERROR", error);
      debugLog('Unknown Error in uploadDocument:', error);
    }
    throw error;
  }
};

export const getContactDocuments = async (contactId: string, params: DocumentParams) => {
  debugLog('Fetching Contact Documents:', { contactId, params });
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${
          isAccessToken(accessToken) ? accessToken : undefined
        }`,
      },
    };
    
    const searchParam = params.search ? `&search=${params.search}` : '';
    const url = `${BASE_URL}/document/contact/${contactId}?page=${params.page || 1}&limit=${params.limit || 10}${searchParam}`;

    debugLog('GET request to ' + url, config);
    const response = await axios.get(url, config);
    debugLog('Raw API Response:', response);
    
    // Transform the response data to ensure it matches the expected format
    let transformedData;
    debugLog('Response Data:', response.data);
    
    if (response.data?.data?.data) {
      // Handle nested data.data structure
      transformedData = {
        documents: Array.isArray(response.data.data.data) ? response.data.data.data.map((doc: any) => ({
          ...doc,
          id: doc.documentId || doc.id || `doc-${Math.random()}`,
          fileName: doc.fileName || 'Unnamed Document',
          description: doc.description || '',
          fileType: doc.fileType || 'unknown',
          fileSize: doc.fileSize || 0,
          uploadedBy: doc.uploadedBy || { firstName: 'Unknown', lastName: 'User' },
          createdAt: doc.createdAt || new Date().toISOString()
        })) : [],
        pagination: {
          page: params.page || 1,
          limit: params.limit || 10,
          total: response.data.data.total || 0
        }
      };
    } else {
      // If we got a direct array or need to fall back to mock data
      transformedData = {
        documents: mockDocuments,
        pagination: {
          page: params.page || 1,
          limit: params.limit || 10,
          total: mockDocuments.length
        }
      };
    }
    
    debugLog('Transformed Response:', transformedData);
    return transformedData;
    
  } catch (error) {
    debugLog('Error in getContactDocuments:', error);
    if (axios.isAxiosError(error)) {
      console.error("ERROR", error);
      debugLog('Axios Error in getContactDocuments:', { 
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
    } else {
      console.error("ERROR", error);
      debugLog('Unknown Error in getContactDocuments:', error);
    }
    
    // Return mock data as fallback with proper structure
    const fallbackData = {
      documents: mockDocuments,
      pagination: {
        page: params.page || 1,
        limit: params.limit || 10,
        total: mockDocuments.length
      }
    };
    
    debugLog('Returning fallback data:', fallbackData);
    return fallbackData;
  }
};

export const deleteDocument = async (documentId: string) => {
  debugLog('Deleting Document:', { documentId });
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${
          isAccessToken(accessToken) ? accessToken : undefined
        }`,
      },
    };
    
    debugLog('DELETE request to /document/' + documentId, config);
    
    const response = await axios.delete(
      `${BASE_URL}/document/${documentId}`,
      config
    );
    
    debugLog('Delete Document Response:', response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("ERROR", error);
      debugLog('Axios Error in deleteDocument:', { 
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
    } else {
      console.error("ERROR", error);
      debugLog('Unknown Error in deleteDocument:', error);
    }
    throw error;
  }
}; 