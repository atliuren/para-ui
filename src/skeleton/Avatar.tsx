import React, {FunctionComponent} from "react";
import omit from "omit.js";
import classNames from "clsx";
import Element, {SkeletonElementProps} from "./Element";
import {getPrefixCls} from "../utils/prefix";

export interface AvatarProps extends Omit<SkeletonElementProps, "shape"> {
    shape?: "circle" | "square";
}
// static defaultProps: Partial<AvatarProps> = {
//     size: "default",
//     shape: "circle",
// };
const SkeletonAvatar: FunctionComponent<AvatarProps> = (props) => {
    const {prefixCls: customizePrefixCls, className, active} = props;
    const prefixCls = getPrefixCls("skeleton", customizePrefixCls);
    const otherProps = omit(props, ["prefixCls"]);
    const cls = classNames(prefixCls, className, `${prefixCls}-element`, {
        [`${prefixCls}-active`]: active,
    });
    return (
        <div className={cls}>
            <Element prefixCls={`${prefixCls}-avatar`} {...otherProps} />
        </div>
    );
};

export default SkeletonAvatar;
