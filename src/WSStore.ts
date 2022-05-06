import { RawData, WebSocketServer } from 'ws';
import { pick } from 'lodash';
import { makeAutoObservable, runInAction } from 'mobx';
import WebSocket = require('ws');
import getPort from 'get-port';
import { ProtocolMapping } from 'puppeteer-core';
import cdpController, { domains } from './cdpController';

interface Command {
  id: string
  action: string
  data?: any
}

interface WSStore {
  on(name: string, fn: (data: any) => void): void
  on(name: 'CDP', fn: (props: { action: keyof ProtocolMapping.Commands, data: any }) => void): void

}

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

const properties = ['serverURL', 'packageManager', 'locked', 'background', 'center', 'serverURLAvailable', 'activeFile',
  'componentIndex', 'components', 'packageInitiated', 'appMounted', 'componentMounted', 'debugging', 'loaded'];

class WSStore {
  async init() {
    makeAutoObservable(this);
    const port = await getPort();
    this.wss = new WebSocketServer({
      port
    });
    this.wss.on('connection', (ws, req) => {
      const url = new URL(req.headers.origin + req.url!);
      const client = url.searchParams.get('client');
      if (client === 'app') {
        this.appClient = ws;
      }
      if (client === 'package') {
        this.packageClient = ws;
      }
      ws.on('message', d => this.onMessage(ws, d));
      ws.send(JSON.stringify({
        action: 'init',
        data: pick(this.attributes, properties)
      }));
    });
    this.port = port;
  }

  port!: number;
  wss!: WebSocketServer;
  appClient?: WebSocket;
  packageClient?: WebSocket;
  private events = {} as { [key: string]: Function[] };
  private async onMessage(client: WebSocket, raw: RawData) {
    const { id, action, data }: Command = JSON.parse(raw.toString());
    switch (action) {
      case 'update':
        console.log('[WSStore]', action, data);
        const illegal = Object.keys(data!).filter(key => !properties.includes(key));
        if (illegal.length) {
          console.warn(`[WSStore] received illegal update: ${illegal.join(',')}`);
        }
        runInAction(() => Object.assign(this.attributes, data));
        client.send(JSON.stringify({
          id,
          action: 'finish',
          data: data,
        }));
        this.wss.clients.forEach(client => {
          client.send(JSON.stringify({
            id,
            action: 'update',
            data,
          }));
        });
        break;
      case 'puppeteer':
        const page = cdpController.page;
        const { name, args = [] } = data as { name: string, args: any[] };
        const [type, subType, methodName] = name.split('.');
        let res: any;
        if (type === 'page') {
          // @ts-ignore
          res = await page[subType][methodName](...args);
        }
        client.send(JSON.stringify({
          id,
          action: 'finish',
          data: res,
        }));
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
            client.send(JSON.stringify({
              id,
              action: 'finish',
              data: res,
            }));
          }
        }
        break;
    }
    const events = this.events[action] || [];
    events.forEach(fn => fn(data));
  }
  update(data: Partial<Attributes>) {
    Object.assign(this.attributes, data);
    if (!this.wss) { return; };
    this.wss.clients.forEach(client => {
      client.send(JSON.stringify({
        action: 'update',
        data: data,
      }));
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



const wsStore = new WSStore();
export default wsStore;