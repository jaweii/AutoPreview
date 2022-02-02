const template = (window as any).template;

(async function main() {
  await loadModule("/modules/store");
  await loadModule("/modules/App");
  await loadModule("/modules/ConfigPanel");
  await loadModule("/modules/Preview");
  await loadModule("/modules/NotRunning");

  const { App } = exports;
  ReactDOM.render(<App />, document.querySelector("#app"));
})();

async function loadModule(path: string) {
  if (!path.endsWith(".js")) {
    path += ".js";
  }
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = template.appRoot + path;
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });
}
