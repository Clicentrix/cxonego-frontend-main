import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Button, Form, Input, Modal, Popconfirm, Spin, Tooltip, message } from "antd";
import { checkGoogleConnection, deleteDocumentAndRefresh, getContactDocumentsThunk, resetDocument, resetDocuments, uploadDocumentThunk, } from "../../redux/features/documentSlice";
import { DataGrid, } from "@mui/x-data-grid";
import { useAppDispatch, useAppSelector } from "../../redux/app/hooks";
import AddDocumentForm from "./AddDocumentForm";
import { useNavigate } from "react-router-dom";
import { emptyValue } from "../../utilities/common/commonFunctions/handleBack";
import { PlusOutlined, FileOutlined, DownloadOutlined, DeleteOutlined } from "@ant-design/icons";
import "../../styles/documents/allDocuments.css";
import debugLog from "../../utils/debugLog";
const AllDocumentsView = ({ contactId }) => {
    const dispatch = useAppDispatch();
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const { documents, getDocumentLoader, addDocumentLoader, isGoogleConnected, checkingGoogleConnection, totalDocuments } = useAppSelector((state) => state.documents);
    const { screenWidth } = useAppSelector((state) => state.referrals);
    const { user } = useAppSelector((state) => state.authentication);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    // State for the AddDocumentForm managed by the parent
    const [uploadFile, setUploadFile] = useState(null);
    const [uploadDescription, setUploadDescription] = useState('');
    const [uploadFileList, setUploadFileList] = useState([]); // For controlling the Upload component
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
    const onSearch = (value) => {
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
            renderCell: (params) => (_jsxs("a", { href: params?.row?.fileUrl, target: "_blank", rel: "noopener noreferrer", className: "hyperlinkBlue", children: [_jsx(FileOutlined, { style: { marginRight: 8 } }), params?.row?.name || emptyValue] })),
        },
        {
            field: "description",
            headerName: "DESCRIPTION",
            width: 300,
            renderCell: (params) => (_jsx("div", { children: params?.row?.description || emptyValue })),
        },
        {
            field: "documentType",
            headerName: "TYPE",
            width: 150,
            renderCell: (params) => {
                // Display customDocumentType if available and documentType is 'OTHER', otherwise show documentType
                const displayType = params?.row?.documentType === 'OTHER' && params?.row?.customDocumentType
                    ? params?.row?.customDocumentType
                    : params?.row?.documentType || params?.row?.fileType || emptyValue;
                return _jsx("div", { children: displayType });
            },
        },
        {
            field: "startTime",
            headerName: "START DATE",
            width: 150,
            renderCell: (params) => {
                if (!params?.row?.startTime)
                    return _jsx("div", { children: emptyValue });
                // Format the date using toLocaleDateString
                const date = new Date(params?.row?.startTime);
                return _jsx("div", { children: !isNaN(date.getTime()) ? date.toLocaleDateString() : emptyValue });
            },
        },
        {
            field: "endTime",
            headerName: "END DATE",
            width: 150,
            renderCell: (params) => {
                if (!params?.row?.endTime)
                    return _jsx("div", { children: emptyValue });
                // Format the date using toLocaleDateString
                const date = new Date(params?.row?.endTime);
                return _jsx("div", { children: !isNaN(date.getTime()) ? date.toLocaleDateString() : emptyValue });
            },
        },
        {
            field: "uploadedByName",
            headerName: "OWNER",
            width: 200,
            renderCell: (params) => {
                const fullName = params?.row?.uploadedBy ?
                    `${params.row.uploadedBy.firstName || ''} ${params.row.uploadedBy.lastName || ''}`.trim() :
                    params?.row?.uploadedByName || emptyValue;
                return _jsx("div", { children: fullName });
            },
        },
        {
            field: "actions",
            headerName: "ACTIONS",
            width: 120,
            renderCell: (params) => (_jsxs("div", { className: "action-buttons", children: [_jsx(Tooltip, { title: "Download", children: _jsx("a", { href: params?.row?.fileUrl, target: "_blank", rel: "noopener noreferrer", className: "action-button", children: _jsx(DownloadOutlined, {}) }) }), _jsx(Tooltip, { title: "Delete", children: _jsx(Popconfirm, { title: "Delete this document", description: "Are you sure you want to delete this document?", onConfirm: () => handleSingleDelete(params?.row?.id), okText: "Yes", cancelText: "Cancel", children: _jsx(DeleteOutlined, { className: "delete-icon action-button" }) }) })] })),
        },
    ];
    const handleResetForm = () => {
        form.resetFields(); // Reset fields managed by Antd Form
        // Reset all local state for the form
        setUploadFile(null);
        setUploadDescription('');
        setUploadFileList([]);
        setUploadStartTime(null);
        setUploadEndTime(null);
        setUploadDocumentType(null);
        setUploadCustomDocumentType('');
        dispatch(resetDocument()); // Reset any related Redux state if needed
    };
    // This is the function called when the Modal Form's Upload button is clicked
    const handleSubmit = async () => {
        debugLog('[AllDocumentsView Submit] Initiated', {
            hasFile: !!uploadFile,
            description: uploadDescription,
            isConnected: isGoogleConnected,
            documentType: uploadDocumentType,
            hasCustomType: !!uploadCustomDocumentType,
            hasStartTime: !!uploadStartTime,
            hasEndTime: !!uploadEndTime
        }, 'AllDocumentsView');
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
        // Validate custom document type if 'OTHER' is selected
        if (uploadDocumentType === 'OTHER' && (!uploadCustomDocumentType || uploadCustomDocumentType.trim() === '')) {
            message.error('Please specify the custom document type');
            debugLog('[AllDocumentsView Submit] Failed: No custom document type for OTHER', null, 'AllDocumentsView');
            return;
        }
        try {
            debugLog('[AllDocumentsView Submit] Dispatching uploadDocumentThunk', {
                fileName: uploadFile.name,
                contactId,
                description: uploadDescription,
                documentType: uploadDocumentType,
                customDocumentType: uploadCustomDocumentType,
                startTime: uploadStartTime,
                endTime: uploadEndTime
            }, 'AllDocumentsView');
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
            debugLog('[AllDocumentsView Submit] Upload successful', null, 'AllDocumentsView');
            setIsModalOpen(false); // Close modal on success
            handleResetForm(); // Reset form state
            dispatch(getContactDocumentsThunk({ contactId, params })); // Refresh document list
        }
        catch (error) {
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
    const handleSingleDelete = (documentId) => {
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
                documentId: documentId,
                contactId,
                params
            }));
        });
        setSelectedRowKeys([]);
    };
    const handlePaginationChange = (paginationModel) => {
        setParams({
            ...params,
            page: paginationModel.page + 1,
            limit: paginationModel.pageSize,
        });
    };
    const handleSelectionChange = (newSelection) => {
        setSelectedRowKeys(newSelection);
    };
    // Log the documents state to verify rendering
    console.log('Documents state in AllDocumentsView:', documents);
    // Update file state when AddDocumentForm reports a change
    const handleFileChangeFromForm = (file) => {
        setUploadFile(file);
        // Update fileList for the Upload component
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
    useEffect(() => {
        dispatch(checkGoogleConnection());
        dispatch(getContactDocumentsThunk({ contactId, params }));
    }, [dispatch, contactId, params]);
    useEffect(() => {
        dispatch(resetDocument());
        dispatch(resetDocuments());
    }, [dispatch]);
    if (checkingGoogleConnection) {
        return _jsx(Spin, { tip: "Checking Google Drive connection..." });
    }
    return (_jsxs(_Fragment, { children: [_jsx("div", { children: _jsx(Modal, { open: isModalOpen, 
                    // Remove onOk={handleSubmit} as submit is handled by Form's button
                    onCancel: handleCancel, footer: null, destroyOnClose // Ensure form state is reset when modal closes
                    : true, children: _jsxs("div", { className: "addActivityFormDiv", children: [_jsx("div", { className: "addActivityTitle", children: "Upload New Document" }), _jsx("div", { className: "addActivityFormWrapper", children: _jsxs(Form, { form: form, name: "documentForm", onFinish: handleSubmit, layout: "vertical", children: [_jsx(AddDocumentForm, { contactId: contactId, 
                                            // Pass state down and handlers up
                                            onFileChange: handleFileChangeFromForm, onDescriptionChange: handleDescriptionChangeFromForm, onDocumentTypeChange: handleDocumentTypeChange, onCustomDocumentTypeChange: handleCustomDocumentTypeChange, onStartTimeChange: handleStartTimeChange, onEndTimeChange: handleEndTimeChange, fileList: uploadFileList }), _jsxs(Form.Item, { className: "addActivitySubmitBtnWrapper", style: { marginTop: '24px' }, children: [_jsx(Button, { onClick: handleCancel, className: "addActivityCancelBtn", style: { marginRight: 8 }, children: "Cancel" }), _jsx(Button, { type: "primary", htmlType: "submit" // This button triggers the form's onFinish
                                                    , className: "addActivitySubmitBtn", loading: addDocumentLoader, disabled: !isGoogleConnected || !uploadFile, children: "Upload Document" })] })] }) })] }) }) }), _jsxs("div", { className: "listViewBackWrapper", children: [_jsxs("div", { className: "activitiesListToolbarWrapper", children: [_jsxs("div", { className: "activitiesListToolbarItem", children: [_jsxs("div", { className: "tableTitleIconWrapper", children: [_jsx(FileOutlined, { className: "illustrationIcon" }), "Documents", screenWidth < 768 ? (_jsx(Tooltip, { title: "Upload new document", children: _jsx(PlusOutlined, { onClick: showModal }) })) : (_jsx(Button, { onClick: showModal, className: "addOpportunityModalBtn", children: "Upload New" }))] }), selectedRowKeys.length > 0 ? (_jsx("div", { className: "activityDeleteBottomBar", children: _jsx(Popconfirm, { title: "Delete selected documents", description: "Are you sure you want to delete these documents?", onConfirm: handleDelete, okText: "Yes", cancelText: "Cancel", children: _jsx(Button, { type: "primary", danger: true, style: { marginLeft: "10px" }, children: "Delete selected" }) }) })) : null] }), _jsxs("div", { className: "opportunitiesSearchResetBar", children: [_jsx(Input, { placeholder: "search here..", name: "searchText", onChange: (e) => onSearch(e.target.value), value: params?.search }), _jsx(Button, { onClick: handleReset, className: "resetFilterBtn", children: "Reset" })] })] }), _jsx("div", { className: "listTableContainer", children: _jsx(DataGrid, { checkboxSelection: true, rows: documents, columns: columns, rowCount: totalDocuments, loading: getDocumentLoader, pageSizeOptions: [10, 25, 50], paginationModel: {
                                page: params.page - 1,
                                pageSize: params.limit,
                            }, onPaginationModelChange: handlePaginationChange, onRowSelectionModelChange: handleSelectionChange, rowSelectionModel: selectedRowKeys, getRowId: (row) => row.id }) })] })] }));
};
export default AllDocumentsView;
