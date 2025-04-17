import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Upload, message, Tooltip, Divider, Alert, Spin, DatePicker, Select } from 'antd';
import { UploadOutlined, FileOutlined, GoogleOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../../redux/app/hooks';
import { RootState } from '../../redux/app/store';
import { checkGoogleConnection } from '../../redux/features/documentSlice';
import TextArea from 'antd/es/input/TextArea';
import { getGoogleAuthUrl } from '../../services/documentService';
import debugLog from '../../utils/debugLog';
import GoogleDriveIntegration from './GoogleDriveIntegration';

const { Option } = Select;

// Document type options
const DOCUMENT_TYPES = [
  { value: 'NDA', label: 'NDA (Non-Disclosure Agreement)' },
  { value: 'MSA', label: 'MSA (Master Service Agreement)' },
  { value: 'SOW', label: 'SOW (Statement of Work)' },
  { value: 'SLA', label: 'SLA (Service Level Agreement)' },
  { value: 'AMC', label: 'AMC (Annual Maintenance Contract)' },
  { value: 'MOU', label: 'MOU (Memorandum of Understanding)' },
  { value: 'OTHER', label: 'Other (Custom document type)' }
];

interface AddDocumentFormProps {
  contactId: string;
  onFileChange: (file: File | null) => void;
  onDescriptionChange: (description: string) => void;
  onStartTimeChange?: (startTime: string | null) => void;
  onEndTimeChange?: (endTime: string | null) => void;
  onDocumentTypeChange?: (documentType: string | null) => void;
  onCustomDocumentTypeChange?: (customType: string) => void;
  fileList: any[];
}

const AddDocumentForm: React.FC<AddDocumentFormProps> = ({ 
  contactId, 
  onFileChange, 
  onDescriptionChange,
  onStartTimeChange = () => {},
  onEndTimeChange = () => {},
  onDocumentTypeChange = () => {},
  onCustomDocumentTypeChange = () => {},
  fileList
}) => {
  const dispatch = useAppDispatch();
  const { isGoogleConnected, checkingGoogleConnection, addDocumentLoader } = useAppSelector(
    (state: RootState) => state.documents
  );
  
  const [connectionError, setConnectionError] = useState<string>('');
  const [userAuthenticated, setUserAuthenticated] = useState<boolean>(true);
  const [selectedDocumentType, setSelectedDocumentType] = useState<string | null>(null);

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

  const handleDocumentTypeChange = (value: string) => {
    setSelectedDocumentType(value);
    onDocumentTypeChange(value);
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

          {/* New Fields for the enhanced API */}
          <Form.Item
            name="documentType"
            label="Document Type"
            className="addReferralFormInput"
          >
            <Select
              placeholder="Select document type"
              onChange={handleDocumentTypeChange}
              disabled={addDocumentLoader}
            >
              {DOCUMENT_TYPES.map(type => (
                <Option key={type.value} value={type.value}>{type.label}</Option>
              ))}
            </Select>
          </Form.Item>

          {/* Conditional field for custom document type */}
          {selectedDocumentType === 'OTHER' && (
            <Form.Item
              name="customDocumentType"
              label="Custom Document Type"
              className="addReferralFormInput"
              rules={[
                { required: true, message: "Please specify the document type!" },
              ]}
            >
              <Input 
                placeholder="Enter custom document type"
                onChange={(e) => onCustomDocumentTypeChange(e.target.value)}
                disabled={addDocumentLoader}
              />
            </Form.Item>
          )}

          <Form.Item
            name="startTime"
            label="Start Date"
            className="addReferralFormInput"
          >
            <DatePicker 
              style={{ width: '100%' }}
              onChange={(date) => onStartTimeChange(date ? date.toISOString() : null)}
              disabled={addDocumentLoader}
              placeholder="Select start date (optional)"
            />
          </Form.Item>

          <Form.Item
            name="endTime"
            label="End Date"
            className="addReferralFormInput"
          >
            <DatePicker 
              style={{ width: '100%' }}
              onChange={(date) => onEndTimeChange(date ? date.toISOString() : null)}
              disabled={addDocumentLoader}
              placeholder="Select end date (optional)"
            />
          </Form.Item>
        </>
      )}
    </div>
  );
};

export default AddDocumentForm; 