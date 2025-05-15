// Functionality imports
import { useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../../services/firebaseConfig";
// UI imports
import { Button, Form, Input, message, Modal, Select, Skeleton } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";

// CSS imports
import "../../styles/auth/login.css";
import '../../styles/subscription/pricingAndPlans.css'
import '../../styles/subscription/reviewAndConfirm.css'
import { handleRedirect } from "../../utilities/common/redirectFunction";
import {
  CHECK_ICON,
  CX_ONE_GO_LOGO,
  // GOOGLE_LOGO,
  PAYMENT_FAILURE_GIF,
  PAYMENT_SUCCESS_GIF,
  PRIVACY_POLICY,
  TERMS_OF_USE,
} from "../../utilities/common/imagesImports";
import { RootState } from "../../redux/app/store";
import { useAppDispatch, useAppSelector } from "../../redux/app/hooks";
import ReCAPTCHA from "react-google-recaptcha";
import axios from "axios";
import { REACT_APP_RECAPTCHA_KEY } from "../../routes/ipConfig";
import {
  // addUser,
  getUserByIdParam,
} from "../../redux/features/authenticationSlice";
import { ContactAdminForCustomPlan, SubscriptionAdd } from "../../utilities/common/exportDataTypes/subscriptionDataTypes";
import TextArea from "antd/es/input/TextArea";
import { createRequestContactAdmin, fetchAllPlans, setPaymentLoader } from "../../redux/features/subscriptionSlice";
import { countryFlags } from "../../utilities/common/dataArrays";
const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;
const razorpay_script_url = import.meta.env.VITE_REACT_APP_RAZORPAY_SCRIPT_URL;
const razorpay_api_key = import.meta.env.VITE_REACT_APP_RAZORPAY_API_KEY;

function LoginComponent() {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loader, setLoader] = useState<boolean>(false);
  const [contactAdminForm] = Form.useForm();
  const { user } = useAppSelector(
    (state: RootState) => state.authentication
  );
  const [current, setCurrent] = useState(0);
  const { screenWidth } = useAppSelector((state: RootState) => state.referrals);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [upgradeModal, setUpgradeModal] = useState<boolean>(false);
  const [upgradeSubModal, setUpgradeSubModal] = useState<boolean>(false);

  const { paymentLoader } = useAppSelector(
    (state: RootState) => state.subscriptions
  );
  const { planSubscription, getPlanLoader, contactAdminLoader } =
    useAppSelector((state: RootState) => state.subscriptions);
  const [paymentTrasactionId, setPaymentTrasactionId] = useState<string>("");

  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<boolean>(false);
  const planFeatures = planSubscription?.features?.split(",").map((item) => item.trim());

  const [contactAdminModal, setContactAdminModal] = useState<boolean>(false);
  const [contactAdminPage, setContactAdminPage] = useState<number>(0)
  const [phone, setPhone] = useState<string>("")
  const [contactAdminPayload, setContactAdminPayload] =
    useState<ContactAdminForCustomPlan>({
      name: "",
      email: user?.email,
      phone: "",
      countryCode: "",
      accessToken: accessToken,
      message: "",
      organization: "",
      onboardingStatus: "Pending",
    });

  const [createSubscriptionPayload, setCreateSubscriptionPayload] = useState({
    planId: planSubscription?.planId,
    userId: user?.userId!,
    currency: user?.currency,
  })


  const handleCancelContactAdmin = () => {
    setContactAdminModal(false);
  };

  const handleCancelUpgradeSub = () => {
    setUpgradeSubModal(false);
  };

  const [recaptchaToken1, setRecaptchaToken1] = useState<string | null>(null);

  const handleRecaptchaChange1 = (token: string | null) => {
    setRecaptchaToken1(token);
  };
  const handleInputChangeContactAdmin = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setContactAdminPayload({
      ...contactAdminPayload,
      [name]: value,
    });
  };

  const handleSelectChangeContactAdmin = (value: string, name: string) => {
    setContactAdminPayload({
      ...contactAdminPayload,
      [name]: value,
    });
  };

  const handleClickUpgrade = async () => {
    await dispatch(getUserByIdParam(createSubscriptionPayload?.userId!))
    await setUpgradeSubModal(true)
  }
  useEffect(() => {
    setCreateSubscriptionPayload({ ...createSubscriptionPayload, currency: user?.currency, planId: planSubscription?.planId, userId: user?.userId! })
  }, [user, planSubscription])
  const handleRecaptchaChange = (token: string | null) => {
    setRecaptchaToken(token);
  };

  const handleContactAdmin = async () => {
    if (!recaptchaToken1) {
      message.warning("Please verify the reCAPTCHA!");
    } else {
      try {
        const response = await axios.post(
          `${baseUrl}superAdmin/verifyCaptcha`,
          { token: recaptchaToken1 }
        );
        if (response.status === 200) {
          await dispatch(createRequestContactAdmin(contactAdminPayload));
          // await setContactAdminModal(false); //
          await setContactAdminPage(contactAdminPage + 1)
          await setUpgradeModal(false); //
        } else {
          message.warning("reCaptcha not verified!");
        }
      } catch (e) {
        message.warning("reCaptcha not verified!");
      }
    }
  };

  async function displayRazorpay(payload: SubscriptionAdd) {
    await dispatch(setPaymentLoader(true));
    function loadScript(src: any) {
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
      const res = await loadScript(
        razorpay_script_url
      );
      console.log("loading script", res);
      if (!res) {
        message.error("Razropay failed to load!!");
        return;
      }
    } catch (err) {
      console.log("Error in loading script", err);
      message.error("Razropay failed to load!!");
    }

    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    try {
      const response = await axios.post(
        `${baseUrl}subscription/create-subscription`,
        payload,
        config
      );
      console.log("response from /placeorder", response);
      const order = response?.data?.data;

      const options = {
        key: razorpay_api_key, // Enter the Key ID generated from the Dashboard

        // key: "rzp_test_2AZacror49uVJb", // Enter the Key ID generated from the Dashboard
        amount: `${order?.amount}`, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        currency: order?.currency,
        name: "CxOneGo",
        description: "Test Transaction",
        order_id: order?.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        // callback_url: "http://localhost:8080/order/verify",
        handler: async function (response: any) {
          // const payloadToVerifySubscription = {
          //   razorpay_payment_id: response?.razorpay_payment_id,
          //   razorpay_order_id: response?.razorpay_order_id,
          //   razorpay_signature: response?.razorpay_signature,
          // };
          setPaymentTrasactionId(response?.razorpay_payment_id);
          message.warning(
            "Your subscription request is being processed, please wait..."
          );
          try {
            const result = await axios.get(
              `${baseUrl}subscription/${response?.razorpay_order_id}`,
              config
            );
            console.log("subscrption object result Object result", result);
            if (result?.status === 200) {
              await dispatch(setPaymentLoader(false));
              await setCurrent((prev) => prev + 1);
              setPaymentStatus(true);
            } else {
              await dispatch(setPaymentLoader(false));
              await setCurrent((prev) => prev + 1);
              setPaymentStatus(false);
            }
            message.success(result?.data?.message);
          } catch (err) {
            await dispatch(setPaymentLoader(false));
            message.error("Error in subscribing");
            console.log("Error in payment", err);
            await setCurrent((prev) => prev + 1);
            setPaymentStatus(false);
          }
        },
        modal: {
          confirm_close: true, // this is set to true, if we want confirmation when clicked on cross button.
          // This function is executed when checkout modal is closed
          // There can be 3 reasons when this modal is closed.
          ondismiss: async (reason: any) => {
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
        timeout: 300, // Time limit in Seconds
        prefill: {
          contact: phone,
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
      } catch (err) {
        message.error("Error in verification of subscription");
        console.log("Error in payment", err);
        await setCurrent((prev) => prev + 1);
        setPaymentStatus(false);
      }
    }
    catch (err) {
      message.error("Error in subscription creation, please try again")
      await dispatch(setPaymentLoader(false));
    }
  }

  const nextStep = async () => {
    if (current === 0) {
      await displayRazorpay(createSubscriptionPayload);
    } else if (current === 1) {
      if (paymentStatus) {
        localStorage.setItem("loggedIn", "true");
        localStorage.setItem("accessToken", accessToken!)
        localStorage.setItem("userId", createSubscriptionPayload?.userId)
        setTimeout(() => {
          if (user?.role === "ADMIN") {
            window.location.href = "/dashboardLeads";
          }
          else {
            window.location.href = "/referrals";
          }
        }, 2000);
      } else {
        await displayRazorpay({
          planId: planSubscription?.planId,
          userId: user?.userId!,
          currency: user?.currency,
        });
      }
    }
  }

  // const googleLogin = async () => {
  //   try {
  //     const googleProviderWithPrompt = new GoogleAuthProvider();
  //     googleProviderWithPrompt.setCustomParameters({
  //       prompt: "select_account",
  //     });

  //     const result = await signInWithPopup(auth, googleProviderWithPrompt);
  //     const user = result.user;
  //     console.log("usser obkect", result);

  //     // Get the ID token using getIdToken method
  //     const idTokenResult = await user.getIdToken(true);
  //     const accessToken = idTokenResult;
  //     setAccessToken(accessToken);
  //     localStorage.setItem("accessToken", accessToken);
  //     localStorage.setItem("userId", user?.uid);
  //     localStorage.setItem("email", user?.email!);

  //     console.log("User retrieved from API new", user);

  //     await message.warning("Your are being redirected, please wait...");
  //     await dispatch(getUserByIdParam(user?.uid))
  //       .then((res) => {
  //         if (res?.payload?.success === true) {
  //           // if(res?.payload?.data)
  //           console.log("user infor from google login", res?.payload)
  //           if (res?.payload?.data?.organisation == null) {
  //             message.warning("Your onboarding is not yet completed , you will be redirected to complete the onboarding..")
  //             setTimeout(() => {
  //               window.location.href = `/sign-up?google=true`;
  //               if (res?.payload?.data?.roles[0]?.roleName === "ADMIN") {
  //                 window.location.href = "/sign-up?google=true&role==ADMIN";
  //               } else {
  //                 window.location.href = "/sign-up?google=true&role==NOTADMIN";
  //               }
  //             }, 3000);
  //           } else {
  //             localStorage.setItem("loggedIn", "true");
  //             message.success("Logged in successfully");
  //           }
  //         } else {
  //           const payloadToAddUser = {
  //             email: user.email,
  //             userId: user.uid,
  //             isVarified: user.emailVerified,
  //             emailVerified: user.emailVerified,
  //             isActive: true,
  //             fcmWebToken: null,
  //             fcmAndroidToken: null,
  //             role: "ADMIN",
  //             organizationId: null,
  //             accessToken: accessToken,
  //           };
  //           console.log("add uder payload: " + payloadToAddUser);
  //           dispatch(addUser(payloadToAddUser))
  //             .then(() => (window.location.href = `/sign-up?google=true`))
  //             .catch(() => message.error("Failed to add user"));
  //         }
  //       })
  //       .catch((err) => console.log(err));
  //   } catch (err) {
  //     message.error("Login failed");
  //   }
  // };

  const loginHandler = async () => {
    // e.preventDefault();
    if (!recaptchaToken) {
      message.warning("Please verify the reCAPTCHA!");
    } else {
      try {
        const response = await axios.post(
          `${baseUrl}superAdmin/verifyCaptcha`,
          { token: recaptchaToken }
        );

        console.log("Success for recaptcha", response);
        if (response.status === 200) {
          setLoader(true);
          signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
              const user = userCredential.user;
              // Get the access token using getIdToken method
              return user
                .getIdToken(true)
                .then((accessToken) => ({ user, accessToken }));
            })
            .then(({ user, accessToken }) => {
              setLoader(false);
              setAccessToken(accessToken)
              localStorage.setItem("accessToken", accessToken);
              localStorage.setItem("userId", user?.uid as string);
              localStorage.setItem("email", user?.email!);
              if (user?.emailVerified) {
                dispatch(getUserByIdParam(user?.uid))
                  .then((res: any) => {
                    setCreateSubscriptionPayload({ ...createSubscriptionPayload, currency: res?.payload?.data?.currency, userId: user?.uid })
                    setPhone(res?.payload?.data?.phone)
                    const expirationDate = new Date(res?.payload?.data?.organisation?.subscriptions[0]?.endDateTime); // The date you want to check
                    const currentDate = new Date(); // Current date and time
                    if (
                      res?.payload?.data?.organisation === null ||
                      res?.payload?.data?.organisation === undefined
                    ) {
                      message.warning(
                        "Your onboarding is not yet completed , you will be redirected to complete the onboarding.."
                      );
                      setTimeout(() => {
                        if (res?.payload?.data?.roles[0]?.roleName === "ADMIN") {
                          window.location.href = "/sign-up?emailverified=true&role==ADMIN";
                        } else {
                          window.location.href = "/sign-up?emailverified=true&role==NOTADMIN";
                        }
                      }, 3000);

                    }
                    else if (res?.payload?.data?.organisation?.subscriptions?.length === 0) {
                      if (res?.payload?.data?.roles[0]?.roleName === "ADMIN") {
                        window.location.href = "/sign-up?emailverified=true&subscription_status==INACTIVE";
                      } else {
                        message.warning("You dont have any active subscription, please contact your organization administrator to purchase it.")
                      }
                    }
                    else if (res?.payload?.data?.organisation?.subscriptions?.length > 0 && res?.payload?.data?.organisation?.subscriptions[0]?.subscription_status === "Inactive") {
                      message.warning("You dont have any active subscription")
                      if (res?.payload?.data?.roles[0]?.roleName === "ADMIN") {
                        window.location.href = "/sign-up?emailverified=true&subscription_status==INACTIVE";
                      } else {
                        message.warning("You dont have any active subscription, please contact your organization administrator to purchase it.")
                      }
                    }
                    // Validation based on end date of subscription 
                    else if (currentDate > expirationDate) {
                      if (res?.payload?.data?.roles[0]?.roleName === "ADMIN") {
                        dispatch(getUserByIdParam(user?.uid))
                        setUpgradeModal(true)
                      } else {
                        message.warning("Your subscription has expired, please contact your organization administrator to upgrade it.")
                      }
                    }
                    else if (res?.payload?.data?.organisation?.subscriptions?.length > 0 && res?.payload?.data?.organisation?.subscriptions[0]?.subscription_status === "cancelled") {
                      message.warning("Your subscription has been cancelled")
                    }
                    else if (res?.payload?.data?.isBlocked) {
                      message.warning("Your account access has been blocked by administrator")
                    }
                    else {
                      localStorage.setItem("accessToken", accessToken);
                      localStorage.setItem("loggedIn", "true");
                      localStorage.setItem("userId", user?.uid as string);
                      if (res?.payload?.data?.roles[0]?.roleName === "ADMIN") {
                        window.location.href = "/dashboardLeads";
                      }
                      else {
                        window.location.href = "/referrals";
                      }
                    }
                  })
                  .catch((err) => {
                    console.error(err);
                  });

                // message.success("Logged in successfully");
              } else {
                message.warning(
                  "No account found with the specified email address, please register first to continue sign in"
                );
              }
            })
            .catch((error) => {
              setLoader(false);
              console.log("Error", error);
              message.error("Invalid Login Credentials");
            });
        } else {
          message.warning("reCaptcha not verified!");
        }
      } catch (e) {
        message.warning("reCaptcha not verified!");
      }
    }
  };

  const handleBackToLogin = () => {
    window.location.href = "https://clicentrix.com/cxonego";
  };

  useEffect(() => {
    dispatch(fetchAllPlans());
  }, []);

  return (
    <div className="loginBackWrapper">
      <Modal
        open={upgradeModal}
        footer={false}
        closable={false}

      >
        <div className="addAccountFormDiv">
          <div className="subscriptionWindowTitle">Your Subscription has expired, Please upgrade it.</div>
          <div className="addOpportunityFormWrapper">
            <div className="upgradePlanBtn">
              <Button
                onClick={handleClickUpgrade}
                className="upgradePlanBtnMain"
              >
                Upgrade Subscription
              </Button>
            </div>
            <div className="upgradePlanOr">OR</div>
            <div className="pricingCTA2wrapper">
              <Button
                className="pricingCTA2Btn"
                onClick={() => {
                  setContactAdminModal(true);
                }}
              >
                Contact Admin
              </Button>
              <div>Do you have more than 3 members?</div>
            </div>
          </div>
        </div>
      </Modal>
      <Modal
        open={contactAdminModal}
        onOk={handleContactAdmin}
        onCancel={handleCancelContactAdmin}
        footer={false}
      >
        <div className="addAccountFormDiv">
          {contactAdminPage === 1 ? (
            <div>
              <div className="loginHeading">Request Sent Successfully</div>
              <div className="loginSubHeading" style={{ marginTop: "20px" }}>
                Thank You for your details, someone from our team will contact you
                shortly
              </div>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="userOnboardingSubmitBtn"
                  style={{ marginTop: "20px" }}
                  onClick={() => handleBackToLogin()}
                >
                  Back to Home Page
                </Button>
              </Form.Item>
            </div>
          ) :
            <div>
              <div className="addAccountTitle">
                Contact Admin for Customized Plan
              </div>
              <div className="addOpportunityFormWrapper">
                <Form
                  form={contactAdminForm}
                  name="loginForm"
                  onFinish={handleContactAdmin}
                  initialValues={contactAdminPayload}
                >
                  <div className="addAccountDivCol">
                    <Form.Item
                      name="name"
                      label="Name"
                      className="addAccountFormInput"
                      rules={[
                        {
                          required: true,
                          message: "This field is mandatory!",
                        },
                      ]}
                    >
                      <Input
                        onChange={handleInputChangeContactAdmin}
                        name="name"
                        type="string"
                        placeholder="Please enter here"
                      />
                    </Form.Item>
                    <Form.Item
                      name="email"
                      label="Email"
                      className="addAccountFormInput"
                      rules={[
                        {
                          type: "email",
                          message: "The input is not valid E-mail!",
                        },
                        {
                          required: false,
                          message: "Please input your E-mail!",
                        },
                      ]}
                    >
                      <Input
                        onChange={handleInputChangeContactAdmin}
                        name="email"
                        placeholder="Please enter here"
                      />
                    </Form.Item>
                    <Form.Item
                      name="phone"
                      label="Contact No."
                      className="addAccountFormInput"
                      rules={[
                        {
                          required: true,
                          message: "This field is mandatory!",
                        },
                        {
                          pattern: /^\d*$/,
                          message: "Please enter a valid phone number!",
                        },
                      ]}
                    >
                      <div style={{ display: "flex", gap: "5px" }}>
                        <Select
                          style={{ width: "250px" }}
                          onChange={(value) =>
                            handleSelectChangeContactAdmin(value, "countryCode")
                          }
                          options={countryFlags?.map((flag) => ({
                            value: flag.key,
                            label: (
                              <div
                                style={{ display: "flex", alignItems: "center" }}
                              >
                                <img
                                  src={flag.value}
                                  alt="flagIcon"
                                  style={{
                                    width: "20px",
                                    height: "15px",
                                    marginRight: "10px",
                                  }}
                                />
                                {flag.label} ({flag.key})
                              </div>
                            ),
                          }))}
                          showSearch
                          placeholder="Select a country"
                          filterOption={(input, option) =>
                            option?.label.props.children[1]
                              .toLowerCase()
                              .includes(input.toLowerCase())
                          }
                        />
                        <Input
                          onChange={handleInputChangeContactAdmin}
                          name="phone"
                          type="tel"
                          placeholder="Please enter here"
                        />
                      </div>
                    </Form.Item>
                    <Form.Item
                      name="organization"
                      label="Organization Name"
                      className="addAccountFormInput"
                      rules={[
                        {
                          required: true,
                          message: "This field is mandatory!",
                        },
                      ]}
                    >
                      <Input
                        onChange={handleInputChangeContactAdmin}
                        name="organization"
                        type="string"
                        placeholder="Please enter here"
                      />
                    </Form.Item>
                    <Form.Item
                      name="message"
                      label="Note"
                      className="addAccountFormInput"
                      rules={[
                        {
                          required: true,
                          message: "This field is mandatory!",
                        },
                      ]}
                    >
                      <TextArea
                        onChange={handleInputChangeContactAdmin}
                        name="message"
                        placeholder="Please describe your requirement"
                        maxLength={100}
                      />
                    </Form.Item>
                  </div>
                  <div className="recaptchaContainer">
                    <ReCAPTCHA
                      sitekey={REACT_APP_RECAPTCHA_KEY}
                      onChange={handleRecaptchaChange1}
                    />
                  </div>
                  <Form.Item className="addOpportunitySubmitBtnWrapper">
                    <Button
                      onClick={handleCancelContactAdmin}
                      className="addOpportunityCancelBtn"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="primary"
                      htmlType="submit"
                      className="addOpportunitySubmitBtn"
                      loading={contactAdminLoader}
                    >
                      Continue
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            </div>}
        </div>
      </Modal>
      <Modal
        open={upgradeSubModal}
        // onOk={handleSubmitUpgradeSub}
        onCancel={handleCancelUpgradeSub}
        footer={false}
      >
        <div className="addAccountFormDiv">
          {current === 0 ? (
            <div className="reviewWrapper">
              <div>
                <div className="reviewTitle">
                  Review & Confirm Details
                </div>
                <div className="reviewSubTitle">
                  Verify your information to ensure accuracy before
                  proceeding.
                </div>
              </div>
              {getPlanLoader ? <Skeleton /> :
                <>
                  <div className="reviewInnerDiv">
                    <div className="reviewBlueTag">{planSubscription?.planname}</div>
                    <div className="reviewInner2Div">
                      <div className="reviewMiddleFlex">
                        <div className="reviewTextDetails">
                          {planFeatures?.map((item, index) => {
                            return (
                              <>
                                <div
                                  className="pricingCheckAndText"
                                  key={index}
                                >
                                  <img src={CHECK_ICON} />
                                  {item}
                                </div>
                              </>
                            );
                          })}
                        </div>
                        <div className="reviewRateDiv">
                          <div className="reviewRateWrapper">
                            ₹{" "}
                            <span className="reviewRateEmphasized">
                              {planSubscription?.planamount}
                            </span>{" "}
                            Per user per month (billed annually)
                          </div>
                          <Button
                            className="makePaymentButton"
                            htmlType="submit"
                            onClick={nextStep}
                            loading={paymentLoader}
                          >
                            Make Payment
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="reviewDisclaimer">
                    {" "}
                    <b>Disclaimer : </b>Payment process is managed by third
                    party application Razor pay and We do not store any of
                    your payment details such as Credit card, Bank, UPI
                    details. We store only payment transaction details for
                    future reference.
                  </div>
                </>}
            </div>
          ) : current === 1 ? (
            paymentStatus ? (
              <div className="pricingSubWrapper">
                <div className="pricingTitle">
                  Subscription purchased successfully!
                </div>
                <div className="pricingSubTitle">
                  Here is your Razorpay transaction id :{" "}
                  <b>{paymentTrasactionId}</b>
                </div>
                <div className="pricingPaymentGifWrapper">
                  <img src={PAYMENT_SUCCESS_GIF} alt="gif" />
                </div>
                <div className="summaryBottomDiv">
                  <div>
                    Thank you for subscribing! Get ready for exclusive
                    experience.
                  </div>
                  <Button className="subscribeBtn" onClick={nextStep}>
                    Continue
                  </Button>
                </div>
              </div>
            ) : (
              <div className="pricingSubWrapper">
                <div className="pricingTitlefailed">Payment Failed</div>
                <div className="pricingPaymentGifWrapperFail">
                  <img src={PAYMENT_FAILURE_GIF} alt="gif" />
                </div>
                <div className="summaryBottomDiv">
                  <div>
                    Oops! Something went wrong with your payment. Please
                    check your details and try again.
                  </div>
                  <Button className="subscribeBtn" onClick={nextStep}>
                    Try Again
                  </Button>
                </div>
              </div>
            )
          ) : null}
        </div>
      </Modal>
      <div className="loginTopDiv">
        <img src={CX_ONE_GO_LOGO} alt="logo-image" />
      </div>
      <div className="loginMain">
        <div className="loginMiddleDiv">
          <div className="loginHeading">Welcome to CXOneGo</div>
          <div className="loginSubHeading">
            Customer relationship management for teams and individuals{" "}
          </div>
          <div className="loginMidContainer">
            {/* {screenWidth < 768 ? (
              <></>
            ) : (
              <>
                <Button className="loginWithGoogleBtn" onClick={googleLogin}>
                  <img src={GOOGLE_LOGO} />
                  Continue with Google
                </Button>
                <hr className="loginHr" />
              </>
            )} */}
            <Form
              form={form}
              name="loginForm"
              // initialValues={user}
              onFinish={loginHandler}
            // initialValues={{ remember: true }}
            >
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
                  placeholder="Enter your email id here"
                />
              </Form.Item>
              <Form.Item
                className="loginFormInput"
                label="Password"
                name="password"
                style={{ marginBottom: "20px" }}
                rules={[
                  {
                    required: true,
                    message: "This field is mandatory !",
                  },
                ]}
              >
                <Input.Password
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  name="password"
                  placeholder="Enter password"
                  value={password}
                  iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                />
              </Form.Item>
              <div className="recaptchaContainer">
                <ReCAPTCHA
                  sitekey={REACT_APP_RECAPTCHA_KEY}
                  onChange={handleRecaptchaChange}
                />
              </div>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="loginSubmitBtn"
                  loading={loader}
                >
                  Continue
                </Button>
              </Form.Item>
              <div className="loginLinks">
                <div
                  className="loginForgetPassLink"
                  onClick={() => handleRedirect("sign-up")}
                >
                  Register new account
                </div>
                <div
                  className="loginForgetPassLink"
                  onClick={() => handleRedirect("forget-password")}
                >
                  Forgot Password ?
                </div>
              </div>
            </Form>
          </div>
        </div>
      </div>
      {screenWidth < 768 ? (
        <></>
      ) : (
        <div className="loginBottomDiv">
          By clicking “Continue with email” you agree
          to our
          <a target="_abc" className="underlineText" href={TERMS_OF_USE}> Terms of Use</a> and <a target="_abc" className="underlineText" href={PRIVACY_POLICY}>Privacy Policy</a>.
        </div>
      )}
    </div>
  );
}

export default LoginComponent;
