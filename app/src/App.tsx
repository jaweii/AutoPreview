import React, { useEffect } from "react";
import { Observer } from "mobx-react";
import ConfigPanel from "./components/ConfigPanel";
import NotRunning from "./components/NotRunning";
import Preview from "./components/Preview";
import store from "../store";

export default function App() {
  useEffect(() => {
    // 通知插件view已渲染
    store.postMessage({
      command: "APP_MOUNTED",
    });
  }, []);

  return (
    <Observer>
      {() => {
        if (!store.config?.serverURL) {
          return <ConfigPanel />;
        } else if (!store.serverURLAvailable) {
          return <NotRunning />;
        } else {
          return <Preview />;
        }
      }}
    </Observer>
  );
}
