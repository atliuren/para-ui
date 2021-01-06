import React from "react";
import {CountStore, ThemeStore} from "../store";

export const storesContext = React.createContext({
    counterStore: new CountStore(),
    themeStore: new ThemeStore(),
});