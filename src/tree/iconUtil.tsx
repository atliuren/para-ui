// @ts-nocheck
import React from "react";
import classNames from "clsx";
import FileOutlined from "@material-ui/icons/FileCopyOutlined";
import {SvgIcon, SvgIconProps} from "@material-ui/core";
import ArrowRight from "@material-ui/icons/ArrowRight";
import {ParaTreeNodeProps} from "./index";
import clsx from "clsx";

function MinusSquareOutlined(props: SvgIconProps) {
    return (
        <SvgIcon fontSize="inherit" style={{width: 14, height: 14}} {...props}>
            {/* tslint:disable-next-line: max-line-length */}
            <path
                d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z"/>
        </SvgIcon>
    );
}

function PlusSquare(props: SvgIconProps) {
    return (
        <SvgIcon fontSize="inherit" style={{width: 14, height: 14}} {...props}>
            {/* tslint:disable-next-line: max-line-length */}
            <path
                d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0 .375-.281.669t-.682.294z"/>
        </SvgIcon>
    );
}

export function LoadingSquare() {
    return (
        <svg width="24px" height="24px" viewBox="0 0 40 40" enableBackground="new 0 0 40 40">
            <path opacity="0.2" fill="#bfbfbf" d="M20.201,5.169c-8.254,0-14.946,6.692-14.946,14.946c0,8.255,6.692,14.946,14.946,14.946
      s14.946-6.691,14.946-14.946C35.146,11.861,28.455,5.169,20.201,5.169z M20.201,31.749c-6.425,0-11.634-5.208-11.634-11.634
      c0-6.425,5.209-11.634,11.634-11.634c6.425,0,11.633,5.209,11.633,11.634C31.834,26.541,26.626,31.749,20.201,31.749z"></path>
            <path fill="#1890ff" d="M26.013,10.047l1.654-2.866c-2.198-1.272-4.743-2.012-7.466-2.012h0v3.312h0
      C22.32,8.481,24.301,9.057,26.013,10.047z" transform="rotate(42.1171 20 20)">
                <animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 20 20"
                                  to="360 20 20" dur="0.5s" repeatCount="indefinite"></animateTransform>
            </path>
        </svg>
    );
}


const renderSwitcherIcon = (prefixCls: string,
                            switcherIcon: React.ReactNode | null | undefined,
                            showLine: boolean | undefined,
                            showArrow: boolean | undefined,
                            {loading, isLeaf, expanded, more, eventKey, open}: ParaTreeNodeProps,
                            onLoadExpandedKeys?: string[],
) => {
    const ref = function (element: HTMLElement) {
        if (element && element.parentElement) {
            if (onLoadExpandedKeys.length) {
                console.log("onLoadExpandedKeys====>", onLoadExpandedKeys);
                const key = element.getAttribute("data-key");
                if (onLoadExpandedKeys.indexOf(key) !== -1 && !expanded) {
                    setTimeout(function () {
                        element.parentElement?.click();
                    }, 0);
                }
            }
        }
    };

    if (more) {
        return <span className={"more-data"}>...</span>;
    }
    if (loading) {
        return <LoadingSquare className={`${prefixCls}-switcher-loading-icon`}/>;
    }
    if (isLeaf) {
        return showLine ? <FileOutlined className={`${prefixCls}-switcher-line-icon`}/> : null;
    }
    const switcherCls = `${prefixCls}-switcher-icon`;

    if (React.isValidElement(switcherIcon)) {
        return React.cloneElement(switcherIcon, {
            className: classNames(switcherIcon.props.className || "", switcherCls)
        });
    }

    if (switcherIcon) {
        return switcherIcon;
    }

    if (showLine) {
        return expanded ? (
            <MinusSquareOutlined className={`${prefixCls}-switcher-line-icon`}/>
        ) : (
            <PlusSquare className={`${prefixCls}-switcher-line-icon`}/>
        );
    }

    return <ArrowRight ref={ref} data-key={eventKey} className={clsx(switcherCls, {
        [`${prefixCls}-switcher-${eventKey}`]: true
    })}/>;
};

export default renderSwitcherIcon;

