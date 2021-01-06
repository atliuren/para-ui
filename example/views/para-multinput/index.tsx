import React, {Fragment, FunctionComponent} from "react";
import {ParaMultinput} from "../../../src/index";

interface OwnProps {
}

type Props = OwnProps;

const index: FunctionComponent<Props> = (props) => {
    const [state, setState] = React.useState(0);
    return (
        <Fragment>
            <ParaMultinput
                type='object'
                replaceFields={{key: "id", value: "value"}}
                label={{key: "chenxi", value: "xi"}}
                value={[]}
                disabled={false}
                error={true}
                helpText={"helpText Some feelings is error"}
                defaultColumns={state}
                width={300}
                onChange={(value) => {
                    console.log("ParaMultinput:", value);
                }}/>
            <hr/>
            <ParaMultinput
                label={{key: "chenxi"}}
                value={["我你"]}
                defaultColumns={3}
                onChange={(value) => {
                    console.log("ParaMultString:", value);
                }}/>
        </Fragment>

    );
};

export default index;
