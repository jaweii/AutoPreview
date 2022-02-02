import { getActiveFilePath } from "./index.js";
import './css/index.css'


export default class AutoPreview {
  static initiated = false
  selector = ""
  currentActiveFilePath = ''

  /**
   * 
   * @param {string} selector 
   * @returns {Promise<unknown>}
   */
  constructor(selector) {
    this.selector = selector;
    const root = document.querySelector(selector)
    if (!root) {
      throw new Error(`Root element with selector ${selector} not found`);
    }
    if (AutoPreview.initiated) {
      throw new Error(`AutoPreview already initiated`);
    }

    const currentActiveFilePath = getActiveFilePath()
    this.currentActiveFilePath = currentActiveFilePath

    const url = new URL(location.href)
    const autopreview = url.searchParams.get('AutoPreview')
    if (autopreview) {
      Object.assign(document.body.style, {
        visibility: 'hidden',
        backgroundColor: 'transparent',
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
        console.log('[serverURL] received a message', e.data)
        switch (e.data.command) {
          case 'SET_ACTIVE_FILE':
            if (this.currentActiveFilePath === currentActiveFilePath) {
              return
            }
            await this.showComponent()
            break;
          case 'SET_COMPONENT_INDEX':
            const index = e.data.data
            await this.showComponent(index)
            break
          default:
            console.log('[serverURL] Ignore command', e.data.command)
            break
        }
      })
      this.showComponent().then(() => {
        document.body.style.visibility = "visible";
        window.parent.postMessage({ command: 'COMPONENT_LOADED' }, '*')
      })

      AutoPreview.initiated = true
    }
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







