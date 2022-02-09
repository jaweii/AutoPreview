import AutoPreview from "./Autopreview.js";

export default class AutoPreviewForVue extends AutoPreview {
  constructor(selector, options = {}) {
    super(selector)
    this.framework = 'vue'
    this.version = 2
    this.options = options
  }
  /**
   * @param {Array<{ name:string, component:object}>} [components]
   * @param {number} [index]
   * @returns {void}
   */
  async showComponent(components, index = 0) {
    const { default: Vue } = await import('vue')

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
    parent.removeChild(target)
    parent.appendChild(container)

    const defaultComponent = components.find(c => c.name === 'default')
    if (defaultComponent) {
      Vue.component(name, defaultComponent.component)
    }
    components.forEach((item) => Vue.component(item.name, item.component))
    const app = new Vue(Object.assign(this.options, {
      render(h) {
        return component(h)
      }
    }))
    const rootComponent = app.$mount()
    container.appendChild(rootComponent.$el)
    container.dataset.autopreview = ''
  }
}
