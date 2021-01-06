import React, {FunctionComponent, useState, useContext, useRef} from "react";
import moment, {Moment} from "moment";
import Picker from "rc-picker";
import momentGenerateConfig from "./generate/moment";
import zhCN from "./locale/zh_CN";
import enUS from "./locale/en_US";
import EventIcon from '@material-ui/icons/Event'; /* dateIcon */
import AccessAlarmIcon from '@material-ui/icons/AccessAlarm'; /* timeIcon */
import TrendingFlatIcon from '@material-ui/icons/TrendingFlat';
import {DatePicker, DateTimePicker, TimePicker, RangeDatePicker, MonthPicker, WeekPicker} from './picker';

type Props = {};

const defaultValue = moment();
const defaultStartValue = moment();
const defaultEndValue = moment()
const DatePickerDemo: FunctionComponent<Props> = () => {
    const [value, setValue] = useState<Moment | null>(defaultValue);
    const [startValue, setStartValue] = useState<null | string>();
    const [endValue, setEndValue] = useState<null | string>();
    const [rangeValue, setRangeValue] = useState<[Moment | null | string, Moment | null | string] | null>([
        defaultStartValue,
        defaultEndValue,
    ]);
    const weekRef = useRef<Picker<Moment>>(null);

    const onSelect = (newValue: Moment) => {
        console.log("Select:", newValue);
    };
    const onChange = (newValue: Moment | null, formatString?: string) => {
        console.log("Change:", newValue, formatString);
        setValue(newValue);
    };
    const onStartChange = (newValue: Moment | null, formatString: string) => {
        console.log("Change:", newValue, formatString);
        setStartValue(formatString)
    };
    const onEndChange = (newValue: Moment | null, formatString: string) => {
        console.log("Change:", newValue, formatString);
        setEndValue(formatString)
    };
    const onRangeChange = (newValue: [Moment | null, Moment | null] | null, formatStrings?: string[]) => {
        console.log('range Change:', newValue, formatStrings);
        setRangeValue(newValue);
    };
    const sharedProps = {
        generateConfig: momentGenerateConfig,
        value,
        onSelect,
        onChange,
    };
    const handleDisableDate = (date: Moment) => {
        return value ? date < value : false;
    }
    const handleDisableStartDate = (date: Moment) => {
        return endValue ? date > moment(endValue) : false;
    }
    const handleDisableEndDate = (date: Moment) => {
        return startValue ? date < moment(startValue) : false;
    }

    const onChangeCallBack = (date: Moment, dateString: string) => {
        console.log('：：：：', date, dateString)
        // setStartTime(date[0] || null);
        // setEndTime(date[1]);
        // onChange && onChange(date, dateString)
    }

    return (
        <div className={"date-select-content"}>
            <h1>Value: {value ? value.format("YYYY-MM-DD HH:mm:ss") : "null"}</h1>

            <div style={{display: "flex", flexWrap: "wrap"}}>
                <div className={"date-select-li"}>
                    <h3>Basic</h3>
                    <Picker<Moment> {...sharedProps} locale={zhCN} suffixIcon={<EventIcon/>}/>
                    <TrendingFlatIcon className={"r-arrow-icon"}/>
                    <Picker<Moment> {...sharedProps} locale={zhCN} suffixIcon={<EventIcon/>}
                                    disabledDate={handleDisableDate}/>
                </div>
                <div className={"date-select-li"}>
                    <h3>Uncontrolled</h3>
                    <Picker<Moment>
                        generateConfig={momentGenerateConfig}
                        locale={zhCN}
                        allowClear
                        renderExtraFooter={() => "extra"}
                        suffixIcon={<EventIcon/>}
                    />
                </div>
                <div className={"date-select-li"}>
                    <h3>Datetime</h3>
                    <Picker<Moment>
                        {...sharedProps}
                        locale={zhCN}
                        inputReadOnly={false}
                        defaultValue={defaultValue.clone().subtract(1, "month")}
                        showTime={{
                            showSecond: false,
                            minuteStep: 5,
                            hideDisabledOptions: true,
                            defaultValue: moment("11:28:39", "HH:mm:ss"),
                        }}
                        suffixIcon={<EventIcon/>}
                    />
                </div>
                <div className={"date-select-li"}>
                    <h3>Uncontrolled Datetime</h3>
                    <Picker<Moment>
                        format="YYYY-MM-DD HH:mm:ss"
                        generateConfig={momentGenerateConfig}
                        locale={enUS}
                        showTime
                        suffixIcon={<EventIcon/>}
                    />
                </div>
                <div className={"date-select-li"}>
                    <h3>Week</h3>
                    <Picker<Moment>
                        {...sharedProps}
                        locale={zhCN}
                        allowClear
                        picker="week"
                        renderExtraFooter={() => "I am footer!!!"}
                        ref={weekRef}
                        suffixIcon={<EventIcon/>}
                    />

                    <button
                        type="button"
                        onClick={() => {
                            if (weekRef.current) {
                                weekRef.current.focus();
                            }
                        }}
                    >
                        Focus
                    </button>
                </div>
                <div className={"date-select-li"}>
                    <h3>Week</h3>
                    <Picker<Moment> generateConfig={momentGenerateConfig} locale={enUS} picker="week"
                                    suffixIcon={<EventIcon/>}/>
                </div>
                <div className={"date-select-li"}>
                    <h3>Quarter</h3>
                    <Picker<Moment> generateConfig={momentGenerateConfig} locale={enUS} picker="quarter"
                                    suffixIcon={<EventIcon/>}/>
                </div>
                <div className={"date-select-li"}>
                    <h3>Time</h3>
                    <Picker<Moment> {...sharedProps} locale={zhCN} picker='time' format={'HH:mm'}
                                    suffixIcon={<AccessAlarmIcon/>}/>
                </div>
                <div className={"date-select-li"}>
                    <h3>Time 12</h3>
                    <Picker<Moment> {...sharedProps} locale={zhCN} picker="time" use12Hours
                                    showNow
                                    showHour
                                    showMinute
                                    showSecond
                                    suffixIcon={<AccessAlarmIcon/>}/>
                </div>
                <div className={"date-select-li"}>
                    <h3>Year</h3>
                    <Picker<Moment> {...sharedProps} locale={zhCN} picker="year" suffixIcon={<EventIcon/>}/>
                </div>
                <div className={"date-select-li"}>
                    <h3>Keyboard navigation (Tab key) disabled</h3>
                    <Picker<Moment> {...sharedProps} locale={enUS} tabIndex={-1} suffixIcon={<EventIcon/>}/>
                </div>
                <div className={"date-select-li"}>
                    <h3>组件demo</h3>
                    <DatePicker locale={"zh_CN"}
                                onChange={onStartChange}
                                onSelect={onSelect}
                                value={startValue}
                                placeholder={'开始'}
                                max={endValue}
                    />
                    <DatePicker locale={"zh_CN"}
                                onChange={onEndChange}
                                onSelect={onSelect}
                                value={endValue}
                                placeholder={'结束'}
                                min={startValue}
                    />
                    <DateTimePicker locale={"zh_CN"}
                                    onChange={onStartChange}
                                    onSelect={onSelect}
                                    value={startValue}
                                    placeholder={'开始'}
                                    max={endValue}
                    />
                    <DateTimePicker locale={"zh_CN"}
                                    onChange={onEndChange}
                                    onSelect={onSelect}
                                    value={endValue}
                                    placeholder={'结束'}
                                    min={startValue}
                                    format={'YYYY-MM-DD HH:mm'}
                                    showSecond={false}
                                    minuteStep={5}
                    />
                    <TimePicker locale={"zh_CN"}
                                onChange={onChange}
                                onSelect={onSelect}
                                allowClear={true}
                                value={value}
                    />
                    <button
                        type="button"
                        onClick={() => {
                            setValue(moment('2020-12-12 12:12:12'))
                        }}
                    >
                        set valueaaaaaa
                    </button>
                    <RangeDatePicker
                        onChange={onRangeChange}
                        inputReadOnly={true}
                        style={{marginLeft: '30px'}}
                        allowEmpty={[true, true]}
                    />
                    <RangeDatePicker
                        className={''}
                        showTime={false}
                        locale="en_US"
                        placeholder={["Start", "End"]}
                        separator={'~'}
                        allowClear={true}
                        onCalendarChange={(date: Moment, dateString: string) => onChangeCallBack(date, dateString)}
                        allowEmpty={[true, true]}
                    />
                </div>
                <div className={"date-select-li"}>
                    <h3>组件demo 范围</h3>
                    <DatePicker locale={"zh_CN"}
                                onChange={onStartChange}
                                onSelect={onSelect}
                                value={startValue}
                                placeholder={'开始'}
                                max={endValue}
                    />
                    <TrendingFlatIcon className={"r-arrow-icon"}/>
                    <DatePicker locale={"zh_CN"}
                                onChange={onEndChange}
                                onSelect={onSelect}
                                value={endValue}
                                placeholder={'结束'}
                                min={startValue}
                    />
                    <DateTimePicker locale={"zh_CN"}
                                    onChange={onStartChange}
                                    onSelect={onSelect}
                                    value={startValue}
                                    placeholder={'开始'}
                                    max={endValue}
                    />
                    <TrendingFlatIcon className={"r-arrow-icon"}/>
                    <DateTimePicker locale={"zh_CN"}
                                    onChange={onEndChange}
                                    onSelect={onSelect}
                                    value={endValue}
                                    placeholder={'结束'}
                                    min={startValue}
                    />
                </div>
                <div className={"date-select-li"}>
                    <h3>Week</h3>
                    <Picker<Moment>
                        {...sharedProps}
                        locale={zhCN}
                        allowClear
                        picker="week"
                        suffixIcon={<EventIcon/>}
                    />
                </div>
                <div className={"date-select-li"}>
                    <h3>Month</h3>
                    <Picker<Moment>
                        {...sharedProps}
                        locale={zhCN}
                        allowClear
                        format={'YYYY/MM'}
                        picker="month"
                        suffixIcon={<EventIcon/>}
                    />
                </div>
                <div className={"date-select-li"}>
                    <h3>Month demo</h3>
                    <MonthPicker
                        locale={'zh_CN'}
                        allowClear
                        format={'YYYY/MM'}
                        value={moment()}
                        onChange={(newValue: any, formatString: any) => {
                            console.log(newValue, formatString)
                        }}
                    />
                </div>
                <div className={"date-select-li"}>
                    <h3>week demo</h3>
                    <WeekPicker
                        locale={'zh_CN'}
                        allowClear
                        format={'YYYY-WW周'}
                        value={moment()}
                        onChange={(newValue: Moment, formatString: any) => {
                            function getCurrentWeek() {
                                const start = newValue.weekday(0).format('YYYY-MM-DD'); //本周一
                                const end = newValue.weekday(6).format('YYYY-MM-DD'); //本周日
                                return [start, end]
                            }

                            const weekInterval = getCurrentWeek();
                            console.log(newValue, formatString, weekInterval)
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default DatePickerDemo;
export {DatePicker, DateTimePicker, TimePicker, RangeDatePicker, MonthPicker, WeekPicker, Moment, moment};
