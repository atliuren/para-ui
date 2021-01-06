import React, {FunctionComponent} from "react";
import classNames from "clsx";

export interface SkeletonTitleProps {
    prefixCls?: string;
    className?: string;
    style?: object;
    width?: number | string;
}

const Title: FunctionComponent<SkeletonTitleProps> = ({prefixCls, className, width, style}) => {
    return (<h3 className={classNames(prefixCls, className)} style={{width, ...style}}/>);
};

export default Title;
