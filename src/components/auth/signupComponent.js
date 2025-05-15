import { jsxs as _jsxs, jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
// Functionality imports
import { useEffect, useState } from "react";
import { 
// GoogleAuthProvider,
createUserWithEmailAndPassword, fetchSignInMethodsForEmail, getAuth, onAuthStateChanged, sendEmailVerification,
// signInWithPopup,
 } from "firebase/auth";
// import { auth } from "../../services/firebaseConfig";
// UI imports
import { Avatar, Button, Form, Input, Popover, Select, Skeleton, Steps, Tooltip, message, } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone, 
// DeleteOutlined,
LeftOutlined, } from "@ant-design/icons";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// CSS imports
import "../../styles/auth/login.css";
import "../../styles/auth/inviteTeamMates.css";
import "../../styles/auth/signup.css";
import "../../styles/subscription/reviewAndConfirm.css";
import "../../styles/subscription/pricingAndPlans.css";
import { handleRedirect } from "../../utilities/common/redirectFunction";
import { CHECK_ICON, CX_ONE_GO_LOGO, 
// GOOGLE_LOGO,
PAYMENT_FAILURE_GIF, PAYMENT_SUCCESS_GIF, PROFILE_PIC, } from "../../utilities/common/imagesImports";
import { getPasswordValidityIcons } from "../../utilities/common/passwordValidator";
import { useAppDispatch, useAppSelector } from "../../redux/app/hooks";
import { addUser, 
// checkInvitationValidity,
checkUserOnBoardingStatus, getUserById, 
// getUserByIdParam,
handleInputChangeReducerAuth, inviteTeammates, setUserFormPage, updateUserByUserId, updateUserByUserIdExceptAdmin, } from "../../redux/features/authenticationSlice";
import { addOrganisation, handleInputChangeReducerOrganisation, } from "../../redux/features/organizationSlice";
// import Upload, { UploadChangeParam, UploadFile } from "antd/es/upload";
import { countryFlags, countryNames, currencyOptions, industryTypeValuesArray, 
// moodsArray,
nameInitialTypeValuesArray, stateNames, userRoleTypeValuesArray, } from "../../utilities/common/dataArrays";
import { useLocation } from "react-router-dom";
import { createRequestContactAdmin, fetchAllPlans, } from "../../redux/features/subscriptionSlice";
import axios from "axios";
import { setPaymentLoader } from "../../redux/features/subscriptionSlice";
import { REACT_APP_RECAPTCHA_KEY } from "../../routes/ipConfig";
const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;
import ReCAPTCHA from "react-google-recaptcha";
const razorpay_script_url = import.meta.env.VITE_REACT_APP_RAZORPAY_SCRIPT_URL;
const razorpay_api_key = import.meta.env.VITE_REACT_APP_RAZORPAY_API_KEY;
const emailHere = localStorage.getItem("email");
function isAccessToken(str) {
    return typeof str === "string" && str !== null;
}
function SignUpComponent() {
    const { Step } = Steps;
    const dispatch = useAppDispatch();
    const [signInForm] = Form.useForm();
    const [userInfoForm] = Form.useForm();
    const [orgInfoForm] = Form.useForm();
    const [pricingForm] = Form.useForm();
    const [inviteTeamForm] = Form.useForm();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loader, setLoader] = useState(false);
    // const { screenWidth } = useAppSelector((state: RootState) => state.referrals);
    const [isOtherIndutry, setIsOtherIndutry] = useState(false);
    const [accessToken, setAccessToken] = useState(null);
    const accessTokenFromLocal = localStorage.getItem("accessToken");
    const userIdFromLocal = localStorage.getItem("userId");
    const emailFromLocal = localStorage.getItem("email");
    const [userId, setUserId] = useState(null);
    const [paymentStatus, setPaymentStatus] = useState(false);
    const [paymentTrasactionId, setPaymentTrasactionId] = useState("");
    // const [subscribeMode, setSubscribeMode] = useState<boolean>(false);
    const { organisation, addOrganisationLoader } = useAppSelector((state) => state.organisations);
    const { planTrial, planSubscription, getPlanLoader, contactAdminLoader } = useAppSelector((state) => state.subscriptions);
    const [plan, setPlan] = useState(planSubscription);
    const [planType, setPlanType] = useState("Subscription");
    const planFeatures = plan?.features?.split(",").map((item) => item.trim());
    const [current, setCurrent] = useState(0);
    const [queryParams, setQueryParams] = useState({
        email: null,
        company: null,
        role: null,
        organizationId: null,
    });
    const { user, userFormPage, loading, inviteTeamMatesLoader, userOnboardStatusData, } = useAppSelector((state) => state.authentication);
    const { paymentLoader } = useAppSelector((state) => state.subscriptions);
    const [contactAdminPayload, setContactAdminPayload] = useState({
        name: "",
        email: user?.email,
        phone: "",
        countryCode: "",
        accessToken: accessToken,
        message: "",
        organization: "",
        onboardingStatus: "Pending",
    });
    const [recaptchaToken, setRecaptchaToken] = useState(null);
    const handleRecaptchaChange = (token) => {
        setRecaptchaToken(token);
    };
    const signInAgain = async () => {
        if (window.location.href.includes("google=true&role==ADMIN")) {
            // Proceed with sign-up
            await dispatch(setUserFormPage(2));
            await dispatch(fetchAllPlans());
            await dispatch(getUserById());
        }
        if (window.location.href.includes("emailverified=true&role==ADMIN")) {
            // Proceed with sign-up
            await dispatch(setUserFormPage(2));
            await dispatch(fetchAllPlans());
            await dispatch(getUserById());
        }
        if (window.location.href.includes("&role==NOTADMIN")) {
            await dispatch(checkUserOnBoardingStatus(emailFromLocal));
            await dispatch(setUserFormPage(2));
        }
    };
    const signInDirectToPlansPage = async () => {
        if (window.location.href.includes("&subscription_status==INACTIVE")) {
            // Proceed with purchase plan
            await dispatch(fetchAllPlans());
            await dispatch(setUserFormPage(3));
            await setCurrent(2);
            await dispatch(getUserById());
        }
    };
    useEffect(() => {
        signInDirectToPlansPage();
    }, []);
    useEffect(() => {
        signInAgain();
    }, []);
    useEffect(() => {
        setContactAdminPayload({
            ...contactAdminPayload,
            accessToken: accessToken,
        });
    }, [accessToken]);
    useEffect(() => {
        if (planType === "Trial") {
            setPlan(planTrial);
        }
        else {
            setPlan(planSubscription);
        }
    }, [planType]);
    useEffect(() => {
        setPlan(planSubscription);
    }, [planSubscription]);
    // QUERY PARAMETERS
    const location = useLocation();
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
            if (!res) {
                message.error("Razorpay failed to load!!");
                return;
            }
        }
        catch (err) {
            console.log("Error in loading script", err);
            message.error("Razorpay failed to load!!");
        }
        const config = {
            headers: {
                Authorization: `Bearer ${isAccessToken(accessToken) ? accessToken : accessTokenFromLocal}`,
            },
        };
        try {
            const response = await axios.post(`${baseUrl}subscription/create-subscription`, payload, config);
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
                    contact: user?.phone,
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
                await dispatch(setPaymentLoader(false));
            }
        }
        catch (err) {
            message.error("Error in subscription creation, please try again");
            await dispatch(setPaymentLoader(false));
        }
    }
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const queryParams = {};
        for (const [key, value] of searchParams.entries()) {
            queryParams[key] = value;
        }
        if (queryParams?.email === undefined) {
            return;
        }
        else {
            localStorage?.setItem("email", queryParams?.email);
            localStorage?.setItem("company", queryParams?.company);
            localStorage?.setItem("role", queryParams?.role);
            localStorage?.setItem("organizationId", queryParams?.organizationId);
            setQueryParams(queryParams);
        }
    }, [location.search]);
    const [member, setMember] = useState({
        email: "",
        company: user?.company,
        role: "",
        organizationId: user?.organizationId,
    });
    const [invitePayload, setInvitePayload] = useState([]);
    // const [moodPayload, setMoodPayload] = useState({});
    // const [fileLoader, setFileLoader] = useState<boolean>(false);
    // const moodPicturesArray = [
    //   { pictureId: "1", url: "/assets/personalization/moodPic1.png" },
    //   { pictureId: "2", url: "/assets/personalization/moodPic1.png" },
    //   { pictureId: "3", url: "/assets/personalization/moodPic1.png" },
    //   { pictureId: "4", url: "/assets/personalization/moodPic1.png" },
    //   { pictureId: "5", url: "/assets/personalization/moodPic1.png" },
    //   { pictureId: "6", url: "/assets/personalization/moodPic1.png" },
    // ];
    // const handleThemeChange = (name: string, value: string) => {
    //   dispatch(
    //     handleInputChangeReducerAuth({
    //       [name]: value,
    //     })
    //   );
    // };
    const nextStep = async () => {
        if (current === 0) {
            setCurrent((prev) => prev + 1);
        }
        else if (current === 1) {
            await await dispatch(addOrganisation(organisation))
                ?.then((response) => {
                setContactAdminPayload({
                    ...contactAdminPayload,
                    name: `${user?.firstName} ${user?.lastName}`,
                    phone: user?.phone,
                    email: emailHere ? emailHere : email,
                    countryCode: user?.countryCode,
                    organization: response?.payload?.data?.name,
                    onboardingStatus: "Pending",
                });
                dispatch(updateUserByUserId({
                    ...user,
                    organizationId: response?.payload?.data?.organisationId,
                    organisation: response?.payload?.data?.organisationId,
                    company: response?.payload?.data?.name,
                    firstName: user?.firstName,
                    lastName: user?.lastName,
                    emailVerified: true,
                    phone: user?.phone,
                    email: emailHere ? emailHere : email,
                }))
                    .then(() => {
                    setMember({
                        email: "",
                        company: response?.payload?.data?.name,
                        role: "",
                        organizationId: response?.payload?.data?.organisationId,
                    });
                    setCurrent((prev) => prev + 1);
                })
                    .catch(() => {
                    console.log("");
                });
            })
                ?.catch((error) => {
                console.log("error", error);
            });
        }
        else if (current === 2) {
            await displayRazorpay({
                planId: plan?.planId,
                userId: user?.userId,
                currency: user?.currency,
            });
        }
        else if (current === 3) {
            if (paymentStatus) {
                await dispatch(setUserFormPage(userFormPage + 1));
            }
            else {
                await displayRazorpay({
                    planId: plan?.planId,
                    userId: user?.userId,
                    currency: user?.currency,
                });
            }
        }
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
    // const handleMoodClick = (item: object) => {
    //   console.log("mood item", item);
    // };
    // const handleFileUpload = async (info: UploadChangeParam<UploadFile>) => {
    //   const file = info.file;
    //   console.log("file", file);
    // if (file && file.originFileObj) {
    //   setFileLoader(true);
    //   // Step 1: Get the presigned URL
    //   const body = {
    //     filename: file?.name,
    //     filetype: file?.type,
    //   };
    //   const responsePresignedUrl = await fetch(
    //     `${}/aws/get-presigned-url`,
    //     {
    //       method: "POST",
    //       body: JSON.stringify(body),
    //       headers: {
    //         "Content-Type": "application/json",
    //         Authorization: `Bearer ${accessToken}`,
    //       },
    //     }
    //   );
    //   const signedUrlData = await responsePresignedUrl.json();
    //   const signedUrl = signedUrlData?.data?.url;
    //   // Step 2: Upload the file to S3 using the presigned URL
    //   if (signedUrl) {
    //     try {
    //       const responseUpload = await fetch(signedUrl, {
    //         method: "PUT",
    //         body: file.originFileObj,
    //         headers: {
    //           "Content-Type": file.originFileObj.type,
    //           "x-amz-acl": "public-read", // Adjust ACL as needed
    //         },
    //       });
    //       if (responseUpload.ok) {
    //         setFileLoader(false);
    //         // setCurrentPet({
    //         //   ...currentPet,
    //         //   [variableName]: signedUrl?.split("?")[0],
    //         // });
    //       } else {
    //         console.error(
    //           "File upload failed:",
    //           responseUpload.status,
    //           responseUpload.statusText
    //         );
    //         setFileLoader(false);
    //       }
    //     } catch (error) {
    //       setFileLoader(false);
    //       console.error("Error at file loading", error);
    //     }
    //   }
    // }
    // };
    const handleSkip = () => {
        // dispatch(setUserFormPage(userFormPage + 1));
        if (user?.role === "ADMIN") {
            window.location.href = "/dashboardLeads";
        }
        else {
            window.location.href = "/referrals";
        }
        localStorage.setItem("loggedIn", "true");
    };
    // const googleLogin = async () => {
    //   try {
    //     const googleProviderWithPrompt = new GoogleAuthProvider();
    //     googleProviderWithPrompt.setCustomParameters({
    //       prompt: "select_account",
    //     });
    //     const result = await signInWithPopup(auth, googleProviderWithPrompt);
    //     const user = result.user;
    //     // Get the ID token using getIdToken method
    //     const idTokenResult = await user.getIdToken(true);
    //     const accessToken = idTokenResult;
    //     localStorage.setItem("accessToken", accessToken);
    //     localStorage.setItem("userId", user?.uid);
    //     await message.warning("Your are being redirected, please wait...");
    //     await dispatch(getUserByIdParam(user?.uid)).then((res) => {
    //       if (res?.payload?.success === true) {
    //         localStorage.setItem("loggedIn", "true");
    //         window.location.href = `/`;
    //         message.success("Logged in successfully");
    //       } else {
    //         const payloadToAddUser = {
    //           email: email,
    //           userId: user.uid,
    //           isVarified: user.emailVerified,
    //           emailVerified: user.emailVerified,
    //           isActive: true,
    //           accessToken: accessToken,
    //           fcmWebToken: null,
    //           fcmAndroidToken: null,
    //           role: "ADMIN",
    //           organizationId: null,
    //         };
    //         dispatch(addUser(payloadToAddUser));
    //         setAccessToken(accessToken);
    //         setUserId(user.uid);
    //         dispatch(setUserFormPage(2));
    //         dispatch(fetchAllPlans());
    //       }
    //     });
    //   } catch (err) {
    //     message.error("Login failed");
    //   }
    // };
    const checkEmailVerifiedAutomatically = async () => {
        const isEmailVerified = await checkEmailVerified();
        if (isEmailVerified) {
            message.success("Your email has been verified successfully");
            setTimeout(async () => {
                await dispatch(setUserFormPage(userFormPage + 1));
                await dispatch(fetchAllPlans());
            }, 2000);
        }
        else {
            console.log("Your account has been created. Please verify your email to continue signing in!");
        }
    };
    useEffect(() => {
        if (userFormPage === 1) {
            const intervalId = setInterval(() => {
                checkEmailVerifiedAutomatically();
                // Your code here
            }, 7000); // 3 seconds
            // Clean up the interval when the component unmounts
            return () => clearInterval(intervalId);
        }
    }, [userFormPage]);
    const handleSubmit = async () => {
        if (userFormPage === 0) {
            signUpHandler();
        }
        else if (userFormPage === 1) {
            const isEmailVerified = await checkEmailVerified();
            if (isEmailVerified) {
                await dispatch(setUserFormPage(userFormPage + 1));
                await dispatch(fetchAllPlans());
            }
            else {
                message.warning("Your account has been created. Please verify your email to continue signing in!");
            }
        }
        else if (userFormPage === 2) {
            await dispatch(setUserFormPage(userFormPage + 1));
        }
        else if (userFormPage === 4) {
            await dispatch(inviteTeammates({
                invites: invitePayload,
                hostUserId: userId ? userId : userIdFromLocal,
            }))
                .then(() => {
                message.success("Invite sent successfully");
                setTimeout(() => {
                    localStorage.setItem("loggedIn", "true");
                    if (user?.role === "ADMIN") {
                        window.location.href = "/dashboardLeads";
                    }
                    else {
                        window.location.href = "/referrals";
                    }
                }, 2000);
            })
                .catch((err) => console.error(err));
        }
        else if (userFormPage === 5) {
            window.location.href = "/login";
        }
        else {
            await dispatch(setUserFormPage(userFormPage + 1));
        }
    };
    // const handleCheckInvitation = async () => {
    //   const organizationId = localStorage.getItem("organizationId");
    //   const userEmail = localStorage.getItem("email");
    //   if (organizationId && userEmail) {
    //     const res = await dispatch(
    //       checkInvitationValidity({ organizationId, userEmail })
    //     );
    //     if(res.meta.requestStatus === 'fulfilled'){
    //       // if(res.payload.code){
    //       // }
    //     }
    //   }
    // };
    const handleSubmitSPSM = async () => {
        if (userFormPage === 0) {
            console.log("in handleSubmitSPSM");
            // handleCheckInvitation();
            signUpHandler();
        }
        else if (userFormPage === 1) {
            console.log("in userFormPage 1");
            const isEmailVerified = await checkEmailVerified();
            if (isEmailVerified) {
                await dispatch(setUserFormPage(userFormPage + 1));
            }
            else {
                message.warning("Your account has been created. Please verify your email to continue signing in!");
            }
        }
        else if (userFormPage === 2) {
            console.log("in userFormPage 2");
            if (!loader) {
                if (window.location.href.includes("NOTADMIN")) {
                    console.log("window NOTADMIN");
                    await dispatch(updateUserByUserIdExceptAdmin({
                        ...user,
                        email: userOnboardStatusData?.email,
                        company: userOnboardStatusData?.companyName,
                        role: userOnboardStatusData?.role,
                        organizationId: userOnboardStatusData?.organizationId,
                        organisation: userOnboardStatusData?.organizationId,
                        emailVerified: true,
                    }));
                }
                else {
                    console.log("window...");
                    await dispatch(updateUserByUserIdExceptAdmin({
                        ...user,
                        email: queryParams?.email,
                        company: queryParams?.company,
                        role: queryParams?.role,
                        organizationId: queryParams?.organizationId,
                        emailVerified: true,
                        organisation: queryParams?.organizationId,
                    }));
                }
            }
        }
        else {
            await dispatch(setUserFormPage(userFormPage + 1));
        }
    };
    const signUpHandler = async () => {
        if (!recaptchaToken) {
            message.warning("Please verify the reCAPTCHA!");
        }
        else {
            setLoader(true);
            try {
                const response = await axios.post(`${baseUrl}superAdmin/verifyCaptcha`, { token: recaptchaToken });
                if (response.status === 200) {
                    const auth = getAuth();
                    // Check if the email is already registered
                    try {
                        const signInMethods = await fetchSignInMethodsForEmail(auth, email);
                        console.log("sign in methods: at signin" + signInMethods);
                        if (signInMethods.length > 0) {
                            // Email already exists
                            message.warning("This account has already been created. Please sign in to continue.");
                            setLoader(false);
                            return;
                        }
                    }
                    catch (error) {
                        console.error("Error checking email existence:", error);
                        setLoader(false);
                        return;
                    }
                    // Proceed with sign-up
                    createUserWithEmailAndPassword(auth, email, password)
                        .then(async (dataValue) => {
                        const payloadToAddUser = {
                            email: email,
                            userId: dataValue.user.uid,
                            isVarified: dataValue.user.emailVerified,
                            emailVerified: dataValue.user.emailVerified,
                            isActive: true,
                            accessToken: dataValue?.user?.accessToken,
                            fcmWebToken: null,
                            fcmAndroidToken: null,
                            role: queryParams?.role ? queryParams?.role : "ADMIN",
                            organizationId: null,
                            currency: user?.currency,
                        };
                        dispatch(addUser(payloadToAddUser));
                        localStorage.setItem("accessToken", dataValue?.user?.accessToken);
                        localStorage.setItem("userId", dataValue.user.uid);
                        localStorage.setItem("email", email);
                        setAccessToken(dataValue?.user?.accessToken);
                        setUserId(dataValue.user.uid);
                        // Update auth currentUser context
                        await auth.updateCurrentUser(dataValue.user);
                        // Wait for the auth state to change to the new user
                        await new Promise((resolve) => {
                            onAuthStateChanged(auth, (user) => {
                                if (user && user.uid === dataValue.user.uid) {
                                    resolve(user);
                                }
                            });
                        });
                        // Check if the user's email is verified
                        const isEmailVerified = await checkEmailVerified();
                        if (isEmailVerified) {
                            dispatch(setUserFormPage(userFormPage + 1));
                        }
                        else {
                            setLoader(false);
                        }
                        // Send email verification
                        sendEmailVerification(auth.currentUser)
                            .then((response) => {
                            message.success("Verification link has been sent to your email. Please verify your email.");
                            setLoader(false);
                            dispatch(setUserFormPage(userFormPage + 1));
                            console.log("res", response);
                        })
                            .catch(async () => {
                            setLoader(false);
                            const isEmailVerified = await checkEmailVerified();
                            if (isEmailVerified) {
                                dispatch(setUserFormPage(userFormPage + 1));
                            }
                            else {
                                message.warning("Your account has been created. Please verify your email to continue signing in!");
                            }
                            console.log("Error at catch");
                        });
                    })
                        .catch(async (error) => {
                        setLoader(false);
                        console.error("Sign-up error:", error);
                        message.warning("This account has already been created, please sign in to continue");
                        // dispatch(setUserFormPage(userFormPage + 1));
                    });
                }
                else {
                    message.warning("reCaptcha not verified!");
                    setLoader(false);
                }
            }
            catch (e) {
                message.warning("reCaptcha not verified!");
                setLoader(false);
            }
        }
    };
    const handleInputChange = (e) => {
        dispatch(handleInputChangeReducerAuth({
            [e.target.name]: e.target.value,
        }));
    };
    const handleSelectChangeAuth = (value, name) => {
        dispatch(handleInputChangeReducerAuth({
            [name]: value,
        }));
    };
    const handleSelectChangeOrganisation = (name, value) => {
        if (name === "industry" && value === "") {
            setIsOtherIndutry(true);
        }
        else if (name === "industry" && value !== "") {
            setIsOtherIndutry(false);
            dispatch(handleInputChangeReducerOrganisation({
                [name]: value,
            }));
        }
        else {
            dispatch(handleInputChangeReducerOrganisation({
                [name]: value,
            }));
        }
    };
    console.log("org input changed", organisation);
    const handleInputChangeOrganisation = (e) => {
        const { name, value } = e.target;
        dispatch(handleInputChangeReducerOrganisation({
            [name]: value,
        }));
    };
    // Function to check if the current user's email is verified
    const checkEmailVerified = async () => {
        const auth = getAuth();
        const currentUser = auth.currentUser;
        if (currentUser) {
            try {
                // Reload the current user's data
                await currentUser.reload();
                // Check if the email is verified
                const emailVerified = currentUser.emailVerified;
                return emailVerified;
            }
            catch (error) {
                console.error("Error reloading user data: firebase", error);
                return false;
            }
        }
        else {
            console.error("No user is currently signed in. firebase");
            return false;
        }
    };
    useEffect(() => {
        // if (queryParams) {
        dispatch(handleInputChangeReducerAuth({
            email: queryParams?.email,
            role: queryParams?.role,
            organizationId: queryParams?.organizationId,
            company: queryParams?.company,
        }));
        setEmail(queryParams?.email || email);
        // }
    }, [dispatch, queryParams]);
    const handleBackRedirect = () => {
        if (userFormPage > 0) {
            dispatch(setUserFormPage(userFormPage - 1));
        }
    };
    const handleBackToLogin = () => {
        window.location.href = "https://clicentrix.com/cxonego";
    };
    const customDot = (dot, { status, index }) => (_jsx(Popover, { content: _jsxs("span", { children: ["step ", index + 1, " : ", status] }), children: dot }));
    const handleContactAdmin = async () => {
        await dispatch(createRequestContactAdmin(contactAdminPayload));
        await dispatch(setUserFormPage(5));
    };
    if (queryParams?.role === null &&
        !window.location.href.includes("NOTADMIN")) {
        return (_jsxs("div", { className: "loginBackWrapper", children: [_jsx("div", { className: "loginTopDiv", children: userFormPage === 0 ? (_jsxs(_Fragment, { children: [" ", _jsx("img", { src: CX_ONE_GO_LOGO, alt: "logo-image" }), " "] })) : (_jsxs(_Fragment, { children: [_jsx(LeftOutlined, { onClick: handleBackRedirect }), _jsx("img", { src: CX_ONE_GO_LOGO, alt: "logo-image" })] })) }), userFormPage === 0 ? (_jsx(_Fragment, { children: _jsx(Form, { form: signInForm, name: "loginForm", className: "inviteForm", initialValues: user, onFinish: handleSubmit, children: _jsxs("div", { className: "signupMain", children: [_jsxs("div", { className: "loginMiddleDiv", children: [_jsx("div", { className: "loginHeading", children: "Welcome to CXOneGo" }), _jsxs("div", { className: "loginSubHeading", children: ["Customer relationship management for teams and individuals", " "] }), _jsxs("div", { className: "loginMidContainer", children: [_jsx(Form.Item, { name: "email", label: "Email", className: "loginFormInput", rules: [
                                                        {
                                                            type: "email",
                                                            message: "The input is not valid E-mail!",
                                                        },
                                                        {
                                                            required: true,
                                                            message: "Please input your E-mail!",
                                                        },
                                                    ], children: _jsx(Input, { onChange: (e) => {
                                                            setEmail(e.target.value);
                                                            dispatch(handleInputChangeReducerAuth({
                                                                email: e.target.value,
                                                            }));
                                                        }, 
                                                        // name="email"
                                                        placeholder: "Enter Email Id" }) }), _jsx(Form.Item, { className: "loginFormInput", label: "Password", name: "password", rules: [
                                                        {
                                                            required: true,
                                                            message: "This field is mandatory !",
                                                        },
                                                    ], children: _jsx(Input.Password, { onChange: (e) => {
                                                            setPassword(e.target.value);
                                                            dispatch(handleInputChangeReducerAuth({
                                                                password: e.target.value,
                                                            }));
                                                        }, type: "password", name: "password", placeholder: "Enter password", value: password, iconRender: (visible) => visible ? _jsx(EyeTwoTone, {}) : _jsx(EyeInvisibleOutlined, {}) }) }), signInForm.getFieldValue("password")?.length > 0 ? (_jsxs("div", { className: "passwordValidationError", style: { color: "#fff" }, children: [_jsx("span", { className: "resetErrorHeading", children: "Password must include" }), _jsx("span", { style: { color: "red" }, children: getPasswordValidityIcons(signInForm.getFieldValue("password")) })] })) : null, _jsx(Form.Item, { style: { marginBottom: "20px" }, name: "confirmPassword", label: "Confirm Password", className: "loginFormInput", dependencies: ["password"], hasFeedback: true, rules: [
                                                        {
                                                            required: true,
                                                            message: "This field is mandatory !",
                                                        },
                                                        ({ getFieldValue }) => ({
                                                            validator(_, value) {
                                                                if (!value || getFieldValue("password") === value) {
                                                                    return Promise.resolve();
                                                                }
                                                                return Promise.reject(new Error("The passwords do not match"));
                                                            },
                                                        }),
                                                    ], children: _jsx(Input.Password, { placeholder: "Enter your password", type: "password", autoComplete: "off", iconRender: (visible1) => visible1 ? _jsx(EyeTwoTone, {}) : _jsx(EyeInvisibleOutlined, {}) }) }), _jsx("div", { className: "recaptchaContainer", children: _jsx(ReCAPTCHA, { sitekey: REACT_APP_RECAPTCHA_KEY, onChange: handleRecaptchaChange }) }), _jsx(Form.Item, { children: _jsx(Button, { type: "primary", htmlType: "submit", className: "loginSubmitBtn", loading: loader, children: "Continue" }) })] })] }), _jsx("div", { className: "signUpLink", children: _jsx("div", { className: "loginForgetPassLink", onClick: () => handleRedirect("login"), children: "Already have an account?" }) })] }) }) })) : userFormPage === 1 ? (_jsx(Form, { form: signInForm, name: "loginForm", className: "inviteForm", initialValues: user, onFinish: handleSubmit, children: _jsx("div", { className: "signupMain", children: _jsx("div", { className: "loginMiddleDiv", children: loading ? (_jsx(Skeleton, {})) : (_jsxs("div", { children: [_jsx("div", { className: "loginHeading", children: "You\u2019ve got an E-mail" }), _jsx("div", { className: "loginSubHeading", children: "An email has been sent to you. Click on the link to access your account." }), _jsx(Form.Item, { children: _jsx(Button, { type: "primary", htmlType: "submit", className: "userOnboardingSubmitBtn", style: { marginTop: "20px" }, loading: loader, children: "Next" }) })] })) }) }) })) : userFormPage === 2 ? (_jsx(Form, { form: pricingForm, name: "loginForm", className: "inviteForm", onFinish: handleSubmit, children: _jsxs("div", { className: "pricingMiddleDiv", children: [" ", getPlanLoader ? (_jsx(Skeleton, {})) : (_jsxs("div", { children: [_jsxs("div", { children: [_jsx("div", { className: "pricingTitle", children: "Pricing & Plans" }), _jsx("div", { className: "pricingSubTitle", children: "Explore our flexible pricing and plan options designed to meet your needs and budget." })] }), _jsxs("div", { className: "pricingInnerDiv", children: [_jsx("div", { className: "pricingBlueTag", children: plan?.planname }), _jsx("div", { className: "pricingInner2Div", children: _jsxs("div", { className: "pricingMiddleFlex", children: [_jsx("div", { className: "pricingTextDetails", children: planFeatures?.map((item, index) => {
                                                                return (_jsx(_Fragment, { children: _jsxs("div", { className: "pricingCheckAndText", children: [_jsx("img", { src: CHECK_ICON }), item] }, index) }));
                                                            }) }), _jsxs("div", { className: "pricingRateDiv", children: [_jsxs("div", { className: "pricingRateWrapper", children: ["\u20B9", " ", _jsx("span", { className: "pricingRateEmphasized", children: plan?.planamount }), " ", plan?.planType === "Trial"
                                                                            ? `For 14 days`
                                                                            : `Per user per month (billed annually)`] }), _jsxs("div", { className: "pricingSubmitBtnWrapper", children: [_jsx(Form.Item, { children: _jsx(Button, { type: "primary", htmlType: "submit", className: "subscribeBtn", loading: loader, children: "Subscribe Now" }) }), _jsx(Form.Item, { children: _jsx(Button
                                                                            // type="primary"
                                                                            // htmlType="submit"
                                                                            , { 
                                                                                // type="primary"
                                                                                // htmlType="submit"
                                                                                className: "startTrialBtn", loading: loader, onClick: async () => {
                                                                                    setPlanType("Trial");
                                                                                    await dispatch(setUserFormPage(userFormPage + 1));
                                                                                }, children: "Start 14 Days Free Trial" }) })] })] })] }) })] }), _jsxs("div", { className: "pricingInnerDiv2", children: [_jsx("div", { className: "pricingBlueTag", children: "Custom Subscription" }), _jsx("div", { className: "pricingInner2Div", children: _jsxs("div", { className: "pricingMiddleFlex", children: [_jsx("div", { className: "pricingTextDetails", children: _jsx("div", { className: "pricingCheckAndText", children: "Do you have more than 3 members?" }) }), _jsx("div", { className: "reviewRateDiv", children: _jsx(Form.Item, { children: _jsx(Button
                                                                // type="primary"
                                                                // htmlType="submit"
                                                                // className="startTrialBtn"
                                                                , { 
                                                                    // type="primary"
                                                                    // htmlType="submit"
                                                                    // className="startTrialBtn"
                                                                    loading: contactAdminLoader, className: "pricingCTA2Btn", onClick: async () => {
                                                                        setPlanType("Custom");
                                                                        await dispatch(setUserFormPage(userFormPage + 1));
                                                                    }, children: "Contact Admin" }) }) })] }) })] })] }))] }) })) : userFormPage === 3 ? (_jsx("div", { className: "pricingBackWrapper", children: _jsxs("div", { className: "pricingMiddleDiv", children: [_jsxs(Steps, { current: current, progressDot: customDot, children: [_jsx(Step, { title: "Your Details" }), _jsx(Step, { title: "Company Details" }), _jsx(Step, { title: "Confirm Details" }), _jsx(Step, { title: "Payment Summary" })] }), _jsx("div", { children: current === 0 ? (_jsx("div", { className: "loginMiddleDiv", children: _jsxs("div", { className: "width100 loginFormMarginMiddle", children: [_jsx("div", { className: "loginHeading", style: { marginBottom: "5px" }, children: "Tell us about yourself" }), _jsx("div", { className: "loginSubHeading", children: "Provide your details to get started with our services." }), _jsx("div", { className: "loginFirstContainer", children: _jsxs(Form, { form: userInfoForm, name: "loginForm", className: "inviteForm", initialValues: user, onFinish: nextStep, children: [_jsxs(Form.Item, { name: "firstName", label: "First Name", className: "loginFormInput", rules: [
                                                                {
                                                                    required: false,
                                                                    message: "This field is mandatory!",
                                                                },
                                                            ], children: [_jsx(Select, { placeholder: "Mr.", options: nameInitialTypeValuesArray, className: "selectInputNamesInitials" }), _jsx(Input, { onChange: handleInputChange, name: "firstName", type: "text", placeholder: "Enter first name" })] }), _jsx(Form.Item, { name: "lastName", label: "Last Name", className: "loginFormInput", rules: [
                                                                {
                                                                    required: true,
                                                                    message: "This field is mandatory!",
                                                                },
                                                            ], children: _jsx(Input, { onChange: handleInputChange, name: "lastName", type: "text", placeholder: "Enter last name" }) }), _jsx(Form.Item, { name: "jobTitle", label: "Your Job Title", className: "loginFormInput", rules: [
                                                                {
                                                                    required: true,
                                                                    message: "This field is mandatory!",
                                                                },
                                                            ], children: _jsx(Input, { onChange: handleInputChange, name: "jobTitle", type: "text", placeholder: "Enter job title" }) }), _jsx(Form.Item, { name: "phone", label: "Contact No.", className: "loginFormInput", rules: [
                                                                {
                                                                    required: true,
                                                                    message: "This field is mandatory!",
                                                                },
                                                                {
                                                                    pattern: /^\d*$/,
                                                                    message: "Please enter a valid phone number!",
                                                                },
                                                            ], children: _jsxs("div", { style: { display: "flex", gap: "5px" }, children: [_jsx(Select, { style: { width: "250px" }, onChange: (value) => handleSelectChangeAuth(value, "countryCode"), options: countryFlags?.map((flag) => ({
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
                                                                            .includes(input.toLowerCase()) }), _jsx(Input, { onChange: handleInputChange, name: "phone", type: "tel", placeholder: "Please enter here" })] }) }), _jsx(Form.Item, { name: "currency", label: "Currency", className: "loginFormInput", rules: [
                                                                {
                                                                    required: true,
                                                                    message: "This field is mandatory!",
                                                                },
                                                            ], children: _jsx(Select, { onChange: (value) => handleSelectChangeAuth(value, "currency"), placeholder: "Select currency", options: currencyOptions }) }), _jsx("div", { className: "themeColorDiv" }), _jsx(Form.Item, { children: _jsx(Button, { type: "primary", htmlType: "submit", className: "userOnboardingSubmitBtn", style: { marginTop: "20px" }, loading: loading, children: "Next" }) })] }) })] }) })) : current === 1 ? (_jsx(Form, { form: orgInfoForm, name: "loginForm", className: "inviteForm", onFinish: nextStep, children: _jsx("div", { className: "loginMiddleDiv", children: _jsxs("div", { className: "loginFormMarginMiddle", children: [_jsx("div", { className: "loginHeading", style: { marginBottom: "5px" }, children: "Tell us about your Organization" }), _jsx("div", { className: "loginSubHeading", children: "Share key information about your company." }), _jsxs("div", { className: "loginFirstContainer", children: [_jsx(Form.Item, { name: "name", label: "Name", className: "loginFormInput", rules: [
                                                                {
                                                                    required: true,
                                                                    message: "This field is mandatory!",
                                                                },
                                                            ], children: _jsx(Input, { onChange: handleInputChangeOrganisation, name: "name", type: "text", placeholder: "Enter company name" }) }), _jsx(Tooltip, { title: "If your industry is not one of the shown in the dropdown, select “Other” and then enter your industry in the field", children: _jsx(Form.Item, { name: "industry", label: "Industry", className: "loginFormInput", rules: [
                                                                    {
                                                                        required: true,
                                                                        message: "This field is mandatory!",
                                                                    },
                                                                ], children: isOtherIndutry ? (_jsx(Input, { onChange: handleInputChangeOrganisation, name: "industry", placeholder: "Enter industry type here" })) : (_jsx(Select, { onChange: (value) => handleSelectChangeOrganisation("industry", value), placeholder: "select your industry", options: industryTypeValuesArray })) }) }), _jsx(Form.Item, { name: "country", label: "Country", className: "loginFormInput", rules: [
                                                                {
                                                                    required: true,
                                                                    message: "This field is mandatory!",
                                                                },
                                                            ], children: _jsx(Select, { onChange: (value) => handleSelectChangeOrganisation("country", value), options: countryNames, showSearch: true }) }), organisation?.country === "India" ? (_jsx(Form.Item, { name: "state", label: "State", className: "loginFormInput", rules: [
                                                                {
                                                                    required: true,
                                                                    message: "This field is mandatory!",
                                                                },
                                                            ], children: _jsx(Select, { onChange: (value) => handleSelectChangeOrganisation("state", value), options: stateNames, showSearch: true }) })) : (_jsx(Form.Item, { name: "state", label: "State", className: "loginFormInput", rules: [
                                                                {
                                                                    required: true,
                                                                    message: "This field is mandatory!",
                                                                },
                                                            ], children: _jsx(Input, { onChange: handleInputChangeOrganisation, name: "state", type: "text", placeholder: "Enter your state" }) })), _jsx(Form.Item, { name: "city", label: "City", className: "loginFormInput", rules: [
                                                                {
                                                                    required: true,
                                                                    message: "This field is mandatory!",
                                                                },
                                                            ], children: _jsx(Input, { onChange: handleInputChangeOrganisation, name: "city", type: "text", placeholder: "Enter your city" }) }), _jsx(Form.Item, { children: _jsx(Button, { type: "primary", htmlType: "submit", className: "userOnboardingSubmitBtn", style: { marginTop: "20px" }, loading: loading || addOrganisationLoader, children: "Next" }) })] })] }) }) })) : current === 2 ? (_jsxs("div", { className: "reviewWrapper", children: [_jsxs("div", { children: [_jsx("div", { className: "reviewTitle", children: "Review & Confirm Details" }), _jsx("div", { className: "reviewSubTitle", children: "Verify your information to ensure accuracy before proceeding." })] }), planType === "Custom" ? (_jsxs("div", { className: "reviewInnerDiv2", children: [_jsx("div", { className: "reviewBlueTag", children: "Custom Subscription" }), _jsx("div", { className: "reviewInner2Div", children: _jsxs("div", { className: "reviewMiddleFlex2", children: [_jsx("div", { className: "pricingCheckAndText2", children: "You have chosen custom subscription plan, your request will be sent to our administrator. Click this button to confirm." }), _jsx("div", { className: "reviewRateDiv", children: _jsx(Button, { className: "contactAdminSubmitButton", onClick: handleContactAdmin, loading: paymentLoader, children: "Contact Admin" }) })] }) })] })) : (_jsxs("div", { className: "reviewInnerDiv", children: [_jsx("div", { className: "reviewBlueTag", children: plan?.planname }), _jsx("div", { className: "reviewInner2Div", children: _jsxs("div", { className: "reviewMiddleFlex", children: [_jsx("div", { className: "reviewTextDetails", children: planFeatures?.map((item, index) => {
                                                                    return (_jsx(_Fragment, { children: _jsxs("div", { className: "pricingCheckAndText", children: [_jsx("img", { src: CHECK_ICON }), item] }, index) }));
                                                                }) }), _jsxs("div", { className: "reviewRateDiv", children: [_jsxs("div", { className: "reviewRateWrapper", children: ["\u20B9", " ", _jsx("span", { className: "reviewRateEmphasized", children: plan?.planamount }), " ", plan?.planType === "Trial" ? (`For 14 days`) : (_jsxs("span", { children: ["Per user per month (billed annually)", _jsxs("span", { style: { fontSize: "12px" }, children: [" ", "+ 18% GST"] })] }))] }), _jsx(Button, { className: "makePaymentButton", htmlType: "submit", onClick: nextStep, loading: paymentLoader, children: "Make Payment" })] })] }) })] })), _jsxs("div", { className: "reviewDisclaimer", children: [" ", _jsx("b", { children: "Disclaimer : " }), "Payment process is managed by third party application Razor pay and We do not store any of your payment details such as Credit card, Bank, UPI details. We store only payment transaction details for future reference."] }), planType === "Custom" ? (_jsx(_Fragment, {})) : (_jsxs("div", { className: "reviewTextDiv", children: [_jsx("div", { className: "reviewText", children: planType === "Trial"
                                                        ? "Switch from 14 days free trial to annual plan?"
                                                        : "Switch from annual plan to 14 days free trial?" }), _jsx(Button, { className: "reviewBtn", onClick: async () => {
                                                        setPlanType(planType === "Trial" ? "Subscription" : "Trial");
                                                    }, children: planType === "Trial"
                                                        ? "Try annual plan?"
                                                        : "Try 14 Days free trial?" })] }))] })) : current === 3 ? (paymentStatus ? (_jsxs("div", { className: "pricingSubWrapper", children: [_jsx("div", { className: "pricingTitle", children: "Subscription purchased successfully!" }), _jsxs("div", { className: "pricingSubTitle", children: ["Here is your Razorpay transaction id :", " ", _jsx("b", { children: paymentTrasactionId })] }), _jsx("div", { className: "pricingPaymentGifWrapper", children: _jsx("img", { src: PAYMENT_SUCCESS_GIF, alt: "gif" }) }), _jsxs("div", { className: "summaryBottomDiv", children: [_jsx("div", { children: "Thank you for subscribing! Get ready for exclusive experience." }), _jsx(Button, { className: "subscribeBtn", onClick: nextStep, children: "Continue" })] })] })) : (_jsxs("div", { className: "pricingSubWrapper", children: [_jsx("div", { className: "pricingTitlefailed", children: "Payment Failed" }), _jsx("div", { className: "pricingPaymentGifWrapperFail", children: _jsx("img", { src: PAYMENT_FAILURE_GIF, alt: "gif" }) }), _jsxs("div", { className: "summaryBottomDiv", children: [_jsx("div", { children: "Oops! Something went wrong with your payment. Please check your details and try again." }), _jsx(Button, { className: "subscribeBtn", onClick: nextStep, children: "Try Again" })] })] }))) : null })] }) })) : userFormPage === 4 ? (_jsx("div", { className: "loginMiddleDiv signupMain", children: _jsxs(Form, { name: "loginForm", className: "inviteForm", onFinish: handleSubmit, initialValues: member, form: inviteTeamForm, children: [_jsx("div", { className: "loginHeading", children: "Invite your teammates" }), _jsxs("div", { className: "loginMidContainer", children: [_jsx(Form.Item, { name: "email", label: "Email", className: "loginFormInput", rules: [
                                            {
                                                type: "email",
                                                message: "The input is not valid E-mail!",
                                            },
                                        ], children: _jsx(Input, { onChange: handleInputChangeInvite, placeholder: "Enter Teammate's email address", name: "email" }) }), _jsx(Form.Item, { name: "role", label: "Assign User's Role", className: "loginFormInput", children: _jsx(Select, { onChange: (value) => setMember({
                                                ...member,
                                                role: value,
                                            }), placeholder: "Select role", options: userRoleTypeValuesArray }) }), _jsx(Form.Item, { children: _jsx(Button, { type: "primary", 
                                            // htmlType="submit"
                                            className: "inviteSubmitBtn", style: { marginTop: "20px" }, onClick: handleAddMember, disabled: invitePayload?.length === 2, children: "Add Member" }) }), _jsx("div", { className: "inviteesWrapper", children: invitePayload?.length > 0
                                            ? invitePayload?.map((item, index) => {
                                                return (_jsx(_Fragment, { children: _jsxs("div", { className: "inviteSelectedPeopleWrapper", children: [_jsxs("div", { className: "inviteSelectedPeopleInnerWrapper", children: [_jsx(Avatar, { src: PROFILE_PIC, className: "inviteSelectedPeopleAvatar", children: "RW" }), _jsx("div", { className: "inviteSelectedPeopleEmail", children: item?.email })] }), _jsx("div", { className: "inviteSelectedPeopleRole", children: item?.role })] }, index) }));
                                            })
                                            : null })] }), _jsxs("div", { className: "inviteBtnsWrapper", children: [_jsx(Form.Item, { children: _jsx(Button, { type: "primary", className: "inviteSkipBtn", style: { color: "var(--gray3)" }, onClick: handleSkip, children: "Skip" }) }), _jsx(Form.Item, { children: _jsx(Button, { type: "primary", htmlType: "submit", className: "inviteSendBtn", loading: inviteTeamMatesLoader, style: {
                                                color: "#fff",
                                                backgroundColor: "var(--orange-color)",
                                                borderRadius: "5px",
                                                border: "1px solid var(--orange-color)",
                                            }, disabled: invitePayload?.length === 0, children: "Send Invitation" }) })] })] }) })) : userFormPage === 5 ? (_jsxs("div", { className: "signupMain", children: [_jsx("div", { className: "loginHeading", children: "Request Sent Successfully" }), _jsx("div", { className: "loginSubHeading", style: { marginTop: "20px" }, children: "Thank You for your details, someone from our team will contact you shortly" }), _jsx(Form.Item, { children: _jsx(Button, { type: "primary", htmlType: "submit", className: "userOnboardingSubmitBtn", style: { marginTop: "20px" }, onClick: () => handleBackToLogin(), children: "Back to Home Page" }) })] })) : null] }));
    }
    else if (window.location.href?.includes("&role==NOTADMIN")) {
        return (_jsxs(_Fragment, { children: [" ", _jsxs("div", { className: "loginBackWrapper", children: [_jsx("div", { className: "loginTopDiv", children: userFormPage === 0 ? (_jsxs(_Fragment, { children: [" ", _jsx("img", { src: CX_ONE_GO_LOGO, alt: "logo-image" }), " "] })) : (_jsxs(_Fragment, { children: [_jsx(LeftOutlined, { onClick: handleBackRedirect }), _jsx("img", { src: CX_ONE_GO_LOGO, alt: "logo-image" })] })) }), _jsx("div", { className: "signupMain", children: _jsx(Form, { form: signInForm, name: "loginForm", className: "inviteForm", initialValues: user, onFinish: handleSubmitSPSM, children: userFormPage === 0 ? (_jsxs(_Fragment, { children: [_jsxs("div", { className: "loginMiddleDiv", children: [_jsx("div", { className: "loginHeading", children: "Welcome to CXOneGo" }), _jsxs("div", { className: "loginSubHeading", children: ["Customer relationship management for teams and individuals", " "] }), _jsxs("div", { className: "loginMidContainer", children: [_jsx("hr", { className: "loginHr" }), _jsx(Form.Item
                                                        // name="email"
                                                        , { 
                                                            // name="email"
                                                            label: "Email", className: "loginFormInput", rules: [
                                                                {
                                                                    type: "email",
                                                                    message: "The input is not valid E-mail!",
                                                                },
                                                                {
                                                                    required: true,
                                                                    message: "Please input your E-mail!",
                                                                },
                                                            ], children: _jsx(Input, { onChange: (e) => {
                                                                    setEmail(e.target.value);
                                                                    dispatch(handleInputChangeReducerAuth({
                                                                        email: e.target.value,
                                                                    }));
                                                                }, 
                                                                // name="email"
                                                                placeholder: "Enter Email Id", value: queryParams?.email ? queryParams.email : email }) }), _jsx(Form.Item, { className: "loginFormInput", label: "Password", name: "password", rules: [
                                                                {
                                                                    required: true,
                                                                    message: "This field is mandatory !",
                                                                },
                                                            ], children: _jsx(Input.Password, { onChange: (e) => {
                                                                    setPassword(e.target.value);
                                                                    dispatch(handleInputChangeReducerAuth({
                                                                        password: e.target.value,
                                                                    }));
                                                                }, type: "password", name: "password", placeholder: "Enter password", value: password, iconRender: (visible) => visible ? _jsx(EyeTwoTone, {}) : _jsx(EyeInvisibleOutlined, {}) }) }), signInForm.getFieldValue("password")?.length > 0 ? (_jsxs("div", { className: "passwordValidationError", style: { color: "#fff" }, children: [_jsx("span", { className: "resetErrorHeading", children: "Password must include" }), _jsx("span", { style: { color: "red" }, children: getPasswordValidityIcons(signInForm.getFieldValue("password")) })] })) : null, _jsx(Form.Item, { style: { marginBottom: "20px" }, name: "confirmPassword", label: "Confirm Password", className: "loginFormInput", dependencies: ["password"], hasFeedback: true, rules: [
                                                                {
                                                                    required: true,
                                                                    message: "This field is mandatory !",
                                                                },
                                                                ({ getFieldValue }) => ({
                                                                    validator(_, value) {
                                                                        if (!value ||
                                                                            getFieldValue("password") === value) {
                                                                            return Promise.resolve();
                                                                        }
                                                                        return Promise.reject(new Error("The passwords do not match"));
                                                                    },
                                                                }),
                                                            ], children: _jsx(Input.Password, { placeholder: "Enter your password", type: "password", autoComplete: "off", iconRender: (visible1) => visible1 ? _jsx(EyeTwoTone, {}) : _jsx(EyeInvisibleOutlined, {}) }) }), _jsx("div", { className: "recaptchaContainer", children: _jsx(ReCAPTCHA, { sitekey: REACT_APP_RECAPTCHA_KEY, onChange: handleRecaptchaChange }) }), _jsx(Form.Item, { children: _jsx(Button, { type: "primary", htmlType: "submit", className: "loginSubmitBtn", loading: loader, children: "Continue" }) })] })] }), _jsx("div", { className: "signUpLink", children: _jsx("div", { className: "loginForgetPassLink", onClick: () => handleRedirect("login"), children: "Already have an account?" }) })] })) : userFormPage === 1 ? (_jsx("div", { className: "loginMiddleDiv", children: loading ? (_jsx(Skeleton, {})) : (_jsxs("div", { children: [_jsx("div", { className: "loginHeading", children: "You\u2019ve got an E-mail" }), _jsx("div", { className: "loginSubHeading", children: "An email has been sent to you. Click on the link to access your account." }), _jsx(Form.Item, { children: _jsx(Button, { type: "primary", htmlType: "submit", className: "userOnboardingSubmitBtn", style: { marginTop: "20px" }, loading: loader, children: "Next" }) })] })) })) : userFormPage === 2 ? (_jsx("div", { className: "loginMiddleDiv", children: _jsxs("div", { className: "width100", children: [_jsx("div", { className: "loginHeading", style: { marginBottom: "5px" }, children: "Tell us about yourself" }), _jsx("div", { className: "loginSubHeading", children: "Provide your details to get started with our services." }), _jsxs("div", { className: "loginFirstContainer", children: [_jsxs(Form.Item, { name: "firstName", label: "First Name", className: "loginFormInput", rules: [
                                                            {
                                                                required: false,
                                                                message: "This field is mandatory!",
                                                            },
                                                        ], children: [_jsx(Select, { placeholder: "Mr.", options: nameInitialTypeValuesArray, className: "selectInputNamesInitials" }), _jsx(Input, { onChange: handleInputChange, name: "firstName", type: "text", placeholder: "Enter first name" })] }), _jsx(Form.Item, { name: "lastName", label: "Last Name", className: "loginFormInput", rules: [
                                                            {
                                                                required: true,
                                                                message: "This field is mandatory!",
                                                            },
                                                        ], children: _jsx(Input, { onChange: handleInputChange, name: "lastName", type: "text", placeholder: "Enter last name" }) }), _jsx(Form.Item, { name: "jobTitle", label: "Your Job Title", className: "loginFormInput", rules: [
                                                            {
                                                                required: true,
                                                                message: "This field is mandatory!",
                                                            },
                                                        ], children: _jsx(Input, { onChange: handleInputChange, name: "jobTitle", type: "text", placeholder: "Enter job title" }) }), _jsx(Form.Item, { name: "phone", label: "Contact No.", className: "loginFormInput", rules: [
                                                            {
                                                                required: true,
                                                                message: "This field is mandatory!",
                                                            },
                                                            {
                                                                pattern: /^\d*$/,
                                                                message: "Please enter a valid phone number!",
                                                            },
                                                        ], children: _jsxs("div", { style: { display: "flex", gap: "5px" }, children: [_jsx(Select, { style: { width: "250px" }, onChange: (value) => handleSelectChangeAuth(value, "countryCode"), options: countryFlags?.map((flag) => ({
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
                                                                        .includes(input.toLowerCase()) }), _jsx(Input, { onChange: handleInputChange, name: "phone", type: "tel", placeholder: "Please enter here" })] }) }), _jsx(Form.Item, { name: "currency", label: "Currency", className: "loginFormInput", rules: [
                                                            {
                                                                required: true,
                                                                message: "This field is mandatory!",
                                                            },
                                                        ], children: _jsx(Select, { onChange: (value) => handleSelectChangeAuth(value, "currency"), placeholder: "Select currency", options: currencyOptions }) }), _jsx("div", { className: "themeColorDiv" }), _jsx(Form.Item, { children: _jsx(Button, { type: "primary", htmlType: "submit", className: "userOnboardingSubmitBtn", style: { marginTop: "20px" }, loading: loading, children: "Next" }) })] })] }) })) : null }) })] })] }));
    }
    else {
        return (_jsxs(_Fragment, { children: [" ", _jsxs("div", { className: "loginBackWrapper", children: [_jsx("div", { className: "loginTopDiv", children: userFormPage === 0 ? (_jsxs(_Fragment, { children: [" ", _jsx("img", { src: CX_ONE_GO_LOGO, alt: "logo-image" }), " "] })) : (_jsxs(_Fragment, { children: [_jsx(LeftOutlined, { onClick: handleBackRedirect }), _jsx("img", { src: CX_ONE_GO_LOGO, alt: "logo-image" })] })) }), _jsx("div", { className: "signupMain", children: _jsx(Form, { form: signInForm, name: "loginForm", className: "inviteForm", initialValues: user, onFinish: handleSubmitSPSM, children: userFormPage === 0 ? (_jsxs(_Fragment, { children: [_jsxs("div", { className: "loginMiddleDiv", children: [_jsx("div", { className: "loginHeading", children: "Welcome to CXOneGo" }), _jsxs("div", { className: "loginSubHeading", children: ["Customer relationship management for teams and individuals", " "] }), _jsxs("div", { className: "loginMidContainer", children: [_jsx(Form.Item
                                                        // name="email"
                                                        , { 
                                                            // name="email"
                                                            label: "Email", className: "loginFormInput", rules: [
                                                                {
                                                                    type: "email",
                                                                    message: "The input is not valid E-mail!",
                                                                },
                                                                {
                                                                    required: true,
                                                                    message: "Please input your E-mail!",
                                                                },
                                                            ], children: _jsx(Input, { onChange: (e) => {
                                                                    setEmail(e.target.value);
                                                                    dispatch(handleInputChangeReducerAuth({
                                                                        email: e.target.value,
                                                                    }));
                                                                }, 
                                                                // name="email"
                                                                placeholder: "Enter Email Id", value: queryParams?.email ? queryParams.email : email }) }), _jsx(Form.Item, { className: "loginFormInput", label: "Password", name: "password", rules: [
                                                                {
                                                                    required: true,
                                                                    message: "This field is mandatory !",
                                                                },
                                                            ], children: _jsx(Input.Password, { onChange: (e) => {
                                                                    setPassword(e.target.value);
                                                                    dispatch(handleInputChangeReducerAuth({
                                                                        password: e.target.value,
                                                                    }));
                                                                }, type: "password", name: "password", placeholder: "Enter password", value: password, iconRender: (visible) => visible ? _jsx(EyeTwoTone, {}) : _jsx(EyeInvisibleOutlined, {}) }) }), signInForm.getFieldValue("password")?.length > 0 ? (_jsxs("div", { className: "passwordValidationError", style: { color: "#fff" }, children: [_jsx("span", { className: "resetErrorHeading", children: "Password must include" }), _jsx("span", { style: { color: "red" }, children: getPasswordValidityIcons(signInForm.getFieldValue("password")) })] })) : null, _jsx(Form.Item, { style: { marginBottom: "20px" }, name: "confirmPassword", label: "Confirm Password", className: "loginFormInput", dependencies: ["password"], hasFeedback: true, rules: [
                                                                {
                                                                    required: true,
                                                                    message: "This field is mandatory !",
                                                                },
                                                                ({ getFieldValue }) => ({
                                                                    validator(_, value) {
                                                                        if (!value ||
                                                                            getFieldValue("password") === value) {
                                                                            return Promise.resolve();
                                                                        }
                                                                        return Promise.reject(new Error("The passwords do not match"));
                                                                    },
                                                                }),
                                                            ], children: _jsx(Input.Password, { placeholder: "Enter your password", type: "password", autoComplete: "off", iconRender: (visible1) => visible1 ? _jsx(EyeTwoTone, {}) : _jsx(EyeInvisibleOutlined, {}) }) }), _jsx("div", { className: "recaptchaContainer", children: _jsx(ReCAPTCHA, { sitekey: REACT_APP_RECAPTCHA_KEY, onChange: handleRecaptchaChange }) }), _jsx(Form.Item, { children: _jsx(Button, { type: "primary", htmlType: "submit", className: "loginSubmitBtn", loading: loader, children: "Continue" }) })] })] }), _jsx("div", { className: "signUpLink", children: _jsx("div", { className: "loginForgetPassLink", onClick: () => handleRedirect("login"), children: "Already have an account?" }) })] })) : userFormPage === 1 ? (_jsx("div", { className: "loginMiddleDiv", children: loading ? (_jsx(Skeleton, {})) : (_jsxs("div", { children: [_jsx("div", { className: "loginHeading", children: "You\u2019ve got an E-mail" }), _jsx("div", { className: "loginSubHeading", children: "An email has been sent to you. Click on the link to access your account." }), _jsx(Form.Item, { children: _jsx(Button, { type: "primary", htmlType: "submit", className: "userOnboardingSubmitBtn", style: { marginTop: "20px" }, loading: loader, children: "Next" }) })] })) })) : userFormPage === 2 ? (_jsx("div", { className: "loginMiddleDiv", children: _jsxs("div", { className: "width100", children: [_jsx("div", { className: "loginHeading", style: { marginBottom: "5px" }, children: "Tell us about yourself" }), _jsx("div", { className: "loginSubHeading", children: "Provide your details to get started with our services." }), _jsxs("div", { className: "loginFirstContainer", children: [_jsxs(Form.Item, { name: "firstName", label: "First Name", className: "loginFormInput", rules: [
                                                            {
                                                                required: false,
                                                                message: "This field is mandatory!",
                                                            },
                                                        ], children: [_jsx(Select, { placeholder: "Mr.", options: nameInitialTypeValuesArray, className: "selectInputNamesInitials" }), _jsx(Input, { onChange: handleInputChange, name: "firstName", type: "text", placeholder: "Enter first name" })] }), _jsx(Form.Item, { name: "lastName", label: "Last Name", className: "loginFormInput", rules: [
                                                            {
                                                                required: true,
                                                                message: "This field is mandatory!",
                                                            },
                                                        ], children: _jsx(Input, { onChange: handleInputChange, name: "lastName", type: "text", placeholder: "Enter last name" }) }), _jsx(Form.Item, { name: "jobTitle", label: "Your Job Title", className: "loginFormInput", rules: [
                                                            {
                                                                required: true,
                                                                message: "This field is mandatory!",
                                                            },
                                                        ], children: _jsx(Input, { onChange: handleInputChange, name: "jobTitle", type: "text", placeholder: "Enter job title" }) }), _jsx(Form.Item, { name: "phone", label: "Contact No.", className: "loginFormInput", rules: [
                                                            {
                                                                required: true,
                                                                message: "This field is mandatory!",
                                                            },
                                                            {
                                                                pattern: /^\d*$/,
                                                                message: "Please enter a valid phone number!",
                                                            },
                                                        ], children: _jsxs("div", { style: { display: "flex", gap: "5px" }, children: [_jsx(Select, { style: { width: "250px" }, onChange: (value) => handleSelectChangeAuth(value, "countryCode"), options: countryFlags?.map((flag) => ({
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
                                                                        .includes(input.toLowerCase()) }), _jsx(Input, { onChange: handleInputChange, name: "phone", type: "tel", placeholder: "Please enter here" })] }) }), _jsx(Form.Item, { name: "currency", label: "Currency", className: "loginFormInput", rules: [
                                                            {
                                                                required: true,
                                                                message: "This field is mandatory!",
                                                            },
                                                        ], children: _jsx(Select, { onChange: (value) => handleSelectChangeAuth(value, "currency"), placeholder: "Select currency", options: currencyOptions }) }), _jsx("div", { className: "themeColorDiv" }), _jsx(Form.Item, { children: _jsx(Button, { type: "primary", htmlType: "submit", className: "userOnboardingSubmitBtn", style: { marginTop: "20px" }, loading: loading, children: "Next" }) })] })] }) })) : null }) })] })] }));
    }
}
export default SignUpComponent;
