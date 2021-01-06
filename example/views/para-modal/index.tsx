import React, {FunctionComponent} from "react";
import {ParaModal} from "../../../src/index";
import Button from "@material-ui/core/Button";

interface OwnProps {
}

type Props = OwnProps;

const index: FunctionComponent<Props> = (props) => {
    const openModal = () => {
        window.$ParaModal("chenxi", "你好",
            () => {
                console.log("onOk");
                window.$ParaModal("chenxi2", "nihao", () => true, () => true, {type: "info", width: "300px"});
            },
            () => {
                console.log("onCancel");
                return true;
            },
            {
                type: "success",
                width: "416px",
                okText: "hello",
                cancelText: "nihao"
            }
        );
    };
    return (
        <div>
            <Button onClick={openModal}>modal</Button>
            <ParaModal/>
        </div>
    );
};

export default index;
