import React, {FunctionComponent} from "react";
import {ParaShadow} from "../../../src/index";

interface OwnProps {
}

type Props = OwnProps;

const index: FunctionComponent<Props> = (props) => {
    return (
        <div>
            <ParaShadow onChange={(val) => {
                console.log(val);
            }}/>
        </div>
    );
};

export default index;
