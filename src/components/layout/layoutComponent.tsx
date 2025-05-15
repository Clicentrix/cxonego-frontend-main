import { useEffect, useState } from "react";
import { MenuOutlined, LeftOutlined } from "@ant-design/icons";
import { Avatar, Dropdown, Layout, Menu } from "antd";
import { LoggedInRouteConfig } from "../../routes/RouteConfig";
import { useNavigate } from "react-router-dom";
import { auth } from "../../services/firebaseConfig";
import "../../styles/layout/layout.css";
import {
  CX_ONE_GO_LOGO,
  DASHBOARD_ICON_ORANGE,
  ACCOUNT_ICON_ORANGE,
  ACCOUNT_ICON_WHITE,
  CONTACT_ICON_ORANGE,
  CONTACT_ICON_WHITE,
  LEADS_ICON_ORANGE,
  LEADS_ICON_WHITE,
  OPPOTUNITIES_ICON_ORANGE,
  OPPOTUNITIES_ICON_WHITE,
  REFERALS_ICON_ORANGE,
  REFERALS_ICON_WHITE,
  ACTIVITIES_ICON_ORANGE,
  ACTIVITIES_ICON_WHITE,
  NOTES_ICON_WHITE,
  NOTES_ICON_ORANGE,
  CALENDAR_ICON_WHITE,
  CALENDAR_ICON_ORANGE,
  DASHBOARD_ICON_WHITE,
  PROFILE_SETTINGS,
  PROFILE_SUBSCRIPTION,
  PROFILE_LOGOUT,
} from "../../utilities/common/imagesImports";
import { useAppDispatch, useAppSelector } from "../../redux/app/hooks";
import { RootState } from "../../redux/app/store";
import { setScreenWidth } from "../../redux/features/referralsSlice";
const vapidKey = import.meta.env.VITE_REACT_APP_VAPID_KEY;
import { messaging } from "../../services/firebaseConfig";
import { getToken } from "@firebase/messaging";
import { PushNotifications } from "@capacitor/push-notifications";
import pushNotifications from "../../firebase_notification";
import {
  getUserById,
  setProfileRoute,
  updateAndroidFcmUserPatch,
  updateWebFcmUserPatch,
} from "../../redux/features/authenticationSlice";

const { Header, Sider, Content } = Layout;

