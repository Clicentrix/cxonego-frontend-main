import {
  Avatar,
  Button,
  DatePicker,
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
  currencyOptions,
  forecastCategoryOptions,
  lostReasonOptions,
  opportunitiesRelatedViewOptions,
  priorityOptions,
  probabilityOptions,
  purchaseProcessOptions,
  purchaseTimeFrameOptions,
  stagesOptions,
  statusOptions,
  wonReasonOptions,
} from "../../utilities/common/dataArrays";
import {
  DESCRIPTION_ICON_ORANGE,
  GENERAL_INFO_ICON_ORANGE,
  OWNER,
} from "../../utilities/common/imagesImports";
import {
  LeftOutlined,
  RightOutlined,
  EditOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { useParams } from "react-router-dom";
import {
  getOpportunityById,
  handleInputChangeReducerOpportunity,
  setEditableMode,
  updateOpportunityByIdAndGetAudits,
  updateOpportunityForOwnerByIdAndGetAudits,
} from "../../redux/features/opportunitiesSlice";
import dayjs from "dayjs";
import { fetchAllAccountsWithoutParams } from "../../redux/features/accountsSlice";
import { fetchAllContactsWithoutParams } from "../../redux/features/contactsSlice";
import { fetchAllAuditsByModuleId } from "../../redux/features/auditSlice";
import AuditWindow from "../audit/auditWindow";
import AllRelatedActivities from "../activities/relatedActivitiesListView";
import AllRelatedNotes from "../notes/relatedNotesListView";
import RelatedDocumentsListView from "../documents/RelatedDocumentsListView";
import TextArea from "antd/es/input/TextArea";
import { fetchAllSalesPersonByUserId } from "../../redux/features/organizationSlice";
import { extractContactId } from "../../utils/contactUtils";

const OneOpportunityById: React.FC = () => {
  const dispatch = useAppDispatch();
  const params = useParams();
  const [form] = Form.useForm();
  const { opportunity, addOpportunityLoader, getOpportunityLoader, editable } =
    useAppSelector((state: RootState) => state.opportunities);

  const { accounts } = useAppSelector((state: RootState) => state.accounts);
  const { contacts } = useAppSelector((state: RootState) => state.contacts);
  const { screenWidth } = useAppSelector((state: RootState) => state.referrals);
  const [popconfirmVisible, setPopconfirmVisible] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [wonOrLost, setWonOrLost] = useState<string>("Won");
  const [relatedView, setRelatedView] = useState<string>("SELECT");
  const opportunityId = params?.opportunityId;

  const OWNER_AVATAR = `${opportunity?.owner?.firstName
    ?.slice(0, 1)
    ?.toLocaleUpperCase()}
                          ${opportunity?.owner?.lastName
      ?.slice(0, 1)
      ?.toLocaleUpperCase()}`;

  const OWNER_NAME = `${opportunity?.owner?.firstName}
                          ${opportunity?.owner?.lastName}`;
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
      updateOpportunityForOwnerByIdAndGetAudits({ ...opportunity, owner: { userId: ownerId } })
    );
    await dispatch(setEditableMode(false));
    await setPopconfirmVisible1(false);
  };

  const cancelChange1 = () => {
    setPopconfirmVisible1(false);
    dispatch(getOpportunityById(opportunityId!))
  };
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    dispatch(
      handleInputChangeReducerOpportunity({
        [name]: value,
      })
    );
  };

  const handleSelectChange = (value: string, name: string) => {
    if (value === "Won" || value === "Lost") {
      setPopconfirmVisible(true);
      setWonOrLost(value);
      dispatch(
        handleInputChangeReducerOpportunity({
          [name]: value,
        })
      );
    } else {
      dispatch(
        handleInputChangeReducerOpportunity({
          [name]: value,
        })
      );
    }
  };

  const confirmChange = async () => {
    await setIsModalOpen(true);
    form.resetFields();
    await setPopconfirmVisible(false);
  };

  const cancelChange = () => {
    setPopconfirmVisible(false);
    dispatch(getOpportunityById(opportunityId!))
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
        updateOpportunityByIdAndGetAudits({
          ...opportunity,
          contact: opportunity?.contact?.includes("/")
            ? opportunity.contact?.split("/")[1]
            : opportunity?.contact,
          company: opportunity?.company?.includes("/")
            ? opportunity.company?.split("/")[1]
            : opportunity?.company,
        })
      );
    } else {
      dispatch(setEditableMode(true));
    }
  };

  const handleCancel = async () => {
    await dispatch(getOpportunityById(opportunityId!))
    await setIsModalOpen(false);
    await form.resetFields();
  };

  useEffect(() => {
    dispatch(fetchAllSalesPersonByUserId());
  }, []);

  useEffect(() => {
    if (opportunityId) {
      dispatch(setEditableMode(false));
      dispatch(getOpportunityById(opportunityId));
    }
  }, [opportunityId]);

  useEffect(() => {
    form.setFieldsValue(opportunity);
  }, [opportunity]);

  useEffect(() => {
    dispatch(fetchAllAccountsWithoutParams());
    dispatch(fetchAllContactsWithoutParams());
    if (opportunityId) {
      dispatch(
        fetchAllAuditsByModuleId({
          moduleName: "opportunity",
          moduleId: opportunityId,
        })
      );
    }
  }, []);

  const handleCloseOpportunity = async () => {
    await dispatch(updateOpportunityByIdAndGetAudits(opportunity));
    setIsModalOpen(false);
  };

  return (
    <div className="oneOpportunityMainWrapper">
      <Modal
        open={isModalOpen}
        onOk={handleCloseOpportunity}
        onCancel={handleCancel}
        footer={false}
      >
        <div className="addAccountFormDiv">
          <div className="addAccountTitle">Close Opportunity</div>
          <div className="addOpportunityFormWrapper">
            <Form
              form={form}
              name="loginForm"
              onFinish={handleCloseOpportunity}
              initialValues={opportunity}
            >
              {wonOrLost === "Won" ? (
                <Form.Item
                  name="wonReason"
                  label="Won Reason"
                  className="addOpportunityFormInput"
                  rules={[
                    {
                      required: true,
                      message: "This field is mandatory!",
                    },
                  ]}
                >
                  <Select
                    onChange={(value) => handleSelectChange(value, "wonReason")}
                    options={wonReasonOptions}
                    disabled={!editable}
                    showSearch
                  />
                </Form.Item>
              ) : (
                <Form.Item
                  name="lostReason"
                  label="Lost Reason"
                  className="addOpportunityFormInput"
                  rules={[
                    {
                      required: true,
                      message: "This field is mandatory!",
                    },
                  ]}
                >
                  <Select
                    onChange={(value) =>
                      handleSelectChange(value, "lostReason")
                    }
                    options={lostReasonOptions}
                    disabled={!editable}
                  />
                </Form.Item>
              )}
              <Form.Item
                name="actualRevenue"
                label="Actual Revenue"
                className="addOpportunityFormInput"
                rules={[
                  {
                    required: true,
                    message: "This field is mandatory!",
                  },
                ]}
              >
                <Input
                  onChange={handleInputChange}
                  name="actualRevenue"
                  type="number"
                  placeholder="Please enter here"
                />
              </Form.Item>
              <Form.Item
                label="Actual. Close Date"
                className="addOpportunityFormInput"
                rules={[
                  {
                    required: true,
                    message: "This field is mandatory!",
                  },
                ]}
              >
                <DatePicker
                  onChange={(_date, dateString) => {
                    // Ensure dateString is a string before converting to Date
                    if (typeof dateString === "string") {
                      const dateObject = new Date(dateString);
                      if (!isNaN(dateObject.getTime())) {
                        // Check if dateObject is valid
                        dispatch(
                          handleInputChangeReducerOpportunity({
                            actualCloseDate: dateObject.toISOString(),
                          })
                        );
                      } else {
                        console.error("Invalid date string:", dateString);
                      }
                    }
                  }}
                />
              </Form.Item>
              <Form.Item
                name="wonLostDescription"
                label="Note"
                className="addOpportunityFormInput"
                rules={[
                  {
                    required: false,
                    message: "This field is mandatory!",
                  },
                ]}
              >
                <TextArea
                  onChange={handleInputChange}
                  name="wonLostDescription"
                  placeholder="Please enter here"
                  maxLength={499}
                />
              </Form.Item>
              <Form.Item className="addOpportunitySubmitBtnWrapper">
                <Button
                  onClick={handleCancel}
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
      <Spin spinning={getOpportunityLoader} tip="Loading...">
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
            initialValues={opportunity}
          >
            <div className="oneOpportunityTopToolbar1">
              <div className="opportunitysSelectViewWrapper">
                <div className="opportunitysSelectView1">
                  <LeftOutlined className="backArrow" onClick={handleBack} />
                  <div className="opportunitysViewTitle">Opportunities</div>
                  <RightOutlined />
                  <div className="opportunitysViewTitle">
                    {opportunity?.title || ""}
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
                    {opportunitiesRelatedViewOptions?.map((option, index) => (
                      <Select.Option key={index} value={option.value}>
                        {option.label}
                      </Select.Option>
                    ))}
                  </Select>
                  <Form.Item className="addOpportunitySubmitBtnWrapper">
                    <Button
                      type="primary"
                      htmlType={"submit"}
                      className="opportunityEditBtn"
                      loading={addOpportunityLoader}
                      disabled={relatedView !== "SELECT" || opportunity?.stage === "Won" || opportunity?.stage === "Lost"}
                    >
                      {screenWidth < 768 ? (
                        editable ? (
                          <Tooltip title={"Update Opportunity"}>
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
                        name="contact"
                        label="Contact"
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
                            handleSelectChange(value, "contact")
                          }
                          options={contactsOptions}
                          disabled={!editable}
                          showSearch
                        // defaultValue={opportunity?.contact?.contactId}
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
                      <Form.Item style={{ width: "230px" }}></Form.Item>
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
                  moduleName={"opportunity"}
                  moduleId={opportunity?.opportunityId}
                />
              </>
            ) : relatedView === "NOTES" ? (
              <>
                <AllRelatedNotes
                  moduleName={"opportunity"}
                  moduleId={opportunity?.opportunityId}
                />
              </>
            ) : relatedView === "DOCUMENTS" ? (
              <>
                {(() => {
                  console.log('=== DEBUG: Opportunity contact data:', opportunity?.contact);
                  
                  // Use the utility function to extract the contactId
                  const contactId = extractContactId(opportunity?.contact);
                  console.log('=== DEBUG: Extracted contactId using utility:', contactId);
                  
                  return (
                    <RelatedDocumentsListView
                      contactId={contactId}
                    />
                  );
                })()}
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
                            name="contact"
                            label="Contact"
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
                                handleSelectChange(value, "contact")
                              }
                              options={contactsOptions}
                              disabled={!editable}
                              showSearch
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
                          <Form.Item style={{ width: "230px" }}></Form.Item>
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
                          src={DESCRIPTION_ICON_ORANGE}
                          alt="illustration"
                          className="illustrationIcon"
                        />
                        Opportunity Details
                      </div>
                      <div className="updateOpportunityFlex">
                        <Form.Item
                          name="currency"
                          label="Currency"
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
                              handleSelectChange(value, "currency")
                            }
                            options={currencyOptions}
                            disabled={!editable}
                          />
                        </Form.Item>
                        <Form.Item
                          name="estimatedRevenue"
                          label="Est. Revenue"
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
                            name="estimatedRevenue"
                            type="number"
                            placeholder="Please enter here"
                          />
                        </Form.Item>

                        <Form.Item
                          name="actualRevenue"
                          label="Actual Revenue"
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
                            name="actualRevenue"
                            type="string"
                            placeholder="Please enter here"
                            readOnly={!editable}
                          />
                        </Form.Item>
                        <Form.Item
                          name="probability"
                          label="Probability"
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
                              handleSelectChange(value, "probability")
                            }
                            options={probabilityOptions}
                            disabled={!editable}
                          />
                        </Form.Item>
                      </div>

                      <div className="updateOpportunityFlex">
                        <Form.Item
                          name="purchaseTimeFrame"
                          label="Purchase Time Frame"
                          className="addOpportunityFormInput"
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
                              handleSelectChange(value, "purchaseTimeFrame")
                            }
                            options={purchaseTimeFrameOptions}
                            disabled={!editable}
                          />
                        </Form.Item>
                        <Form.Item
                          name="purchaseProcess"
                          label="Purchase Process"
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
                              handleSelectChange(value, "purchaseProcess")
                            }
                            options={purchaseProcessOptions}
                            disabled={!editable}
                          />
                        </Form.Item>
                        <Form.Item
                          name="forecastCategory"
                          label="Forecast Category"
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
                              handleSelectChange(value, "forecastCategory")
                            }
                            options={forecastCategoryOptions}
                            disabled={!editable}
                          />
                        </Form.Item>
                        <Form.Item
                          // name="stage"
                          label="Stage"
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
                            title={`Are you sure you want to close this opportunity as ${wonOrLost}?`}
                            open={popconfirmVisible}
                            onConfirm={confirmChange}
                            onCancel={cancelChange}
                            okText="Yes"
                            cancelText="No"
                          >
                            <Select
                              onChange={(value) =>
                                handleSelectChange(value, "stage")
                              }
                              options={stagesOptions}
                              disabled={!editable || opportunity?.stage === "Won" || opportunity?.stage === "Lost"}
                              value={opportunity?.stage}
                            />
                          </Popconfirm>
                        </Form.Item>
                      </div>

                      <div className="updateOpportunityFlex">
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
                          <Select
                            onChange={(value) =>
                              handleSelectChange(value, "status")
                            }
                            options={statusOptions}
                            disabled={!editable}
                          />
                        </Form.Item>
                        <Form.Item
                          name="priority"
                          label="Priority"
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
                              handleSelectChange(value, "priority")
                            }
                            options={priorityOptions}
                            disabled={!editable}
                          />
                        </Form.Item>
                        <Form.Item
                          // name="estimatedCloseDate"
                          style={{ width: "230px" }}
                          label="Est. Close Date"
                          className="addOpportunityFormInput"
                          rules={[
                            {
                              required: true,
                              message: "This field is mandatory!",
                            },
                          ]}
                        >
                          <DatePicker
                            value={
                              opportunity?.estimatedCloseDate
                                ? dayjs(opportunity?.estimatedCloseDate)
                                : null
                            }
                            disabled={!editable}
                            onChange={(_date, dateString) => {
                              // Ensure dateString is a string before converting to Date
                              if (typeof dateString === "string") {
                                const dateObject = new Date(dateString);
                                if (!isNaN(dateObject.getTime())) {
                                  // Check if dateObject is valid
                                  dispatch(
                                    handleInputChangeReducerOpportunity({
                                      estimatedCloseDate:
                                        dateObject.toISOString(),
                                    })
                                  );
                                } else {
                                  console.error(
                                    "Invalid date string:",
                                    dateString
                                  );
                                }
                              }
                            }}
                          />
                        </Form.Item>
                        <Form.Item
                          style={{ width: "230px" }}
                          label="Actual Close Date"
                          className="addOpportunityFormInput"
                          rules={[
                            {
                              required: true,
                              message: "This field is mandatory!",
                            },
                          ]}
                        >
                          <DatePicker
                            value={
                              opportunity?.actualCloseDate
                                ? dayjs(opportunity?.actualCloseDate)
                                : null
                            }
                            disabled={!editable}
                            onChange={(_date, dateString) => {
                              // Ensure dateString is a string before converting to Date
                              if (typeof dateString === "string") {
                                const dateObject = new Date(dateString);
                                if (!isNaN(dateObject.getTime())) {
                                  // Check if dateObject is valid
                                  dispatch(
                                    handleInputChangeReducerOpportunity({
                                      actualCloseDate: dateObject.toISOString(),
                                    })
                                  );
                                } else {
                                  console.error(
                                    "Invalid date string:",
                                    dateString
                                  );
                                }
                              }
                            }}
                          />
                        </Form.Item>
                        {opportunity?.stage === "Won" ? (
                          <Form.Item
                            name="wonReason"
                            label="Won Reason"
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
                                handleSelectChange(value, "wonReason")
                              }
                              options={wonReasonOptions}
                              disabled={!editable}
                            />
                          </Form.Item>
                        ) : opportunity?.stage === "Lost" ? (
                          <Form.Item
                            name="lostReason"
                            label="Lost Reason"
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
                                handleSelectChange(value, "lostReason")
                              }
                              options={lostReasonOptions}
                              disabled={!editable}
                            />
                          </Form.Item>
                        ) : (
                          <></>
                        )}
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
                      <Form.Item
                        name="description"
                        label="Description"
                        className="addOpportunityFormInput"
                        rules={[
                          {
                            required: false,
                            message: "This field is mandatory!",
                          },
                        ]}
                      >
                        <TextArea
                          onChange={handleInputChange}
                          name="description"
                          // placeholder="Please enter here"
                          readOnly={!editable}
                          maxLength={499}
                        />
                      </Form.Item>
                      <Form.Item
                        name="currentNeed"
                        label="Current Need"
                        className="addOpportunityFormInput"
                        rules={[
                          {
                            required: false,
                            message: "This field is mandatory!",
                          },
                        ]}
                      >
                        <Input
                          onChange={handleInputChange}
                          name="currentNeed"
                          placeholder="Please enter here"
                          readOnly={!editable}
                          maxLength={499}
                        />
                      </Form.Item>
                      <Form.Item
                        name="proposedSolution"
                        label="Proposed Solution"
                        className="addOpportunityFormInput"
                        rules={[
                          {
                            required: false,
                            message: "This field is mandatory!",
                          },
                        ]}
                      >
                        <Input
                          onChange={handleInputChange}
                          name="proposedSolution"
                          placeholder="Please enter here"
                          readOnly={!editable}
                          maxLength={499}
                        />
                      </Form.Item>
                      {opportunity?.stage === "Won" ||
                        opportunity?.stage === "Lost" ? (
                        <Form.Item
                          name="wonLostDescription"
                          label="Closing Description"
                          className="addOpportunityFormInput"
                          rules={[
                            {
                              required: false,
                              message: "This field is mandatory!",
                            },
                          ]}
                        >
                          <TextArea
                            onChange={handleInputChange}
                            name="wonLostDescription"
                            placeholder="Please enter here"
                            readOnly={!editable}
                            maxLength={499}
                          />
                        </Form.Item>
                      ) : (
                        <></>
                      )}
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

export default OneOpportunityById;
