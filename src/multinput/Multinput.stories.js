import React from "react";
import {storiesOf} from "@storybook/react";
import {action} from "@storybook/addon-actions";
import ParaMultinput from "./index";
import markdown from "./Multinput.md";

storiesOf("ParaMultinput", module)
    .add("string",
        () => (
            <ParaMultinput
                label={{key: "chenxi"}}
                value={["我爱你"]}
                defaultColumns={3}
                onChange={action("onChange")}/>
        ),
        {notes: {markdown}}
    )
    .add("object",
        () => (
            <ParaMultinput
                type='object'
                replaceFields={{key: "id", value: "value"}}
                label={{key: "chenxi", value: "xi"}}
                value={[]}
                disabled={false}
                error={true}
                helpText={"helpText Some feelings is error"}
                defaultColumns={2}
                width={300}
                onChange={action("onChange")}/>
        ),
        {notes: {markdown}}
    );