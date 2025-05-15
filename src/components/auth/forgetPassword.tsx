// Functionality imports
import { useState } from "react";
// UI imports
import { Button, Form, Input, message } from "antd";

// CSS imports
import "../../styles/auth/login.css";
import { CX_ONE_GO_LOGO } from "../../utilities/common/imagesImports";
import { useAppDispatch, useAppSelector } from "../../redux/app/hooks";
import { RootState } from "../../redux/app/store";
import {
  sendForgetPasswordEmail,
} from "../../redux/features/authenticationSlice";
import {
  ConfirmationResult,
  createUserWithEmailAndPassword,
  getAuth,
  RecaptchaVerifier,
} from "firebase/auth";
// Declare a global 'recaptchaVerifier' property on the Window object
declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier; // Replace RecaptchaVerifier with the actual type
    confirmationResult: ConfirmationResult; // Replace ConfirmationResult with the actual type
  }
}

function ForgetPassComponent() {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const [email, setEmail] = useState<string>("");

  const { sendOtpLoader } = useAppSelector(
    (state: RootState) => state.authentication
  );

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
        } else {
          dispatch(sendForgetPasswordEmail(email))
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

  return (
    <div className="loginBackWrapper">
      <div className="loginTopDiv">
        <img src={CX_ONE_GO_LOGO} alt="logo-image" />
      </div>
      <div className="loginMain">
        <div id="recaptcha-container"></div>
        <div className="loginMiddleDiv">
          <div className="loginHeading">Reset Password</div>
          <div className="loginSubHeading">
            Customer relationship management for teams and individuals{" "}
          </div>

          <div className="loginMidContainer forgetPassMidContainer">

            <Form form={form} name="loginForm" onFinish={handleSubmit}>

              <Form.Item
                name="email"
                label="Email"
                className="loginFormInput"
                rules={[
                  {
                    type: "email",
                    message: "The input is not valid E-mail!",
                  },
                  {
                    required: true,
                    message: "Please input your E-mail!",
                  },
                ]}
              >
                <Input
                  onChange={(e) => setEmail(e.target.value)}
                  name="email"
                  placeholder="Enter Email Id"
                  value={email}
                  style={{ marginBottom: "15px" }}
                />
              </Form.Item>



              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="loginSubmitBtn"
                  loading={sendOtpLoader}
                >
                  Continue
                </Button>
              </Form.Item>
            </Form>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ForgetPassComponent;
