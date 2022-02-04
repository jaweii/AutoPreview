"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutoPreview_Textfield = void 0;
const Paper_1 = require("@mui/material/Paper");
const InputBase_1 = require("@mui/material/InputBase");
function Textfield() {
    return (React.createElement(Paper_1.default, { component: "form", sx: { p: "2px 4px", display: "flex", alignItems: "center", width: 200 } },
        React.createElement(InputBase_1.default, { sx: { ml: 1, flex: 1 }, placeholder: "\u7535\u8BDD" })));
}
exports.default = Textfield;
function AutoPreview_Textfield() {
    return (React.createElement("div", null,
        React.createElement(Textfield, null)));
}
exports.AutoPreview_Textfield = AutoPreview_Textfield;
//# sourceMappingURL=TextField.js.map