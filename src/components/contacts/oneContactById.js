import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Avatar, Button, Form, Input, Popconfirm, Select, Spin, Tooltip, Alert } from "antd";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/app/hooks";
import "../../styles/contacts/contactsView.css";
import { conactsRelatedViewOptions, contactTypesOptions, countryFlags, countryNames, industryTypeValuesArray, stateNames, statusOptions, yesOrNo, } from "../../utilities/common/dataArrays";
import TextArea from "antd/es/input/TextArea";
import { DESCRIPTION_ICON_ORANGE, GENERAL_INFO_ICON_ORANGE, LOCATION_ICON_ORANGE, OWNER, } from "../../utilities/common/imagesImports";
import { getContactById, handleInputChangeReducerContact, setEditableMode, updateContactByIdAndGetAudits, } from "../../redux/features/contactsSlice";
import { useParams } from "react-router-dom";
import { handleBack } from "../../utilities/common/commonFunctions/handleBack";
import { LeftOutlined, RightOutlined, CheckCircleOutlined, EditOutlined, } from "@ant-design/icons";
import { fetchAllAuditsByModuleId } from "../../redux/features/auditSlice";
import AuditWindow from "../audit/auditWindow";
import { fetchAllAccountsWithoutParams } from "../../redux/features/accountsSlice";
import AllRelatedLeads from "../leads/relatedLeadsListView";
import AllRelatedOpportunities from "../opportunities/relatedOpportunitiesListView";
import AllRelatedActivities from "../activities/relatedActivitiesListView";
import AllRelatedNotes from "../notes/relatedNotesListView";
import RelatedDocumentsListView from "../documents/RelatedDocumentsListView";
import { fetchAllSalesPersonByUserId } from "../../redux/features/organizationSlice";
import { extractContactId } from "../../utils/contactUtils";
const OneContactById = () => {
    const dispatch = useAppDispatch();
    const [form] = Form.useForm();
    const paramsContactId = useParams();
    // Validate and extract contactId with error detection
    const rawContactId = paramsContactId?.contactId;
    let contactId = '';
    // Special handling for the "[object Object]" string which indicates a bug
    if (rawContactId === '[object Object]') {
        console.error('=== DEBUG: Invalid contact ID format "[object Object]" detected ===');
        contactId = '';
    }
    else {
        contactId = extractContactId(rawContactId);
    }
    console.log('=== DEBUG: OneContactById RENDER ===');
    console.log('Raw contactId from URL:', rawContactId);
    console.log('Sanitized contactId:', contactId);
    const { contact, addContactLoader, getContactLoader, editable } = useAppSelector((state) => state.contacts);
    console.log('contact from Redux:', contact);
    console.log('contactLoader state:', { addContactLoader, getContactLoader, editable });
    const { accounts } = useAppSelector((state) => state.accounts);
    const { user } = useAppSelector((state) => state.authentication);
    const [relatedView, setRelatedView] = useState("SELECT");
    const [error, setError] = useState(null);
    // Check for invalid contactId immediately
    useEffect(() => {
        if (rawContactId === '[object Object]') {
            setError('Invalid contact ID format. This may happen when clicking on a contact link from an invalid source.');
        }
    }, [rawContactId]);
    useEffect(() => {
        const handleError = (event) => {
            console.error('Global error caught:', event.error);
            console.error('Error message:', event.message);
            console.error('Error stack:', event.error?.stack);
            setError(`Unhandled error: ${event.message}`);
        };
        window.addEventListener('error', handleError);
        console.log('=== DEBUG: Error handler attached ===');
        return () => {
            window.removeEventListener('error', handleError);
        };
    }, []);
    const companyOptions = accounts?.map((item) => {
        return { ...item, value: item?.accountId, label: item?.accountName };
    });
    const { screenWidth } = useAppSelector((state) => state.referrals);
    const [isOtherIndutry, setIsOtherIndutry] = useState(false);
    const contactToken = user?.organisation && user?.organisation?.contactToken
        ? ` ${user.organisation.contactToken}`
        : " Contacts";
    const OWNER_AVATAR = `${contact?.owner?.firstName
        ?.slice(0, 1)
        ?.toLocaleUpperCase()}
                          ${contact?.owner?.lastName
        ?.slice(0, 1)
        ?.toLocaleUpperCase()}`;
    const OWNER_NAME = `${contact?.owner?.firstName}
                          ${contact?.owner?.lastName}`;
    const [ownerId, setOwnerId] = useState("");
    const [popconfirmVisible, setPopconfirmVisible] = useState(false);
    const { salesPersonData } = useAppSelector((state) => state.organisations);
    const confirmChange = async () => {
        await dispatch(updateContactByIdAndGetAudits({ ...contact, owner: { userId: ownerId } }));
        await dispatch(setEditableMode(false));
        await setPopconfirmVisible(false);
    };
    const cancelChange = () => {
        setPopconfirmVisible(false);
        dispatch(getContactById(contactId));
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        dispatch(handleInputChangeReducerContact({
            [name]: value,
        }));
    };
    const handleSelectChange = (value, name) => {
        if (name === "industry" && value === "") {
            setIsOtherIndutry(true);
        }
        else if (name === "industry" && value !== "") {
            setIsOtherIndutry(false);
            dispatch(handleInputChangeReducerContact({
                [name]: value,
            }));
        }
        else {
            dispatch(handleInputChangeReducerContact({
                [name]: value,
            }));
        }
    };
    const handleSelectChangeView = (value) => {
        console.log('=== DEBUG: Changing related view to:', value);
        setRelatedView(value);
    };
    const handleSubmit = () => {
        if (editable) {
            dispatch(updateContactByIdAndGetAudits(contact));
        }
        else {
            dispatch(setEditableMode(true));
        }
    };
    useEffect(() => {
        dispatch(fetchAllSalesPersonByUserId());
    }, []);
    useEffect(() => {
        console.log('=== DEBUG: Starting contact fetch useEffect ===');
        if (contactId) {
            console.log('Loading contact with ID:', contactId);
            if (typeof contactId !== 'string' || contactId.trim() === '') {
                console.error('Invalid contactId format:', contactId);
                setError('Contact ID format is invalid');
                return;
            }
            dispatch(setEditableMode(false));
            setError(null);
            console.log('Dispatching getContactById action...');
            const fetchAction = dispatch(getContactById(contactId));
            console.log('Fetch action dispatched:', fetchAction);
            fetchAction
                .unwrap()
                .then(result => {
                console.log('Successfully loaded contact:', result);
                if (!result || !result.data) {
                    console.warn('Contact data is empty or missing');
                }
            })
                .catch((err) => {
                console.error('Error fetching contact:', err);
                console.error('Error details:', JSON.stringify(err, null, 2));
                setError('Failed to load contact information. Please try again.');
            });
            console.log('Dispatching audit fetch...');
            dispatch(fetchAllAuditsByModuleId({ moduleName: "contact", moduleId: contactId }));
            console.log('Dispatching accounts fetch...');
            dispatch(fetchAllAccountsWithoutParams());
        }
        else {
            console.error('Missing contactId in URL parameters');
            setError("Contact ID is missing or invalid");
        }
    }, [contactId, dispatch]);
    useEffect(() => {
        console.log('=== DEBUG: Form values update effect ===');
        console.log('Current contact data:', contact);
        try {
            form.setFieldsValue(contact);
            console.log('Form fields updated successfully');
        }
        catch (err) {
            console.error('Error updating form fields:', err);
        }
    }, [contact, form]);
    // Add debug log outside of JSX to avoid linter error
    console.log('=== DEBUG: Rendering component with state ===', { error, getContactLoader, contact });
    return (_jsx("div", { className: "oneContactMainWrapper", children: _jsx(Spin, { spinning: getContactLoader, tip: "Loading...", children: error ? (_jsxs("div", { className: "error-message-container", children: [_jsx("h3", { children: "Error" }), _jsx("p", { children: error }), _jsx(Button, { onClick: () => handleBack(), children: "Go Back" })] })) : (_jsx("div", { className: editable ? "oneContactViewWrapper" : "onceContactViewWrapperNotEdit", children: contact ? (_jsxs(Form, { form: form, name: "loginForm", onFinish: handleSubmit, initialValues: contact, children: [_jsx("div", { className: "oneOpportunityTopToolbar1", children: _jsxs("div", { className: "opportunitysSelectViewWrapper", children: [_jsxs("div", { className: "opportunitysSelectView1", children: [_jsx(LeftOutlined, { className: "backArrow", onClick: handleBack }), _jsx("div", { className: "opportunitysViewTitle", children: contactToken }), _jsx(RightOutlined, {}), _jsx("div", { className: "opportunitysViewTitle", children: `${contact?.firstName} ${contact?.lastName}` || "" })] }), _jsxs("div", { className: "opportunitysSelectView1", children: [_jsx(Select, { autoFocus: true, value: relatedView, defaultValue: "SELECT", onChange: handleSelectChangeView, style: {
                                                    border: "1px solid var(--gray5)",
                                                    borderRadius: "4px",
                                                    width: "160px",
                                                }, children: conactsRelatedViewOptions?.map((option, index) => (_jsx(Select.Option, { value: option.value, children: option.label }, index))) }), _jsx(Form.Item, { className: "addContactSubmitBtnWrapper", children: _jsx(Button, { type: "primary", htmlType: "submit", className: "contactEditBtn", loading: addContactLoader, disabled: relatedView !== "SELECT", children: screenWidth < 768 ? (editable ? (_jsx(Tooltip, { title: "Update Contact", children: _jsx(CheckCircleOutlined, {}) })) : (_jsx(Tooltip, { title: "Save Changes", children: _jsx(EditOutlined, {}) }))) : editable ? ("Save Changes") : ("Edit") }) })] })] }) }), relatedView !== "SELECT" ? (_jsx("div", { className: "updateContactDiv", children: _jsxs("div", { className: "contactEditFormDiv", children: [_jsxs("div", { className: "updateOpportunityDivCol", children: [_jsxs("div", { className: "addOpportunitySubTitle", children: [_jsx("div", { className: "illustrationIconWrapper", children: _jsx("img", { src: GENERAL_INFO_ICON_ORANGE, alt: "illustration", className: "illustrationIcon" }) }), "Contact Information"] }), _jsxs("div", { className: "updateContactFlex", children: [_jsx(Form.Item, { name: "firstName", label: "First Name", className: "addContactFormInput", style: { width: "230px" }, rules: [
                                                            {
                                                                required: true,
                                                                message: "This field is mandatory!",
                                                            },
                                                        ], children: _jsx(Input, { onChange: handleInputChange, name: "firstName", type: "string", placeholder: "Please enter here" }) }), _jsx(Form.Item, { name: "lastName", label: "Last Name", className: "addContactFormInput", style: { width: "230px" }, rules: [
                                                            {
                                                                required: true,
                                                                message: "This field is mandatory!",
                                                            },
                                                        ], children: _jsx(Input, { onChange: handleInputChange, name: "lastName", type: "string", placeholder: "Please enter here" }) }), _jsx(Form.Item, { name: "email", label: "Email", className: "addContactFormInput", style: { width: "230px" }, rules: [
                                                            {
                                                                type: "email",
                                                                message: "The input is not valid E-mail!",
                                                            },
                                                            {
                                                                required: false,
                                                                message: "Please input your E-mail!",
                                                            },
                                                        ], children: _jsx(Input, { onChange: handleInputChange, name: "email", placeholder: "Please enter here" }) }), _jsx(Form.Item, { name: "phone", label: "Contact No.", className: "addContactFormInput", rules: [
                                                            {
                                                                required: true,
                                                                message: "This field is mandatory!",
                                                            },
                                                            {
                                                                pattern: /^\d*$/,
                                                                message: "Please enter a valid phone number!",
                                                            },
                                                        ], children: _jsxs("div", { style: { display: "flex", gap: "5px" }, children: [_jsx(Select, { value: contact?.countryCode, style: { width: "250px" }, onChange: (value) => handleSelectChange(value, "countryCode"), options: countryFlags?.map((flag) => ({
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
                                                                        .includes(input.toLowerCase()) }), _jsx(Input, { onChange: handleInputChange, name: "phone", type: "tel", placeholder: "Please enter here", readOnly: !editable, value: contact?.phone })] }) })] })] }), _jsxs("div", { className: "opportunityInfo1", children: [_jsxs("div", { className: "opportunityInfo1CompanyNameLabel", children: [_jsx("img", { src: OWNER, alt: "illustration", className: "illustrationIcon" }), "Owner"] }), _jsxs("div", { className: "opportunityOwnerDiv", children: [_jsx(Avatar, { children: OWNER_AVATAR }), _jsx("div", { className: "opportunityOwnerInfo", children: _jsx("p", { className: "opportunityInfo1CompanyName", children: OWNER_NAME }) })] })] })] }) })) : null, relatedView === "LEADS" ? (_jsx(_Fragment, { children: _jsx(AllRelatedLeads, { moduleId: contactId ? contactId : "", moduleName: "contact" }) })) : relatedView === "OPPORTUNITIES" ? (_jsx(_Fragment, { children: _jsx(AllRelatedOpportunities, { moduleId: contactId ? contactId : "", moduleName: "contact" }) })) : relatedView === "ACTIVITIES" ? (_jsx(_Fragment, { children: _jsx(AllRelatedActivities, { moduleName: "contact", moduleId: contact?.contactId }) })) : relatedView === "NOTES" ? (_jsx(_Fragment, { children: _jsx(AllRelatedNotes, { moduleName: "contact", moduleId: contact?.contactId }) })) : relatedView === "DOCUMENTS" ? (_jsx(_Fragment, { children: (() => {
                                if (contact?.contactId) {
                                    console.log('=== DEBUG: Rendering Documents view with contact object:', contact);
                                    // Use the utility function to extract the contactId
                                    const safeContactId = extractContactId(contact);
                                    console.log('=== DEBUG: Extracted contactId using utility:', safeContactId);
                                    return (_jsx(RelatedDocumentsListView, { contactId: safeContactId }));
                                }
                                else {
                                    return (_jsx(Alert, { message: "Missing Information", description: "Contact ID is required to display documents. Please refresh the page or go back.", type: "warning", showIcon: true }));
                                }
                            })() })) : (_jsx("div", { children: _jsx("div", { className: "updateContactDiv", children: _jsxs("div", { className: "updateContactOwnerDiv", children: [_jsxs("div", { className: "contactEditFormDiv", children: [_jsxs("div", { className: "updateContactDivCol", children: [_jsxs("div", { className: "addOpportunitySubTitle", children: [_jsx("div", { className: "illustrationIconWrapper", children: _jsx("img", { src: GENERAL_INFO_ICON_ORANGE, alt: "illustration", className: "illustrationIcon" }) }), "Contact Information"] }), _jsxs("div", { className: "updateContactFlex", children: [_jsx(Form.Item, { name: "firstName", label: "First Name", className: "addContactFormInput", style: { width: "230px" }, rules: [
                                                                        {
                                                                            required: true,
                                                                            message: "This field is mandatory!",
                                                                        },
                                                                    ], children: _jsx(Input, { onChange: handleInputChange, name: "firstName", type: "string", placeholder: "Please enter here", readOnly: !editable }) }), _jsx(Form.Item, { name: "lastName", label: "Last Name", className: "addContactFormInput", style: { width: "230px" }, rules: [
                                                                        {
                                                                            required: true,
                                                                            message: "This field is mandatory!",
                                                                        },
                                                                    ], children: _jsx(Input, { onChange: handleInputChange, name: "lastName", type: "string", placeholder: "Please enter here", readOnly: !editable }) }), _jsx(Form.Item, { name: "email", label: "Email", className: "addContactFormInput", style: { width: "230px" }, rules: [
                                                                        {
                                                                            type: "email",
                                                                            message: "The input is not valid E-mail!",
                                                                        },
                                                                        {
                                                                            required: false,
                                                                            message: "Please input your E-mail!",
                                                                        },
                                                                    ], children: _jsx(Input, { onChange: handleInputChange, name: "email", placeholder: "Please enter here", readOnly: !editable }) }), _jsx(Form.Item, { name: "phone", label: "Contact No.", className: "addContactFormInput", rules: [
                                                                        {
                                                                            required: true,
                                                                            message: "This field is mandatory!",
                                                                        },
                                                                        {
                                                                            pattern: /^\d*$/,
                                                                            message: "Please enter a valid phone number!",
                                                                        },
                                                                    ], children: _jsxs("div", { style: { display: "flex", gap: "5px" }, children: [_jsx(Select, { value: contact?.countryCode, style: { width: "250px" }, onChange: (value) => handleSelectChange(value, "countryCode"), options: countryFlags?.map((flag) => ({
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
                                                                                    .includes(input.toLowerCase()) }), _jsx(Input, { onChange: handleInputChange, name: "phone", type: "tel", placeholder: "Please enter here", readOnly: !editable, value: contact?.phone })] }) })] })] }), _jsxs("div", { className: "opportunityInfo1", children: [_jsxs("div", { className: "opportunityInfo1CompanyNameLabel", children: [_jsx("img", { src: OWNER, alt: "illustration", className: "illustrationIcon" }), "Owner"] }), _jsxs("div", { className: "opportunityOwnerDiv", children: [_jsx(Avatar, { children: OWNER_AVATAR }), _jsx(Popconfirm, { title: "Are you sure you want to change the owner of this record?", open: popconfirmVisible, onConfirm: confirmChange, onCancel: cancelChange, okText: "Yes", cancelText: "No", children: _jsx(Select, { className: "dashboardSelect", placeholder: "search sales person", showSearch: true, style: { width: "200px" }, disabled: !editable, value: OWNER_NAME, onChange: (value) => {
                                                                            setOwnerId(value);
                                                                            setPopconfirmVisible(true);
                                                                        }, filterOption: (input, option) => {
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
                                                                        }) }) })] })] })] }), _jsx("div", { className: "updateContactDivCol", children: _jsxs("div", { className: "updateContactFlex", style: { marginTop: "30px" }, children: [_jsx(Form.Item, { name: "contactType", label: "Contact Type", className: "addContactFormInput", style: { width: "230px" }, rules: [
                                                            {
                                                                required: true,
                                                                message: "This field is mandatory!",
                                                            },
                                                        ], children: _jsx(Select, { onChange: (value) => handleSelectChange(value, "contactType"), options: contactTypesOptions, disabled: !editable }) }), _jsx(Form.Item, { name: "favourite", label: "Favourite", className: "addContactFormInput", style: { width: "230px" }, rules: [
                                                            {
                                                                required: false,
                                                                message: "This field is mandatory!",
                                                            },
                                                        ], children: _jsx(Select, { onChange: (value) => handleSelectChange(value, "favourite"), options: yesOrNo, disabled: !editable }) }), _jsx(Form.Item, { name: "company", label: "Company", className: "addOpportunityFormInput", style: { width: "230px" }, rules: [
                                                            {
                                                                required: false,
                                                                message: "This field is mandatory!",
                                                            },
                                                        ], children: _jsx(Select, { onChange: (value) => handleSelectChange(value, "company"), options: companyOptions, disabled: !editable }) }), _jsx(Form.Item, { name: "designation", label: "Designation", className: "addContactFormInput", style: { width: "230px" }, rules: [
                                                            {
                                                                required: false,
                                                                message: "This field is mandatory!",
                                                            },
                                                        ], children: _jsx(Input, { onChange: handleInputChange, name: "designation", type: "text", placeholder: "Please enter here", readOnly: !editable }) }), _jsx(Form.Item, { name: "industry", label: "Industry", className: "addContactFormInput", style: { width: "230px" }, rules: [
                                                            {
                                                                required: true,
                                                                message: "This field is mandatory!",
                                                            },
                                                        ], children: isOtherIndutry ? (_jsx(Input, { onChange: handleInputChange, name: "industry", placeholder: "Enter industry type here" })) : (_jsx(Select, { onChange: (value) => handleSelectChange(value, "industry"), options: industryTypeValuesArray, disabled: !editable })) })] }) }), _jsxs("div", { className: "updateContactDivCol", children: [_jsxs("div", { className: "addOpportunitySubTitle", children: [_jsx("div", { className: "illustrationIconWrapper", children: _jsx("img", { src: LOCATION_ICON_ORANGE, alt: "illustration", className: "illustrationIcon" }) }), "Location"] }), _jsxs("div", { className: "updateContactFlex", children: [_jsx(Form.Item, { label: "Address Line 1", name: "addressLine", className: "addContactFormInput", style: { width: "230px" }, rules: [
                                                                {
                                                                    required: true,
                                                                    message: "This field is mandatory!",
                                                                },
                                                            ], children: _jsx(Input, { onChange: handleInputChange, name: "addressLine", type: "string", placeholder: "Please enter here", readOnly: !editable }) }), _jsx(Form.Item, { name: "country", label: "Country", className: "addContactFormInput", style: { width: "230px" }, rules: [
                                                                {
                                                                    required: true,
                                                                    message: "This field is mandatory!",
                                                                },
                                                            ], children: _jsx(Select, { onChange: (value) => handleSelectChange(value, "country"), options: countryNames, disabled: !editable, showSearch: true }) }), contact?.country === "India" ? (_jsx(Form.Item, { name: "state", label: "State", className: "addContactFormInput", style: { width: "230px" }, rules: [
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
                                                            ], children: _jsx(Input, { onChange: handleInputChange, name: "city", type: "string", placeholder: "Please enter here", readOnly: !editable }) })] })] }), _jsxs("div", { className: "updateContactDivCol", children: [_jsxs("div", { className: "addOpportunitySubTitle", children: [_jsx("div", { className: "illustrationIconWrapper", children: _jsx("img", { src: DESCRIPTION_ICON_ORANGE, alt: "illustration", className: "illustrationIcon" }) }), "Description"] }), _jsxs("div", { className: "updateContactFlex", children: [_jsx(Form.Item, { name: "status", label: "Status", className: "addContactFormInput", style: { width: "230px" }, rules: [
                                                                {
                                                                    required: true,
                                                                    message: "This field is mandatory!",
                                                                },
                                                            ], children: _jsx(Select, { onChange: (value) => handleSelectChange(value, "status"), options: statusOptions, disabled: !editable }) }), _jsx(Form.Item, { name: "description", label: "Description", className: "addContactFormInput", rules: [
                                                                {
                                                                    required: false,
                                                                    message: "This field is mandatory!",
                                                                },
                                                            ], children: _jsx(TextArea, { style: {
                                                                    width: "600px",
                                                                }, onChange: handleInputChange, name: "description", readOnly: !editable, maxLength: 499 }) })] })] }), _jsx(AuditWindow, {})] }) }) }))] })) : (_jsxs("div", { className: "loading-placeholder", children: [_jsx(Spin, { tip: "Initializing contact data..." }), _jsx("p", { children: "If this message persists, there might be an issue with loading the contact." })] })) })) }) }));
};
export default OneContactById;
