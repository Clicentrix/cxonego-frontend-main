import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Button, Form, Input, Modal, Select } from "antd";
import { handleInputChangeReducerContact } from "../../redux/features/contactsSlice";
import { useAppDispatch, useAppSelector } from "../../redux/app/hooks";
import { useEffect, useState } from "react";
import { createAndGetAllAccountsWithoutParams, fetchAllAccountsWithoutParams, resetIsModalOpenAccount, } from "../../redux/features/accountsSlice";
import { accountTypeValuesArray, contactTypesOptions, countryFlags, countryNames, industryTypeValuesArray, stateNames, yesOrNo, } from "../../utilities/common/dataArrays";
import AddAccountForm from "../accounts/addAccountForm";
const AddContactForm = () => {
    const dispatch = useAppDispatch();
    const [form] = Form.useForm();
    const { contact } = useAppSelector((state) => state?.contacts);
    const { accounts, isModalOpenAccount, account, addAccountLoader, accountForLookup, } = useAppSelector((state) => state.accounts);
    const [isOtherIndutry, setIsOtherIndutry] = useState(false);
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
        else if (value === "LOOKUP") {
            dispatch(resetIsModalOpenAccount(true));
        }
        else {
            dispatch(handleInputChangeReducerContact({
                [name]: value,
            }));
        }
    };
    const handleOpenModalForLookup = () => {
        dispatch(resetIsModalOpenAccount(true));
    };
    // FOR LOOKUP
    const handleSubmit = async () => {
        await dispatch(createAndGetAllAccountsWithoutParams(account));
        form.resetFields();
        await dispatch(resetIsModalOpenAccount(false));
    };
    const handleCancel = async () => {
        await dispatch(resetIsModalOpenAccount(false));
        await dispatch(handleInputChangeReducerContact({
            company: null,
        }));
        form.resetFields();
    };
    // const onChange = (key: string | string[]) => {
    //   console.log(key);
    // };
    useEffect(() => {
        dispatch(fetchAllAccountsWithoutParams());
    }, []);
    return (_jsxs(_Fragment, { children: [_jsx(Modal, { open: isModalOpenAccount, onOk: handleSubmit, onCancel: handleCancel, footer: false, children: _jsxs("div", { className: "addAccountFormDiv", children: [_jsx("div", { className: "addAccountTitle", children: "New Company" }), _jsx("div", { className: "addOpportunityFormWrapper", children: _jsxs(Form, { form: form, name: "loginForm", onFinish: handleSubmit, initialValues: account, children: [_jsx(AddAccountForm, {}), _jsxs(Form.Item, { className: "addOpportunitySubmitBtnWrapper", children: [_jsx(Button, { onClick: handleCancel, className: "addOpportunityCancelBtn", children: "Cancel" }), _jsx(Button, { type: "primary", htmlType: "submit", className: "addOpportunitySubmitBtn", loading: addAccountLoader, children: "Save" })] })] }) })] }) }), _jsxs(_Fragment, { children: [" ", _jsx("div", { className: "addOpportunitySubTitle", children: "Contact Information" }), _jsxs("div", { className: "addContactDiv", children: [_jsxs("div", { className: "addContactDivCol", children: [_jsx(Form.Item, { name: "firstName", label: "First Name", className: "addContactFormInput", rules: [
                                            {
                                                required: true,
                                                message: "This field is mandatory!",
                                            },
                                        ], children: _jsx(Input, { onChange: handleInputChange, name: "firstName", type: "text", placeholder: "Please enter here" }) }), _jsx(Form.Item, { name: "lastName", label: "Last Name", className: "addContactFormInput", rules: [
                                            {
                                                required: true,
                                                message: "This field is mandatory!",
                                            },
                                        ], children: _jsx(Input, { onChange: handleInputChange, name: "lastName", type: "text", placeholder: "Please enter here" }) }), _jsx(Form.Item, { name: "designation", label: "Designation", className: "addContactFormInput", rules: [
                                            {
                                                required: false,
                                                message: "This field is mandatory!",
                                            },
                                        ], children: _jsx(Input, { onChange: handleInputChange, name: "designation", type: "text", placeholder: "Please enter here" }) }), _jsx(Form.Item, { name: "description", label: "Description", className: "addContactFormInput", rules: [
                                            {
                                                required: false,
                                                message: "This field is mandatory!",
                                            },
                                        ], children: _jsx(Input, { onChange: handleInputChange, name: "description", type: "string", placeholder: "Please enter here", maxLength: 499 }) })] }), _jsxs("div", { className: "addContactDivCol", children: [_jsx(Form.Item, { name: "email", label: "Email", className: "addContactFormInput", rules: [
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
                                        ], children: _jsxs("div", { style: { display: "flex", gap: "5px" }, children: [_jsx(Select, { style: { width: "250px" }, onChange: (value) => handleSelectChange(value, "countryCode"), options: countryFlags.map((flag) => ({
                                                        value: flag.key,
                                                        label: (_jsxs("div", { style: { display: "flex", alignItems: "center" }, children: [_jsx("img", { src: flag.value, alt: "flagIcon", style: {
                                                                        width: "20px",
                                                                        height: "15px",
                                                                        marginRight: "10px",
                                                                    } }), flag.label, " (", flag.key, ")"] })),
                                                    })), showSearch: true, placeholder: "Select a country", filterOption: (input, option) => option?.label.props.children[1]
                                                        .toLowerCase()
                                                        .includes(input.toLowerCase()) }), _jsx(Input, { onChange: handleInputChange, name: "phone", type: "tel", placeholder: "Please enter here" })] }) }), _jsx(Form.Item, { name: "company", label: "Company", className: "loginFormInput", rules: [
                                            {
                                                required: false,
                                                message: "This field is mandatory!",
                                            },
                                        ], children: _jsxs(Select, { onChange: (value) => handleSelectChange(value, "company"), placeholder: "select company", style: { width: "100%" }, showSearch: true, value: accountForLookup ? accountForLookup?.accountId : undefined, children: [accounts?.map((item, index) => {
                                                    return (_jsx(_Fragment, { children: _jsx(Select.Option, { value: item?.accountId, children: item.accountName }, index) }));
                                                }), _jsx(Select.Option, { value: "LOOKUP", children: _jsxs("div", { onClick: () => handleOpenModalForLookup(), children: [_jsx("span", { className: "hyperlinkBlue", children: "Click here" }), " to add new account"] }) }, 0)] }) })] })] }), _jsx("div", { className: "addOpportunitySubTitle", children: "Location" }), " ", _jsxs("div", { className: "addContactDivCol", children: [_jsxs("div", { className: "addContactDiv", children: [_jsx(Form.Item, { name: "addressLine", label: "Address Line 1", className: "addContactFormInput", rules: [
                                            {
                                                required: true,
                                                message: "This field is mandatory!",
                                            },
                                        ], children: _jsx(Input, { onChange: handleInputChange, name: "addressLine", type: "text", placeholder: "Please enter here" }) }), _jsx(Form.Item, { name: "area", label: "Area", className: "addContactFormInput", rules: [
                                            {
                                                required: true,
                                                message: "This field is mandatory!",
                                            },
                                        ], children: _jsx(Input, { onChange: handleInputChange, name: "area", type: "text", placeholder: "Please enter here" }) })] }), _jsxs("div", { className: "addContactDiv", children: [_jsx(Form.Item, { name: "country", label: "Country", className: "addContactFormInput", rules: [
                                            {
                                                required: true,
                                                message: "This field is mandatory!",
                                            },
                                        ], children: _jsx(Select, { onChange: (value) => handleSelectChange(value, "country"), options: countryNames, showSearch: true }) }), contact?.country === "India" ? (_jsx(Form.Item, { name: "state", label: "State", className: "addContactFormInput", rules: [
                                            {
                                                required: true,
                                                message: "This field is mandatory!",
                                            },
                                        ], children: _jsx(Select, { onChange: (value) => handleSelectChange(value, "state"), options: stateNames, showSearch: true }) })) : (_jsx(Form.Item, { name: "state", label: "State", className: "addContactFormInput", rules: [
                                            {
                                                required: true,
                                                message: "This field is mandatory!",
                                            },
                                        ], children: _jsx(Input, { onChange: handleInputChange, name: "state", type: "string", placeholder: "Please enter here" }) }))] }), _jsx("div", { className: "addContactDiv", children: _jsx(Form.Item, { name: "city", label: "City", className: "addContactFormInput", rules: [
                                        {
                                            required: true,
                                            message: "This field is mandatory!",
                                        },
                                    ], children: _jsx(Input, { onChange: handleInputChange, name: "city", type: "string", placeholder: "Please enter here" }) }) })] }), _jsx("div", { className: "addOpportunitySubTitle", children: "Communication" }), _jsxs("div", { className: "addContactDivCol", children: [_jsxs("div", { className: "addContactDiv", children: [_jsx(Form.Item, { name: "status", label: "Status", className: "addContactFormInput", rules: [
                                            {
                                                required: false,
                                                message: "This field is mandatory!",
                                            },
                                        ], children: _jsx(Select, { onChange: (value) => handleSelectChange(value, "status"), options: accountTypeValuesArray, defaultValue: "Active" }) }), _jsx(Form.Item, { name: "industry", label: "Industry", className: "addContactFormInput", rules: [
                                            {
                                                required: true,
                                                message: "This field is mandatory!",
                                            },
                                        ], children: isOtherIndutry ? (_jsx(Input, { onChange: handleInputChange, name: "industry", placeholder: "Enter industry type here" })) : (_jsx(Select, { onChange: (value) => handleSelectChange(value, "industry"), options: industryTypeValuesArray })) })] }), _jsxs("div", { className: "addContactDiv", children: [_jsx(Form.Item, { name: "contactType", label: "Contact Type", className: "addContactFormInput", rules: [
                                            {
                                                required: true,
                                                message: "This field is mandatory!",
                                            },
                                        ], children: _jsx(Select, { onChange: (value) => handleSelectChange(value, "contactType"), options: contactTypesOptions }) }), _jsx(Form.Item, { name: "favorite", label: "Favourite", className: "addContactFormInput", rules: [
                                            {
                                                required: false,
                                                message: "This field is mandatory!",
                                            },
                                        ], children: _jsx(Select, { onChange: (value) => handleSelectChange(value, "favorite"), options: yesOrNo, defaultValue: "No" }) })] })] })] })] }));
};
export default AddContactForm;
