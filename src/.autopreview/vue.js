import AutoPreview from "./Autopreview.js";

export default class AutoPreviewForVue extends AutoPreview {
  /**
   * @param {number} [index]
   * @returns {void}
   */
  async showComponent(index = 0) {
    if (!this.selector) return;
    const activeModule = await this.getModule() || {};
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
        return activeModule[key]
      });
    const Vue = await import('vue')
    const version = Number(Vue.version.split('.')[0])

    let component
    if (components.length === 0) {
      component = {
        render() {
          return 'No components found'
        },
      }
    } else if (components.length === 1) {
      component = components[0]
    } else {
      component = components[index]
    }
    const target = document.querySelector(this.selector)
    if (!target) {
      console.warn('No target found', this.selector)
      return
    }

    const currentActiveFilePath = this.currentActiveFilePath
    const filename = currentActiveFilePath.match(/[ \w-]+\./) || ['']
    const name = filename[0].replace(/\./g, '')
    if (!name) {
      console.log(name, currentActiveFilePath)
      return
    }

    const parent = target.parentElement
    const container = document.createElement('div')
    container.id = target.id
    container.className = target.className
    container.style = target.style
    parent.removeChild(target)
    parent.appendChild(container)
    if (version === 3) {
      const app = Vue.createApp(component)
      if (name) {
        const asyncComponent = Vue.defineAsyncComponent(() => import(currentActiveFilePath))
        app.component(name, asyncComponent)
      }
      keys.forEach(key => app.component(key, activeModule[key]))
      app.mount(container)
    } else if (version === 2) {
      // Vue 2
    } else {
      // 不支持的 Vue 的版本
    }

  }
}
