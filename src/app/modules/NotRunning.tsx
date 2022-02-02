// @ts-nocheck

export function NotRunning() {
  return (
    <div className="pl-1 pt-1 text-center">
      项目未启动，手动启动项目后
      <a
        className="ml-1"
        onClick={() => {
          vscode.postMessage({ command: "REFRESH" });
        }}
      >
        刷新
      </a>
    </div>
  );
}
