import { useEffect, useState } from "react";
import { Button, Form, Input, Modal, Popconfirm, Spin, Tooltip } from "antd";
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
      headerName: "UPLOADED BY",
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