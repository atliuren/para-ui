import React, {FunctionComponent} from "react";
import {ParaTable} from "../../../src";
import AddIcon from "@material-ui/icons/Add";

interface OwnProps {
}

type Props = OwnProps;

const index: FunctionComponent<Props> = (props) => {

    return (
        <div>
            <p>表格</p>
            <ParaTable
                actions={[
                    {
                        icon: () => <AddIcon/>,
                        tooltip: "Save User",
                        disabled: true,
                        onClick: (event, rowData) => console.log("You saved ", rowData)
                    }
                ]}
            />
        </div>
    );
};

export default index;