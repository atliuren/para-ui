import React from "react";
import {storiesOf} from "@storybook/react";
import {action} from "@storybook/addon-actions";
import ParaColor from "./index";
import markdown from "./Color.md";


const App = (props) => {
    const {
        onChangeComplete
    } = props;
    const [color, setColor] = React.useState("#fff");

    const handleChangeComplete = (color, event) => {
        setColor(color.hex);
        if (onChangeComplete) onChangeComplete(color, event);
    };

    return (
        <ParaColor value={color} onChangeComplete={handleChangeComplete}/>
    );
};

storiesOf("ParaColor", module)
    .add("simple",
        () => (
            <App onChangeComplete={action("onChangeComplete")}/>
        ),
        {notes: {markdown}}
    );