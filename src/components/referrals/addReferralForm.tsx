import { Form, Input, Select } from "antd";
import { useAppDispatch } from "../../redux/app/hooks";
import TextArea from "antd/es/input/TextArea";
import {
  countryFlags,
  referralStatusOptions,
} from "../../utilities/common/dataArrays";
import { handleInputChangeReducerReferral } from "../../redux/features/referralsSlice";

function AddReferralForm() {
  const dispatch = useAppDispatch();
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

  return (
    <div>
      <div className="referralAddFormGrid">
        <Form.Item
          name="firstName"
          label="First Name"
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
            name="firstName"
            type="string"
            placeholder="Please enter here"
          />
        </Form.Item>
        <Form.Item
          name="lastName"
          label="Last Name"
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
            name="lastName"
            type="string"
            placeholder="Please enter here"
          />
        </Form.Item>
      </div>
      <div className="referralAddFormGrid">
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
            onChange={handleInputChange}
            name="email"
            type="string"
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
              style={{ width: "250px" }}
              onChange={(value) => handleSelectChange(value, "countryCode")}
              options={countryFlags?.map((flag) => ({
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
      </div>
      <div className="referralAddFormGrid">
        <Form.Item
          name="referBy"
          label="Referred By"
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
            name="referBy"
            type="string"
            placeholder="Please enter here"
          />
        </Form.Item>
        <Form.Item
          name="company"
          label="Company"
          className="addAccountFormInput"
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
          />
        </Form.Item>
      </div>
      <div className="referralAddFormGrid">
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
            options={referralStatusOptions}
            defaultValue={"New"}
          />
        </Form.Item>
      </div>
      <Form.Item
        name="description"
        label="Description"
        className="addReferralFormInput"
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
        />
      </Form.Item>
    </div>
  );
}

export default AddReferralForm;
