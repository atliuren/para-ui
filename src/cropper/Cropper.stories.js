import React from "react";
import {storiesOf} from "@storybook/react";
import {action} from "@storybook/addon-actions";
import ParaCropper from "./index";
import markdown from "./Cropper.md";

storiesOf("ParaCropper", module)
    .add("simple",
        () => (
            <ParaCropper onSuccess={action("onSuccess")}/>
        ),
        {notes: {markdown}}
    );