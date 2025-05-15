import { Button, Form, Input, Modal, Select } from "antd";
import { handleInputChangeReducerContact } from "../../redux/features/contactsSlice";
import { useAppDispatch, useAppSelector } from "../../redux/app/hooks";
import { RootState } from "../../redux/app/store";
import { useEffect, useState } from "react";
import {
  createAndGetAllAccountsWithoutParams,
  fetchAllAccountsWithoutParams,
  resetIsModalOpenAccount,
} from "../../redux/features/accountsSlice";
import {
  accountTypeValuesArray,
  contactTypesOptions,
  countryFlags,
  countryNames,
  industryTypeValuesArray,
  stateNames,
  yesOrNo,
} from "../../utilities/common/dataArrays";
import AddAccountForm from "../accounts/addAccountForm";
import { Account } from "../../utilities/common/exportDataTypes/accountDataTypes";

const AddContactForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const { contact } = useAppSelector((state: RootState) => state?.contacts);
  const {
    accounts,
    isModalOpenAccount,
    account,
    addAccountLoader,
    accountForLookup,
  } = useAppSelector((state: RootState) => state.accounts);
  const [isOtherIndutry, setIsOtherIndutry] = useState<boolean>(false);

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
    } else if (value === "LOOKUP") {
      dispatch(resetIsModalOpenAccount(true));
    } else {
      dispatch(
        handleInputChangeReducerContact({
          [name]: value,
        })
      );
    }
  };

  const handleOpenModalForLookup = () => {
    dispatch(resetIsModalOpenAccount(true));
  }
  // FOR LOOKUP
  const handleSubmit = async () => {
    await dispatch(createAndGetAllAccountsWithoutParams(account));
    form.resetFields();
    await dispatch(resetIsModalOpenAccount(false));
  };

  const handleCancel = async () => {
    await dispatch(resetIsModalOpenAccount(false));
    await dispatch(
      handleInputChangeReducerContact({
        company: null,
      })
    );
    form.resetFields();
  };
  // const onChange = (key: string | string[]) => {
  //   console.log(key);
  // };

  useEffect(() => {
    dispatch(fetchAllAccountsWithoutParams());
  }, []);

  return (
    <>
      <Modal
        open={isModalOpenAccount}
        onOk={handleSubmit}
        onCancel={handleCancel}
        footer={false}
      >
        <div className="addAccountFormDiv">
          <div className="addAccountTitle">New Company</div>
          <div className="addOpportunityFormWrapper">
            <Form
              form={form}
              name="loginForm"
              onFinish={handleSubmit}
              initialValues={account}
            >
              <AddAccountForm />
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
                  loading={addAccountLoader}
                >
                  Save
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </Modal>

      <>
        {/* <Collapse
          defaultActiveKey={["1"]}
          onChange={onChange}
          expandIconPosition={"end"}
        >
          <Collapse.Panel key={"1"} header={"General Information"}> */}{" "}
        <div className="addOpportunitySubTitle">Contact Information</div>
        <div className="addContactDiv">
          <div className="addContactDivCol">
            <Form.Item
              name="firstName"
              label="First Name"
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
                name="firstName"
                type="text"
                placeholder="Please enter here"
              />
            </Form.Item>
            <Form.Item
              name="lastName"
              label="Last Name"
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
                name="lastName"
                type="text"
                placeholder="Please enter here"
              />
            </Form.Item>

            <Form.Item
              name="designation"
              label="Designation"
              className="addContactFormInput"
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
              <Input
                onChange={handleInputChange}
                name="description"
                type="string"
                placeholder="Please enter here"
                maxLength={499}
              />
            </Form.Item>
            {/* <Form.Item></Form.Item> */}
          </div>
          <div className="addContactDivCol">
            <Form.Item
              name="email"
              label="Email"
              className="addContactFormInput"
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
                  style={{ width: "250px" }}
                  onChange={(value) => handleSelectChange(value, "countryCode")}
                  options={countryFlags.map((flag) => ({
                    value: flag.key,
                    label: (
                      <div style={{ display: "flex", alignItems: "center" }}>
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
            <Form.Item
              name="company"
              label="Company"
              className="loginFormInput"
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
                value={
                  accountForLookup ? accountForLookup?.accountId : undefined
                }
              >
                {accounts?.map((item: Account, index) => {
                  return (
                    <>
                      <Select.Option key={index} value={item?.accountId}>
                        {item.accountName}
                      </Select.Option>
                    </>
                  );
                })}
                <Select.Option key={0} value={"LOOKUP"}>
                  <div onClick={() => handleOpenModalForLookup()}>
                    <span className="hyperlinkBlue">Click here</span> to add new
                    account</div>
                </Select.Option>
              </Select>
            </Form.Item>
          </div>
        </div>
        {/* </Collapse.Panel>
          <Collapse.Panel key={"2"} header={"Location"}> */}
        <div className="addOpportunitySubTitle">Location</div>{" "}
        <div className="addContactDivCol">
          <div className="addContactDiv">
            <Form.Item
              name="addressLine"
              label="Address Line 1"
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
                name="addressLine"
                type="text"
                placeholder="Please enter here"
              />
            </Form.Item>
            <Form.Item
              name="area"
              label="Area"
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
                name="area"
                type="text"
                placeholder="Please enter here"
              />
            </Form.Item>
          </div>
          <div className="addContactDiv">
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
            {contact?.country === "India" ? (
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
          <div className="addContactDiv">
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
        <div className="addOpportunitySubTitle">Communication</div>
        <div className="addContactDivCol">
          <div className="addContactDiv">
            <Form.Item
              name="status"
              label="Status"
              className="addContactFormInput"
              rules={[
                {
                  required: false,
                  message: "This field is mandatory!",
                },
              ]}
            >
              <Select
                onChange={(value) => handleSelectChange(value, "status")}
                options={accountTypeValuesArray}
                defaultValue={"Active"}
              />
            </Form.Item>
            <Form.Item
              name="industry"
              label="Industry"
              className="addContactFormInput"
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
                  onChange={(value) => handleSelectChange(value, "industry")}
                  options={industryTypeValuesArray}
                />
              )}
            </Form.Item>
          </div>
          <div className="addContactDiv">
            <Form.Item
              name="contactType"
              label="Contact Type"
              className="addContactFormInput"
              rules={[
                {
                  required: true,
                  message: "This field is mandatory!",
                },
              ]}
            >
              <Select
                onChange={(value) => handleSelectChange(value, "contactType")}
                options={contactTypesOptions}
              />
            </Form.Item>
            <Form.Item
              name="favorite"
              label="Favourite"
              className="addContactFormInput"
              rules={[
                {
                  required: false,
                  message: "This field is mandatory!",
                },
              ]}
            >
              <Select
                onChange={(value) => handleSelectChange(value, "favorite")}
                options={yesOrNo}
                defaultValue={"No"}
              />
            </Form.Item>
          </div>
        </div>
        {/* </Collapse.Panel>
        </Collapse> */}
      </>
    </>
  );
};

export default AddContactForm;
