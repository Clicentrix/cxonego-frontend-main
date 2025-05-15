import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
function SpinLoader() {
    return (_jsx(_Fragment, { children: _jsx(Spin, { indicator: _jsx(LoadingOutlined, { style: { fontSize: 18, color: "var(--orange-color)" }, spin: true }) }) }));
}
export default SpinLoader;
