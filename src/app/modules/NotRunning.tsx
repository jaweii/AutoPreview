// @ts-nocheck

export function NotRunning() {
  const { store, Toolbar } = exports;
  return (
    <div className="pl-1 pt-1 text-center">
      <div>
        <span>{store.serverURL} </span>
        <span>Access Failed </span>
      </div>
      <div className="pt-3">
        <a
          onClick={() => {
            vscode.postMessage({ command: "REFRESH" });
          }}
        >
          Retry
        </a>
      </div>
    </div>
  );
}
