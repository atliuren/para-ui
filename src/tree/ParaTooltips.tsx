import React, {FunctionComponent} from "react";
import Tooltip from "@material-ui/core/Tooltip";

interface OwnProps {
    title: string;
    children: React.ReactElement;

    [key: string]: any;
}

type Props = OwnProps;

const ParaTooltips: FunctionComponent<Props> = (props) => {
    const {title, children} = props;

    return (
        <Tooltip title={title} aria-label={title}>
            {children}
        </Tooltip>
    );
};

export default ParaTooltips;
