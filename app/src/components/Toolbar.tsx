import React from "react";
import { Observer } from "mobx-react";
import store from "../../store";
import {
  CIRCLE_LARGE_FILLED,
  COLOR_MODE,
  LOCK,
  REFRESH,
  UNLOCK,
} from "./icons";

export default function Toolbar() {
  return (
    <Observer>
      {() => {
        return (
          <div className="tool-bar w-full flex justify-between items-center h-8">
            <div className="flex items-center pl-1">
              <div
                className="codicon codicon-refresh mx-1 cursor-pointer active:opacity-70"
                onClick={() => {
                  store.postMessage({
                    command: "REFRESH",
                  });
                }}
                title="Refresh"
              >
                {REFRESH}
              </div>
              {store.locked && (
                <div
                  className="codicon codicon-lock mx-1 cursor-pointer active:opacity-70"
                  onClick={() => store.lock(false)}
                  title="Lock"
                >
                  {LOCK}
                </div>
              )}
              {!store.locked && (
                <div
                  className="codicon codicon-unlock mx-1 cursor-pointer active:opacity-70"
                  onClick={() => store.lock(true)}
                  title="Unlock"
                >
                  {UNLOCK}
                </div>
              )}
              {store.config.background === "transparent" && (
                <div
                  className="codicon codicon-color-mode mx-1 cursor-pointer active:opacity-70"
                  onClick={() => store.setBG("white")}
                  title="Set white background"
                >
                  {COLOR_MODE}
                </div>
              )}
              {store.config.background === "white" && (
                <div
                  className="codicon codicon-circle-large-filled mx-1 cursor-pointer active:opacity-70"
                  onClick={() => store.setBG("transparent")}
                  title="Set transparent background"
                >
                  {CIRCLE_LARGE_FILLED}
                </div>
              )}
            </div>
            <div>
              {store.components.length > 1 && (
                <select
                  className="select px-2"
                  onChange={(e) => store.selectComponent(+e.target.value)}
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
