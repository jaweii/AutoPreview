import { createElement } from "react";
import ReactDOM from "react-dom";
import AutoPreview from "./Autopreview.js";

export default class AutoPreviewForReact extends AutoPreview {
  constructor(options) {
    super(options)
    this.framework = 'react'
  }
  /**
   * @param {Array<{ name:string, component:object}>} [components]
  * @param {number} [index]
  * @returns {void}
  */
  async showComponent(components, index = 0) {
    let el
    if (components.length === 0) {
      el = createElement("div", {}, "No components found")
    } else if (components.length === 1) {
      el = createElement(components[0].component)
    } else {
      el = createElement(components[index].component)
    }

    return new Promise((resolve, reject) => {
      ReactDOM.render(
        el,
        document.querySelector(['[data-autopreview]']),
        () => resolve(undefined)
      );
    });
  }
}


