import { Avatar, Button, Form, Input, Popconfirm, Select, Spin, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/app/hooks";
import { RootState } from "../../redux/app/store";
import {
  getAccountById,
  handleInputChangeReducerAccount,
  setEditableMode,
  updateAccountByIdAndGetAudits,
} from "../../redux/features/accountsSlice";
import "../../styles/accounts/accountsView.css";
import {
  accountTypeValuesArray,
  accountsRelatedViewOptions,
  countryFlags,
  countryNames,
  industryTypeValuesArray,
  stateNames,
} from "../../utilities/common/dataArrays";
import TextArea from "antd/es/input/TextArea";
import {
  DESCRIPTION_ICON_ORANGE,
  GENERAL_INFO_ICON_ORANGE,
  LOCATION_ICON_ORANGE,
  OWNER,
} from "../../utilities/common/imagesImports";
import {
  LeftOutlined,
  RightOutlined,
  EditOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { useParams } from "react-router-dom";
import { handleBack } from "../../utilities/common/commonFunctions/handleBack";
import { fetchAllAuditsByModuleId } from "../../redux/features/auditSlice";
import AuditWindow from "../audit/auditWindow";
import AllRelatedLeads from "../leads/relatedLeadsListView";
import AllRelatedOpportunities from "../opportunities/relatedOpportunitiesListView";
import AllRelatedActivities from "../activities/relatedActivitiesListView";
import AllRelatedContacts from "../contacts/relatedContactsListView";
import AllRelatedNotes from "../notes/relatedNotesListView";
import AccountDocumentsListView from "./AccountDocumentsListView";
import { fetchAllSalesPersonByUserId } from "../../redux/features/organizationSlice";

const OneAccountById: React.FC = () => {
  const dispatch = useAppDispatch();
  const params = useParams();
  const [form] = Form.useForm();
  const { account, addAccountLoader, getAccountLoader, editable } =
    useAppSelector((state: RootState) => state.accounts);
  const { user } = useAppSelector((state: RootState) => state.authentication);

  const { screenWidth } = useAppSelector((state: RootState) => state.referrals);

  const [relatedView, setRelatedView] = useState<string>("SELECT");
  const [isOtherIndutry, setIsOtherIndutry] = useState<boolean>(false);
  const [ownerId, setOwnerId] = useState<string>("")
  const [popconfirmVisible, setPopconfirmVisible] = useState<boolean>(false);
  const { salesPersonData } = useAppSelector(
    (state: RootState) => state.organisations
  );

  const accountId = params?.accountId;

  const OWNER_AVATAR = `${account?.owner?.firstName
    ?.slice(0, 1)
    ?.toLocaleUpperCase()}
                          ${account?.owner?.lastName
      ?.slice(0, 1)
      ?.toLocaleUpperCase()}`;

  const OWNER_NAME = `${account?.owner?.firstName}
                          ${account?.owner?.lastName}`;

  const companyToken =
    user?.organisation && user?.organisation?.companyToken
      ? ` ${user.organisation.companyToken}`
      : " Companies";


  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    dispatch(
      handleInputChangeReducerAccount({
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
        handleInputChangeReducerAccount({
          [name]: value,
        })
      );
    } else {
      dispatch(
        handleInputChangeReducerAccount({
          [name]: value,
        })
      );
    }
  };

  const handleSelectChangeView = (value: string) => {
    setRelatedView(value);
  };

  const handleSubmit = () => {
    if (editable) {
      dispatch(updateAccountByIdAndGetAudits(account));
    } else {
      dispatch(setEditableMode(true));
    }
  };

  const confirmChange = async () => {
    await dispatch(
      updateAccountByIdAndGetAudits({ ...account, owner: { userId: ownerId } })
    );
    await dispatch(setEditableMode(false));
    await setPopconfirmVisible(false);
  };

  const cancelChange = () => {
    setPopconfirmVisible(false);
    dispatch(getAccountById(accountId!))
  };

  useEffect(() => {
    if (accountId) {
      dispatch(setEditableMode(false));
      dispatch(getAccountById(accountId));
      dispatch(
        fetchAllAuditsByModuleId({ moduleName: "account", moduleId: accountId })
      );
    }
  }, [accountId]);

  useEffect(() => {
    form.setFieldsValue(account);
  }, [account]);

  useEffect(() => {
    dispatch(fetchAllSalesPersonByUserId());
  }, []);

  return (
    <div className="oneAccountMainWrapper">

      <Spin spinning={getAccountLoader} tip="Loading...">

        <div
          className={
            editable ? "oneAccountViewWrapper" : "onceAccountViewWrapperNotEdit"
          }
        >
          <Form
            form={form}
            name="loginForm"
            onFinish={handleSubmit}
            initialValues={account}
          >
            <div className="oneAccountTopToolbar1">
              <div className="opportunitysSelectViewWrapper">
                <div className="opportunitysSelectView1">
                  <LeftOutlined className="backArrow" onClick={handleBack} />
                  <div className="opportunitysViewTitle">{companyToken}</div>
                  <RightOutlined />
                  <div className="opportunitysViewTitle">
                    {account?.accountName || ""}
                  </div>
                </div>
                <div className="opportunitysSelectView1">
                  <Select
                    autoFocus
                    onChange={handleSelectChangeView}
                    defaultValue={"Select Related Records"}
                    style={{
                      border: "1px solid var(--gray5)",
                      borderRadius: "4px",
                      width: "160px",
                    }}
                  >
                    {accountsRelatedViewOptions?.map((option, index) => (
                      <Select.Option key={index} value={option.value}>
                        {option.label}
                      </Select.Option>
                    ))}
                  </Select>

                  <Form.Item className="addAccountSubmitBtnWrapper">
                    <Button
                      type="primary"
                      htmlType="submit"
                      className="accountEditBtn"
                      loading={addAccountLoader}
                      disabled={relatedView !== "SELECT"}
                    >
                      {screenWidth < 768 ? (
                        editable ? (
                          <Tooltip title={"Update Company"}>
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
              <div className="updateAccountDiv">
                <div className="accountEditFormDiv">
                  <div className="updateAccountDivCol">
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
                    <div className="updateAccountFlex">
                      <Form.Item
                        name="accountName"
                        label="Name"
                        className="addAccountFormInput"
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
                          name="accountName"
                          type="string"
                          placeholder="Please enter here"
                          readOnly={!editable}
                        />
                      </Form.Item>

                      <Form.Item
                        name="email"
                        label="Email"
                        className="addAccountFormInput"
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
                        name="website"
                        label="Website"
                        className="addAccountFormInput"
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
                          name="website"
                          type="text"
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
                            value={account?.countryCode!}
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
                            value={account?.phone!}
                          />
                        </div>
                      </Form.Item>
                    </div>
                  </div>

                  <div className="accountInfo1">
                    <div className="opportunityInfo1CompanyNameLabel">
                      <img
                        src={OWNER}
                        alt="illustration"
                        className="illustrationIcon"
                      />
                      Owner
                    </div>
                    <div className="accountOwnerDiv">
                      <Avatar>{OWNER_AVATAR}</Avatar>
                      <p className="accountInfo1CompanyName">{OWNER_NAME}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
            {relatedView === "LEADS" ? (
              <>
                <AllRelatedLeads
                  moduleId={accountId ? accountId : ""}
                  moduleName={"account"}
                />
              </>
            ) : relatedView === "OPPORTUNITIES" ? (
              <>
                <AllRelatedOpportunities
                  moduleId={accountId ? accountId : ""}
                  moduleName={"account"}
                />
              </>
            ) : relatedView === "ACTIVITIES" ? (
              <>
                <AllRelatedActivities
                  moduleName={"account"}
                  moduleId={account?.accountId}
                />
              </>
            ) : relatedView === "CONTACTS" ? (
              <>
                <AllRelatedContacts
                  moduleName={"account"}
                  moduleId={account?.accountId}
                />
              </>
            ) : relatedView === "NOTES" ? (
              <>
                <AllRelatedNotes
                  moduleName={"account"}
                  moduleId={account?.accountId}
                />
              </>
            ) : relatedView === "DOCUMENTS" ? (
              <AccountDocumentsListView accountId={account?.accountId} />
            ) : (
              <div>
                <div className="updateAccountDiv">
                  <div className="updateAccountOwnerDiv">
                    <div className="accountEditFormDiv">
                      <div className="updateAccountDivCol">
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
                        <div className="updateAccountFlex">
                          <Form.Item
                            name="accountName"
                            label="Name"
                            className="addAccountFormInput"
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
                              name="accountName"
                              type="string"
                              placeholder="Please enter here"
                              readOnly={!editable}
                            />
                          </Form.Item>

                          <Form.Item
                            name="email"
                            label="Email"
                            className="addAccountFormInput"
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
                            name="website"
                            label="Website"
                            className="addAccountFormInput"
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
                              name="website"
                              type="text"
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
                                value={account?.countryCode!}
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
                                value={account?.phone!}

                              />
                            </div>
                          </Form.Item>
                        </div>
                      </div>
                      <div className="accountInfo1">
                        <div className="opportunityInfo1CompanyNameLabel">
                          <img
                            src={OWNER}
                            alt="illustration"
                            className="illustrationIcon"
                          />
                          Owner
                        </div>
                        <div className="accountOwnerDiv">
                          <Avatar>{OWNER_AVATAR}</Avatar>
                          {/* <p className="accountInfo1CompanyName">
                            {OWNER_NAME}
                          </p> */}
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
                    <div className="updateAccountDivCol">
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
                      <div className="updateAccountFlex">
                        <Form.Item
                          name="address"
                          label="Address Line 1"
                          className="addAccountFormInput"
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
                            name="address"
                            type="string"
                            placeholder="Please enter here"
                            readOnly={!editable}
                          />
                        </Form.Item>

                        <Form.Item
                          name="country"
                          label="Country"
                          className="addAccountFormInput"
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
                        {account?.country === "India" ? (
                          <Form.Item
                            name="state"
                            label="State"
                            className="addAccountFormInput"
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
                            className="addAccountFormInput"
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
                          style={{ width: "230px" }}
                          className="addAccountFormInput"
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

                    <div className="updateAccountDivCol">
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
                      <div className="updateAccountFlex">
                        <Form.Item
                          name="industry"
                          label="Industry"
                          className="addAccountFormInput"
                          style={{ width: "230px" }}
                          rules={[
                            {
                              required: false,
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
                        <Form.Item
                          name="status"
                          label="Status"
                          className="addAccountFormInput"
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
                            options={accountTypeValuesArray}
                            disabled={!editable}
                          />
                        </Form.Item>
                        <Form.Item
                          name="description"
                          label="Description"
                          className="addAccountFormInput"
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
                            // placeholder="Please enter here"
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
        </div>
      </Spin>
    </div>
  );
};

export default OneAccountById;
