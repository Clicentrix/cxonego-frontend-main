import {
  Avatar,
  Button,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  Skeleton,
  Spin,
  Switch,
  Tooltip,
  message,
} from "antd";
import {
  CHECK_ICON,
  PAYMENT_FAILURE_GIF,
  PAYMENT_SUCCESS_GIF,
  PROFILE_PIC,
} from "../../utilities/common/imagesImports";
import { RootState } from "../../redux/app/store";
import { useAppDispatch, useAppSelector } from "../../redux/app/hooks";
import { useEffect, useState } from "react";
import "../../styles/subscription/pricingAndPlans.css";
import "../../styles/subscription/profileSubscription.css";
import {
  blockUserAndByIdAndGetUserById,
  deleteUserFromInvitedArray,
  getUserById,
  inviteTeammatesLoggedInAndGetUserDetails,
  updateUserRoleByAdmin,
} from "../../redux/features/authenticationSlice";
import { CheckCircleOutlined, DeleteOutlined } from "@ant-design/icons";
import { DataGrid, GridCellParams } from "@mui/x-data-grid";
import { emptyValue } from "../../utilities/common/commonFunctions/handleBack";
import {
  countryFlags,
  userRolesOptions,
  userRolesOptionsToInvite,
} from "../../utilities/common/dataArrays";
import {
  ChangeUserRole,
  InviteUser,
} from "../../utilities/common/exportDataTypes/userDataTypes";
import moment from "moment";
import {
  ContactAdminForCustomPlan,
  SubscriptionAdd,
} from "../../utilities/common/exportDataTypes/subscriptionDataTypes";
import {
  createRequestContactAdmin,
  fetchAllPlans,
  setPaymentLoader,
} from "../../redux/features/subscriptionSlice";
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
  const { getPlanLoader, paymentLoader, planSubscription, contactAdminLoader } =
    useAppSelector((state: RootState) => state.subscriptions);
  const {
    getUserLoader,
    invitedUsers,
    inviteTeamMatesLoader,
    user,
    subscription,
    // updateUserRoleLoader,
  } = useAppSelector((state: RootState) => state.authentication);
  const { screenWidth } = useAppSelector((state: RootState) => state.referrals);
  const userId = localStorage.getItem("userId");
  const planFeatures = subscription?.features
    ?.split(",")
    .map((item) => item.trim());
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [invitePayload, setInvitePayload] = useState<InviteUser[]>([]);
  const [isEditable, setEditable] = useState<string>("");
  const [upgradeModal, setUpgradeModal] = useState<boolean>(false);
  const [upgradeSubModal, setUpgradeSubModal] = useState<boolean>(false);
  const [current, setCurrent] = useState(0);
  const [paymentStatus, setPaymentStatus] = useState<boolean>(false);
  const [paymentTrasactionId, setPaymentTrasactionId] = useState<string>("");
  const [contactAdminModal, setContactAdminModal] = useState<boolean>(false);
  const [contactAdminPage, setContactAdminPage] = useState<number>(0);

  const [createSubscriptionPayload, setCreateSubscriptionPayload] = useState({
    planId: planSubscription?.planId,
    userId: user?.userId!,
    currency: user?.currency,
  });

  const currentDate = new Date(); // Current date
  const endDate = new Date(subscription?.endDateTime!); // Subscription end date

  // Subtract 2 months from the end date
  const twoMonthsBeforeEnd = new Date(endDate.setMonth(endDate.getMonth() - 2));

  const [contactAdminForm] = Form.useForm();

  const [contactAdminPayload, setContactAdminPayload] =
    useState<ContactAdminForCustomPlan>({
      name: user?.firstName! + " " + user?.lastName!,
      email: user?.email,
      phone: user?.phone,
      countryCode: user?.countryCode,
      accessToken: accessToken,
      message: "",
      organization: user?.companyName,
      onboardingStatus: "Pending",
    });

  const [member, setMember] = useState<InviteUser>({
    email: null,
    company: user?.companyName,
    role: null,
    organizationId: user?.organizationId,
  });
  const [updateUser, setUpdateUser] = useState<ChangeUserRole>({
    userId: null,
    role: null,
  });

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleSubmit = async () => {
    await dispatch(
      inviteTeammatesLoggedInAndGetUserDetails({
        invites: invitePayload,
        hostUserId: userId,
      })
    );
    await setIsModalOpen(false);
    await setInvitePayload([]);
  };
  const handleInputChangeInvite = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setMember({
      ...member,
      [name]: value,
    });
  };
  const handleAddMember = async () => {
    if (member?.email === null || member?.email === "") {
      message.warning("Please enter an email address and user role to invite");
    } else if (invitePayload?.length === 2) {
      message.warning(
        "You can invite only 2 users, contact admin for more information"
      );
    } else {
      await setInvitePayload([...invitePayload, member]);
      await setMember({ ...member, email: "", role: "" });
      await inviteTeamForm?.setFieldsValue({ ...member, email: "", role: "" });
    }
  };

  const handleChangeRole = async () => {
    await dispatch(updateUserRoleByAdmin(updateUser));
    await setEditable("");
  };

  const handleBlockUser = async (userId: string, isBlocked: boolean) => {
    const blockUserPayload = {
      userId: userId,
      isBlocked: isBlocked,
    };
    await dispatch(blockUserAndByIdAndGetUserById(blockUserPayload));
    // await setPopconfirmVisible(false);
  };

  const handleDeleteMember = async (userEmail: string) => {
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
      renderCell: (params: GridCellParams) => (
        <div>{params?.row?.userId || emptyValue}</div>
      ),
      width: 100,
    },

    {
      headerName: "FULL NAME",
      field: "name",
      width: 150,
      renderCell: (params: GridCellParams) => (
        <div>{params?.row?.name || emptyValue}</div>
      ),
    },
    {
      headerName: "EMAIL",
      field: "email",
      renderCell: (params: GridCellParams) => (
        <div>{params?.row?.email || emptyValue}</div>
      ),
      width: 350,
    },
    {
      headerName: "USER ROLE",
      field: "role",
      renderCell: (params: GridCellParams) => (
        <>
          <div>
            <Select
              style={{ width: "80%", marginRight: "10px" }}
              placeholder="Select role"
              defaultValue={params?.row?.role}
              onChange={async (value) => {
                await setUpdateUser({
                  ...updateUser,
                  role: value,
                  userId: params?.row?.id,
                });
                await setEditable(params?.row?.id);
              }}
              disabled={params?.row?.onboardingStatus !== "ONBOARDED"}
            >
              {userRolesOptions?.map((option, index) => (
                <Select.Option key={index} value={option.value}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
            {isEditable === params?.row?.id ? (
              <CheckCircleOutlined
                className="cursorPointer"
                onClick={handleChangeRole}
              />
            ) : (
              <></>
            )}
          </div>
        </>
      ),
      width: 250,
    },
    {
      headerName: "ONBOARDING STATUS",
      field: "onboardingStatus",
      renderCell: (params: GridCellParams) => (
        <div>{params?.row?.onboardingStatus || emptyValue}</div>
      ),
      width: 200,
    },
    {
      field: "deleteUser",
      headerName: "Delete User",
      width: 150,
      renderCell: (params: GridCellParams) =>
        params.row.role === "ADMIN" ||
        params.row.onboardingStatus === "ONBOARDED" ? (
          <DeleteOutlined className="deleteIconInTable" disabled />
        ) : (
          <Popconfirm
            title="Delete this User"
            description="Are you sure you want to delete this user?"
            onConfirm={() => handleDeleteMember(params.row.email)}
            okText="Yes"
            cancelText="Cancel"
          >
            <DeleteOutlined className="deleteIconInTable" />
          </Popconfirm>
        ),
    },
    {
      field: "isBlocked",
      headerName: "Account Blocked",
      width: 150,
      renderCell: (params: GridCellParams) => (
        <div>
          {/* <Popconfirm
            title="Block this User"
            description="Are you sure you want to block this user?"
            onConfirm={() => handleBlockUser(
              params?.row?.id,
              params?.row?.isBlocked ? false : true
            )}
            okText="Yes"
            cancelText="Cancel"
            onCancel={handleCancelPopconfirm}
          // open={popconfirmVisible}
          > */}
          <Switch
            defaultChecked={params?.row?.isBlocked}
            disabled={
              params?.row?.onboardingStatus !== "ONBOARDED" ||
              params?.row?.isBlocked
            }
            onChange={() =>
              handleBlockUser(
                params?.row?.id,
                params?.row?.isBlocked ? false : true
              )
            }
          />
          {/* </Popconfirm> */}
        </div>
      ),
    },
  ];

  const handleUpgrade = async () => {
    await dispatch(fetchAllPlans())
      .then((res) => {
        console.log("get all plansghj", res?.payload?.data?.plans);
        if (res?.payload?.data?.plans?.length > 0) {
          const subscriptionPlan = res?.payload?.data?.plans?.filter(
            (plan: any) => plan?.planType === "Subscription"
          );
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
      const res = await loadScript(razorpay_script_url);
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
      } catch (err) {
        message.error("Error in verification of subscription");
        console.log("Error in payment", err);
        await setCurrent((prev) => prev + 1);
        setPaymentStatus(false);
      }
    } catch (err) {
      message.error("Error in subscription creation, please try again");
      await dispatch(setPaymentLoader(false));
    }
  }
  const nextStep = async () => {
    if (current === 0) {
      await displayRazorpay(createSubscriptionPayload);
    } else if (current === 1) {
      if (paymentStatus) {
        // message.success("Subscription upgraded successfully")
        setUpgradeSubModal(false);
        setUpgradeModal(false);
      } else {
        await displayRazorpay({
          planId: planSubscription?.planId,
          userId: user?.userId!,
          currency: user?.currency,
        });
      }
    }
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

  const handleContactAdmin = async () => {
    await dispatch(createRequestContactAdmin(contactAdminPayload));
    // await setContactAdminModal(false); //
    await setContactAdminPage(contactAdminPage + 1);
    await setUpgradeModal(false); //
  };

  const handleCancelContactAdmin = () => {
    setContactAdminModal(false);
  };

  const handleSelectChangeContactAdmin = (value: string, name: string) => {
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

  return (
    <>
      <div className="listViewBackWrapper">
        <Modal
          open={isModalOpen}
          onOk={handleSubmit}
          onCancel={handleCancel}
          footer={false}
        >
          <div className="addContactFormDiv">
            <div className="addContactTitle">Invite New teammates</div>

            <div className="addContactFormWrapper">
              <div className="loginMiddleDiv">
                <Form
                  name="loginForm"
                  className="inviteForm"
                  onFinish={handleSubmit}
                  initialValues={member}
                  form={inviteTeamForm}
                >
                  <div className="loginSubHeading"></div>
                  <div className="loginMidContainer">
                    <Form.Item
                      name="email"
                      label="Email"
                      className="loginFormInput"
                      rules={[
                        {
                          type: "email",
                          message: "The input is not valid E-mail!",
                        },
                      ]}
                    >
                      <Input
                        onChange={handleInputChangeInvite}
                        placeholder="Enter Teammate's email address"
                        name="email"
                      />
                    </Form.Item>
                    <Form.Item
                      name="role"
                      label="Assign User's Role"
                      className="loginFormInput"
                    >
                      <Select
                        onChange={(value) =>
                          setMember({
                            ...member,
                            role: value,
                          })
                        }
                        placeholder="Select role"
                        options={userRolesOptionsToInvite}
                      />
                    </Form.Item>
                    <div className="profileInviteBtnsWrapper">
                      <Form.Item style={{ marginTop: "20px", width: "100%" }}>
                        <Button
                          type="primary"
                          // htmlType="submit"
                          className="profileInviteSendBtn2"
                          onClick={handleAddMember}
                        >
                          Add Member
                        </Button>
                      </Form.Item>
                    </div>
                    <div className="inviteesWrapper">
                      {invitePayload?.length > 0
                        ? invitePayload?.map((item, index) => {
                            return (
                              <>
                                <div
                                  className="inviteSelectedPeopleWrapper"
                                  key={index}
                                >
                                  <div className="inviteSelectedPeopleInnerWrapper">
                                    <Avatar
                                      src={PROFILE_PIC}
                                      className="inviteSelectedPeopleAvatar"
                                    >
                                      RW
                                    </Avatar>
                                    <div className="inviteSelectedPeopleEmail">
                                      {item?.email}
                                    </div>
                                  </div>
                                  <div className="inviteSelectedPeopleRole">
                                    {item?.role}
                                  </div>
                                  {/* <DeleteOutlined
                              className="inviteSelectedPeopleDelete"
                              // onClick={() => handleDeleteMember(item)}
                            /> */}
                                </div>
                              </>
                            );
                          })
                        : null}
                    </div>
                  </div>

                  <div className="profileInviteBtnsWrapper">
                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        className="profileInviteSendBtn"
                        loading={inviteTeamMatesLoader}
                        style={{ width: "100%" }}
                        disabled={invitePayload?.length === 0}
                      >
                        Send Invitation
                      </Button>
                    </Form.Item>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </Modal>
        <Modal
          open={upgradeModal}
          footer={false}
          closable={true}
          onClose={handleClose}
          onCancel={handleClose}
        >
          <div className="addAccountFormDiv">
            <div className="subscriptionWindowTitle">
              Your Subscription has expired, Please upgrade it.
            </div>
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
          open={upgradeSubModal}
          // onOk={handleSubmitUpgradeSub}
          onCancel={handleCancelUpgradeSub}
          footer={false}
        >
          <div className="addAccountFormDiv">
            {current === 0 ? (
              <div className="reviewWrapper">
                <div>
                  <div className="reviewTitle">Review & Confirm Details</div>
                  <div className="reviewSubTitle">
                    Verify your information to ensure accuracy before
                    proceeding.
                  </div>
                </div>
                {getPlanLoader ? (
                  <Skeleton />
                ) : (
                  <>
                    <div className="reviewInnerDiv">
                      <div className="reviewBlueTag">
                        {planSubscription?.planname}
                      </div>
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
                  </>
                )}
              </div>
            ) : current === 1 ? (
              paymentStatus ? (
                <div className="pricingSubWrapper">
                  <div className="pricingTitle">
                    Subscription upgraded successfully!
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
                      Oops! Something went wrong with your payment. Please check
                      your details and try again.
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
                  Thank You for your details, someone from our team will contact
                  you shortly
                </div>
                {/* <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="userOnboardingSubmitBtn"
                    style={{ marginTop: "20px" }}
                    onClick={() => handleBackToLogin()}
                  >
                    Back to Home Page
                  </Button>
                </Form.Item> */}
              </div>
            ) : (
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
                            value={user?.countryCode}
                            style={{ width: "250px" }}
                            onChange={(value) =>
                              handleSelectChangeContactAdmin(
                                value,
                                "countryCode"
                              )
                            }
                            options={countryFlags?.map((flag) => ({
                              value: flag.key,
                              label: (
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
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
                            value={user?.phone!}
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
              </div>
            )}
          </div>
        </Modal>
        <div className="profileTopDiv">
          <div className="profilePageTitle">Subscription summary</div>
        </div>
        <Spin spinning={getPlanLoader} tip="Loading...">
          <>
            {subscription?.subscriptionId ? (
              <div className="pricingOuterDivProfile">
                <div className="profilePageSubTitle">
                  Current Plan Subscription Status :{" "}
                  {subscription?.subscription_status}
                </div>
                <Spin spinning={getUserLoader} tip="Loading...">
                  <div>
                    <div className="pricingInnerDivProfile">
                      <div className="pricingDateWrapper">
                        <div className="pricingBlueTag">
                          {" "}
                          {subscription?.planName}
                        </div>
                        {screenWidth > 768 ? (
                          <div className="pricingSubDateWrapper">
                            <span className="subscriptionDate">
                              Start Date:{" "}
                              {moment(subscription?.startDateTime).format(
                                "MMMM Do YYYY"
                              )}
                            </span>
                            <span className="subscriptionDate2">
                              End Date :{" "}
                              {moment(subscription?.endDateTime).format(
                                "MMMM Do YYYY"
                              )}
                            </span>
                          </div>
                        ) : null}
                      </div>

                      <div className="pricingInner2Div">
                        {screenWidth < 768 ? (
                          <div>
                            <div className="subscriptionDate">
                              Start Date :{" "}
                              {moment(subscription?.startDateTime).format(
                                "MMMM Do YYYY"
                              )}
                            </div>
                            <div className="subscriptionDate">
                              End Date :{" "}
                              {moment(subscription?.endDateTime).format(
                                "MMMM Do YYYY"
                              )}
                            </div>
                          </div>
                        ) : null}
                        <div className="pricingMiddleFlex">
                          <div className="pricingTextDetails">
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
                          <div className="pricingRateDiv">
                            {user?.role === "ADMIN" ? (
                              <div className="pricingRateWrapper">
                                ₹{" "}
                                <span className="pricingRateEmphasized">
                                  {subscription?.planAmount}
                                </span>{" "}
                                {subscription?.planType === "Trial"
                                  ? `For 14 days`
                                  : `Per user per month (billed annually)`}
                              </div>
                            ) : null}
                            {(user?.role === "ADMIN" &&
                              subscription?.planType === "Trial") ||
                            (currentDate >= twoMonthsBeforeEnd &&
                              currentDate < endDate) ? (
                              <div className="pricingSubmitBtnWrapper">
                                <Form.Item>
                                  <Button
                                    type="primary"
                                    className="subscribeBtn"
                                    onClick={() => handleUpgrade()}
                                    disabled={
                                      currentDate >= twoMonthsBeforeEnd &&
                                      currentDate < endDate
                                    }
                                  >
                                    {subscription?.planType === "Trial"
                                      ? `Upgrade Plan`
                                      : `Extend`}
                                  </Button>
                                </Form.Item>
                              </div>
                            ) : (
                              <></>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Spin>
              </div>
            ) : (
              <div className="noActivePlanMessage">
                You don't have any active subscription plan, Please contact
                admin to subscribe.
              </div>
            )}
            {user?.role === "ADMIN" ? (
              <>
                <div className="pricingOuterDivProfileTable">
                  <Spin spinning={getUserLoader} tip="Loading...">
                    <div>
                      <div className="subscriptionAddInviteWrapper">
                        <div className="profilePageSubTitle">
                          Organization Members
                        </div>
                        <Tooltip
                          title={
                            invitedUsers?.length >=
                            parseInt(subscription?.noOfUsers!)
                              ? "You have invited maximum number of users as per your plan"
                              : subscription?.subscription_status !== "Active"
                              ? "You don't have any active subscription plan"
                              : ""
                          }
                        >
                          <Button
                            className="subscriptionBtn"
                            onClick={() => setIsModalOpen(true)}
                            disabled={
                              invitedUsers?.length >=
                                parseInt(subscription?.noOfUsers!) ||
                              subscription?.subscription_status !== "Active"
                            }
                          >
                            Add New Member
                          </Button>
                        </Tooltip>
                      </div>
                      <div className="pricingInnerDivProfile">
                        <div style={{ height: "auto" }}>
                          <DataGrid
                            rows={invitedUsers}
                            columns={columns}
                            loading={getUserLoader}
                            key={"userId"}
                            getRowId={(row) => row?.userId!}
                            checkboxSelection={false}
                            paginationMode="client"
                          />
                        </div>
                      </div>
                    </div>
                  </Spin>
                </div>
              </>
            ) : (
              <></>
            )}
          </>
        </Spin>
      </div>
    </>
  );
};

export default SubscriptionPage;
