import React, { useEffect, useState } from "react";
import { observer, Observer } from "mobx-react";
import ConfigPanel from "./components/ConfigPanel";
import NotRunning from "./components/NotRunning";
import Preview from "./components/Preview";
import store from "../store";

export default observer(function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    store.init().then(() => {
      setReady(true);
      store.send("update", { appMounted: true });
    });
  }, []);

  if (!ready) {
    return <></>;
  } else if (!store.serverURL) {
    return <ConfigPanel />;
  } else if (!store.serverURLAvailable) {
    return <NotRunning />;
  } else {
    return <Preview />;
  }
});
