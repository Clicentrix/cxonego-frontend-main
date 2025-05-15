import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Avatar, Button, Form, Input, Modal, Popconfirm, Select, Skeleton, Spin, Switch, Tooltip, message, } from "antd";
import { CHECK_ICON, PAYMENT_FAILURE_GIF, PAYMENT_SUCCESS_GIF, PROFILE_PIC, } from "../../utilities/common/imagesImports";
import { useAppDispatch, useAppSelector } from "../../redux/app/hooks";
import { useEffect, useState } from "react";
import "../../styles/subscription/pricingAndPlans.css";
import "../../styles/subscription/profileSubscription.css";
import { blockUserAndByIdAndGetUserById, deleteUserFromInvitedArray, getUserById, inviteTeammatesLoggedInAndGetUserDetails, updateUserRoleByAdmin, } from "../../redux/features/authenticationSlice";
import { CheckCircleOutlined, DeleteOutlined } from "@ant-design/icons";
import { DataGrid } from "@mui/x-data-grid";
import { emptyValue } from "../../utilities/common/commonFunctions/handleBack";
import { countryFlags, userRolesOptions, userRolesOptionsToInvite, } from "../../utilities/common/dataArrays";
import moment from "moment";
import { createRequestContactAdmin, fetchAllPlans, setPaymentLoader, } from "../../redux/features/subscriptionSlice";
import axios from "axios";
import TextArea from "antd/es/input/TextArea";
// const antIcon = (
//   <LoadingOutlined
//     style={{ fontSize: 24, color: "var(--button-primary)", marginLeft: "20px" }}
//     spin
//   />
// );
const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;
const razorpay_script_url = import.meta.env.VITE_REACT_APP_RAZORPAY_SCRIPT_URL;
const razorpay_api_key = import.meta.env.VITE_REACT_APP_RAZORPAY_API_KEY;
const accessToken = localStorage.getItem("accessToken");
const SubscriptionPage = () => {
    const dispatch = useAppDispatch();
    const [inviteTeamForm] = Form.useForm();
    const { getPlanLoader, paymentLoader, planSubscription, contactAdminLoader } = useAppSelector((state) => state.subscriptions);
    const { getUserLoader, invitedUsers, inviteTeamMatesLoader, user, subscription,
    // updateUserRoleLoader,
     } = useAppSelector((state) => state.authentication);
    const { screenWidth } = useAppSelector((state) => state.referrals);
    const userId = localStorage.getItem("userId");
    const planFeatures = subscription?.features
        ?.split(",")
        .map((item) => item.trim());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [invitePayload, setInvitePayload] = useState([]);
    const [isEditable, setEditable] = useState("");
    const [upgradeModal, setUpgradeModal] = useState(false);
    const [upgradeSubModal, setUpgradeSubModal] = useState(false);
    const [current, setCurrent] = useState(0);
    const [paymentStatus, setPaymentStatus] = useState(false);
    const [paymentTrasactionId, setPaymentTrasactionId] = useState("");
    const [contactAdminModal, setContactAdminModal] = useState(false);
    const [contactAdminPage, setContactAdminPage] = useState(0);
    const [createSubscriptionPayload, setCreateSubscriptionPayload] = useState({
        planId: planSubscription?.planId,
        userId: user?.userId,
        currency: user?.currency,
    });
    const currentDate = new Date(); // Current date
    const endDate = new Date(subscription?.endDateTime); // Subscription end date
    // Subtract 2 months from the end date
    const twoMonthsBeforeEnd = new Date(endDate.setMonth(endDate.getMonth() - 2));
    const [contactAdminForm] = Form.useForm();
    const [contactAdminPayload, setContactAdminPayload] = useState({
        name: user?.firstName + " " + user?.lastName,
        email: user?.email,
        phone: user?.phone,
        countryCode: user?.countryCode,
        accessToken: accessToken,
        message: "",
        organization: user?.companyName,
        onboardingStatus: "Pending",
    });
    const [member, setMember] = useState({
        email: null,
        company: user?.companyName,
        role: null,
        organizationId: user?.organizationId,
    });
    const [updateUser, setUpdateUser] = useState({
        userId: null,
        role: null,
    });
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const handleSubmit = async () => {
        await dispatch(inviteTeammatesLoggedInAndGetUserDetails({
            invites: invitePayload,
            hostUserId: userId,
        }));
        await setIsModalOpen(false);
        await setInvitePayload([]);
    };
    const handleInputChangeInvite = (e) => {
        const { name, value } = e.target;
        setMember({
            ...member,
            [name]: value,
        });
    };
    const handleAddMember = async () => {
        if (member?.email === null || member?.email === "") {
            message.warning("Please enter an email address and user role to invite");
        }
        else if (invitePayload?.length === 2) {
            message.warning("You can invite only 2 users, contact admin for more information");
        }
        else {
            await setInvitePayload([...invitePayload, member]);
            await setMember({ ...member, email: "", role: "" });
            await inviteTeamForm?.setFieldsValue({ ...member, email: "", role: "" });
        }
    };
    const handleChangeRole = async () => {
        await dispatch(updateUserRoleByAdmin(updateUser));
        await setEditable("");
    };
    const handleBlockUser = async (userId, isBlocked) => {
        const blockUserPayload = {
            userId: userId,
            isBlocked: isBlocked,
        };
        await dispatch(blockUserAndByIdAndGetUserById(blockUserPayload));
        // await setPopconfirmVisible(false);
    };
    const handleDeleteMember = async (userEmail) => {
        if (!userId) {
            void message.error("Unable to find Admin User.");
            return;
        }
        await dispatch(deleteUserFromInvitedArray({ adminId: userId, userEmail }));
        await dispatch(getUserById());
    };
    const columns = [
        {
            headerName: "Sr. No",
            field: "userId",
            renderCell: (params) => (_jsx("div", { children: params?.row?.userId || emptyValue })),
            width: 100,
        },
        {
            headerName: "FULL NAME",
            field: "name",
            width: 150,
            renderCell: (params) => (_jsx("div", { children: params?.row?.name || emptyValue })),
        },
        {
            headerName: "EMAIL",
            field: "email",
            renderCell: (params) => (_jsx("div", { children: params?.row?.email || emptyValue })),
            width: 350,
        },
        {
            headerName: "USER ROLE",
            field: "role",
            renderCell: (params) => (_jsx(_Fragment, { children: _jsxs("div", { children: [_jsx(Select, { style: { width: "80%", marginRight: "10px" }, placeholder: "Select role", defaultValue: params?.row?.role, onChange: async (value) => {
                                await setUpdateUser({
                                    ...updateUser,
                                    role: value,
                                    userId: params?.row?.id,
                                });
                                await setEditable(params?.row?.id);
                            }, disabled: params?.row?.onboardingStatus !== "ONBOARDED", children: userRolesOptions?.map((option, index) => (_jsx(Select.Option, { value: option.value, children: option.label }, index))) }), isEditable === params?.row?.id ? (_jsx(CheckCircleOutlined, { className: "cursorPointer", onClick: handleChangeRole })) : (_jsx(_Fragment, {}))] }) })),
            width: 250,
        },
        {
            headerName: "ONBOARDING STATUS",
            field: "onboardingStatus",
            renderCell: (params) => (_jsx("div", { children: params?.row?.onboardingStatus || emptyValue })),
            width: 200,
        },
        {
            field: "deleteUser",
            headerName: "Delete User",
            width: 150,
            renderCell: (params) => params.row.role === "ADMIN" ||
                params.row.onboardingStatus === "ONBOARDED" ? (_jsx(DeleteOutlined, { className: "deleteIconInTable", disabled: true })) : (_jsx(Popconfirm, { title: "Delete this User", description: "Are you sure you want to delete this user?", onConfirm: () => handleDeleteMember(params.row.email), okText: "Yes", cancelText: "Cancel", children: _jsx(DeleteOutlined, { className: "deleteIconInTable" }) })),
        },
        {
            field: "isBlocked",
            headerName: "Account Blocked",
            width: 150,
            renderCell: (params) => (_jsx("div", { children: _jsx(Switch, { defaultChecked: params?.row?.isBlocked, disabled: params?.row?.onboardingStatus !== "ONBOARDED" ||
                        params?.row?.isBlocked, onChange: () => handleBlockUser(params?.row?.id, params?.row?.isBlocked ? false : true) }) })),
        },
    ];
    const handleUpgrade = async () => {
        await dispatch(fetchAllPlans())
            .then((res) => {
            console.log("get all plansghj", res?.payload?.data?.plans);
            if (res?.payload?.data?.plans?.length > 0) {
                const subscriptionPlan = res?.payload?.data?.plans?.filter((plan) => plan?.planType === "Subscription");
                console.log("get all plansghj", subscriptionPlan[0]);
                if (subscriptionPlan?.length > 0) {
                    setCreateSubscriptionPayload({
                        ...createSubscriptionPayload,
                        planId: subscriptionPlan[0]?.planId,
                        currency: user?.currency,
                    });
                }
            }
        })
            .catch((err) => console.log(err));
        await setUpgradeModal(true);
    };
    const handleClose = () => {
        setUpgradeModal(false);
    };
    const handleCancelUpgradeSub = () => {
        setUpgradeSubModal(false);
    };
    const handleClickUpgrade = async () => {
        await setUpgradeSubModal(true);
    };
    async function displayRazorpay(payload) {
        await dispatch(setPaymentLoader(true));
        function loadScript(src) {
            return new Promise((resolve) => {
                const script = document.createElement("script");
                script.src = src;
                script.onload = () => {
                    resolve(true);
                };
                script.onerror = () => {
                    resolve(false);
                };
                document.body.appendChild(script);
            });
        }
        try {
            const res = await loadScript(razorpay_script_url);
            console.log("loading script", res);
            if (!res) {
                message.error("Razropay failed to load!!");
                return;
            }
        }
        catch (err) {
            console.log("Error in loading script", err);
            message.error("Razropay failed to load!!");
        }
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        };
        try {
            const response = await axios.post(`${baseUrl}subscription/create-subscription`, payload, config);
            console.log("response from /placeorder", response);
            const order = response?.data?.data;
            const options = {
                key: razorpay_api_key,
                // key: "rzp_test_2AZacror49uVJb", // Enter the Key ID generated from the Dashboard
                amount: `${order?.amount}`,
                currency: order?.currency,
                name: "CxOneGo",
                description: "Test Transaction",
                order_id: order?.id,
                // callback_url: "http://localhost:8080/order/verify",
                handler: async function (response) {
                    // const payloadToVerifySubscription = {
                    //   razorpay_payment_id: response?.razorpay_payment_id,
                    //   razorpay_order_id: response?.razorpay_order_id,
                    //   razorpay_signature: response?.razorpay_signature,
                    // };
                    setPaymentTrasactionId(response?.razorpay_payment_id);
                    message.warning("Your subscription request is being processed, please wait...");
                    try {
                        const result = await axios.get(`${baseUrl}subscription/${response?.razorpay_order_id}`, config);
                        console.log("subscrption object result Object result", result);
                        if (result?.status === 200) {
                            await dispatch(setPaymentLoader(false));
                            await setCurrent((prev) => prev + 1);
                            setPaymentStatus(true);
                        }
                        else {
                            await dispatch(setPaymentLoader(false));
                            await setCurrent((prev) => prev + 1);
                            setPaymentStatus(false);
                        }
                        message.success(result?.data?.message);
                    }
                    catch (err) {
                        await dispatch(setPaymentLoader(false));
                        message.error("Error in subscribing");
                        console.log("Error in payment", err);
                        await setCurrent((prev) => prev + 1);
                        setPaymentStatus(false);
                    }
                },
                modal: {
                    confirm_close: true,
                    // This function is executed when checkout modal is closed
                    // There can be 3 reasons when this modal is closed.
                    ondismiss: async (reason) => {
                        // Reason 1 - when payment is cancelled. It can happend when we click cross icon or cancel any payment explicitly.
                        if (reason === undefined) {
                            message.error("Payment cancelled!");
                            await dispatch(setPaymentLoader(false));
                        }
                        // Reason 2 - When modal is auto closed because of time out
                        else if (reason === "timeout") {
                            message.error("Session Timedout");
                            await dispatch(setPaymentLoader(false));
                        }
                        // Reason 3 - When payment gets failed.
                        else {
                            message.error("Payment Failed");
                            await dispatch(setPaymentLoader(false));
                        }
                    },
                },
                // This property allows to enble/disable retries.
                // This is enabled true by default.
                retry: {
                    enabled: true,
                },
                timeout: 300,
                prefill: {
                    contact: user?.phone ? user?.phone : "",
                },
                notes: {
                    address: "Maharashtra, Pune",
                },
                theme: {
                    color: "#f7870e",
                },
            };
            try {
                const paymentObject = new window.Razorpay(options);
                paymentObject.open();
            }
            catch (err) {
                message.error("Error in verification of subscription");
                console.log("Error in payment", err);
                await setCurrent((prev) => prev + 1);
                setPaymentStatus(false);
            }
        }
        catch (err) {
            message.error("Error in subscription creation, please try again");
            await dispatch(setPaymentLoader(false));
        }
    }
    const nextStep = async () => {
        if (current === 0) {
            await displayRazorpay(createSubscriptionPayload);
        }
        else if (current === 1) {
            if (paymentStatus) {
                // message.success("Subscription upgraded successfully")
                setUpgradeSubModal(false);
                setUpgradeModal(false);
            }
            else {
                await displayRazorpay({
                    planId: planSubscription?.planId,
                    userId: user?.userId,
                    currency: user?.currency,
                });
            }
        }
    };
    const handleInputChangeContactAdmin = (e) => {
        const { name, value } = e.target;
        setContactAdminPayload({
            ...contactAdminPayload,
            [name]: value,
        });
    };
    const handleContactAdmin = async () => {
        await dispatch(createRequestContactAdmin(contactAdminPayload));
        // await setContactAdminModal(false); //
        await setContactAdminPage(contactAdminPage + 1);
        await setUpgradeModal(false); //
    };
    const handleCancelContactAdmin = () => {
        setContactAdminModal(false);
    };
    const handleSelectChangeContactAdmin = (value, name) => {
        setContactAdminPayload({
            ...contactAdminPayload,
            [name]: value,
        });
    };
    useEffect(() => {
        dispatch(getUserById());
    }, []);
    useEffect(() => {
        setMember({
            ...member,
            company: user?.companyName,
            organizationId: user?.organizationId,
        });
    }, [user]);
    return (_jsx(_Fragment, { children: _jsxs("div", { className: "listViewBackWrapper", children: [_jsx(Modal, { open: isModalOpen, onOk: handleSubmit, onCancel: handleCancel, footer: false, children: _jsxs("div", { className: "addContactFormDiv", children: [_jsx("div", { className: "addContactTitle", children: "Invite New teammates" }), _jsx("div", { className: "addContactFormWrapper", children: _jsx("div", { className: "loginMiddleDiv", children: _jsxs(Form, { name: "loginForm", className: "inviteForm", onFinish: handleSubmit, initialValues: member, form: inviteTeamForm, children: [_jsx("div", { className: "loginSubHeading" }), _jsxs("div", { className: "loginMidContainer", children: [_jsx(Form.Item, { name: "email", label: "Email", className: "loginFormInput", rules: [
                                                            {
                                                                type: "email",
                                                                message: "The input is not valid E-mail!",
                                                            },
                                                        ], children: _jsx(Input, { onChange: handleInputChangeInvite, placeholder: "Enter Teammate's email address", name: "email" }) }), _jsx(Form.Item, { name: "role", label: "Assign User's Role", className: "loginFormInput", children: _jsx(Select, { onChange: (value) => setMember({
                                                                ...member,
                                                                role: value,
                                                            }), placeholder: "Select role", options: userRolesOptionsToInvite }) }), _jsx("div", { className: "profileInviteBtnsWrapper", children: _jsx(Form.Item, { style: { marginTop: "20px", width: "100%" }, children: _jsx(Button, { type: "primary", 
                                                                // htmlType="submit"
                                                                className: "profileInviteSendBtn2", onClick: handleAddMember, children: "Add Member" }) }) }), _jsx("div", { className: "inviteesWrapper", children: invitePayload?.length > 0
                                                            ? invitePayload?.map((item, index) => {
                                                                return (_jsx(_Fragment, { children: _jsxs("div", { className: "inviteSelectedPeopleWrapper", children: [_jsxs("div", { className: "inviteSelectedPeopleInnerWrapper", children: [_jsx(Avatar, { src: PROFILE_PIC, className: "inviteSelectedPeopleAvatar", children: "RW" }), _jsx("div", { className: "inviteSelectedPeopleEmail", children: item?.email })] }), _jsx("div", { className: "inviteSelectedPeopleRole", children: item?.role })] }, index) }));
                                                            })
                                                            : null })] }), _jsx("div", { className: "profileInviteBtnsWrapper", children: _jsx(Form.Item, { children: _jsx(Button, { type: "primary", htmlType: "submit", className: "profileInviteSendBtn", loading: inviteTeamMatesLoader, style: { width: "100%" }, disabled: invitePayload?.length === 0, children: "Send Invitation" }) }) })] }) }) })] }) }), _jsx(Modal, { open: upgradeModal, footer: false, closable: true, onClose: handleClose, onCancel: handleClose, children: _jsxs("div", { className: "addAccountFormDiv", children: [_jsx("div", { className: "subscriptionWindowTitle", children: "Your Subscription has expired, Please upgrade it." }), _jsxs("div", { className: "addOpportunityFormWrapper", children: [_jsx("div", { className: "upgradePlanBtn", children: _jsx(Button, { onClick: handleClickUpgrade, className: "upgradePlanBtnMain", children: "Upgrade Subscription" }) }), _jsx("div", { className: "upgradePlanOr", children: "OR" }), _jsxs("div", { className: "pricingCTA2wrapper", children: [_jsx(Button, { className: "pricingCTA2Btn", onClick: () => {
                                                    setContactAdminModal(true);
                                                }, children: "Contact Admin" }), _jsx("div", { children: "Do you have more than 3 members?" })] })] })] }) }), _jsx(Modal, { open: upgradeSubModal, 
                    // onOk={handleSubmitUpgradeSub}
                    onCancel: handleCancelUpgradeSub, footer: false, children: _jsx("div", { className: "addAccountFormDiv", children: current === 0 ? (_jsxs("div", { className: "reviewWrapper", children: [_jsxs("div", { children: [_jsx("div", { className: "reviewTitle", children: "Review & Confirm Details" }), _jsx("div", { className: "reviewSubTitle", children: "Verify your information to ensure accuracy before proceeding." })] }), getPlanLoader ? (_jsx(Skeleton, {})) : (_jsxs(_Fragment, { children: [_jsxs("div", { className: "reviewInnerDiv", children: [_jsx("div", { className: "reviewBlueTag", children: planSubscription?.planname }), _jsx("div", { className: "reviewInner2Div", children: _jsxs("div", { className: "reviewMiddleFlex", children: [_jsx("div", { className: "reviewTextDetails", children: planFeatures?.map((item, index) => {
                                                                    return (_jsx(_Fragment, { children: _jsxs("div", { className: "pricingCheckAndText", children: [_jsx("img", { src: CHECK_ICON }), item] }, index) }));
                                                                }) }), _jsxs("div", { className: "reviewRateDiv", children: [_jsxs("div", { className: "reviewRateWrapper", children: ["\u20B9", " ", _jsx("span", { className: "reviewRateEmphasized", children: planSubscription?.planamount }), " ", "Per user per month (billed annually)"] }), _jsx(Button, { className: "makePaymentButton", htmlType: "submit", onClick: nextStep, loading: paymentLoader, children: "Make Payment" })] })] }) })] }), _jsxs("div", { className: "reviewDisclaimer", children: [" ", _jsx("b", { children: "Disclaimer : " }), "Payment process is managed by third party application Razor pay and We do not store any of your payment details such as Credit card, Bank, UPI details. We store only payment transaction details for future reference."] })] }))] })) : current === 1 ? (paymentStatus ? (_jsxs("div", { className: "pricingSubWrapper", children: [_jsx("div", { className: "pricingTitle", children: "Subscription upgraded successfully!" }), _jsxs("div", { className: "pricingSubTitle", children: ["Here is your Razorpay transaction id :", " ", _jsx("b", { children: paymentTrasactionId })] }), _jsx("div", { className: "pricingPaymentGifWrapper", children: _jsx("img", { src: PAYMENT_SUCCESS_GIF, alt: "gif" }) }), _jsxs("div", { className: "summaryBottomDiv", children: [_jsx("div", { children: "Thank you for subscribing! Get ready for exclusive experience." }), _jsx(Button, { className: "subscribeBtn", onClick: nextStep, children: "Continue" })] })] })) : (_jsxs("div", { className: "pricingSubWrapper", children: [_jsx("div", { className: "pricingTitlefailed", children: "Payment Failed" }), _jsx("div", { className: "pricingPaymentGifWrapperFail", children: _jsx("img", { src: PAYMENT_FAILURE_GIF, alt: "gif" }) }), _jsxs("div", { className: "summaryBottomDiv", children: [_jsx("div", { children: "Oops! Something went wrong with your payment. Please check your details and try again." }), _jsx(Button, { className: "subscribeBtn", onClick: nextStep, children: "Try Again" })] })] }))) : null }) }), _jsx(Modal, { open: contactAdminModal, onOk: handleContactAdmin, onCancel: handleCancelContactAdmin, footer: false, children: _jsx("div", { className: "addAccountFormDiv", children: contactAdminPage === 1 ? (_jsxs("div", { children: [_jsx("div", { className: "loginHeading", children: "Request Sent Successfully" }), _jsx("div", { className: "loginSubHeading", style: { marginTop: "20px" }, children: "Thank You for your details, someone from our team will contact you shortly" })] })) : (_jsxs("div", { children: [_jsx("div", { className: "addAccountTitle", children: "Contact Admin for Customized Plan" }), _jsx("div", { className: "addOpportunityFormWrapper", children: _jsxs(Form, { form: contactAdminForm, name: "loginForm", onFinish: handleContactAdmin, initialValues: contactAdminPayload, children: [_jsxs("div", { className: "addAccountDivCol", children: [_jsx(Form.Item, { name: "name", label: "Name", className: "addAccountFormInput", rules: [
                                                            {
                                                                required: true,
                                                                message: "This field is mandatory!",
                                                            },
                                                        ], children: _jsx(Input, { onChange: handleInputChangeContactAdmin, name: "name", type: "string", placeholder: "Please enter here" }) }), _jsx(Form.Item, { name: "email", label: "Email", className: "addAccountFormInput", rules: [
                                                            {
                                                                type: "email",
                                                                message: "The input is not valid E-mail!",
                                                            },
                                                            {
                                                                required: false,
                                                                message: "Please input your E-mail!",
                                                            },
                                                        ], children: _jsx(Input, { onChange: handleInputChangeContactAdmin, name: "email", placeholder: "Please enter here" }) }), _jsx(Form.Item, { name: "phone", label: "Contact No.", className: "addAccountFormInput", rules: [
                                                            {
                                                                required: true,
                                                                message: "This field is mandatory!",
                                                            },
                                                            {
                                                                pattern: /^\d*$/,
                                                                message: "Please enter a valid phone number!",
                                                            },
                                                        ], children: _jsxs("div", { style: { display: "flex", gap: "5px" }, children: [_jsx(Select, { value: user?.countryCode, style: { width: "250px" }, onChange: (value) => handleSelectChangeContactAdmin(value, "countryCode"), options: countryFlags?.map((flag) => ({
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
                                                                        .includes(input.toLowerCase()) }), _jsx(Input, { onChange: handleInputChangeContactAdmin, name: "phone", type: "tel", placeholder: "Please enter here", value: user?.phone })] }) }), _jsx(Form.Item, { name: "organization", label: "Organization Name", className: "addAccountFormInput", rules: [
                                                            {
                                                                required: true,
                                                                message: "This field is mandatory!",
                                                            },
                                                        ], children: _jsx(Input, { onChange: handleInputChangeContactAdmin, name: "organization", type: "string", placeholder: "Please enter here" }) }), _jsx(Form.Item, { name: "message", label: "Note", className: "addAccountFormInput", rules: [
                                                            {
                                                                required: true,
                                                                message: "This field is mandatory!",
                                                            },
                                                        ], children: _jsx(TextArea, { onChange: handleInputChangeContactAdmin, name: "message", placeholder: "Please describe your requirement", maxLength: 100 }) })] }), _jsxs(Form.Item, { className: "addOpportunitySubmitBtnWrapper", children: [_jsx(Button, { onClick: handleCancelContactAdmin, className: "addOpportunityCancelBtn", children: "Cancel" }), _jsx(Button, { type: "primary", htmlType: "submit", className: "addOpportunitySubmitBtn", loading: contactAdminLoader, children: "Continue" })] })] }) })] })) }) }), _jsx("div", { className: "profileTopDiv", children: _jsx("div", { className: "profilePageTitle", children: "Subscription summary" }) }), _jsx(Spin, { spinning: getPlanLoader, tip: "Loading...", children: _jsxs(_Fragment, { children: [subscription?.subscriptionId ? (_jsxs("div", { className: "pricingOuterDivProfile", children: [_jsxs("div", { className: "profilePageSubTitle", children: ["Current Plan Subscription Status :", " ", subscription?.subscription_status] }), _jsx(Spin, { spinning: getUserLoader, tip: "Loading...", children: _jsx("div", { children: _jsxs("div", { className: "pricingInnerDivProfile", children: [_jsxs("div", { className: "pricingDateWrapper", children: [_jsxs("div", { className: "pricingBlueTag", children: [" ", subscription?.planName] }), screenWidth > 768 ? (_jsxs("div", { className: "pricingSubDateWrapper", children: [_jsxs("span", { className: "subscriptionDate", children: ["Start Date:", " ", moment(subscription?.startDateTime).format("MMMM Do YYYY")] }), _jsxs("span", { className: "subscriptionDate2", children: ["End Date :", " ", moment(subscription?.endDateTime).format("MMMM Do YYYY")] })] })) : null] }), _jsxs("div", { className: "pricingInner2Div", children: [screenWidth < 768 ? (_jsxs("div", { children: [_jsxs("div", { className: "subscriptionDate", children: ["Start Date :", " ", moment(subscription?.startDateTime).format("MMMM Do YYYY")] }), _jsxs("div", { className: "subscriptionDate", children: ["End Date :", " ", moment(subscription?.endDateTime).format("MMMM Do YYYY")] })] })) : null, _jsxs("div", { className: "pricingMiddleFlex", children: [_jsx("div", { className: "pricingTextDetails", children: planFeatures?.map((item, index) => {
                                                                            return (_jsx(_Fragment, { children: _jsxs("div", { className: "pricingCheckAndText", children: [_jsx("img", { src: CHECK_ICON }), item] }, index) }));
                                                                        }) }), _jsxs("div", { className: "pricingRateDiv", children: [user?.role === "ADMIN" ? (_jsxs("div", { className: "pricingRateWrapper", children: ["\u20B9", " ", _jsx("span", { className: "pricingRateEmphasized", children: subscription?.planAmount }), " ", subscription?.planType === "Trial"
                                                                                        ? `For 14 days`
                                                                                        : `Per user per month (billed annually)`] })) : null, (user?.role === "ADMIN" &&
                                                                                subscription?.planType === "Trial") ||
                                                                                (currentDate >= twoMonthsBeforeEnd &&
                                                                                    currentDate < endDate) ? (_jsx("div", { className: "pricingSubmitBtnWrapper", children: _jsx(Form.Item, { children: _jsx(Button, { type: "primary", className: "subscribeBtn", onClick: () => handleUpgrade(), disabled: currentDate >= twoMonthsBeforeEnd &&
                                                                                            currentDate < endDate, children: subscription?.planType === "Trial"
                                                                                            ? `Upgrade Plan`
                                                                                            : `Extend` }) }) })) : (_jsx(_Fragment, {}))] })] })] })] }) }) })] })) : (_jsx("div", { className: "noActivePlanMessage", children: "You don't have any active subscription plan, Please contact admin to subscribe." })), user?.role === "ADMIN" ? (_jsx(_Fragment, { children: _jsx("div", { className: "pricingOuterDivProfileTable", children: _jsx(Spin, { spinning: getUserLoader, tip: "Loading...", children: _jsxs("div", { children: [_jsxs("div", { className: "subscriptionAddInviteWrapper", children: [_jsx("div", { className: "profilePageSubTitle", children: "Organization Members" }), _jsx(Tooltip, { title: invitedUsers?.length >=
                                                                parseInt(subscription?.noOfUsers)
                                                                ? "You have invited maximum number of users as per your plan"
                                                                : subscription?.subscription_status !== "Active"
                                                                    ? "You don't have any active subscription plan"
                                                                    : "", children: _jsx(Button, { className: "subscriptionBtn", onClick: () => setIsModalOpen(true), disabled: invitedUsers?.length >=
                                                                    parseInt(subscription?.noOfUsers) ||
                                                                    subscription?.subscription_status !== "Active", children: "Add New Member" }) })] }), _jsx("div", { className: "pricingInnerDivProfile", children: _jsx("div", { style: { height: "auto" }, children: _jsx(DataGrid, { rows: invitedUsers, columns: columns, loading: getUserLoader, getRowId: (row) => row?.userId, checkboxSelection: false, paginationMode: "client" }, "userId") }) })] }) }) }) })) : (_jsx(_Fragment, {}))] }) })] }) }));
};
export default SubscriptionPage;
