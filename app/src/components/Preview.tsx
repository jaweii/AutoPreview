import React, { useEffect } from "react";
import { observer, Observer } from "mobx-react";
import store from "../../store";
import Toolbar from "./Toolbar";

export default observer(function Preview() {
  return (
    <>
      <div
        className="w-full h-full relative"
        style={{
          backgroundColor: store.background,
          color:
            store.background === "transparent"
              ? "rgba(255,255,255,0.7)"
              : "rgba(0,0,0,0.7)",
        }}
      >
        <Observer>
          {() => {
            if (store.timeout) {
              return (
                <div className="absolute h-full w-full flex justify-center flex-col items-center">
                  <div>Autopreview is not initialized</div>
                </div>
              );
            }
            return <></>;
          }}
        </Observer>
        <Observer>
          {() => {
            const iframeUrl = `${store!.serverURL}?AutoPreview=true&wsPort=${
              window.wsPort
            }`;
            return (
              <iframe
                id="iframe"
                className="absolute w-full h-full"
                src={iframeUrl}
                frameBorder="0"
                style={{
                  visibility: store.componentMounted ? undefined : "hidden",
                }}
              ></iframe>
            );
          }}
        </Observer>
      </div>

      <Toolbar />
    </>
  );
});
