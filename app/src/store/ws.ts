import { makeAutoObservable, runInAction } from "mobx";
import { domains } from "./cdp";

interface Attributes {
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
  serverURLAvailable?: boolean;
  /** module是否初始化 */
  packageInitiated?: boolean;
  /** 组件是否已挂载 */
  appMounted?: boolean;
  /** 组件是否挂载 */
  componentMounted: boolean;
  /** iframe是否已加载 */
  loaded?: boolean;
  /** 调试开启 */
  debugging?: boolean;
}

class Store {
  constructor() {
    makeAutoObservable(this);
  }

  ws?: WebSocket;
  tasks = {} as {
    [key: string]: {
      resolve: Function;
    }
  };
  private events = {} as { [key: string]: Function[] };
  timeout = false;

  get url() {
    // @ts-ignore
    return `${this.attributes.serverURL}?AutoPreview=true&wsPort=${window.wsPort}`;
  }

  async init() {
    return new Promise((resolve, reject) => {
      // @ts-ignore
      const ws = new WebSocket(`ws://localhost:${window.wsPort}?client=app`);
      ws.onerror = console.error;
      ws.onclose = () => {
        console.log('[app] websocket closed');
        this.ws = undefined;
        this.attributes.serverURLAvailable = false;
        this.attributes.packageInitiated = false;
        this.attributes.componentMounted = false;
        this.attributes.componentIndex = -1;
        this.attributes.components = [];
        // this.attributes.loaded = false;
        // this.attributes.appMounted = false;
      };
      ws.onopen = (e) => {
        this.ws = ws;
        setTimeout(() => {
          if (!this.attributes.packageInitiated) { this.timeout = true; };
        }, 5000);
        this.ws.onmessage = async e => {
          const { id, action, data } = JSON.parse(e.data);
          switch (action) {
            case 'init':
            case 'update':
              runInAction(() => {
                Object.assign(this.attributes, data);
                resolve(this);
              });
              break;
            case 'finish':
              const task = this.tasks[id] || { resolve: () => { } };
              task.resolve(data);
              delete this.tasks[id];
              break;
            default:
              const domain = domains.find(domain => action.startsWith(domain + '.'));
              if (domain) {
                const events = this.events['CDP'] || [];
                for (const fn of events) {
                  let res = fn({ action, id, data });
                  if (typeof res === 'object' && res.then) {
                    res = await res.then();
                  }
                }
              }
              break;
          }
          const events = this.events[action] || [];
          events.forEach(fn => fn(data));

        };
      };
    });
  }

  send(action: string, data?: any) {
    if (!this.ws) { return Promise.reject('Websocket is not initialized'); };
    return new Promise((resolve, reject) => {
      const id = Date.now().toString();
      this.tasks[id] = { resolve };
      this.ws.send(JSON.stringify({ action, data, id }));
      setTimeout(() => {
        reject({ type: 'timeout', action, data, });
      }, 30000);
    });
  }

  on(name: string, fn: Function) {
    if (!this.events[name]) {
      this.events[name] = [];
    }
    this.events[name].push(fn);
  }

  attributes: Attributes = {
    serverURL: '',
    packageManager: 'yarn',
    locked: false,
    center: false,
    background: 'transparent',

    activeFile: '',
    componentIndex: -1,
    components: [],
    serverURLAvailable: false,
    packageInitiated: false,
    appMounted: false,
    componentMounted: false,
    loaded: false,
    debugging: false,
  };
}

export default new Store();
