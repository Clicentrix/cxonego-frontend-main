import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../services/firebaseConfig";
import { message } from "antd";
import api from "../../services/axiosGlobal";
const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;
console.log("base url", baseUrl);
const userId = localStorage.getItem("userId");
const accessToken = localStorage.getItem("accessToken");
const email = localStorage.getItem("email");
function isAccessToken(str) {
    return typeof str === "string" && str !== null;
}
function isUserId(str) {
    return typeof str === "string" && str !== null;
}
function isEmailId(str) {
    return typeof str === "string" && str !== null;
}
const userIdHere = isUserId(userId) ? userId : undefined;
export const emptyUser = {
    email: isEmailId(email) ? email : null,
    firstName: "",
    lastName: "",
    password: null,
    address: null,
    otp: null,
    userId: isUserId(userId) ? userId : null,
    company: null,
    countryCode: "+91",
    phone: null,
    companyName: null,
    companySize: null,
    primaryIntension: null,
    state: null,
    city: null,
    country: null,
    theme: "#F7870E",
    currency: null,
    industry: null,
    jobTitle: null,
    isActive: true,
    emailVerified: false,
    role: null,
    organizationId: null,
    jobtitle: null,
    backgroundImageUrl: null,
    fcmWebToken: null,
    fcmAndroidToken: null,
    organisation: null,
};
export const emptySubscription = {
    createdAt: null,
    updatedAt: null,
    subscriptionId: null,
    startDateTime: null,
    endDateTime: null,
    purchaseDateTime: null,
    cancellationDateTime: null,
    subscription_status: null,
    payment_status: null,
    razorpayPaymentId: null,
    customPlanAmount: null,
    customNoOfDays: null,
    customNoOfUsers: null,
    features: null,
    planName: null,
    planAmount: null,
    noOfUsers: null,
    planType: null,
};
const initialState = {
    sendOtpLoader: false,
    loading: false,
    user: emptyUser,
    error: "",
    forgetPasswordPage: "",
    emailOrPhone: "email",
    userFormPage: 0,
    inviteTeamMatesLoader: false,
    profileRoute: false,
    updateUserLoader: false,
    getUserLoader: false,
    invitedUsers: [],
    subscription: emptySubscription,
    updateUserRoleLoader: false,
    userOnboardStatusData: emptyUser,
    onboardingStatusLoader: false,
};
export const sendForgetPasswordEmail = createAsyncThunk("authentication/sendForgetPasswordEmail", async (email) => {
    const actionCodeSettings = {
        url: "https://cxonego-frontend.vercel.app/",
        handleCodeInApp: false,
    };
    await sendPasswordResetEmail(auth, email, actionCodeSettings)
        .then((res) => {
        console.log("forget password response", res);
        message.success("Password reset link has been sent to your email.");
    })
        .catch((error) => {
        console.log("Error for sending email", error);
        message.error("Error in sending password reset email");
    });
});
export const resetPassword = createAsyncThunk("authentication/resetPassword", async (password) => {
    try {
        const payload = {
            password: password,
            confirmPassword: password,
        };
        const userIdHere = isUserId(userId) ? userId : undefined;
        const response = await axios.patch(`${baseUrl}users/${userIdHere}`, payload);
        if (response.status === 200) {
            console.log("Success", response?.data);
        }
        return response.data;
    }
    catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("ERROR", error);
            message.error("Error at resetting password");
        }
        else {
            console.error("ERROR", error);
            message.error("Error at resetting password");
        }
        // You should return a rejected Promise with the error
        throw error;
    }
});
export const getUserById = createAsyncThunk("authentication/getUserById", async () => {
    try {
        const userIdHere = isUserId(userId) ? userId : undefined;
        const config = {
            headers: {
                Authorization: `Bearer ${isAccessToken(accessToken) ? accessToken : undefined}`,
            },
        };
        // 6ba4ea16-cec2-4b26-ab29-351b3bc7e90e
        const response = await axios.get(`${baseUrl}users/${userIdHere}`, config);
        if (response.status === 200) {
            console.log("Success user fetch", response?.data);
        }
        return response.data;
    }
    catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("ERROR", error);
        }
        else {
            console.error("ERROR", error);
        }
        // You should return a rejected Promise with the error
        throw error;
    }
});
export const getUserByIdParam = createAsyncThunk("authentication/getUserByIdParam", async (userId) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${isAccessToken(accessToken) ? accessToken : undefined}`,
            },
        };
        // 6ba4ea16-cec2-4b26-ab29-351b3bc7e90e
        console.log("baseUrl", baseUrl);
        const response = await axios.get(`${baseUrl}users/${userId}`, config);
        if (response.status === 200) {
            console.log("Success user fetch", response?.data);
        }
        return response.data;
    }
    catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("ERROR", error);
        }
        else {
            console.error("ERROR", error);
        }
        // You should return a rejected Promise with the error
        throw error;
    }
});
export const addUser = createAsyncThunk("authentication/addUser", async (payload) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${payload?.accessToken ? payload?.accessToken : undefined}`,
            },
        };
        const response = await axios.post(`${baseUrl}users/`, payload, config);
        if (response.status === 200) {
            console.log("Success", response?.data);
        }
        return response.data;
    }
    catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("ERROR", error);
        }
        else {
            console.error("ERROR", error);
        }
        // You should return a rejected Promise with the error
        throw error;
    }
});
export const updateUserByUserId = createAsyncThunk("authentication/updateUserByUserId", async (payload) => {
    try {
        // Log the original payload
        console.log("Original payload:", JSON.stringify(payload, null, 2));
        // Get the organization name if available
        const organizationName = payload.organisation?.name || "";
        // Clean up the payload to match schema requirements
        const cleanPayload = {
            ...payload,
            // Use organization name as company if available, otherwise empty string
            company: payload.company || organizationName || "",
            // Other fields with fallbacks to empty strings
            address: payload.address || "",
            companyName: payload.companyName || organizationName || "",
            companySize: payload.companySize || "",
            primaryIntension: payload.primaryIntension || "",
            state: payload.state || "",
            city: payload.city || "",
            country: payload.country || "",
            industry: payload.industry || "",
            jobTitle: payload.jobTitle || "",
        };
        // Log the cleaned payload
        console.log("Clean payload:", JSON.stringify(cleanPayload, null, 2));
        const config = {
            headers: {
                Authorization: `Bearer ${isAccessToken(accessToken) ? accessToken : undefined}`,
            },
        };
        console.log("API URL:", `${baseUrl}users/update/${payload?.userId}`);
        const response = await axios.put(`${baseUrl}users/update/${payload?.userId}`, cleanPayload, config);
        console.log("Response status:", response.status);
        console.log("Response data:", JSON.stringify(response.data, null, 2));
        return response.data;
    }
    catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("ERROR status:", error.response?.status);
            console.error("ERROR data:", JSON.stringify(error.response?.data, null, 2));
        }
        else {
            console.error("Non-Axios ERROR:", error);
        }
        throw error;
    }
});
export const updateUserProfileById = createAsyncThunk("authentication/updateUserProfileById", async (payload) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${isAccessToken(accessToken) ? accessToken : undefined}`,
            },
        };
        console.log("user if from loca storage payload", payload);
        const response = await axios.post(`${baseUrl}users/updateUserProfile/${payload?.userId}`, payload, config);
        if (response.status === 200) {
            console.log("Success", response?.data);
        }
        console.log("response.data", response.data);
        return response.data;
    }
    catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("ERROR", error);
        }
        else {
            console.error("ERROR", error);
        }
        // You should return a rejected Promise with the error
        throw error;
    }
});
export const updateWebFcmUserPatch = createAsyncThunk("authentication/updateWebFcmUserPatch", async (fcmToken) => {
    try {
        const userIdHere = isUserId(userId) ? userId : undefined;
        // const fcmTokenHere = isFcmToken(fcmToken) ? fcmToken : undefined;
        const payload = {
            userId: userIdHere,
            fcmWebToken: fcmToken, //null,
        };
        const response = await axios.patch(`${baseUrl}users/update/${userIdHere}`, payload);
        if (response.status === 200) {
            console.log("Success", response?.data);
        }
        return response.data;
    }
    catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("ERROR", error);
        }
        else {
            console.error("ERROR", error);
        }
        // You should return a rejected Promise with the error
        throw error;
    }
});
export const updateAndroidFcmUserPatch = createAsyncThunk("authentication/updateAndroidFcmUserPatch", async (fcmToken) => {
    try {
        // const fcmTokenHere = isFcmToken(fcmToken) ? fcmToken : undefined;
        const payload = {
            userId: userIdHere,
            fcmAndroidToken: fcmToken,
        };
        const response = await axios.patch(`${baseUrl}users/update/${userIdHere}`, payload);
        if (response.status === 200) {
            console.log("Success", response?.data);
        }
        return response.data;
    }
    catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("ERROR", error);
        }
        else {
            console.error("ERROR", error);
        }
        // You should return a rejected Promise with the error
        throw error;
    }
});
export const updateUserByUserIdExceptAdmin = createAsyncThunk("authentication/updateUserByUserIdExceptAdmin", async (payload) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${isAccessToken(accessToken) ? accessToken : undefined}`,
            },
        };
        const response = await axios.put(`${baseUrl}users/update/${payload?.userId}`, payload, config);
        if (response.status === 200) {
            console.log("Success", response?.data);
        }
        return response.data;
    }
    catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("ERROR", error);
        }
        else {
            console.error("ERROR", error);
        }
        // You should return a rejected Promise with the error
        throw error;
    }
});
// InviteTeamMate flow
export const inviteTeammates = createAsyncThunk("authentication/inviteTeammates", async (payload) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${isAccessToken(accessToken) ? accessToken : undefined}`,
            },
        };
        console.log("{ invites: payload, hostUserId: userIdHere }", {
            invites: payload,
            hostUserId: userIdHere,
        });
        const response = await axios.post(`${baseUrl}users/invite`, payload, config);
        if (response.status === 200) {
            console.log("Success", response?.data);
        }
        return response.data;
    }
    catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("ERROR", error);
        }
        else {
            console.error("ERROR", error);
        }
        // You should return a rejected Promise with the error
        throw error;
    }
});
export const inviteTeammatesLoggedIn = createAsyncThunk("authentication/inviteTeammatesLoggedIn", async (payload) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${isAccessToken(accessToken) ? accessToken : undefined}`,
            },
        };
        console.log("{ invites: payload, hostUserId: userIdHere }", {
            invites: payload,
            hostUserId: userIdHere,
        });
        const response = await axios.post(`${baseUrl}users/invite`, payload, config);
        if (response.status === 200) {
            console.log("Success", response?.data);
            message.success(response?.data?.message);
        }
        return response.data;
    }
    catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("ERROR", error);
            message.warning(error?.response?.data?.error);
        }
        else {
            console.error("ERROR", error);
        }
        // You should return a rejected Promise with the error
        throw error;
    }
});
// update user role from admin
export const updateUserRoleByAdmin = createAsyncThunk("authentication/updateUserRoleByAdmin", async (payload) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${isAccessToken(accessToken) ? accessToken : undefined}`,
            },
        };
        const response = await axios.post(`${baseUrl}/users/updateUserRole`, payload, config);
        if (response.status === 200) {
            console.log("Success", response?.data);
        }
        return response.data;
    }
    catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("ERROR", error);
            message.warning(error?.response?.data?.error);
        }
        else {
            console.error("ERROR", error);
        }
        // You should return a rejected Promise with the error
        throw error;
    }
});
// Verify reCaptcha
export const verifyRecaptcha = createAsyncThunk("authentication/verifyRecaptcha", async (payload) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${payload?.accessToken ? payload?.accessToken : undefined}`,
            },
        };
        const response = await axios.post(`${baseUrl}superAdmin/verifyCaptcha`, payload, config);
        if (response.status === 200) {
            console.log("Success", response?.data);
        }
        return response.data;
    }
    catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("ERROR", error);
        }
        else {
            console.error("ERROR", error);
        }
        // You should return a rejected Promise with the error
        throw error;
    }
});
// Block user account
export const blockUserByAdmin = createAsyncThunk("authentication/blockUserByAdmin", async (payload) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${isAccessToken(accessToken) ? accessToken : undefined}`,
            },
        };
        payload;
        const response = await api.post(`superadmin/disableUser`, payload, config);
        if (response.status === 200) {
            console.log("Success", response?.data);
        }
        return response.data;
    }
    catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("ERROR", error);
            // return rejectWithValue(error.response?.data || error.message);
        }
        else {
            console.error("ERROR", error);
        }
    }
});
export const deleteUserFromInvitedArray = createAsyncThunk("authentication/deleteUserFromInvitedArray", async (payload) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${isAccessToken(accessToken) ? accessToken : undefined}`,
            },
        };
        payload;
        const response = await api.post(`superadmin/deleteUser`, payload, config);
        if (response.status === 200) {
            console.log("Success", response?.data);
        }
        return response.data;
    }
    catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("ERROR", error);
            // return rejectWithValue(error.response?.data || error.message);
        }
        else {
            console.error("ERROR", error);
        }
    }
});
export const checkInvitationValidity = createAsyncThunk("authentication/checkInvitationValidity", async (payload, { rejectWithValue }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${isAccessToken(accessToken) ? accessToken : undefined}`,
            },
        };
        payload;
        const response = await api.post(`users/isInvitationRevoked`, payload, config);
        if (response.status === 200) {
            console.log("Success", response?.data);
        }
        return response.data;
    }
    catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("ERROR", error);
            return rejectWithValue(error.response?.data || error.message);
        }
        else {
            console.error("ERROR", error);
        }
    }
});
export const inviteTeammatesLoggedInAndGetUserDetails = (payload) => async (dispatch) => {
    await dispatch(inviteTeammatesLoggedIn(payload));
    await dispatch(getUserById());
};
export const blockUserAndByIdAndGetUserById = (payload) => async (dispatch) => {
    await dispatch(blockUserByAdmin(payload));
    await dispatch(getUserById());
};
// To check user onboarding status
export const checkUserOnBoardingStatus = createAsyncThunk("authentication/checkUserOnBoardingStatus", async (email) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${isAccessToken(accessToken) ? accessToken : undefined}`,
            },
        };
        // 6ba4ea16-cec2-4b26-ab29-351b3bc7e90e
        const response = await axios.post(`${baseUrl}users/isUserOnboarded`, { userEmail: email }, config);
        if (response.status === 200) {
            console.log("Success user onboading status", response?.data);
        }
        return response.data;
    }
    catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("ERROR", error);
        }
        else {
            console.error("ERROR", error);
        }
        // You should return a rejected Promise with the error
        throw error;
    }
});
const authenticationSlice = createSlice({
    name: "authentication",
    initialState,
    reducers: {
        setEmailOrPhoneFlag: (state, action) => {
            // type of the action payload should be string
            state.emailOrPhone = action.payload;
            return state;
        },
        setForgetPasswordPage: (state, action) => {
            // type of the action payload should be string
            state.forgetPasswordPage = action.payload;
            return state;
        },
        setForgetPasswordLoader: (state, action) => {
            // type of the action payload should be string
            state.sendOtpLoader = action.payload;
            return state;
        },
        handleInputChangeReducerAuth: (state, action) => {
            // type of the action payload should be object
            state.user = {
                ...state.user,
                ...action.payload,
            };
            return state;
        },
        setUserFormPage: (state, action) => {
            // type of the action payload should be string
            state.userFormPage = action.payload;
        },
        setProfileRoute: (state, action) => {
            // type of the action payload should be string
            state.profileRoute = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(sendForgetPasswordEmail.pending, (state) => {
            state.sendOtpLoader = true;
        });
        builder.addCase(sendForgetPasswordEmail.fulfilled, (state) => {
            state.sendOtpLoader = false;
            setTimeout(() => {
                window.location.href = "/login";
            }, 2000);
        });
        builder.addCase(sendForgetPasswordEmail.rejected, (state, action) => {
            state.sendOtpLoader = false;
            state.error =
                action.error.message ||
                    "Operation cannot be completed, you may want to contact administrator for help.";
        });
        builder.addCase(resetPassword.pending, (state) => {
            state.sendOtpLoader = true;
        });
        builder.addCase(resetPassword.fulfilled, (state) => {
            state.sendOtpLoader = false;
            setTimeout(() => {
                window.location.href = "/login";
            }, 2000);
        });
        builder.addCase(resetPassword.rejected, (state) => {
            state.sendOtpLoader = false;
            message.error("Error at reset password");
        });
        builder.addCase(addUser.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(addUser.fulfilled, (state, action) => {
            state.loading = false;
            if (action?.payload?.data) {
                state.user = {
                    ...action.payload?.data,
                    role: action?.payload?.data?.roles?.length > 0
                        ? action?.payload?.data?.roles[0]?.roleName
                        : "SALESPERSON",
                    email: action?.payload?.data?.email,
                    companyName: action?.payload?.data?.organisation?.name,
                };
                if (action?.payload?.data?.roles?.length > 0) {
                    localStorage?.setItem("userRole", action?.payload?.data?.roles[0]?.roleName);
                }
            }
        });
        builder.addCase(addUser.rejected, (state) => {
            state.loading = false;
            message.error("Error at adding Information");
        });
        builder.addCase(getUserById.pending, (state) => {
            state.loading = true;
            state.getUserLoader = true;
        });
        builder.addCase(getUserById.fulfilled, (state, action) => {
            state.loading = false;
            state.getUserLoader = false;
            console.log("action?.payload?.data? user", action?.payload?.data);
            if (action?.payload?.data) {
                state.user = {
                    ...action.payload?.data,
                    role: action?.payload?.data?.roles?.length > 0
                        ? action?.payload?.data?.roles[0]?.roleName
                        : "SALESPERSON",
                    email: action?.payload?.data?.email,
                    companyName: action?.payload?.data?.organisation?.name,
                    organizationId: action?.payload?.data?.organisation?.organisationId,
                };
                if (action?.payload?.data?.roles?.length > 0) {
                    localStorage?.setItem("userRole", action?.payload?.data?.roles[0]?.roleName);
                }
                if (action?.payload?.data?.invitedUsers?.length > 0) {
                    state.invitedUsers = action?.payload?.data?.invitedUsers?.map((item, index) => {
                        return { ...item, userId: index + 1, isBlocked: item?.isBlocked };
                    });
                }
                if (action?.payload?.data?.organisation?.subscriptions?.length > 0) {
                    const subscriptionHere = action?.payload?.data?.organisation?.subscriptions[0];
                    state.subscription = {
                        ...subscriptionHere,
                        planName: subscriptionHere?.plan?.planname,
                        planAmount: subscriptionHere?.plan?.planamount,
                        noOfUsers: subscriptionHere?.plan?.noOfUsers,
                        features: subscriptionHere?.plan?.features,
                        planType: subscriptionHere?.plan?.planType,
                    };
                }
                // localStorage?.setItem("userRole", action?.payload?.data);
            }
        });
        builder.addCase(getUserById.rejected, (state) => {
            state.loading = false;
            state.getUserLoader = false;
            // message.error("Error getting user Info");
        });
        builder.addCase(updateUserByUserId.pending, (state) => {
            state.loading = true;
            state.updateUserLoader = true;
        });
        builder.addCase(updateUserByUserId.fulfilled, (state) => {
            state.loading = false;
            state.updateUserLoader = false;
            message.success("Information updated successfully");
            // state.userFormPage = state?.userFormPage + 1;
        });
        builder.addCase(updateUserByUserId.rejected, (state) => {
            state.loading = false;
            state.updateUserLoader = false;
            message.error("Error at updating user Info 1");
        });
        // Update profile
        builder.addCase(updateUserProfileById.pending, (state) => {
            state.loading = true;
            state.updateUserLoader = true;
        });
        builder.addCase(updateUserProfileById.fulfilled, (state) => {
            state.loading = false;
            state.updateUserLoader = false;
            message.success("Information updated successfully");
        });
        builder.addCase(updateUserProfileById.rejected, (state) => {
            state.loading = false;
            state.updateUserLoader = false;
            message.error("Error at updating user Info 2");
        });
        // For no admin
        builder.addCase(updateUserByUserIdExceptAdmin.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(updateUserByUserIdExceptAdmin.fulfilled, (state) => {
            state.loading = false;
            message.success("Information updated successfully");
            setTimeout(() => {
                window.location.href = "/referrals";
                localStorage.setItem("loggedIn", "true");
            }, 3000);
        });
        builder.addCase(updateUserByUserIdExceptAdmin.rejected, (state) => {
            state.loading = false;
            message.error("Error at updating user Info 3");
        });
        // Invite team mates
        builder.addCase(inviteTeammates.pending, (state) => {
            state.inviteTeamMatesLoader = true;
        });
        builder.addCase(inviteTeammates.fulfilled, (state) => {
            state.inviteTeamMatesLoader = false;
        });
        builder.addCase(inviteTeammates.rejected, (state) => {
            state.inviteTeamMatesLoader = false;
            message.error("Error inviting teammates");
        });
        // Invite team mates
        builder.addCase(inviteTeammatesLoggedIn.pending, (state) => {
            state.inviteTeamMatesLoader = true;
        });
        builder.addCase(inviteTeammatesLoggedIn.fulfilled, (state) => {
            state.inviteTeamMatesLoader = false;
        });
        builder.addCase(inviteTeammatesLoggedIn.rejected, (state) => {
            state.inviteTeamMatesLoader = false;
        });
        // Update user role
        builder.addCase(updateUserRoleByAdmin.pending, (state) => {
            state.updateUserRoleLoader = true;
        });
        builder.addCase(updateUserRoleByAdmin.fulfilled, (state) => {
            state.updateUserRoleLoader = false;
            message.success("User role updated successfully");
        });
        builder.addCase(updateUserRoleByAdmin.rejected, (state) => {
            state.updateUserRoleLoader = false;
        });
        // Blocked user
        builder.addCase(blockUserByAdmin.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(blockUserByAdmin.fulfilled, (state) => {
            state.loading = false;
            message.success("User account status updated successfully");
        });
        builder.addCase(blockUserByAdmin.rejected, (state) => {
            state.loading = false;
            message.error("Something went wrong");
        });
        //delete user
        builder.addCase(deleteUserFromInvitedArray.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(deleteUserFromInvitedArray.fulfilled, (state) => {
            state.loading = false;
            message.success("User Deleted");
        });
        builder.addCase(deleteUserFromInvitedArray.rejected, (state) => {
            state.loading = false;
            message.error("Failed to Delete.");
        });
        //check invitation validity
        builder.addCase(checkInvitationValidity.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(checkInvitationValidity.fulfilled, (state, action) => {
            state.loading = false;
            console.log("action value in fulfilled", action.payload);
            message.success("");
        });
        builder.addCase(checkInvitationValidity.rejected, (state, action) => {
            state.loading = false;
            console.log("action value in rejected", action.payload);
            if (action.payload)
                message.error(action.payload?.error.message);
        });
        // Onboarding status
        builder.addCase(checkUserOnBoardingStatus.pending, (state) => {
            state.onboardingStatusLoader = true;
        });
        builder.addCase(checkUserOnBoardingStatus.fulfilled, (state, action) => {
            state.onboardingStatusLoader = false;
            if (action?.payload?.data) {
                state.userOnboardStatusData = {
                    ...action.payload?.data,
                    role: action?.payload?.data?.invitedUsers?.find((user) => email === user?.email)?.role,
                    email: email,
                    companyName: action?.payload?.data?.organisation?.name,
                    organizationId: action?.payload?.data?.organisation?.organisationId,
                };
            }
        });
        builder.addCase(checkUserOnBoardingStatus.rejected, (state) => {
            state.onboardingStatusLoader = false;
        });
    },
});
export const { setEmailOrPhoneFlag, setForgetPasswordPage, setForgetPasswordLoader, handleInputChangeReducerAuth, setUserFormPage, setProfileRoute, } = authenticationSlice.actions;
export default authenticationSlice.reducer;
