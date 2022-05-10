import React, { useState } from "react";
import ws from "../store/ws";

export default function ConfigPanel() {
  const [state, setState] = useState({
    serverURL: "",
  });
  const methods = {
    save() {
      ws.send("update", { serverURL: state.serverURL });
    },
  };

  return (
    <div className="px-5 w-full">
      <div className="py-5">Configuration：</div>
      <div className="flex items-center">
        <label className="w-32">Local Server</label>
        <input
          className="flex-auto input"
          placeholder="http://localhost:3000/"
          value={state.serverURL}
          onInput={(e) => {
            // @ts-ignore
            setState({ ...state, serverURL: e.target.value });
          }}
        ></input>
      </div>
      <div className="text-center mt-5">
        <button className="button w-20" onClick={() => methods.save()}>
          Save
        </button>
      </div>
    </div>
  );
}
