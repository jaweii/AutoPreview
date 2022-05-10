import React from "react";
import { observer } from "mobx-react";
import ws from "../store/ws";
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
import classNames from "classnames";

export default observer(function Toolbar() {
  const {
    locked,
    center,
    background,
    loaded,
    components,
    componentIndex,
    debugging,
  } = ws.attributes;

  return (
    <div className="tool-bar w-full flex flex-wrap justify-between items-center">
      <div className="flex items-center p-1">
        <div
          className={classNames("mx-1 cursor-pointer active:opacity-70", {
            hidden: debugging,
          })}
          onClick={() => {
            ws.send("REFRESH");
            location.reload();
          }}
          title="Refresh"
        >
          {REFRESH}
        </div>
        {locked && (
          <div
            className="mx-1 cursor-pointer active:opacity-70 text-highlight"
            onClick={() => ws.send("update", { locked: false })}
            title="Lock"
          >
            {LOCK}
          </div>
        )}
        {!locked && (
          <div
            className="mx-1 cursor-pointer active:opacity-70"
            onClick={() => ws.send("update", { locked: true })}
            title="Unlock"
          >
            {UNLOCK}
          </div>
        )}
        {center && (
          <div
            className="mx-1 cursor-pointer active:opacity-70"
            onClick={() => ws.send("update", { center: false })}
            title="Align Center"
          >
            {ALIGN_CENTER}
          </div>
        )}
        {!center && (
          <div
            className="mx-1 cursor-pointer active:opacity-70"
            onClick={() => ws.send("update", { center: true })}
            title="Align Left"
          >
            {ALIGN_LEFT}
          </div>
        )}
        <div
          className={classNames("mx-1 cursor-pointer active:opacity-70", {
            hidden: background !== "transparent" || debugging,
          })}
          onClick={() => ws.send("update", { background: "white" })}
          title="Set white background"
        >
          {COLOR_MODE}
        </div>
        <div
          className={classNames("mx-1 cursor-pointer active:opacity-70", {
            hidden: background !== "white" || debugging,
          })}
          onClick={() => ws.send("update", { background: "transparent" })}
          title="Set transparent background"
        >
          {CIRCLE_LARGE_FILLED}
        </div>
        {/* {loaded && (
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
        {(components || []).length > 1 && (
          <select
            className="select w-full"
            onChange={(e) => {
              ws.send("update", { componentIndex: +e.target.value });
            }}
            value={componentIndex}
          >
            {(components || []).map((name, i) => {
              return (
                <option key={name} value={i}>
                  {name.replace(/autopreview(_|)/i, "")}
                </option>
              );
            })}
          </select>
        )}
      </div>
    </div>
  );
});
