import React from "react";
import {storiesOf} from "@storybook/react";
import {action} from "@storybook/addon-actions";
import ParaShadow from "./index";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import markdown from "./Shadow.md";

storiesOf("ParaShadow", module)
    .add("simple",
        () => (
            <Paper>
                <Grid xs={6}>
                    <ParaShadow onChange={action("onChange")}/>
                </Grid>
            </Paper>
        ),
        {notes: {markdown}}
    );