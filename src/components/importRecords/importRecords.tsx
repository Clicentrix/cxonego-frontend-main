import { RcFile, UploadChangeParam } from "antd/lib/upload/interface";
import { csvInstructionsCollapseItem } from "../../utilities/common/dataArrays";
import {
  Button,
  Collapse,
  Flex,
  Form,
  Popover,
  Progress,
  Steps,
  Upload,
  message,
} from "antd";
import { useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import {
  BULK_CONTACT_ICON,
  BULK_LEAD_ICON,
  BULK_ORGANISATION_ICON,
  DRAGGER_ICON,
} from "../../utilities/common/imagesImports";
import "../../styles/importRecords.css";
import { Radio } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BulkContactsResponse } from "../../utilities/common/exportDataTypes/contactsDataTypes";
import moment from "moment";
import { BulkLeadsResponse } from "../../utilities/common/exportDataTypes/leadDataTypes";
import { BulkAccountsResponse } from "../../utilities/common/exportDataTypes/accountDataTypes";
const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

const ImportRecords = () => {
  const navigate = useNavigate();
  const accessToken = localStorage?.getItem("accessToken");
  const { Dragger } = Upload;
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const [fileTye, setFileType] = useState<string>("excel");
  const [dataType, setDataType] = useState<string>("leads");
  const [bulkContactResponse, setBulkContactResponse] =
    useState<BulkContactsResponse>({
      totalCount: 0,
      SuccessCount: 0,
      errorCount: 0,
      DuplicateCount: 0,
      filename: "",
      duplicateContactData: [],
    });
  const [bulkLeadResponse, setBulkLeadResponse] = useState<BulkLeadsResponse>({
    totalCount: 0,
    SuccessCount: 0,
    errorCount: 0,
    filename: "",
  });
  const [bulkAccountResponse, setBulkAccountResponse] =
    useState<BulkAccountsResponse>({
      totalCount: 0,
      SuccessCount: 0,
      errorCount: 0,
      DuplicateCount: 0,
      filename: "",
      duplicateAccountData: [],
    });

  const simulateProgress = () => {
    setProgress((prev) => (prev < 90 ? prev + 2 : prev)); // Increment by 0.5%
  };

  const handleUpload = async (file: RcFile) => {
    console.log("file selected", file)
    nextStep();
    setLoading(true);
    setProgress(0);
    const interval = setInterval(simulateProgress, 100); // Increment progress every 200ms

    try {
      const config = {
        headers: { Authorization: `Bearer ${accessToken}` },
      };

      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(
        dataType === "contacts"
          ? `${baseUrl}contact/upload-${fileTye}-contacts`
          : dataType === "leads"
            ? `${baseUrl}lead/upload-excel-leads`
            : `${baseUrl}account/upload-excel-accounts`,
        formData,
        config
      );

      if (response.status === 200) {
        if (dataType === "contacts") {
          setBulkContactResponse(response?.data?.data);
        } else if (dataType === "leads") {
          setBulkLeadResponse(response?.data?.data);
        } else {
          setBulkAccountResponse(response?.data?.data);
        }
      } else {
        throw new Error("Upload failed");
      }
    } catch (error: any) {
      message.error(error?.response?.data?.error);
    } finally {
      clearInterval(interval);
      setLoading(false);
      setProgress(100); // Ensure it completes to 100%
    }
  };

  const props = {
    name: "file",
    customRequest: ({ file, onSuccess, onError }: any) => {
      handleUpload(file).then(onSuccess).catch(onError);
    },
    onChange(info: UploadChangeParam) {
      if (info.file.status === "error") {
        setLoading(false);
      }
    },
  };
  const { Step } = Steps;

  interface DotProps {
    status: string; // Change 'string' to the appropriate type if necessary
    index: number;
  }
  interface StepContentType {
    step: number; // Change 'string' to the appropriate type if necessary
    nextStep: () => void;
  }

  const customDot = (dot: React.ReactNode, { status, index }: DotProps) => (
    <Popover
      content={
        <span>
          step {index + 1} status: {status}
        </span>
      }
    >
      {dot}
    </Popover>
  );

  const StepContent = ({ step, nextStep }: StepContentType) => {
    switch (step) {
      case 0:
        return (
          <div className="selectEntityContainerMain">
            <label className="addBulkCSVLabel">Select Entity</label>

            <div className="selectEntityContainer">
              <Radio.Group
                name="radiogroup"
                defaultValue={dataType}
                onChange={(e) => setDataType(e.target.value)}
              >
                <div className="selectEntity">
                  <img src={BULK_LEAD_ICON} alt="entity-icon" />
                  <Radio value={"leads"}>Leads</Radio>
                </div>
                <div className="selectEntity">
                  <img src={BULK_CONTACT_ICON} alt="entity-icon" />
                  <Radio value={"contacts"}>Contacts</Radio>
                </div>
                <div className="selectEntity">
                  <img src={BULK_ORGANISATION_ICON} alt="entity-icon" />
                  <Radio value={"accounts"}>Accounts</Radio>
                </div>
              </Radio.Group>
            </div>
            <div className="selectEntitySubmitBtn">
              <Button
                type="primary"
                onClick={nextStep}
                className="selectEntitySubmitBtn1"
              >
                Next
              </Button>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="selectEntityContainerMain">
            <label className="addBulkCSVLabel">Select Entity</label>
            <div className="selectEntityContainerFile">
              <Radio.Group
                name="radiogroup"
                defaultValue={fileTye}
                onChange={(e) => {
                  setFileType(e.target.value);
                }}
              >
                <Radio value={"excel"}>XLSX</Radio>
                {dataType === "contacts" && <Radio value={"vcf"}>VCF</Radio>}
              </Radio.Group>
            </div>
            <div className="selectEntitySubmitBtn">
              <Button
                type="primary"
                onClick={nextStep}
                className="selectEntitySubmitBtn1"
              >
                Next
              </Button>
            </div>
          </div>
        );
      case 2:
        return (
          <div>
            <div className="bulkStep2Container">
              {fileTye === "excel" ? (
                <>
                  <label className="addBulkCSVLabel">Excel Upload</label>
                  <div className="bulkCSVBottomWrapper">
                    <Collapse items={csvInstructionsCollapseItem} />
                    <Button className="csvDownloadBtn">
                      <a
                        href={
                          dataType === "contacts"
                            ? `https://cxonego-dev.s3.ap-south-1.amazonaws.com/Contact_Bulk_Upload+4.xlsx`
                            : dataType === "leads"
                              ? `https://cxonego-dev.s3.ap-south-1.amazonaws.com/Lead_Bulk_upload+4.xlsx`
                              : `https://cxonego-dev.s3.ap-south-1.amazonaws.com/Account_Bulk_upload+1.xlsx`
                        }
                        target="_abc"
                        download={true}
                      >
                        Download sample .xlsx file
                      </a>
                    </Button>
                  </div>
                  <div style={{ marginTop: "40px" }}>
                    <Dragger {...props} showUploadList={false} accept=".xlsx">
                      <img src={DRAGGER_ICON} alt="dragger0icon" />
                      <div className="ant-upload-text">
                        Click or drag XLSX file to this area to upload
                        <p>
                          Support for a single or bulk upload. Strictly
                          prohibited from uploading non-XLSX files.
                        </p>
                      </div>
                      <Button icon={<UploadOutlined />}>Click to Upload</Button>
                    </Dragger>
                  </div>
                </>
              ) : (
                <>
                  {" "}
                  <>
                    <label className="addBulkCSVLabel">VCF Upload</label>
                    <div className="bulkCSVBottomWrapper">
                      <Collapse items={csvInstructionsCollapseItem} />
                    </div>

                    <div style={{ marginTop: "40px" }}>
                      <Dragger {...props} showUploadList={false} accept=".vcf">
                        <img src={DRAGGER_ICON} alt="dragger0icon" />
                        <div className="ant-upload-text">
                          Click or drag VCF file to this area to upload
                          <p>
                            Support for a single or bulk upload. Strictly
                            prohibited from uploading non-VCF files.
                          </p>
                        </div>
                        <Button icon={<UploadOutlined />}>
                          Click to Upload
                        </Button>
                      </Dragger>
                      <Form.Item className="addLeadSubmitBtnWrapper">
                        <Button
                          onClick={nextStep}
                          disabled={loading}
                          className="selectEntitySubmitBtn1"
                        >
                          Next
                        </Button>
                      </Form.Item>
                    </div>
                  </>
                </>
              )}
            </div>
          </div>
          // </div>
        );
      case 3:
        return (
          <div>
            <div className="bulkStep2Container">
              <label className="addBulkCSVLabel">XLSX Upload</label>
              <div className="bulkProgressContainer">
                <div className="uploadProgressTitle">Upload Progress</div>
                <div>
                  {" "}
                  <Flex vertical gap="small">
                    <Flex gap="small">
                      <Flex vertical gap="small" style={{ width: 300 }}>
                        <Progress percent={progress} />
                      </Flex>
                    </Flex>
                  </Flex>
                </div>
              </div>
              <Form.Item className="addLeadSubmitBtnWrapper">
                <Button
                  onClick={nextStep}
                  disabled={loading}
                  className="selectEntitySubmitBtn1"
                >
                  Next
                </Button>
              </Form.Item>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="bulkStep2Container">
            <label className="addBulkCSVLabel">Summary</label>
            {dataType === "contacts" ? (
              <div>
                <div className="bulkSubTitle1">
                  File Uploaded : {bulkContactResponse?.filename || ""}
                </div>
                <div className="bulkSubTitle2">
                  {moment(new Date()).format("dddd, MMMM Do YYYY, h:mm A")}
                </div>
                <div className="bulkSubTitle3">
                  <div>
                    Total Contacts :{" "}
                    <span className="bulkSummaryData">
                      {bulkContactResponse?.totalCount || 0}
                    </span>
                  </div>
                  <div>
                    {" "}
                    New Added Contacts :{" "}
                    <span className="bulkSummaryData">
                      {bulkContactResponse?.SuccessCount || 0}
                    </span>
                  </div>
                  <div>
                    {" "}
                    Duplicate Detected :{" "}
                    <span className="bulkSummaryData">
                      {bulkContactResponse?.DuplicateCount || 0}
                    </span>
                  </div>
                  <div>
                    {" "}
                    Duplicate Contacts :{" "}
                    {bulkContactResponse?.duplicateContactData?.map((item) => {
                      return (
                        <span className="bulkSummaryData">
                          {`${item?.firstName} ${item?.lastName} (${item?.phone})`}
                          ,{" "}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : dataType === "leads" ? (
              <div>
                <div className="bulkSubTitle1">
                  File Uploaded : {bulkLeadResponse?.filename || ""}
                </div>
                <div className="bulkSubTitle2">
                  {moment(new Date()).format("dddd, MMMM Do YYYY, h:mm A")}
                </div>
                <div className="bulkSubTitle3">
                  <div>
                    Total Leads :{" "}
                    <span className="bulkSummaryData">
                      {bulkLeadResponse?.totalCount || 0}
                    </span>
                  </div>
                  <div>
                    {" "}
                    New Added Leads :{" "}
                    <span className="bulkSummaryData">
                      {bulkLeadResponse?.SuccessCount || 0}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="bulkSubTitle1">
                  File Uploaded : {bulkAccountResponse?.filename || ""}
                </div>
                <div className="bulkSubTitle2">
                  {moment(new Date()).format("dddd, MMMM Do YYYY, h:mm A")}
                </div>
                <div className="bulkSubTitle3">
                  <div>
                    Total Accounts :{" "}
                    <span className="bulkSummaryData">
                      {bulkAccountResponse?.totalCount || 0}
                    </span>
                  </div>
                  <div>
                    {" "}
                    New Added Accounts :{" "}
                    <span className="bulkSummaryData">
                      {bulkAccountResponse?.SuccessCount || 0}
                    </span>
                  </div>
                  <div>
                    {" "}
                    Duplicate Detected :{" "}
                    <span className="bulkSummaryData">
                      {bulkAccountResponse?.DuplicateCount || 0}
                    </span>
                  </div>
                  <div>
                    {" "}
                    Duplicate Account :{" "}
                    {bulkAccountResponse?.duplicateAccountData?.map((item) => {
                      return (
                        <span className="bulkSummaryData">
                          {`${item?.accountName}`},{" "}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            <Form.Item className="addLeadSubmitBtnWrapper">
              <Button
                type="primary"
                onClick={nextStep}
                className="selectEntitySubmitBtn1"
              >
                Finish
              </Button>
            </Form.Item>
          </div>
        );
      default:
        return null;
    }
  };

  const [current, setCurrent] = useState(0);

  const nextStep = () => {
    if (current === 0 && dataType !== "contacts") {
      setCurrent((prev) => prev + 2);
    } else if (current === 4) {
      navigate(`/${dataType}`);
    } else {
      setCurrent((prev) => prev + 1);
    }
  };
  return (
    <>
      <div className="importRecordsMainDiv">
        <Steps current={current} progressDot={customDot} onChange={setCurrent}>
          <Step title="Entity Type" />
          <Step title="File Type" />
          <Step title="Upload" />
          <Step title="Progress" />
          <Step title="Summary" />
        </Steps>
        <div style={{ marginTop: 24 }} className="stepContentWrapper">
          <StepContent step={current} nextStep={nextStep} />
        </div>
      </div>
    </>
  );
};

export default ImportRecords;
