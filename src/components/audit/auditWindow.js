import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useAppDispatch, useAppSelector } from "../../redux/app/hooks";
import { StarFilled } from "@ant-design/icons";
import { Avatar, Skeleton } from "antd";
import moment from "moment";
import { ACTIVITY_LOG_ORANGE } from "../../utilities/common/imagesImports";
import { useEffect } from "react";
import { resetAudits } from "../../redux/features/auditSlice";
const AuditWindow = () => {
    const dispatch = useAppDispatch();
    const { getAuditLoader, auditData } = useAppSelector((state) => state.audits);
    useEffect(() => {
        resetAudits();
    }, [dispatch]);
    return (_jsxs("div", { className: "floatActivityDiv", children: [_jsxs("div", { className: "floatActivitytitle", children: [_jsx("img", { src: ACTIVITY_LOG_ORANGE, alt: "illustration", className: "illustrationIcon" }), "Activity Log"] }), _jsx("hr", { className: "relatedViewHr" }), _jsx("div", { className: "floatActivityMapDiv", children: getAuditLoader ? (_jsx(Skeleton, {})) : auditData?.length > 0 ? (auditData?.map((item, index) => {
                    return (_jsx(_Fragment, { children: _jsxs("div", { className: "floatActivityFlex", children: [_jsx(StarFilled, { style: { color: "var(--orange-color" } }), _jsxs("div", { children: [_jsx("div", { className: "floatActivityDate", children: moment(item?.audit?.updatedAt).format("MMMM Do YYYY, h:mm:ss a") }), _jsxs("div", { className: "auditAvtarFlex", children: [_jsxs(Avatar, { className: "auditAvtar", children: [item?.audit?.owner?.firstName?.slice(0, 1), " ", item?.audit?.owner?.lastName?.slice(0, 1)] }), _jsx("div", { className: "floatActivitySubject", children: `${item?.audit?.owner?.firstName} ${item?.audit?.owner?.lastName}` })] }), item?.audit?.auditType === "INSERTED" ? (_jsx("div", { className: "floatActivitySubject", children: item?.audit?.description })) : (_jsx("div", { className: "floatActivitySubject", children: _jsx("div", { className: "floatActivitySubject", children: item?.changes?.length > 0
                                                    ? item?.changes?.map((item) => {
                                                        return (_jsx("div", { style: { textTransform: "capitalize" }, children: `- ${item?.label} - ${item?.change}` }));
                                                    })
                                                    : null }) }))] })] }, index) }));
                })) : (_jsx("div", { className: "grayText", children: "No Logs are available" })) })] }));
};
export default AuditWindow;
