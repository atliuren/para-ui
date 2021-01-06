import React from "react";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import {route} from "../config/pages.config";

interface TabPanelProps {
    children?: React.ReactNode;
    index: any;
    value: any;
}

function TabPanel(props: TabPanelProps) {
    const {children, value, index, ...other} = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>{children}</Box>
            )}
        </div>
    );
}

function a11yProps(index: any) {
    return {
        id: `vertical-tab-${index}`,
        "aria-controls": `vertical-tabpanel-${index}`,
    };
}

const SiderBar = () => {
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setValue(newValue);
    };

    const renderTabs = (value: any) => {
        return value.map((item: any, index) => <Tab key={index} label={item.title} {...a11yProps(index)} />);
    };

    const renderTabPanel = (val: any) => {
        return val.map((item: any, index: number) => {
            return (
                <TabPanel key={index}
                          value={value}
                          index={index}>
                    {item.component}
                </TabPanel>
            );
        });
    };
    return (
        <div className={"sidebar-root"}>
            <Tabs
                orientation="vertical"
                variant="scrollable"
                value={value}
                onChange={handleChange}
                aria-label="Vertical tabs example"
                className={"sidebar-tabs"}
            >
                {renderTabs(route)}
            </Tabs>
            {renderTabPanel(route)}
        </div>
    );
};
export default SiderBar;
