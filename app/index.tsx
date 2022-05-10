import React from "react";
import ReactDOM from "react-dom";
import App from "./src/App";
import mixpanel from "mixpanel-browser";

mixpanel.init("4fceeaac8b239745acb694f47076cc8a");
mixpanel.track("active");

ReactDOM.render(<App />, document.querySelector("#app"));
