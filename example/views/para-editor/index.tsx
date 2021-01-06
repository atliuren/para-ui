import React, {FunctionComponent} from "react";
import {ParaEditor} from "../../../src/index";

interface OwnProps {
}

type Props = OwnProps;

const index: FunctionComponent<Props> = (props) => {
    return (
        <div>
            <p>Basic</p>
            <ParaEditor onChange={(val) => {
                console.log("val======>", val);
            }}/>
            <br/>
            <p>maxLength</p>
            <ParaEditor maxLength={3} onChange={(val) => {
                console.log("val======>", val);
            }}/>
        </div>
    );
};

export default index;
