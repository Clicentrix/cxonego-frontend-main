import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Avatar, Button, Form, Input, Select, Skeleton, Tooltip } from "antd";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/app/hooks";
import "../../styles/referrals/oneReferralView.css";
import TextArea from "antd/es/input/TextArea";
import { DESCRIPTION_ICON_ORANGE, GENERAL_INFO_ICON_ORANGE, OWNER, } from "../../utilities/common/imagesImports";
import { LeftOutlined, RightOutlined, EditOutlined, CheckCircleOutlined, } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import { handleBack } from "../../utilities/common/commonFunctions/handleBack";
import { getReferralById, handleInputChangeReducerReferral, setEditableMode, updateReferralById, } from "../../redux/features/referralsSlice";
import { countryFlags, referralStatusOptions, } from "../../utilities/common/dataArrays";
const OneReferralById = () => {
    const dispatch = useAppDispatch();
    const params = useParams();
    const [form] = Form.useForm();
    const { addReferralLoader, getReferralLoader, editable, referral, screenWidth, } = useAppSelector((state) => state.referrals);
    const referId = params?.referId;
    const OWNER_AVATAR = `${referral?.owner?.firstName
        ?.slice(0, 1)
        ?.toLocaleUpperCase()}
                          ${referral?.owner?.lastName
        ?.slice(0, 1)
        ?.toLocaleUpperCase()}`;
    const OWNER_NAME = `${referral?.owner?.firstName}
                          ${referral?.owner?.lastName}`;
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
    const handleSubmit = () => {
        if (editable) {
            dispatch(updateReferralById(referral));
        }
        else {
            dispatch(setEditableMode(true));
        }
    };
    useEffect(() => {
        if (referId) {
            dispatch(setEditableMode(false));
            dispatch(getReferralById(referId));
        }
    }, [referId]);
    useEffect(() => {
        form.setFieldsValue(referral);
    }, [referral]);
    return (_jsx("div", { className: "oneAccountMainWrapper", children: getReferralLoader ? (_jsx(_Fragment, { children: _jsx(Skeleton, {}) })) : (_jsx("div", { className: editable ? "oneAccountViewWrapper" : "onceAccountViewWrapperNotEdit", children: _jsxs(Form, { form: form, name: "loginForm", onFinish: handleSubmit, initialValues: referral, children: [_jsx("div", { className: "oneAccountTopToolbar1", children: _jsxs("div", { className: "referralsSelectViewWrapper", children: [_jsxs("div", { className: "referralsSelectView1", children: [_jsx(LeftOutlined, { className: "backArrow", onClick: handleBack }), _jsx("div", { className: "opportunitysViewTitle", children: "Referrals" }), _jsx(RightOutlined, {}), _jsx("div", { className: "opportunitysViewTitle", children: referral?.firstName || "" })] }), _jsx("div", { className: "referralsSelectView1", children: _jsx(Form.Item, { className: "addAccountSubmitBtnWrapper", children: _jsx(Button, { type: "primary", htmlType: "submit", className: "accountEditBtn", loading: addReferralLoader, children: screenWidth < 768 ? (editable ? (_jsx(Tooltip, { title: "Update Referral", children: _jsx(CheckCircleOutlined, {}) })) : (_jsx(Tooltip, { title: "Save Changes", children: _jsx(EditOutlined, {}) }))) : editable ? ("Save Changes") : ("Edit") }) }) })] }) }), _jsx("div", { children: _jsx("div", { className: "updateReferralDiv", children: _jsxs("div", { children: [_jsxs("div", { className: "referralEditFormDiv", children: [_jsxs("div", { className: "updateReferralDivCol", children: [_jsxs("div", { className: "addOpportunitySubTitle", children: [_jsx("div", { className: "illustrationIconWrapper", children: _jsx("img", { src: GENERAL_INFO_ICON_ORANGE, alt: "illustration", className: "illustrationIcon" }) }), "General Information"] }), _jsxs("div", { className: "updateReferralFlex", children: [_jsx(Form.Item, { name: "firstName", label: "First Name", className: "addAccountFormInput", style: { width: "230px" }, rules: [
                                                                    {
                                                                        required: true,
                                                                        message: "This field is mandatory!",
                                                                    },
                                                                ], children: _jsx(Input, { onChange: handleInputChange, name: "firstName", type: "string", placeholder: "Please enter here", readOnly: !editable }) }), _jsx(Form.Item, { name: "lastName", label: "Last Name", className: "addAccountFormInput", style: { width: "230px" }, rules: [
                                                                    {
                                                                        required: true,
                                                                        message: "This field is mandatory!",
                                                                    },
                                                                ], children: _jsx(Input, { onChange: handleInputChange, name: "lastName", type: "string", placeholder: "Please enter here", readOnly: !editable }) }), _jsx(Form.Item, { name: "email", label: "Email", className: "addAccountFormInput", style: { width: "230px" }, rules: [
                                                                    {
                                                                        type: "email",
                                                                        message: "The input is not valid E-mail!",
                                                                    },
                                                                    {
                                                                        required: false,
                                                                        message: "Please input your E-mail!",
                                                                    },
                                                                ], children: _jsx(Input, { onChange: handleInputChange, name: "email", type: "string", placeholder: "Please enter here", readOnly: !editable }) }), _jsx(Form.Item, { name: "status", label: "Status", className: "addAccountFormInput", style: { width: "230px" }, rules: [
                                                                    {
                                                                        required: false,
                                                                        message: "This field is mandatory!",
                                                                    },
                                                                ], children: _jsx(Select, { onChange: (value) => handleSelectChange(value, "status"), options: referralStatusOptions, showSearch: true, disabled: !editable }) })] })] }), _jsxs("div", { className: "accountInfo1", children: [_jsxs("div", { className: "opportunityInfo1CompanyNameLabel", children: [_jsx("img", { src: OWNER, alt: "illustration", className: "illustrationIcon" }), "Owner"] }), _jsxs("div", { className: "accountOwnerDiv", children: [_jsx(Avatar, { children: OWNER_AVATAR }), _jsx("p", { className: "accountInfo1CompanyName", children: OWNER_NAME })] })] })] }), _jsx("div", { className: "updateReferralDivCol", children: _jsxs("div", { className: "updateReferralFlex", children: [_jsx(Form.Item
                                                // name="phone"
                                                , { 
                                                    // name="phone"
                                                    label: "Contact No.", className: "addContactFormInput", rules: [
                                                        {
                                                            required: true,
                                                            message: "This field is mandatory!",
                                                        },
                                                        {
                                                            pattern: /^\d*$/,
                                                            message: "Please enter a valid phone number!",
                                                        },
                                                    ], children: _jsxs("div", { style: { display: "flex", gap: "5px" }, children: [_jsx(Select, { value: referral?.countryCode, style: { width: "250px" }, onChange: (value) => handleSelectChange(value, "countryCode"), options: countryFlags?.map((flag) => ({
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
                                                                    .includes(input.toLowerCase()) }), _jsx(Input, { onChange: handleInputChange, name: "phone", type: "tel", placeholder: "Please enter here", readOnly: !editable, value: referral?.phone })] }) }), _jsx(Form.Item, { name: "referBy", label: "Referred By", className: "addAccountFormInput", style: { width: "230px" }, rules: [
                                                        {
                                                            required: true,
                                                            message: "This field is mandatory!",
                                                        },
                                                    ], children: _jsx(Input, { onChange: handleInputChange, name: "referBy", type: "string", placeholder: "Please enter here", readOnly: !editable }) }), _jsx(Form.Item, { name: "company", label: "Company", className: "addOpportunityFormInput", style: { width: "230px" }, rules: [
                                                        {
                                                            required: false,
                                                            message: "This field is mandatory!",
                                                        },
                                                    ], children: _jsx(Input, { onChange: handleInputChange, name: "company", type: "string", placeholder: "Please enter here", readOnly: !editable }) }), _jsx(Form.Item, { style: { width: "230px" } })] }) }), _jsxs("div", { className: "updateReferralDivCol", children: [_jsxs("div", { className: "addOpportunitySubTitle", children: [_jsx("div", { className: "illustrationIconWrapper", children: _jsx("img", { src: DESCRIPTION_ICON_ORANGE, alt: "illustration", className: "illustrationIcon" }) }), "Description"] }), _jsx("div", { className: "updateReferalFlex", children: _jsx(Form.Item, { name: "description", label: "Notes", className: "addActivityFormInput", rules: [
                                                        {
                                                            required: false,
                                                            message: "This field is mandatory!",
                                                        },
                                                    ], children: _jsx(TextArea, { onChange: handleInputChange, name: "description", 
                                                        // placeholder="Please enter here"
                                                        readOnly: !editable, maxLength: 499 }) }) })] }), _jsx("div", { className: "addAccountDiv" })] }) }) })] }) })) }));
};
export default OneReferralById;
