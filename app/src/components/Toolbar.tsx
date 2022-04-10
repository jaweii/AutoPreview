import React from "react";
import { observer, Observer } from "mobx-react";
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

export default observer(function Toolbar() {
  return (
    <div className="tool-bar w-full flex flex-wrap justify-between items-center">
      <div className="flex items-center p-1">
        <div
          className="mx-1 cursor-pointer active:opacity-70"
          onClick={() => {
            store.send("REFRESH");
          }}
          title="Refresh"
        >
          {REFRESH}
        </div>
        {store.locked && (
          <div
            className="mx-1 cursor-pointer active:opacity-70 text-highlight"
            onClick={() => store.send("update", { locked: false })}
            title="Lock"
          >
            {LOCK}
          </div>
        )}
        {!store.locked && (
          <div
            className="mx-1 cursor-pointer active:opacity-70"
            onClick={() => store.send("update", { locked: true })}
            title="Unlock"
          >
            {UNLOCK}
          </div>
        )}
        {store.center && (
          <div
            className="mx-1 cursor-pointer active:opacity-70"
            onClick={() => store.send("update", { center: false })}
            title="Align Center"
          >
            {ALIGN_CENTER}
          </div>
        )}
        {!store.center && (
          <div
            className="mx-1 cursor-pointer active:opacity-70"
            onClick={() => store.send("update", { center: true })}
            title="Align Left"
          >
            {ALIGN_LEFT}
          </div>
        )}
        {store.background === "transparent" && (
          <div
            className="mx-1 cursor-pointer active:opacity-70"
            onClick={() => store.send("update", { background: "white" })}
            title="Set white background"
          >
            {COLOR_MODE}
          </div>
        )}
        {store.background === "white" && (
          <div
            className="mx-1 cursor-pointer active:opacity-70"
            onClick={() => store.send("update", { background: "transparent" })}
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
        {(store.components || []).length > 1 && (
          <select
            className="select w-full"
            onChange={(e) => {
              store.send("update", { componentIndex: +e.target.value });
            }}
            value={store.componentIndex}
          >
            {(store.components || []).map((name, i) => {
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
});
