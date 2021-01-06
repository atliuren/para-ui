import React, { FunctionComponent } from 'react';
import omit from "omit.js";
import classNames from "clsx";
import Element, {SkeletonElementProps} from "./Element";
import {getPrefixCls} from "../utils/prefix";

interface SkeletonButtonProps extends Omit<SkeletonElementProps, "size"> {
    size?: "large" | "small" | "default";
}
// static defaultProps: Partial<SkeletonButtonProps> = {
//     size: "default",
// };
const SkeletonButton: FunctionComponent<SkeletonButtonProps> = (props) => {
    const {prefixCls: customizePrefixCls, className, active} = props;
    const prefixCls = getPrefixCls("skeleton", customizePrefixCls);
    const otherProps = omit(props, ["prefixCls"]);
    const cls = classNames(prefixCls, className, `${prefixCls}-element`, {
        [`${prefixCls}-active`]: active,
    });
  return (<div className={cls}>
      <Element prefixCls={`${prefixCls}-button`} {...otherProps} />
  </div>);
};

export default SkeletonButton;
