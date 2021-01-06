import React, {FunctionComponent} from "react";
import TimePicker from "rc-time-picker";
import moment from "moment";

interface TimerPickerProps {
}

const showSecond = true;
const str = showSecond ? "HH:mm:ss" : "HH:mm";

function onChange(value: any) {
    console.log(value && value.format(str));
}

const TimerPicker: FunctionComponent<TimerPickerProps> = () => {

    return (
        <div>
            pick-time
            <hr/>
            <TimePicker
                showSecond={showSecond}
                defaultValue={moment()}
                className="xxx"
                onChange={onChange}
            />
        </div>
    );
};

export default TimerPicker;
export {TimePicker};
