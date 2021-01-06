import React, {FunctionComponent} from "react";
import Paper from "@material-ui/core/Paper";
import ClearAllIcon from "@material-ui/icons/ClearAll";
import Typography from "@material-ui/core/Typography";
import clsx from "clsx";

interface NoDataProps {
    content?: string;
    icon?: React.ReactNode
}

const NoData: FunctionComponent<NoDataProps> = (props) => {
    const {content = "No Data", icon} = props;
    return (<Paper elevation={0} className={clsx("ParaNoData", "para-no-data")}>
        {icon ? icon : <ClearAllIcon/>}
        <Typography>{content}</Typography>
    </Paper>);
};

export default NoData;
export {NoData,NoDataProps};
