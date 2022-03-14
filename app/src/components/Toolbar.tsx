import React from "react";
import { Observer } from "mobx-react";
import store from "../../store";
import {
  ALIGN_CENTER,
  ALIGN_LEFT,
  CIRCLE_LARGE_FILLED,
  COLOR_MODE,
  COPY,
  LOCK,
  REFRESH,
  UNLOCK,
} from "./icons";

export default function Toolbar() {
  return (
    <Observer>
      {() => {
        return (
          <div className="tool-bar w-full flex flex-wrap justify-between items-center">
            <div className="flex items-center p-1">
              <div
                className="mx-1 cursor-pointer active:opacity-70"
                onClick={() => {
                  store.vscode.postMessage({
                    command: "REFRESH",
                  });
                }}
                title="Refresh"
              >
                {REFRESH}
              </div>
              {store.config.locked && (
                <div
                  className="mx-1 cursor-pointer active:opacity-70 text-highlight"
                  onClick={() => store.setLock(false)}
                  title="Lock"
                >
                  {LOCK}
                </div>
              )}
              {!store.config.locked && (
                <div
                  className="mx-1 cursor-pointer active:opacity-70"
                  onClick={() => store.setLock(true)}
                  title="Unlock"
                >
                  {UNLOCK}
                </div>
              )}
              {store.config.center && (
                <div
                  className="mx-1 cursor-pointer active:opacity-70"
                  onClick={() => store.setCenter(false)}
                  title="Align Center"
                >
                  {ALIGN_CENTER}
                </div>
              )}
              {!store.config.center && (
                <div
                  className="mx-1 cursor-pointer active:opacity-70"
                  onClick={() => store.setCenter(true)}
                  title="Align Left"
                >
                  {ALIGN_LEFT}
                </div>
              )}
              {store.config.background === "transparent" && (
                <div
                  className="mx-1 cursor-pointer active:opacity-70"
                  onClick={() => store.setBG("white")}
                  title="Set white background"
                >
                  {COLOR_MODE}
                </div>
              )}
              {store.config.background === "white" && (
                <div
                  className="mx-1 cursor-pointer active:opacity-70"
                  onClick={() => store.setBG("transparent")}
                  title="Set transparent background"
                >
                  {CIRCLE_LARGE_FILLED}
                </div>
              )}
              {/* {store.loaded && (
                <div
                  className="mx-1 cursor-pointer active:opacity-70"
                  onClick={() => {}}
                  title="Copy to clipboard"
                >
                  {COPY}
                </div>
              )} */}
            </div>
            <div className="w-full">
              {store.components.length > 1 && (
                <select
                  className="select w-full"
                  onChange={(e) => store.setComponentIndex(+e.target.value)}
                  value={store.componentIndex}
                >
                  {store.components.map((name, i) => {
                    return (
                      <option key={name} value={i}>
                        {name.replace("AutoPreview_", "")}
                      </option>
                    );
                  })}
                </select>
              )}
            </div>
          </div>
        );
      }}
    </Observer>
  );
}
