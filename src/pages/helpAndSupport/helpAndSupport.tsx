import { Spin } from "antd";
import { useEffect, useState } from "react";

const HelpAndSupport = () => {
  const [loader, setLoader] = useState(true)
  useEffect(() => {
    setTimeout(() => {
      setLoader(false)
    }, 3000);
  }, [])

  return (
    <>
      <Spin spinning={loader} tip="Loading...">
        <div>
          <iframe
            src="https://firebasestorage.googleapis.com/v0/b/cxonego-prod.appspot.com/o/New-CXOneGo-User-Guide%201.html?alt=media"
            title="Rendered HTML File"
            style={{ width: '100%', height: '100vh', border: 'none' }}
          />
        </div>
      </Spin>
    </>
  );
};

export default HelpAndSupport;
