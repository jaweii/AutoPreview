import React, { useEffect } from "react";
import { observer } from "mobx-react";
import ConfigPanel from "./components/ConfigPanel";
import Preview from "./components/Preview";
import ws from "./store/ws";
import cdp from "./store/cdp";
import { useAsyncEffect } from "ahooks";

export default observer(function App() {
  const { serverURL, appMounted, debugging } = ws.attributes;

  useAsyncEffect(async () => {
    await ws.init();
    ws.send("update", { appMounted: true });
  }, []);

  useEffect(() => {
    if (debugging) {
      cdp.init();
    }
  }, [debugging]);

  if (!appMounted) {
    return <></>;
  } else if (!serverURL) {
    return <ConfigPanel />;
  } else {
    return <Preview />;
  }
});
