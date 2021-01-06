import React from "react";
import {storiesOf} from "@storybook/react";
import {action} from "@storybook/addon-actions";
import ParaAreaLinkage from "./index";
import markdown from "./Editor.md";

storiesOf("ParaAreaLinkage", module)
    .add("simple",
        () => (
            <ParaAreaLinkage onChange={action("onChange")}/>
        ),
        {notes: {markdown}}
    );
