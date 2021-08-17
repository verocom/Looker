import React, { useEffect, useState, useContext, useCallback } from "react";
import { EmbedContainer } from "./CalendarViewStyles";
import { LookerEmbedSDK, LookerEmbedDashboard } from "@looker/embed-sdk";
import { getCoreSDK, ExtensionContext } from "@looker/extension-sdk-react";

const DashboardView = () => {
  const extensionContext = useContext(ExtensionContext);
  const [dashboardNext, setDashboardNext] = useState(true);
  const embedCtrRef = useCallback(
    (el) => {
      const hostUrl = extensionContext?.extensionSDK?.lookerHostData?.hostUrl;
      if (el && hostUrl) {
        el.innerHTML = "";
        LookerEmbedSDK.init(hostUrl);
        const db = LookerEmbedSDK.createDashboardWithId(
          "NwnHMyRHd3otxJvZxEf1Tx"
        );
        if (dashboardNext) {
          db.withNext();
        }
        db.appendTo(el)
          .on("dashboard:filters:changed", (res) => console.log("Dash", res))
          // .on('dashboard:loaded', updateRunButton.bind(null, false))
          // .on('dashboard:run:start', updateRunButton.bind(null, true))
          // .on('dashboard:run:complete', updateRunButton.bind(null, false))
          // .on('drillmenu:click', canceller)
          // .on('drillmodal:explore', canceller)
          // .on('dashboard:tile:explore', canceller)
          // .on('dashboard:tile:view', canceller)
          .build()
          .connect()
          // .then(setupDashboard)
          .catch((error) => {
            console.error("Connection error", error);
          });
      }
    },
    [dashboardNext]
  );
  return (
    <div>
      {" "}
      <EmbedContainer ref={embedCtrRef} />{" "}
    </div>
  );
};

export default DashboardView;
