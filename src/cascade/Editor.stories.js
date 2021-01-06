import React from "react";
import {storiesOf} from "@storybook/react";
import {action} from "@storybook/addon-actions";
import ParaCascade from ".";
import markdown from "./Editor.md";

storiesOf("ParaAreaLinkage", module)
    .add("simple",
        () => (
            <ParaCascade onChange={action("onChange")}/>
        ),
        {notes: {markdown}}
    );
