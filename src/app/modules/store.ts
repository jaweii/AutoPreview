const { makeAutoObservable, runInAction } = (window as any).mobx;

class Store {
  constructor() {
    this.init();
    makeAutoObservable(this);
  }

  /** 用户项目服务地址 */
  serverURL = "";
  /** 用户活动窗口文件路径 */
  activeFile = "";
  /** vscode 插件配置 */
  config = {};

  /** 用户活动窗口导出的组件列表 */
  components: string[] = [];
  /** 组件列表当前索引 */
  componentIndex = 0;

  /** 服务是否请求失败 */
  serverURLAvailable = true;
  /** module是否初始化 */
  packageInitiated = false;
  /** 组件是否已挂载 */
  mounted = false;

  /** 是否锁定窗口组件 */
  locked = false;
  /** iframe是否已加载 */
  loaded = false;
  /** 预览窗口背景色 */
  background = "white";

  init() {
    const {
      serverURL,
      serverURLAvailable,
      activeFile,
      componentIndex,
      config,
    } = (window as any).template;
    this.serverURL = serverURL;
    this.serverURLAvailable = serverURLAvailable;
    this.activeFile = activeFile;
    this.componentIndex = componentIndex;
    this.config = config;
    this.locked = config.locked ?? this.locked;
    this.background = config.background ?? this.background;

    window.addEventListener("message", (e) => {
      console.log("[extension/view] received a message", e.data);
      switch (e.data.command) {
        case "SET_COMPONENT_LIST":
          runInAction(() => {
            this.components = e.data.data;
          });
          break;
        case "SET_COMPONENT_INDEX":
          runInAction(() => {
            this.componentIndex = e.data.data;
          });
          break;
        case "SET_ACTIVE_FILE":
          runInAction(() => {
            this.mounted = false;
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
        case "COMPONENT_MOUNTED":
          runInAction(() => {
            this.mounted = true;
          });
          break;
        case "ERROR":
          // @ts-ignore
          vscode.postMessage({
            command: "ERROR",
            data: e.data.data,
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

  setBG(background: string) {
    this.postMessage({
      command: "SET_BACKGROUND",
      data: background,
    });
    this.background = background;
  }

  postMessage(data: any) {
    if (this.serverURL && this.serverURLAvailable) {
      const iframe = document.querySelector("#iframe");
      // @ts-ignore
      iframe?.contentWindow?.postMessage(data, "*");
    }
    // @ts-ignore
    vscode.postMessage(data);
  }
}

exports.store = new Store();
