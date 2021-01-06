import React, {FunctionComponent} from "react";
import {ParaUIStyleProvider, whiteTheme} from "../providers";
import {ThemeProvider} from "@material-ui/core/styles";
import {Popover} from "../popover";
import {TooltipPlacement} from "../tooltip";
import {RenderFunction} from "../utils/getRenderPropValue";
import HelpIcon from "@material-ui/icons/Help";
import IconButton from "@material-ui/core/IconButton";

interface ParaHelpProps {
    theme?: any;
    children?: React.ReactElement;
    placement?: TooltipPlacement;
    title?: React.ReactNode | RenderFunction;
    content?: React.ReactNode | RenderFunction;
}

type Props = ParaHelpProps;

const ParaHelp: FunctionComponent<Props> = (props) => {
    const {
        theme = whiteTheme,
        children,
        placement,
        title,
        content
    } = props;

    const renderContent = () => {
        if (children) {
            return children;
        } else {
            return (
                <IconButton color="primary">
                    <HelpIcon/>
                </IconButton>
            );
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <ParaUIStyleProvider>
                <Popover
                    placement={placement}
                    title={title}
                    content={content}
                >
                    {renderContent()}
                </Popover>
            </ParaUIStyleProvider>
        </ThemeProvider>
    );
};

export default ParaHelp;
export {ParaHelp, ParaHelpProps};