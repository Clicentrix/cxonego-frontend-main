import { Avatar, Button, Form, Input, Select, Skeleton, Tooltip } from "antd";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/app/hooks";
import { RootState } from "../../redux/app/store";
import "../../styles/referrals/oneReferralView.css";
import TextArea from "antd/es/input/TextArea";
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
import { handleBack } from "../../utilities/common/commonFunctions/handleBack";
import {
  getReferralById,
  handleInputChangeReducerReferral,
  setEditableMode,
  updateReferralById,
} from "../../redux/features/referralsSlice";
import {
  countryFlags,
  referralStatusOptions,
} from "../../utilities/common/dataArrays";

const OneReferralById: React.FC = () => {
  const dispatch = useAppDispatch();
  const params = useParams();
  const [form] = Form.useForm();

  const {
    addReferralLoader,
    getReferralLoader,
    editable,
    referral,
    screenWidth,
  } = useAppSelector((state: RootState) => state.referrals);

  const referId = params?.referId;
  const OWNER_AVATAR = `${referral?.owner?.firstName
    ?.slice(0, 1)
    ?.toLocaleUpperCase()}
                          ${referral?.owner?.lastName
      ?.slice(0, 1)
      ?.toLocaleUpperCase()}`;

  const OWNER_NAME = `${referral?.owner?.firstName}
                          ${referral?.owner?.lastName}`;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    dispatch(
      handleInputChangeReducerReferral({
        [name]: value,
      })
    );
  };

  const handleSelectChange = (value: string, name: string) => {
    dispatch(
      handleInputChangeReducerReferral({
        [name]: value,
      })
    );
  };

  const handleSubmit = () => {
    if (editable) {
      dispatch(updateReferralById(referral));
    } else {
      dispatch(setEditableMode(true));
    }
  };

  useEffect(() => {
    if (referId) {
      dispatch(setEditableMode(false));
      dispatch(getReferralById(referId));
    }
  }, [referId]);

  useEffect(() => {
    form.setFieldsValue(referral);
  }, [referral]);

  return (
    <div className="oneAccountMainWrapper">
      {getReferralLoader ? (
        <>
          <Skeleton />
        </>
      ) : (
        <div
          className={
            editable ? "oneAccountViewWrapper" : "onceAccountViewWrapperNotEdit"
          }
        >
          <Form
            form={form}
            name="loginForm"
            onFinish={handleSubmit}
            initialValues={referral}
          >
            <div className="oneAccountTopToolbar1">
              <div className="referralsSelectViewWrapper">
                <div className="referralsSelectView1">
                  <LeftOutlined className="backArrow" onClick={handleBack} />
                  <div className="opportunitysViewTitle">Referrals</div>
                  <RightOutlined />
                  <div className="opportunitysViewTitle">
                    {referral?.firstName || ""}
                  </div>
                </div>
                <div className="referralsSelectView1">
                  <Form.Item className="addAccountSubmitBtnWrapper">
                    <Button
                      type="primary"
                      htmlType="submit"
                      className="accountEditBtn"
                      loading={addReferralLoader}
                    >
                      {screenWidth < 768 ? (
                        editable ? (
                          <Tooltip title={"Update Referral"}>
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

            <div>
              <div className="updateReferralDiv">
                <div>
                  <div className="referralEditFormDiv">
                    <div className="updateReferralDivCol">
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
                      <div className="updateReferralFlex">
                        <Form.Item
                          name="firstName"
                          label="First Name"
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
                            name="firstName"
                            type="string"
                            placeholder="Please enter here"
                            readOnly={!editable}
                          />
                        </Form.Item>
                        <Form.Item
                          name="lastName"
                          label="Last Name"
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
                            name="lastName"
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
                            type="string"
                            placeholder="Please enter here"
                            readOnly={!editable}
                          />
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
                            options={referralStatusOptions}
                            showSearch
                            disabled={!editable}
                          />
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
                  <div className="updateReferralDivCol">
                    <div className="updateReferralFlex">
                      <Form.Item
                        // name="phone"
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
                            value={referral?.countryCode!}
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
                            value={referral?.phone!}
                          />
                        </div>
                      </Form.Item>
                      <Form.Item
                        name="referBy"
                        label="Referred By"
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
                          name="referBy"
                          type="string"
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
                        <Input
                          onChange={handleInputChange}
                          name="company"
                          type="string"
                          placeholder="Please enter here"
                          readOnly={!editable}
                        />
                      </Form.Item>
                      <Form.Item style={{ width: "230px" }}></Form.Item>
                    </div>
                  </div>

                  <div className="updateReferralDivCol">
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
                    <div className="updateReferalFlex">
                      <Form.Item
                        name="description"
                        label="Notes"
                        className="addActivityFormInput"
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
                    </div>
                  </div>
                  <div className="addAccountDiv"></div>
                </div>
              </div>
            </div>
          </Form>
        </div>
      )}
    </div>
  );
};

export default OneReferralById;
