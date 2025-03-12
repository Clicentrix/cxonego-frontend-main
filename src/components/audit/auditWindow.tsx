import { RootState } from "../../redux/app/store";
import { useAppDispatch, useAppSelector } from "../../redux/app/hooks";
import { StarFilled } from "@ant-design/icons";
import { Avatar, Skeleton } from "antd";
import moment from "moment";
import { ACTIVITY_LOG_ORANGE } from "../../utilities/common/imagesImports";
import { AuditChange } from "../../utilities/common/exportDataTypes/auditDataTypes";
import { useEffect } from "react";
import { resetAudits } from "../../redux/features/auditSlice";

const AuditWindow: React.FC = () => {
  const dispatch = useAppDispatch();
  const { getAuditLoader, auditData } = useAppSelector(
    (state: RootState) => state.audits
  );

  useEffect(() => {
    resetAudits();
  }, [dispatch]);
  return (
    <div className="floatActivityDiv">
      <div className="floatActivitytitle">
        <img
          src={ACTIVITY_LOG_ORANGE}
          alt="illustration"
          className="illustrationIcon"
        />
        Activity Log
      </div>
      <hr className="relatedViewHr" />

      <div className="floatActivityMapDiv">
        {getAuditLoader ? (
          <Skeleton />
        ) : auditData?.length > 0 ? (
          auditData?.map((item, index) => {
            return (
              <>
                <div key={index} className="floatActivityFlex">
                  <StarFilled style={{ color: "var(--orange-color" }} />
                  <div>
                    <div className="floatActivityDate">
                      {moment(item?.audit?.updatedAt).format(
                        "MMMM Do YYYY, h:mm:ss a"
                      )}
                    </div>
                    <div className="auditAvtarFlex">
                      <Avatar className="auditAvtar">
                        {item?.audit?.owner?.firstName?.slice(0, 1)}{" "}
                        {item?.audit?.owner?.lastName?.slice(0, 1)}
                      </Avatar>
                      <div className="floatActivitySubject">{`${item?.audit?.owner?.firstName} ${item?.audit?.owner?.lastName}`}</div>
                    </div>
                    {item?.audit?.auditType === "INSERTED" ? (
                      <div className="floatActivitySubject">
                        {item?.audit?.description}
                      </div>
                    ) : (
                      <div className="floatActivitySubject">
                        <div className="floatActivitySubject">
                          {item?.changes?.length > 0
                            ? item?.changes?.map((item: AuditChange) => {
                                return (
                                  <div style={{ textTransform: "capitalize" }}>
                                    {`- ${item?.label} - ${item?.change}`}
                                  </div>
                                );
                              })
                            : null}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            );
          })
        ) : (
          <div className="grayText">No Logs are available</div>
        )}
      </div>
    </div>
  );
};

export default AuditWindow;
