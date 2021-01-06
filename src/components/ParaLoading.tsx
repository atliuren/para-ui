import React, {FunctionComponent} from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import clsx from "clsx";

interface ParaLoadingProps {
    className?: string;
    loading?: boolean;
    size?: string;
    showText?: boolean;
    text?: string;

    [customProp: string]: any;
}

const ParaLoading: FunctionComponent<ParaLoadingProps> = (props) => {
    // console.log("props", props);
    let {
        className,
        loading,
        size = 24,
        showText = true,
        text = "加载中..."
    } = props;
    return (
        loading ? (<div className={clsx(className, "para-loading")}><CircularProgress size={size} className={"para-loading-CircularProgress"}/>
            {showText ? <div className={"para-loading-text"}>{text}</div> : null}
        </div>) : null
    );
};

export default ParaLoading;
