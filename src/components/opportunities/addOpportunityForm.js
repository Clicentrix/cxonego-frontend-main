import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Button, DatePicker, Form, Input, Modal, Select } from "antd";
import { useAppDispatch, useAppSelector } from "../../redux/app/hooks";
import { handleInputChangeReducerOpportunity } from "../../redux/features/opportunitiesSlice";
import { currencyOptions, forecastCategoryOptions, priorityOptions, probabilityOptions, purchaseProcessOptions, purchaseTimeFrameOptions, stagesOptions, statusOptions, } from "../../utilities/common/dataArrays";
import TextArea from "antd/es/input/TextArea";
import { createAndGetAllAccountsWithoutParams, fetchAllAccountsWithoutParams, resetIsModalOpenAccount, } from "../../redux/features/accountsSlice";
import AddAccountForm from "../accounts/addAccountForm";
import { createAndGetAllContactsWithoutParams, fetchAllContactsWithoutParams, resetIsModalOpenContact, } from "../../redux/features/contactsSlice";
import AddContactForm from "../contacts/addContactForm";
import { useEffect } from "react";
function AddOpportunityForm() {
    const dispatch = useAppDispatch();
    const [formAccount] = Form.useForm();
    const [formContact] = Form.useForm();
    const { accounts, isModalOpenAccount, account, addAccountLoader, accountForLookup, } = useAppSelector((state) => state.accounts);
    const { contacts, isModalOpenContact, contact, addContactLoader, contactForLookup, } = useAppSelector((state) => state.contacts);
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        dispatch(handleInputChangeReducerOpportunity({
            [name]: value,
        }));
    };
    const handleSelectChange = (value, name) => {
        if (value === "LOOKUP" && name === "company") {
            dispatch(resetIsModalOpenAccount(true));
        }
        else if (value === "LOOKUP" && name === "contact") {
            dispatch(resetIsModalOpenContact(true));
        }
        else {
            dispatch(handleInputChangeReducerOpportunity({
                [name]: value,
            }));
        }
    }; // FOR LOOKUP
    const handleOpenModalForLookupForAccount = () => {
        dispatch(resetIsModalOpenAccount(true));
    };
    const handleOpenModalForLookupForContact = () => {
        dispatch(resetIsModalOpenContact(true));
    };
    const handleSubmitAccount = async () => {
        await dispatch(createAndGetAllAccountsWithoutParams(account));
        formAccount.resetFields();
        await dispatch(resetIsModalOpenAccount(false));
    };
    const handleCancelAccount = () => {
        dispatch(resetIsModalOpenAccount(false));
        formAccount.resetFields();
    };
    const handleSubmitContact = async () => {
        await dispatch(createAndGetAllContactsWithoutParams(contact));
        formContact.resetFields();
        await dispatch(resetIsModalOpenContact(false));
    };
    const handleCancelContact = () => {
        dispatch(resetIsModalOpenContact(false));
        formContact.resetFields();
    };
    useEffect(() => {
        dispatch(fetchAllAccountsWithoutParams());
        dispatch(fetchAllContactsWithoutParams());
    }, []);
    return (_jsxs("div", { children: [_jsx(Modal, { open: isModalOpenContact, onOk: handleSubmitContact, onCancel: handleCancelContact, footer: false, children: _jsxs("div", { className: "addContactFormDiv", children: [_jsx("div", { className: "addContactTitle", children: "New Contact" }), _jsx("div", { className: "addContactFormWrapper", children: _jsxs(Form, { form: formContact, name: "loginForm", onFinish: handleSubmitContact, children: [_jsx(AddContactForm, {}), _jsxs(Form.Item, { className: "addContactSubmitBtnWrapper", children: [_jsx(Button, { onClick: handleCancelContact, className: "addContactCancelBtn", children: "Cancel" }), _jsx(Button, { type: "primary", htmlType: "submit", className: "addContactSubmitBtn", loading: addContactLoader, children: "Save" })] })] }) })] }) }), _jsx(Modal, { open: isModalOpenAccount, onOk: handleSubmitAccount, onCancel: handleCancelAccount, footer: false, children: _jsxs("div", { className: "addAccountFormDiv", children: [_jsx("div", { className: "addAccountTitle", children: "New Company" }), _jsx("div", { className: "addOpportunityFormWrapper", children: _jsxs(Form, { form: formAccount, name: "loginForm", onFinish: handleSubmitAccount, initialValues: account, children: [_jsx(AddAccountForm, {}), _jsxs(Form.Item, { className: "addOpportunitySubmitBtnWrapper", children: [_jsx(Button, { onClick: handleCancelAccount, className: "addOpportunityCancelBtn", children: "Cancel" }), _jsx(Button, { type: "primary", htmlType: "submit", className: "addOpportunitySubmitBtn", loading: addAccountLoader, children: "Save" })] })] }) })] }) }), _jsx(Modal, { open: isModalOpenAccount, onOk: handleSubmitAccount, onCancel: handleCancelAccount, footer: false, children: _jsxs("div", { className: "addAccountFormDiv", children: [_jsx("div", { className: "addAccountTitle", children: "New Company" }), _jsx("div", { className: "addOpportunityFormWrapper", children: _jsxs(Form, { form: formAccount, name: "loginForm", onFinish: handleSubmitAccount, initialValues: account, children: [_jsx(AddAccountForm, {}), _jsxs(Form.Item, { className: "addOpportunitySubmitBtnWrapper", children: [_jsx(Button, { onClick: handleCancelAccount, className: "addOpportunityCancelBtn", children: "Cancel" }), _jsx(Button, { type: "primary", htmlType: "submit", className: "addOpportunitySubmitBtn", loading: addAccountLoader, children: "Save" })] })] }) })] }) }), _jsx("div", { className: "addOpportunitySubTitle", children: "General Information" }), _jsx(Form.Item, { name: "title", label: "Title", className: "addOpportunityFormInput", rules: [
                    {
                        required: true,
                        message: "This field is mandatory!",
                    },
                ], children: _jsx(Input, { onChange: handleInputChange, name: "title", type: "string", placeholder: "Please enter here" }) }), _jsxs("div", { className: "oppoAddFormGrid", children: [_jsx(Form.Item, { name: "company", label: "Company", className: "addOpportunityFormInput", rules: [
                            {
                                required: false,
                                message: "This field is mandatory!",
                            },
                        ], children: _jsxs(Select, { onChange: (value) => handleSelectChange(value, "company"), placeholder: "select company", style: { width: "100%" }, showSearch: true, value: accountForLookup ? accountForLookup?.accountId : undefined, children: [accounts?.map((item, index) => {
                                    return (_jsx(_Fragment, { children: _jsx(Select.Option, { value: item?.accountId, children: item.accountName }, index) }));
                                }), _jsx(Select.Option, { value: "LOOKUP", children: _jsxs("div", { onClick: () => handleOpenModalForLookupForAccount(), children: [_jsx("span", { className: "hyperlinkBlue", children: "Click here" }), " to add new account"] }) }, 0)] }) }), _jsx(Form.Item, { name: "contact", label: "Contact", className: "addOpportunityFormInput", rules: [
                            {
                                required: false,
                                message: "This field is mandatory!",
                            },
                        ], children: _jsxs(Select, { onChange: (value) => handleSelectChange(value, "contact"), placeholder: "select contact", style: { width: "100%" }, showSearch: true, value: contactForLookup ? contactForLookup?.contactId : undefined, children: [contacts?.map((item, index) => {
                                    return (_jsx(_Fragment, { children: _jsxs(Select.Option, { value: item?.contactId, children: [item.firstName, " ", item?.lastName] }, index) }));
                                }), _jsx(Select.Option, { value: "LOOKUP", children: _jsxs("div", { onClick: () => handleOpenModalForLookupForContact(), children: [_jsx("span", { className: "hyperlinkBlue", children: "Click here" }), " to add new contact"] }) }, 0)] }) })] }), _jsx("div", { className: "addOpportunitySubTitle", children: "Opportunity Details" }), _jsxs("div", { className: "oppoAddFormGrid", children: [_jsx(Form.Item, { name: "purchaseProcess", label: "Purchase Process", className: "addOpportunityFormInput", rules: [
                            {
                                required: false,
                                message: "This field is mandatory!",
                            },
                        ], children: _jsx(Select, { onChange: (value) => handleSelectChange(value, "purchaseProcess"), options: purchaseProcessOptions, defaultValue: "Committee" }) }), _jsx(Form.Item, { name: "forecastCategory", label: "Forecast Category", className: "addOpportunityFormInput", rules: [
                            {
                                required: false,
                                message: "This field is mandatory!",
                            },
                        ], children: _jsx(Select, { onChange: (value) => handleSelectChange(value, "forecastCategory"), options: forecastCategoryOptions, defaultValue: "Pipeline" }) })] }), _jsx("div", { className: "oppoAddFormGrid" }), _jsxs("div", { className: "oppoAddFormGrid", children: [_jsx(Form.Item, { name: "probability", label: "Probability", className: "addOpportunityFormInput", rules: [
                            {
                                required: false,
                                message: "This field is mandatory!",
                            },
                        ], children: _jsx(Select, { onChange: (value) => handleSelectChange(value, "probability"), options: probabilityOptions, defaultValue: "50" }) }), _jsx(Form.Item, { name: "priority", label: "Priority", className: "addOpportunityFormInput", rules: [
                            {
                                required: false,
                                message: "This field is mandatory!",
                            },
                        ], children: _jsx(Select, { onChange: (value) => handleSelectChange(value, "priority"), options: priorityOptions, defaultValue: "Medium" }) })] }), _jsxs("div", { className: "oppoAddFormGrid", children: [_jsx(Form.Item, { name: "stage", label: "Stage", className: "addOpportunityFormInput", rules: [
                            {
                                required: false,
                                message: "This field is mandatory!",
                            },
                        ], children: _jsx(Select, { onChange: (value) => handleSelectChange(value, "stage"), options: stagesOptions, defaultValue: "Analysis" }) }), _jsx(Form.Item, { name: "status", label: "Status", className: "addOpportunityFormInput", rules: [
                            {
                                required: false,
                                message: "This field is mandatory!",
                            },
                        ], children: _jsx(Select, { onChange: (value) => handleSelectChange(value, "status"), options: statusOptions, defaultValue: "Active" }) })] }), _jsx("div", { className: "oppoAddFormGrid" }), _jsxs("div", { className: "oppoAddFormGrid", children: [_jsx(Form.Item, { name: "currency", label: "Currency", className: "addOpportunityFormInput", rules: [
                            {
                                required: false,
                                message: "This field is mandatory!",
                            },
                        ], children: _jsx(Select, { onChange: (value) => handleSelectChange(value, "currency"), options: currencyOptions, defaultValue: "INR" }) }), _jsx(Form.Item, { name: "estimatedRevenue", label: "Est. Revenue", className: "addOpportunityFormInput", rules: [
                            {
                                required: true,
                                message: "This field is mandatory!",
                            },
                        ], children: _jsx(Input, { onChange: handleInputChange, name: "estimatedRevenue", type: "number", placeholder: "Please enter here" }) }), _jsx(Form.Item, { name: "purchaseTimeFrame", label: "Purchase Time Frame", className: "addOpportunityFormInput", rules: [
                            {
                                required: true,
                                message: "This field is mandatory!",
                            },
                        ], children: _jsx(Select, { onChange: (value) => handleSelectChange(value, "purchaseTimeFrame"), options: purchaseTimeFrameOptions }) }), _jsx(Form.Item, { name: "estimatedCloseDate", label: "Est. Close Date", className: "addOpportunityFormInput", rules: [
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
                                            estimatedCloseDate: dateObject.toISOString(),
                                        }));
                                    }
                                    else {
                                        console.error("Invalid date string:", dateString);
                                    }
                                }
                            } }) })] }), _jsx("div", { className: "oppoAddFormGrid" }), _jsx(Form.Item, { name: "description", label: "Description", className: "addOpportunityFormInput", rules: [
                    {
                        required: false,
                        message: "This field is mandatory!",
                    },
                ], children: _jsx(TextArea, { onChange: handleInputChange, name: "description", placeholder: "Please enter here", maxLength: 499 }) }), _jsx(Form.Item, { name: "currentNeed", label: "Current Need", className: "addOpportunityFormInput", rules: [
                    {
                        required: false,
                        message: "This field is mandatory!",
                    },
                ], children: _jsx(TextArea, { onChange: handleInputChange, name: "currentNeed", placeholder: "Please enter here", maxLength: 499 }) }), _jsx(Form.Item, { name: "proposedSolution", label: "Proposed Solution", className: "addOpportunityFormInput", rules: [
                    {
                        required: false,
                        message: "This field is mandatory!",
                    },
                ], children: _jsx(TextArea, { onChange: handleInputChange, name: "proposedSolution", placeholder: "Please enter here", maxLength: 499 }) })] }));
}
export default AddOpportunityForm;
