import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Button, Form, Input, Modal, Select } from "antd";
import { useAppDispatch, useAppSelector } from "../../redux/app/hooks";
import { handleInputChangeReducerLead } from "../../redux/features/leadSlice";
import { countryFlags, countryNames, currencyOptions, leadSourceOptions, ratingValuesArray, stateNames, statusValuesArray, } from "../../utilities/common/dataArrays";
import { useEffect } from "react";
import { createAndGetAllAccountsWithoutParams, fetchAllAccountsWithoutParams, resetIsModalOpenAccount, } from "../../redux/features/accountsSlice";
import { createAndGetAllContactsWithoutParams, fetchAllContactsWithoutParams, resetIsModalOpenContact, } from "../../redux/features/contactsSlice";
import AddAccountForm from "../accounts/addAccountForm";
import AddContactForm from "../contacts/addContactForm";
// import PhoneInput from "react-phone-number-input";
// import E164Number from "react-phone-number-input";
// import { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css"; // Import the default style
const AddLeadForm = () => {
    const dispatch = useAppDispatch();
    const { contacts, isModalOpenContact, contact, addContactLoader, contactForLookup, } = useAppSelector((state) => state.contacts);
    const { lead } = useAppSelector((state) => state.leads);
    const [formAccount] = Form.useForm();
    const [formContact] = Form.useForm();
    const { accounts, isModalOpenAccount, account, addAccountLoader, accountForLookup, } = useAppSelector((state) => state.accounts);
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        dispatch(handleInputChangeReducerLead({
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
            dispatch(handleInputChangeReducerLead({
                [name]: value,
            }));
        }
    };
    const handleOpenModalForLookupForAccount = () => {
        dispatch(resetIsModalOpenAccount(true));
    };
    const handleOpenModalForLookupForContact = () => {
        dispatch(resetIsModalOpenContact(true));
    };
    // FOR LOOKUP
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
    // const handlePhoneNumberChange = (value: E164Number | undefined) => {
    //   setPhoneNumber(value);
    // };
    // const onChange = (key: string | string[]) => {
    //   console.log(key);
    // };
    useEffect(() => {
        dispatch(fetchAllAccountsWithoutParams());
        dispatch(fetchAllContactsWithoutParams());
    }, []);
    return (_jsxs(_Fragment, { children: [_jsx(Modal, { open: isModalOpenContact, onOk: handleSubmitContact, onCancel: handleCancelContact, footer: false, children: _jsxs("div", { className: "addContactFormDiv", children: [_jsx("div", { className: "addContactTitle", children: "New Contact" }), _jsx("div", { className: "addContactFormWrapper", children: _jsxs(Form, { form: formContact, name: "loginForm", onFinish: handleSubmitContact, children: [_jsx(AddContactForm, {}), _jsxs(Form.Item, { className: "addContactSubmitBtnWrapper", children: [_jsx(Button, { onClick: handleCancelContact, className: "addContactCancelBtn", children: "Cancel" }), _jsx(Button, { type: "primary", htmlType: "submit", className: "addContactSubmitBtn", loading: addContactLoader, children: "Save" })] })] }) })] }) }), _jsx(Modal, { open: isModalOpenAccount, onOk: handleSubmitAccount, onCancel: handleCancelAccount, footer: false, children: _jsxs("div", { className: "addAccountFormDiv", children: [_jsx("div", { className: "addAccountTitle", children: "New Company" }), _jsx("div", { className: "addOpportunityFormWrapper", children: _jsxs(Form, { form: formAccount, name: "loginForm", onFinish: handleSubmitAccount, initialValues: account, children: [_jsx(AddAccountForm, {}), _jsxs(Form.Item, { className: "addOpportunitySubmitBtnWrapper", children: [_jsx(Button, { onClick: handleCancelAccount, className: "addOpportunityCancelBtn", children: "Cancel" }), _jsx(Button, { type: "primary", htmlType: "submit", className: "addOpportunitySubmitBtn", loading: addAccountLoader, children: "Save" })] })] }) })] }) }), _jsxs("div", { className: "addLeadFormDiv", children: [_jsx("div", { className: "addLeadTitle", children: "Add Lead" }), _jsxs("div", { className: "addLeadFormWrapper", children: [_jsx("div", { className: "addOpportunitySubTitle", children: "General Information" }), _jsxs("div", { className: "addLeadDiv", children: [_jsxs("div", { className: "addLeadDivCol", children: [_jsx(Form.Item, { name: "firstName", label: "First Name", className: "addLeadFormInput", rules: [
                                                    {
                                                        required: true,
                                                        message: "This field is mandatory!",
                                                    },
                                                ], children: _jsx(Input, { onChange: handleInputChange, name: "firstName", type: "string", placeholder: "Please enter here" }) }), _jsx(Form.Item, { name: "lastName", label: "Last Name", className: "addLeadFormInput", rules: [
                                                    {
                                                        required: true,
                                                        message: "This field is mandatory!",
                                                    },
                                                ], children: _jsx(Input
                                                // onChange={}
                                                , { 
                                                    // onChange={}
                                                    onChange: handleInputChange, name: "lastName", type: "string", placeholder: "Please enter here" }) })] }), _jsxs("div", { className: "addLeadDivCol", children: [_jsx(Form.Item, { name: "title", label: "Lead Title", className: "addLeadFormInput", rules: [
                                                    {
                                                        required: true,
                                                        message: "This field is mandatory!",
                                                    },
                                                ], children: _jsx(Input
                                                // onChange={}
                                                , { 
                                                    // onChange={}
                                                    onChange: handleInputChange, name: "title", type: "string", placeholder: "Please enter here" }) }), _jsx(Form.Item, { name: "description", label: "Description", className: "addLeadFormInput", rules: [
                                                    {
                                                        required: false,
                                                        message: "This field is mandatory!",
                                                    },
                                                ], children: _jsx(Input, { onChange: handleInputChange, name: "description", type: "string", placeholder: "Please enter here", maxLength: 499 }) })] }), _jsx("div", { className: "addLeadDivCol", children: _jsx(Form.Item, { name: "company", label: "Company", className: "addOpportunityFormInput", rules: [
                                                {
                                                    required: false,
                                                    message: "This field is mandatory!",
                                                },
                                            ], children: _jsxs(Select, { onChange: (value) => handleSelectChange(value, "company"), placeholder: "select company", style: { width: "100%" }, showSearch: true, value: accountForLookup ? accountForLookup?.accountId : null, children: [accounts?.map((item, index) => {
                                                        return (_jsx(_Fragment, { children: _jsx(Select.Option, { value: item?.accountId, children: item.accountName }, index) }));
                                                    }), _jsx(Select.Option, { value: "LOOKUP", children: _jsxs("div", { onClick: () => handleOpenModalForLookupForAccount(), children: [_jsx("span", { className: "hyperlinkBlue", children: "Click here" }), " to add new account"] }) }, 0)] }) }) }), _jsx("div", { className: "addLeadDivCol", children: _jsx(Form.Item, { name: "contact", label: "Contact", className: "addOpportunityFormInput", rules: [
                                                {
                                                    required: false,
                                                    message: "This field is mandatory!",
                                                },
                                            ], children: _jsxs(Select, { onChange: (value) => handleSelectChange(value, "contact"), placeholder: "select contact", style: { width: "100%" }, showSearch: true, value: contactForLookup ? contactForLookup?.contactId : null, children: [contacts?.map((item, index) => {
                                                        return (_jsx(_Fragment, { children: _jsxs(Select.Option, { value: item?.contactId, children: [item.firstName, " ", item?.lastName] }, index) }));
                                                    }), _jsx(Select.Option, { value: "LOOKUP", children: _jsxs("div", { onClick: () => handleOpenModalForLookupForContact(), children: [_jsx("span", { className: "hyperlinkBlue", children: "Click here" }), " to add new contact"] }) }, 0)] }) }) })] }), _jsx("div", { className: "addOpportunitySubTitle", children: "Location" }), _jsxs("div", { className: "addLeadDiv", children: [_jsxs("div", { className: "addLeadDivCol", children: [_jsx(Form.Item, { name: "country", label: "Country", className: "addContactFormInput", rules: [
                                                    {
                                                        required: true,
                                                        message: "This field is mandatory!",
                                                    },
                                                ], children: _jsx(Select, { onChange: (value) => handleSelectChange(value, "country"), options: countryNames, showSearch: true }) }), lead?.country === "India" ? (_jsx(Form.Item, { name: "state", label: "State", className: "addContactFormInput", rules: [
                                                    {
                                                        required: true,
                                                        message: "This field is mandatory!",
                                                    },
                                                ], children: _jsx(Select, { onChange: (value) => handleSelectChange(value, "state"), options: stateNames, showSearch: true }) })) : (_jsx(Form.Item, { name: "state", label: "State", className: "addContactFormInput", rules: [
                                                    {
                                                        required: true,
                                                        message: "This field is mandatory!",
                                                    },
                                                ], children: _jsx(Input, { onChange: handleInputChange, name: "state", type: "string", placeholder: "Please enter here" }) }))] }), _jsx("div", { className: "addLeadDivCol", children: _jsx(Form.Item, { name: "city", label: "City", className: "addContactFormInput", rules: [
                                                {
                                                    required: true,
                                                    message: "This field is mandatory!",
                                                },
                                            ], children: _jsx(Input, { onChange: handleInputChange, name: "city", type: "string", placeholder: "Please enter here" }) }) })] }), _jsx("div", { className: "addOpportunitySubTitle", children: "Communication" }), " ", _jsxs("div", { className: "addLeadDiv", children: [_jsx("div", { className: "addLeadDivCol", children: _jsx(Form.Item, { name: "phone", label: "Contact No.", className: "addLeadFormInput", rules: [
                                                {
                                                    required: true,
                                                    message: "This field is mandatory!",
                                                },
                                                {
                                                    pattern: /^\d*$/,
                                                    message: "Please enter a valid phone number!",
                                                },
                                            ], children: _jsxs("div", { style: { display: "flex", gap: "5px" }, children: [_jsx(Select, { style: { width: "250px" }, onChange: (value) => handleSelectChange(value, "countryCode"), options: countryFlags?.map((flag) => ({
                                                            value: flag.key,
                                                            label: (_jsxs("div", { style: {
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                }, children: [_jsx("img", { src: flag.value, alt: "flagIcon", style: {
                                                                            width: "20px",
                                                                            height: "15px",
                                                                            marginRight: "10px",
                                                                        } }), flag.label, " (", flag.key, ")"] })),
                                                        })), showSearch: true, placeholder: "Select a country", filterOption: (input, option) => option?.label.props.children[1]
                                                            .toLowerCase()
                                                            .includes(input.toLowerCase()) }), _jsx(Input, { onChange: handleInputChange, name: "phone", type: "tel", placeholder: "Please enter here" })] }) }) }), _jsxs("div", { className: "addLeadDivCol", children: [" ", _jsx(Form.Item, { name: "email", label: "Email", className: "addLeadFormInput", rules: [
                                                    {
                                                        type: "email",
                                                        message: "The input is not valid E-mail!",
                                                    },
                                                    {
                                                        required: true,
                                                        message: "Please input your E-mail!",
                                                    },
                                                ], children: _jsx(Input, { onChange: handleInputChange, name: "email", 
                                                    // type="text"
                                                    placeholder: "Please enter here" }) })] })] }), _jsx("div", { className: "addOpportunitySubTitle", children: "Lead Details" }), _jsxs("div", { className: "addLeadDiv", children: [_jsxs("div", { className: "addLeadDivCol", children: [_jsx(Form.Item, { name: "leadSource", label: "Lead Source", className: "addLeadFormInput", rules: [
                                                    {
                                                        required: false,
                                                        message: "This field is mandatory!",
                                                    },
                                                ], children: _jsx(Select, { onChange: (value) => handleSelectChange(value, "leadSource"), options: leadSourceOptions, defaultValue: "Referrals" }) }), _jsx(Form.Item, { name: "currency", label: "Currency", className: "addLeadFormInput", rules: [
                                                    {
                                                        required: false,
                                                        message: "This field is mandatory!",
                                                    },
                                                ], children: _jsx(Select, { onChange: (value) => handleSelectChange(value, "currency"), options: currencyOptions, defaultValue: "INR" }) }), _jsx(Form.Item, { name: "price", label: "Est. Revenue", className: "addLeadFormInput", rules: [
                                                    {
                                                        required: false,
                                                        message: "This field is mandatory!",
                                                    },
                                                ], children: _jsx(Input, { onChange: handleInputChange, name: "price", type: "number", placeholder: "Please enter here" }) })] }), _jsxs("div", { className: "addLeadDivCol", children: [_jsx(Form.Item, { name: "rating", label: "Rating", className: "addLeadFormInput", rules: [
                                                    {
                                                        required: false,
                                                        message: "This field is mandatory!",
                                                    },
                                                ], children: _jsx(Select, { onChange: (value) => handleSelectChange(value, "rating"), options: ratingValuesArray, defaultValue: "Cold" }) }), _jsx(Form.Item, { name: "status", label: "Status", className: "addLeadFormInput", rules: [
                                                    {
                                                        required: false,
                                                        message: "This field is mandatory!",
                                                    },
                                                ], children: _jsx(Select, { onChange: (value) => handleSelectChange(value, "status"), options: statusValuesArray, defaultValue: "New" }) })] })] })] })] })] }));
};
export default AddLeadForm;
