import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Avatar, Button, Form, Input, Modal, Popconfirm, Select, Spin, Tooltip, } from "antd";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/app/hooks";
import "../../styles/oppotunities/oneOpportunity.css";
import "../../styles/activities/floatActivity.css";
import { countryFlags, countryNames, leadSourceOptions, leadsRelatedViewOptions, ratingValuesArray, stateNames, statusValuesArray, } from "../../utilities/common/dataArrays";
import { LeftOutlined, RightOutlined, EditOutlined, CheckCircleOutlined, } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import { fetchAllAccountsWithoutParams } from "../../redux/features/accountsSlice";
import { fetchAllContactsWithoutParams } from "../../redux/features/contactsSlice";
import { getLeadById, handleInputChangeReducerLead, setEditableMode, updateLeadByIdAndGetAudits, updateLeadOwnerByIdAndGetAudits, } from "../../redux/features/leadSlice";
import { fetchAllAuditsByModuleId } from "../../redux/features/auditSlice";
import AuditWindow from "../audit/auditWindow";
import AllRelatedActivities from "../activities/relatedActivitiesListView";
import AllRelatedNotes from "../notes/relatedNotesListView";
import { DESCRIPTION_ICON_ORANGE, GENERAL_INFO_ICON_ORANGE, LOCATION_ICON_ORANGE, OWNER, } from "../../utilities/common/imagesImports";
import TextArea from "antd/es/input/TextArea";
import { addOpportunity, handleInputChangeReducerOpportunity, resetIsModalOpenOpportunity, } from "../../redux/features/opportunitiesSlice";
import AddOpportunityForm from "../opportunities/addOpportunityForm";
import { fetchAllSalesPersonByUserId } from "../../redux/features/organizationSlice";
const OneLeadById = () => {
    const dispatch = useAppDispatch();
    const params = useParams();
    const [form] = Form.useForm();
    const [formOpportunity] = Form.useForm();
    const { lead, addLeadLoader, getLeadLoader, editable } = useAppSelector((state) => state.leads);
    const { isModalOpenOpportunity, opportunity, addOpportunityLoader } = useAppSelector((state) => state.opportunities);
    const { accounts } = useAppSelector((state) => state.accounts);
    const { contacts } = useAppSelector((state) => state.contacts);
    const { screenWidth } = useAppSelector((state) => state.referrals);
    const [relatedView, setRelatedView] = useState("SELECT");
    const leadId = params?.leadId;
    const [popconfirmVisible, setPopconfirmVisible] = useState(false);
    const OWNER_AVATAR = `${lead?.owner?.firstName
        ?.slice(0, 1)
        ?.toLocaleUpperCase()}
                          ${lead?.owner?.lastName
        ?.slice(0, 1)
        ?.toLocaleUpperCase()}`;
    const OWNER_NAME = `${lead?.owner?.firstName}
                          ${lead?.owner?.lastName}`;
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
        await dispatch(updateLeadOwnerByIdAndGetAudits({ ...lead, owner: { userId: ownerId } }));
        await dispatch(setEditableMode(false));
        await setPopconfirmVisible1(false);
    };
    const cancelChange1 = () => {
        setPopconfirmVisible1(false);
        dispatch(getLeadById(leadId));
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        dispatch(handleInputChangeReducerLead({
            [name]: value,
        }));
    };
    const handleSelectChange = (value, name) => {
        if (value === "Qualified" && name === "status") {
            setPopconfirmVisible(true);
        }
        else {
            console.log("name at lead edit 1", name, value);
            dispatch(handleInputChangeReducerLead({
                [name]: value,
            }));
        }
    };
    const confirmChange = async () => {
        await dispatch(resetIsModalOpenOpportunity(true));
        await setPopconfirmVisible(false);
    };
    const cancelChange = () => {
        setPopconfirmVisible(false);
        dispatch(getLeadById(leadId));
    };
    const handleSelectChangeView = (value) => {
        setRelatedView(value);
    };
    const handleBack = () => {
        history.back();
    };
    const handleSubmit = () => {
        if (editable) {
            dispatch(updateLeadByIdAndGetAudits({
                ...lead,
                contact: lead?.contact?.includes("/")
                    ? lead.contact?.split("/")[1]
                    : lead?.contact,
                company: lead?.company?.includes("/")
                    ? lead.company?.split("/")[1]
                    : lead?.company,
            }));
        }
        else {
            dispatch(setEditableMode(true));
        }
    };
    const handleSubmitOpportunity = async () => {
        await dispatch(updateLeadByIdAndGetAudits({ ...lead, status: "Qualified" })).then(() => {
            dispatch(addOpportunity(opportunity));
            dispatch(resetIsModalOpenOpportunity(false));
            dispatch(getLeadById(lead?.leadId));
            formOpportunity.resetFields();
        }).catch(() => {
            console.log("Operation cannot be completed, you may want to contact administrator for help.");
        });
    };
    const handleCancelOpportunity = async () => {
        await dispatch(getLeadById(leadId));
        await dispatch(resetIsModalOpenOpportunity(false));
        await formOpportunity.resetFields();
    };
    useEffect(() => {
        dispatch(fetchAllSalesPersonByUserId());
    }, []);
    useEffect(() => {
        dispatch(setEditableMode(false));
        if (leadId) {
            dispatch(getLeadById(leadId));
        }
    }, [leadId]);
    useEffect(() => {
        form.setFieldsValue(lead);
    }, [lead]);
    useEffect(() => {
        formOpportunity.setFieldsValue({
            title: lead?.title,
            contact: lead?.contact,
            company: lead?.company,
            currency: lead?.currency,
            estimatedRevenue: lead?.price,
            Lead: leadId,
        });
        dispatch(handleInputChangeReducerOpportunity({
            title: lead?.title,
            contact: lead?.contact,
            company: lead?.company,
            currency: lead?.currency,
            estimatedRevenue: lead?.price,
            Lead: leadId,
        }));
    }, [isModalOpenOpportunity, lead]);
    console.log("lead?.status", lead?.status);
    useEffect(() => {
        dispatch(fetchAllAccountsWithoutParams());
        dispatch(fetchAllContactsWithoutParams());
        if (leadId) {
            dispatch(fetchAllAuditsByModuleId({ moduleName: "lead", moduleId: leadId }));
        }
    }, []);
    return (_jsxs("div", { className: "oneOpportunityMainWrapper", children: [_jsx(Modal, { open: isModalOpenOpportunity, onOk: handleSubmitOpportunity, onCancel: handleCancelOpportunity, footer: false, children: _jsxs("div", { className: "addOpportunityFormDiv", children: [_jsx("div", { className: "addOpportunityTitle", children: "New Opportunity" }), _jsx("div", { className: "addOpportunityFormWrapper", children: _jsxs(Form, { form: formOpportunity, name: "loginForm", onFinish: handleSubmitOpportunity, children: [_jsx(AddOpportunityForm, {}), _jsxs(Form.Item, { className: "addOpportunitySubmitBtnWrapper", children: [_jsx(Button, { onClick: handleCancelOpportunity, className: "addOpportunityCancelBtn", children: "Cancel" }), _jsx(Button, { type: "primary", htmlType: "submit", className: "addOpportunitySubmitBtn", loading: addOpportunityLoader, children: "Save" })] })] }) })] }) }), _jsx(Spin, { spinning: getLeadLoader, tip: "Loading...", children: _jsx("div", { className: editable
                        ? "oneOpportunityViewWrapper"
                        : "onceOpportunityViewWrapperNotEdit", children: _jsxs(Form, { form: form, name: "loginForm", onFinish: handleSubmit, initialValues: lead, children: [_jsx("div", { className: "oneOpportunityTopToolbar1", children: _jsxs("div", { className: "opportunitysSelectViewWrapper", children: [_jsxs("div", { className: "opportunitysSelectView1", children: [_jsx(LeftOutlined, { className: "backArrow", onClick: handleBack }), _jsx("div", { className: "opportunitysViewTitle", children: "Leads" }), _jsx(RightOutlined, {}), _jsx("div", { className: "opportunitysViewTitle", children: lead?.title || "" })] }), _jsxs("div", { className: "opportunitysSelectView1", children: [_jsx(Select, { autoFocus: true, value: relatedView, defaultValue: "SELECT", onChange: handleSelectChangeView, style: {
                                                        border: "1px solid var(--gray5)",
                                                        borderRadius: "4px",
                                                        width: "160px",
                                                    }, children: leadsRelatedViewOptions?.map((option, index) => (_jsx(Select.Option, { value: option.value, children: option.label }, index))) }), _jsx(Form.Item, { className: "addOpportunitySubmitBtnWrapper", children: _jsx(Button, { type: "primary", htmlType: "submit", className: "opportunityEditBtn", loading: addLeadLoader, disabled: relatedView !== "SELECT" || lead?.status === "Closed" || lead?.status === "Qualified", children: screenWidth < 768 ? (editable ? (_jsx(Tooltip, { title: "Update Lead", children: _jsx(CheckCircleOutlined, {}) })) : (_jsx(Tooltip, { title: "Save Changes", children: _jsx(EditOutlined, {}) }))) : editable ? ("Save Changes") : ("Edit") }) })] })] }) }), relatedView !== "SELECT" ? (_jsx("div", { className: "updateOpportunityDiv", children: _jsxs("div", { className: "contactEditFormDiv", children: [_jsxs("div", { className: "updateOpportunityDivCol", children: [_jsxs("div", { className: "addOpportunitySubTitle", children: [_jsx("div", { className: "illustrationIconWrapper", children: _jsx("img", { src: GENERAL_INFO_ICON_ORANGE, alt: "illustration", className: "illustrationIcon" }) }), "General Information"] }), _jsxs("div", { className: "updateOpportunityFlex", children: [_jsx(Form.Item, { name: "title", label: "Lead Title", className: "addOpportunityFormInput", style: { width: "230px" }, rules: [
                                                                {
                                                                    required: true,
                                                                    message: "This field is mandatory!",
                                                                },
                                                            ], children: _jsx(Input, { onChange: handleInputChange, name: "title", type: "string", placeholder: "Please enter here", readOnly: !editable }) }), _jsx(Form.Item, { name: "firstName", label: "First Name", className: "addOpportunityFormInput", style: { width: "230px" }, rules: [
                                                                {
                                                                    required: true,
                                                                    message: "This field is mandatory!",
                                                                },
                                                            ], children: _jsx(Input, { onChange: handleInputChange, name: "firstName", type: "string", placeholder: "Please enter here", readOnly: !editable }) }), _jsx(Form.Item, { name: "lastName", label: "Last Name", className: "addOpportunityFormInput", style: { width: "230px" }, rules: [
                                                                {
                                                                    required: true,
                                                                    message: "This field is mandatory!",
                                                                },
                                                            ], children: _jsx(Input, { onChange: handleInputChange, name: "lastName", type: "string", placeholder: "Please enter here", readOnly: !editable }) }), _jsx(Form.Item, { name: "phone", label: "Contact No.", className: "addOpportunityFormInput", rules: [
                                                                {
                                                                    required: true,
                                                                    message: "This field is mandatory!",
                                                                },
                                                                {
                                                                    pattern: /^\d*$/,
                                                                    message: "Please enter a valid phone number!",
                                                                },
                                                            ], children: _jsxs("div", { style: { display: "flex", gap: "5px" }, children: [_jsx(Select, { value: lead?.countryCode, style: { width: "250px" }, onChange: (value) => handleSelectChange(value, "countryCode"), options: countryFlags?.map((flag) => ({
                                                                            value: flag.key,
                                                                            label: (_jsxs("div", { style: {
                                                                                    display: "flex",
                                                                                    alignItems: "center",
                                                                                }, children: [_jsx("img", { src: flag.value, alt: "flagIcon", style: {
                                                                                            width: "20px",
                                                                                            height: "15px",
                                                                                            marginRight: "10px",
                                                                                        } }), flag.label, " (", flag.key, ")"] })),
                                                                        })), showSearch: true, disabled: !editable, placeholder: "Select a country", filterOption: (input, option) => option?.label.props.children[1]
                                                                            .toLowerCase()
                                                                            .includes(input.toLowerCase()) }), _jsx(Input, { onChange: handleInputChange, name: "phone", type: "tel", placeholder: "Please enter here", readOnly: !editable, value: lead?.phone })] }) })] })] }), _jsxs("div", { className: "opportunityInfo1", children: [_jsxs("div", { className: "opportunityInfo1CompanyNameLabel", children: [_jsx("img", { src: OWNER, alt: "illustration", className: "illustrationIcon" }), "Owner"] }), _jsxs("div", { className: "opportunityOwnerDiv", children: [_jsx(Avatar, { children: OWNER_AVATAR }), _jsx("div", { className: "opportunityOwnerInfo", children: _jsx("p", { className: "opportunityInfo1CompanyName", children: OWNER_NAME }) })] })] })] }) })) : null, relatedView === "ACTIVITIES" ? (_jsx(_Fragment, { children: _jsx(AllRelatedActivities, { moduleName: "lead", moduleId: lead?.leadId }) })) : relatedView === "NOTES" ? (_jsx(_Fragment, { children: _jsx(AllRelatedNotes, { moduleName: "lead", moduleId: lead?.leadId }) })) : (_jsx("div", { children: _jsx("div", { className: "updateOpportunityDiv", children: _jsxs("div", { className: "updateOpportunityOwnerDiv", children: [_jsxs("div", { className: "opportunityEditFormDiv", children: [_jsxs("div", { className: "updateOpportunityDivCol", children: [_jsxs("div", { className: "addOpportunitySubTitle", children: [_jsx("div", { className: "illustrationIconWrapper", children: _jsx("img", { src: GENERAL_INFO_ICON_ORANGE, alt: "illustration", className: "illustrationIcon" }) }), "General Information"] }), _jsxs("div", { className: "updateOpportunityFlex", children: [_jsx(Form.Item, { name: "title", label: "Title", className: "addOpportunityFormInput", style: { width: "230px" }, rules: [
                                                                            {
                                                                                required: true,
                                                                                message: "This field is mandatory!",
                                                                            },
                                                                        ], children: _jsx(Input, { onChange: handleInputChange, name: "title", type: "string", placeholder: "Please enter here", readOnly: !editable }) }), _jsx(Form.Item, { name: "firstName", label: "First Name", className: "addOpportunityFormInput", style: { width: "230px" }, rules: [
                                                                            {
                                                                                required: true,
                                                                                message: "This field is mandatory!",
                                                                            },
                                                                        ], children: _jsx(Input, { onChange: handleInputChange, name: "firstName", type: "string", placeholder: "Please enter here", readOnly: !editable }) }), _jsx(Form.Item, { name: "lastName", label: "Last Name", className: "addOpportunityFormInput", style: { width: "230px" }, rules: [
                                                                            {
                                                                                required: true,
                                                                                message: "This field is mandatory!",
                                                                            },
                                                                        ], children: _jsx(Input, { onChange: handleInputChange, name: "lastName", type: "string", placeholder: "Please enter here", readOnly: !editable }) }), _jsx(Form.Item, { name: "phone", label: "Contact No.", className: "addOpportunityFormInput", rules: [
                                                                            {
                                                                                required: true,
                                                                                message: "This field is mandatory!",
                                                                            },
                                                                            {
                                                                                pattern: /^\d*$/,
                                                                                message: "Please enter a valid phone number!",
                                                                            },
                                                                        ], children: _jsxs("div", { style: { display: "flex", gap: "5px" }, children: [_jsx(Select, { value: lead?.countryCode, style: { width: "150px" }, onChange: (value) => handleSelectChange(value, "countryCode"), options: countryFlags?.map((flag) => ({
                                                                                        value: flag.key,
                                                                                        label: (_jsxs("div", { style: {
                                                                                                display: "flex",
                                                                                                alignItems: "center",
                                                                                            }, children: [_jsx("img", { src: flag.value, alt: "flagIcon", style: {
                                                                                                        width: "20px",
                                                                                                        height: "15px",
                                                                                                        marginRight: "10px",
                                                                                                    } }), flag.label, " (", flag.key, ")"] })),
                                                                                    })), showSearch: true, disabled: !editable, placeholder: "Select a country", filterOption: (input, option) => option?.label.props.children[1]
                                                                                        .toLowerCase()
                                                                                        .includes(input.toLowerCase()) }), _jsx(Input, { onChange: handleInputChange, name: "phone", type: "tel", placeholder: "Please enter here", readOnly: !editable, value: lead?.phone })] }) })] })] }), _jsxs("div", { className: "opportunityInfo1", children: [_jsxs("div", { className: "opportunityInfo1CompanyNameLabel", children: [_jsx("img", { src: OWNER, alt: "illustration", className: "illustrationIcon" }), "Owner"] }), _jsxs("div", { className: "opportunityOwnerDiv", children: [_jsx(Avatar, { children: OWNER_AVATAR }), _jsx(Popconfirm, { title: "Are you sure you want to change the owner of this record?", open: popconfirmVisible1, onConfirm: confirmChange1, onCancel: cancelChange1, okText: "Yes", cancelText: "No", children: _jsx(Select, { className: "dashboardSelect", placeholder: "search sales person", showSearch: true, style: { width: "200px" }, disabled: !editable, value: OWNER_NAME, onChange: (value) => {
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
                                                                            }) }) })] })] })] }), _jsxs("div", { className: "updateOpportunityDivCol", children: [_jsxs("div", { className: "addOpportunitySubTitle", children: [_jsx("img", { src: LOCATION_ICON_ORANGE, alt: "illustration", className: "illustrationIcon" }), "Location"] }), _jsxs("div", { className: "updateOpportunityFlex", children: [_jsx(Form.Item, { name: "email", label: "Email", className: "addContactFormInput", style: { width: "230px" }, rules: [
                                                                    {
                                                                        type: "email",
                                                                        message: "The input is not valid E-mail!",
                                                                    },
                                                                    {
                                                                        required: true,
                                                                        message: "Please input your E-mail!",
                                                                    },
                                                                ], children: _jsx(Input, { onChange: handleInputChange, name: "email", type: "string", placeholder: "Please enter here", readOnly: !editable }) }), _jsx(Form.Item, { name: "country", label: "Country", className: "addContactFormInput", style: { width: "230px" }, rules: [
                                                                    {
                                                                        required: true,
                                                                        message: "This field is mandatory!",
                                                                    },
                                                                ], children: _jsx(Select, { onChange: (value) => handleSelectChange(value, "country"), options: countryNames, disabled: !editable, showSearch: true }) }), lead?.country === "India" ? (_jsx(Form.Item, { name: "state", label: "State", className: "addContactFormInput", style: { width: "230px" }, rules: [
                                                                    {
                                                                        required: true,
                                                                        message: "This field is mandatory!",
                                                                    },
                                                                ], children: _jsx(Select, { onChange: (value) => handleSelectChange(value, "state"), options: stateNames, disabled: !editable, showSearch: true }) })) : (_jsx(Form.Item, { name: "state", label: "State", className: "addContactFormInput", style: { width: "230px" }, rules: [
                                                                    {
                                                                        required: true,
                                                                        message: "This field is mandatory!",
                                                                    },
                                                                ], children: _jsx(Input, { onChange: handleInputChange, name: "state", type: "string", placeholder: "Please enter here", readOnly: !editable }) })), _jsx(Form.Item, { name: "city", label: "City", className: "addContactFormInput", style: { width: "230px" }, rules: [
                                                                    {
                                                                        required: true,
                                                                        message: "This field is mandatory!",
                                                                    },
                                                                ], children: _jsx(Input, { onChange: handleInputChange, name: "city", type: "string", placeholder: "Please enter here", readOnly: !editable }) })] })] }), _jsxs("div", { className: "updateOpportunityDivCol", children: [_jsxs("div", { className: "addOpportunitySubTitle", children: [_jsx("img", { src: DESCRIPTION_ICON_ORANGE, alt: "illustration", className: "illustrationIcon" }), "Description"] }), _jsxs("div", { className: "updateOpportunityDescriptionDiv", children: [_jsxs("div", { children: [_jsxs("div", { className: "updateOpportunityFlex", children: [_jsx(Form.Item, { name: "rating", label: "Rating", className: "addOpportunityFormInput", style: { width: "230px" }, rules: [
                                                                                    {
                                                                                        required: false,
                                                                                        message: "This field is mandatory!",
                                                                                    },
                                                                                ], children: _jsx(Select, { onChange: (value) => handleSelectChange(value, "rating"), options: ratingValuesArray, disabled: !editable }) }), _jsx(Form.Item, { name: "status", label: "Status", className: "addOpportunityFormInput", style: { width: "230px" }, rules: [
                                                                                    {
                                                                                        required: false,
                                                                                        message: "This field is mandatory!",
                                                                                    },
                                                                                ], children: _jsx(Popconfirm, { title: "Are you sure you want to Qualify this lead?", open: popconfirmVisible, onConfirm: confirmChange, onCancel: cancelChange, okText: "Yes", cancelText: "No", children: _jsx(Select, { showSearch: true, onChange: (value) => handleSelectChange(value, "status"), options: statusValuesArray, disabled: !editable || lead?.status === "Closed" || lead?.status === "Qualified", value: lead?.status }) }) }), _jsx(Form.Item, { name: "contact", label: "Contact", className: "addOpportunityFormInput", style: { width: "250px" }, rules: [
                                                                                    {
                                                                                        required: false,
                                                                                        message: "This field is mandatory!",
                                                                                    },
                                                                                ], children: _jsx(Select, { showSearch: true, onChange: (value) => handleSelectChange(value, "contact"), options: contactsOptions, disabled: !editable }) })] }), _jsxs("div", { className: "updateOpportunityFlex", children: [_jsx(Form.Item, { name: "leadSource", label: "Lead Source", className: "addOpportunityFormInput", style: { width: "230px" }, rules: [
                                                                                    {
                                                                                        required: false,
                                                                                        message: "This field is mandatory!",
                                                                                    },
                                                                                ], children: _jsx(Select, { onChange: (value) => handleSelectChange(value, "leadSource"), options: leadSourceOptions, disabled: !editable }) }), _jsx(Form.Item, { name: "price", label: "Est. Revenue", className: "addOpportunityFormInput", style: { width: "230px" }, rules: [
                                                                                    {
                                                                                        required: false,
                                                                                        message: "This field is mandatory!",
                                                                                    },
                                                                                ], children: _jsx(Input, { onChange: handleInputChange, name: "price", type: "number", placeholder: "Please enter here", readOnly: !editable }) }), _jsx(Form.Item, { name: "company", label: "Company", className: "addOpportunityFormInput", style: { width: "230px" }, rules: [
                                                                                    {
                                                                                        required: false,
                                                                                        message: "This field is mandatory!",
                                                                                    },
                                                                                ], children: _jsx(Select, { onChange: (value) => handleSelectChange(value, "company"), options: companyOptions, disabled: !editable }) })] })] }), _jsx("div", { children: _jsx(Form.Item, { name: "description", label: "Description", className: "addContactFormInput", rules: [
                                                                        {
                                                                            required: false,
                                                                            message: "This field is mandatory!",
                                                                        },
                                                                    ], children: _jsx(TextArea, { onChange: handleInputChange, style: {
                                                                            border: "1px solid var(--gray4)",
                                                                            width: "400px",
                                                                            height: "150px",
                                                                        }, name: "description", 
                                                                        // placeholder="Please enter here"
                                                                        readOnly: !editable, maxLength: 499 }) }) })] })] }), _jsx(AuditWindow, {})] }) }) }))] }) }) })] }));
};
export default OneLeadById;
