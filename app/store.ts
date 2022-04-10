import { makeAutoObservable, observable } from "mobx";

interface Store {
  serverURL?: string;
  packageManager?: 'yarn' | 'npm';
  locked?: boolean;
  center?: boolean;
  background?: string;

  activeFile?: string;
  componentIndex?: number;
  /** 用户活动窗口导出的组件列表 */
  components?: string[];
  /** 服务是否请求失败 */
  serverURLAvailable?: true;
  /** module是否初始化 */
  packageInitiated?: boolean;
  /** 组件是否已挂载 */
  appMounted?: boolean;
  /** 组件是否挂载 */
  componentMounted: boolean;
  /** iframe是否已加载 */
  loaded?: boolean;
}

class Store {
  ws?: WebSocket;
  tasks = {} as {
    [key: string]: {
      resolve: Function;
    }
  };
  timeout = false;
  async init() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(`ws://localhost:${window.wsPort}?client=app`);
      this.ws.onopen = (e) => {
        setTimeout(() => {
          if (!this.packageInitiated) { this.timeout = true; };
        }, 5000);
        this.ws.onmessage = e => {
          const { id, action, data } = JSON.parse(e.data);
          console.log('[APP]', id, action, data);
          switch (action) {
            case 'init':
              Object.assign(this, data);
              makeAutoObservable(this);
              resolve(this);
              break;
            case 'update':
              Object.assign(this, data);
              break;
            case 'finish':
              const task = this.tasks[id] || { resolve: () => { } };
              task.resolve(data);
              delete this.tasks[id];
              break;
            default:
              break;
          }
        };
      };
    });
  }
  send(action: string, data?: any) {
    return new Promise((resolve, reject) => {
      const id = Date.now().toString();
      this.tasks[id] = { resolve };
      this.ws.send(JSON.stringify({ action, data, id }));
      setTimeout(() => {
        reject(new Error('Websocket timeout: #' + action));
      }, 3000);
    });
  }
}

export default observable(new Store());
