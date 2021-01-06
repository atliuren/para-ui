import React from "react";
import {storiesOf} from "@storybook/react";
// import {action} from "@storybook/addon-actions";
import RequestTree from "./requestTree";
import markdown from "./Tree.md";
import ParaTree from "./index";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";


const treeData = [
    {
        title: "0-0",
        key: "0-0",
        children: [
            {
                title: "0-0-0",
                key: "0-0-0",
                children: [
                    {title: "0-0-0-0", key: "0-0-0-0"},
                    {title: "0-0-0-1", key: "0-0-0-1"},
                    {title: "0-0-0-2", key: "0-0-0-2"}
                ]
            },
            {
                title: "0-0-1",
                key: "0-0-1",
                children: [
                    {title: "0-0-1-0", key: "0-0-1-0"},
                    {title: "0-0-1-1", key: "0-0-1-1"},
                    {title: "0-0-1-2", key: "0-0-1-2"}
                ]
            },
            {
                title: "0-0-2",
                key: "0-0-2"
            }
        ]
    },
    {
        title: "0-1",
        key: "0-1",
        children: [
            {title: "0-1-0-0", key: "0-1-0-0"},
            {title: "0-1-0-1", key: "0-1-0-1"},
            {title: "0-1-0-2", key: "0-1-0-2"}
        ]
    },
    {
        title: "0-2",
        key: "0-2"
    }
];
const App = () => {

    const [refresh] = React.useState(0);

    const requestCallback = (data, cb) => {
        cb(data.data.list);
    };

    return (
        <RequestTree
            request={{
                url: "http://192.168.2.241:9086/esc-idm/idt/org/listOrgTree",
                params: {page: 1, size: 3, id: ""},
                ctx: "esc-idm"
            }}
            size={3}
            requestCallback={requestCallback}
            checkStrictly={false}
            parent={"id"}
            replaceFields={{key: "id", title: "name"}}
            showArrow={true}
            refresh={refresh}
            onLoadExpandedKeys={["100001"]}
            defaultExpandAll={true}
            defaultExpandParent={true}
        />
    );
};
storiesOf("ParaTree", module)
    .add("simple",
        () => (
            <Paper>
                <Typography gutterBottom variant="h4">
                    Simple
                </Typography>
                <Divider variant="middle"/>
                <ParaTree
                    treeData={treeData}
                    checkable={true}
                    showArrow={true}
                    defaultExpandedKeys={["0-0"]}
                />
            </Paper>
        ),
        {notes: {markdown}}
    )
    .add("request",
        () => (
            <Paper>
                <App/>
            </Paper>
        ),
        {notes: {markdown}}
    );