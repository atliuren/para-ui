import React, {FunctionComponent} from "react";
import DatePicker from "../../../src/date-picker";


interface OwnProps {
}

type Props = OwnProps;

function onChange(date, dateString) {
    console.log(date, dateString);
}

const index: FunctionComponent<Props> = (props) => {

    return (
        <div className={"date-select-container"}>
            日期选择器
            <br/>
            <DatePicker/>
        </div>
    );
};

export default index;
