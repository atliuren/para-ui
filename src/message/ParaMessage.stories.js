import React from "react";
import {storiesOf} from "@storybook/react";
import {action} from "@storybook/addon-actions";
import ParaMultinput from "./index";
import markdown from "./Multinput.md";

storiesOf("ParaMultinput", module)
    .add("string",
        () => (
            <div>ParaMessage</div>
        ),
        {notes: {markdown}}
    );