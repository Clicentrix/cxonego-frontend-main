import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// Functionality imports
import { useState } from "react";
// UI imports
import { Button, Form, Input, message } from "antd";
// CSS imports
import "../../styles/auth/login.css";
import { CX_ONE_GO_LOGO } from "../../utilities/common/imagesImports";
import { useAppDispatch, useAppSelector } from "../../redux/app/hooks";
import { sendForgetPasswordEmail, } from "../../redux/features/authenticationSlice";
import { createUserWithEmailAndPassword, getAuth, } from "firebase/auth";
function ForgetPassComponent() {
    const dispatch = useAppDispatch();
    const [form] = Form.useForm();
    const [email, setEmail] = useState("");
    const { sendOtpLoader } = useAppSelector((state) => state.authentication);
    const handleSubmit = async () => {
        const auth = getAuth();
        // Check if the email is already registered
        // Email exists, attempt to sign in with the password
        createUserWithEmailAndPassword(auth, email, "dummyPassword@")
            .then(() => {
            // User signed in successfully
            message.warning("No account found with this email address, please try with registered email address only");
        })
            .catch((error) => {
            if (error.code === "auth/wrong-password") {
                console.log("forget Incorrect password.");
            }
            else {
                dispatch(sendForgetPasswordEmail(email));
            }
        });
    };
    // function onOTPVerify() {
    //   dispatch(setForgetPasswordLoader(true));
    //   const confirmationResult: any = window.confirmationResult;
    //   confirmationResult
    //     .confirm(otp)
    //     .then(async (res: { user: User }) => {
    //       message.success("OTP verified successfully");
    //       dispatch(setForgetPasswordLoader(false));
    //       dispatch(setForgetPasswordPage("resetPassPage"));
    //       console.log("RESPONSE ", res);
    //     })
    //     .catch((err: object) => {
    //       console.log("error at otp verify", err);
    //       message.error("Invalid verification code");
    //       dispatch(setForgetPasswordLoader(false));
    //     });
    // }
    return (_jsxs("div", { className: "loginBackWrapper", children: [_jsx("div", { className: "loginTopDiv", children: _jsx("img", { src: CX_ONE_GO_LOGO, alt: "logo-image" }) }), _jsxs("div", { className: "loginMain", children: [_jsx("div", { id: "recaptcha-container" }), _jsxs("div", { className: "loginMiddleDiv", children: [_jsx("div", { className: "loginHeading", children: "Reset Password" }), _jsxs("div", { className: "loginSubHeading", children: ["Customer relationship management for teams and individuals", " "] }), _jsx("div", { className: "loginMidContainer forgetPassMidContainer", children: _jsxs(Form, { form: form, name: "loginForm", onFinish: handleSubmit, children: [_jsx(Form.Item, { name: "email", label: "Email", className: "loginFormInput", rules: [
                                                {
                                                    type: "email",
                                                    message: "The input is not valid E-mail!",
                                                },
                                                {
                                                    required: true,
                                                    message: "Please input your E-mail!",
                                                },
                                            ], children: _jsx(Input, { onChange: (e) => setEmail(e.target.value), name: "email", placeholder: "Enter Email Id", value: email, style: { marginBottom: "15px" } }) }), _jsx(Form.Item, { children: _jsx(Button, { type: "primary", htmlType: "submit", className: "loginSubmitBtn", loading: sendOtpLoader, children: "Continue" }) })] }) })] })] })] }));
}
export default ForgetPassComponent;
