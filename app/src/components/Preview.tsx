import React from "react";
import { runInAction } from "mobx";
import { Observer } from "mobx-react";
import store from "../../store";
import Toolbar from "./Toolbar";

export default function Preview() {
  const methods = {
    onLoad(e) {
      store.postMessage({
        command: "SET_ACTIVE_FILE",
        data: store.activeFile,
      });
      store.postMessage({
        command: "SET_COMPONENT_INDEX",
        data: store.componentIndex,
      });
      runInAction(() => {
        store.loaded = true;
      });
    },
  };

  const iframeUrl = `${store.config!.serverURL}?AutoPreview=true`;
  return (
    <Observer>
      {() => {
        return (
          <>
            <div
              className="w-full h-full relative"
              style={{
                backgroundColor: store.config.background,
                color:
                  store.config.background === "transparent"
                    ? "rgba(255,255,255,0.7)"
                    : "rgba(0,0,0,0.7)",
              }}
            >
              <Observer>
                {() => {
                  return (
                    <>
                      <div
                        className="absolute h-full w-full flex justify-center flex-col items-center"
                        style={{
                          display:
                            store.packageInitiated || !store.loaded
                              ? "none"
                              : undefined,
                        }}
                      >
                        <div>Autopreview is not initialized</div>
                      </div>
                      <div
                        className="absolute h-full w-full flex justify-center items-center"
                        style={{
                          display: store.packageInitiated
                            ? !store.activeFile
                              ? undefined
                              : "none"
                            : "none",
                        }}
                      >
                        No components exported
                      </div>
                    </>
                  );
                }}
              </Observer>
              <Observer>
                {() => {
                  return (
                    <iframe
                      id="iframe"
                      className="absolute w-full h-full"
                      src={iframeUrl}
                      frameBorder="0"
                      style={{
                        visibility: store.mounted ? undefined : "hidden",
                      }}
                      onLoad={methods.onLoad}
                    ></iframe>
                  );
                }}
              </Observer>
            </div>

            <Toolbar />
          </>
        );
      }}
    </Observer>
  );
}
