import React, {FunctionComponent} from "react";
import clsx from "clsx";
import DefaultEmptyImg from "./empty";
import SimpleEmptyImg from "./simple";

import {browserLanguage, getPrefixCls} from "../utils/prefix";

const defaultEmptyImg = <DefaultEmptyImg/>;
const simpleEmptyImg = <SimpleEmptyImg/>;

interface ParaEmptyProps {
    prefixCls?: string;
    className?: string;
    style?: React.CSSProperties;
    imageStyle?: React.CSSProperties;
    image?: React.ReactNode | string;
    description?: React.ReactNode;
    children?: React.ReactNode;
    direction?: "ltr" | "rtl";
}

const languageLang: any = {
    "zh-CN": "暂无数据",
    "en-GB": "no Data",
};
const Empty: FunctionComponent<ParaEmptyProps> = (props) => {
    const {
        className,
        prefixCls: customizePrefixCls,
        image = defaultEmptyImg,
        description,
        children,
        imageStyle,
        direction,
        ...restProps
    } = props;

    const prefixCls = getPrefixCls("empty", customizePrefixCls);
    const des = typeof description !== "undefined" ? description : languageLang[browserLanguage()];
    const alt = typeof des === "string" ? des : "empty";

    let imageNode: React.ReactNode;

    if (typeof image === "string") {
        imageNode = <img alt={alt} src={image}/>;
    } else {
        imageNode = image;
    }

    return (<div
            className={clsx(
                prefixCls,
                {
                    [`${prefixCls}-normal`]: image === simpleEmptyImg,
                    [`${prefixCls}-rtl`]: direction === "rtl",
                },
                className,
            )}
            {...restProps}
        >
            <div className={`${prefixCls}-image`} style={imageStyle}>
                {imageNode}
            </div>
            {des && <p className={`${prefixCls}-description`}>{des}</p>}
            {children && <div className={`${prefixCls}-footer`}>{children}</div>}
        </div>
    );
};

export {Empty, ParaEmptyProps};
