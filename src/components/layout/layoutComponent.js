import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { MenuOutlined, LeftOutlined } from "@ant-design/icons";
import { Avatar, Dropdown, Layout, Menu } from "antd";
import { LoggedInRouteConfig } from "../../routes/RouteConfig";
import { useNavigate } from "react-router-dom";
import { auth } from "../../services/firebaseConfig";
import "../../styles/layout/layout.css";
import { CX_ONE_GO_LOGO, DASHBOARD_ICON_ORANGE, ACCOUNT_ICON_ORANGE, ACCOUNT_ICON_WHITE, CONTACT_ICON_ORANGE, CONTACT_ICON_WHITE, LEADS_ICON_ORANGE, LEADS_ICON_WHITE, OPPOTUNITIES_ICON_ORANGE, OPPOTUNITIES_ICON_WHITE, REFERALS_ICON_ORANGE, REFERALS_ICON_WHITE, ACTIVITIES_ICON_ORANGE, ACTIVITIES_ICON_WHITE, NOTES_ICON_WHITE, NOTES_ICON_ORANGE, CALENDAR_ICON_WHITE, CALENDAR_ICON_ORANGE, DASHBOARD_ICON_WHITE, PROFILE_SETTINGS, PROFILE_SUBSCRIPTION, PROFILE_LOGOUT, } from "../../utilities/common/imagesImports";
import { useAppDispatch, useAppSelector } from "../../redux/app/hooks";
import { setScreenWidth } from "../../redux/features/referralsSlice";
const vapidKey = import.meta.env.VITE_REACT_APP_VAPID_KEY;
import { messaging } from "../../services/firebaseConfig";
import { getToken } from "@firebase/messaging";
import { PushNotifications } from "@capacitor/push-notifications";
import pushNotifications from "../../firebase_notification";
import { getUserById, setProfileRoute, updateAndroidFcmUserPatch, updateWebFcmUserPatch, } from "../../redux/features/authenticationSlice";
const { Header, Sider, Content } = Layout;
function LayoutComponent() {
    const dispatch = useAppDispatch();
    const [currentTab, setCurrentTab] = useState("");
    const navigate = useNavigate();
    const [showNav, setShowNav] = useState(true);
    const [visible, setVisible] = useState(false);
    const { screenWidth } = useAppSelector((state) => state.referrals);
    const { user, profileRoute } = useAppSelector((state) => state.authentication);
    const handleMenuClick = async (value) => {
        if (value === "logout") {
            // Handle logout action
            localStorage.clear();
            await auth?.signOut();
            window.location.href = "/login";
        }
        else if (value === "profile/general" ||
            value === "profile/subscription") {
            navigate(`/${value}`);
            dispatch(setProfileRoute(true));
            setShowNav(false);
        }
        else {
            // Handle other menu options
            navigate(`/${value}`);
        }
    };
    const handleRedirectDashboard = () => {
        navigate("/");
    };
    const menu = (_jsxs(Menu, { children: [_jsx(Menu.Item, { children: _jsxs("div", { children: [_jsx("div", { className: "profileName1", children: `${user?.firstName} ${user?.lastName}` }), _jsx("div", { className: "profileName2", children: user?.email }), _jsxs("div", { className: "profileName3", children: [user?.role === "ADMIN"
                                    ? "Admin"
                                    : user?.role === "SALESMANAGER"
                                        ? "Sales Manager"
                                        : "Sales Person", " ", "@ ", user?.companyName] }), _jsx("hr", {})] }) }), _jsxs("div", { className: "profilePopoverTitlesWrapper", onClick: () => handleMenuClick("profile/general"), children: [_jsx("img", { src: PROFILE_SETTINGS, alt: "settings" }), _jsx(Menu.Item, { className: "profilePopoverTitles", children: "CRM Settings" }, "profile/general")] }), _jsxs("div", { className: "profilePopoverTitlesWrapper", onClick: () => handleMenuClick("profile/subscription"), children: [_jsx("img", { src: PROFILE_SUBSCRIPTION, alt: "subscription" }), _jsx(Menu.Item, { className: "profilePopoverTitles", children: "Current Subscription" }, "profile/subscription")] }), _jsxs("div", { className: "profilePopoverTitlesWrapper", onClick: () => handleMenuClick("logout"), children: [_jsx("img", { src: PROFILE_LOGOUT, alt: "logout" }), _jsx(Menu.Item, { className: "profilePopoverTitles", children: "Logout" }, "logout")] })] }));
    const handleResizeWindow = () => {
        const handleResize = () => {
            dispatch(setScreenWidth(window?.innerWidth));
        };
        window?.addEventListener("resize", handleResize);
        return () => {
            window?.removeEventListener("resize", handleResize);
        };
    };
    const toggleNav = () => {
        if (!profileRoute) {
            setShowNav(!showNav);
        }
        else if (profileRoute && screenWidth < 768) {
            setShowNav(!showNav);
        }
    };
    const handleRedirect = (redirectURI) => {
        navigate(`/${redirectURI}`);
        setCurrentTab(redirectURI);
        if (screenWidth < 768) {
            toggleNav();
        }
    };
    // Web fcm token code starts
    async function requestPermission() {
        // Check if the browser supports notifications
        if (!("Notification" in window)) {
            console.log("This browser does not support notifications");
            return;
        }
        const permission = await Notification.requestPermission();
        console.log("in requestPermission fun, ", permission, typeof permission);
        if (permission === "granted") {
            // Generate Token
            try {
                // Check if messaging is available (not null)
                if (!messaging) {
                    console.warn("Firebase messaging is not available in this browser");
                    return;
                }
                const token = await getToken(messaging, {
                    vapidKey: vapidKey,
                });
                console.log("fcm token new", token);
                localStorage?.setItem("fcmToken", token);
                // Send this token to server (db)
                dispatch(updateWebFcmUserPatch(token));
            }
            catch (err) {
                console.log("Error getting FCM token:", err);
            }
        }
        else if (permission === "denied") {
            alert("It looks like you've denied notifications. Please enable notifications in your device settings to receive notifications. Thank you!");
        }
    }
    // web fcm token code ends
    // Android fcm token code starts
    const getAndUpdateAndroidTokenToServer = async () => {
        await PushNotifications.addListener("registration", (token) => {
            console.info("Registration token obtained after logged in: ", token?.value);
            dispatch(updateAndroidFcmUserPatch(token?.value));
        });
    };
    useEffect(() => {
        requestPermission();
        pushNotifications();
        getAndUpdateAndroidTokenToServer();
        if (typeof window !== "undefined") {
            dispatch(getUserById());
        }
    }, []);
    // Android fcm token code ends
    useEffect(() => {
        // User details fetch
        // Window resize
        handleResizeWindow();
    }, [screenWidth]);
    useEffect(() => {
        if (window.location.href?.includes("/profile")) {
            setShowNav(false);
            dispatch(setProfileRoute(true));
        }
        else {
            dispatch(setProfileRoute(false));
        }
    }, [navigate]);
    useEffect(() => {
        if (location.pathname.includes("dashboard")) {
            setCurrentTab("dashboard");
        }
        else if (location.pathname.includes("referrals")) {
            setCurrentTab("referrals");
        }
        else if (location.pathname.includes("accounts")) {
            setCurrentTab("company");
        }
        else if (location.pathname.includes("contacts")) {
            setCurrentTab("contacts");
        }
        else if (location.pathname.includes("leads")) {
            setCurrentTab("leads");
        }
        else if (location.pathname.includes("opportunities")) {
            setCurrentTab("opportunities");
        }
        else if (location.pathname.includes("activity")) {
            setCurrentTab("activities");
        }
        else if (location.pathname.includes("notes")) {
            setCurrentTab("notes");
        }
        else if (location.pathname.includes("calendar")) {
            setCurrentTab("calendar");
        }
        else if (location.pathname.includes("profile/general")) {
            setCurrentTab("profile/general");
        }
        else if (location.pathname.includes("profile/import-records")) {
            setCurrentTab("profile/import-records");
        }
        else if (location.pathname.includes("profile/helpAndSupport")) {
            setCurrentTab("profile/helpAndSupport");
        }
        else if (location.pathname.includes("profile/subscription")) {
            setCurrentTab("profile/subscription");
        }
        else if (location.pathname.includes("profile/privacy-policy")) {
            setCurrentTab("profile/privacy-policy");
        }
        else if (location.pathname.includes("profile/terms-and-conditions")) {
            setCurrentTab("profile/terms-and-conditions");
        }
    }, [location.pathname]);
    return (_jsx("div", { className: "layoutMainDiv", children: _jsxs(Layout, { children: [_jsxs(Header, { className: "layoutHeader", children: [_jsx(MenuOutlined, { type: "primary", onClick: toggleNav, className: "hamburgerBtn" }), _jsx("img", { className: "layoutLogo", src: CX_ONE_GO_LOGO, alt: "Logo", onClick: handleRedirectDashboard }), _jsx("div", { className: "layoutHeaderWrapper" }), _jsx("div", { className: "layoutHeaderLeftWrapper", children: _jsx(Dropdown, { overlay: menu, trigger: ["click"], open: visible, onOpenChange: (flag) => setVisible(flag), children: _jsxs(Avatar, { className: "cursorPointer", children: [user?.firstName?.slice(0, 1), user?.lastName?.slice(0, 1)] }) }) })] }), _jsxs(Layout, { children: [_jsx(Sider, { trigger: null, collapsible: true, collapsed: showNav, style: {
                                height: "100vh",
                                position: screenWidth < 768 ? "fixed" : "relative",
                                zIndex: 1000,
                                transition: screenWidth < 768 ? "left 0.3s" : "width 3s",
                                left: showNav && screenWidth < 768 ? "-100%" : 0,
                            }, children: _jsx("div", { className: "layoutSiderWrapper", children: _jsx(Menu, { theme: "dark", mode: "inline", defaultSelectedKeys: [currentTab], selectedKeys: [currentTab], children: profileRoute ? (_jsxs(_Fragment, { children: [user?.role === "ADMIN" ?
                                                _jsxs("div", { className: "navPanelHeading", onClick: handleRedirectDashboard, children: [_jsx(LeftOutlined, { style: { marginRight: "5px" } }), "Back to Dashboard"] })
                                                : _jsxs("div", { className: "navPanelHeading", onClick: () => navigate("/referrals"), children: [_jsx(LeftOutlined, { style: { marginRight: "5px" } }), "Back to Home"] }), _jsx(Menu.Item, { icon: _jsx("img", { src: currentTab === "profile/general"
                                                        ? DASHBOARD_ICON_WHITE
                                                        : DASHBOARD_ICON_ORANGE, alt: "profile/general" }), onClick: () => handleRedirect("profile/general"), children: "General" }, "profile/general"), user?.role === "ADMIN" && (_jsx(Menu.Item, { icon: _jsx("img", { src: currentTab === "profile/lead-assignment"
                                                        ? DASHBOARD_ICON_WHITE
                                                        : DASHBOARD_ICON_ORANGE, alt: "profile/lead-assignment" }), onClick: () => handleRedirect("profile/lead-assignment"), children: "Lead Assignment" }, "profile/lead-assignment")), screenWidth > 768 && user?.role === "ADMIN" ? (_jsx(Menu.Item, { icon: _jsx("img", { src: currentTab === "profile/import-records"
                                                        ? DASHBOARD_ICON_WHITE
                                                        : DASHBOARD_ICON_ORANGE, alt: "profile/import-records" }), onClick: () => handleRedirect("profile/import-records"), children: "Import Records" }, "profile/import-records")) : null, _jsx(Menu.Item, { icon: _jsx("img", { src: currentTab === "profile/helpAndSupport"
                                                        ? DASHBOARD_ICON_WHITE
                                                        : DASHBOARD_ICON_ORANGE, alt: "profile/helpAndSupport" }), onClick: () => handleRedirect("profile/helpAndSupport"), children: "Help & Support" }, "profile/helpAndSupport"), _jsx(Menu.Item, { icon: _jsx("img", { src: currentTab === "profile/subscription"
                                                        ? DASHBOARD_ICON_WHITE
                                                        : DASHBOARD_ICON_ORANGE, alt: "profile/subscription" }), onClick: () => handleRedirect("profile/subscription"), children: "Subscription" }, "profile/subscription"), _jsx(Menu.Item, { icon: _jsx("img", { src: currentTab === "profile/privacy-policy"
                                                        ? DASHBOARD_ICON_WHITE
                                                        : DASHBOARD_ICON_ORANGE, alt: "profile/privacy-policy" }), onClick: () => handleRedirect("profile/privacy-policy"), children: "Privacy Policy" }, "profile/privacy-policy"), _jsx(Menu.Item, { icon: _jsx("img", { src: currentTab === "profile/terms-and-conditions"
                                                        ? DASHBOARD_ICON_WHITE
                                                        : DASHBOARD_ICON_ORANGE, alt: "profile/terms-and-conditions" }), onClick: () => handleRedirect("profile/terms-and-conditions"), children: "Terms & Conditions" }, "profile/terms-and-conditions")] })) : (_jsxs(_Fragment, { children: [user?.role === "ADMIN" ?
                                                _jsxs(Menu.SubMenu, { icon: _jsx("img", { src: DASHBOARD_ICON_ORANGE, alt: "Dashboard" }), title: "Dashboard", children: [_jsx(Menu.Item, { onClick: () => handleRedirect("dashboardLeads"), children: "Leads" }, "dashboardLeads"), _jsx(Menu.Item, { onClick: () => handleRedirect("dashboardOpportunities"), children: "Opportunities" }, "dashboardOpportunities"), _jsx(Menu.Item, { onClick: () => handleRedirect("dashboardActivities"), children: "Activities" }, "dashboardActivity")] }, "dashboard") : _jsx(_Fragment, {}), _jsx(Menu.Item, { icon: _jsx("img", { src: currentTab === "referrals"
                                                        ? REFERALS_ICON_WHITE
                                                        : REFERALS_ICON_ORANGE, alt: "Referrals" }), onClick: () => handleRedirect("referrals"), children: "Referrals" }, "referrals"), _jsx(Menu.Item, { icon: _jsx("img", { src: currentTab === "company"
                                                        ? ACCOUNT_ICON_WHITE
                                                        : ACCOUNT_ICON_ORANGE, alt: "Company" }), onClick: () => handleRedirect("accounts"), children: user?.organisation && user?.organisation?.companyToken
                                                    ? user.organisation.companyToken
                                                    : "Company" }, "company"), _jsx(Menu.Item, { icon: _jsx("img", { src: currentTab === "contacts"
                                                        ? CONTACT_ICON_WHITE
                                                        : CONTACT_ICON_ORANGE, alt: "Contacts" }), onClick: () => handleRedirect("contacts"), children: user?.organisation && user?.organisation?.contactToken
                                                    ? user.organisation.contactToken
                                                    : "Contacts" }, "contacts"), _jsx(Menu.Item, { icon: _jsx("img", { src: currentTab === "leads"
                                                        ? LEADS_ICON_WHITE
                                                        : LEADS_ICON_ORANGE, alt: "Leads" }), onClick: () => handleRedirect("leads"), children: "Leads" }, "leads"), _jsx(Menu.Item, { icon: _jsx("img", { src: currentTab === "opportunities"
                                                        ? OPPOTUNITIES_ICON_WHITE
                                                        : OPPOTUNITIES_ICON_ORANGE, alt: "Opportunities" }), onClick: () => handleRedirect("opportunities"), children: "Opportunities" }, "opportunities"), _jsx(Menu.Item, { icon: _jsx("img", { src: currentTab === "activities"
                                                        ? ACTIVITIES_ICON_WHITE
                                                        : ACTIVITIES_ICON_ORANGE, alt: "Activities" }), onClick: () => handleRedirect("activity"), children: "Activities" }, "activities"), _jsx(Menu.Item, { icon: _jsx("img", { src: currentTab === "notes"
                                                        ? NOTES_ICON_WHITE
                                                        : NOTES_ICON_ORANGE, alt: "Notes" }), onClick: () => handleRedirect("notes"), children: "Notes" }, "notes"), _jsx(Menu.Item, { icon: _jsx("img", { src: currentTab === "calendar"
                                                        ? CALENDAR_ICON_WHITE
                                                        : CALENDAR_ICON_ORANGE, alt: "calendar" }), onClick: () => handleRedirect("calendar"), children: "Calendar" }, "calendar")] })) }) }) }), _jsx(Layout, { children: _jsx("div", { style: {
                                    minHeight: "100vh",
                                    overflowY: "scroll",
                                }, className: "layoutContent", children: _jsx(Content, { children: _jsx(LoggedInRouteConfig, {}) }) }) })] })] }) }));
}
export default LayoutComponent;
