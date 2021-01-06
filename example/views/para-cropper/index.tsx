import React, {FunctionComponent} from "react";
import {ParaCropper} from "../../../src/index";

interface OwnProps {
}

type Props = OwnProps;

const index: FunctionComponent<Props> = (props) => {
    return (
        <div>
            <ParaCropper disabled={true}/>
        </div>
    );
};

export default index;
