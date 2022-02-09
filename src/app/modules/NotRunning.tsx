// @ts-nocheck

export function NotRunning() {
  const { store, Toolbar } = exports;
  return (
    <div className="pl-1 pt-1 text-center">
      <div>
        <span>{store.serverURL} </span>
        <span>访问失败 </span>
      </div>
      <div className="pt-3">
        <a
          onClick={() => {
            vscode.postMessage({ command: "REFRESH" });
          }}
        >
          重试
        </a>
      </div>
    </div>
  );
}
