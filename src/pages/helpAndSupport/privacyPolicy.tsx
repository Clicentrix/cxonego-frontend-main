import { Spin } from "antd";
import { useEffect, useState } from "react";

const PrivacyPolicy = () => {
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
                        src="https://firebasestorage.googleapis.com/v0/b/cxonego-prod.appspot.com/o/CXOneGo%20Privacy%20Policy_Final.html?alt=media"
                        title="Rendered HTML File"
                        style={{ width: '100%', height: '100vh', border: 'none' }}
                    />
                </div>
            </Spin>
        </>
    );
};

export default PrivacyPolicy;
