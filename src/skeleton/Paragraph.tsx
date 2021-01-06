import React, {FunctionComponent} from "react";
import classNames from "clsx";

type widthUnit = number | string;

export interface SkeletonParagraphProps {
    prefixCls?: string;
    className?: string;
    style?: object;
    width?: widthUnit | Array<widthUnit>;
    rows?: number;
}

const Paragraph: FunctionComponent<SkeletonParagraphProps> = (props) => {
    const getWidth = (index: number) => {
        const {width, rows = 2} = props;
        if (Array.isArray(width)) {
            return width[index];
        }
        // last paragraph
        if (rows - 1 === index) {
            return width;
        }
        return undefined;
    };
    const {prefixCls, className, style, rows = 2} = props;
    let rowList: any = [];
    for (let i = 0; i < rows; i++) {
        rowList.push(<li key={i} style={{width: getWidth(i)}}/>);
    }
    return (<ul className={classNames(prefixCls, className)} style={style}>
        {
            rowList.length > 0
                ? rowList.map((item: any) => item)
                : null
        }
    </ul>);
};

export default Paragraph;
