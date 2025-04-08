import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Upload, message, Tooltip } from 'antd';
import { UploadOutlined, FileOutlined, GoogleOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../../redux/app/hooks';
import { RootState } from '../../redux/app/store';
import { checkGoogleConnection, getGoogleAuth, uploadDocumentThunk } from '../../redux/features/documentSlice';
import TextArea from 'antd/es/input/TextArea';

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

  // Check Google Drive connection on component mount
  useEffect(() => {
    dispatch(checkGoogleConnection());
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

  // Handle Google Drive connection
  const handleConnectGoogleDrive = async () => {
    try {
      const result = await dispatch(getGoogleAuth()).unwrap();
      // Store current location to return after auth
      localStorage.setItem('googleAuthRedirect', window.location.pathname);
      // Redirect to Google auth URL
      window.location.href = result.url;
    } catch (error) {
      console.error('Error getting Google auth URL:', error);
      message.error('Failed to connect to Google Drive. Please try again.');
    }
  };

  // Handle form submission
  const handleSubmit = async (values: { description: string }) => {
    if (!file) {
      message.error('Please select a file to upload');
      return;
    }
    
    // Comment out the Google Drive connection check
    // if (!isGoogleConnected) {
    //   message.error('Please connect to Google Drive first');
    //   return;
    // }
    
    // Add a notice that we're bypassing Google Drive
    if (!isGoogleConnected) {
      console.log("[OVERRIDE] Bypassing Google Drive requirement for uploads");
      // message.warning('Google Drive not connected. Document metadata will be saved but file might not be accessible.');
    }
    
    try {
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
      console.error('Error uploading document:', error);
    }
  };

  return (
    <div>
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
        {/* Comment out the conditional rendering based on Google Drive connection */}
        {/*!isGoogleConnected ? (
          <div className="google-connection-warning">
            <Button 
              type="primary" 
              icon={<GoogleOutlined />} 
              onClick={handleConnectGoogleDrive}
              loading={checkingGoogleConnection}
            >
              Connect to Google Drive
            </Button>
            <div className="google-connection-message">
              Connect to Google Drive to upload documents
            </div>
          </div>
        ) : (*/}
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
              {!isGoogleConnected && (
                <div style={{ color: 'orange', marginTop: '5px' }}>
                  Note: Google Drive not connected. Documents can be uploaded but may have limited functionality.
                </div>
              )}
            </div>
          </Upload>
        {/*)*/}
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
    </div>
  );
};

export default AddDocumentForm; 