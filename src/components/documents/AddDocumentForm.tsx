import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Upload, message, Tooltip, Divider, Alert, Spin } from 'antd';
import { UploadOutlined, FileOutlined, GoogleOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../../redux/app/hooks';
import { RootState } from '../../redux/app/store';
import { checkGoogleConnection } from '../../redux/features/documentSlice';
import TextArea from 'antd/es/input/TextArea';
import { getGoogleAuthUrl } from '../../services/documentService';
import debugLog from '../../utils/debugLog';
import GoogleDriveIntegration from './GoogleDriveIntegration';

interface AddDocumentFormProps {
  contactId: string;
  onFileChange: (file: File | null) => void;
  onDescriptionChange: (description: string) => void;
  fileList: any[];
}

const AddDocumentForm: React.FC<AddDocumentFormProps> = ({ 
  contactId, 
  onFileChange, 
  onDescriptionChange,
  fileList
}) => {
  const dispatch = useAppDispatch();
  const { isGoogleConnected, checkingGoogleConnection, addDocumentLoader } = useAppSelector(
    (state: RootState) => state.documents
  );
  
  const [connectionError, setConnectionError] = useState<string>('');
  const [userAuthenticated, setUserAuthenticated] = useState<boolean>(true);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      debugLog('[Document Upload Form] User not authenticated', null, 'AddDocumentForm');
      setUserAuthenticated(false);
    } else {
      setUserAuthenticated(true);
      const storedGoogleConnection = localStorage.getItem("googleDriveConnected");
      if (storedGoogleConnection !== "true") {
        debugLog('[Document Upload Form] Checking Google Drive connection (no stored status)', null, 'AddDocumentForm');
        dispatch(checkGoogleConnection());
      } else {
        debugLog('[Document Upload Form] Using stored Google Drive connection status (true)', null, 'AddDocumentForm');
      }
    }
  }, [dispatch]);

  const handleFileChangeInternal = (info: any) => {
    const singleFile = info.fileList[0]?.originFileObj || null;
    
    if (singleFile) {
      const isLt5M = singleFile.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error('File must be smaller than 5MB!');
        onFileChange(null);
        return;
      }
      debugLog('[Document Upload Form] File selected', { name: singleFile.name, size: singleFile.size }, 'AddDocumentForm');
      onFileChange(singleFile);
    } else {
      debugLog('[Document Upload Form] File removed', null, 'AddDocumentForm');
      onFileChange(null);
    }
  };

  const handleLogin = () => {
    if (contactId) {
      localStorage.setItem('returnToContactId', contactId);
      sessionStorage.setItem('returnToContactId', contactId);
    }
    window.location.href = '/login';
  };

  return (
    <div className="document-form-container">
      <GoogleDriveIntegration
        condensed 
        returnTo={contactId}
      />
      
      {!userAuthenticated ? (
        <>
          <Alert
            message="Authentication Required"
            description="Log in before connecting to Google Drive or uploading."
            type="warning"
            showIcon
            style={{ marginBottom: 16, marginTop: 16 }}
          />
          <Button type="primary" onClick={handleLogin} style={{ marginBottom: 16 }}>
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
          description="Connect to Google Drive using the controls above before uploading."
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
          >
            <Upload
              beforeUpload={() => false}
              onChange={handleFileChangeInternal}
              fileList={fileList}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />} disabled={addDocumentLoader}>
                Select File
              </Button>
              <div className="upload-hint">Max file size: 5MB</div>
            </Upload>
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            className="addReferralFormInput"
            rules={[
              { required: true, message: "Description is mandatory!" },
            ]}
          >
            <TextArea
              placeholder="Enter document description"
              maxLength={499}
              disabled={addDocumentLoader}
              onChange={(e) => onDescriptionChange(e.target.value)}
            />
          </Form.Item>
        </>
      )}
    </div>
  );
};

export default AddDocumentForm; 