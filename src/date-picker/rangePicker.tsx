import React, {useEffect, useState} from "react";
import moment, {Moment} from "moment";
import {RangePicker} from "rc-picker";
import momentGenerateConfig from "./generate/moment";
import EventIcon from '@material-ui/icons/Event';
import ClearIcon from '@material-ui/icons/Clear';
import {Props, ELocale} from './picker';

/**
 * value range value
 * placeholder 占位符
 * format 日期格式
 * direction
 * separator 分隔符
 * clearIcon清除icon
 * selectable  可选择
 * ranges 预设日期范围
 */
type RangePickerProps =
    Omit<Props, 'value' | 'format' | 'placeholder' | 'showToday' | 'picker' | 'onSelect' | 'autoFocus'>
    & {
    value?: [Moment | null | string, Moment | null | string] | null;
    placeholder?: [string, string];
    format?: string | string[];
    direction?: 'ltr' | 'rtl';
    separator?: string;
    clearIcon?: React.ReactNode;
    selectable?: [Boolean, Boolean];
    ranges?: any;
    [key: string]: any;
}

//日期 DatePicker
export const RangeDatePicker = (props: RangePickerProps) => {
    const {
        className = 'para-range-picker',
        locale = 'zh_CN',
        value = null,
        inputReadOnly = false,
        showTime = true,
        use12Hours = false,
        format = 'YYYY-MM-DD HH:mm:ss',
        allowClear = false,
        prevIcon = null,
        suffixIcon = <EventIcon/>,
        clearIcon = <ClearIcon/>,
        disabled = false,
        placeholder = ['开始时间', '结束时间'],
        onChange,
        onCalendarChange,
        onOpenChange,
        onFocus,
        onBlur,
        style = {},
        direction = 'ltr',
        separator = '~',
        ...rest
    } = props;
    //range picker value
    const [rangeValue, setRangeValue] = useState<[Moment | null, Moment | null] | null>([null, null]);
    //range value 变化 回调
    const onRangeChange = (newValue: [Moment | null, Moment | null] | null, formatStrings?: string[]) => {
        setRangeValue(newValue);
        onChange && onChange(newValue, formatStrings);
    };
    //calendarRange
    const onCalendarRangeChange = (newValue: [Moment | null, Moment | null] | null, formatStrings?: string[], range?: 'start' | 'end') => {
        setRangeValue(newValue);
        onCalendarChange && onCalendarChange(newValue, formatStrings, range);
    };
    //获得焦点
    const onFocusPicker = (evt: any) => {
        onFocus && onFocus(evt);
    }
    //失去焦点
    const onBlurPicker = (evt: any) => {
        onBlur && onBlur(evt);
    }
    //面板打开open or close
    const onOpenChangePicker = (open: boolean) => {
        onOpenChange && onOpenChange(open);
    }
    //共享属性
    const sharedProps = {
        generateConfig: momentGenerateConfig,
    };
    //自己的属性
    const ownProps = {
        ...sharedProps,
        className,
        locale: ELocale[locale],
        placeholder,
        value: rangeValue,
        showTime,
        use12Hours,
        prevIcon,
        suffixIcon,
        clearIcon,
        disabled,
        inputReadOnly,
        format,
        allowClear,
        style: {...style, display: 'inline-flex', alignItems: 'center'},
        direction,
        separator,
        onChange: onRangeChange,
        onCalendarChange: onCalendarRangeChange,
        onOpenChange: onOpenChangePicker,
        onFocus: onFocusPicker,
        onBlur: onBlurPicker,
        ...rest
    }
    useEffect(() => {
        if (Array.isArray(value)) {
            const startVal = value[0];
            const endVal = value[1];
            const defaultStartValue = startVal ? typeof startVal === 'string' ? moment(startVal) : startVal : null;
            const defaultEndValue = endVal ? typeof endVal === 'string' ? moment(endVal) : endVal : null;
            setRangeValue([defaultStartValue, defaultEndValue]);
        }
    }, [value]);

    // @ts-ignore
    return <RangePicker<Moment>{...ownProps} popupStyle={{zIndex: 9999}}/>
}


