import { createElement, Component } from "react";
import ReactDOM from "react-dom";
import AutoPreview from "./Autopreview.js";

export default class AutoPreviewForReact extends AutoPreview {
  constructor(options) {
    super(options);
    this.framework = 'react';
  }
  /**
   * @param {Array<{ name:string, component:object}>} [components]
  * @param {number} [index]
  * @returns {void}
  */
  async _showComponent(components, index = 0) {
    return new Promise((resolve, reject) => {
      class Wrapper extends Component {
        componentDidMount() {
          resolve();
        }
        render() {
          let el;
          if (components.length === 0) {
            el = createElement("div", {}, "");
          } else if (components.length === 1) {
            el = createElement(components[0].component);
          } else {
            el = createElement(components[index].component);
          }
          return el;
        }
      }
      ReactDOM.render(
        createElement(Wrapper),
        this.createTarget()
      );
    });
  }
}


