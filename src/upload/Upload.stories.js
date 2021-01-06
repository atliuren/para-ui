import React from "react";
import {storiesOf} from "@storybook/react";
// import {action} from "@storybook/addon-actions";
// import {Button} from "@storybook/react/demo";
import ParaUpload from "./index.tsx";
import markdown from "./Upload.md";

storiesOf("ParaUpload", module)
    .add("simple",
        () => (<ParaUpload/>),
        {notes: {markdown}}
    );