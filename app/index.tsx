import React from "react";
import ReactDOM from "react-dom";
import App from "./src/App";
import mixpanel from "mixpanel-browser";
import publicIp from "public-ip/browser";

mixpanel.init("4fceeaac8b239745acb694f47076cc8a");
publicIp.v4().then((ip) => {
  mixpanel.identify(ip);
  mixpanel.people.set(ip, {});
});

ReactDOM.render(<App />, document.querySelector("#app"));
