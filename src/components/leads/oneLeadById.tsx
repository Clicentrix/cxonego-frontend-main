import {
  Avatar,
  Button,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  Spin,
  Tooltip,
} from "antd";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/app/hooks";
import { RootState } from "../../redux/app/store";
import "../../styles/oppotunities/oneOpportunity.css";
import "../../styles/activities/floatActivity.css";
import {
  countryFlags,
  countryNames,
  leadSourceOptions,
  leadsRelatedViewOptions,
  ratingValuesArray,
  stateNames,
  statusValuesArray,
} from "../../utilities/common/dataArrays";

import {
  LeftOutlined,
  RightOutlined,
  EditOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { useParams } from "react-router-dom";
import { fetchAllAccountsWithoutParams } from "../../redux/features/accountsSlice";
import { fetchAllContactsWithoutParams } from "../../redux/features/contactsSlice";
import {
  getLeadById,
  handleInputChangeReducerLead,
  setEditableMode,
  updateLeadByIdAndGetAudits,
  updateLeadOwnerByIdAndGetAudits,
} from "../../redux/features/leadSlice";
import { fetchAllAuditsByModuleId } from "../../redux/features/auditSlice";
import AuditWindow from "../audit/auditWindow";
import AllRelatedActivities from "../activities/relatedActivitiesListView";
import AllRelatedNotes from "../notes/relatedNotesListView";
import {
  DESCRIPTION_ICON_ORANGE,
  GENERAL_INFO_ICON_ORANGE,
  LOCATION_ICON_ORANGE,
  OWNER,
} from "../../utilities/common/imagesImports";
import TextArea from "antd/es/input/TextArea";
import {
  addOpportunity,
  handleInputChangeReducerOpportunity,
  resetIsModalOpenOpportunity,
} from "../../redux/features/opportunitiesSlice";
import AddOpportunityForm from "../opportunities/addOpportunityForm";
import { fetchAllSalesPersonByUserId } from "../../redux/features/organizationSlice";

const OneLeadById: React.FC = () => {
  const dispatch = useAppDispatch();
  const params = useParams();
  const [form] = Form.useForm();
  const [formOpportunity] = Form.useForm();
  const { lead, addLeadLoader, getLeadLoader, editable } = useAppSelector(
    (state: RootState) => state.leads
  );
  const { isModalOpenOpportunity, opportunity, addOpportunityLoader } =
    useAppSelector((state: RootState) => state.opportunities);
  const { accounts } = useAppSelector((state: RootState) => state.accounts);
  const { contacts } = useAppSelector((state: RootState) => state.contacts);
  const { screenWidth } = useAppSelector((state: RootState) => state.referrals);
  const [relatedView, setRelatedView] = useState<string>("SELECT");
  const leadId = params?.leadId;
  const [popconfirmVisible, setPopconfirmVisible] = useState<boolean>(false);

  const OWNER_AVATAR = `${lead?.owner?.firstName
    ?.slice(0, 1)
    ?.toLocaleUpperCase()}
                          ${lead?.owner?.lastName
      ?.slice(0, 1)
      ?.toLocaleUpperCase()}`;

  const OWNER_NAME = `${lead?.owner?.firstName}
                          ${lead?.owner?.lastName}`;

  const [ownerId, setOwnerId] = useState<string>("")
  const [popconfirmVisible1, setPopconfirmVisible1] = useState<boolean>(false);
  const { salesPersonData } = useAppSelector(
    (state: RootState) => state.organisations
  );

  const companyOptions = accounts?.map((item) => {
    return { ...item, value: item?.accountId, label: item?.accountName };
  });

  const contactsOptions = contacts?.map((item) => {
    return {
      ...item,
      value: item?.contactId,
      label: `${item?.firstName} ${item?.lastName}`,
    };
  });


  const confirmChange1 = async () => {
    await dispatch(
      updateLeadOwnerByIdAndGetAudits({ ...lead, owner: { userId: ownerId } })
    );
    await dispatch(setEditableMode(false));
    await setPopconfirmVisible1(false);
  };

  const cancelChange1 = () => {
    setPopconfirmVisible1(false);
    dispatch(getLeadById(leadId!))
  };
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    dispatch(
      handleInputChangeReducerLead({
        [name]: value,
      })
    );
  };

  const handleSelectChange = (value: string, name: string) => {
    if (value === "Qualified" && name === "status") {
      setPopconfirmVisible(true);
    } else {
      console.log("name at lead edit 1", name, value);
      dispatch(
        handleInputChangeReducerLead({
          [name]: value,
        })
      );
    }
  };
  const confirmChange = async () => {

    await dispatch(resetIsModalOpenOpportunity(true));
    await setPopconfirmVisible(false);
  };

  const cancelChange = () => {
    setPopconfirmVisible(false);
    dispatch(getLeadById(leadId!))
  };

  const handleSelectChangeView = (value: string) => {
    setRelatedView(value);
  };

  const handleBack = () => {
    history.back();
  };

  const handleSubmit = () => {
    if (editable) {
      dispatch(
        updateLeadByIdAndGetAudits({
          ...lead,
          contact: lead?.contact?.includes("/")
            ? lead.contact?.split("/")[1]
            : lead?.contact,
          company: lead?.company?.includes("/")
            ? lead.company?.split("/")[1]
            : lead?.company,
        })
      );
    } else {
      dispatch(setEditableMode(true));
    }
  };

  const handleSubmitOpportunity = async () => {
    await dispatch(
      updateLeadByIdAndGetAudits({ ...lead, status: "Qualified" })
    ).then(() => {
      dispatch(addOpportunity(opportunity));
      dispatch(resetIsModalOpenOpportunity(false));
      dispatch(getLeadById(lead?.leadId));
      formOpportunity.resetFields();
    }).catch(() => {
      console.log("Operation cannot be completed, you may want to contact administrator for help.")
    })

  };
  const handleCancelOpportunity = async () => {
    await dispatch(getLeadById(leadId!))
    await dispatch(resetIsModalOpenOpportunity(false));
    await formOpportunity.resetFields();
  };

  useEffect(() => {
    dispatch(fetchAllSalesPersonByUserId());
  }, []);

  useEffect(() => {
    dispatch(setEditableMode(false));
    if (leadId) {
      dispatch(getLeadById(leadId));
    }
  }, [leadId]);

  useEffect(() => {
    form.setFieldsValue(lead);
  }, [lead]);

  useEffect(() => {
    formOpportunity.setFieldsValue({
      title: lead?.title,
      contact: lead?.contact,
      company: lead?.company,
      currency: lead?.currency,
      estimatedRevenue: lead?.price,
      Lead: leadId,
    });
    dispatch(
      handleInputChangeReducerOpportunity({
        title: lead?.title,
        contact: lead?.contact,
        company: lead?.company,
        currency: lead?.currency,
        estimatedRevenue: lead?.price,
        Lead: leadId,
      })
    );
  }, [isModalOpenOpportunity, lead]);

  console.log("lead?.status", lead?.status)

  useEffect(() => {
    dispatch(fetchAllAccountsWithoutParams());
    dispatch(fetchAllContactsWithoutParams());
    if (leadId) {
      dispatch(
        fetchAllAuditsByModuleId({ moduleName: "lead", moduleId: leadId })
      );
    }
  }, []);

  return (
    <div className="oneOpportunityMainWrapper">
      <Modal
        open={isModalOpenOpportunity}
        onOk={handleSubmitOpportunity}
        onCancel={handleCancelOpportunity}
        footer={false}
      >
        <div className="addOpportunityFormDiv">
          <div className="addOpportunityTitle">New Opportunity</div>
          <div className="addOpportunityFormWrapper">
            <Form
              form={formOpportunity}
              name="loginForm"
              onFinish={handleSubmitOpportunity}
            >
              <AddOpportunityForm />
              <Form.Item className="addOpportunitySubmitBtnWrapper">
                <Button
                  onClick={handleCancelOpportunity}
                  className="addOpportunityCancelBtn"
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="addOpportunitySubmitBtn"
                  loading={addOpportunityLoader}
                >
                  Save
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </Modal>
      <Spin spinning={getLeadLoader} tip="Loading...">
        <div
          className={
            editable
              ? "oneOpportunityViewWrapper"
              : "onceOpportunityViewWrapperNotEdit"
          }
        >
          <Form
            form={form}
            name="loginForm"
            onFinish={handleSubmit}
            initialValues={lead}
          >
            <div className="oneOpportunityTopToolbar1">
              <div className="opportunitysSelectViewWrapper">
                <div className="opportunitysSelectView1">
                  <LeftOutlined className="backArrow" onClick={handleBack} />
                  <div className="opportunitysViewTitle">Leads</div>
                  <RightOutlined />
                  <div className="opportunitysViewTitle">
                    {lead?.title || ""}
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
                    {leadsRelatedViewOptions?.map((option, index) => (
                      <Select.Option key={index} value={option.value}>
                        {option.label}
                      </Select.Option>
                    ))}
                  </Select>
                  <Form.Item className="addOpportunitySubmitBtnWrapper">
                    <Button
                      type="primary"
                      htmlType="submit"
                      className="opportunityEditBtn"
                      loading={addLeadLoader}
                      disabled={relatedView !== "SELECT" || lead?.status === "Closed" || lead?.status === "Qualified"}
                    >
                      {screenWidth < 768 ? (
                        editable ? (
                          <Tooltip title={"Update Lead"}>
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
              <div className="updateOpportunityDiv">
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
                      General Information
                    </div>
                    <div className="updateOpportunityFlex">
                      <Form.Item
                        name="title"
                        label="Lead Title"
                        className="addOpportunityFormInput"
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
                          name="title"
                          type="string"
                          placeholder="Please enter here"
                          readOnly={!editable}
                        />
                      </Form.Item>
                      <Form.Item
                        name="firstName"
                        label="First Name"
                        className="addOpportunityFormInput"
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
                        className="addOpportunityFormInput"
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
                        name="phone"
                        label="Contact No."
                        className="addOpportunityFormInput"
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
                            value={lead?.countryCode!}
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
                            value={lead?.phone!}
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
            {relatedView === "ACTIVITIES" ? (
              <>
                <AllRelatedActivities
                  moduleName={"lead"}
                  moduleId={lead?.leadId}
                />
              </>
            ) : relatedView === "NOTES" ? (
              <>
                <AllRelatedNotes moduleName={"lead"} moduleId={lead?.leadId} />
              </>
            ) : (
              <div>
                <div className="updateOpportunityDiv">
                  <div className="updateOpportunityOwnerDiv">
                    <div className="opportunityEditFormDiv">
                      <div className="updateOpportunityDivCol">
                        <div className="addOpportunitySubTitle">
                          <div className="illustrationIconWrapper">
                            <img
                              src={GENERAL_INFO_ICON_ORANGE}
                              alt="illustration"
                              className="illustrationIcon"
                            />
                          </div>
                          General Information
                        </div>
                        <div className="updateOpportunityFlex">
                          <Form.Item
                            name="title"
                            label="Title"
                            className="addOpportunityFormInput"
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
                              name="title"
                              type="string"
                              placeholder="Please enter here"
                              readOnly={!editable}
                            />
                          </Form.Item>
                          <Form.Item
                            name="firstName"
                            label="First Name"
                            className="addOpportunityFormInput"
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
                            className="addOpportunityFormInput"
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
                            name="phone"
                            label="Contact No."
                            className="addOpportunityFormInput"
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
                                value={lead?.countryCode!}
                                style={{ width: "150px" }}
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
                                value={lead?.phone!}
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
                            open={popconfirmVisible1}
                            onConfirm={confirmChange1}
                            onCancel={cancelChange1}
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
                                setPopconfirmVisible1(true);
                              }
                              }
                              filterOption={(input, option) => {
                                // Convert option's children to a string, handle cases where it's not a string
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
                    <div className="updateOpportunityDivCol">
                      <div className="addOpportunitySubTitle">
                        <img
                          src={LOCATION_ICON_ORANGE}
                          alt="illustration"
                          className="illustrationIcon"
                        />
                        Location
                      </div>
                      <div className="updateOpportunityFlex">
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
                              required: true,
                              message: "Please input your E-mail!",
                            },
                          ]}
                        >
                          <Input
                            onChange={handleInputChange}
                            name="email"
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
                        {lead?.country === "India" ? (
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
                    <div className="updateOpportunityDivCol">
                      <div className="addOpportunitySubTitle">
                        <img
                          src={DESCRIPTION_ICON_ORANGE}
                          alt="illustration"
                          className="illustrationIcon"
                        />
                        Description
                      </div>
                      <div className="updateOpportunityDescriptionDiv">
                        <div>
                          <div className="updateOpportunityFlex">
                            <Form.Item
                              name="rating"
                              label="Rating"
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
                                  handleSelectChange(value, "rating")
                                }
                                options={ratingValuesArray}
                                disabled={!editable}
                              />
                            </Form.Item>
                            <Form.Item
                              name="status"
                              label="Status"
                              className="addOpportunityFormInput"
                              style={{ width: "230px" }}
                              rules={[
                                {
                                  required: false,
                                  message: "This field is mandatory!",
                                },
                              ]}
                            >
                              <Popconfirm
                                title="Are you sure you want to Qualify this lead?"
                                open={popconfirmVisible}
                                onConfirm={confirmChange}
                                onCancel={cancelChange}
                                okText="Yes"
                                cancelText="No"
                              >
                                <Select
                                  showSearch
                                  onChange={(value) =>
                                    handleSelectChange(value, "status")
                                  }
                                  options={statusValuesArray}
                                  disabled={!editable || lead?.status === "Closed" || lead?.status === "Qualified"}
                                  value={lead?.status}
                                />
                              </Popconfirm>
                            </Form.Item>
                            <Form.Item
                              name="contact"
                              label="Contact"
                              className="addOpportunityFormInput"
                              style={{ width: "250px" }}
                              rules={[
                                {
                                  required: false,
                                  message: "This field is mandatory!",
                                },
                              ]}
                            >
                              <Select
                                showSearch
                                onChange={(value) =>
                                  handleSelectChange(value, "contact")
                                }
                                options={contactsOptions}
                                disabled={!editable}
                              // defaultValue={opportunity?.contact?.contactId}
                              />
                            </Form.Item>
                          </div>
                          <div className="updateOpportunityFlex">
                            <Form.Item
                              name="leadSource"
                              label="Lead Source"
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
                                  handleSelectChange(value, "leadSource")
                                }
                                options={leadSourceOptions}
                                disabled={!editable}
                              />
                            </Form.Item>
                            <Form.Item
                              name="price"
                              label="Est. Revenue"
                              className="addOpportunityFormInput"
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
                                name="price"
                                type="number"
                                placeholder="Please enter here"
                                readOnly={!editable}
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
                          </div>
                        </div>
                        <div>
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
                              onChange={handleInputChange}
                              style={{
                                border: "1px solid var(--gray4)",
                                width: "400px",
                                height: "150px",
                              }}
                              name="description"
                              // placeholder="Please enter here"
                              readOnly={!editable}
                              maxLength={499}
                            />
                          </Form.Item>
                        </div>
                      </div>
                    </div>
                    <AuditWindow />
                  </div>
                </div>
              </div>
            )}
          </Form>
        </div>
      </Spin>
    </div>
  );
};

export default OneLeadById;
