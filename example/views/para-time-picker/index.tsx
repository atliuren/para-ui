import React, {FunctionComponent} from "react";
import {TimePicker} from "../../../src";
import AccessAlarmIcon from '@material-ui/icons/AccessAlarm'; /* timeIcon */

interface OwnProps {
}

type Props = OwnProps;

const index: FunctionComponent<Props> = (props) => {

    return (
        <div>
            <p>时间选择器</p>
            <TimePicker
                inputIcon={<AccessAlarmIcon/>}
            />
        </div>
    );
};

export default index;
