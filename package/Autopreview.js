import { getActiveFilePath } from "./index.js";
import './components/list/index.js';
import './css/index.css';

let initiated = false;

export default class AutoPreview {
  /**
   * 
   * @param {string | Element} selector 
   * @returns {Promise<unknown>}
   */
  constructor(selector) {
    if (initiated) { throw new Error(`AutoPreview already initiated`); }

    /** @type {string} */
    this.currentActiveFilePath = getActiveFilePath();

    /** @type {number} */
    this.componentIndex = 0;

    /** @type {'center'|'leftTop'} */
    this.align = 'leftTop';

    try {
      /** @type {'webpack'|'vite'} */
      this.buildTool = __webpack_exports__ && 'webpack';
    } catch (_) {
      this.buildTool = 'vite';
    }

    const root = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!root) {
      window.parent.postMessage({ command: 'ERROR', data: `Root element with selector ${selector} not found` }, '*');
      throw new Error(`Root element with selector ${selector} not found`);
    }

    const url = new URL(location.href);
    const autopreview = url.searchParams.get('AutoPreview');
    // open in VS Code
    if (autopreview) {
      // mark the mounted target, so that we can use dataset to select element, avoid id lost after mount
      root.dataset.autopreview = '';
      window.addEventListener('message', this.onReceiveMessage.bind(this));
      this._captureOutput();
      initiated = true;
      window.parent.postMessage({ command: 'PACKAGE_INITIATED' }, '*');
    }
  }

  /**
   * @param {MessageEvent} e
   */
  async onReceiveMessage(e) {
    if (e.data.type && e.data.type.indexOf('webpack') !== -1) { return; }
    console.log('[PACKAGE] receive message', e.data);
    const root = document.querySelector('[data-autopreview]');
    switch (e.data.command) {
      case 'SET_ACTIVE_FILE':
        this.currentActiveFilePath = e.data.data;
        root.classList.remove('autopreview-loaded');
        if (this.buildTool === 'webpack') {
          // HMR unable to update AutoPreview_ function, manually update is required, avoid HMR and manually update at the same time
          await new Promise((resolve, reject) => setTimeout(resolve, 500));
        }
        await this._showComponent();
        break;
      case 'SET_COMPONENT_INDEX':
        const index = e.data.data;
        this.componentIndex = index;
        await this._showComponent();
        break;
      case 'SET_ALIGNMENT':
        this.align = e.data.data;
        this.setAlignment(this.align);
        break;
      default:
        console.log('[PACKAGE] Ignore command', e.data.command);
        break;
    }
  }

  async _showComponent() {
    const activeModule = await this.getModule() || {};
    const keys = Object.keys(activeModule)
      .filter((key) => {
        if (key.startsWith("AutoPreview_")) {
          return true;
        }
        return false;
      });
    window.parent.postMessage({ command: 'SET_COMPONENT_LIST', data: keys }, '*');
    const components = keys
      .map((key) => {
        return {
          name: key,
          component: activeModule[key]
        };
      });
    await this.showComponent(components, this.componentIndex);
    this.setAlignment(this.align);
    // sometimes flashing, delay a bit
    setTimeout(() => {
      const root = document.querySelector('[data-autopreview]');
      root.classList.add('autopreview-loaded');
      window.parent.postMessage({ command: 'COMPONENT_MOUNTED' }, '*');
    }, 100);
  }

  /**
   * @param {Array<{ name:string, component:object}>} [components]
  * @param {number} [index]
  * @returns {void}
  */
  async showComponent(components, index = 0) {
    // 
  }

  /**
   * The previewed component will be mounted here
   */
  newTarget() {
    let target = document.querySelector('[data-autopreview]');
    if (!target) {
      throw new Error('No target found');
    }
    const parent = target.parentElement;
    parent.removeChild(target);
    target = document.createElement('div');
    target.dataset.autopreview = '';
    parent.appendChild(target);

    const wrapper = document.createElement('div');
    wrapper.dataset.autopreviewWrapper = '';
    target.appendChild(wrapper);

    return wrapper;
  }

  /**
   * 
   * @param {'center'|'leftTop'} align alignment
   */
  setAlignment(align) {
    const root = document.querySelector('[data-autopreview]');
    if (align === 'center') {
      root.classList.remove('align-left-top');
      root.classList.add('align-center');
    } else if (align === 'leftTop') {
      root.classList.remove('align-center');
      root.classList.add('align-left-top');
    }
  }

  /**
   * 
   * @returns {Promise<undefined | object>}
   */
  async getModule() {
    try {
      const getter = await import('autopreview/index');
      if (!getter) { return; };
      const activeModule = await getter.default();
      if (!activeModule) { return; };
      return activeModule;
    } catch (err) {
      console.warn(err.message);
    }
    return;
  }


  _captureOutput() {
    const methods = ['log', 'info', 'warn', 'error'];
    methods.forEach(name => {
      const cb = console[name];
      console[name] = (...args) => {
        cb(...args);
        try {
          window.parent.postMessage({
            command: 'CONSOLE',
            type: name,
            data: JSON.stringify(args)
          }, '*');
        } catch (_) { }
      };
    });

  }
}







