import React, {FunctionComponent} from "react";
import {Popover} from "../../../src/index";
import Button from '@material-ui/core/Button'
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
        <div>
            <Popover content={content} title="Title">
                <Button color="primary">Hover me</Button>
            </Popover>
        </div>
    );
};

export default index;
