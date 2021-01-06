// @ts-nocheck
import React, {FunctionComponent, useEffect} from "react";
import {ParaUIStyleProvider, whiteTheme} from "../providers";
import {ThemeProvider} from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import Cascader from 'rc-cascader';


export type CascaderValueType = (string | number)[];

export interface CascaderFieldNames {
    value?: string | number;
    label?: string;
    children?: string;
}

export interface CascaderOption {
    value?: string | number;
    label?: React.ReactNode;
    disabled?: boolean;
    isLeaf?: boolean;
    loading?: boolean;
    children?: CascaderOption[];

    [key: string]: any;
}

export interface CascadeProps {
    options?: CascaderOption[], // 数据源
    value?: CascaderValueType, // 选中的值
    defaultValue?: CascaderValueType, // 初始值
    placeholder?: string,
    onChange?: (value: CascaderValueType, selectOptions: CascaderOption[]) => void;
    disabled?: boolean,
    popupClassName?: string,
    popupPlacement?: string,
    prefixCls?: string, // 自定义样式名称 默认为rc-cascader
    loadData?: (selectOptions: CascaderOption[]) => void;
    changeOnSelect?: boolean; // change value on each selection
    children?: React.ReactElement;
    loadingIcon?: React.ReactNode;
    expandTrigger?: string; // click or hover
    popupVisible?: boolean;
    onPopupVisibleChange?: (popupVisible: boolean) => void;
    transitionName?: string;
    filedNames?: CascaderFieldNames;
    expandIcon?: React.ReactNode;
    variant?: string,
    size?: string,
    inputValue?: string // 展示的中文 XX/XX/XX
}

const ParaCascade: FunctionComponent<CascadeProps> = (props) => {
    let {
        inputValue,
        placeholder,
        prefixCls = 'para-cascader',
        children,
        variant = 'outlined',
        size = 'small',
        theme = whiteTheme
    } = props;

    return (
        <ThemeProvider theme={theme}>
            <ParaUIStyleProvider prefix={"para-ui-cascader"}>
                <Cascader {...props} className={prefixCls} prefixCls={prefixCls}
                          transitionName="slide-up">
                    {children || <TextField value={inputValue} variant={variant} size={size} readOnly
                                            placeholder={placeholder || '请选择'}
                                            InputProps={{endAdornment: (<ArrowDropDownIcon/>)}}/>}
                </Cascader>
            </ParaUIStyleProvider>
        </ThemeProvider>
    );
};

export default ParaCascade;
export {
    ParaCascade
};
