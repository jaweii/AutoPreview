// @ts-nocheck

export function ConfigPanel() {
  const { useState } = React;
  const { store } = exports;
  const [state, setState] = useState({
    serverURL: "",
  });
  const methods = {
    save() {
      store.postMessage({
        command: "UPDATE_CONFIG",
        data: {
          serverURL: state.serverURL,
        },
      });
    },
  };

  return (
    <div className=" px-5">
      <div className="py-5">Enter the local server address：</div>
      <div className="flex items-center">
        <label className="w-20">Local Server:</label>
        <input
          className="flex-auto input"
          placeholder="http://localhost:3000/"
          value={state.serverURL}
          onInput={(e) => {
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
