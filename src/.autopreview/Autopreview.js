import { getActiveFilePath } from "./index.js"
import './css/index.css'

let initiated = false

export default class AutoPreview {
  /**
   * 
   * @param {string | Element} selector 
   * @returns {Promise<unknown>}
   */
  constructor(selector) {
    if (initiated) {
      throw new Error(`AutoPreview already initiated`)
    }
    this.currentActiveFilePath = getActiveFilePath()
    this.componentIndex = 0
    try {
      this.buildTool = __webpack_exports__ && 'webpack'
    } catch (_) {
      this.buildTool = 'vite'
    }

    const root = typeof selector === 'string' ? document.querySelector(selector) : selector
    if (!root) {
      window.parent.postMessage({ command: 'ERROR', data: `Root element with selector ${selector} not found` }, '*')
      throw new Error(`Root element with selector ${selector} not found`)
    }
    // 标记挂载对象，以后使用dataset来选择元素，避免挂载后id丢失
    root.dataset.autopreview = ''

    const url = new URL(location.href)
    const autopreview = url.searchParams.get('AutoPreview')
    if (autopreview) {
      window.addEventListener('message', async (e) => {
        if (e.data.type && e.data.type.indexOf('webpack') !== -1) { return }
        console.log('[PACKAGE] received a message', e.data)
        switch (e.data.command) {
          case 'SET_ACTIVE_FILE':
            this.currentActiveFilePath = e.data.data
            if (this.buildTool === 'webpack') {
              // 热更新更新不到AutoPreview_函数，需要手动更新，这里避免热更新和手动更新同时进行，否则会不生效
              await new Promise((resolve, reject) => setTimeout(resolve, 500))
            }
            await this._showComponent()
            break
          case 'SET_COMPONENT_INDEX':
            const index = e.data.data
            this.componentIndex = index
            await this._showComponent()
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

  async _showComponent() {
    const root = document.querySelector('[data-autopreview]')
    Object.assign(document.body.style, {
      backgroundColor: 'transparent',
      visibility: 'hidden',
      opacity: '0'
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
    const activeModule = await this.getModule() || {}
    const keys = Object.keys(activeModule)
      .filter((key) => {
        if (key.startsWith("AutoPreview_")) {
          return true
        }
        return false
      })
    window.parent.postMessage({ command: 'SET_COMPONENT_LIST', data: keys }, '*')
    const components = keys
      .map((key) => {
        return {
          name: key,
          component: activeModule[key]
        }
      })

    await this.showComponent(components, this.componentIndex)
    window.parent.postMessage({ command: 'COMPONENT_LOADED' }, '*')
    if (this.currentActiveFilePath) {
      document.body.style.visibility = 'visible'
      document.body.style.opacity = '1'
    }
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







