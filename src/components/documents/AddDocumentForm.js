import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Form, Input, Button, Upload, message, Alert, Spin, DatePicker, Select } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../../redux/app/hooks';
import { checkGoogleConnection } from '../../redux/features/documentSlice';
import TextArea from 'antd/es/input/TextArea';
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
const AddDocumentForm = ({ contactId, onFileChange, onDescriptionChange, onStartTimeChange = () => { }, onEndTimeChange = () => { }, onDocumentTypeChange = () => { }, onCustomDocumentTypeChange = () => { }, fileList }) => {
    const dispatch = useAppDispatch();
    const { isGoogleConnected, checkingGoogleConnection, addDocumentLoader } = useAppSelector((state) => state.documents);
    const [connectionError, setConnectionError] = useState('');
    const [userAuthenticated, setUserAuthenticated] = useState(true);
    const [selectedDocumentType, setSelectedDocumentType] = useState(null);
    useEffect(() => {
        const userId = localStorage.getItem("userId");
        if (!userId) {
            debugLog('[Document Upload Form] User not authenticated', null, 'AddDocumentForm');
            setUserAuthenticated(false);
        }
        else {
            setUserAuthenticated(true);
            const storedGoogleConnection = localStorage.getItem("googleDriveConnected");
            if (storedGoogleConnection !== "true") {
                debugLog('[Document Upload Form] Checking Google Drive connection (no stored status)', null, 'AddDocumentForm');
                dispatch(checkGoogleConnection());
            }
            else {
                debugLog('[Document Upload Form] Using stored Google Drive connection status (true)', null, 'AddDocumentForm');
            }
        }
    }, [dispatch]);
    const handleFileChangeInternal = (info) => {
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
        }
        else {
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
    const handleDocumentTypeChange = (value) => {
        setSelectedDocumentType(value);
        onDocumentTypeChange(value);
    };
    return (_jsxs("div", { className: "document-form-container", children: [_jsx(GoogleDriveIntegration, { condensed: true, returnTo: contactId }), !userAuthenticated ? (_jsxs(_Fragment, { children: [_jsx(Alert, { message: "Authentication Required", description: "Log in before connecting to Google Drive or uploading.", type: "warning", showIcon: true, style: { marginBottom: 16, marginTop: 16 } }), _jsx(Button, { type: "primary", onClick: handleLogin, style: { marginBottom: 16 }, children: "Log In Now" })] })) : checkingGoogleConnection ? (_jsx("div", { style: { textAlign: 'center', padding: '20px', marginTop: 16 }, children: _jsx(Spin, { tip: "Checking Google Drive connection..." }) })) : !isGoogleConnected ? (_jsx(Alert, { message: "Google Drive Connection Required", description: "Connect to Google Drive using the controls above before uploading.", type: "info", showIcon: true, style: { marginBottom: 16, marginTop: 16 } })) : (_jsxs(_Fragment, { children: [_jsx(Form.Item, { name: "file", label: "Document", className: "addReferralFormInput", children: _jsxs(Upload, { beforeUpload: () => false, onChange: handleFileChangeInternal, fileList: fileList, maxCount: 1, children: [_jsx(Button, { icon: _jsx(UploadOutlined, {}), disabled: addDocumentLoader, children: "Select File" }), _jsx("div", { className: "upload-hint", children: "Max file size: 5MB" })] }) }), _jsx(Form.Item, { name: "description", label: "Description", className: "addReferralFormInput", rules: [
                            { required: true, message: "Description is mandatory!" },
                        ], children: _jsx(TextArea, { placeholder: "Enter document description", maxLength: 499, disabled: addDocumentLoader, onChange: (e) => onDescriptionChange(e.target.value) }) }), _jsx(Form.Item, { name: "documentType", label: "Document Type", className: "addReferralFormInput", children: _jsx(Select, { placeholder: "Select document type", onChange: handleDocumentTypeChange, disabled: addDocumentLoader, children: DOCUMENT_TYPES.map(type => (_jsx(Option, { value: type.value, children: type.label }, type.value))) }) }), selectedDocumentType === 'OTHER' && (_jsx(Form.Item, { name: "customDocumentType", label: "Custom Document Type", className: "addReferralFormInput", rules: [
                            { required: true, message: "Please specify the document type!" },
                        ], children: _jsx(Input, { placeholder: "Enter custom document type", onChange: (e) => onCustomDocumentTypeChange(e.target.value), disabled: addDocumentLoader }) })), _jsx(Form.Item, { name: "startTime", label: "Start Date", className: "addReferralFormInput", children: _jsx(DatePicker, { style: { width: '100%' }, onChange: (date) => onStartTimeChange(date ? date.toISOString() : null), disabled: addDocumentLoader, placeholder: "Select start date (optional)" }) }), _jsx(Form.Item, { name: "endTime", label: "End Date", className: "addReferralFormInput", children: _jsx(DatePicker, { style: { width: '100%' }, onChange: (date) => onEndTimeChange(date ? date.toISOString() : null), disabled: addDocumentLoader, placeholder: "Select end date (optional)" }) })] }))] }));
};
export default AddDocumentForm;
