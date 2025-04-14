import { useEffect, useState } from "react";
import { Button, Tooltip, Popconfirm, Skeleton, Modal, Form, Alert } from "antd";
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
  resetDocuments
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
      field: "fileType",
      headerName: "TYPE",
      width: 100,
      renderCell: (params: GridCellParams) => (
        <div>{params?.row?.fileType || "--"}</div>
      ),
    },
    {
      field: "fileSize",
      headerName: "SIZE",
      width: 100,
      renderCell: (params: GridCellParams) => (
        <div>{params?.row?.fileSize ? `${(params?.row?.fileSize / 1024).toFixed(2)} KB` : "--"}</div>
      ),
    },
    {
      field: "uploadedBy",
      headerName: "UPLOADED BY",
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
      field: "createdAt",
      headerName: "UPLOADED ON",
      width: 210,
      renderCell: (params: GridCellParams) => {
        const date = params?.row?.createdAt ? 
          new Date(params.row.createdAt).toLocaleString() : 
          "--";
        return <div>{date}</div>;
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
    dispatch(resetDocument());
  };

  const handleSubmit = () => {
    setIsModalOpen(false);
    handleResetForm();
    dispatch(getContactDocumentsThunk({ contactId, params }));
  };

  const showModal = () => {
    setIsModalOpen(true);
    handleResetForm();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    handleResetForm();
  };

  // Fetch documents on component mount and when params change
  useEffect(() => {
    debugLog('Fetching documents for contact', { contactId, params }, 'RelatedDocumentsListView');
    dispatch(checkGoogleConnection());
    dispatch(getContactDocumentsThunk({ contactId, params }));

    return () => {
      dispatch(resetDocuments());
      dispatch(resetDocument());
    };
  }, [dispatch, contactId, params]);

  // Render the component
  return (
    <>
      {!validContactId ? (
        <Alert
          message="Invalid Contact ID"
          description="The contact ID is invalid or missing. Document uploads will not work properly. Please try refreshing the page or contact support."
          type="error"
          showIcon
          style={{ margin: '20px 0' }}
        />
      ) : (
        <>
          <div>
            <Modal
              open={isModalOpen}
              onOk={handleSubmit}
              onCancel={handleCancel}
              footer={false}
            >
              <div className="addActivityFormDiv">
                <div className="addActivityTitle">Upload New Document</div>

                <div className="addActivityFormWrapper">
                  <Form form={form} name="documentForm" onFinish={handleSubmit}>
                    <AddDocumentForm 
                      contactId={contactId} 
                      onUploadSuccess={handleSubmit}
                    />
                    <Form.Item className="addActivitySubmitBtnWrapper">
                      <Button
                        onClick={handleCancel}
                        className="addActivityCancelBtn"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="primary"
                        htmlType="submit"
                        className="addActivitySubmitBtn"
                        loading={addDocumentLoader}
                        disabled={!isGoogleConnected}
                      >
                        Upload
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