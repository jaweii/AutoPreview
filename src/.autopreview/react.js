import { createElement } from "react";
import ReactDOM from "react-dom";
import AutoPreview from "./Autopreview.js";

export default class AutoPreviewForReact extends AutoPreview {
  constructor(options) {
    super(options)
    this.framework = 'react'
  }
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
      .map((key) => activeModule[key]);

    let el
    if (components.length === 0) {
      el = createElement("div", {}, "No components found")
    } else if (components.length === 1) {
      el = createElement(components[0])
    } else {
      el = createElement(components[index])
    }

    return new Promise((resolve, reject) => {
      ReactDOM.render(
        el,
        document.querySelector(this.selector),
        () => resolve(undefined)
      );
    });
  }
}


