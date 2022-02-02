// @ts-nocheck

export function Preview() {
  const { store } = exports;
  const { Observer } = mobxReactLite;

  const methods = {
    onLoad(e) {
      store.postMessage({
        command: "SET_ACTIVE_FILE",
        data: store.activeFile,
      });
      store.postMessage({
        command: "SET_COMPONENT_INDEX",
        data: store.componentIndex,
      });
    },
  };

  const iframeUrl = `${store.serverURL}?AutoPreview=true`;

  return (
    <Observer>
      {() => {
        return (
          <>
            {!store.activeFile && (
              <div className="h-full w-full flex justify-center items-center">
                未导出预览内容
              </div>
            )}
            {store.activeFile && (
              <iframe
                id="iframe"
                src={iframeUrl}
                frameBorder="0"
                onLoad={methods.onLoad}
              ></iframe>
            )}

            <div className="tool-bar w-full flex justify-between items-center h-8">
              <div className="flex items-center">
                <div
                  className="codicon codicon-refresh mx-1 cursor-pointer active:opacity-70"
                  onClick={() => store.postMessage({ command: "REFRESH" })}
                  title="Refresh"
                ></div>
                {store.locked && (
                  <div
                    className="codicon codicon-lock mx-1 cursor-pointer active:opacity-70"
                    onClick={() => store.lock(false)}
                    title="Lock current Preview"
                  ></div>
                )}
                {!store.locked && (
                  <div
                    className="codicon codicon-unlock mx-1 cursor-pointer active:opacity-70"
                    onClick={() => store.lock(true)}
                    title="Unlock current Preview"
                  ></div>
                )}
              </div>
              <div>
                {store.components.length > 1 && (
                  <select
                    className="select px-2"
                    onChange={(e) => store.selectComponent(+e.target.value)}
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
          </>
        );
      }}
    </Observer>
  );
}
