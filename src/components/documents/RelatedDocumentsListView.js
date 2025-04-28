import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Button, Tooltip, Popconfirm, Skeleton, Modal, Form, Alert, message } from "antd";
import "../../styles/documents/allDocuments.css";
import { DataGrid, } from "@mui/x-data-grid";
import { PlusOutlined, FileOutlined, DownloadOutlined, DeleteOutlined, InboxOutlined } from "@ant-design/icons";
import { useAppSelector, useAppDispatch } from '../../redux/app/hooks';
import { checkGoogleConnection, getContactDocumentsThunk, deleteDocumentAndRefresh, resetDocument, resetDocuments, uploadDocumentThunk } from '../../redux/features/documentSlice';
import AddDocumentForm from './AddDocumentForm';
import debugLog from '../../utils/debugLog';
const RelatedDocumentsListView = ({ contactId }) => {
    const dispatch = useAppDispatch();
    const [form] = Form.useForm();
    // Validate contactId immediately to prevent issues
    const [validContactId, setValidContactId] = useState(true);
    useEffect(() => {
        // Check if contactId is valid (not empty, not "[object Object]")
        if (!contactId || contactId === '[object Object]') {
            debugLog('RelatedDocumentsListView: Invalid contactId detected:', contactId, 'RelatedDocumentsListView');
            setValidContactId(false);
        }
        else {
            setValidContactId(true);
        }
    }, [contactId]);
    const { documents: reduxDocuments, getDocumentLoader, totalDocuments, isGoogleConnected, addDocumentLoader } = useAppSelector((state) => state.documents);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    // State for the document form
    const [uploadFile, setUploadFile] = useState(null);
    const [uploadDescription, setUploadDescription] = useState('');
    const [uploadFileList, setUploadFileList] = useState([]);
    const [uploadStartTime, setUploadStartTime] = useState(null);
    const [uploadEndTime, setUploadEndTime] = useState(null);
    const [uploadDocumentType, setUploadDocumentType] = useState(null);
    const [uploadCustomDocumentType, setUploadCustomDocumentType] = useState('');
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
            fileSize: 1024 * 1024,
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
            fileSize: 512 * 1024,
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
            renderCell: (params) => (_jsxs("div", { className: "hyperlinkBlue", children: [_jsx(FileOutlined, { style: { marginRight: 8 } }), params?.row?.fileName || "Unnamed Document"] })),
        },
        {
            field: "description",
            headerName: "DESCRIPTION",
            width: 300,
            renderCell: (params) => (_jsx("div", { children: params?.row?.description || "--" })),
        },
        {
            field: "documentType",
            headerName: "TYPE",
            width: 150,
            renderCell: (params) => {
                // Display customDocumentType if available and documentType is 'OTHER', otherwise show documentType
                const displayType = params?.row?.documentType === 'OTHER' && params?.row?.customDocumentType
                    ? params?.row?.customDocumentType
                    : params?.row?.documentType || params?.row?.fileType || "--";
                return _jsx("div", { children: displayType });
            },
        },
        {
            field: "startTime",
            headerName: "START DATE",
            width: 150,
            renderCell: (params) => {
                if (!params?.row?.startTime)
                    return _jsx("div", { children: "--" });
                // Format the date using toLocaleDateString
                const date = new Date(params?.row?.startTime);
                return _jsx("div", { children: !isNaN(date.getTime()) ? date.toLocaleDateString() : "--" });
            },
        },
        {
            field: "endTime",
            headerName: "END DATE",
            width: 150,
            renderCell: (params) => {
                if (!params?.row?.endTime)
                    return _jsx("div", { children: "--" });
                // Format the date using toLocaleDateString
                const date = new Date(params?.row?.endTime);
                return _jsx("div", { children: !isNaN(date.getTime()) ? date.toLocaleDateString() : "--" });
            },
        },
        {
            field: "uploadedBy",
            headerName: "OWNER",
            width: 200,
            renderCell: (params) => {
                const uploadedBy = params?.row?.uploadedBy;
                const uploaderName = uploadedBy ?
                    `${uploadedBy.firstName || ''} ${uploadedBy.lastName || ''}`.trim() :
                    "--";
                return _jsx("div", { children: uploaderName });
            },
        },
        {
            field: "actions",
            headerName: "ACTIONS",
            width: 120,
            renderCell: (params) => (_jsxs("div", { className: "action-buttons", children: [_jsx(Tooltip, { title: "Download", children: _jsx("a", { href: params?.row?.googleDriveLink || "#", target: "_blank", rel: "noopener noreferrer", className: "action-button", children: _jsx(DownloadOutlined, {}) }) }), _jsx(Tooltip, { title: "Delete", children: _jsx(Popconfirm, { title: "Delete this document", description: "Are you sure you want to delete this document?", onConfirm: () => handleDelete(params?.row?.id), okText: "Yes", cancelText: "Cancel", children: _jsx(DeleteOutlined, { className: "delete-icon action-button" }) }) })] })),
        },
    ];
    // Custom component for displaying when no data is available
    const NoRowsOverlay = () => {
        return (_jsxs("div", { style: {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem',
                height: '100%',
                width: '100%',
                backgroundColor: '#fff',
                borderRadius: '8px'
            }, children: [_jsx(InboxOutlined, { style: { fontSize: '3rem', color: '#bfbfbf', marginBottom: '1rem' } }), _jsx("p", { children: "No documents found for this contact" }), _jsx(Button, { type: "primary", onClick: () => setIsModalOpen(true), style: { marginTop: '1rem' }, icon: _jsx(PlusOutlined, {}), children: "Upload New Document" })] }));
    };
    // Handlers
    const handleSelectionChange = (newSelection) => {
        setSelectedRowKeys(newSelection);
    };
    const handleDelete = async (documentId) => {
        try {
            debugLog('Deleting document:', { documentId, contactId }, 'RelatedDocumentsListView');
            await dispatch(deleteDocumentAndRefresh({
                documentId,
                contactId,
                params
            })).unwrap();
        }
        catch (error) {
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
        debugLog('[RelatedDocs Submit] Initiated', {
            hasFile: !!uploadFile,
            description: uploadDescription,
            isConnected: isGoogleConnected,
            documentType: uploadDocumentType,
            hasCustomType: !!uploadCustomDocumentType,
            hasStartTime: !!uploadStartTime,
            hasEndTime: !!uploadEndTime
        }, 'RelatedDocumentsListView');
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
            debugLog('[RelatedDocs Submit] Dispatching uploadDocumentThunk', {
                fileName: uploadFile.name,
                contactId,
                description: uploadDescription,
                documentType: uploadDocumentType,
                customDocumentType: uploadCustomDocumentType,
                startTime: uploadStartTime,
                endTime: uploadEndTime
            }, 'RelatedDocumentsListView');
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
        }
        catch (error) {
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
    const handleFileChangeFromForm = (file) => {
        setUploadFile(file);
        setUploadFileList(file ? [{ uid: '-1', name: file.name, status: 'done', originFileObj: file }] : []);
    };
    // Update description state
    const handleDescriptionChangeFromForm = (description) => {
        setUploadDescription(description);
    };
    // Handle document type change
    const handleDocumentTypeChange = (documentType) => {
        setUploadDocumentType(documentType);
    };
    // Handle custom document type change
    const handleCustomDocumentTypeChange = (customType) => {
        setUploadCustomDocumentType(customType);
    };
    // Handle start time change
    const handleStartTimeChange = (startTime) => {
        setUploadStartTime(startTime);
    };
    // Handle end time change
    const handleEndTimeChange = (endTime) => {
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
    return (_jsx(_Fragment, { children: !validContactId ? (_jsx(Alert, { message: "Invalid Contact ID", description: "Cannot load or upload documents.", type: "error", showIcon: true, style: { margin: '20px 0' } })) : (_jsxs(_Fragment, { children: [_jsx("div", { children: _jsx(Modal, { open: isModalOpen, onCancel: handleCancel, footer: null, destroyOnClose: true, children: _jsxs("div", { className: "addActivityFormDiv", children: [_jsx("div", { className: "addActivityTitle", children: "Upload New Document" }), _jsx("div", { className: "addActivityFormWrapper", children: _jsxs(Form, { form: form, name: "documentForm", onFinish: handleSubmit, layout: "vertical", children: [_jsx(AddDocumentForm, { contactId: contactId, onFileChange: handleFileChangeFromForm, onDescriptionChange: handleDescriptionChangeFromForm, onDocumentTypeChange: handleDocumentTypeChange, onCustomDocumentTypeChange: handleCustomDocumentTypeChange, onStartTimeChange: handleStartTimeChange, onEndTimeChange: handleEndTimeChange, fileList: uploadFileList }), _jsxs(Form.Item, { className: "addActivitySubmitBtnWrapper", style: { marginTop: '24px' }, children: [_jsx(Button, { onClick: handleCancel, className: "addActivityCancelBtn", style: { marginRight: 8 }, children: "Cancel" }), _jsx(Button, { type: "primary", htmlType: "submit" // This button triggers the form's onFinish
                                                        , className: "addActivitySubmitBtn", loading: addDocumentLoader, disabled: !isGoogleConnected || !uploadFile, children: "Upload Document" })] })] }) })] }) }) }), _jsxs("div", { className: "listViewBackWrapper", children: [_jsx("div", { className: "activitiesListToolbarWrapper", children: _jsx("div", { className: "activitiesListToolbarItem", children: _jsxs("div", { className: "tableTitleIconWrapper", children: [_jsx(FileOutlined, { className: "illustrationIcon" }), "Documents", _jsx(Button, { onClick: showModal, className: "addOpportunityModalBtn", children: "Upload New" })] }) }) }), _jsx("div", { className: "listTableContainer", children: getDocumentLoader ? (_jsx("div", { style: { padding: '2rem' }, children: _jsx(Skeleton, { active: true }) })) : (_jsx(DataGrid, { rows: documents, columns: columns, autoHeight: true, getRowId: (row) => row.id || row.documentId || `fallback-${Math.random()}`, slots: {
                                    noRowsOverlay: NoRowsOverlay
                                }, checkboxSelection: true, onRowSelectionModelChange: handleSelectionChange, rowSelectionModel: selectedRowKeys, pagination: true, paginationModel: {
                                    page: params.page - 1,
                                    pageSize: params.limit,
                                }, rowCount: documents.length, paginationMode: "server", onPaginationModelChange: (model) => {
                                    setParams({
                                        ...params,
                                        page: model.page + 1,
                                        limit: model.pageSize,
                                    });
                                }, sx: {
                                    minHeight: '400px',
                                    backgroundColor: '#fff',
                                } })) })] })] })) }));
};
export default RelatedDocumentsListView;
