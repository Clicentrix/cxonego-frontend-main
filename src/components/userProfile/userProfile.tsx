import * as XLSX from "xlsx";
import "../../styles/userProfile/userProfile.css";
import {
  countryFlags,
  currencyOptions,
} from "../../utilities/common/dataArrays";
import {
  Avatar,
  Button,
  Form,
  Input,
  Popconfirm,
  Select,
  Skeleton,
  message,
} from "antd";
import { useAppDispatch, useAppSelector } from "../../redux/app/hooks";
import {
  getUserById,
  handleInputChangeReducerAuth,
  updateUserProfileById,
} from "../../redux/features/authenticationSlice";
import { RootState } from "../../redux/app/store";
import { useEffect, useState } from "react";
import { ShortUserProfile } from "../../utilities/common/exportDataTypes/userDataTypes";
import { getAllAccounts } from "../../redux/features/accountsSlice";
import { getAllLeads } from "../../redux/features/leadSlice";
import { getAllContacts } from "../../redux/features/contactsSlice";
import { getAllActivities } from "../../redux/features/activitySlice";
import { getAllOpportunities } from "../../redux/features/opportunitiesSlice";
import { getAllReferrals } from "../../redux/features/referralsSlice";
import { getAllNotes } from "../../redux/features/noteSlice";
import { getAllAppointments } from "../../redux/features/calendarSlice";

