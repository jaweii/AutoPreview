import React from "react";
import store from "../../store";

export default function NotRunning() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div>
        <span>{store.config?.serverURL} </span>
        <span>Access Failed </span>
      </div>
      <div className="pt-3">
        <a
          onClick={() => {
            store.vscode.postMessage({ command: "REFRESH" });
          }}
        >
          Retry
        </a>
      </div>
    </div>
  );
}