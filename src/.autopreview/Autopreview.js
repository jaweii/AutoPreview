import { getActiveFilePath } from "./index.js";
import './css/index.css'

let initiated = false;

export default class AutoPreview {
  /**
   * 
   * @param {string} selector 
   * @returns {Promise<unknown>}
   */
  constructor(selector) {
    this.selector = selector;
    this.currentActiveFilePath = getActiveFilePath()
    try {
      this.buildTool = __webpack_exports__ && 'webpack'
    } catch (_) {
      this.buildTool = 'vite'
    }

    const root = document.querySelector(selector)
    if (!root) {
      throw new Error(`Root element with selector ${selector} not found`);
    }
    if (initiated) {
      throw new Error(`AutoPreview already initiated`);
    }

    const url = new URL(location.href)
    const autopreview = url.searchParams.get('AutoPreview')
    if (autopreview) {
      Object.assign(document.body.style, {
        backgroundColor: 'transparent',
        visibility: 'hidden'
      })
      Object.assign(root.style, {
        backgroundColor: 'transparent',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      })
      window.addEventListener('message', async (e) => {
        console.log('[PACKAGE] received a message', e.data)
        switch (e.data.command) {
          case 'SET_ACTIVE_FILE':
            this.currentActiveFilePath === e.data.data
            if (this.buildTool === 'webpack') {
              // 热更新更新不到AutoPreview_函数，需要手动更新，这里避免热更新和手动更新同时进行，否则会不生效
              await new Promise((resolve, reject) => setTimeout(resolve, 500))
            }
            await this._showComponent()
            break;
          case 'SET_COMPONENT_INDEX':
            const index = e.data.data
            await this._showComponent(index)
            break
          default:
            console.log('[PACKAGE] Ignore command', e.data.command)
            break
        }
      })
      this._showComponent()

      initiated = true
      window.parent.postMessage({ command: 'PACKAGE_INITIATED' }, '*')
    }
  }

  /**
 * @param {number} [index]
 * @returns {void}
 */
  async _showComponent(index = 0) {
    await this.showComponent(index)
    window.parent.postMessage({ command: 'COMPONENT_LOADED' }, '*')
    document.body.style.visibility = this.currentActiveFilePath ? 'visible' : 'hidden'
  }

  /**
  * @param {number} [index]
  * @returns {void}
  */
  async showComponent(index = 0) {
    // 
  }

  /**
   * 
   * @returns {Promise<undefined | object>}
   */
  async getModule() {
    try {
      const getter = await import('autopreview/index')
      if (!getter) return
      const activeModule = await getter.default()
      if (!activeModule) return
      return activeModule
    } catch (err) {
      console.warn(err.message)
    }
    return
  }
}







