/**
 * Use websocket based store to avoid using `postMessage` communicate with iframe
 */

import { RawData, WebSocketServer } from 'ws';
import { pick } from 'lodash';
import { makeAutoObservable } from 'mobx';
import WebSocket = require('ws');

interface Command {
  id: string
  action: string
  data?: { key: string, value: any }
}

const properties = ['serverURL', 'packageManager', 'locked', 'background', 'center', 'serverURLAvailable', 'activeFile',
  'componentIndex', 'components', 'packageInitiated', 'appMounted', 'componentMounted'];

class WSStore {
  constructor(port: number) {
    makeAutoObservable(this);
    this._wss = new WebSocketServer({
      port
    });
    this._wss.on('connection', (ws, req) => {
      const url = new URL(req.headers.origin + req.url!);
      const client = url.searchParams.get('client');
      if (client === 'app') {
        this._appClient = ws;
      }
      if (client === 'package') {
        this._packageClient = ws;
      }
      ws.on('message', d => this._onMessage(ws, d));
      ws.send(JSON.stringify({
        action: 'init',
        data: pick(this, properties)
      }));
    });
    this._port = port;
  }

  _port!: number;
  _wss!: WebSocketServer;
  _appClient!: WebSocket;
  _packageClient!: WebSocket;
  _open = false;
  _events = {} as { [key: string]: Function[] };
  _onMessage(client: WebSocket, raw: RawData) {
    const { id, action, data }: Command = JSON.parse(raw.toString());
    switch (action) {
      case 'update':
        console.log('[WSStore]', action, data);
        const illegal = Object.keys(data!).filter(key => !properties.includes(key));
        if (illegal.length) {
          console.warn(`[WSStore] received illegal update: ${illegal.join(',')}`);
        }
        Object.assign(this, data);
        client.send(JSON.stringify({
          id,
          action: 'finish',
          data: data,
        }));
        this._wss.clients.forEach(client => {
          client.send(JSON.stringify({
            id,
            action: 'update',
            data,
          }));
        });
        break;
      default:
        break;
    }
    const events = this._events[action] || [];
    events.forEach(fn => fn(data));
  }
  _update(data: Partial<WSStore>) {
    Object.assign(this, data);
    if (!this._wss) { return; };
    this._wss.clients.forEach(client => {
      client.send(JSON.stringify({
        action: 'update',
        data: data,
      }));
    });
  }
  _on(name: string, fn: Function) {
    if (!this._events[name]) {
      this._events[name] = [];
    }
    this._events[name].push(fn);
  }

  serverURL = '';
  packageManager = 'yarn';
  locked = false;
  center = false;
  background = 'transparent';

  activeFile?: string;
  componentIndex?: number;
  /** 用户活动窗口导出的组件列表 */
  components: string[] = [];
  /** 服务是否请求失败 */
  serverURLAvailable = true;
  /** module是否初始化 */
  packageInitiated = false;
  /** app是否已挂载 */
  appMounted = false;
  /** 组件是否挂载 */
  componentMounted = false;
  /** iframe是否已加载 */
  loaded = false;
}

export default WSStore;