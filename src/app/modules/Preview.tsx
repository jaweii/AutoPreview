// @ts-nocheck

export function Preview() {
  const { store, Toolbar } = exports;
  const { Observer } = mobxReactLite;
  const { useEffect } = React;
  const { runInAction } = mobx;

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
      runInAction(() => {
        store.loaded = true;
      });
    },
  };

  const iframeUrl = `${store.serverURL}?AutoPreview=true`;
  return (
    <Observer>
      {() => {
        return (
          <>
            <div
              className="w-full h-full relative"
              style={{
                backgroundColor: store.background,
                color:
                  store.background === "transparent"
                    ? "rgba(255,255,255,0.7)"
                    : "rgba(0,0,0,0.7)",
              }}
            >
              <Observer>
                {() => {
                  return (
                    <>
                      <div
                        className="absolute h-full w-full flex justify-center flex-col items-center"
                        style={{
                          display: store.packageInitiated || !store.loaded ? "none" : undefined,
                        }}
                      >
                        <div>未初始化autopreview</div>
                      </div>
                      <div
                        className="absolute h-full w-full flex justify-center items-center"
                        style={{
                          display: store.packageInitiated
                            ? !store.activeFile
                              ? undefined
                              : "none"
                            : "none",
                        }}
                      >
                        未导出预览内容
                      </div>
                    </>
                  );
                }}
              </Observer>
              <Observer>
                {() => {
                  return (
                    <iframe
                      id="iframe"
                      className="absolute w-full h-full"
                      src={iframeUrl}
                      frameBorder="0"
                      style={{
                        visibility: store.packageInitiated
                          ? undefined
                          : "hidden",
                      }}
                      onLoad={methods.onLoad}
                    ></iframe>
                  );
                }}
              </Observer>
            </div>

            <Toolbar />
          </>
        );
      }}
    </Observer>
  );
}
