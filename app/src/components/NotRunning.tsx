import React from "react";
import ws from "../store/ws";

export default function NotRunning() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div>
        <span>{ws.attributes.serverURL} </span>
        <span>Access Failed </span>
      </div>
      <div className="pt-3">
        <a onClick={() => ws.send("REFRESH")}>Retry</a>
      </div>
    </div>
  );
}
