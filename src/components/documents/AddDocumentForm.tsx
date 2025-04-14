import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Upload, message, Tooltip, Divider, Alert, Spin } from 'antd';
import { UploadOutlined, FileOutlined, GoogleOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../../redux/app/hooks';
import { RootState } from '../../redux/app/store';
import { checkGoogleConnection, getGoogleAuth, uploadDocumentThunk } from '../../redux/features/documentSlice';
import TextArea from 'antd/es/input/TextArea';
import { getGoogleAuthUrl } from '../../services/documentService';
import { extractContactId } from '../../utils/contactUtils';
import debugLog from '../../utils/debugLog';
import GoogleDriveIntegration from './GoogleDriveIntegration';

interface AddDocumentFormProps {
  contactId: string;
  onUploadSuccess?: () => void;
}

const AddDocumentForm: React.FC<AddDocumentFormProps> = ({ contactId, onUploadSuccess }) => {
  const dispatch = useAppDispatch();
  const { isGoogleConnected, checkingGoogleConnection, addDocumentLoader } = useAppSelector(
    (state: RootState) => state.documents
  );
  const { screenWidth } = useAppSelector((state: RootState) => state.referrals);
  
  const [file, setFile] = useState<File | null>(null);
  const [fileList, setFileList] = useState<any[]>([]);
  const [connectionError, setConnectionError] = useState<string>('');
  const [userAuthenticated, setUserAuthenticated] = useState<boolean>(true);

  // Check authentication and Google Drive connection on component mount
  useEffect(() => {
    // Check if the user is logged in
    const userId = localStorage.getItem("userId");
    if (!userId) {
      debugLog('[Document Upload] User not authenticated', null, 'AddDocumentForm');
      setUserAuthenticated(false);
    } else {
      setUserAuthenticated(true);
      
      // Get stored connection status first
      const storedGoogleConnection = localStorage.getItem("googleDriveConnected");
      
      // Only make API call if we don't have a stored value or need to verify
      if (storedGoogleConnection !== "true") {
        debugLog('[Document Upload] Checking Google Drive connection (no stored status)', null, 'AddDocumentForm');
        // Only check Google connection if authenticated and we don't have a stored status
        dispatch(checkGoogleConnection());
      } else {
        // Trust the stored value without making an API call
        debugLog('[Document Upload] Using stored Google Drive connection status (true)', null, 'AddDocumentForm');
      }
    }
  }, [dispatch]);

  // Handle file change
  const handleFileChange = (info: any) => {
    const singleFile = info.fileList[0]?.originFileObj;
    
    if (!singleFile) {
      setFile(null);
      setFileList([]);
      return;
    }
    
    // Check file size (5MB limit)
    const isLt5M = singleFile.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('File must be smaller than 5MB!');
      setFile(null);
      setFileList([]);
      return;
    }
    
    setFile(singleFile);
    setFileList([info.fileList[0]]);
  };

  // Handle authentication error
  const handleLogin = () => {
    // Store the contactId to return to after login
    if (contactId) {
      localStorage.setItem('returnToContactId', contactId);
      sessionStorage.setItem('returnToContactId', contactId);
    }
    
    // Redirect to login page
    window.location.href = '/login';
  };

  // Handle Google Drive connection
  const handleConnectGoogleDrive = async () => {
    try {
      // Reset any previous connection errors
      setConnectionError('');
      
      // Check if user is authenticated
      const userId = localStorage.getItem("userId");
      if (!userId) {
        const errorMsg = "You must be logged in to connect to Google Drive";
        debugLog('[Google Auth] User not authenticated', null, 'AddDocumentForm');
        message.error(errorMsg);
        setConnectionError(errorMsg);
        setUserAuthenticated(false);
        return;
      }
      
      // Enhanced validation of the contact ID
      if (!contactId || typeof contactId !== 'string' || contactId === '[object Object]') {
        debugLog('[Google Auth] Invalid contactId detected:', contactId, 'AddDocumentForm');
        message.error('Cannot connect to Google Drive: Invalid contact information. Please try refreshing the page.');
        setConnectionError('Invalid contact ID. Please try refreshing the page.');
        return;
      }
      
      // Store the current contactId in localStorage so we can return after auth
      const sanitizedContactId = typeof contactId === 'string' ? contactId : '';
      
      debugLog('[Google Auth] Storing contactId for return:', sanitizedContactId, 'AddDocumentForm');
      
      // Store in both localStorage and sessionStorage for redundancy
      localStorage.setItem('returnToContactId', sanitizedContactId);
      sessionStorage.setItem('returnToContactId', sanitizedContactId);
      
      // Also store timestamp for potential debugging
      const authInitiationTime = Date.now();
      localStorage.setItem('auth_initiation_time', authInitiationTime.toString());
      sessionStorage.setItem('auth_initiation_time', authInitiationTime.toString());
      
      // Get Google auth URL using the authentication token and userId
      debugLog('[Google Auth] Requesting Google auth URL...', { userId }, 'AddDocumentForm');
      const response = await getGoogleAuthUrl();
      debugLog('[Google Auth] Response from getGoogleAuthUrl:', response, 'AddDocumentForm');
      
      // Extract the URL from the response
      let googleAuthUrl;
      if (typeof response === 'string') {
        googleAuthUrl = response;
      } else if (response && typeof response === 'object') {
        // Try to find the URL in response object (common patterns)
        googleAuthUrl = response.url || response.authUrl || response.redirectUrl || 
                        response.data?.url || response.data?.authUrl || 
                        response.data?.redirectUrl;
      }
      
      // Validate the URL before redirecting
      if (!googleAuthUrl || typeof googleAuthUrl !== 'string') {
        debugLog('[Google Auth] Invalid auth URL received:', googleAuthUrl, 'AddDocumentForm');
        message.error('Invalid Google authentication URL. Please try again or contact support.');
        setConnectionError('Invalid authentication URL received. Please try again or contact support.');
        return;
      }
      
      // Ensure URL is a properly formatted URL with http/https
      if (!googleAuthUrl.startsWith('http://') && !googleAuthUrl.startsWith('https://')) {
        debugLog('[Google Auth] Auth URL does not start with http:// or https://', googleAuthUrl, 'AddDocumentForm');
        message.error('Invalid Google authentication URL format. Please contact support.');
        setConnectionError('Invalid authentication URL format. Please contact support.');
        return;
      }
      
      debugLog('[Google Auth] Redirecting to Google Auth URL:', googleAuthUrl, 'AddDocumentForm');
      
      // Double check URL format to avoid issues
      try {
        new URL(googleAuthUrl); // This will throw if URL is invalid
        
        // Redirect to Google auth URL
        window.location.href = googleAuthUrl;
        
      } catch (urlError) {
        debugLog('[Google Auth] URL parsing error:', urlError, 'AddDocumentForm');
        message.error('Invalid URL format received from server. Please contact support.');
        setConnectionError('Invalid URL format. Please contact support.');
      }
    } catch (error) {
      debugLog('Error connecting to Google Drive:', error, 'AddDocumentForm');
      
      // Check if the error is due to authentication
      if (error instanceof Error && 
          (error.message.includes('login') || 
           error.message.includes('logged in') || 
           error.message.includes('authenticated'))) {
        setUserAuthenticated(false);
        message.error('You must be logged in to connect to Google Drive');
      } else {
        message.error('Failed to connect to Google Drive. Please try again.');
        setConnectionError('Failed to connect to Google Drive. Please try again later.');
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (values: { description: string }) => {
    if (!file) {
      message.error('Please select a file to upload');
      return;
    }
    
    // Require Google Drive connection
    if (!isGoogleConnected) {
      message.error('Please connect to Google Drive first to upload documents');
      return;
    }
    
    try {
      debugLog('Uploading document:', { 
        fileName: file.name, 
        fileSize: file.size, 
        contactId,
        description: values.description 
      }, 'AddDocumentForm');
      
      await dispatch(uploadDocumentThunk({
        file,
        description: values.description,
        contactId
      })).unwrap();
      
      // Reset form
      setFile(null);
      setFileList([]);
      
      // Call success callback if provided
      if (onUploadSuccess) {
        onUploadSuccess();
      }
      
    } catch (error) {
      debugLog('Error uploading document:', error, 'AddDocumentForm');
    }
  };

  // Normal form when connected
  return (
    <div className="document-form-container">
      {/* Place GoogleDriveIntegration once at the top level for all cases */}
      <GoogleDriveIntegration
        condensed 
        returnTo={contactId}
        onConnected={() => message.success("Connected to Google Drive! You can now upload documents.")} 
      />
      
      {!userAuthenticated ? (
        <>
          <Alert
            message="Authentication Required"
            description="You need to be logged in to your account before connecting to Google Drive or uploading documents."
            type="warning"
            showIcon
            style={{ marginBottom: 16, marginTop: 16 }}
          />
          <Button 
            type="primary" 
            onClick={handleLogin}
            style={{ marginBottom: 16 }}
          >
            Log In Now
          </Button>
        </>
      ) : checkingGoogleConnection ? (
        <div style={{ textAlign: 'center', padding: '20px', marginTop: 16 }}>
          <Spin tip="Checking Google Drive connection..."/>
        </div>
      ) : !isGoogleConnected ? (
        <Alert
          message="Google Drive Connection Required"
          description="To upload documents, you need to connect your Google Drive account using the controls above."
          type="info"
          showIcon
          style={{ marginBottom: 16, marginTop: 16 }}
        />
      ) : (
        <>
          <Form.Item
            name="file"
            label="Document"
            className="addReferralFormInput"
            rules={[
              {
                required: true,
                message: "Please select a file to upload!",
              },
            ]}
          >
            <Upload
              beforeUpload={() => false}
              onChange={handleFileChange}
              fileList={fileList}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />} disabled={addDocumentLoader}>
                Select File
              </Button>
              <div className="upload-hint">
                Max file size: 5MB
              </div>
            </Upload>
          </Form.Item>

          {file && (
            <div className="selected-file">
              <FileOutlined /> {file.name} ({(file.size / 1024).toFixed(2)} KB)
            </div>
          )}

          <Form.Item
            name="description"
            label="Description"
            className="addReferralFormInput"
            rules={[
              {
                required: true,
                message: "This field is mandatory!",
              },
            ]}
          >
            <TextArea
              placeholder="Please enter document description here"
              maxLength={499}
              disabled={addDocumentLoader}
            />
          </Form.Item>
        </>
      )}
    </div>
  );
};

export default AddDocumentForm; 