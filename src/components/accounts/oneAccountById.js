import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Avatar, Button, Form, Input, Popconfirm, Select, Spin, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/app/hooks";
import { getAccountById, handleInputChangeReducerAccount, setEditableMode, updateAccountByIdAndGetAudits, } from "../../redux/features/accountsSlice";
import "../../styles/accounts/accountsView.css";
import { accountTypeValuesArray, accountsRelatedViewOptions, countryFlags, countryNames, industryTypeValuesArray, stateNames, } from "../../utilities/common/dataArrays";
import TextArea from "antd/es/input/TextArea";
import { DESCRIPTION_ICON_ORANGE, GENERAL_INFO_ICON_ORANGE, LOCATION_ICON_ORANGE, OWNER, } from "../../utilities/common/imagesImports";
import { LeftOutlined, RightOutlined, EditOutlined, CheckCircleOutlined, } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import { handleBack } from "../../utilities/common/commonFunctions/handleBack";
import { fetchAllAuditsByModuleId } from "../../redux/features/auditSlice";
import AuditWindow from "../audit/auditWindow";
import AllRelatedLeads from "../leads/relatedLeadsListView";
import AllRelatedOpportunities from "../opportunities/relatedOpportunitiesListView";
import AllRelatedActivities from "../activities/relatedActivitiesListView";
import AllRelatedContacts from "../contacts/relatedContactsListView";
import AllRelatedNotes from "../notes/relatedNotesListView";
import { fetchAllSalesPersonByUserId } from "../../redux/features/organizationSlice";
const OneAccountById = () => {
    const dispatch = useAppDispatch();
    const params = useParams();
    const [form] = Form.useForm();
    const { account, addAccountLoader, getAccountLoader, editable } = useAppSelector((state) => state.accounts);
    const { user } = useAppSelector((state) => state.authentication);
    const { screenWidth } = useAppSelector((state) => state.referrals);
    const [relatedView, setRelatedView] = useState("SELECT");
    const [isOtherIndutry, setIsOtherIndutry] = useState(false);
    const [ownerId, setOwnerId] = useState("");
    const [popconfirmVisible, setPopconfirmVisible] = useState(false);
    const { salesPersonData } = useAppSelector((state) => state.organisations);
    const accountId = params?.accountId;
    const OWNER_AVATAR = `${account?.owner?.firstName
        ?.slice(0, 1)
        ?.toLocaleUpperCase()}
                          ${account?.owner?.lastName
        ?.slice(0, 1)
        ?.toLocaleUpperCase()}`;
    const OWNER_NAME = `${account?.owner?.firstName}
                          ${account?.owner?.lastName}`;
    const companyToken = user?.organisation && user?.organisation?.companyToken
        ? ` ${user.organisation.companyToken}`
        : " Companies";
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        dispatch(handleInputChangeReducerAccount({
            [name]: value,
        }));
    };
    const handleSelectChange = (value, name) => {
        if (name === "industry" && value === "") {
            setIsOtherIndutry(true);
        }
        else if (name === "industry" && value !== "") {
            setIsOtherIndutry(false);
            dispatch(handleInputChangeReducerAccount({
                [name]: value,
            }));
        }
        else {
            dispatch(handleInputChangeReducerAccount({
                [name]: value,
            }));
        }
    };
    const handleSelectChangeView = (value) => {
        setRelatedView(value);
    };
    const handleSubmit = () => {
        if (editable) {
            dispatch(updateAccountByIdAndGetAudits(account));
        }
        else {
            dispatch(setEditableMode(true));
        }
    };
    const confirmChange = async () => {
        await dispatch(updateAccountByIdAndGetAudits({ ...account, owner: { userId: ownerId } }));
        await dispatch(setEditableMode(false));
        await setPopconfirmVisible(false);
    };
    const cancelChange = () => {
        setPopconfirmVisible(false);
        dispatch(getAccountById(accountId));
    };
    useEffect(() => {
        if (accountId) {
            dispatch(setEditableMode(false));
            dispatch(getAccountById(accountId));
            dispatch(fetchAllAuditsByModuleId({ moduleName: "account", moduleId: accountId }));
        }
    }, [accountId]);
    useEffect(() => {
        form.setFieldsValue(account);
    }, [account]);
    useEffect(() => {
        dispatch(fetchAllSalesPersonByUserId());
    }, []);
    return (_jsx("div", { className: "oneAccountMainWrapper", children: _jsx(Spin, { spinning: getAccountLoader, tip: "Loading...", children: _jsx("div", { className: editable ? "oneAccountViewWrapper" : "onceAccountViewWrapperNotEdit", children: _jsxs(Form, { form: form, name: "loginForm", onFinish: handleSubmit, initialValues: account, children: [_jsx("div", { className: "oneAccountTopToolbar1", children: _jsxs("div", { className: "opportunitysSelectViewWrapper", children: [_jsxs("div", { className: "opportunitysSelectView1", children: [_jsx(LeftOutlined, { className: "backArrow", onClick: handleBack }), _jsx("div", { className: "opportunitysViewTitle", children: companyToken }), _jsx(RightOutlined, {}), _jsx("div", { className: "opportunitysViewTitle", children: account?.accountName || "" })] }), _jsxs("div", { className: "opportunitysSelectView1", children: [_jsx(Select, { autoFocus: true, onChange: handleSelectChangeView, defaultValue: "Select Related Records", style: {
                                                    border: "1px solid var(--gray5)",
                                                    borderRadius: "4px",
                                                    width: "160px",
                                                }, children: accountsRelatedViewOptions?.map((option, index) => (_jsx(Select.Option, { value: option.value, children: option.label }, index))) }), _jsx(Form.Item, { className: "addAccountSubmitBtnWrapper", children: _jsx(Button, { type: "primary", htmlType: "submit", className: "accountEditBtn", loading: addAccountLoader, disabled: relatedView !== "SELECT", children: screenWidth < 768 ? (editable ? (_jsx(Tooltip, { title: "Update Company", children: _jsx(CheckCircleOutlined, {}) })) : (_jsx(Tooltip, { title: "Save Changes", children: _jsx(EditOutlined, {}) }))) : editable ? ("Save Changes") : ("Edit") }) })] })] }) }), relatedView !== "SELECT" ? (_jsx("div", { className: "updateAccountDiv", children: _jsxs("div", { className: "accountEditFormDiv", children: [_jsxs("div", { className: "updateAccountDivCol", children: [_jsxs("div", { className: "addOpportunitySubTitle", children: [_jsx("div", { className: "illustrationIconWrapper", children: _jsx("img", { src: GENERAL_INFO_ICON_ORANGE, alt: "illustration", className: "illustrationIcon" }) }), "General Information"] }), _jsxs("div", { className: "updateAccountFlex", children: [_jsx(Form.Item, { name: "accountName", label: "Name", className: "addAccountFormInput", style: { width: "230px" }, rules: [
                                                            {
                                                                required: true,
                                                                message: "This field is mandatory!",
                                                            },
                                                        ], children: _jsx(Input, { onChange: handleInputChange, name: "accountName", type: "string", placeholder: "Please enter here", readOnly: !editable }) }), _jsx(Form.Item, { name: "email", label: "Email", className: "addAccountFormInput", style: { width: "230px" }, rules: [
                                                            {
                                                                type: "email",
                                                                message: "The input is not valid E-mail!",
                                                            },
                                                            {
                                                                required: false,
                                                                message: "Please input your E-mail!",
                                                            },
                                                        ], children: _jsx(Input, { onChange: handleInputChange, name: "email", placeholder: "Please enter here", readOnly: !editable }) }), _jsx(Form.Item, { name: "website", label: "Website", className: "addAccountFormInput", style: { width: "230px" }, rules: [
                                                            {
                                                                required: false,
                                                                message: "This field is mandatory!",
                                                            },
                                                        ], children: _jsx(Input, { onChange: handleInputChange, name: "website", type: "text", placeholder: "Please enter here", readOnly: !editable }) }), _jsx(Form.Item, { name: "phone", label: "Contact No.", className: "addContactFormInput", rules: [
                                                            {
                                                                required: true,
                                                                message: "This field is mandatory!",
                                                            },
                                                            {
                                                                pattern: /^\d*$/,
                                                                message: "Please enter a valid phone number!",
                                                            },
                                                        ], children: _jsxs("div", { style: { display: "flex", gap: "5px" }, children: [_jsx(Select, { value: account?.countryCode, style: { width: "250px" }, onChange: (value) => handleSelectChange(value, "countryCode"), options: countryFlags?.map((flag) => ({
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
                                                                        .includes(input.toLowerCase()) }), _jsx(Input, { onChange: handleInputChange, name: "phone", type: "tel", placeholder: "Please enter here", readOnly: !editable, value: account?.phone })] }) })] })] }), _jsxs("div", { className: "accountInfo1", children: [_jsxs("div", { className: "opportunityInfo1CompanyNameLabel", children: [_jsx("img", { src: OWNER, alt: "illustration", className: "illustrationIcon" }), "Owner"] }), _jsxs("div", { className: "accountOwnerDiv", children: [_jsx(Avatar, { children: OWNER_AVATAR }), _jsx("p", { className: "accountInfo1CompanyName", children: OWNER_NAME })] })] })] }) })) : null, relatedView === "LEADS" ? (_jsx(_Fragment, { children: _jsx(AllRelatedLeads, { moduleId: accountId ? accountId : "", moduleName: "account" }) })) : relatedView === "OPPORTUNITIES" ? (_jsx(_Fragment, { children: _jsx(AllRelatedOpportunities, { moduleId: accountId ? accountId : "", moduleName: "account" }) })) : relatedView === "ACTIVITIES" ? (_jsx(_Fragment, { children: _jsx(AllRelatedActivities, { moduleName: "account", moduleId: account?.accountId }) })) : relatedView === "CONTACTS" ? (_jsx(_Fragment, { children: _jsx(AllRelatedContacts, { moduleName: "account", moduleId: account?.accountId }) })) : relatedView === "NOTES" ? (_jsx(_Fragment, { children: _jsx(AllRelatedNotes, { moduleName: "account", moduleId: account?.accountId }) })) : (_jsx("div", { children: _jsx("div", { className: "updateAccountDiv", children: _jsxs("div", { className: "updateAccountOwnerDiv", children: [_jsxs("div", { className: "accountEditFormDiv", children: [_jsxs("div", { className: "updateAccountDivCol", children: [_jsxs("div", { className: "addOpportunitySubTitle", children: [_jsx("div", { className: "illustrationIconWrapper", children: _jsx("img", { src: GENERAL_INFO_ICON_ORANGE, alt: "illustration", className: "illustrationIcon" }) }), "General Information"] }), _jsxs("div", { className: "updateAccountFlex", children: [_jsx(Form.Item, { name: "accountName", label: "Name", className: "addAccountFormInput", style: { width: "230px" }, rules: [
                                                                        {
                                                                            required: true,
                                                                            message: "This field is mandatory!",
                                                                        },
                                                                    ], children: _jsx(Input, { onChange: handleInputChange, name: "accountName", type: "string", placeholder: "Please enter here", readOnly: !editable }) }), _jsx(Form.Item, { name: "email", label: "Email", className: "addAccountFormInput", style: { width: "230px" }, rules: [
                                                                        {
                                                                            type: "email",
                                                                            message: "The input is not valid E-mail!",
                                                                        },
                                                                        {
                                                                            required: false,
                                                                            message: "Please input your E-mail!",
                                                                        },
                                                                    ], children: _jsx(Input, { onChange: handleInputChange, name: "email", placeholder: "Please enter here", readOnly: !editable }) }), _jsx(Form.Item, { name: "website", label: "Website", className: "addAccountFormInput", style: { width: "230px" }, rules: [
                                                                        {
                                                                            required: false,
                                                                            message: "This field is mandatory!",
                                                                        },
                                                                    ], children: _jsx(Input, { onChange: handleInputChange, name: "website", type: "text", placeholder: "Please enter here", readOnly: !editable }) }), _jsx(Form.Item, { name: "phone", label: "Contact No.", className: "addContactFormInput", rules: [
                                                                        {
                                                                            required: true,
                                                                            message: "This field is mandatory!",
                                                                        },
                                                                        {
                                                                            pattern: /^\d*$/,
                                                                            message: "Please enter a valid phone number!",
                                                                        },
                                                                    ], children: _jsxs("div", { style: { display: "flex", gap: "5px" }, children: [_jsx(Select, { value: account?.countryCode, style: { width: "150px" }, onChange: (value) => handleSelectChange(value, "countryCode"), options: countryFlags?.map((flag) => ({
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
                                                                                    .includes(input.toLowerCase()) }), _jsx(Input, { onChange: handleInputChange, name: "phone", type: "tel", placeholder: "Please enter here", readOnly: !editable, value: account?.phone })] }) })] })] }), _jsxs("div", { className: "accountInfo1", children: [_jsxs("div", { className: "opportunityInfo1CompanyNameLabel", children: [_jsx("img", { src: OWNER, alt: "illustration", className: "illustrationIcon" }), "Owner"] }), _jsxs("div", { className: "accountOwnerDiv", children: [_jsx(Avatar, { children: OWNER_AVATAR }), _jsx(Popconfirm, { title: "Are you sure you want to change the owner of this record?", open: popconfirmVisible, onConfirm: confirmChange, onCancel: cancelChange, okText: "Yes", cancelText: "No", children: _jsx(Select, { className: "dashboardSelect", placeholder: "search sales person", showSearch: true, style: { width: "200px" }, disabled: !editable, value: OWNER_NAME, onChange: (value) => {
                                                                            setOwnerId(value);
                                                                            setPopconfirmVisible(true);
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
                                                                        }) }) })] })] })] }), _jsxs("div", { className: "updateAccountDivCol", children: [_jsxs("div", { className: "addOpportunitySubTitle", children: [_jsx("div", { className: "illustrationIconWrapper", children: _jsx("img", { src: LOCATION_ICON_ORANGE, alt: "illustration", className: "illustrationIcon" }) }), "Location"] }), _jsxs("div", { className: "updateAccountFlex", children: [_jsx(Form.Item, { name: "address", label: "Address Line 1", className: "addAccountFormInput", style: { width: "230px" }, rules: [
                                                                {
                                                                    required: true,
                                                                    message: "This field is mandatory!",
                                                                },
                                                            ], children: _jsx(Input, { onChange: handleInputChange, name: "address", type: "string", placeholder: "Please enter here", readOnly: !editable }) }), _jsx(Form.Item, { name: "country", label: "Country", className: "addAccountFormInput", style: { width: "230px" }, rules: [
                                                                {
                                                                    required: true,
                                                                    message: "This field is mandatory!",
                                                                },
                                                            ], children: _jsx(Select, { onChange: (value) => handleSelectChange(value, "country"), options: countryNames, disabled: !editable, showSearch: true }) }), account?.country === "India" ? (_jsx(Form.Item, { name: "state", label: "State", className: "addAccountFormInput", style: { width: "230px" }, rules: [
                                                                {
                                                                    required: true,
                                                                    message: "This field is mandatory!",
                                                                },
                                                            ], children: _jsx(Select, { onChange: (value) => handleSelectChange(value, "state"), options: stateNames, disabled: !editable, showSearch: true }) })) : (_jsx(Form.Item, { name: "state", label: "State", className: "addAccountFormInput", style: { width: "230px" }, rules: [
                                                                {
                                                                    required: true,
                                                                    message: "This field is mandatory!",
                                                                },
                                                            ], children: _jsx(Input, { onChange: handleInputChange, name: "state", type: "string", placeholder: "Please enter here", readOnly: !editable }) })), _jsx(Form.Item, { name: "city", label: "City", style: { width: "230px" }, className: "addAccountFormInput", rules: [
                                                                {
                                                                    required: true,
                                                                    message: "This field is mandatory!",
                                                                },
                                                            ], children: _jsx(Input, { onChange: handleInputChange, name: "city", type: "string", placeholder: "Please enter here", readOnly: !editable }) })] })] }), _jsxs("div", { className: "updateAccountDivCol", children: [_jsxs("div", { className: "addOpportunitySubTitle", children: [_jsx("div", { className: "illustrationIconWrapper", children: _jsx("img", { src: DESCRIPTION_ICON_ORANGE, alt: "illustration", className: "illustrationIcon" }) }), "Description"] }), _jsxs("div", { className: "updateAccountFlex", children: [_jsx(Form.Item, { name: "industry", label: "Industry", className: "addAccountFormInput", style: { width: "230px" }, rules: [
                                                                {
                                                                    required: false,
                                                                    message: "This field is mandatory!",
                                                                },
                                                            ], children: isOtherIndutry ? (_jsx(Input, { onChange: handleInputChange, name: "industry", placeholder: "Enter industry type here" })) : (_jsx(Select, { onChange: (value) => handleSelectChange(value, "industry"), options: industryTypeValuesArray, disabled: !editable })) }), _jsx(Form.Item, { name: "status", label: "Status", className: "addAccountFormInput", style: { width: "230px" }, rules: [
                                                                {
                                                                    required: false,
                                                                    message: "This field is mandatory!",
                                                                },
                                                            ], children: _jsx(Select, { onChange: (value) => handleSelectChange(value, "status"), options: accountTypeValuesArray, disabled: !editable }) }), _jsx(Form.Item, { name: "description", label: "Description", className: "addAccountFormInput", rules: [
                                                                {
                                                                    required: false,
                                                                    message: "This field is mandatory!",
                                                                },
                                                            ], children: _jsx(TextArea, { style: {
                                                                    width: "600px",
                                                                }, onChange: handleInputChange, name: "description", 
                                                                // placeholder="Please enter here"
                                                                readOnly: !editable, maxLength: 499 }) })] })] }), _jsx(AuditWindow, {})] }) }) }))] }) }) }) }));
};
export default OneAccountById;
