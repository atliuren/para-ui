import React, {Fragment, FunctionComponent} from "react";
import {ParaHelp} from "../../../src/index";
import Button from "@material-ui/core/Button";

interface OwnProps {
}

type Props = OwnProps;

const index: FunctionComponent<Props> = (props) => {
    const content = (
        <div>
            <p>Content</p>
            <p>Content</p>
        </div>
    );

    return (
        <Fragment>
            <ParaHelp title={"标题"} content={content} placement={"rightBottom"}/>
        </Fragment>
    );
};

export default index;
