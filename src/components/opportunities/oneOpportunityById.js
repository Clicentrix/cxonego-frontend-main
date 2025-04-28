import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Avatar, Button, DatePicker, Form, Input, Modal, Popconfirm, Select, Spin, Tooltip, } from "antd";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/app/hooks";
import "../../styles/oppotunities/oneOpportunity.css";
import "../../styles/activities/floatActivity.css";
import { currencyOptions, forecastCategoryOptions, lostReasonOptions, opportunitiesRelatedViewOptions, priorityOptions, probabilityOptions, purchaseProcessOptions, purchaseTimeFrameOptions, stagesOptions, statusOptions, wonReasonOptions, } from "../../utilities/common/dataArrays";
import { DESCRIPTION_ICON_ORANGE, GENERAL_INFO_ICON_ORANGE, OWNER, } from "../../utilities/common/imagesImports";
import { LeftOutlined, RightOutlined, EditOutlined, CheckCircleOutlined, } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import { getOpportunityById, handleInputChangeReducerOpportunity, setEditableMode, updateOpportunityByIdAndGetAudits, updateOpportunityForOwnerByIdAndGetAudits, } from "../../redux/features/opportunitiesSlice";
import dayjs from "dayjs";
import { fetchAllAccountsWithoutParams } from "../../redux/features/accountsSlice";
import { fetchAllContactsWithoutParams } from "../../redux/features/contactsSlice";
import { fetchAllAuditsByModuleId } from "../../redux/features/auditSlice";
import AuditWindow from "../audit/auditWindow";
import AllRelatedActivities from "../activities/relatedActivitiesListView";
import AllRelatedNotes from "../notes/relatedNotesListView";
import RelatedDocumentsListView from "../documents/RelatedDocumentsListView";
import TextArea from "antd/es/input/TextArea";
import { fetchAllSalesPersonByUserId } from "../../redux/features/organizationSlice";
import { extractContactId } from "../../utils/contactUtils";
const OneOpportunityById = () => {
    const dispatch = useAppDispatch();
    const params = useParams();
    const [form] = Form.useForm();
    const { opportunity, addOpportunityLoader, getOpportunityLoader, editable } = useAppSelector((state) => state.opportunities);
    const { accounts } = useAppSelector((state) => state.accounts);
    const { contacts } = useAppSelector((state) => state.contacts);
    const { screenWidth } = useAppSelector((state) => state.referrals);
    const [popconfirmVisible, setPopconfirmVisible] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [wonOrLost, setWonOrLost] = useState("Won");
    const [relatedView, setRelatedView] = useState("SELECT");
    const opportunityId = params?.opportunityId;
    const OWNER_AVATAR = `${opportunity?.owner?.firstName
        ?.slice(0, 1)
        ?.toLocaleUpperCase()}
                          ${opportunity?.owner?.lastName
        ?.slice(0, 1)
        ?.toLocaleUpperCase()}`;
    const OWNER_NAME = `${opportunity?.owner?.firstName}
                          ${opportunity?.owner?.lastName}`;
    const [ownerId, setOwnerId] = useState("");
    const [popconfirmVisible1, setPopconfirmVisible1] = useState(false);
    const { salesPersonData } = useAppSelector((state) => state.organisations);
    const companyOptions = accounts?.map((item) => {
        return { ...item, value: item?.accountId, label: item?.accountName };
    });
    const contactsOptions = contacts?.map((item) => {
        return {
            ...item,
            value: item?.contactId,
            label: `${item?.firstName} ${item?.lastName}`,
        };
    });
    const confirmChange1 = async () => {
        await dispatch(updateOpportunityForOwnerByIdAndGetAudits({ ...opportunity, owner: { userId: ownerId } }));
        await dispatch(setEditableMode(false));
        await setPopconfirmVisible1(false);
    };
    const cancelChange1 = () => {
        setPopconfirmVisible1(false);
        dispatch(getOpportunityById(opportunityId));
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        dispatch(handleInputChangeReducerOpportunity({
            [name]: value,
        }));
    };
    const handleSelectChange = (value, name) => {
        if (value === "Won" || value === "Lost") {
            setPopconfirmVisible(true);
            setWonOrLost(value);
            dispatch(handleInputChangeReducerOpportunity({
                [name]: value,
            }));
        }
        else {
            dispatch(handleInputChangeReducerOpportunity({
                [name]: value,
            }));
        }
    };
    const confirmChange = async () => {
        await setIsModalOpen(true);
        form.resetFields();
        await setPopconfirmVisible(false);
    };
    const cancelChange = () => {
        setPopconfirmVisible(false);
        dispatch(getOpportunityById(opportunityId));
    };
    const handleSelectChangeView = (value) => {
        setRelatedView(value);
    };
    const handleBack = () => {
        history.back();
    };
    const handleSubmit = () => {
        if (editable) {
            dispatch(updateOpportunityByIdAndGetAudits({
                ...opportunity,
                contact: opportunity?.contact?.includes("/")
                    ? opportunity.contact?.split("/")[1]
                    : opportunity?.contact,
                company: opportunity?.company?.includes("/")
                    ? opportunity.company?.split("/")[1]
                    : opportunity?.company,
            }));
        }
        else {
            dispatch(setEditableMode(true));
        }
    };
    const handleCancel = async () => {
        await dispatch(getOpportunityById(opportunityId));
        await setIsModalOpen(false);
        await form.resetFields();
    };
    useEffect(() => {
        dispatch(fetchAllSalesPersonByUserId());
    }, []);
    useEffect(() => {
        if (opportunityId) {
            dispatch(setEditableMode(false));
            dispatch(getOpportunityById(opportunityId));
        }
    }, [opportunityId]);
    useEffect(() => {
        form.setFieldsValue(opportunity);
    }, [opportunity]);
    useEffect(() => {
        dispatch(fetchAllAccountsWithoutParams());
        dispatch(fetchAllContactsWithoutParams());
        if (opportunityId) {
            dispatch(fetchAllAuditsByModuleId({
                moduleName: "opportunity",
                moduleId: opportunityId,
            }));
        }
    }, []);
    const handleCloseOpportunity = async () => {
        await dispatch(updateOpportunityByIdAndGetAudits(opportunity));
        setIsModalOpen(false);
    };
    return (_jsxs("div", { className: "oneOpportunityMainWrapper", children: [_jsx(Modal, { open: isModalOpen, onOk: handleCloseOpportunity, onCancel: handleCancel, footer: false, children: _jsxs("div", { className: "addAccountFormDiv", children: [_jsx("div", { className: "addAccountTitle", children: "Close Opportunity" }), _jsx("div", { className: "addOpportunityFormWrapper", children: _jsxs(Form, { form: form, name: "loginForm", onFinish: handleCloseOpportunity, initialValues: opportunity, children: [wonOrLost === "Won" ? (_jsx(Form.Item, { name: "wonReason", label: "Won Reason", className: "addOpportunityFormInput", rules: [
                                            {
                                                required: true,
                                                message: "This field is mandatory!",
                                            },
                                        ], children: _jsx(Select, { onChange: (value) => handleSelectChange(value, "wonReason"), options: wonReasonOptions, disabled: !editable, showSearch: true }) })) : (_jsx(Form.Item, { name: "lostReason", label: "Lost Reason", className: "addOpportunityFormInput", rules: [
                                            {
                                                required: true,
                                                message: "This field is mandatory!",
                                            },
                                        ], children: _jsx(Select, { onChange: (value) => handleSelectChange(value, "lostReason"), options: lostReasonOptions, disabled: !editable }) })), _jsx(Form.Item, { name: "actualRevenue", label: "Actual Revenue", className: "addOpportunityFormInput", rules: [
                                            {
                                                required: true,
                                                message: "This field is mandatory!",
                                            },
                                        ], children: _jsx(Input, { onChange: handleInputChange, name: "actualRevenue", type: "number", placeholder: "Please enter here" }) }), _jsx(Form.Item, { label: "Actual. Close Date", className: "addOpportunityFormInput", rules: [
                                            {
                                                required: true,
                                                message: "This field is mandatory!",
                                            },
                                        ], children: _jsx(DatePicker, { onChange: (_date, dateString) => {
                                                // Ensure dateString is a string before converting to Date
                                                if (typeof dateString === "string") {
                                                    const dateObject = new Date(dateString);
                                                    if (!isNaN(dateObject.getTime())) {
                                                        // Check if dateObject is valid
                                                        dispatch(handleInputChangeReducerOpportunity({
                                                            actualCloseDate: dateObject.toISOString(),
                                                        }));
                                                    }
                                                    else {
                                                        console.error("Invalid date string:", dateString);
                                                    }
                                                }
                                            } }) }), _jsx(Form.Item, { name: "wonLostDescription", label: "Note", className: "addOpportunityFormInput", rules: [
                                            {
                                                required: false,
                                                message: "This field is mandatory!",
                                            },
                                        ], children: _jsx(TextArea, { onChange: handleInputChange, name: "wonLostDescription", placeholder: "Please enter here", maxLength: 499 }) }), _jsxs(Form.Item, { className: "addOpportunitySubmitBtnWrapper", children: [_jsx(Button, { onClick: handleCancel, className: "addOpportunityCancelBtn", children: "Cancel" }), _jsx(Button, { type: "primary", htmlType: "submit", className: "addOpportunitySubmitBtn", loading: addOpportunityLoader, children: "Save" })] })] }) })] }) }), _jsx(Spin, { spinning: getOpportunityLoader, tip: "Loading...", children: _jsx("div", { className: editable
                        ? "oneOpportunityViewWrapper"
                        : "onceOpportunityViewWrapperNotEdit", children: _jsxs(Form, { form: form, name: "loginForm", onFinish: handleSubmit, initialValues: opportunity, children: [_jsx("div", { className: "oneOpportunityTopToolbar1", children: _jsxs("div", { className: "opportunitysSelectViewWrapper", children: [_jsxs("div", { className: "opportunitysSelectView1", children: [_jsx(LeftOutlined, { className: "backArrow", onClick: handleBack }), _jsx("div", { className: "opportunitysViewTitle", children: "Opportunities" }), _jsx(RightOutlined, {}), _jsx("div", { className: "opportunitysViewTitle", children: opportunity?.title || "" })] }), _jsxs("div", { className: "opportunitysSelectView1", children: [_jsx(Select, { autoFocus: true, value: relatedView, defaultValue: "SELECT", onChange: handleSelectChangeView, style: {
                                                        border: "1px solid var(--gray5)",
                                                        borderRadius: "4px",
                                                        width: "160px",
                                                    }, children: opportunitiesRelatedViewOptions?.map((option, index) => (_jsx(Select.Option, { value: option.value, children: option.label }, index))) }), _jsx(Form.Item, { className: "addOpportunitySubmitBtnWrapper", children: _jsx(Button, { type: "primary", htmlType: "submit", className: "opportunityEditBtn", loading: addOpportunityLoader, disabled: relatedView !== "SELECT" || opportunity?.stage === "Won" || opportunity?.stage === "Lost", children: screenWidth < 768 ? (editable ? (_jsx(Tooltip, { title: "Update Opportunity", children: _jsx(CheckCircleOutlined, {}) })) : (_jsx(Tooltip, { title: "Save Changes", children: _jsx(EditOutlined, {}) }))) : editable ? ("Save Changes") : ("Edit") }) })] })] }) }), relatedView !== "SELECT" ? (_jsx("div", { className: "updateOpportunityDiv", children: _jsxs("div", { className: "contactEditFormDiv", children: [_jsxs("div", { className: "updateOpportunityDivCol", children: [_jsxs("div", { className: "addOpportunitySubTitle", children: [_jsx("div", { className: "illustrationIconWrapper", children: _jsx("img", { src: GENERAL_INFO_ICON_ORANGE, alt: "illustration", className: "illustrationIcon" }) }), "General Information"] }), _jsxs("div", { className: "updateOpportunityFlex", children: [_jsx(Form.Item, { name: "title", label: "Title", className: "addOpportunityFormInput", style: { width: "230px" }, rules: [
                                                                {
                                                                    required: true,
                                                                    message: "This field is mandatory!",
                                                                },
                                                            ], children: _jsx(Input, { onChange: handleInputChange, name: "title", type: "string", placeholder: "Please enter here", readOnly: !editable }) }), _jsx(Form.Item, { name: "contact", label: "Contact", className: "addOpportunityFormInput", style: { width: "230px" }, rules: [
                                                                {
                                                                    required: false,
                                                                    message: "This field is mandatory!",
                                                                },
                                                            ], children: _jsx(Select, { onChange: (value) => handleSelectChange(value, "contact"), options: contactsOptions, disabled: !editable, showSearch: true }) }), _jsx(Form.Item, { name: "company", label: "Company", className: "addOpportunityFormInput", style: { width: "230px" }, rules: [
                                                                {
                                                                    required: false,
                                                                    message: "This field is mandatory!",
                                                                },
                                                            ], children: _jsx(Select, { onChange: (value) => handleSelectChange(value, "company"), options: companyOptions, disabled: !editable }) }), _jsx(Form.Item, { style: { width: "230px" } })] })] }), _jsxs("div", { className: "opportunityInfo1", children: [_jsxs("div", { className: "opportunityInfo1CompanyNameLabel", children: [_jsx("img", { src: OWNER, alt: "illustration", className: "illustrationIcon" }), "Owner"] }), _jsxs("div", { className: "opportunityOwnerDiv", children: [_jsx(Avatar, { children: OWNER_AVATAR }), _jsx("div", { className: "opportunityOwnerInfo", children: _jsx("p", { className: "opportunityInfo1CompanyName", children: OWNER_NAME }) })] })] })] }) })) : null, relatedView === "ACTIVITIES" ? (_jsx(_Fragment, { children: _jsx(AllRelatedActivities, { moduleName: "opportunity", moduleId: opportunity?.opportunityId }) })) : relatedView === "NOTES" ? (_jsx(_Fragment, { children: _jsx(AllRelatedNotes, { moduleName: "opportunity", moduleId: opportunity?.opportunityId }) })) : relatedView === "DOCUMENTS" ? (_jsx(_Fragment, { children: (() => {
                                    console.log('=== DEBUG: Opportunity contact data:', opportunity?.contact);
                                    // Use the utility function to extract the contactId
                                    const contactId = extractContactId(opportunity?.contact);
                                    console.log('=== DEBUG: Extracted contactId using utility:', contactId);
                                    return (_jsx(RelatedDocumentsListView, { contactId: contactId }));
                                })() })) : (_jsx("div", { children: _jsx("div", { className: "updateOpportunityDiv", children: _jsxs("div", { className: "updateOpportunityOwnerDiv", children: [_jsxs("div", { className: "opportunityEditFormDiv", children: [_jsxs("div", { className: "updateOpportunityDivCol", children: [_jsxs("div", { className: "addOpportunitySubTitle", children: [_jsx("div", { className: "illustrationIconWrapper", children: _jsx("img", { src: GENERAL_INFO_ICON_ORANGE, alt: "illustration", className: "illustrationIcon" }) }), "General Information"] }), _jsxs("div", { className: "updateOpportunityFlex", children: [_jsx(Form.Item, { name: "title", label: "Title", className: "addOpportunityFormInput", style: { width: "230px" }, rules: [
                                                                            {
                                                                                required: true,
                                                                                message: "This field is mandatory!",
                                                                            },
                                                                        ], children: _jsx(Input, { onChange: handleInputChange, name: "title", type: "string", placeholder: "Please enter here", readOnly: !editable }) }), _jsx(Form.Item, { name: "contact", label: "Contact", className: "addOpportunityFormInput", style: { width: "230px" }, rules: [
                                                                            {
                                                                                required: false,
                                                                                message: "This field is mandatory!",
                                                                            },
                                                                        ], children: _jsx(Select, { onChange: (value) => handleSelectChange(value, "contact"), options: contactsOptions, disabled: !editable, showSearch: true }) }), _jsx(Form.Item, { name: "company", label: "Company", className: "addOpportunityFormInput", style: { width: "230px" }, rules: [
                                                                            {
                                                                                required: false,
                                                                                message: "This field is mandatory!",
                                                                            },
                                                                        ], children: _jsx(Select, { onChange: (value) => handleSelectChange(value, "company"), options: companyOptions, disabled: !editable }) }), _jsx(Form.Item, { style: { width: "230px" } })] })] }), _jsxs("div", { className: "opportunityInfo1", children: [_jsxs("div", { className: "opportunityInfo1CompanyNameLabel", children: [_jsx("img", { src: OWNER, alt: "illustration", className: "illustrationIcon" }), "Owner"] }), _jsxs("div", { className: "opportunityOwnerDiv", children: [_jsx(Avatar, { children: OWNER_AVATAR }), _jsx(Popconfirm, { title: "Are you sure you want to change the owner of this record?", open: popconfirmVisible1, onConfirm: confirmChange1, onCancel: cancelChange1, okText: "Yes", cancelText: "No", children: _jsx(Select, { className: "dashboardSelect", placeholder: "search sales person", showSearch: true, style: { width: "200px" }, disabled: !editable, value: OWNER_NAME, onChange: (value) => {
                                                                                setOwnerId(value);
                                                                                setPopconfirmVisible1(true);
                                                                            }, filterOption: (input, option) => {
                                                                                // Convert option's children to a string, handle cases where it's not a string
                                                                                const optionText = typeof option?.props.children === "string"
                                                                                    ? option.props.children
                                                                                    : Array.isArray(option?.props.children)
                                                                                        ? option.props.children.join("")
                                                                                        : "";
                                                                                return optionText
                                                                                    .toLowerCase()
                                                                                    .includes(input.toLowerCase());
                                                                            }, children: salesPersonData?.map((item, index) => {
                                                                                return (_jsx(_Fragment, { children: _jsxs(Select.Option, { value: item?.userId, children: [item.firstName, " ", item?.lastName] }, index) }));
                                                                            }) }) })] })] })] }), _jsxs("div", { className: "updateOpportunityDivCol", children: [_jsxs("div", { className: "addOpportunitySubTitle", children: [_jsx("img", { src: DESCRIPTION_ICON_ORANGE, alt: "illustration", className: "illustrationIcon" }), "Opportunity Details"] }), _jsxs("div", { className: "updateOpportunityFlex", children: [_jsx(Form.Item, { name: "currency", label: "Currency", className: "addOpportunityFormInput", style: { width: "230px" }, rules: [
                                                                    {
                                                                        required: false,
                                                                        message: "This field is mandatory!",
                                                                    },
                                                                ], children: _jsx(Select, { onChange: (value) => handleSelectChange(value, "currency"), options: currencyOptions, disabled: !editable }) }), _jsx(Form.Item, { name: "estimatedRevenue", label: "Est. Revenue", className: "addOpportunityFormInput", style: { width: "230px" }, rules: [
                                                                    {
                                                                        required: true,
                                                                        message: "This field is mandatory!",
                                                                    },
                                                                ], children: _jsx(Input, { onChange: handleInputChange, name: "estimatedRevenue", type: "number", placeholder: "Please enter here" }) }), _jsx(Form.Item, { name: "actualRevenue", label: "Actual Revenue", className: "addOpportunityFormInput", style: { width: "230px" }, rules: [
                                                                    {
                                                                        required: false,
                                                                        message: "This field is mandatory!",
                                                                    },
                                                                ], children: _jsx(Input, { onChange: handleInputChange, name: "actualRevenue", type: "string", placeholder: "Please enter here", readOnly: !editable }) }), _jsx(Form.Item, { name: "probability", label: "Probability", className: "addOpportunityFormInput", style: { width: "230px" }, rules: [
                                                                    {
                                                                        required: false,
                                                                        message: "This field is mandatory!",
                                                                    },
                                                                ], children: _jsx(Select, { onChange: (value) => handleSelectChange(value, "probability"), options: probabilityOptions, disabled: !editable }) })] }), _jsxs("div", { className: "updateOpportunityFlex", children: [_jsx(Form.Item, { name: "purchaseTimeFrame", label: "Purchase Time Frame", className: "addOpportunityFormInput", style: { width: "230px" }, rules: [
                                                                    {
                                                                        required: true,
                                                                        message: "This field is mandatory!",
                                                                    },
                                                                ], children: _jsx(Select, { onChange: (value) => handleSelectChange(value, "purchaseTimeFrame"), options: purchaseTimeFrameOptions, disabled: !editable }) }), _jsx(Form.Item, { name: "purchaseProcess", label: "Purchase Process", className: "addOpportunityFormInput", style: { width: "230px" }, rules: [
                                                                    {
                                                                        required: false,
                                                                        message: "This field is mandatory!",
                                                                    },
                                                                ], children: _jsx(Select, { onChange: (value) => handleSelectChange(value, "purchaseProcess"), options: purchaseProcessOptions, disabled: !editable }) }), _jsx(Form.Item, { name: "forecastCategory", label: "Forecast Category", className: "addOpportunityFormInput", style: { width: "230px" }, rules: [
                                                                    {
                                                                        required: false,
                                                                        message: "This field is mandatory!",
                                                                    },
                                                                ], children: _jsx(Select, { onChange: (value) => handleSelectChange(value, "forecastCategory"), options: forecastCategoryOptions, disabled: !editable }) }), _jsx(Form.Item
                                                            // name="stage"
                                                            , { 
                                                                // name="stage"
                                                                label: "Stage", className: "addOpportunityFormInput", style: { width: "230px" }, rules: [
                                                                    {
                                                                        required: false,
                                                                        message: "This field is mandatory!",
                                                                    },
                                                                ], children: _jsx(Popconfirm, { title: `Are you sure you want to close this opportunity as ${wonOrLost}?`, open: popconfirmVisible, onConfirm: confirmChange, onCancel: cancelChange, okText: "Yes", cancelText: "No", children: _jsx(Select, { onChange: (value) => handleSelectChange(value, "stage"), options: stagesOptions, disabled: !editable || opportunity?.stage === "Won" || opportunity?.stage === "Lost", value: opportunity?.stage }) }) })] }), _jsxs("div", { className: "updateOpportunityFlex", children: [_jsx(Form.Item, { name: "status", label: "Status", className: "addOpportunityFormInput", style: { width: "230px" }, rules: [
                                                                    {
                                                                        required: false,
                                                                        message: "This field is mandatory!",
                                                                    },
                                                                ], children: _jsx(Select, { onChange: (value) => handleSelectChange(value, "status"), options: statusOptions, disabled: !editable }) }), _jsx(Form.Item, { name: "priority", label: "Priority", className: "addOpportunityFormInput", style: { width: "230px" }, rules: [
                                                                    {
                                                                        required: false,
                                                                        message: "This field is mandatory!",
                                                                    },
                                                                ], children: _jsx(Select, { onChange: (value) => handleSelectChange(value, "priority"), options: priorityOptions, disabled: !editable }) }), _jsx(Form.Item
                                                            // name="estimatedCloseDate"
                                                            , { 
                                                                // name="estimatedCloseDate"
                                                                style: { width: "230px" }, label: "Est. Close Date", className: "addOpportunityFormInput", rules: [
                                                                    {
                                                                        required: true,
                                                                        message: "This field is mandatory!",
                                                                    },
                                                                ], children: _jsx(DatePicker, { value: opportunity?.estimatedCloseDate
                                                                        ? dayjs(opportunity?.estimatedCloseDate)
                                                                        : null, disabled: !editable, onChange: (_date, dateString) => {
                                                                        // Ensure dateString is a string before converting to Date
                                                                        if (typeof dateString === "string") {
                                                                            const dateObject = new Date(dateString);
                                                                            if (!isNaN(dateObject.getTime())) {
                                                                                // Check if dateObject is valid
                                                                                dispatch(handleInputChangeReducerOpportunity({
                                                                                    estimatedCloseDate: dateObject.toISOString(),
                                                                                }));
                                                                            }
                                                                            else {
                                                                                console.error("Invalid date string:", dateString);
                                                                            }
                                                                        }
                                                                    } }) }), _jsx(Form.Item, { style: { width: "230px" }, label: "Actual Close Date", className: "addOpportunityFormInput", rules: [
                                                                    {
                                                                        required: true,
                                                                        message: "This field is mandatory!",
                                                                    },
                                                                ], children: _jsx(DatePicker, { value: opportunity?.actualCloseDate
                                                                        ? dayjs(opportunity?.actualCloseDate)
                                                                        : null, disabled: !editable, onChange: (_date, dateString) => {
                                                                        // Ensure dateString is a string before converting to Date
                                                                        if (typeof dateString === "string") {
                                                                            const dateObject = new Date(dateString);
                                                                            if (!isNaN(dateObject.getTime())) {
                                                                                // Check if dateObject is valid
                                                                                dispatch(handleInputChangeReducerOpportunity({
                                                                                    actualCloseDate: dateObject.toISOString(),
                                                                                }));
                                                                            }
                                                                            else {
                                                                                console.error("Invalid date string:", dateString);
                                                                            }
                                                                        }
                                                                    } }) }), opportunity?.stage === "Won" ? (_jsx(Form.Item, { name: "wonReason", label: "Won Reason", className: "addOpportunityFormInput", style: { width: "230px" }, rules: [
                                                                    {
                                                                        required: false,
                                                                        message: "This field is mandatory!",
                                                                    },
                                                                ], children: _jsx(Select, { onChange: (value) => handleSelectChange(value, "wonReason"), options: wonReasonOptions, disabled: !editable }) })) : opportunity?.stage === "Lost" ? (_jsx(Form.Item, { name: "lostReason", label: "Lost Reason", className: "addOpportunityFormInput", style: { width: "230px" }, rules: [
                                                                    {
                                                                        required: false,
                                                                        message: "This field is mandatory!",
                                                                    },
                                                                ], children: _jsx(Select, { onChange: (value) => handleSelectChange(value, "lostReason"), options: lostReasonOptions, disabled: !editable }) })) : (_jsx(_Fragment, {}))] })] }), _jsxs("div", { className: "updateOpportunityDivCol", children: [_jsxs("div", { className: "addOpportunitySubTitle", children: [_jsx("img", { src: DESCRIPTION_ICON_ORANGE, alt: "illustration", className: "illustrationIcon" }), "Description"] }), _jsx(Form.Item, { name: "description", label: "Description", className: "addOpportunityFormInput", rules: [
                                                            {
                                                                required: false,
                                                                message: "This field is mandatory!",
                                                            },
                                                        ], children: _jsx(TextArea, { onChange: handleInputChange, name: "description", 
                                                            // placeholder="Please enter here"
                                                            readOnly: !editable, maxLength: 499 }) }), _jsx(Form.Item, { name: "currentNeed", label: "Current Need", className: "addOpportunityFormInput", rules: [
                                                            {
                                                                required: false,
                                                                message: "This field is mandatory!",
                                                            },
                                                        ], children: _jsx(Input, { onChange: handleInputChange, name: "currentNeed", placeholder: "Please enter here", readOnly: !editable, maxLength: 499 }) }), _jsx(Form.Item, { name: "proposedSolution", label: "Proposed Solution", className: "addOpportunityFormInput", rules: [
                                                            {
                                                                required: false,
                                                                message: "This field is mandatory!",
                                                            },
                                                        ], children: _jsx(Input, { onChange: handleInputChange, name: "proposedSolution", placeholder: "Please enter here", readOnly: !editable, maxLength: 499 }) }), opportunity?.stage === "Won" ||
                                                        opportunity?.stage === "Lost" ? (_jsx(Form.Item, { name: "wonLostDescription", label: "Closing Description", className: "addOpportunityFormInput", rules: [
                                                            {
                                                                required: false,
                                                                message: "This field is mandatory!",
                                                            },
                                                        ], children: _jsx(TextArea, { onChange: handleInputChange, name: "wonLostDescription", placeholder: "Please enter here", readOnly: !editable, maxLength: 499 }) })) : (_jsx(_Fragment, {}))] }), _jsx(AuditWindow, {})] }) }) }))] }) }) })] }));
};
export default OneOpportunityById;
