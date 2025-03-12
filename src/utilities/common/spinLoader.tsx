import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
function SpinLoader() {
  return (
    <>
      <Spin
        indicator={
          <LoadingOutlined
            style={{ fontSize: 18, color: "var(--orange-color)" }}
            spin
          />
        }
      />
    </>
  );
}

export default SpinLoader;
