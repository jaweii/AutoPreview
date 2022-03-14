import React from "react";
import { Observer } from "mobx-react";
import store from "../../store";
import Toolbar from "./Toolbar";

export default function Preview() {
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
                  const initialized = store.packageInitiated;
                  const exported = store.packageInitiated && store.activeFile;
                  if (!initialized) {
                    return (
                      <div className="absolute h-full w-full flex justify-center flex-col items-center">
                        <div>Autopreview is not initialized</div>
                      </div>
                    );
                  }
                  if (!exported) {
                    return (
                      <div className="absolute h-full w-full flex justify-center items-center">
                        No components exported
                      </div>
                    );
                  }
                  return <></>;
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
