import React from "react";
import {storiesOf} from "@storybook/react";
import {action} from "@storybook/addon-actions";
import ParaEditor from "./index";
import markdown from "./Editor.md";

storiesOf("ParaEditor", module)
    .add("simple",
        () => (
            <ParaEditor onChange={action("onChange")}/>
        ),
        {notes: {markdown}}
    );