import { useEffect, useState } from "react";
import { Button, Tooltip, Popconfirm, Skeleton, Modal, Form, Alert, message } from "antd";
import "../../styles/documents/allDocuments.css";
import {
  DataGrid,
  GridCellParams,
  GridPaginationModel,
  GridRowId,
  GridRowSelectionModel,
} from "@mui/x-data-grid";
import { PlusOutlined, FileOutlined, DownloadOutlined, DeleteOutlined, InboxOutlined } from "@ant-design/icons";
import { useAppSelector, useAppDispatch } from '../../redux/app/hooks';
import { RootState } from '../../redux/app/store';
import { 
  checkGoogleConnection, 
  getAccountDocumentsThunk,
  deleteDocumentAndRefresh,
  resetDocument,
  resetDocuments,
  uploadDocumentThunk
} from '../../redux/features/documentSlice';
import AddDocumentForm from '../documents/AddDocumentForm';
import debugLog from '../../utils/debugLog';

interface AccountDocumentsListViewProps {
  accountId: string;
}

const AccountDocumentsListView: React.FC<AccountDocumentsListViewProps> = ({ accountId }) => {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  
  // Validate accountId immediately to prevent issues
  const [validAccountId, setValidAccountId] = useState<boolean>(true);
  
  useEffect(() => {
    // Check if accountId is valid (not empty, not "[object Object]")
    if (!accountId || accountId === '[object Object]') {
      debugLog('AccountDocumentsListView: Invalid accountId detected:', accountId, 'AccountDocumentsListView');
      setValidAccountId(false);
    } else {
      setValidAccountId(true);
    }
  }, [accountId]);
  
  const { 
    documents: reduxDocuments, 
    getDocumentLoader,
    totalDocuments,
    isGoogleConnected,
    addDocumentLoader
  } = useAppSelector((state: RootState) => state.documents);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<GridRowId[]>([]);
  
  // State for the document form
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadDescription, setUploadDescription] = useState<string>('');
  const [uploadFileList, setUploadFileList] = useState<any[]>([]);
  const [uploadStartTime, setUploadStartTime] = useState<string | null>(null); 
  const [uploadEndTime, setUploadEndTime] = useState<string | null>(null);
  const [uploadDocumentType, setUploadDocumentType] = useState<string | null>(null);
  const [uploadCustomDocumentType, setUploadCustomDocumentType] = useState<string>('');
  
  const initialParams = {
    page: 1,
    limit: 10,
    search: "",
  };

  const [params, setParams] = useState(initialParams);

  // The main columns for the DataGrid
  const columns = [
    {
      field: "fileName",
      headerName: "FILE NAME",
      width: 250,
      renderCell: (params: GridCellParams) => (
        <a href={params?.row?.fileUrl} target="_blank" rel="noopener noreferrer" className="hyperlinkBlue">
          <FileOutlined style={{ marginRight: 8 }} />
          {params?.row?.fileName || "Unnamed Document"}
        </a>
      ),
    },
    {
      field: "description",
      headerName: "DESCRIPTION",
      width: 300,
      renderCell: (params: GridCellParams) => (
        <div>{params?.row?.description || "--"}</div>
      ),
    },
    {
      field: "documentType",
      headerName: "TYPE",
      width: 150,
      renderCell: (params: GridCellParams) => {
        // Display customDocumentType if available and documentType is 'OTHER', otherwise show documentType
        const displayType = 
          params?.row?.documentType === 'OTHER' && params?.row?.customDocumentType 
            ? params?.row?.customDocumentType 
            : params?.row?.documentType || params?.row?.fileType || "--";
        return <div>{displayType}</div>;
      },
    },
    {
      field: "startTime",
      headerName: "START DATE",
      width: 150,
      renderCell: (params: GridCellParams) => {
        if (!params?.row?.startTime) return <div>--</div>;
        // Format the date using toLocaleDateString
        const date = new Date(params?.row?.startTime);
        return <div>{!isNaN(date.getTime()) ? date.toLocaleDateString() : "--"}</div>;
      },
    },
    {
      field: "endTime",
      headerName: "END DATE",
      width: 150,
      renderCell: (params: GridCellParams) => {
        if (!params?.row?.endTime) return <div>--</div>;
        // Format the date using toLocaleDateString
        const date = new Date(params?.row?.endTime);
        return <div>{!isNaN(date.getTime()) ? date.toLocaleDateString() : "--"}</div>;
      },
    },
    {
      field: "uploadedBy",
      headerName: "OWNER",
      width: 200,
      renderCell: (params: GridCellParams) => {
        const uploadedBy = params?.row?.uploadedBy;
        const uploaderName = uploadedBy ? 
          `${uploadedBy.firstName || ''} ${uploadedBy.lastName || ''}`.trim() : 
          "--";
        return <div>{uploaderName}</div>;
      },
    },
    {
      field: "actions",
      headerName: "ACTIONS",
      width: 120,
      renderCell: (params: GridCellParams) => (
        <div className="action-buttons">
          <Tooltip title="Download">
            <a 
              href={params?.row?.fileUrl} 
              target="_blank"
              rel="noopener noreferrer"
              className="action-button"
            >
              <DownloadOutlined />
            </a>
          </Tooltip>
          <Tooltip title="Delete">
            <Popconfirm
              title="Delete this document"
              description="Are you sure you want to delete this document?"
              onConfirm={() => handleDelete(params?.row?.id)}
              okText="Yes"
              cancelText="Cancel"
            >
              <DeleteOutlined className="delete-icon action-button" />
            </Popconfirm>
          </Tooltip>
        </div>
      ),
    },
  ];

  // Empty state component when no documents are available
  const NoRowsOverlay = () => {
    return (
      <div className="no-rows-overlay">
        <InboxOutlined style={{ fontSize: 64, color: '#ccc', marginBottom: 16 }} />
        <p>No documents found</p>
        <Button type="primary" onClick={showModal}>Add Document</Button>
      </div>
    );
  };

  // Handle row selection in the DataGrid
  const handleSelectionChange = (newSelection: GridRowSelectionModel) => {
    setSelectedRowKeys(newSelection);
  };

  // Handle document deletion
  const handleDelete = async (documentId: string) => {
    if (!documentId) {
      message.error('Invalid document ID');
      return;
    }
    
    try {
      await dispatch(deleteDocumentAndRefresh({ 
        documentId, 
        accountId, 
        params,
        endpoint: 'account'  // Specify the endpoint type
      }));
    } catch (error) {
      console.error('Error deleting document:', error);
      message.error('Failed to delete document');
    }
  };

  // Reset the form state
  const handleResetForm = () => {
    form.resetFields();
    setUploadFile(null);
    setUploadDescription('');
    setUploadFileList([]);
    setUploadStartTime(null);
    setUploadEndTime(null);
    setUploadDocumentType(null);
    setUploadCustomDocumentType('');
    dispatch(resetDocument());
  };

  // Handle form submission
  const handleSubmit = async () => {
    debugLog('[AccountDocumentsListView Submit] Initiated', 
      { 
        hasFile: !!uploadFile, 
        description: uploadDescription, 
        isConnected: isGoogleConnected,
        documentType: uploadDocumentType,
        hasCustomType: !!uploadCustomDocumentType,
        hasStartTime: !!uploadStartTime,
        hasEndTime: !!uploadEndTime
      }, 
      'AccountDocumentsListView'
    );

    // Perform validation before dispatching
    if (!uploadFile) {
      message.error('Please select a file to upload');
      return;
    }
    if (!uploadDescription || uploadDescription.trim() === '') {
      message.error('Please enter a description for the document');
      return;
    }
    if (!isGoogleConnected) {
      message.error('Google Drive is not connected. Please connect first.');
      return;
    }
    
    // Validate custom document type if 'OTHER' is selected
    if (uploadDocumentType === 'OTHER' && (!uploadCustomDocumentType || uploadCustomDocumentType.trim() === '')) {
      message.error('Please specify the custom document type');
      return;
    }
    
    try {
      debugLog('[AccountDocumentsListView Submit] Dispatching uploadDocumentThunk', 
        { 
          fileName: uploadFile.name, 
          accountId, 
          description: uploadDescription,
          documentType: uploadDocumentType,
          customDocumentType: uploadCustomDocumentType,
          startTime: uploadStartTime,
          endTime: uploadEndTime
        }, 
        'AccountDocumentsListView'
      );
      
      // Dispatch the thunk with the account-specific parameters
      await dispatch(uploadDocumentThunk({
        file: uploadFile,
        description: uploadDescription,
        accountId, // Use accountId instead of contactId
        startTime: uploadStartTime,
        endTime: uploadEndTime,
        documentType: uploadDocumentType,
        customDocumentType: uploadCustomDocumentType,
        endpoint: 'account' // Specify the endpoint type
      }));
      
      // Reset form and close modal on success
      handleResetForm();
      setIsModalOpen(false);
      
      // Refresh the documents list
      dispatch(getAccountDocumentsThunk({ accountId, params, endpoint: 'account' }));
      
      message.success('Document uploaded successfully');
    } catch (error) {
      console.error('Error uploading document:', error);
      message.error('Failed to upload document');
    }
  };

  // Show the document upload modal
  const showModal = () => {
    setIsModalOpen(true);
  };

  // Cancel the document upload modal
  const handleCancel = () => {
    setIsModalOpen(false);
    handleResetForm();
  };

  // Form field handlers
  const handleFileChangeFromForm = (file: File | null) => {
    setUploadFile(file);
    setUploadFileList(file ? [{ uid: '-1', name: file.name, status: 'done', originFileObj: file }] : []);
  };

  const handleDescriptionChangeFromForm = (description: string) => {
    setUploadDescription(description);
  };

  const handleDocumentTypeChange = (documentType: string | null) => {
    setUploadDocumentType(documentType);
  };

  const handleCustomDocumentTypeChange = (customType: string) => {
    setUploadCustomDocumentType(customType);
  };

  const handleStartTimeChange = (startTime: string | null) => {
    setUploadStartTime(startTime);
  };

  const handleEndTimeChange = (endTime: string | null) => {
    setUploadEndTime(endTime);
  };

  // Fetch documents on component mount and when params change
  useEffect(() => {
    if (validAccountId) {
      dispatch(getAccountDocumentsThunk({ accountId, params, endpoint: 'account' }));
    }
  }, [dispatch, accountId, params, validAccountId]);

  // Check Google Drive connection on component mount
  useEffect(() => {
    dispatch(checkGoogleConnection());
  }, [dispatch]);

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      dispatch(resetDocuments());
      dispatch(resetDocument());
    };
  }, [dispatch]);

  if (!validAccountId) {
    return (
      <Alert
        message="Invalid Account ID"
        description="Cannot load documents due to an invalid account ID."
        type="error"
        showIcon
      />
    );
  }

  return (
    <div className="documents-container">
      <div className="documents-header">
        <h2>Account Documents</h2>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={showModal}
        >
          Add Document
        </Button>
      </div>
      
      <div style={{ height: 500, width: '100%' }}>
        {getDocumentLoader ? (
          <Skeleton active paragraph={{ rows: 10 }} />
        ) : (
          <DataGrid
            rows={reduxDocuments}
            columns={columns}
            pagination
            paginationMode="server"
            rowCount={totalDocuments}
            pageSize={params.limit}
            paginationModel={{
              page: params.page - 1,
              pageSize: params.limit,
            }}
            onPaginationModelChange={(model) => {
              setParams({
                ...params,
                page: model.page + 1,
                limit: model.pageSize,
              });
            }}
            onRowSelectionModelChange={handleSelectionChange}
            checkboxSelection
            disableRowSelectionOnClick
            getRowId={(row) => row.id}
            slots={{
              noRowsOverlay: NoRowsOverlay,
            }}
          />
        )}
      </div>
      
      <Modal
        title="Add Document"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button 
            key="submit" 
            type="primary" 
            onClick={handleSubmit}
            loading={addDocumentLoader}
            disabled={!isGoogleConnected || !uploadFile || !uploadDescription}
          >
            Upload
          </Button>
        ]}
        width={600}
      >
        <AddDocumentForm
          contactId={accountId} // We reuse the contactId prop from the component
          onFileChange={handleFileChangeFromForm}
          onDescriptionChange={handleDescriptionChangeFromForm}
          onStartTimeChange={handleStartTimeChange}
          onEndTimeChange={handleEndTimeChange}
          onDocumentTypeChange={handleDocumentTypeChange}
          onCustomDocumentTypeChange={handleCustomDocumentTypeChange}
          fileList={uploadFileList}
        />
      </Modal>
    </div>
  );
};

export default AccountDocumentsListView; 