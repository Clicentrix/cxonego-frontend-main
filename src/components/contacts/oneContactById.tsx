import { Avatar, Button, Form, Input, Popconfirm, Select, Spin, Tooltip, Alert } from "antd";
import { useEffect, useState, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/app/hooks";
import { RootState } from "../../redux/app/store";
import "../../styles/contacts/contactsView.css";
import {
  conactsRelatedViewOptions,
  contactTypesOptions,
  countryFlags,
  countryNames,
  industryTypeValuesArray,
  stateNames,
  statusOptions,
  yesOrNo,
} from "../../utilities/common/dataArrays";
import TextArea from "antd/es/input/TextArea";
import {
  DESCRIPTION_ICON_ORANGE,
  GENERAL_INFO_ICON_ORANGE,
  LOCATION_ICON_ORANGE,
  OWNER,
} from "../../utilities/common/imagesImports";
import {
  getContactById,
  handleInputChangeReducerContact,
  setEditableMode,
  updateContactByIdAndGetAudits,
} from "../../redux/features/contactsSlice";
import { useParams } from "react-router-dom";
import { handleBack } from "../../utilities/common/commonFunctions/handleBack";
import {
  LeftOutlined,
  RightOutlined,
  CheckCircleOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { fetchAllAuditsByModuleId } from "../../redux/features/auditSlice";
import AuditWindow from "../audit/auditWindow";
import { fetchAllAccountsWithoutParams } from "../../redux/features/accountsSlice";
import AllRelatedLeads from "../leads/relatedLeadsListView";
import AllRelatedOpportunities from "../opportunities/relatedOpportunitiesListView";
import AllRelatedActivities from "../activities/relatedActivitiesListView";
import AllRelatedNotes from "../notes/relatedNotesListView";
import RelatedDocumentsListView from "../documents/RelatedDocumentsListView";
import { fetchAllSalesPersonByUserId } from "../../redux/features/organizationSlice";
import { extractContactId } from "../../utils/contactUtils";

const OneContactById: React.FC = () => {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const paramsContactId = useParams();
  
  // Validate and extract contactId with error detection
  const rawContactId = paramsContactId?.contactId;
  let contactId = '';
  
  // Special handling for the "[object Object]" string which indicates a bug
  if (rawContactId === '[object Object]') {
    console.error('=== DEBUG: Invalid contact ID format "[object Object]" detected ===');
    contactId = '';
  } else {
    contactId = extractContactId(rawContactId);
  }
  
  console.log('=== DEBUG: OneContactById RENDER ===');
  console.log('Raw contactId from URL:', rawContactId);
  console.log('Sanitized contactId:', contactId);
  
  const { contact, addContactLoader, getContactLoader, editable } =
    useAppSelector((state: RootState) => state.contacts);
  
  console.log('contact from Redux:', contact);
  console.log('contactLoader state:', { addContactLoader, getContactLoader, editable });
  
  const { accounts } = useAppSelector((state: RootState) => state.accounts);
  const { user } = useAppSelector((state: RootState) => state.authentication);

  const [relatedView, setRelatedView] = useState<string>("SELECT");
  const [error, setError] = useState<string | null>(null);
  
  // Check for invalid contactId immediately
  useEffect(() => {
    if (rawContactId === '[object Object]') {
      setError('Invalid contact ID format. This may happen when clicking on a contact link from an invalid source.');
    }
  }, [rawContactId]);

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('Global error caught:', event.error);
      console.error('Error message:', event.message);
      console.error('Error stack:', event.error?.stack);
      setError(`Unhandled error: ${event.message}`);
    };

    window.addEventListener('error', handleError);
    
    console.log('=== DEBUG: Error handler attached ===');
    
    return () => {
      window.removeEventListener('error', handleError);
    };
  }, []);

  const companyOptions = accounts?.map((item) => {
    return { ...item, value: item?.accountId, label: item?.accountName };
  });
  const { screenWidth } = useAppSelector((state: RootState) => state.referrals);
  const [isOtherIndutry, setIsOtherIndutry] = useState<boolean>(false);
  const contactToken =
    user?.organisation && user?.organisation?.contactToken
      ? ` ${user.organisation.contactToken}`
      : " Contacts";
  const OWNER_AVATAR = `${contact?.owner?.firstName
    ?.slice(0, 1)
    ?.toLocaleUpperCase()}
                          ${contact?.owner?.lastName
      ?.slice(0, 1)
      ?.toLocaleUpperCase()}`;

  const OWNER_NAME = `${contact?.owner?.firstName}
                          ${contact?.owner?.lastName}`;

  const [ownerId, setOwnerId] = useState<string>("")
  const [popconfirmVisible, setPopconfirmVisible] = useState<boolean>(false);
  const { salesPersonData } = useAppSelector(
    (state: RootState) => state.organisations
  );

  const confirmChange = async () => {
    await dispatch(
      updateContactByIdAndGetAudits({ ...contact, owner: { userId: ownerId } })
    );
    await dispatch(setEditableMode(false));
    await setPopconfirmVisible(false);
  };

  const cancelChange = () => {
    setPopconfirmVisible(false);
    dispatch(getContactById(contactId!))
  };
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    dispatch(
      handleInputChangeReducerContact({
        [name]: value,
      })
    );
  };

  const handleSelectChange = (value: string, name: string) => {
    if (name === "industry" && value === "") {
      setIsOtherIndutry(true);
    } else if (name === "industry" && value !== "") {
      setIsOtherIndutry(false);
      dispatch(
        handleInputChangeReducerContact({
          [name]: value,
        })
      );
    } else {
      dispatch(
        handleInputChangeReducerContact({
          [name]: value,
        })
      );
    }
  };

  const handleSelectChangeView = (value: string) => {
    console.log('=== DEBUG: Changing related view to:', value);
    setRelatedView(value);
  };
  const handleSubmit = () => {
    if (editable) {
      dispatch(updateContactByIdAndGetAudits(contact));
    } else {
      dispatch(setEditableMode(true));
    }
  };

  useEffect(() => {
    dispatch(fetchAllSalesPersonByUserId());
  }, []);

  useEffect(() => {
    console.log('=== DEBUG: Starting contact fetch useEffect ===');
    
    if (contactId) {
      console.log('Loading contact with ID:', contactId);
      
      if (typeof contactId !== 'string' || contactId.trim() === '') {
        console.error('Invalid contactId format:', contactId);
        setError('Contact ID format is invalid');
        return;
      }
      
      dispatch(setEditableMode(false));
      setError(null);
      
      console.log('Dispatching getContactById action...');
      
      const fetchAction = dispatch(getContactById(contactId));
      console.log('Fetch action dispatched:', fetchAction);
      
      fetchAction
        .unwrap()
        .then(result => {
          console.log('Successfully loaded contact:', result);
          
          if (!result || !result.data) {
            console.warn('Contact data is empty or missing');
          }
        })
        .catch((err) => {
          console.error('Error fetching contact:', err);
          console.error('Error details:', JSON.stringify(err, null, 2));
          setError('Failed to load contact information. Please try again.');
        });
        
      console.log('Dispatching audit fetch...');
      dispatch(
        fetchAllAuditsByModuleId({ moduleName: "contact", moduleId: contactId })
      );
      
      console.log('Dispatching accounts fetch...');
      dispatch(fetchAllAccountsWithoutParams());
    } else {
      console.error('Missing contactId in URL parameters');
      setError("Contact ID is missing or invalid");
    }
  }, [contactId, dispatch]);

  useEffect(() => {
    console.log('=== DEBUG: Form values update effect ===');
    console.log('Current contact data:', contact);
    
    try {
      form.setFieldsValue(contact);
      console.log('Form fields updated successfully');
    } catch (err) {
      console.error('Error updating form fields:', err);
    }
  }, [contact, form]);

  // Add debug log outside of JSX to avoid linter error
  console.log('=== DEBUG: Rendering component with state ===', { error, getContactLoader, contact });
  
  return (
    <div className="oneContactMainWrapper">
      <Spin spinning={getContactLoader} tip="Loading...">
        {error ? (
          <div className="error-message-container">
            <h3>Error</h3>
            <p>{error}</p>
            <Button onClick={() => handleBack()}>Go Back</Button>
          </div>
        ) : (
          <div
            className={
              editable ? "oneContactViewWrapper" : "onceContactViewWrapperNotEdit"
            }
          >
            {contact ? (
              <Form
                form={form}
                name="loginForm"
                onFinish={handleSubmit}
                initialValues={contact}
              >
                <div className="oneOpportunityTopToolbar1">
                  <div className="opportunitysSelectViewWrapper">
                    <div className="opportunitysSelectView1">
                      <LeftOutlined className="backArrow" onClick={handleBack} />
                      <div className="opportunitysViewTitle">{contactToken}</div>
                      <RightOutlined />
                      <div className="opportunitysViewTitle">
                        {`${contact?.firstName} ${contact?.lastName}` || ""}
                      </div>
                    </div>
                    <div className="opportunitysSelectView1">
                      <Select
                        autoFocus
                        value={relatedView}
                        defaultValue="SELECT"
                        onChange={handleSelectChangeView}
                        style={{
                          border: "1px solid var(--gray5)",
                          borderRadius: "4px",
                          width: "160px",
                        }}
                      >
                        {conactsRelatedViewOptions?.map((option, index) => (
                          <Select.Option key={index} value={option.value}>
                            {option.label}
                          </Select.Option>
                        ))}
                      </Select>
                      <Form.Item className="addContactSubmitBtnWrapper">
                        <Button
                          type="primary"
                          htmlType="submit"
                          className="contactEditBtn"
                          loading={addContactLoader}
                          disabled={relatedView !== "SELECT"}
                        >
                          {screenWidth < 768 ? (
                            editable ? (
                              <Tooltip title={"Update Contact"}>
                                <CheckCircleOutlined />
                              </Tooltip>
                            ) : (
                              <Tooltip title={"Save Changes"}>
                                <EditOutlined />
                              </Tooltip>
                            )
                          ) : editable ? (
                            "Save Changes"
                          ) : (
                            "Edit"
                          )}
                        </Button>
                      </Form.Item>
                    </div>
                  </div>
                </div>
                {relatedView !== "SELECT" ? (
                  <div className="updateContactDiv">
                    <div className="contactEditFormDiv">
                      <div className="updateOpportunityDivCol">
                        <div className="addOpportunitySubTitle">
                          <div className="illustrationIconWrapper">
                            <img
                              src={GENERAL_INFO_ICON_ORANGE}
                              alt="illustration"
                              className="illustrationIcon"
                            />
                          </div>
                          Contact Information
                        </div>
                        <div className="updateContactFlex">
                          <Form.Item
                            name="firstName"
                            label="First Name"
                            className="addContactFormInput"
                            style={{ width: "230px" }}
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
                            />
                          </Form.Item>
                          <Form.Item
                            name="lastName"
                            label="Last Name"
                            className="addContactFormInput"
                            style={{ width: "230px" }}
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
                            />
                          </Form.Item>

                          <Form.Item
                            name="email"
                            label="Email"
                            className="addContactFormInput"
                            style={{ width: "230px" }}
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
                            />
                          </Form.Item>
                          <Form.Item
                            name="phone"
                            label="Contact No."
                            className="addContactFormInput"
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
                                value={contact?.countryCode!}
                                style={{ width: "250px" }}
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
                                disabled={!editable}
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
                                readOnly={!editable}
                                value={contact?.phone!}
                              />
                            </div>
                          </Form.Item>
                        </div>
                      </div>

                      <div className="opportunityInfo1">
                        <div className="opportunityInfo1CompanyNameLabel">
                          <img
                            src={OWNER}
                            alt="illustration"
                            className="illustrationIcon"
                          />
                          Owner
                        </div>
                        <div className="opportunityOwnerDiv">
                          <Avatar>{OWNER_AVATAR}</Avatar>
                          <div className="opportunityOwnerInfo">
                            <p className="opportunityInfo1CompanyName">
                              {OWNER_NAME}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
                {relatedView === "LEADS" ? (
                  <>
                    <AllRelatedLeads
                      moduleId={contactId ? contactId : ""}
                      moduleName={"contact"}
                    />
                  </>
                ) : relatedView === "OPPORTUNITIES" ? (
                  <>
                    <AllRelatedOpportunities
                      moduleId={contactId ? contactId : ""}
                      moduleName={"contact"}
                    />
                  </>
                ) : relatedView === "ACTIVITIES" ? (
                  <>
                    <AllRelatedActivities
                      moduleName={"contact"}
                      moduleId={contact?.contactId}
                    />
                  </>
                ) : relatedView === "NOTES" ? (
                  <>
                    <AllRelatedNotes
                      moduleName={"contact"}
                      moduleId={contact?.contactId}
                    />
                  </>
                ) : relatedView === "DOCUMENTS" ? (
                  <>
                    {(() => {
                      if (contact?.contactId) {
                        console.log('=== DEBUG: Rendering Documents view with contact object:', contact);
                        
                        // Use the utility function to extract the contactId
                        const safeContactId = extractContactId(contact);
                        console.log('=== DEBUG: Extracted contactId using utility:', safeContactId);
                        
                        return (
                          <RelatedDocumentsListView
                            contactId={safeContactId}
                          />
                        );
                      } else {
                        return (
                          <Alert
                            message="Missing Information"
                            description="Contact ID is required to display documents. Please refresh the page or go back."
                            type="warning"
                            showIcon
                          />
                        );
                      }
                    })()}
                  </>
                ) : (
                  <div>
                    <div className="updateContactDiv">
                      <div className="updateContactOwnerDiv">
                        <div className="contactEditFormDiv">
                          <div className="updateContactDivCol">
                            <div className="addOpportunitySubTitle">
                              <div className="illustrationIconWrapper">
                                <img
                                  src={GENERAL_INFO_ICON_ORANGE}
                                  alt="illustration"
                                  className="illustrationIcon"
                                />
                              </div>
                              Contact Information
                            </div>
                            <div className="updateContactFlex">
                              <Form.Item
                                name="firstName"
                                label="First Name"
                                className="addContactFormInput"
                                style={{ width: "230px" }}
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
                                  readOnly={!editable}
                                />
                              </Form.Item>
                              <Form.Item
                                name="lastName"
                                label="Last Name"
                                className="addContactFormInput"
                                style={{ width: "230px" }}
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
                                  readOnly={!editable}
                                />
                              </Form.Item>

                              <Form.Item
                                name="email"
                                label="Email"
                                className="addContactFormInput"
                                style={{ width: "230px" }}
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
                                  readOnly={!editable}
                                />
                              </Form.Item>
                              <Form.Item
                                name="phone"
                                label="Contact No."
                                className="addContactFormInput"
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
                                    value={contact?.countryCode!}
                                    style={{ width: "250px" }}
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
                                    disabled={!editable}
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
                                    readOnly={!editable}
                                    value={contact?.phone!}
                                  />
                                </div>
                              </Form.Item>
                            </div>
                          </div>
                          <div className="opportunityInfo1">
                            <div className="opportunityInfo1CompanyNameLabel">
                              <img
                                src={OWNER}
                                alt="illustration"
                                className="illustrationIcon"
                              />
                              Owner
                            </div>
                            <div className="opportunityOwnerDiv">
                              <Avatar>{OWNER_AVATAR}</Avatar>
                              <Popconfirm
                                title="Are you sure you want to change the owner of this record?"
                                open={popconfirmVisible}
                                onConfirm={confirmChange}
                                onCancel={cancelChange}
                                okText="Yes"
                                cancelText="No"
                              >

                                <Select
                                  className="dashboardSelect"
                                  placeholder="search sales person"
                                  showSearch
                                  style={{ width: "200px" }}
                                  disabled={!editable}
                                  value={
                                    OWNER_NAME
                                  }
                                  onChange={(value: string) => {
                                    setOwnerId(value)
                                    setPopconfirmVisible(true);
                                  }
                                  }
                                  filterOption={(input, option) => {
                                    const optionText =
                                      typeof option?.props.children === "string"
                                        ? option.props.children
                                        : Array.isArray(option?.props.children)
                                          ? option.props.children.join("")
                                          : "";

                                    return optionText
                                      .toLowerCase()
                                      .includes(input.toLowerCase());
                                  }}
                                >
                                  {salesPersonData?.map((item, index) => {
                                    return (
                                      <>
                                        <Select.Option
                                          key={index}
                                          value={item?.userId}
                                        >
                                          {item.firstName} {item?.lastName}
                                        </Select.Option>
                                      </>
                                    );
                                  })}
                                </Select>
                              </Popconfirm>
                            </div>
                          </div>
                        </div>

                        <div className="updateContactDivCol">
                          <div className="updateContactFlex" style={{ marginTop: "30px" }}>
                            <Form.Item
                              name="contactType"
                              label="Contact Type"
                              className="addContactFormInput"
                              style={{ width: "230px" }}
                              rules={[
                                {
                                  required: true,
                                  message: "This field is mandatory!",
                                },
                              ]}
                            >
                              <Select
                                onChange={(value) =>
                                  handleSelectChange(value, "contactType")
                                }
                                options={contactTypesOptions}
                                disabled={!editable}
                              />
                            </Form.Item>
                            <Form.Item
                              name="favourite"
                              label="Favourite"
                              className="addContactFormInput"
                              style={{ width: "230px" }}
                              rules={[
                                {
                                  required: false,
                                  message: "This field is mandatory!",
                                },
                              ]}
                            >
                              <Select
                                onChange={(value) =>
                                  handleSelectChange(value, "favourite")
                                }
                                options={yesOrNo}
                                disabled={!editable}
                              />
                            </Form.Item>
                            <Form.Item
                              name="company"
                              label="Company"
                              className="addOpportunityFormInput"
                              style={{ width: "230px" }}
                              rules={[
                                {
                                  required: false,
                                  message: "This field is mandatory!",
                                },
                              ]}
                            >
                              <Select
                                onChange={(value) =>
                                  handleSelectChange(value, "company")
                                }
                                options={companyOptions}
                                disabled={!editable}
                              />
                            </Form.Item>
                            <Form.Item
                              name="designation"
                              label="Designation"
                              className="addContactFormInput"
                              style={{ width: "230px" }}
                              rules={[
                                {
                                  required: false,
                                  message: "This field is mandatory!",
                                },
                              ]}
                            >
                              <Input
                                onChange={handleInputChange}
                                name="designation"
                                type="text"
                                placeholder="Please enter here"
                                readOnly={!editable}
                              />
                            </Form.Item>
                            <Form.Item
                              name="industry"
                              label="Industry"
                              className="addContactFormInput"
                              style={{ width: "230px" }}
                              rules={[
                                {
                                  required: true,
                                  message: "This field is mandatory!",
                                },
                              ]}
                            >
                              {isOtherIndutry ? (
                                <Input
                                  onChange={handleInputChange}
                                  name="industry"
                                  placeholder="Enter industry type here"
                                />
                              ) : (
                                <Select
                                  onChange={(value) =>
                                    handleSelectChange(value, "industry")
                                  }
                                  options={industryTypeValuesArray}
                                  disabled={!editable}
                                />
                              )}
                            </Form.Item>
                          </div>
                        </div>

                        <div className="updateContactDivCol">
                          <div className="addOpportunitySubTitle">
                            <div className="illustrationIconWrapper">
                              <img
                                src={LOCATION_ICON_ORANGE}
                                alt="illustration"
                                className="illustrationIcon"
                              />
                            </div>
                            Location
                          </div>
                          <div className="updateContactFlex">
                            <Form.Item
                              label="Address Line 1"
                              name="addressLine"
                              className="addContactFormInput"
                              style={{ width: "230px" }}
                              rules={[
                                {
                                  required: true,
                                  message: "This field is mandatory!",
                                },
                              ]}
                            >
                              <Input
                                onChange={handleInputChange}
                                name="addressLine"
                                type="string"
                                placeholder="Please enter here"
                                readOnly={!editable}
                              />
                            </Form.Item>

                            <Form.Item
                              name="country"
                              label="Country"
                              className="addContactFormInput"
                              style={{ width: "230px" }}
                              rules={[
                                {
                                  required: true,
                                  message: "This field is mandatory!",
                                },
                              ]}
                            >
                              <Select
                                onChange={(value) =>
                                  handleSelectChange(value, "country")
                                }
                                options={countryNames}
                                disabled={!editable}
                                showSearch
                              />
                            </Form.Item>
                            {contact?.country === "India" ? (
                              <Form.Item
                                name="state"
                                label="State"
                                className="addContactFormInput"
                                style={{ width: "230px" }}
                                rules={[
                                  {
                                    required: true,
                                    message: "This field is mandatory!",
                                  },
                                ]}
                              >
                                <Select
                                  onChange={(value) =>
                                    handleSelectChange(value, "state")
                                  }
                                  options={stateNames}
                                  disabled={!editable}
                                  showSearch
                                />
                              </Form.Item>
                            ) : (
                              <Form.Item
                                name="state"
                                label="State"
                                className="addContactFormInput"
                                style={{ width: "230px" }}
                                rules={[
                                  {
                                    required: true,
                                    message: "This field is mandatory!",
                                  },
                                ]}
                              >
                                <Input
                                  onChange={handleInputChange}
                                  name="state"
                                  type="string"
                                  placeholder="Please enter here"
                                  readOnly={!editable}
                                />
                              </Form.Item>
                            )}
                            <Form.Item
                              name="city"
                              label="City"
                              className="addContactFormInput"
                              style={{ width: "230px" }}
                              rules={[
                                {
                                  required: true,
                                  message: "This field is mandatory!",
                                },
                              ]}
                            >
                              <Input
                                onChange={handleInputChange}
                                name="city"
                                type="string"
                                placeholder="Please enter here"
                                readOnly={!editable}
                              />
                            </Form.Item>
                          </div>
                        </div>



                        <div className="updateContactDivCol">
                          <div className="addOpportunitySubTitle">
                            <div className="illustrationIconWrapper">
                              <img
                                src={DESCRIPTION_ICON_ORANGE}
                                alt="illustration"
                                className="illustrationIcon"
                              />
                            </div>
                            Description
                          </div>
                          <div className="updateContactFlex">

                            <Form.Item
                              name="status"
                              label="Status"
                              className="addContactFormInput"
                              style={{ width: "230px" }}
                              rules={[
                                {
                                  required: true,
                                  message: "This field is mandatory!",
                                },
                              ]}
                            >
                              <Select
                                onChange={(value) =>
                                  handleSelectChange(value, "status")
                                }
                                options={statusOptions}
                                disabled={!editable}
                              />
                            </Form.Item>
                            <Form.Item
                              name="description"
                              label="Description"
                              className="addContactFormInput"
                              rules={[
                                {
                                  required: false,
                                  message: "This field is mandatory!",
                                },
                              ]}
                            >
                              <TextArea
                                style={{
                                  width: "600px",
                                }}
                                onChange={handleInputChange}
                                name="description"
                                readOnly={!editable}
                                maxLength={499}
                              />
                            </Form.Item>
                          </div>
                        </div>



                        <AuditWindow />
                      </div>
                    </div>
                  </div>
                )}
              </Form>
            ) : (
              <div className="loading-placeholder">
                <Spin tip="Initializing contact data..." />
                <p>If this message persists, there might be an issue with loading the contact.</p>
              </div>
            )}
          </div>
        )}
      </Spin>
    </div>
  );
};

export default OneContactById;
