import React, {Fragment, FunctionComponent} from "react";
import HeaderAppBar from "./components/Header";
import SiderBar from "./components/SiderBar";
import "./styles/index.less";

interface OwnProps {
}

type Props = OwnProps;

const App: FunctionComponent<Props> = (props) => {

    return (
        <Fragment>
            <HeaderAppBar/>
            <SiderBar/>
        </Fragment>
    );
};

export default App;
