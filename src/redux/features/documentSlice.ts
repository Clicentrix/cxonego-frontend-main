import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Pagination } from "../../utilities/common/exportDataTypes/accountDataTypes";
import { message } from "antd";
import {
  Document,
  DocumentParams,
  checkGoogleDriveConnection,
  deleteDocument,
  getContactDocuments,
  getGoogleAuthUrl,
  uploadDocument,
  getGoogleReconnectUrl,
  disconnectGoogleDrive,
} from "../../services/documentService";
import debugLog from "../../utils/debugLog";

// Initial empty document
export const emptyDocument = {
  id: "",
  documentId: "",
  fileName: "",
  description: "",
  googleDriveLink: "",
  googleDriveFileId: "",
  uploadedBy: {
    userId: "",
    firstName: "",
    lastName: "",
    email: ""
  },
  createdAt: "",
  updatedAt: "",
  fileType: "",
  fileSize: 0,
  deletedAt: null,
  modifiedBy: null
};

type InitialState = {
  loading: boolean;
  documents: Document[];
  document: Document;
  pagination: Pagination;
  error: string;
  addDocumentLoader: boolean;
  getDocumentLoader: boolean;
  isGoogleConnected: boolean;
  checkingGoogleConnection: boolean;
  editable: boolean;
  totalDocuments: number;
};

const initialState: InitialState = {
  loading: false,
  document: emptyDocument,
  addDocumentLoader: false,
  getDocumentLoader: false,
  documents: [],
  pagination: {
    page: 1,
    total: 20,
  },
  error: "",
  editable: false,
  isGoogleConnected: false,
  checkingGoogleConnection: false,
  totalDocuments: 0,
};

// Check Google Drive connection status
export const checkGoogleConnection = createAsyncThunk(
  "documents/checkGoogleConnection",
  async () => {
    try {
      // Make the actual connection check to Google Drive
      const response = await checkGoogleDriveConnection();
      console.log("Google Drive connection check:", response);
      return response;
    } catch (error) {
      console.error("Error checking Google connection:", error);
      return { connected: false };
    }
  }
);

// Get Google Auth URL
export const getGoogleAuth = createAsyncThunk(
  "documents/getGoogleAuth",
  async () => {
    try {
      const response = await getGoogleAuthUrl();
      return response;
    } catch (error) {
      console.error("Error getting Google auth URL:", error);
      throw error;
    }
  }
);

// Get Google Reconnect URL (forces consent screen)
export const getGoogleReconnect = createAsyncThunk(
  "documents/getGoogleReconnect",
  async () => {
    try {
      const response = await getGoogleReconnectUrl();
      return response;
    } catch (error) {
      console.error("Error getting Google reconnect URL:", error);
      throw error;
    }
  }
);

// Disconnect from Google Drive
export const disconnectGoogle = createAsyncThunk(
  "documents/disconnectGoogle",
  async (_, { dispatch }) => {
    try {
      const response = await disconnectGoogleDrive();
      
      console.log("Google Drive disconnect response:", response);
      
      if (response.success) {
        // Show success message
        message.success(response.message || "Disconnected from Google Drive");
        
        // Clear Google Drive connection flag in localStorage
        localStorage.setItem('googleDriveConnected', 'false');
        
        // Refresh connection status
        dispatch(checkGoogleConnection());
        
        return response;
      } else {
        // Show error message
        message.error(response.error || "Failed to disconnect from Google Drive");
        
        // For specific error types like endpoint not found, provide more info
        if (response.status === 404) {
          console.warn("Google Drive disconnect endpoint not found:", response);
        }
        
        return response;
      }
    } catch (error) {
      console.error("Error disconnecting from Google Drive:", error);
      message.error("Failed to disconnect from Google Drive");
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error" 
      };
    }
  }
);

// Upload document
export const uploadDocumentThunk = createAsyncThunk(
  "documents/uploadDocument",
  async (payload: { 
    file: File; 
    description: string; 
    contactId: string;
    startTime?: string | null;
    endTime?: string | null;
    documentType?: string | null;
    customDocumentType?: string;
  }, { rejectWithValue }) => {
    debugLog('[uploadDocumentThunk] Starting', payload, 'DocumentSlice');
    try {
      debugLog('[uploadDocumentThunk] Calling uploadDocument service', null, 'DocumentSlice');
      const response = await uploadDocument(payload);
      debugLog('[uploadDocumentThunk] uploadDocument service call successful', response, 'DocumentSlice');
      message.success("Document uploaded successfully");
      return response;
    } catch (error) {
      debugLog('[uploadDocumentThunk] Caught error', error, 'DocumentSlice');
      // Extract a user-friendly error message
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Failed to upload document. Please try again.";
        
      console.error("Error uploading document (Thunk):", error);
      message.error(errorMessage); // Show the specific error message
      
      // Use rejectWithValue to pass the error payload to the rejected action
      return rejectWithValue(errorMessage);
    }
  }
);

