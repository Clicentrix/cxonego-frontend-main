import { useEffect, useState } from "react";
import { Button, Form, Input, Modal, Popconfirm, Spin, Tooltip, message } from "antd";
import {
  checkGoogleConnection,
  deleteDocumentAndRefresh,
  getContactDocumentsThunk,
  resetDocument,
  resetDocuments,
  uploadDocumentThunk,
} from "../../redux/features/documentSlice";
import {
  DataGrid,
  GridCellParams,
  GridPaginationModel,
  GridRowId,
  GridRowSelectionModel,
} from "@mui/x-data-grid";
import { RootState } from "../../redux/app/store";
import { useAppDispatch, useAppSelector } from "../../redux/app/hooks";
import AddDocumentForm from "./AddDocumentForm";
import { Document } from "../../services/documentService";
import { useNavigate } from "react-router-dom";
import { emptyValue } from "../../utilities/common/commonFunctions/handleBack";
import { PlusOutlined, FileOutlined, DownloadOutlined, DeleteOutlined } from "@ant-design/icons";
import "../../styles/documents/allDocuments.css";
import debugLog from "../../utils/debugLog";

interface AllDocumentsViewProps {
  contactId: string;
}

const AllDocumentsView: React.FC<AllDocumentsViewProps> = ({ contactId }) => {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  
  const { 
    documents, 
    getDocumentLoader, 
    addDocumentLoader, 
    isGoogleConnected, 
    checkingGoogleConnection,
    totalDocuments 
  } = useAppSelector((state: RootState) => state.documents);
  
  const { screenWidth } = useAppSelector((state: RootState) => state.referrals);
  const { user } = useAppSelector((state: RootState) => state.authentication);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<GridRowId[]>([]);
  
  // State for the AddDocumentForm managed by the parent
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadDescription, setUploadDescription] = useState<string>('');
  const [uploadFileList, setUploadFileList] = useState<any[]>([]); // For controlling the Upload component
  
  
  const initialParams = {
    page: 1,
    limit: 10,
    search: "",
  };

  const [params, setParams] = useState(initialParams);

  const onSearch = (value: string) => {
    setParams({ ...params, search: value });
  };
  
  const handleReset = () => {
    setParams(initialParams);
  };
  
  const columns = [
    {
      field: "name",
      headerName: "FILE NAME",
      width: 250,
      renderCell: (params: GridCellParams) => (
        <a href={params?.row?.fileUrl} target="_blank" rel="noopener noreferrer" className="hyperlinkBlue">
          <FileOutlined style={{ marginRight: 8 }} />
          {params?.row?.name || emptyValue}
        </a>
      ),
    },
    {
      field: "description",
      headerName: "DESCRIPTION",
      width: 300,
      renderCell: (params: GridCellParams) => (
        <div>{params?.row?.description || emptyValue}</div>
      ),
    },
    {
      field: "fileType",
      headerName: "TYPE",
      width: 100,
      renderCell: (params: GridCellParams) => (
        <div>{params?.row?.fileType || emptyValue}</div>
      ),
    },
    {
      field: "fileSize",
      headerName: "SIZE",
      width: 100,
      renderCell: (params: GridCellParams) => (
        <div>{params?.row?.fileSize ? `${(params?.row?.fileSize / 1024).toFixed(2)} KB` : emptyValue}</div>
      ),
    },
    {
      field: "uploadedByName",
      headerName: "OWNER",
      width: 200,
      renderCell: (params: GridCellParams) => (
        <div>{params?.row?.uploadedByName || emptyValue}</div>
      ),
    },
    {
      field: "createdAt",
      headerName: "UPLOADED ON",
      width: 210,
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
              onConfirm={() => handleSingleDelete(params?.row?.id)}
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

  const handleResetForm = () => {
    form.resetFields(); // Reset fields managed by Antd Form
    // Reset local state for the form
    setUploadFile(null);
    setUploadDescription('');
    setUploadFileList([]); 
    dispatch(resetDocument()); // Reset any related Redux state if needed
  };

  // This is the function called when the Modal Form's Upload button is clicked
  const handleSubmit = async () => {
    debugLog('[AllDocumentsView Submit] Initiated', 
      { hasFile: !!uploadFile, description: uploadDescription, isConnected: isGoogleConnected }, 
      'AllDocumentsView'
    );

    // Perform validation before dispatching
    if (!uploadFile) {
      message.error('Please select a file to upload');
      debugLog('[AllDocumentsView Submit] Failed: No file selected', null, 'AllDocumentsView');
      return;
    }
    if (!uploadDescription || uploadDescription.trim() === '') {
      message.error('Please enter a description for the document');
      debugLog('[AllDocumentsView Submit] Failed: No description entered', null, 'AllDocumentsView');
      return;
    }
    if (!isGoogleConnected) {
      message.error('Google Drive is not connected. Please connect first.');
      debugLog('[AllDocumentsView Submit] Failed: Google Drive not connected', null, 'AllDocumentsView');
      return;
    }
    
    try {
      debugLog('[AllDocumentsView Submit] Dispatching uploadDocumentThunk', 
        { fileName: uploadFile.name, contactId, description: uploadDescription }, 
        'AllDocumentsView'
      );
      
      // Dispatch the thunk directly from the parent
      await dispatch(uploadDocumentThunk({
        file: uploadFile,
        description: uploadDescription,
        contactId
      })).unwrap();
      
      debugLog('[AllDocumentsView Submit] Upload successful', null, 'AllDocumentsView');
      
      setIsModalOpen(false); // Close modal on success
      handleResetForm(); // Reset form state
      dispatch(getContactDocumentsThunk({ contactId, params })); // Refresh document list
      
    } catch (error) {
      // Error message is already handled by the thunk/slice
      debugLog('[AllDocumentsView Submit] Caught error from uploadDocumentThunk', error, 'AllDocumentsView');
      // Optionally, keep the modal open on error?
      // setIsModalOpen(true); 
    }
  };

  const showModal = () => {
    handleResetForm(); // Ensure form is reset when opening
    setIsModalOpen(true);
  };
  
  const handleCancel = () => {
    setIsModalOpen(false);
    handleResetForm();
  };

  const handleSingleDelete = (documentId: string) => {
    dispatch(deleteDocumentAndRefresh({
      documentId,
      contactId,
      params
    }));
  };

  const handleDelete = () => {
    // Delete multiple documents
    selectedRowKeys.forEach((documentId) => {
      dispatch(deleteDocumentAndRefresh({
        documentId: documentId as string,
        contactId,
        params
      }));
    });
    setSelectedRowKeys([]);
  };

  const handlePaginationChange = (paginationModel: GridPaginationModel) => {
    setParams({
      ...params,
      page: paginationModel.page + 1, // MUI DataGrid uses 0-based index for pages
      limit: paginationModel.pageSize,
    });
  };

  const handleSelectionChange = (newSelection: GridRowSelectionModel) => {
    setSelectedRowKeys(newSelection);
  };

  // Log the documents state to verify rendering
  console.log('Documents state in AllDocumentsView:', documents);

  // Update file state when AddDocumentForm reports a change
  const handleFileChangeFromForm = (file: File | null) => {
    setUploadFile(file);
    // Update fileList for the Upload component
    setUploadFileList(file ? [{ uid: '-1', name: file.name, status: 'done', originFileObj: file }] : []);
  };

  // Update description state
  const handleDescriptionChangeFromForm = (description: string) => {
    setUploadDescription(description);
    // Also update the Antd Form field value if needed, though not strictly necessary
    // form.setFieldsValue({ description }); 
  };

  useEffect(() => {
    dispatch(checkGoogleConnection());
    dispatch(getContactDocumentsThunk({ contactId, params }));
  }, [dispatch, contactId, params]);

  useEffect(() => {
    dispatch(resetDocument());
    dispatch(resetDocuments());
  }, [dispatch]);

  if (checkingGoogleConnection) {
    return <Spin tip="Checking Google Drive connection..." />;
  }


  return (
    <>
      <div>
        <Modal
          open={isModalOpen}
          // Remove onOk={handleSubmit} as submit is handled by Form's button
          onCancel={handleCancel}
          footer={null} // Use Form's submit button
          destroyOnClose // Ensure form state is reset when modal closes
        >
          <div className="addActivityFormDiv">
            <div className="addActivityTitle">Upload New Document</div>

            <div className="addActivityFormWrapper">
              {/* Form now triggers this component's handleSubmit */}
              <Form form={form} name="documentForm" onFinish={handleSubmit} layout="vertical">
                <AddDocumentForm 
                  contactId={contactId} 
                  // Pass state down and handlers up
                  onFileChange={handleFileChangeFromForm}
                  onDescriptionChange={handleDescriptionChangeFromForm}
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
                    disabled={!isGoogleConnected || !uploadFile} // Disable if not connected or no file
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
              {screenWidth < 768 ? (
                <Tooltip title={"Upload new document"}>
                  <PlusOutlined onClick={showModal} />
                </Tooltip>
              ) : (
                <Button onClick={showModal} className="addOpportunityModalBtn">
                  Upload New
                </Button>
              )}
            </div>

            {selectedRowKeys.length > 0 ? (
              <div className="activityDeleteBottomBar">
                <Popconfirm
                  title="Delete selected documents"
                  description="Are you sure you want to delete these documents?"
                  onConfirm={handleDelete}
                  okText="Yes"
                  cancelText="Cancel"
                >
                  <Button type="primary" danger style={{ marginLeft: "10px" }}>
                    Delete selected
                  </Button>
                </Popconfirm>
              </div>
            ) : null}
          </div>
          <div className="opportunitiesSearchResetBar">
            <Input
              placeholder="search here.."
              name="searchText"
              onChange={(e) => onSearch(e.target.value)}
              value={params?.search}
            />
            <Button onClick={handleReset} className="resetFilterBtn">
              Reset
            </Button>
          </div>
        </div>
        <div className="listTableContainer">
          <DataGrid
            checkboxSelection
            rows={documents}
            columns={columns}
            rowCount={totalDocuments}
            loading={getDocumentLoader}
            pageSizeOptions={[10, 25, 50]}
            paginationModel={{
              page: params.page - 1, // DataGrid uses 0-indexed pages
              pageSize: params.limit,
            }}
            onPaginationModelChange={handlePaginationChange}
            onRowSelectionModelChange={handleSelectionChange}
            rowSelectionModel={selectedRowKeys}
            getRowId={(row: Document) => row.id}
          />
        </div>
      </div>
    </>
  );
};

export default AllDocumentsView; 