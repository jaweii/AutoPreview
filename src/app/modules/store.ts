const { makeAutoObservable, runInAction } = (window as any).mobx;

class Store {
  constructor() {
    this.init();
    makeAutoObservable(this);
  }

  serverURL = "";
  activeFile = "";
  config = {};

  components: string[] = [];
  componentIndex = 0;

  serverUrlLoadFailed = false;
  packageInitiated = false;

  locked = false;

  init() {
    const { serverURL, activeFile, config } = (window as any).template;
    this.serverURL = serverURL;
    this.activeFile = activeFile;
    this.config = config;
    this.locked = config.locked;

    if (this.serverURL) {
      // 检查ServerURL是否运行
      const xhttp = new XMLHttpRequest();
      const that = this;
      // @ts-ignore
      xhttp.onreadystatechange = function () {
        that.serverUrlLoadFailed = this.readyState === 4 && this.status !== 200;
      };
      xhttp.open("GET", this.serverURL, true);
      xhttp.send();
    }

    window.addEventListener("message", (e) => {
      console.log("[extension/view] received a message", e.data);
      switch (e.data.command) {
        case "SET_COMPONENT_LIST":
          runInAction(() => {
            this.components = e.data.data;
          });
          break;
        case "SET_ACTIVE_FILE":
          runInAction(() => {
            this.activeFile = e.data.data;
          });
          this.postMessage({
            command: "SET_ACTIVE_FILE",
            data: this.activeFile,
          });
          break;
        case "PACKAGE_INITIATED":
          runInAction(() => {
            this.packageInitiated = true;
          });
          break;
        default:
          console.log("[extension/view] ignore command:", e.data.command);
          break;
      }
    });
  }

  selectComponent(index: number) {
    this.componentIndex = index;
    this.postMessage({
      command: "SET_COMPONENT_INDEX",
      data: index,
    });
  }

  lock(lock: boolean) {
    this.postMessage({
      command: "LOCK",
      data: lock,
    });
    this.locked = lock;
  }

  postMessage(data: any) {
    if (this.serverURL && !this.serverUrlLoadFailed) {
      const iframe = document.querySelector("#iframe");
      // @ts-ignore
      iframe?.contentWindow?.postMessage(data, "*");
    }
    // @ts-ignore
    vscode.postMessage(data);
  }
}

exports.store = new Store();
