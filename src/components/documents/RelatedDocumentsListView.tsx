import { useEffect, useState } from "react";
import { Button, Tooltip, Popconfirm, Skeleton, Modal, Form, Alert, message } from "antd";
import "../../styles/documents/allDocuments.css";
import {
  DataGrid,
  GridCellParams,
  GridRowId,
  GridRowSelectionModel,
} from "@mui/x-data-grid";
import { PlusOutlined, FileOutlined, DownloadOutlined, DeleteOutlined, InboxOutlined } from "@ant-design/icons";
import { useAppSelector, useAppDispatch } from '../../redux/app/hooks';
import { RootState } from '../../redux/app/store';
import { 
  checkGoogleConnection, 
  getContactDocumentsThunk,
  deleteDocumentAndRefresh,
  resetDocument,
  resetDocuments,
  uploadDocumentThunk
} from '../../redux/features/documentSlice';
import AddDocumentForm from './AddDocumentForm';
import debugLog from '../../utils/debugLog';

interface RelatedDocumentsListViewProps {
  contactId: string;
}

const RelatedDocumentsListView: React.FC<RelatedDocumentsListViewProps> = ({ contactId }) => {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  
  // Validate contactId immediately to prevent issues
  const [validContactId, setValidContactId] = useState<boolean>(true);
  
  useEffect(() => {
    // Check if contactId is valid (not empty, not "[object Object]")
    if (!contactId || contactId === '[object Object]') {
      debugLog('RelatedDocumentsListView: Invalid contactId detected:', contactId, 'RelatedDocumentsListView');
      setValidContactId(false);
    } else {
      setValidContactId(true);
    }
  }, [contactId]);
  
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

  // HARDCODED TEST DATA - This should absolutely display regardless of API or Redux
  const testDocuments = [
    {
      id: "test-1",
      documentId: "test-1",
      fileName: "Test Document 1.pdf",
      description: "This is a test document for debugging",
      googleDriveLink: "#",
      googleDriveFileId: "test-id-1",
      contactId: contactId,
      uploadedBy: {
        userId: "test-user-id",
        firstName: "Test",
        lastName: "User",
        email: "test@example.com"
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      fileType: "pdf",
      fileSize: 1024 * 1024, // 1MB
      deletedAt: null,
      modifiedBy: null
    },
    {
      id: "test-2",
      documentId: "test-2",
      fileName: "Test Document 2.docx",
      description: "Another test document for debugging",
      googleDriveLink: "#",
      googleDriveFileId: "test-id-2",
      contactId: contactId,
      uploadedBy: {
        userId: "test-user-id",
        firstName: "Test",
        lastName: "User",
        email: "test@example.com"
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      fileType: "docx",
      fileSize: 512 * 1024, // 512KB
      deletedAt: null,
      modifiedBy: null
    }
  ];
  
  // Use test documents if no documents from Redux
  const documents = reduxDocuments.length > 0 ? reduxDocuments : testDocuments;
  
  // The main columns for the DataGrid
  const columns = [
    {
      field: "fileName",
      headerName: "FILE NAME",
      width: 250,
      renderCell: (params: GridCellParams) => (
        <div className="hyperlinkBlue">
          <FileOutlined style={{ marginRight: 8 }} />
          {params?.row?.fileName || "Unnamed Document"}
        </div>
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
              href={params?.row?.googleDriveLink || "#"}
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

  // Custom component for displaying when no data is available
  const NoRowsOverlay = () => {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '2rem', 
        height: '100%',
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: '8px'
      }}>
        <InboxOutlined style={{ fontSize: '3rem', color: '#bfbfbf', marginBottom: '1rem' }} />
        <p>No documents found for this contact</p>
        <Button 
          type="primary" 
          onClick={() => setIsModalOpen(true)} 
          style={{ marginTop: '1rem' }}
          icon={<PlusOutlined />}
        >
          Upload New Document
        </Button>
      </div>
    );
  };
  
  // Handlers
  const handleSelectionChange = (newSelection: GridRowSelectionModel) => {
    setSelectedRowKeys(newSelection);
  };

  const handleDelete = async (documentId: string) => {
    try {
      debugLog('Deleting document:', { documentId, contactId }, 'RelatedDocumentsListView');
      await dispatch(deleteDocumentAndRefresh({
        documentId,
        contactId,
        params
      })).unwrap();
    } catch (error) {
      debugLog('Error deleting document:', error, 'RelatedDocumentsListView');
    }
  };

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

  // This is the function called when the Modal Form's Upload button is clicked
  const handleSubmit = async () => {
    debugLog('[RelatedDocs Submit] Initiated', 
      { 
        hasFile: !!uploadFile, 
        description: uploadDescription, 
        isConnected: isGoogleConnected,
        documentType: uploadDocumentType,
        hasCustomType: !!uploadCustomDocumentType,
        hasStartTime: !!uploadStartTime,
        hasEndTime: !!uploadEndTime
      }, 
      'RelatedDocumentsListView'
    );

    // Perform validation before dispatching
    if (!uploadFile) {
      message.error('Please select a file to upload');
      debugLog('[RelatedDocs Submit] Failed: No file selected', null, 'RelatedDocumentsListView');
      return;
    }
    if (!uploadDescription || uploadDescription.trim() === '') {
      message.error('Please enter a description for the document');
      debugLog('[RelatedDocs Submit] Failed: No description entered', null, 'RelatedDocumentsListView');
      return;
    }
    if (!isGoogleConnected) {
      message.error('Google Drive is not connected. Please connect first.');
      debugLog('[RelatedDocs Submit] Failed: Google Drive not connected', null, 'RelatedDocumentsListView');
      return;
    }
    
    // Validate custom document type if 'OTHER' is selected
    if (uploadDocumentType === 'OTHER' && (!uploadCustomDocumentType || uploadCustomDocumentType.trim() === '')) {
      message.error('Please specify the custom document type');
      debugLog('[RelatedDocs Submit] Failed: No custom document type for OTHER', null, 'RelatedDocumentsListView');
      return;
    }
    
    try {
      debugLog('[RelatedDocs Submit] Dispatching uploadDocumentThunk', 
        { 
          fileName: uploadFile.name, 
          contactId, 
          description: uploadDescription,
          documentType: uploadDocumentType,
          customDocumentType: uploadCustomDocumentType,
          startTime: uploadStartTime,
          endTime: uploadEndTime
        }, 
        'RelatedDocumentsListView'
      );
      
      // Dispatch the thunk directly from the parent with all fields
      await dispatch(uploadDocumentThunk({
        file: uploadFile,
        description: uploadDescription,
        contactId,
        startTime: uploadStartTime,
        endTime: uploadEndTime,
        documentType: uploadDocumentType,
        customDocumentType: uploadCustomDocumentType
      })).unwrap();
      
      debugLog('[RelatedDocs Submit] Upload successful', null, 'RelatedDocumentsListView');
      
      setIsModalOpen(false); // Close modal on success
      handleResetForm(); // Reset form state
      dispatch(getContactDocumentsThunk({ contactId, params })); // Refresh document list
      
    } catch (error) {
      // Error message is already handled by the thunk/slice
      debugLog('[RelatedDocs Submit] Caught error from uploadDocumentThunk', error, 'RelatedDocumentsListView');
    }
  };

  const showModal = () => {
    handleResetForm();
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    handleResetForm();
  };

  // Update file state when AddDocumentForm reports a change
  const handleFileChangeFromForm = (file: File | null) => {
    setUploadFile(file);
    setUploadFileList(file ? [{ uid: '-1', name: file.name, status: 'done', originFileObj: file }] : []);
  };

  // Update description state
  const handleDescriptionChangeFromForm = (description: string) => {
    setUploadDescription(description);
  };
  
  // Handle document type change
  const handleDocumentTypeChange = (documentType: string | null) => {
    setUploadDocumentType(documentType);
  };
  
  // Handle custom document type change
  const handleCustomDocumentTypeChange = (customType: string) => {
    setUploadCustomDocumentType(customType);
  };
  
  // Handle start time change
  const handleStartTimeChange = (startTime: string | null) => {
    setUploadStartTime(startTime);
  };
  
  // Handle end time change
  const handleEndTimeChange = (endTime: string | null) => {
    setUploadEndTime(endTime);
  };

  // Fetch documents on component mount and when params change
  useEffect(() => {
    if (validContactId) { // Only fetch if contactId is valid
      debugLog('Fetching documents for contact', { contactId, params }, 'RelatedDocumentsListView');
      dispatch(checkGoogleConnection());
      dispatch(getContactDocumentsThunk({ contactId, params }));
    }

    return () => {
      dispatch(resetDocuments());
      dispatch(resetDocument());
    };
  }, [dispatch, contactId, params, validContactId]); // Added validContactId

  // ADDING A TEST LOG HERE
  console.log(`>>> RelatedDocumentsListView Rendering! Contact ID: ${contactId}, isGoogleConnected: ${isGoogleConnected}`);

  // Render the component
  return (
    <>
      {!validContactId ? (
        <Alert
          message="Invalid Contact ID"
          description="Cannot load or upload documents."
          type="error"
          showIcon
          style={{ margin: '20px 0' }}
        />
      ) : (
        <>
          <div>
            <Modal
              open={isModalOpen}
              onCancel={handleCancel}
              footer={null} // Use Form's submit button
              destroyOnClose
            >
              <div className="addActivityFormDiv">
                <div className="addActivityTitle">Upload New Document</div>

                <div className="addActivityFormWrapper">
                  {/* Form now triggers this component's handleSubmit */}
                  <Form form={form} name="documentForm" onFinish={handleSubmit} layout="vertical">
                    <AddDocumentForm
                      contactId={contactId}
                      onFileChange={handleFileChangeFromForm}
                      onDescriptionChange={handleDescriptionChangeFromForm}
                      onDocumentTypeChange={handleDocumentTypeChange}
                      onCustomDocumentTypeChange={handleCustomDocumentTypeChange}
                      onStartTimeChange={handleStartTimeChange}
                      onEndTimeChange={handleEndTimeChange}
                      fileList={uploadFileList}
                    />
                    <Form.Item className="addActivitySubmitBtnWrapper" style={{ marginTop: '24px' }}>
                      <Button
                        onClick={handleCancel}
                        className="addActivityCancelBtn"
                        style={{ marginRight: 8 }}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="primary"
                        htmlType="submit" // This button triggers the form's onFinish
                        className="addActivitySubmitBtn"
                        loading={addDocumentLoader}
                        disabled={!isGoogleConnected || !uploadFile}
                      >
                        Upload Document
                      </Button>
                    </Form.Item>
                  </Form>
                </div>
              </div>
            </Modal>
          </div>

          <div className="listViewBackWrapper">
            <div className="activitiesListToolbarWrapper">
              <div className="activitiesListToolbarItem">
                <div className="tableTitleIconWrapper">
                  <FileOutlined className="illustrationIcon" />
                  Documents
                  <Button onClick={showModal} className="addOpportunityModalBtn">
                    Upload New
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="listTableContainer">
              {getDocumentLoader ? (
                <div style={{ padding: '2rem' }}>
                  <Skeleton active />
                </div>
              ) : (
                <DataGrid
                  rows={documents}
                  columns={columns}
                  autoHeight
                  getRowId={(row) => row.id || row.documentId || `fallback-${Math.random()}`}
                  slots={{
                    noRowsOverlay: NoRowsOverlay
                  }}
                  checkboxSelection
                  onRowSelectionModelChange={handleSelectionChange}
                  rowSelectionModel={selectedRowKeys}
                  pagination
                  paginationModel={{
                    page: params.page - 1,
                    pageSize: params.limit,
                  }}
                  rowCount={documents.length}
                  paginationMode="server"
                  onPaginationModelChange={(model) => {
                    setParams({
                      ...params,
                      page: model.page + 1,
                      limit: model.pageSize,
                    });
                  }}
                  sx={{ 
                    minHeight: '400px',
                    backgroundColor: '#fff',
                  }}
                />
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default RelatedDocumentsListView;