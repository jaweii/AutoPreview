// @ts-nocheck

export function Preview() {
  const { store, Toolbar } = exports;
  const { Observer } = mobxReactLite;
  const { useEffect } = React;

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
    <>
      <div className="w-full h-full relative">
        <Observer>
          {() => {
            return (
              <>
                <div
                  className="absolute h-full w-full flex justify-center flex-col items-center"
                  style={{
                    display: store.packageInitiated ? "none" : undefined,
                  }}
                >
                  <div>未初始化</div>
                  <code className="m-4 text-sm break-al">
                    <div>import AutoPreview from 'autopreview/react'</div>
                    <div>// or</div>
                    <div>import AutoPreview from 'autopreview/vue'</div>
                    <div className="my-2"></div>
                    <div>new AutoPreview(rootSelector)</div>
                  </code>
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
                  visibility: store.packageInitiated ? undefined : "hidden",
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
}
