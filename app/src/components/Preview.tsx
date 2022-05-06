import React from "react";
import { observer } from "mobx-react";
import ws from "../store/ws";
import Toolbar from "./Toolbar";
import Viewport from "./Viewport";
import classNames from "classnames";

export default observer(function Preview() {
  const {
    serverURLAvailable,
    serverURL,
    background,
    debugging,
    componentMounted,
  } = ws.attributes;
  return (
    <>
      {ws.timeout && (
        <div className="p-2 w-full shrink">
          [Warning] Autopreview is not initialized
        </div>
      )}
      {!serverURLAvailable && (
        <div className="w-full p-2 flex items-center justify-center">
          <div className="grow">
            <span>[Warning] {serverURL} </span>
            <span>Access Failed </span>
          </div>
          <div>
            <a
              onClick={() => {
                ws.send("REFRESH");
                location.reload();
              }}
            >
              Retry
            </a>
          </div>
        </div>
      )}
      <div
        className="w-full h-full relative overflow-hidden"
        style={{
          backgroundColor: background,
          color:
            background === "transparent"
              ? "rgba(255,255,255,0.7)"
              : "rgba(0,0,0,0.7)",
        }}
      >
        {debugging && (
          <Viewport
            className={classNames({
              "opacity-0": componentMounted ? undefined : "hidden",
            })}
          />
        )}
        {!debugging && (
          <iframe
            id="iframe"
            className={classNames("absolute w-full h-full", {
              "opacity-0": componentMounted ? undefined : "hidden",
            })}
            src={ws.url}
            frameBorder="0"
          ></iframe>
        )}
      </div>

      <Toolbar />
    </>
  );
});