// Get documents for a contact
export const getContactDocumentsThunk = createAsyncThunk(
  "documents/getContactDocuments",
  async ({ contactId, params }: { contactId: string; params: DocumentParams }) => {
    try {
      const response = await getContactDocuments(contactId, params);
      
      // Handle the response format directly from the service
      const documents = response.documents || [];
      const pagination = response.pagination || {
        page: params.page || 1,
        limit: params.limit || 10,
        total: 0
      };
      
      return {
        documents: documents,
        total: pagination.total || documents.length,
        page: pagination.page || params.page || 1
      };
    } catch (error) {
      console.error("Error fetching documents:", error);
      return {
        documents: [],
        total: 0,
        page: 1
      };
    }
  }
);

// Delete document and refresh list
export const deleteDocumentAndRefresh = createAsyncThunk(
  "documents/deleteDocumentAndRefresh",
  async ({ documentId, contactId, params }: { documentId: string; contactId: string; params: DocumentParams }, { dispatch }) => {
    try {
      await deleteDocument(documentId);
      message.success("Document deleted successfully");
      // Refresh the documents list
      dispatch(getContactDocumentsThunk({ contactId, params }));
      return { success: true };
    } catch (error) {
      console.error("Error deleting document:", error);
      message.error("Failed to delete document. Please try again.");
      throw error;
    }
  }
);

const documentSlice = createSlice({
  name: "documents",
  initialState,
  reducers: {
    resetDocument: (state) => {
      state.document = emptyDocument;
    },
    resetDocuments: (state) => {
      state.documents = [];
    },
    setEditableMode: (state, action) => {
      state.editable = action.payload;
    },
    handleInputChangeReducerDocument: (state, action) => {
      state.document = {
        ...state.document,
        ...action.payload,
      };
    },
  },
  extraReducers: (builder) => {
    // Check Google Connection
    builder.addCase(checkGoogleConnection.pending, (state) => {
      state.checkingGoogleConnection = true;
    });
    builder.addCase(checkGoogleConnection.fulfilled, (state, action) => {
      state.checkingGoogleConnection = false;
      state.isGoogleConnected = action.payload.connected;
    });
    builder.addCase(checkGoogleConnection.rejected, (state) => {
      state.checkingGoogleConnection = false;
      state.isGoogleConnected = false;
    });

    // Disconnect Google Drive
    builder.addCase(disconnectGoogle.pending, (state) => {
      state.checkingGoogleConnection = true; // Reuse the same loading state
    });
    builder.addCase(disconnectGoogle.fulfilled, (state, action) => {
      state.checkingGoogleConnection = false;
      // Set connection status to false on successful disconnect
      if (action.payload && action.payload.success) {
        state.isGoogleConnected = false;
      }
    });
    builder.addCase(disconnectGoogle.rejected, (state) => {
      state.checkingGoogleConnection = false;
      // Keep existing connection status on error - will be verified by checkConnection later
    });

    // Upload Document
    builder.addCase(uploadDocumentThunk.pending, (state) => {
      state.addDocumentLoader = true;
    });
    builder.addCase(uploadDocumentThunk.fulfilled, (state) => {
      state.addDocumentLoader = false;
    });
    builder.addCase(uploadDocumentThunk.rejected, (state) => {
      state.addDocumentLoader = false;
    });

    // Get Contact Documents
    builder.addCase(getContactDocumentsThunk.pending, (state) => {
      state.getDocumentLoader = true;
    });
    builder.addCase(getContactDocumentsThunk.fulfilled, (state, action) => {
      state.getDocumentLoader = false;
      
      // Always ensure we have an array, even if empty
      state.documents = Array.isArray(action.payload.documents) 
        ? action.payload.documents 
        : [];
        
      // Set total documents with fallback to array length
      state.totalDocuments = action.payload.total || state.documents.length;
        
      // Update pagination
      state.pagination = {
        page: action.payload.page || 1,
        total: state.totalDocuments,
      };
    });
    builder.addCase(getContactDocumentsThunk.rejected, (state, action) => {
      console.error('Documents fetch rejected:', action.error);
      state.getDocumentLoader = false;
      state.documents = [];
      state.totalDocuments = 0;
    });
  },
});

export const {
  resetDocument,
  resetDocuments,
  setEditableMode,
  handleInputChangeReducerDocument,
} = documentSlice.actions;

export default documentSlice.reducer; 