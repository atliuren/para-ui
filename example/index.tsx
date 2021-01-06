import "react-app-polyfill/ie11";
import * as React from "react";
import * as ReactDOM from "react-dom";
import {Debugger} from "para-lib";
import App from "./App";

const init = async () => {
    // await Debugger.init(["http://192.168.2.241:10000"]);
    ReactDOM.render(<App/>, document.getElementById("root"));
};
init();
