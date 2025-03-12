import { Form, Input, Select } from "antd";
import { useAppDispatch, useAppSelector } from "../../redux/app/hooks";
import { handleInputChangeReducerAccount } from "../../redux/features/accountsSlice";
import {
  accountBusinessTypesOptions,
  accountTypeValuesArray,
  countryFlags,
  countryNames,
  currencyOptions,
  industryTypeValuesArray,
  stateNames,
} from "../../utilities/common/dataArrays";
import { RootState } from "../../redux/app/store";
import { useState } from "react";

function AddAccountForm() {
  const dispatch = useAppDispatch();
  const { account } = useAppSelector((state: RootState) => state.accounts);
  const [isOtherIndutry, setIsOtherIndutry] = useState<boolean>(false);
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
    console.log("handleSelectChange on industry", value, name)
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

  // const onChange = (key: string | string[]) => {
  //   console.log(key);
  // };

  return (
    <>
      {/* <div className="addAccountSubTitle">General Information</div> */}
      {/* <Collapse
        defaultActiveKey={["1"]}
        onChange={onChange}
        expandIconPosition={"end"}
      >
        <Collapse.Panel key={"1"} header={"General Information"}> */}{" "}
      <div className="addOpportunitySubTitle">General Information</div>
      <div className="addAccountDiv">
        <div className="addAccountDivCol">
          <Form.Item
            name="accountName"
            label="Name"
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
              name="accountName"
              type="string"
              placeholder="Please enter here"
            />
          </Form.Item>
          <Form.Item
            name="companySize"
            label="Employee Size"
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
              name="companySize"
              type="number"
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
        <div className="addAccountDivCol">
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
            <Input
              onChange={handleInputChange}
              name="description"
              type="string"
              placeholder="Please enter here"
              maxLength={499}
            />
          </Form.Item>
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
              placeholder="Please enter here"
            />
          </Form.Item>
        </div>
      </div>
      {/* </Collapse.Panel>
        <Collapse.Panel key={"2"} header={"Location"}> */}
      <div className="addOpportunitySubTitle">Location</div>
      <div className="addAccountDiv">
        <Form.Item
          name="address"
          label="Address"
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
            name="address"
            type="text"
            placeholder="Please enter here"
          />
        </Form.Item>
        <Form.Item
          name="country"
          label="Country"
          className="addAccountFormInput"
          rules={[
            {
              required: true,
              message: "This field is mandatory!",
            },
          ]}
        >
          <Select
            showSearch
            onChange={(value) => handleSelectChange(value, "country")}
            options={countryNames}
          />
        </Form.Item>
        {account?.country === "India" ? (
          <Form.Item
            name="state"
            label="State"
            className="addAccountFormInput"
            rules={[
              {
                required: true,
                message: "This field is mandatory!",
              },
            ]}
          >
            <Select
              showSearch
              onChange={(value) => handleSelectChange(value, "state")}
              options={stateNames}
            />
          </Form.Item>
        ) : (
          <Form.Item
            name="state"
            label="State"
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
              name="state"
              type="string"
              placeholder="Please enter here"
            />
          </Form.Item>
        )}

        <Form.Item
          name="city"
          label="City"
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
          />
        </Form.Item>
      </div>
      {/* </Collapse.Panel>
        <Collapse.Panel key={"3"} header={"Communication"}> */}
      <div className="addOpportunitySubTitle">Communication</div>
      <div className="addaccountDiv">
        <div className="addAccountDivCol">
          <Form.Item
            name="website"
            label="Website"
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
              name="website"
              type="text"
              placeholder="Please enter here"
            />
          </Form.Item>
          <Form.Item
            name="status"
            label="Status"
            className="addAccountFormInput"
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
        </div>
        <div className="addAccountDivCol">
          <Form.Item
            name="industry"
            label="Industry"
            className="addAccountFormInput"
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
      </div>
      <div className="addAccountDiv"></div>
      {/* </Collapse.Panel>
        <Collapse.Panel key={"4"} header={"Company Details"}> */}
      <div className="addOpportunitySubTitle">Company Details</div>
      <div className="addAccountDiv">
        <div className="addAccountDivCol">
          <Form.Item
            name="CurrencyCode"
            label="Currency Code"
            className="addAccountFormInput"
            rules={[
              {
                required: false,
                message: "This field is mandatory!",
              },
            ]}
          >
            <Select
              onChange={(value) => handleSelectChange(value, "CurrencyCode")}
              options={currencyOptions}
              defaultValue={"INR"}
            />
          </Form.Item>

          <Form.Item
            name="businessType"
            label="Business Type"
            className="addAccountFormInput"
            rules={[
              {
                required: true,
                message: "This field is mandatory!",
              },
            ]}
          >
            <Select
              onChange={(value) => handleSelectChange(value, "businessType")}
              options={accountBusinessTypesOptions}
            />
          </Form.Item>
        </div>
        <div className="addAccountDivCol">
          <Form.Item
            name="annualRevenue"
            label="Annual Revenue"
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
              name="annualRevenue"
              type="number"
              placeholder="Please enter here"
            />
          </Form.Item>
        </div>

        <div className="addAccountDiv"></div>
      </div>
      {/* </Collapse.Panel>
      </Collapse> */}
    </>
  );
}

export default AddAccountForm;