const UserProfileComponent = () => {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const { user, getUserLoader, updateUserLoader } = useAppSelector(
    (state: RootState) => state.authentication
  );
  const { leads } = useAppSelector((state: RootState) => state.leads);
  const { accounts } = useAppSelector((state: RootState) => state.accounts);
  const { contacts } = useAppSelector((state: RootState) => state.contacts);
  const { opportunities } = useAppSelector(
    (state: RootState) => state.opportunities
  );
  const { activities } = useAppSelector((state: RootState) => state.activities);
  const { referrals } = useAppSelector((state: RootState) => state.referrals);
  const { notes } = useAppSelector((state: RootState) => state.notes);
  const { appointments } = useAppSelector(
    (state: RootState) => state.appointments
  );

  console.log("leads", leads[0]);
  console.log("accounts", accounts[0]);
  console.log("contacts", contacts[0]);
  console.log("opportunities", opportunities[0]);
  console.log("activities", activities[0]);
  console.log("referrals", referrals[0]);
  console.log("notes", notes[0]);
  console.log("appointments", appointments[0]);

  const [editable, setEditable] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<ShortUserProfile>({
    firstName: "Rahul Singh",
    lastName: "Patil",
    phone: "9453772548",
    countryCode: "+91",
    currency: "INR",
    userId: user?.userId!,
  });
  // const handleThemeChange = (name: string, value: string) => {
  //   dispatch(
  //     handleInputChangeReducerAuth({
  //       [name]: value,
  //     })
  //   );
  // };
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    dispatch(
      handleInputChangeReducerAuth({
        [name]: value,
      })
    );
    setUserProfile({ ...userProfile, [name]: value });
  };
  const handleSelectChange = (value: string, name: string) => {
    dispatch(
      handleInputChangeReducerAuth({
        [name]: value,
      })
    );
    setUserProfile({ ...userProfile, [name]: value });
  };
  const handleSubmit = async () => {
    dispatch(updateUserProfileById(userProfile))
      .then(() => setEditable(false))
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    dispatch(getUserById());
    dispatch(getAllAccounts());
    dispatch(getAllLeads());
    dispatch(getAllContacts());
    dispatch(getAllActivities());
    dispatch(getAllOpportunities());
    dispatch(getAllReferrals());
    dispatch(getAllNotes());
    dispatch(getAllAppointments());
  }, []);
  useEffect(() => {
    form.setFieldsValue(user);
  }, [user]);
  useEffect(() => {
    setUserProfile({
      firstName: user?.firstName,
      lastName: user?.lastName,
      phone: user?.phone,
      countryCode: user?.countryCode,
      currency: user?.currency,
      userId: user?.userId!,
    });
  }, [user]);

  function handleExport() {
    // Create a new workbook and add the worksheet
    const workbook = XLSX.utils.book_new();
    let exportedFields = "";
    if (leads.length) {
      const worksheet = XLSX.utils.json_to_sheet(leads);
      XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");
      exportedFields += "leads,";
    }
    if (accounts.length) {
      const worksheet = XLSX.utils.json_to_sheet(accounts);
      XLSX.utils.book_append_sheet(workbook, worksheet, "Accounts");
      exportedFields += "accounts,";
    }
    if (contacts.length) {
      const worksheet = XLSX.utils.json_to_sheet(contacts);
      XLSX.utils.book_append_sheet(workbook, worksheet, "Contacts");
      exportedFields += "contacts,";
    }
    if (opportunities.length) {
      const worksheet = XLSX.utils.json_to_sheet(opportunities);
      XLSX.utils.book_append_sheet(workbook, worksheet, "Opportunities");
      exportedFields += "opportunities,";
    }
    if (activities.length) {
      const worksheet = XLSX.utils.json_to_sheet(activities);
      XLSX.utils.book_append_sheet(workbook, worksheet, "Activities");
      exportedFields += "activities,";
    }
    if (referrals.length) {
      const worksheet = XLSX.utils.json_to_sheet(referrals);
      XLSX.utils.book_append_sheet(workbook, worksheet, "Referalls");
      exportedFields += "referrals,";
    }
    if (notes.length) {
      const worksheet = XLSX.utils.json_to_sheet(notes);
      XLSX.utils.book_append_sheet(workbook, worksheet, "Notes");
      exportedFields += "notes,";
    }
    if (appointments.length) {
      const formattedAppointments = appointments.map((appointment: any) => {
        const { orgnizerId, calparticipaters, ...formattedAppointment } =
          appointment;
        return formattedAppointment;
      });
      const worksheet = XLSX.utils.json_to_sheet(formattedAppointments);
      XLSX.utils.book_append_sheet(workbook, worksheet, "Appointments");
      exportedFields += "appointments,";
    }

    if (workbook.SheetNames.length > 0) {
      // Export the workbook to a file
      XLSX.writeFile(workbook, "data.xlsx");
      exportedFields = exportedFields.slice(0, -1);
      // unExportedFields = unExportedFields.slice(0, -1);
      message.success("Data exported successfully");
      message.success(`Exported fields : ${exportedFields}`);
      // message.success(`Unexported fields : ${unExportedFields}, no data found.`);
    } else {
      message.error("No data to export");
    }
  }

  return (
    <>
      <div className="listViewBackWrapper">
        <Form
          form={form}
          name="loginForm"
          onFinish={handleSubmit}
          initialValues={user}
        >
          <div className="profileTopDiv">
            <div className="profilePageTitle">General Settings</div>

            {user.role === "ADMIN" && (
              <Popconfirm
                title="Export Data"
                description={
                  <div>
                    <div>
                      This will export data from your subscription to excel.
                    </div>
                    <div>
                      {" "}
                      Are you sure you want to continue with the operation?
                    </div>
                  </div>
                }
                onConfirm={handleExport}
                okText="Yes"
                cancelText="Cancel"
              >

                <Button
                  type="primary"
                  // htmlType="submit"
                  className="profileSubmitBtn"
                // loading={updateUserLoader}
                >
                  Export All Data
                </Button>
              </Popconfirm>
            )}
          </div>
          {getUserLoader ? (
            <Skeleton />
          ) : (
            <>
              <div className="generalWrapper">
                <div className="profilePicWrapperDiv">
                  <Avatar className="profilePicAvatar">
                    {user?.firstName?.slice(0, 1)}
                    {user?.lastName?.slice(0, 1)}
                  </Avatar>
                  {/* <div className="themeColorDiv">
              {themeColorOptions?.map((item, index) => {
                return (
                  <div
                    key={index}
                    //   onClick={() => handleThemeChange("theme", item?.value)}
                    className="userOnBoardingThemeColor"
                    style={{
                      backgroundColor: item?.value,
                      // border: "2px solid #000",
                    }}
                  ></div>
                );
              })}
            </div> */}
                </div>
                <div className="generalFlexItem">
                  <div className="profileFormItemDiv">
                    <Form.Item
                      name="firstName"
                      label="First Name"
                      className="profileFormInput"
                      rules={[
                        {
                          required: true,
                          message: "This field is mandatory!",
                        },
                      ]}
                    >
                      <Input
                        onChange={handleInputChange}
                        name="firstName"
                        type="string"
                        placeholder="Please enter here"
                        disabled={!editable}
                      />
                    </Form.Item>
                    <Form.Item
                      name="lastName"
                      label="Last Name"
                      className="profileFormInput"
                      rules={[
                        {
                          required: true,
                          message: "This field is mandatory!",
                        },
                      ]}
                    >
                      <Input
                        onChange={handleInputChange}
                        name="lastName"
                        type="string"
                        placeholder="Please enter here"
                        disabled={!editable}
                      />
                    </Form.Item>
                  </div>
                  <div className="profileFormItemDiv">
                    <Form.Item
                      name="email"
                      label="Email"
                      className="profileFormInput"
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
                        onChange={handleInputChange}
                        name="email"
                        placeholder="Please enter here"
                        disabled={true}
                      />
                    </Form.Item>
                    <Form.Item
                      name="phone"
                      label="Contact No."
                      className="profileFormInput"
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
                          disabled={!editable}
                          value={user?.countryCode!}
                          style={{ width: "200px" }}
                          onChange={(value) =>
                            handleSelectChange(value, "countryCode")
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
                          onChange={handleInputChange}
                          name="phone"
                          type="tel"
                          placeholder="Please enter here"
                          value={user?.phone!}
                          disabled={!editable}
                        />
                      </div>
                    </Form.Item>
                  </div>
                  <div className="profileFormItemDiv">
                    <Form.Item
                      name="currency"
                      label="Currency"
                      className="profileFormInput"
                      rules={[
                        {
                          required: false,
                          message: "This field is mandatory!",
                        },
                      ]}
                    >
                      <Select
                        onChange={(value) =>
                          handleSelectChange(value, "currency")
                        }
                        options={currencyOptions}
                        disabled={!editable}
                      />
                    </Form.Item>
                    <Form.Item
                      name="role"
                      label="Role"
                      className="profileFormInput"
                      rules={[
                        {
                          required: false,
                          message: "This field is mandatory!",
                        },
                      ]}
                    >
                      <Input
                        onChange={handleInputChange}
                        name="Role"
                        type="string"
                        placeholder="Please enter here"
                        disabled
                      />
                    </Form.Item>
                  </div>
                  <div className="profileFormItemDiv">
                    <Form.Item
                      name="companyName"
                      label="Organization"
                      className="profileFormInput"
                      rules={[
                        {
                          required: true,
                          message: "This field is mandatory!",
                        },
                      ]}
                    >
                      <Input
                        onChange={handleInputChange}
                        name="companyName"
                        type="string"
                        placeholder="Please enter here"
                        disabled
                      />
                    </Form.Item>
                    <Form.Item className="profileFormInput"></Form.Item>
                  </div>
                  <div className="profileSubmitBtnDiv">
                    <Form.Item>
                      <div className="actionButtons">
                        <Button
                          onClick={() => setEditable(true)}
                          className="profileEditBtn"
                        >
                          Edit
                        </Button>
                        <Button
                          type="primary"
                          htmlType="submit"
                          className="profileSubmitBtn"
                          loading={updateUserLoader}
                        >
                          Save
                        </Button>
                      </div>
                    </Form.Item>
                  </div>
                </div>
              </div>
            </>
          )}
        </Form>
      </div>
    </>
  );
};

export default UserProfileComponent;
