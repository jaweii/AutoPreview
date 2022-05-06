import { makeAutoObservable, runInAction } from "mobx";
import ws from "./ws";

export const domains = ["Accessibility", "Animation", "Audits", "BackgroundService", "Browser", "CacheStorage", "Cast",
  "Console", "CSS", "Database", "Debugger", "DeviceOrientation", "DOM", "DOMDebugger", "DOMSnapshot", "DOMStorage",
  "Emulation", "EventBreakpoints", "Fetch", "HeadlessExperimental", "HeapProfiler", "IndexedDB", "Input", "Inspector",
  "IO", "LayerTree", "Log", "Media", "Memory", "Network", "Overlay", "Page", "Performance", "PerformanceTimeline",
  "Profiler", "Runtime", "Schema", "Security", "ServiceWorker", "Storage", "SystemInfo", "Target", "Tethering",
  "Tracing", "WebAudio", "WebAuthn"];

class Connection {
  constructor() {
    makeAutoObservable(this);
  }

  initiated = false;

  viewport = {
    width: null as number | null,
    height: null as number | null
  };

  screencastFrame = {
    data: '',
    metadata: {
      deviceHeight: 0,
      deviceWidth: 0,
      offsetTop: 0,
      pageScaleFactor: 1,
      scrollOffsetX: 0,
      scrollOffsetY: 0,
      timestamp: 0,
    },
    sessionId: -1
  };

  async init() {
    ws.on('Page.screencastFrame', async data => {
      await ws.send('Page.screencastFrameAck', { sessionId: data.sessionId });
      runInAction(() => this.screencastFrame = data);
    });
    await ws.send("Page.navigate", { url: ws.url });

    //#region 设置
    // ws.send('Page.setInterceptFileChooserDialog', { enabled: true });
    // ws.send('Page.setLifecycleEventsEnabled', { enabled: true });
    // this.initiated = true;
  }

  async restartCasting() {
    await ws.send('Page.stopScreencast');
    const params = {
      quality: 70,
      format: 'jpeg',
      maxWidth: 2000,
      maxHeight: 2000,
      everyNthFrame: 1
    };
    if (this.viewport.width) {
      params.maxWidth = Math.floor(this.viewport.width * devicePixelRatio);
    }
    if (this.viewport.height) {
      params.maxHeight = Math.floor(this.viewport.height * devicePixelRatio);
    }
    await ws.send('Page.startScreencast', params);
  }
};

const connection = new Connection();
export default connection;