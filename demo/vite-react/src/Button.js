"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutoPreview_Btn2 = exports.AutoPreview_Btn = void 0;
const react_1 = require("react");
const Button_1 = require("@mui/material/Button");
class Btn extends react_1.Component {
    render() {
        return (React.createElement(Button_1.default, { variant: "contained", onClick: () => console.log("Hello world!") }, this.props.children));
    }
}
exports.default = Btn;
function AutoPreview_Btn() {
    return React.createElement(Btn, null, "\u6309\u94AE");
}
exports.AutoPreview_Btn = AutoPreview_Btn;
function AutoPreview_Btn2() {
    return React.createElement(Btn, null, "\u4E8C");
}
exports.AutoPreview_Btn2 = AutoPreview_Btn2;
//# sourceMappingURL=Button.js.map