import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Form, Input, Select } from "antd";
import { useAppDispatch, useAppSelector } from "../../redux/app/hooks";
import { handleInputChangeReducerAccount } from "../../redux/features/accountsSlice";
import { accountBusinessTypesOptions, accountTypeValuesArray, countryFlags, countryNames, currencyOptions, industryTypeValuesArray, stateNames, } from "../../utilities/common/dataArrays";
import { useState } from "react";
function AddAccountForm() {
    const dispatch = useAppDispatch();
    const { account } = useAppSelector((state) => state.accounts);
    const [isOtherIndutry, setIsOtherIndutry] = useState(false);
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        dispatch(handleInputChangeReducerAccount({
            [name]: value,
        }));
    };
    const handleSelectChange = (value, name) => {
        console.log("handleSelectChange on industry", value, name);
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
    // const onChange = (key: string | string[]) => {
    //   console.log(key);
    // };
    return (_jsxs(_Fragment, { children: [" ", _jsx("div", { className: "addOpportunitySubTitle", children: "General Information" }), _jsxs("div", { className: "addAccountDiv", children: [_jsxs("div", { className: "addAccountDivCol", children: [_jsx(Form.Item, { name: "accountName", label: "Name", className: "addAccountFormInput", rules: [
                                    {
                                        required: true,
                                        message: "This field is mandatory!",
                                    },
                                ], children: _jsx(Input, { onChange: handleInputChange, name: "accountName", type: "string", placeholder: "Please enter here" }) }), _jsx(Form.Item, { name: "companySize", label: "Employee Size", className: "addAccountFormInput", rules: [
                                    {
                                        required: false,
                                        message: "This field is mandatory!",
                                    },
                                ], children: _jsx(Input, { onChange: handleInputChange, name: "companySize", type: "number", placeholder: "Please enter here" }) }), _jsx(Form.Item, { name: "phone", label: "Contact No.", className: "addAccountFormInput", rules: [
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
                                                label: (_jsxs("div", { style: { display: "flex", alignItems: "center" }, children: [_jsx("img", { src: flag.value, alt: "flagIcon", style: {
                                                                width: "20px",
                                                                height: "15px",
                                                                marginRight: "10px",
                                                            } }), flag.label, " (", flag.key, ")"] })),
                                            })), showSearch: true, placeholder: "Select a country", filterOption: (input, option) => option?.label.props.children[1]
                                                .toLowerCase()
                                                .includes(input.toLowerCase()) }), _jsx(Input, { onChange: handleInputChange, name: "phone", type: "tel", placeholder: "Please enter here" })] }) })] }), _jsxs("div", { className: "addAccountDivCol", children: [_jsx(Form.Item, { name: "description", label: "Description", className: "addAccountFormInput", rules: [
                                    {
                                        required: false,
                                        message: "This field is mandatory!",
                                    },
                                ], children: _jsx(Input, { onChange: handleInputChange, name: "description", type: "string", placeholder: "Please enter here", maxLength: 499 }) }), _jsx(Form.Item, { name: "email", label: "Email", className: "addAccountFormInput", rules: [
                                    {
                                        type: "email",
                                        message: "The input is not valid E-mail!",
                                    },
                                    {
                                        required: false,
                                        message: "Please input your E-mail!",
                                    },
                                ], children: _jsx(Input, { onChange: handleInputChange, name: "email", placeholder: "Please enter here" }) })] })] }), _jsx("div", { className: "addOpportunitySubTitle", children: "Location" }), _jsxs("div", { className: "addAccountDiv", children: [_jsx(Form.Item, { name: "address", label: "Address", className: "addAccountFormInput", rules: [
                            {
                                required: true,
                                message: "This field is mandatory!",
                            },
                        ], children: _jsx(Input, { onChange: handleInputChange, name: "address", type: "text", placeholder: "Please enter here" }) }), _jsx(Form.Item, { name: "country", label: "Country", className: "addAccountFormInput", rules: [
                            {
                                required: true,
                                message: "This field is mandatory!",
                            },
                        ], children: _jsx(Select, { showSearch: true, onChange: (value) => handleSelectChange(value, "country"), options: countryNames }) }), account?.country === "India" ? (_jsx(Form.Item, { name: "state", label: "State", className: "addAccountFormInput", rules: [
                            {
                                required: true,
                                message: "This field is mandatory!",
                            },
                        ], children: _jsx(Select, { showSearch: true, onChange: (value) => handleSelectChange(value, "state"), options: stateNames }) })) : (_jsx(Form.Item, { name: "state", label: "State", className: "addAccountFormInput", rules: [
                            {
                                required: true,
                                message: "This field is mandatory!",
                            },
                        ], children: _jsx(Input, { onChange: handleInputChange, name: "state", type: "string", placeholder: "Please enter here" }) })), _jsx(Form.Item, { name: "city", label: "City", className: "addAccountFormInput", rules: [
                            {
                                required: true,
                                message: "This field is mandatory!",
                            },
                        ], children: _jsx(Input, { onChange: handleInputChange, name: "city", type: "string", placeholder: "Please enter here" }) })] }), _jsx("div", { className: "addOpportunitySubTitle", children: "Communication" }), _jsxs("div", { className: "addaccountDiv", children: [_jsxs("div", { className: "addAccountDivCol", children: [_jsx(Form.Item, { name: "website", label: "Website", className: "addAccountFormInput", rules: [
                                    {
                                        required: false,
                                        message: "This field is mandatory!",
                                    },
                                ], children: _jsx(Input, { onChange: handleInputChange, name: "website", type: "text", placeholder: "Please enter here" }) }), _jsx(Form.Item, { name: "status", label: "Status", className: "addAccountFormInput", rules: [
                                    {
                                        required: false,
                                        message: "This field is mandatory!",
                                    },
                                ], children: _jsx(Select, { onChange: (value) => handleSelectChange(value, "status"), options: accountTypeValuesArray, defaultValue: "Active" }) })] }), _jsx("div", { className: "addAccountDivCol", children: _jsx(Form.Item, { name: "industry", label: "Industry", className: "addAccountFormInput", rules: [
                                {
                                    required: true,
                                    message: "This field is mandatory!",
                                },
                            ], children: isOtherIndutry ? (_jsx(Input, { onChange: handleInputChange, name: "industry", placeholder: "Enter industry type here" })) : (_jsx(Select, { onChange: (value) => handleSelectChange(value, "industry"), options: industryTypeValuesArray })) }) })] }), _jsx("div", { className: "addAccountDiv" }), _jsx("div", { className: "addOpportunitySubTitle", children: "Company Details" }), _jsxs("div", { className: "addAccountDiv", children: [_jsxs("div", { className: "addAccountDivCol", children: [_jsx(Form.Item, { name: "CurrencyCode", label: "Currency Code", className: "addAccountFormInput", rules: [
                                    {
                                        required: false,
                                        message: "This field is mandatory!",
                                    },
                                ], children: _jsx(Select, { onChange: (value) => handleSelectChange(value, "CurrencyCode"), options: currencyOptions, defaultValue: "INR" }) }), _jsx(Form.Item, { name: "businessType", label: "Business Type", className: "addAccountFormInput", rules: [
                                    {
                                        required: true,
                                        message: "This field is mandatory!",
                                    },
                                ], children: _jsx(Select, { onChange: (value) => handleSelectChange(value, "businessType"), options: accountBusinessTypesOptions }) })] }), _jsx("div", { className: "addAccountDivCol", children: _jsx(Form.Item, { name: "annualRevenue", label: "Annual Revenue", className: "addAccountFormInput", rules: [
                                {
                                    required: false,
                                    message: "This field is mandatory!",
                                },
                            ], children: _jsx(Input, { onChange: handleInputChange, name: "annualRevenue", type: "number", placeholder: "Please enter here" }) }) }), _jsx("div", { className: "addAccountDiv" })] })] }));
}
export default AddAccountForm;
