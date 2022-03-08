import AutoPreview from "./Autopreview.js";

export default class AutoPreviewForVue extends AutoPreview {
  constructor(selector, beforeMount) {
    super(selector)
    this.framework = 'vue'
    this.version = 3
    this.beforeMount = beforeMount
  }
  /**
   * @param {Array<{ name:string, component:object}>} [components]
   * @param {number} [index]
   * @returns {void}
   */
  async showComponent(components, index = 0) {
    const Vue = await import('vue')

    let component
    if (components.length === 0) {
      component = {
        render() {
          return 'No components found'
        },
      }
    } else if (components.length === 1) {
      component = components[0].component
    } else {
      component = components[index].component
    }
    const target = document.querySelector('[data-autopreview]')
    if (!target) {
      console.warn('No target found')
      return
    }

    const currentActiveFilePath = this.currentActiveFilePath
    const filename = currentActiveFilePath.match(/[ \w-]+\./) || ['']
    const name = filename[0].replace(/\./g, '')
    if (!name) {
      return
    }

    const parent = target.parentElement
    const container = document.createElement('div')
    container.id = target.id
    container.className = target.className
    container.style = target.style
    parent.removeChild(target)
    parent.appendChild(container)

    const app = Vue.createApp({
      render(){
        return Vue.h(component)
      }
    })
    const asyncComponent = Vue.defineAsyncComponent(() => import(currentActiveFilePath))
    app.component(name, asyncComponent)
    components.forEach(item => app.component(item.name, item.component))
    if (this.beforeMount) { this.beforeMount(app) }
    app.mount(container)
    container.dataset.autopreview = ''
  }
}
