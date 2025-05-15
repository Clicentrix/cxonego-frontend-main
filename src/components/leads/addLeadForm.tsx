import { Button, Form, Input, Modal, Select } from "antd";
import { useAppDispatch, useAppSelector } from "../../redux/app/hooks";
import { handleInputChangeReducerLead } from "../../redux/features/leadSlice";
import { RootState } from "../../redux/app/store";
import {
  countryFlags,
  countryNames,
  currencyOptions,
  leadSourceOptions,
  ratingValuesArray,
  stateNames,
  statusValuesArray,
} from "../../utilities/common/dataArrays";
import { useEffect } from "react";
import {
  createAndGetAllAccountsWithoutParams,
  fetchAllAccountsWithoutParams,
  resetIsModalOpenAccount,
} from "../../redux/features/accountsSlice";
import {
  createAndGetAllContactsWithoutParams,
  fetchAllContactsWithoutParams,
  resetIsModalOpenContact,
} from "../../redux/features/contactsSlice";
import AddAccountForm from "../accounts/addAccountForm";
import AddContactForm from "../contacts/addContactForm";
// import PhoneInput from "react-phone-number-input";
// import E164Number from "react-phone-number-input";
// import { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css"; // Import the default style

const AddLeadForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    contacts,
    isModalOpenContact,
    contact,
    addContactLoader,
    contactForLookup,
  } = useAppSelector((state: RootState) => state.contacts);
  const { lead } = useAppSelector((state: RootState) => state.leads);
  const [formAccount] = Form.useForm();
  const [formContact] = Form.useForm();

  const {
    accounts,
    isModalOpenAccount,
    account,
    addAccountLoader,
    accountForLookup,
  } = useAppSelector((state: RootState) => state.accounts);

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
    if (value === "LOOKUP" && name === "company") {
      dispatch(resetIsModalOpenAccount(true));
    } else if (value === "LOOKUP" && name === "contact") {
      dispatch(resetIsModalOpenContact(true));
    } else {
      dispatch(
        handleInputChangeReducerLead({
          [name]: value,
        })
      );
    }
  };

  const handleOpenModalForLookupForAccount = () => {
    dispatch(resetIsModalOpenAccount(true));
  }
  const handleOpenModalForLookupForContact = () => {
    dispatch(resetIsModalOpenContact(true));
  }

  // FOR LOOKUP
  const handleSubmitAccount = async () => {
    await dispatch(createAndGetAllAccountsWithoutParams(account));
    formAccount.resetFields();
    await dispatch(resetIsModalOpenAccount(false));
  };

  const handleCancelAccount = () => {
    dispatch(resetIsModalOpenAccount(false));
    formAccount.resetFields();
  };

  const handleSubmitContact = async () => {
    await dispatch(createAndGetAllContactsWithoutParams(contact));
    formContact.resetFields();
    await dispatch(resetIsModalOpenContact(false));
  };

  const handleCancelContact = () => {
    dispatch(resetIsModalOpenContact(false));
    formContact.resetFields();
  };

  // const handlePhoneNumberChange = (value: E164Number | undefined) => {
  //   setPhoneNumber(value);
  // };
  // const onChange = (key: string | string[]) => {
  //   console.log(key);
  // };

  useEffect(() => {
    dispatch(fetchAllAccountsWithoutParams());
    dispatch(fetchAllContactsWithoutParams());
  }, []);

  return (
    <>
      <Modal
        open={isModalOpenContact}
        onOk={handleSubmitContact}
        onCancel={handleCancelContact}
        footer={false}
      >
        <div className="addContactFormDiv">
          <div className="addContactTitle">New Contact</div>

          <div className="addContactFormWrapper">
            <Form
              form={formContact}
              name="loginForm"
              onFinish={handleSubmitContact}
            >
              <AddContactForm />
              <Form.Item className="addContactSubmitBtnWrapper">
                <Button
                  onClick={handleCancelContact}
                  className="addContactCancelBtn"
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="addContactSubmitBtn"
                  loading={addContactLoader}
                >
                  Save
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </Modal>
      <Modal
        open={isModalOpenAccount}
        onOk={handleSubmitAccount}
        onCancel={handleCancelAccount}
        footer={false}
      >
        <div className="addAccountFormDiv">
          <div className="addAccountTitle">New Company</div>
          <div className="addOpportunityFormWrapper">
            <Form
              form={formAccount}
              name="loginForm"
              onFinish={handleSubmitAccount}
              initialValues={account}
            >
              <AddAccountForm />
              <Form.Item className="addOpportunitySubmitBtnWrapper">
                <Button
                  onClick={handleCancelAccount}
                  className="addOpportunityCancelBtn"
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="addOpportunitySubmitBtn"
                  loading={addAccountLoader}
                >
                  Save
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </Modal>

      <div className="addLeadFormDiv">
        <div className="addLeadTitle">Add Lead</div>
        <div className="addLeadFormWrapper">
          {/* {addAccountLoader || getAccountLoader || loading ? (
            <Skeleton />
          ) : (
            <> */}
          {/* <Collapse
            defaultActiveKey={["1"]}
            onChange={onChange}
            expandIconPosition={"end"}
          >
            <Collapse.Panel key={"1"} header={"General Information"}> */}
          <div className="addOpportunitySubTitle">General Information</div>
          <div className="addLeadDiv">
            <div className="addLeadDivCol">
              <Form.Item
                name="firstName"
                label="First Name"
                className="addLeadFormInput"
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
                // value={otp}
                />
              </Form.Item>

              <Form.Item
                name="lastName"
                label="Last Name"
                className="addLeadFormInput"
                rules={[
                  {
                    required: true,
                    message: "This field is mandatory!",
                  },
                ]}
              >
                <Input
                  // onChange={}
                  onChange={handleInputChange}
                  name="lastName"
                  type="string"
                  placeholder="Please enter here"
                // value={otp}
                />
              </Form.Item>
            </div>
            <div className="addLeadDivCol">
              <Form.Item
                name="title"
                label="Lead Title"
                className="addLeadFormInput"
                rules={[
                  {
                    required: true,
                    message: "This field is mandatory!",
                  },
                ]}
              >
                <Input
                  // onChange={}
                  onChange={handleInputChange}
                  name="title"
                  type="string"
                  placeholder="Please enter here"
                // value={otp}
                />
              </Form.Item>
              <Form.Item
                name="description"
                label="Description"
                className="addLeadFormInput"
                rules={[
                  {
                    required: false,
                    message: "This field is mandatory!",
                  },
                ]}
              >
                <Input
                  onChange={handleInputChange}
                  name="description"
                  type="string"
                  placeholder="Please enter here"
                  maxLength={499}
                />
              </Form.Item>
            </div>
            <div className="addLeadDivCol">
              <Form.Item
                name="company"
                label="Company"
                className="addOpportunityFormInput"
                rules={[
                  {
                    required: false,
                    message: "This field is mandatory!",
                  },
                ]}
              >
                <Select
                  onChange={(value: string) =>
                    handleSelectChange(value, "company")
                  }
                  placeholder="select company"
                  style={{ width: "100%" }}
                  showSearch
                  value={accountForLookup ? accountForLookup?.accountId : null}
                >
                  {accounts?.map((item, index) => {
                    return (
                      <>
                        <Select.Option key={index} value={item?.accountId}>
                          {item.accountName}
                        </Select.Option>
                      </>
                    );
                  })}
                  <Select.Option key={0} value={"LOOKUP"}>
                    <div onClick={() => handleOpenModalForLookupForAccount()}>
                      <span className="hyperlinkBlue">Click here</span> to add new
                      account</div>
                  </Select.Option>
                </Select>
              </Form.Item>
            </div>
            <div className="addLeadDivCol">
              <Form.Item
                name="contact"
                label="Contact"
                className="addOpportunityFormInput"
                rules={[
                  {
                    required: false,
                    message: "This field is mandatory!",
                  },
                ]}
              >
                <Select
                  onChange={(value: string) =>
                    handleSelectChange(value, "contact")
                  }
                  placeholder="select contact"
                  style={{ width: "100%" }}
                  showSearch
                  value={contactForLookup ? contactForLookup?.contactId : null}
                >
                  {contacts?.map((item, index) => {
                    return (
                      <>
                        <Select.Option key={index} value={item?.contactId}>
                          {item.firstName} {item?.lastName}
                        </Select.Option>
                      </>
                    );
                  })}
                  <Select.Option key={0} value={"LOOKUP"}>
                    <div onClick={() => handleOpenModalForLookupForContact()}>
                      <span className="hyperlinkBlue">Click here</span> to add new
                      contact</div>
                  </Select.Option>
                </Select>
              </Form.Item>
            </div>
          </div>
          {/* </Collapse.Panel>
            <Collapse.Panel key={"2"} header={"Location"}> */}
          <div className="addOpportunitySubTitle">Location</div>
          <div className="addLeadDiv">
            <div className="addLeadDivCol">
              <Form.Item
                name="country"
                label="Country"
                className="addContactFormInput"
                rules={[
                  {
                    required: true,
                    message: "This field is mandatory!",
                  },
                ]}
              >
                <Select
                  onChange={(value) => handleSelectChange(value, "country")}
                  options={countryNames}
                  showSearch
                />
              </Form.Item>
              {lead?.country === "India" ? (
                <Form.Item
                  name="state"
                  label="State"
                  className="addContactFormInput"
                  rules={[
                    {
                      required: true,
                      message: "This field is mandatory!",
                    },
                  ]}
                >
                  <Select
                    onChange={(value) => handleSelectChange(value, "state")}
                    options={stateNames}
                    showSearch
                  />
                </Form.Item>
              ) : (
                <Form.Item
                  name="state"
                  label="State"
                  className="addContactFormInput"
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
                  />
                </Form.Item>
              )}
            </div>
            <div className="addLeadDivCol">
              <Form.Item
                name="city"
                label="City"
                className="addContactFormInput"
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
                />
              </Form.Item>
            </div>
          </div>
          {/* </Collapse.Panel>
            <Collapse.Panel key={"3"} header={"Communication"}> */}
          <div className="addOpportunitySubTitle">Communication</div>{" "}
          <div className="addLeadDiv">
            <div className="addLeadDivCol">
              <Form.Item
                name="phone"
                label="Contact No."
                className="addLeadFormInput"
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
                  />
                </div>
              </Form.Item>
            </div>
            <div className="addLeadDivCol">
              {" "}
              <Form.Item
                name="email"
                label="Email"
                className="addLeadFormInput"
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
                  // type="text"
                  placeholder="Please enter here"
                />
              </Form.Item>
            </div>
          </div>
          {/* </Collapse.Panel>
            <Collapse.Panel key={"4"} header={"Lead Details"}> */}
          <div className="addOpportunitySubTitle">Lead Details</div>
          <div className="addLeadDiv">
            <div className="addLeadDivCol">
              <Form.Item
                name="leadSource"
                label="Lead Source"
                className="addLeadFormInput"
                rules={[
                  {
                    required: false,
                    message: "This field is mandatory!",
                  },
                ]}
              >
                <Select
                  onChange={(value) => handleSelectChange(value, "leadSource")}
                  options={leadSourceOptions}
                  defaultValue={"Referrals"}
                />
              </Form.Item>
              <Form.Item
                name="currency"
                label="Currency"
                className="addLeadFormInput"
                rules={[
                  {
                    required: false,
                    message: "This field is mandatory!",
                  },
                ]}
              >
                <Select
                  onChange={(value) => handleSelectChange(value, "currency")}
                  options={currencyOptions}
                  defaultValue={"INR"}
                />
              </Form.Item>
              <Form.Item
                name="price"
                label="Est. Revenue"
                className="addLeadFormInput"
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
                // value={otp}
                />
              </Form.Item>
            </div>

            <div className="addLeadDivCol">
              <Form.Item
                name="rating"
                label="Rating"
                className="addLeadFormInput"
                rules={[
                  {
                    required: false,
                    message: "This field is mandatory!",
                  },
                ]}
              >
                <Select
                  onChange={(value) => handleSelectChange(value, "rating")}
                  options={ratingValuesArray}
                  defaultValue={"Cold"}
                />
              </Form.Item>
              <Form.Item
                name="status"
                label="Status"
                className="addLeadFormInput"
                rules={[
                  {
                    required: false,
                    message: "This field is mandatory!",
                  },
                ]}
              >
                <Select
                  onChange={(value) => handleSelectChange(value, "status")}
                  options={statusValuesArray}
                  defaultValue={"New"}
                />
              </Form.Item>
            </div>
          </div>
          {/* </Collapse.Panel>
          </Collapse> */}
        </div>
      </div>
    </>
  );
};

export default AddLeadForm;
