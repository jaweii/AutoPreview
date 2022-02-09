// @ts-nocheck

export function App() {
  const { useEffect } = React;
  const { store } = exports;
  const { Observer } = mobxReactLite;
  useEffect(() => {
    store.postMessage({
      command: "APP_LOADED",
    });
  }, []);

  return (
    <Observer>
      {() => {
        if (!store.serverURL) {
          return <ConfigPanel />;
        } else if (store.serverUrlLoadFailed) {
          return <NotRunning />;
        } else {
          return <Preview />;
        }
      }}
    </Observer>
  );
}
