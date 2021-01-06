import React, {useEffect, useState} from "react";
import moment, {Moment} from "moment";
import Picker from "rc-picker";
import momentGenerateConfig from "./generate/moment";
import zhCN from "./locale/zh_CN";
import enUS from "./locale/en_US";
import EventIcon from '@material-ui/icons/Event'; /* dateIcon */
import AccessAlarmIcon from '@material-ui/icons/AccessAlarm'; /* timeIcon */
import {RangeDatePicker} from './rangePicker';

/**
 * 接口属性
 * className 类名
 * value 时间值
 * inputReadOnly 只读
 * autoFocus 自动获得焦点
 * showTime 显示时间
 * showToday 显示今天
 * picker 类型
 * format 日期时间格式
 * use12Hours 12小时进制
 * allowClear 清除
 * prevIcon 前缀icon
 * suffixIcon 后缀icon
 * disabled 禁用
 * placeholder 占位符
 * onSelect 选中valuehuid
 * onChange 数值变化回调
 * onOpenChange 面板状态 open or close
 * onFocus 焦点
 * onBlur 失去焦点
 * locale 国际化 'zh_CN' | 'en_US'
 * style 样式
 */
export interface Props {
    className?: string;
    value?: Moment | string | null;
    inputReadOnly?: boolean;
    autoFocus?: boolean;
    showTime?: Boolean | Object;
    showToday?: boolean;
    picker?: 'time' | 'date' | 'week' | 'month' | 'year';
    format?: string;
    use12Hours?: boolean;
    allowClear?: boolean;
    prevIcon?: React.ReactNode;
    suffixIcon?: React.ReactNode;
    disabled?: boolean;
    placeholder?: string;
    onSelect?: Function;
    onChange?: Function;
    onOpenChange?: Function;
    onFocus?: Function;
    onBlur?: Function;
    disabledDate?: Function;
    locale?: 'zh_CN' | 'en_US';
    style?: any;
}

