import React from "react";
import {storiesOf} from "@storybook/react";
import markdown from "./Tree.md";
import ParaEicTable from "./index";


storiesOf("ParaEicTable", module)
    .add("simple",
        () => (
            <ParaEicTable onChange={action("onChange")}/>
        ),
        {notes: {markdown}}
    );
