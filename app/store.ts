import { makeAutoObservable, runInAction } from "mobx";

interface Config {
  background: "transparent" /** 预览窗口背景色 */ | "white";
  /** 是否锁定窗口组件 */
  locked: boolean;
  /** 用户项目服务地址 */
  serverURL: string;
}

class Store {
  constructor() {
    makeAutoObservable(this);
    this.init();
  }

  // @ts-ignore
  vscode = acquireVsCodeApi();

  /** 是否就绪 */
  ready = false;

  /** 用户活动窗口文件路径 */
  activeFile = "";
  /** vscode 插件配置 */
  config?: Config = undefined;

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

  locked = false;
  /** iframe是否已加载 */
  loaded = false;

  init() {
    window.addEventListener("message", (e) => {
      console.log("[extension/view] received a message", e.data);
      switch (e.data.command) {
        case "LOAD_CONFIG":
          // activeFile: string;
          // componentIndex: number;
          // packageManager: "yarn" | "npm";
          // serviceAvailable: boolean;
          const {
            serviceAvailable,
            activeFile,
            componentIndex,
            ...config
          } = e.data.data;
          this.config = config;
          this.serverURLAvailable = serviceAvailable;
          this.activeFile = activeFile;
          this.componentIndex = componentIndex;
          break;
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
          this.vscode.postMessage({
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

  setBG(background: "white" | "transparent") {
    this.postMessage({
      command: "SET_BACKGROUND",
      data: background,
    });
    this.config.background = background;
  }

  postMessage(data: any) {
    if (this.config?.serverURL && this.serverURLAvailable) {
      const iframe = document.querySelector("#iframe");
      // @ts-ignore
      iframe?.contentWindow?.postMessage(data, "*");
    }
    this.vscode.postMessage(data);
  }
}

export default new Store();
