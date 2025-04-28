import { message } from "antd";
import axios from "axios";
import { getAuth, signOut } from "firebase/auth";
const accessToken = localStorage.getItem("accessToken");
const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;
function isAccessToken(str) {
    return typeof str === "string" && str !== null;
}
const api = axios.create({
    baseURL: baseUrl,
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${isAccessToken(accessToken) ? accessToken : undefined}`,
    },
});
api.interceptors.response.use((response) => response, async (error) => {
    if (error.response?.status === 403) {
        message.warning("Your session has expired, please login again to continue");
        const auth = getAuth();
        await signOut(auth);
        localStorage?.clear();
        window.location.href = "/login"; // Redirect to login page
        message.warning("Your session has expired, please login again to continue");
    }
    return Promise.reject(error);
});
export default api;