type TimeOptions = {
    showHour?: boolean;
    showMinute?: boolean;
    showSecond?: boolean;
    hourStep?: number;
    minuteStep?: number;
    secondStep?: number;
}
//timePicker 属性
type TimePickerProps = Omit<Props, 'showTime' | 'picker' | 'showToday'> & TimeOptions & {
    showNow?: boolean;
}
//datePicker 属性
type DatePickerProps = Omit<Props, 'showTime' | 'picker' | 'use12Hours'> & {
    min?: string | null;
    max?: string | null;
}
//dateTimePicker 属性
type DateTimePickerProps = Omit<Props, 'showTime' | 'picker'> & TimeOptions & {
    min?: string | null;
    max?: string | null;
}
//月份
type MonthPickerProps = Omit<Props, 'showTime' | 'showToday' | 'picker' | 'use12Hours'>;
//周
type WeekPickerProps = MonthPickerProps;
//国际化
export const ELocale = {
    'zh_CN': zhCN,
    'en_US': enUS,
}
//日期 DatePicker
const DatePicker = (props: DatePickerProps) => {
    const {
        className = 'para-date-picker',
        locale = 'zh_CN',
        value = null,
        inputReadOnly = false,
        autoFocus = false,
        showToday = true,
        format = 'YYYY-MM-DD',
        allowClear = false,
        prevIcon = null,
        suffixIcon = <EventIcon/>,
        disabled = false,
        placeholder = '',
        onSelect,
        onChange,
        onOpenChange,
        onFocus,
        onBlur,
        disabledDate,
        style = {},
        min = null,
        max = null
    } = props;
    //datepicker value
    const [val, setVal] = useState<Moment | null>(null);
    // value 选中回调
    const onSelectPicker = (newValue: Moment) => {
        onSelect && onSelect(newValue.format(format));
    };
    //value 变化 回调
    const onChangePicker = (newValue: Moment | null, formatString?: string) => {
        setVal(newValue);
        onChange && onChange(newValue, formatString);
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
    //限制日期范围
    const onDisabledDate = (date: Moment) => {
        if (min) return date < moment(min);
        if (max) return date > moment(max);
        return disabledDate ? disabledDate(date) : false;
    }
    //共享属性
    const sharedProps = {
        generateConfig: momentGenerateConfig
    };
    //调试前缀
    //自己的属性
    const ownProps = {
        ...sharedProps,
        className,
        locale: ELocale[locale],
        showToday,
        placeholder,
        value: val,
        prevIcon,
        suffixIcon,
        disabled,
        inputReadOnly,
        autoFocus,
        format,
        allowClear,
        style,
        onSelect: onSelectPicker,
        onChange: onChangePicker,
        onOpenChange: onOpenChangePicker,
        onFocus: onFocusPicker,
        onBlur: onBlurPicker,
        disabledDate: onDisabledDate
    }

    useEffect(() => {
        if (value)
            typeof value === 'string' ? setVal(moment(value)) : setVal(value);
        else
            setVal(null);
    }, [value]);

    return <Picker<Moment>{...ownProps} popupStyle={{zIndex: 9999}}/>;
}
//时间 timepicker
const TimePicker = (props: TimePickerProps) => {
    const {
        className = 'para-time-picker',
        locale = 'zh_CN',
        value = null,
        inputReadOnly = false,
        autoFocus = false,
        format = 'HH:mm:ss',
        use12Hours = false,
        allowClear = false,
        showNow = false,
        showHour = true,
        showMinute = true,
        showSecond = true,
        hourStep = 1,
        minuteStep = 1,
        secondStep = 1,
        prevIcon = null,
        suffixIcon = <AccessAlarmIcon/>,
        disabled = false,
        placeholder = '',
        onSelect,
        onChange,
        onOpenChange,
        onFocus,
        onBlur,
        style = {}
    } = props;
    //datepicker value
    const [val, setVal] = useState<Moment | null>(null);
    // value 选中回调
    const onSelectPicker = (newValue: Moment) => {
        onSelect && onSelect(newValue.format(format));
    };
    //value 变化 回调
    const onChangePicker = (newValue: Moment | null, formatString?: string) => {
        setVal(newValue);
        onChange && onChange(newValue, formatString);
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
        generateConfig: momentGenerateConfig
    };
    //自己的属性
    const ownProps = {
        ...sharedProps,
        className,
        locale: ELocale[locale],
        placeholder,
        value: val,
        prevIcon,
        suffixIcon,
        disabled,
        inputReadOnly,
        autoFocus,
        format,
        use12Hours,
        allowClear,
        showNow,
        showHour,
        showMinute,
        showSecond,
        hourStep,
        minuteStep,
        secondStep,
        style,
        onSelect: onSelectPicker,
        onChange: onChangePicker,
        onFocus: onFocusPicker,
        onblur: onBlurPicker,
        onOpenChange: onOpenChangePicker
    }

    useEffect(() => {
        // time Picker value e.g: HH:mm:ss 12:12:12
        if (value) {
            if (typeof value === 'string') {
                const date = new Date();
                const y = date.getFullYear();
                const m = date.getMonth() + 1;
                const d = date.getDate();
                const t: string = `${y}-${m}-${d} ${value}`;
                setVal(moment(t));
            } else
                setVal(value);
        } else {
            setVal(null);
        }
    }, [value]);

    return <Picker<Moment>{...ownProps} picker='time' popupStyle={{zIndex: 9999}}/>;
}

//日期时间 dateTimepicker
const DateTimePicker = (props: DateTimePickerProps) => {
    const {
        className = 'para-datetime-picker',
        locale = 'zh_CN',
        value = null,
        inputReadOnly = false,
        autoFocus = false,
        showToday = true,
        format = 'YYYY-MM-DD HH:mm:ss',
        use12Hours = false,
        allowClear = false,
        prevIcon = null,
        suffixIcon = <EventIcon/>,
        disabled = false,
        placeholder = '',
        onSelect,
        onChange,
        onOpenChange,
        onFocus,
        onBlur,
        disabledDate,
        style = {},
        min = null,
        max = null,
        ...rest
    } = props;
    //datepicker value
    const [val, setVal] = useState<Moment | null>(null);
    // value 选中回调
    const onSelectPicker = (newValue: Moment) => {
        onSelect && onSelect(newValue.format(format));
    };
    //value 变化 回调
    const onChangePicker = (newValue: Moment | null, formatString?: string) => {
        setVal(newValue);
        onChange && onChange(newValue, formatString);
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
    //限制日期范围
    const onDisabledDate = (date: Moment) => {
        if (min) return date < moment(min);
        if (max) return date > moment(max);
        return disabledDate ? disabledDate(date) : false;
    }
    //共享属性
    const sharedProps = {
        generateConfig: momentGenerateConfig
    };
    //自己的属性
    const ownProps = {
        ...sharedProps,
        className,
        locale: ELocale[locale],
        showToday,
        placeholder,
        value: val,
        suffixIcon,
        prevIcon,
        disabled,
        inputReadOnly,
        autoFocus,
        format,
        use12Hours,
        allowClear,
        style,
        showTime: true,
        ...rest,
        onSelect: onSelectPicker,
        onChange: onChangePicker,
        onFocus: onFocusPicker,
        onblur: onBlurPicker,
        onOpenChange: onOpenChangePicker,
        disabledDate: onDisabledDate
    }

    useEffect(() => {
        if (value)
            typeof value === 'string' ? setVal(moment(value)) : setVal(value);
        else
            setVal(null);
    }, [value]);

    return <Picker<Moment>{...ownProps} popupStyle={{zIndex: 9999}}/>;
}

//月份
const MonthPicker = (props: MonthPickerProps) => {
    const {
        className = 'para-month-picker',
        locale = 'zh_CN',
        value = null,
        inputReadOnly = false,
        autoFocus = false,
        allowClear = false,
        format = 'YYYY-MM',
        prevIcon = null,
        suffixIcon = <EventIcon/>,
        disabled = false,
        placeholder = '',
        onSelect,
        onChange,
        onOpenChange,
        onFocus,
        onBlur,
        style = {}
    } = props;
    //month picker value
    const [val, setVal] = useState<Moment | null>(null);
    // value 选中回调
    const onSelectPicker = (newValue: Moment) => {
        onSelect && onSelect(newValue.format(format));
    };
    //value 变化 回调
    const onChangePicker = (newValue: Moment | null, formatString?: string) => {
        setVal(newValue);
        onChange && onChange(newValue, formatString);
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
        generateConfig: momentGenerateConfig
    };
    //自己的属性
    const ownProps = {
        ...sharedProps,
        className,
        locale: ELocale[locale],
        placeholder,
        value: val,
        suffixIcon,
        prevIcon,
        disabled,
        inputReadOnly,
        autoFocus,
        format,
        allowClear,
        style,
        onSelect: onSelectPicker,
        onChange: onChangePicker,
        onFocus: onFocusPicker,
        onblur: onBlurPicker,
        onOpenChange: onOpenChangePicker
    }

    useEffect(() => {
        if (value)
            typeof value === 'string' ? setVal(moment(value)) : setVal(value);
        else
            setVal(null);
    }, [value]);

    return <Picker<Moment>{...ownProps} picker="month" popupStyle={{zIndex: 9999}}/>;
}
//周
const WeekPicker = (props: WeekPickerProps) => {
    const {
        className = 'para-week-picker',
        locale = 'zh_CN',
        value = null,
        inputReadOnly = false,
        autoFocus = false,
        allowClear = false,
        format = 'YYYY-WW周',
        prevIcon = null,
        suffixIcon = <EventIcon/>,
        disabled = false,
        placeholder = '',
        onSelect,
        onChange,
        onOpenChange,
        onFocus,
        onBlur,
        style = {}
    } = props;
    //week picker value
    const [val, setVal] = useState<Moment | null>(null);
    // value 选中回调
    const onSelectPicker = (newValue: Moment) => {
        onSelect && onSelect(newValue.format(format));
    };
    //value 变化 回调
    const onChangePicker = (newValue: Moment | null, formatString?: string) => {
        setVal(newValue);
        onChange && onChange(newValue, formatString);
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
        generateConfig: momentGenerateConfig
    };
    //自己的属性
    const ownProps = {
        ...sharedProps,
        className,
        locale: ELocale[locale],
        placeholder,
        value: val,
        suffixIcon,
        prevIcon,
        disabled,
        inputReadOnly,
        autoFocus,
        format,
        allowClear,
        style,
        onSelect: onSelectPicker,
        onChange: onChangePicker,
        onFocus: onFocusPicker,
        onblur: onBlurPicker,
        onOpenChange: onOpenChangePicker
    }

    useEffect(() => {
        if (value)
            typeof value === 'string' ? setVal(moment(value)) : setVal(value);
        else
            setVal(null);
    }, [value]);

    return <Picker<Moment>{...ownProps} picker="week" popupStyle={{zIndex: 9999}}/>;
}
export {
    DatePicker, DateTimePicker, TimePicker, RangeDatePicker,
    MonthPicker, WeekPicker, Moment, moment
};
