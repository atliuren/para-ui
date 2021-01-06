import React, {FunctionComponent} from "react";
import ReactDOM from "react-dom";
import Modal from "@material-ui/core/Modal";
import {Empty} from "../../../src/index";

interface OwnProps {
}

type Props = OwnProps;
const QueueModal = (props?: any) => {
    // const [queueMapping, setQueueMapping] = React.useState<any>([]);
    React.useEffect(() => {

    }, []);

    return ReactDOM.createPortal(document.body, document.createElement("div"));
};

const ParaEmpty: FunctionComponent<Props> = (props) => {
    const [open, setOpen] = React.useState(false);

    const handleOpen = () => {
        setOpen(true);
        QueueModal();
    };
    return (
        <div>
            111
            <Empty/>

            <br/>

            <button onClick={handleOpen}>modal</button>

        </div>
    );
};

export default ParaEmpty;
