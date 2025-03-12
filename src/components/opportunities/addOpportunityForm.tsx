import { Button, DatePicker, Form, Input, Modal, Select } from "antd";
import { useAppDispatch, useAppSelector } from "../../redux/app/hooks";
import { handleInputChangeReducerOpportunity } from "../../redux/features/opportunitiesSlice";
import {
  currencyOptions,
  forecastCategoryOptions,
  priorityOptions,
  probabilityOptions,
  purchaseProcessOptions,
  purchaseTimeFrameOptions,
  stagesOptions,
  statusOptions,
} from "../../utilities/common/dataArrays";
import TextArea from "antd/es/input/TextArea";
import { RootState } from "../../redux/app/store";
import {
  createAndGetAllAccountsWithoutParams,
  fetchAllAccountsWithoutParams,
  resetIsModalOpenAccount,
} from "../../redux/features/accountsSlice";
import AddAccountForm from "../accounts/addAccountForm";
import {
  createAndGetAllContactsWithoutParams,
  fetchAllContactsWithoutParams,
  resetIsModalOpenContact,
} from "../../redux/features/contactsSlice";
import AddContactForm from "../contacts/addContactForm";
import { useEffect } from "react";

function AddOpportunityForm() {
  const dispatch = useAppDispatch();
  const [formAccount] = Form.useForm();
  const [formContact] = Form.useForm();

  const {
    accounts,
    isModalOpenAccount,
    account,
    addAccountLoader,
    accountForLookup,
  } = useAppSelector((state: RootState) => state.accounts);
  const {
    contacts,
    isModalOpenContact,
    contact,
    addContactLoader,
    contactForLookup,
  } = useAppSelector((state: RootState) => state.contacts);
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
    if (value === "LOOKUP" && name === "company") {
      dispatch(resetIsModalOpenAccount(true));
    } else if (value === "LOOKUP" && name === "contact") {
      dispatch(resetIsModalOpenContact(true));
    } else {
      dispatch(
        handleInputChangeReducerOpportunity({
          [name]: value,
        })
      );
    }
  }; // FOR LOOKUP
  const handleOpenModalForLookupForAccount = () => {
    dispatch(resetIsModalOpenAccount(true));
  }
  const handleOpenModalForLookupForContact = () => {
    dispatch(resetIsModalOpenContact(true));
  }
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

  useEffect(() => {
    dispatch(fetchAllAccountsWithoutParams());
    dispatch(fetchAllContactsWithoutParams());
  }, []);

  return (
    <div>
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
      <div className="addOpportunitySubTitle">General Information</div>
      <Form.Item
        name="title"
        label="Title"
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
          name="title"
          type="string"
          placeholder="Please enter here"
        />
      </Form.Item>
      <div className="oppoAddFormGrid">
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
            onChange={(value: string) => handleSelectChange(value, "company")}
            placeholder="select company"
            style={{ width: "100%" }}
            showSearch
            value={accountForLookup ? accountForLookup?.accountId : undefined}
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
            onChange={(value: string) => handleSelectChange(value, "contact")}
            placeholder="select contact"
            style={{ width: "100%" }}
            showSearch
            value={contactForLookup ? contactForLookup?.contactId : undefined}
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
      <div className="addOpportunitySubTitle">Opportunity Details</div>
      <div className="oppoAddFormGrid">
        <Form.Item
          name="purchaseProcess"
          label="Purchase Process"
          className="addOpportunityFormInput"
          rules={[
            {
              required: false,
              message: "This field is mandatory!",
            },
          ]}
        >
          <Select
            onChange={(value) => handleSelectChange(value, "purchaseProcess")}
            options={purchaseProcessOptions}
            defaultValue={"Committee"}
          />
        </Form.Item>
        <Form.Item
          name="forecastCategory"
          label="Forecast Category"
          className="addOpportunityFormInput"
          rules={[
            {
              required: false,
              message: "This field is mandatory!",
            },
          ]}
        >
          <Select
            onChange={(value) => handleSelectChange(value, "forecastCategory")}
            options={forecastCategoryOptions}
            defaultValue={"Pipeline"}
          />
        </Form.Item>
      </div>
      <div className="oppoAddFormGrid"></div>

      <div className="oppoAddFormGrid">
        {/* <Form.Item
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
            type="string"
            placeholder="Please enter here"
          />
        </Form.Item> */}

        <Form.Item
          name="probability"
          label="Probability"
          className="addOpportunityFormInput"
          rules={[
            {
              required: false,
              message: "This field is mandatory!",
            },
          ]}
        >
          <Select
            onChange={(value) => handleSelectChange(value, "probability")}
            options={probabilityOptions}
            defaultValue={"50"}
          />
        </Form.Item>
        <Form.Item
          name="priority"
          label="Priority"
          className="addOpportunityFormInput"
          rules={[
            {
              required: false,
              message: "This field is mandatory!",
            },
          ]}
        >
          <Select
            onChange={(value) => handleSelectChange(value, "priority")}
            options={priorityOptions}
            defaultValue={"Medium"}
          />
        </Form.Item>
      </div>

      <div className="oppoAddFormGrid">
        <Form.Item
          name="stage"
          label="Stage"
          className="addOpportunityFormInput"
          rules={[
            {
              required: false,
              message: "This field is mandatory!",
            },
          ]}
        >
          <Select
            onChange={(value) => handleSelectChange(value, "stage")}
            options={stagesOptions}
            defaultValue={"Analysis"}
          />
        </Form.Item>
        <Form.Item
          name="status"
          label="Status"
          className="addOpportunityFormInput"
          rules={[
            {
              required: false,
              message: "This field is mandatory!",
            },
          ]}
        >
          <Select
            onChange={(value) => handleSelectChange(value, "status")}
            options={statusOptions}
            defaultValue={"Active"}
          />
        </Form.Item>
      </div>

      <div className="oppoAddFormGrid"></div>
      <div className="oppoAddFormGrid">
        <Form.Item
          name="currency"
          label="Currency"
          className="addOpportunityFormInput"
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
          name="estimatedRevenue"
          label="Est. Revenue"
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
            name="estimatedRevenue"
            type="number"
            placeholder="Please enter here"
          />
        </Form.Item>
        <Form.Item
          name="purchaseTimeFrame"
          label="Purchase Time Frame"
          className="addOpportunityFormInput"
          rules={[
            {
              required: true,
              message: "This field is mandatory!",
            },
          ]}
        >
          <Select
            onChange={(value) => handleSelectChange(value, "purchaseTimeFrame")}
            options={purchaseTimeFrameOptions}
          />
        </Form.Item>
        <Form.Item
          name="estimatedCloseDate"
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
            onChange={(_date, dateString) => {
              // Ensure dateString is a string before converting to Date
              if (typeof dateString === "string") {
                const dateObject = new Date(dateString);
                if (!isNaN(dateObject.getTime())) {
                  // Check if dateObject is valid
                  dispatch(
                    handleInputChangeReducerOpportunity({
                      estimatedCloseDate: dateObject.toISOString(),
                    })
                  );
                } else {
                  console.error("Invalid date string:", dateString);
                }
              }
            }}
          />
        </Form.Item>
      </div>
      <div className="oppoAddFormGrid">
        {/* <Form.Item
          name="actualCloseDate"
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
        </Form.Item> */}
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
          placeholder="Please enter here"
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
        <TextArea
          onChange={handleInputChange}
          name="currentNeed"
          placeholder="Please enter here"
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
        <TextArea
          onChange={handleInputChange}
          name="proposedSolution"
          placeholder="Please enter here"
          maxLength={499}
        />
      </Form.Item>
    </div>
  );
}

export default AddOpportunityForm;
