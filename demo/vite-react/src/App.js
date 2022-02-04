"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const logo_svg_1 = require("./logo.svg");
require("./App.css");
const TextField_1 = require("./TextField");
function App() {
    const [count, setCount] = (0, react_1.useState)(0);
    return (React.createElement("div", { className: "App" },
        React.createElement(TextField_1.default, null),
        React.createElement("header", { className: "App-header" },
            React.createElement("img", { src: logo_svg_1.default, className: "App-logo", alt: "logo" }),
            React.createElement("p", null, "Hello Vite + React!"),
            React.createElement("p", null,
                React.createElement("button", { type: "button", onClick: () => setCount((count) => count + 1) },
                    "count is: ",
                    count)),
            React.createElement("p", null,
                "Edit ",
                React.createElement("code", null, "App.tsx"),
                " and save to test HMR updates."),
            React.createElement("p", null,
                React.createElement("a", { className: "App-link", href: "https://reactjs.org", target: "_blank", rel: "noopener noreferrer" }, "Learn React"),
                " | ",
                React.createElement("a", { className: "App-link", href: "https://vitejs.dev/guide/features.html", target: "_blank", rel: "noopener noreferrer" }, "Vite Docs")))));
}
exports.default = App;
//# sourceMappingURL=App.js.map