function LayoutComponent() {
  const dispatch = useAppDispatch();
  const [currentTab, setCurrentTab] = useState<string>("");
  const navigate = useNavigate();
  const [showNav, setShowNav] = useState(true);
  const [visible, setVisible] = useState<boolean>(false);
  const { screenWidth } = useAppSelector((state: RootState) => state.referrals);
  const { user, profileRoute } = useAppSelector(
    (state: RootState) => state.authentication
  );

  const handleMenuClick = async (value: string) => {
    if (value === "logout") {
      // Handle logout action
      localStorage.clear();
      await auth?.signOut();
      window.location.href = "/login";
    } else if (
      value === "profile/general" ||
      value === "profile/subscription"
    ) {
      navigate(`/${value}`);
      dispatch(setProfileRoute(true));
      setShowNav(false);
    } else {
      // Handle other menu options
      navigate(`/${value}`);
    }
  };

  const handleRedirectDashboard = () => {
    navigate("/");
  };

  const menu = (
    <Menu>
      <Menu.Item>
        <div>
          <div className="profileName1">
            {`${user?.firstName} ${user?.lastName}`}
          </div>
          <div className="profileName2">{user?.email}</div>
          <div className="profileName3">
            {user?.role === "ADMIN"
              ? "Admin"
              : user?.role === "SALESMANAGER"
                ? "Sales Manager"
                : "Sales Person"}{" "}
            @ {user?.companyName}
          </div>
          <hr />
        </div>
      </Menu.Item>
      <div
        className="profilePopoverTitlesWrapper"
        onClick={() => handleMenuClick("profile/general")}
      >
        <img src={PROFILE_SETTINGS} alt="settings" />
        <Menu.Item key="profile/general" className="profilePopoverTitles">
          CRM Settings
        </Menu.Item>
      </div>
      <div
        className="profilePopoverTitlesWrapper"
        onClick={() => handleMenuClick("profile/subscription")}
      >
        <img src={PROFILE_SUBSCRIPTION} alt="subscription" />
        <Menu.Item key="profile/subscription" className="profilePopoverTitles">
          Current Subscription
        </Menu.Item>
      </div>
      <div
        className="profilePopoverTitlesWrapper"
        onClick={() => handleMenuClick("logout")}
      >
        <img src={PROFILE_LOGOUT} alt="logout" />
        <Menu.Item key="logout" className="profilePopoverTitles">
          Logout
        </Menu.Item>
      </div>
    </Menu>
  );

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
    } else if (profileRoute && screenWidth < 768) {
      setShowNav(!showNav);
    }
  };

  const handleRedirect = (redirectURI: string) => {
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
    console.log("in requestPermission fun, ", permission, typeof permission)
    
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
    } else if (permission === "denied") {
      alert(
        "It looks like you've denied notifications. Please enable notifications in your device settings to receive notifications. Thank you!"
      );
    }
  }

  // web fcm token code ends

  // Android fcm token code starts
  const getAndUpdateAndroidTokenToServer = async () => {
    await PushNotifications.addListener("registration", (token: any) => {
      console.info(
        "Registration token obtained after logged in: ",
        token?.value
      );
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
    } else {
      dispatch(setProfileRoute(false));
    }
  }, [navigate]);

  useEffect(() => {
    if (location.pathname.includes("dashboard")) {
      setCurrentTab("dashboard");
    } else if (location.pathname.includes("referrals")) {
      setCurrentTab("referrals");
    } else if (location.pathname.includes("accounts")) {
      setCurrentTab("company");
    } else if (location.pathname.includes("contacts")) {
      setCurrentTab("contacts");
    } else if (location.pathname.includes("leads")) {
      setCurrentTab("leads");
    } else if (location.pathname.includes("opportunities")) {
      setCurrentTab("opportunities");
    } else if (location.pathname.includes("activity")) {
      setCurrentTab("activities");
    } else if (location.pathname.includes("notes")) {
      setCurrentTab("notes");
    } else if (location.pathname.includes("calendar")) {
      setCurrentTab("calendar");
    } else if (location.pathname.includes("profile/general")) {
      setCurrentTab("profile/general");
    } else if (location.pathname.includes("profile/import-records")) {
      setCurrentTab("profile/import-records");
    } else if (location.pathname.includes("profile/helpAndSupport")) {
      setCurrentTab("profile/helpAndSupport");
    } else if (location.pathname.includes("profile/subscription")) {
      setCurrentTab("profile/subscription");
    } else if (location.pathname.includes("profile/privacy-policy")) {
      setCurrentTab("profile/privacy-policy");
    } else if (location.pathname.includes("profile/terms-and-conditions")) {
      setCurrentTab("profile/terms-and-conditions");
    }
  }, [location.pathname]);

  return (
    <div className="layoutMainDiv">
      <Layout>
        <Header className="layoutHeader">
          {/* {screenWidth < 768 && ( */}

          <MenuOutlined
            type="primary"
            onClick={toggleNav}
            className="hamburgerBtn"
          // icon={<MenuOutlined color="#fff" />}
          />
          {/* )} */}
          <img
            className="layoutLogo"
            src={CX_ONE_GO_LOGO}
            alt="Logo"
            onClick={handleRedirectDashboard}
          />
          <div className="layoutHeaderWrapper">
            {/* <Menu
              theme="light"
              mode="horizontal"
              items={[
                {
                  key: "1",
                  label: "Table",
                  onClick: () => handleRedirect("dashboard"),
                },
                {
                  key: "2",
                  label: "Reporting",
                  onClick: () => handleRedirect("dashboard"),
                },
                {
                  key: "3",
                  label: "Configuration",
                  onClick: () => handleRedirect("dashboard"),
                },
              ]}
              style={{ flex: 1, minWidth: 0 }}
            /> */}
          </div>
          <div className="layoutHeaderLeftWrapper">
            {/* <BellFilled /> */}
            <Dropdown
              overlay={menu}
              trigger={["click"]}
              open={visible}
              onOpenChange={(flag) => setVisible(flag)}
            >
              <Avatar className="cursorPointer">
                {user?.firstName?.slice(0, 1)}
                {user?.lastName?.slice(0, 1)}
              </Avatar>
            </Dropdown>
          </div>
        </Header>

        <Layout>
          <Sider
            trigger={null}
            collapsible
            collapsed={showNav}
            style={{
              height: "100vh",
              position: screenWidth < 768 ? "fixed" : "relative",
              zIndex: 1000,
              transition: screenWidth < 768 ? "left 0.3s" : "width 3s",
              left: showNav && screenWidth < 768 ? "-100%" : 0,
            }}
          >
            <div className="layoutSiderWrapper">
              <Menu
                theme="dark"
                mode="inline"
                defaultSelectedKeys={[currentTab]}
                selectedKeys={[currentTab]}
              >
                {profileRoute ? (
                  <>
                    {user?.role === "ADMIN" ?
                      <div
                        className="navPanelHeading"
                        onClick={handleRedirectDashboard}
                      >
                        <LeftOutlined style={{ marginRight: "5px" }} />
                        Back to Dashboard
                      </div>
                      : <div
                        className="navPanelHeading"
                        onClick={() => navigate("/referrals")}
                      >
                        <LeftOutlined style={{ marginRight: "5px" }} />
                        Back to Home
                      </div>}
                    <Menu.Item
                      key="profile/general"
                      icon={
                        <img
                          src={
                            currentTab === "profile/general"
                              ? DASHBOARD_ICON_WHITE
                              : DASHBOARD_ICON_ORANGE
                          }
                          alt="profile/general"
                        />
                      }
                      onClick={() => handleRedirect("profile/general")}
                    >
                      General
                    </Menu.Item>
                    {user?.role === "ADMIN" && (
                      <Menu.Item
                        key="profile/lead-assignment"
                        icon={
                          <img
                            src={
                              currentTab === "profile/lead-assignment"
                              ? DASHBOARD_ICON_WHITE
                              : DASHBOARD_ICON_ORANGE
                            }
                            alt="profile/lead-assignment"
                          />
                        }
                        onClick={() => handleRedirect("profile/lead-assignment")}
                      >
                        Lead Assignment
                      </Menu.Item>
                    )}
                    {screenWidth > 768 && user?.role === "ADMIN" ? (
                      <Menu.Item
                        key="profile/import-records"
                        icon={
                          <img
                            src={
                              currentTab === "profile/import-records"
                                ? DASHBOARD_ICON_WHITE
                                : DASHBOARD_ICON_ORANGE
                            }
                            alt="profile/import-records"
                          />
                        }
                        onClick={() => handleRedirect("profile/import-records")}
                      >
                        Import Records
                      </Menu.Item>
                    ) : null}

                    <Menu.Item
                      key="profile/helpAndSupport"
                      icon={
                        <img
                          src={
                            currentTab === "profile/helpAndSupport"
                              ? DASHBOARD_ICON_WHITE
                              : DASHBOARD_ICON_ORANGE
                          }
                          alt="profile/helpAndSupport"
                        />
                      }
                      onClick={() => handleRedirect("profile/helpAndSupport")}
                    >
                      Help & Support
                    </Menu.Item>
                    <Menu.Item
                      key="profile/subscription"
                      icon={
                        <img
                          src={
                            currentTab === "profile/subscription"
                              ? DASHBOARD_ICON_WHITE
                              : DASHBOARD_ICON_ORANGE
                          }
                          alt="profile/subscription"
                        />
                      }
                      onClick={() => handleRedirect("profile/subscription")}
                    >
                      Subscription
                    </Menu.Item>
                    <Menu.Item
                      key="profile/privacy-policy"
                      icon={
                        <img
                          src={
                            currentTab === "profile/privacy-policy"
                              ? DASHBOARD_ICON_WHITE
                              : DASHBOARD_ICON_ORANGE
                          }
                          alt="profile/privacy-policy"
                        />
                      }
                      onClick={() => handleRedirect("profile/privacy-policy")}
                    >
                      Privacy Policy
                    </Menu.Item>
                    <Menu.Item
                      key="profile/terms-and-conditions"
                      icon={
                        <img
                          src={
                            currentTab === "profile/terms-and-conditions"
                              ? DASHBOARD_ICON_WHITE
                              : DASHBOARD_ICON_ORANGE
                          }
                          alt="profile/terms-and-conditions"
                        />
                      }
                      onClick={() =>
                        handleRedirect("profile/terms-and-conditions")
                      }
                    >
                      Terms & Conditions
                    </Menu.Item>
                  </>
                ) : (

                  <>
                    {user?.role === "ADMIN" ?
                      <Menu.SubMenu
                        key="dashboard"
                        icon={<img src={DASHBOARD_ICON_ORANGE} alt="Dashboard" />}
                        title="Dashboard"
                      >
                        <Menu.Item
                          key="dashboardLeads"
                          onClick={() => handleRedirect("dashboardLeads")}
                        >
                          Leads
                        </Menu.Item>
                        <Menu.Item
                          key="dashboardOpportunities"
                          onClick={() => handleRedirect("dashboardOpportunities")}
                        >
                          Opportunities
                        </Menu.Item>
                        <Menu.Item
                          key="dashboardActivity"
                          onClick={() => handleRedirect("dashboardActivities")}
                        >
                          Activities
                        </Menu.Item>
                      </Menu.SubMenu> : <></>}
                    <Menu.Item
                      key="referrals"
                      icon={
                        <img
                          src={
                            currentTab === "referrals"
                              ? REFERALS_ICON_WHITE
                              : REFERALS_ICON_ORANGE
                          }
                          alt="Referrals"
                        />
                      }
                      onClick={() => handleRedirect("referrals")}
                    >
                      Referrals
                    </Menu.Item>
                    <Menu.Item
                      key="company"
                      icon={
                        <img
                          src={
                            currentTab === "company"
                              ? ACCOUNT_ICON_WHITE
                              : ACCOUNT_ICON_ORANGE
                          }
                          alt="Company"
                        />
                      }
                      onClick={() => handleRedirect("accounts")}
                    >
                      {user?.organisation && user?.organisation?.companyToken
                        ? user.organisation.companyToken
                        : "Company"}
                    </Menu.Item>
                    <Menu.Item
                      key="contacts"
                      icon={
                        <img
                          src={
                            currentTab === "contacts"
                              ? CONTACT_ICON_WHITE
                              : CONTACT_ICON_ORANGE
                          }
                          alt="Contacts"
                        />
                      }
                      onClick={() => handleRedirect("contacts")}
                    >
                      {user?.organisation && user?.organisation?.contactToken
                        ? user.organisation.contactToken
                        : "Contacts"}
                    </Menu.Item>
                    <Menu.Item
                      key="leads"
                      icon={
                        <img
                          src={
                            currentTab === "leads"
                              ? LEADS_ICON_WHITE
                              : LEADS_ICON_ORANGE
                          }
                          alt="Leads"
                        />
                      }
                      onClick={() => handleRedirect("leads")}
                    >
                      Leads
                    </Menu.Item>
                    <Menu.Item
                      key="opportunities"
                      icon={
                        <img
                          src={
                            currentTab === "opportunities"
                              ? OPPOTUNITIES_ICON_WHITE
                              : OPPOTUNITIES_ICON_ORANGE
                          }
                          alt="Opportunities"
                        />
                      }
                      onClick={() => handleRedirect("opportunities")}
                    >
                      Opportunities
                    </Menu.Item>

                    <Menu.Item
                      key="activities"
                      icon={
                        <img
                          src={
                            currentTab === "activities"
                              ? ACTIVITIES_ICON_WHITE
                              : ACTIVITIES_ICON_ORANGE
                          }
                          alt="Activities"
                        />
                      }
                      onClick={() => handleRedirect("activity")}
                    >
                      Activities
                    </Menu.Item>
                    <Menu.Item
                      key="notes"
                      icon={
                        <img
                          src={
                            currentTab === "notes"
                              ? NOTES_ICON_WHITE
                              : NOTES_ICON_ORANGE
                          }
                          alt="Notes"
                        />
                      }
                      onClick={() => handleRedirect("notes")}
                    >
                      Notes
                    </Menu.Item>
                    <Menu.Item
                      key="calendar"
                      icon={
                        <img
                          src={
                            currentTab === "calendar"
                              ? CALENDAR_ICON_WHITE
                              : CALENDAR_ICON_ORANGE
                          }
                          alt="calendar"
                        />
                      }
                      onClick={() => handleRedirect("calendar")}
                    >
                      Calendar
                    </Menu.Item>
                  </>
                )}
              </Menu>
            </div>
          </Sider>
          <Layout>
            <div
              style={{
                minHeight: "100vh",
                overflowY: "scroll",
              }}
              className="layoutContent"
            >
              <Content>
                <LoggedInRouteConfig />
              </Content>
            </div>
          </Layout>
        </Layout>
      </Layout>
    </div>
  );
}

export default LayoutComponent;
