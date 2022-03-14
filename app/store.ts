import { makeAutoObservable, runInAction } from "mobx";

interface Config {
  background: "transparent" /** 预览窗口背景色 */ | "white";
  /** 是否锁定窗口组件 */
  locked: boolean;
  /** 用户项目服务地址 */
  serverURL: string;
  /** 居中对齐 */
  center: boolean;
}

class Store {
  constructor() {
    makeAutoObservable(this);
    this.init();
  }

  // @ts-ignore
  vscode = acquireVsCodeApi();

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

  /** iframe是否已加载 */
  loaded = false;

  /** 是否就绪(config已加载) */
  ready = false;

  init() {
    window.addEventListener("message", (e) => {
      console.log("[EXTENSION/VIEW] received a message", e.data);
      switch (e.data.command) {
        case "LOAD_CONFIG":
          // activeFile: string;
          // componentIndex: number;
          // packageManager: "yarn" | "npm";
          // serviceAvailable: boolean;
          const { serviceAvailable, activeFile, componentIndex, ...config } =
            e.data.data;
          runInAction(() => {
            this.config = config;
            this.serverURLAvailable = serviceAvailable;
            this.activeFile = activeFile;
            this.componentIndex = componentIndex;
            this.ready = true;
          });
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
          this.postMessageToIframe({
            command: "SET_ACTIVE_FILE",
            data: this.activeFile,
          });
          break;
        case "PACKAGE_INITIATED":
          this.onPackageInstalled()
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
        case "CONSOLE":
          this.vscode.postMessage({
            command: "CONSOLE",
            data: e.data,
          });
          break;
        default:
          console.log("[EXTENSION/VIEW] ignore command:", e.data.command);
          break;
      }
    });
  }

  async onPackageInstalled() {
    this.postMessageToIframe({
      command: "SET_ACTIVE_FILE",
      data: this.activeFile,
    });
    this.postMessageToIframe({
      command: "SET_COMPONENT_INDEX",
      data: this.componentIndex,
    });
    this.postMessageToIframe({
      command: "SET_COMPONENT_INDEX",
      data: this.componentIndex,
    });
    this.postMessageToIframe({
      command: "SET_ALIGNMENT",
      data: this.config.center ? "center" : "leftTop",
    });
    this.vscode.postMessage({
      command: "SET_COMPONENT_INDEX",
      data: this.componentIndex,
    });

    this.packageInitiated = true;
    this.loaded = true;
  }

  setComponentIndex(index: number) {
    this.componentIndex = index;
    this.postMessageToIframe({
      command: "SET_COMPONENT_INDEX",
      data: index,
    });
    this.vscode.postMessage({
      command: "SET_COMPONENT_INDEX",
      data: index,
    });
  }

  setLock(lock: boolean) {
    this.vscode.postMessage({
      command: "LOCK",
      data: lock,
    });
    this.config.locked = lock;
  }

  setBG(background: "white" | "transparent") {
    this.vscode.postMessage({
      command: "SET_BACKGROUND",
      data: background,
    });
    this.config.background = background;
  }

  setCenter(center: boolean) {
    this.postMessageToIframe({
      command: "SET_ALIGNMENT",
      data: center ? "center" : "leftTop",
    });
    this.config.center = center;
  }

  postMessageToIframe(data: any) {
    if (this.config?.serverURL && this.serverURLAvailable) {
      const iframe = document.querySelector("#iframe");
      // @ts-ignore
      iframe?.contentWindow?.postMessage(data, "*");
    }
  }
}

export default new Store();
