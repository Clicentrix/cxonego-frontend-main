import { jsxs as _jsxs, jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { csvInstructionsCollapseItem } from "../../utilities/common/dataArrays";
import { Button, Collapse, Flex, Form, Popover, Progress, Steps, Upload, message, } from "antd";
import { useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import { BULK_CONTACT_ICON, BULK_LEAD_ICON, BULK_ORGANISATION_ICON, DRAGGER_ICON, } from "../../utilities/common/imagesImports";
import "../../styles/importRecords.css";
import { Radio } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import moment from "moment";
const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;
const ImportRecords = () => {
    const navigate = useNavigate();
    const accessToken = localStorage?.getItem("accessToken");
    const { Dragger } = Upload;
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [fileTye, setFileType] = useState("excel");
    const [dataType, setDataType] = useState("leads");
    const [bulkContactResponse, setBulkContactResponse] = useState({
        totalCount: 0,
        SuccessCount: 0,
        errorCount: 0,
        DuplicateCount: 0,
        filename: "",
        duplicateContactData: [],
    });
    const [bulkLeadResponse, setBulkLeadResponse] = useState({
        totalCount: 0,
        SuccessCount: 0,
        errorCount: 0,
        filename: "",
    });
    const [bulkAccountResponse, setBulkAccountResponse] = useState({
        totalCount: 0,
        SuccessCount: 0,
        errorCount: 0,
        DuplicateCount: 0,
        filename: "",
        duplicateAccountData: [],
    });
    const simulateProgress = () => {
        setProgress((prev) => (prev < 90 ? prev + 2 : prev)); // Increment by 0.5%
    };
    const handleUpload = async (file) => {
        console.log("file selected", file);
        nextStep();
        setLoading(true);
        setProgress(0);
        const interval = setInterval(simulateProgress, 100); // Increment progress every 200ms
        try {
            const config = {
                headers: { Authorization: `Bearer ${accessToken}` },
            };
            const formData = new FormData();
            formData.append("file", file);
            const response = await axios.post(dataType === "contacts"
                ? `${baseUrl}contact/upload-${fileTye}-contacts`
                : dataType === "leads"
                    ? `${baseUrl}lead/upload-excel-leads`
                    : `${baseUrl}account/upload-excel-accounts`, formData, config);
            if (response.status === 200) {
                if (dataType === "contacts") {
                    setBulkContactResponse(response?.data?.data);
                }
                else if (dataType === "leads") {
                    setBulkLeadResponse(response?.data?.data);
                }
                else {
                    setBulkAccountResponse(response?.data?.data);
                }
            }
            else {
                throw new Error("Upload failed");
            }
        }
        catch (error) {
            message.error(error?.response?.data?.error);
        }
        finally {
            clearInterval(interval);
            setLoading(false);
            setProgress(100); // Ensure it completes to 100%
        }
    };
    const props = {
        name: "file",
        customRequest: ({ file, onSuccess, onError }) => {
            handleUpload(file).then(onSuccess).catch(onError);
        },
        onChange(info) {
            if (info.file.status === "error") {
                setLoading(false);
            }
        },
    };
    const { Step } = Steps;
    const customDot = (dot, { status, index }) => (_jsx(Popover, { content: _jsxs("span", { children: ["step ", index + 1, " status: ", status] }), children: dot }));
    const StepContent = ({ step, nextStep }) => {
        switch (step) {
            case 0:
                return (_jsxs("div", { className: "selectEntityContainerMain", children: [_jsx("label", { className: "addBulkCSVLabel", children: "Select Entity" }), _jsx("div", { className: "selectEntityContainer", children: _jsxs(Radio.Group, { name: "radiogroup", defaultValue: dataType, onChange: (e) => setDataType(e.target.value), children: [_jsxs("div", { className: "selectEntity", children: [_jsx("img", { src: BULK_LEAD_ICON, alt: "entity-icon" }), _jsx(Radio, { value: "leads", children: "Leads" })] }), _jsxs("div", { className: "selectEntity", children: [_jsx("img", { src: BULK_CONTACT_ICON, alt: "entity-icon" }), _jsx(Radio, { value: "contacts", children: "Contacts" })] }), _jsxs("div", { className: "selectEntity", children: [_jsx("img", { src: BULK_ORGANISATION_ICON, alt: "entity-icon" }), _jsx(Radio, { value: "accounts", children: "Accounts" })] })] }) }), _jsx("div", { className: "selectEntitySubmitBtn", children: _jsx(Button, { type: "primary", onClick: nextStep, className: "selectEntitySubmitBtn1", children: "Next" }) })] }));
            case 1:
                return (_jsxs("div", { className: "selectEntityContainerMain", children: [_jsx("label", { className: "addBulkCSVLabel", children: "Select Entity" }), _jsx("div", { className: "selectEntityContainerFile", children: _jsxs(Radio.Group, { name: "radiogroup", defaultValue: fileTye, onChange: (e) => {
                                    setFileType(e.target.value);
                                }, children: [_jsx(Radio, { value: "excel", children: "XLSX" }), dataType === "contacts" && _jsx(Radio, { value: "vcf", children: "VCF" })] }) }), _jsx("div", { className: "selectEntitySubmitBtn", children: _jsx(Button, { type: "primary", onClick: nextStep, className: "selectEntitySubmitBtn1", children: "Next" }) })] }));
            case 2:
                return (_jsx("div", { children: _jsx("div", { className: "bulkStep2Container", children: fileTye === "excel" ? (_jsxs(_Fragment, { children: [_jsx("label", { className: "addBulkCSVLabel", children: "Excel Upload" }), _jsxs("div", { className: "bulkCSVBottomWrapper", children: [_jsx(Collapse, { items: csvInstructionsCollapseItem }), _jsx(Button, { className: "csvDownloadBtn", children: _jsx("a", { href: dataType === "contacts"
                                                    ? `https://cxonego-dev.s3.ap-south-1.amazonaws.com/Contact_Bulk_Upload+4.xlsx`
                                                    : dataType === "leads"
                                                        ? `https://cxonego-dev.s3.ap-south-1.amazonaws.com/Lead_Bulk_upload+4.xlsx`
                                                        : `https://cxonego-dev.s3.ap-south-1.amazonaws.com/Account_Bulk_upload+1.xlsx`, target: "_abc", download: true, children: "Download sample .xlsx file" }) })] }), _jsx("div", { style: { marginTop: "40px" }, children: _jsxs(Dragger, { ...props, showUploadList: false, accept: ".xlsx", children: [_jsx("img", { src: DRAGGER_ICON, alt: "dragger0icon" }), _jsxs("div", { className: "ant-upload-text", children: ["Click or drag XLSX file to this area to upload", _jsx("p", { children: "Support for a single or bulk upload. Strictly prohibited from uploading non-XLSX files." })] }), _jsx(Button, { icon: _jsx(UploadOutlined, {}), children: "Click to Upload" })] }) })] })) : (_jsxs(_Fragment, { children: [" ", _jsxs(_Fragment, { children: [_jsx("label", { className: "addBulkCSVLabel", children: "VCF Upload" }), _jsx("div", { className: "bulkCSVBottomWrapper", children: _jsx(Collapse, { items: csvInstructionsCollapseItem }) }), _jsxs("div", { style: { marginTop: "40px" }, children: [_jsxs(Dragger, { ...props, showUploadList: false, accept: ".vcf", children: [_jsx("img", { src: DRAGGER_ICON, alt: "dragger0icon" }), _jsxs("div", { className: "ant-upload-text", children: ["Click or drag VCF file to this area to upload", _jsx("p", { children: "Support for a single or bulk upload. Strictly prohibited from uploading non-VCF files." })] }), _jsx(Button, { icon: _jsx(UploadOutlined, {}), children: "Click to Upload" })] }), _jsx(Form.Item, { className: "addLeadSubmitBtnWrapper", children: _jsx(Button, { onClick: nextStep, disabled: loading, className: "selectEntitySubmitBtn1", children: "Next" }) })] })] })] })) }) })
                // </div>
                );
            case 3:
                return (_jsx("div", { children: _jsxs("div", { className: "bulkStep2Container", children: [_jsx("label", { className: "addBulkCSVLabel", children: "XLSX Upload" }), _jsxs("div", { className: "bulkProgressContainer", children: [_jsx("div", { className: "uploadProgressTitle", children: "Upload Progress" }), _jsxs("div", { children: [" ", _jsx(Flex, { vertical: true, gap: "small", children: _jsx(Flex, { gap: "small", children: _jsx(Flex, { vertical: true, gap: "small", style: { width: 300 }, children: _jsx(Progress, { percent: progress }) }) }) })] })] }), _jsx(Form.Item, { className: "addLeadSubmitBtnWrapper", children: _jsx(Button, { onClick: nextStep, disabled: loading, className: "selectEntitySubmitBtn1", children: "Next" }) })] }) }));
            case 4:
                return (_jsxs("div", { className: "bulkStep2Container", children: [_jsx("label", { className: "addBulkCSVLabel", children: "Summary" }), dataType === "contacts" ? (_jsxs("div", { children: [_jsxs("div", { className: "bulkSubTitle1", children: ["File Uploaded : ", bulkContactResponse?.filename || ""] }), _jsx("div", { className: "bulkSubTitle2", children: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm A") }), _jsxs("div", { className: "bulkSubTitle3", children: [_jsxs("div", { children: ["Total Contacts :", " ", _jsx("span", { className: "bulkSummaryData", children: bulkContactResponse?.totalCount || 0 })] }), _jsxs("div", { children: [" ", "New Added Contacts :", " ", _jsx("span", { className: "bulkSummaryData", children: bulkContactResponse?.SuccessCount || 0 })] }), _jsxs("div", { children: [" ", "Duplicate Detected :", " ", _jsx("span", { className: "bulkSummaryData", children: bulkContactResponse?.DuplicateCount || 0 })] }), _jsxs("div", { children: [" ", "Duplicate Contacts :", " ", bulkContactResponse?.duplicateContactData?.map((item) => {
                                                    return (_jsxs("span", { className: "bulkSummaryData", children: [`${item?.firstName} ${item?.lastName} (${item?.phone})`, ",", " "] }));
                                                })] })] })] })) : dataType === "leads" ? (_jsxs("div", { children: [_jsxs("div", { className: "bulkSubTitle1", children: ["File Uploaded : ", bulkLeadResponse?.filename || ""] }), _jsx("div", { className: "bulkSubTitle2", children: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm A") }), _jsxs("div", { className: "bulkSubTitle3", children: [_jsxs("div", { children: ["Total Leads :", " ", _jsx("span", { className: "bulkSummaryData", children: bulkLeadResponse?.totalCount || 0 })] }), _jsxs("div", { children: [" ", "New Added Leads :", " ", _jsx("span", { className: "bulkSummaryData", children: bulkLeadResponse?.SuccessCount || 0 })] })] })] })) : (_jsxs("div", { children: [_jsxs("div", { className: "bulkSubTitle1", children: ["File Uploaded : ", bulkAccountResponse?.filename || ""] }), _jsx("div", { className: "bulkSubTitle2", children: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm A") }), _jsxs("div", { className: "bulkSubTitle3", children: [_jsxs("div", { children: ["Total Accounts :", " ", _jsx("span", { className: "bulkSummaryData", children: bulkAccountResponse?.totalCount || 0 })] }), _jsxs("div", { children: [" ", "New Added Accounts :", " ", _jsx("span", { className: "bulkSummaryData", children: bulkAccountResponse?.SuccessCount || 0 })] }), _jsxs("div", { children: [" ", "Duplicate Detected :", " ", _jsx("span", { className: "bulkSummaryData", children: bulkAccountResponse?.DuplicateCount || 0 })] }), _jsxs("div", { children: [" ", "Duplicate Account :", " ", bulkAccountResponse?.duplicateAccountData?.map((item) => {
                                                    return (_jsxs("span", { className: "bulkSummaryData", children: [`${item?.accountName}`, ",", " "] }));
                                                })] })] })] })), _jsx(Form.Item, { className: "addLeadSubmitBtnWrapper", children: _jsx(Button, { type: "primary", onClick: nextStep, className: "selectEntitySubmitBtn1", children: "Finish" }) })] }));
            default:
                return null;
        }
    };
    const [current, setCurrent] = useState(0);
    const nextStep = () => {
        if (current === 0 && dataType !== "contacts") {
            setCurrent((prev) => prev + 2);
        }
        else if (current === 4) {
            navigate(`/${dataType}`);
        }
        else {
            setCurrent((prev) => prev + 1);
        }
    };
    return (_jsx(_Fragment, { children: _jsxs("div", { className: "importRecordsMainDiv", children: [_jsxs(Steps, { current: current, progressDot: customDot, onChange: setCurrent, children: [_jsx(Step, { title: "Entity Type" }), _jsx(Step, { title: "File Type" }), _jsx(Step, { title: "Upload" }), _jsx(Step, { title: "Progress" }), _jsx(Step, { title: "Summary" })] }), _jsx("div", { style: { marginTop: 24 }, className: "stepContentWrapper", children: _jsx(StepContent, { step: current, nextStep: nextStep }) })] }) }));
};
export default ImportRecords;
