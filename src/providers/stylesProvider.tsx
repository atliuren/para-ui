import React from "react";
import {StylesProvider, createGenerateClassName} from "@material-ui/core/styles";

const ParaUIStyleProvider = (props: { children: any, prefix?: string }) => {
    const generateClassName = React.useCallback(createGenerateClassName({
        seed: "para-ui"
    }), [props.prefix]);

    return (
        <StylesProvider generateClassName={generateClassName}>
            {props.children}
        </StylesProvider>
    );
};
export default ParaUIStyleProvider;
export {
    ParaUIStyleProvider
};