import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Form, Input, Select } from "antd";
import { useAppDispatch } from "../../redux/app/hooks";
import TextArea from "antd/es/input/TextArea";
import { countryFlags, referralStatusOptions, } from "../../utilities/common/dataArrays";
import { handleInputChangeReducerReferral } from "../../redux/features/referralsSlice";
function AddReferralForm() {
    const dispatch = useAppDispatch();
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        dispatch(handleInputChangeReducerReferral({
            [name]: value,
        }));
    };
    const handleSelectChange = (value, name) => {
        dispatch(handleInputChangeReducerReferral({
            [name]: value,
        }));
    };
    return (_jsxs("div", { children: [_jsxs("div", { className: "referralAddFormGrid", children: [_jsx(Form.Item, { name: "firstName", label: "First Name", className: "addAccountFormInput", rules: [
                            {
                                required: true,
                                message: "This field is mandatory!",
                            },
                        ], children: _jsx(Input, { onChange: handleInputChange, name: "firstName", type: "string", placeholder: "Please enter here" }) }), _jsx(Form.Item, { name: "lastName", label: "Last Name", className: "addAccountFormInput", rules: [
                            {
                                required: true,
                                message: "This field is mandatory!",
                            },
                        ], children: _jsx(Input, { onChange: handleInputChange, name: "lastName", type: "string", placeholder: "Please enter here" }) })] }), _jsxs("div", { className: "referralAddFormGrid", children: [_jsx(Form.Item, { name: "email", label: "Email", className: "addAccountFormInput", rules: [
                            {
                                type: "email",
                                message: "The input is not valid E-mail!",
                            },
                            {
                                required: false,
                                message: "Please input your E-mail!",
                            },
                        ], children: _jsx(Input, { onChange: handleInputChange, name: "email", type: "string", placeholder: "Please enter here" }) }), _jsx(Form.Item, { name: "phone", label: "Contact No.", className: "addAccountFormInput", rules: [
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
                                        .includes(input.toLowerCase()) }), _jsx(Input, { onChange: handleInputChange, name: "phone", type: "tel", placeholder: "Please enter here" })] }) })] }), _jsxs("div", { className: "referralAddFormGrid", children: [_jsx(Form.Item, { name: "referBy", label: "Referred By", className: "addAccountFormInput", rules: [
                            {
                                required: true,
                                message: "This field is mandatory!",
                            },
                        ], children: _jsx(Input, { onChange: handleInputChange, name: "referBy", type: "string", placeholder: "Please enter here" }) }), _jsx(Form.Item, { name: "company", label: "Company", className: "addAccountFormInput", rules: [
                            {
                                required: false,
                                message: "This field is mandatory!",
                            },
                        ], children: _jsx(Input, { onChange: handleInputChange, name: "company", type: "string", placeholder: "Please enter here" }) })] }), _jsx("div", { className: "referralAddFormGrid", children: _jsx(Form.Item, { name: "status", label: "Status", className: "addOpportunityFormInput", rules: [
                        {
                            required: false,
                            message: "This field is mandatory!",
                        },
                    ], children: _jsx(Select, { onChange: (value) => handleSelectChange(value, "status"), options: referralStatusOptions, defaultValue: "New" }) }) }), _jsx(Form.Item, { name: "description", label: "Description", className: "addReferralFormInput", rules: [
                    {
                        required: false,
                        message: "This field is mandatory!",
                    },
                ], children: _jsx(TextArea, { onChange: handleInputChange, name: "description", placeholder: "Please enter here" }) })] }));
}
export default AddReferralForm;
