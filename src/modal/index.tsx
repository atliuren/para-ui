//@ts-nocheck
import React, {Fragment, FunctionComponent} from "react";
import ReactDOM from "react-dom";
import Button from "@material-ui/core/Button";
import Modal from "@material-ui/core/Modal";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import clsx from "clsx";
import WarningOutlined from "@material-ui/icons/ReportProblemOutlined"; // 警告
import ErrorOutlined from "@material-ui/icons/ErrorOutlined";
import SuccessOutlined from "@material-ui/icons/CheckCircleOutline";
import InfoOutlined from "@material-ui/icons/InfoOutlined";
import ErrorBoundary from "../components/ErrorBoundary";

export interface DialogTitleProps {
    children: React.ReactNode;
    onClose: () => void;
}

const DialogTitle: FunctionComponent<DialogTitleProps> = (props) => {
    const {children, onClose, ...other} = props;
    return (
        <MuiDialogTitle disableTypography className={"para-dialog-title"} {...other}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton data-key={Math.random()} aria-label="close"
                            className={"para-dialog-close-button"} onClick={onClose}>
                    <CloseIcon/>
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
};

const iconMap: any = {
    "success": <SuccessOutlined/>,
    "warning": <WarningOutlined/>,
    "error": <ErrorOutlined/>,
    "info": <InfoOutlined/>,
};

export interface ParaDialogInterface {
    title?: string;
    onOk?: Function | undefined;
    onCancel?: Function | undefined,
    content?: React.ReactNode;
    options?: OptionsInterface;
}

export interface OptionsInterface {
    icon?: React.ReactNode;
    type?: "success" | "info" | "error" | "warning";
    width?: string;
    footer?: React.ReactNode;
    okText?: string;
    cancelText?: string;
    className?: string;
}

const ParaModalBody = (props: ParaDialogInterface) => {
    const {
        title = "",
        onOk,
        onCancel,
        content,
        options
    } = props;

    const [open, setOpen] = React.useState(false);
    const [tit, setTit] = React.useState("");
    const [cont, setCont]: any = React.useState(null);
    const [opts, setOpts]: any = React.useState(null);
    //
    let prefix: string = "";
    // /* 设置前缀 */
    if (options && options.className) {
        prefix = options.className;
    }

    const handleClose = async () => {
        if (onCancel && typeof onCancel === "function") {
            const bol: boolean = await onCancel();
            if (!bol) return;
            setOpen(false);
        }
    };

    const handleConfirm = async () => {
        if (onOk && typeof onOk === "function") {
            const bol: boolean = await onOk();
            if (!bol) return;
            setOpen(false);
        }
    };
    const renderActions = () => {
        if (opts && opts.footer) {
            return (<Fragment>{opts.footer}</Fragment>);
        } else {
            return (
                <MuiDialogActions className={"para-dialog-actions-root"}>
                    <Button autoFocus onClick={handleClose}>
                        {(opts && opts.cancelText) ? opts.cancelText : "取消"}
                    </Button>
                    <Button autoFocus variant="contained" onClick={handleConfirm} color="primary">
                        {(opts && opts.okText) ? opts.okText : "保存"}
                    </Button>
                </MuiDialogActions>
            );
        }
    };

    /* 组件调用的时候 */
    React.useEffect(() => {
        if (options) setOpts(options);
        setTit(title);
        setCont(content);
        if (title) setOpen(true);
    }, [props]);

    const renderIcon = () => {
        if (opts && opts.icon) {
            return (<Fragment>{opts.icon}</Fragment>);
        } else {
            return (
                <Fragment>
                    <span className={clsx(`para-dialog-${opts.type}`)}>
                        {iconMap[opts.type]}
                    </span>
                </Fragment>
            );
        }
    };

    const renderContent = () => {
        if (opts && opts.type) {
            return (
                <Fragment>
                    <Paper elevation={0}>
                        <Grid container spacing={1}>
                            <Grid item xs={1}>
                                {renderIcon()}
                            </Grid>
                            <Grid item xs={10} className={"para-dialog-content-right"}>
                                <Typography variant="h6" className={"para-dialog-body-title"}>{tit}</Typography>
                                <Typography variant="body2" className={"para-dialog-body-content"}>{cont}</Typography>
                            </Grid>
                        </Grid>
                        <Grid spacing={1} container className={"para-dialog-align-right"}>
                            <Button autoFocus onClick={handleClose} style={{marginRight: "12px"}}>
                                {(opts && opts.cancelText) ? opts.cancelText : "取消"}
                            </Button>
                            <Button autoFocus variant="contained"
                                    onClick={handleConfirm}
                                    color="primary">
                                {(opts && opts.okText) ? opts.okText : "保存"}
                            </Button>
                        </Grid>
                    </Paper>
                </Fragment>
            );
        } else {
            return (
                <Fragment>
                    <DialogTitle onClose={handleClose}>{tit}</DialogTitle>
                    <MuiDialogContent dividers className={"para-dialog-content-root"}>{cont}</MuiDialogContent>
                    <ErrorBoundary>
                        {renderActions()}
                    </ErrorBoundary>
                </Fragment>
            );
        }
    };

    return (
        <Modal open={open}
               onClose={handleClose}
               closeAfterTransition
               BackdropComponent={Backdrop}
               BackdropProps={{timeout: 500}}
        >
            <Fade in={open}>
                <div className={clsx(
                    "MuiDialog-paperScrollPaper",
                    "para-dialog-paper",
                    prefix, {
                        ["para-dialog-body"]: (opts && opts.type)
                    }
                )}
                     style={{
                         width: (opts && opts.width) ? opts.width : "70%", top: "50%",
                         left: "50%",
                         transform: "translate(-50%, -50%)"
                     }}
                >
                    {renderContent()}
                    <ParaModalBody/>
                </div>
            </Fade>
        </Modal>
    );
};

export interface ParaDialogInterface {
    title?: string;
    onOk?: Function | undefined;
    onCancel?: Function | undefined,
    content?: React.ReactNode;
    options?: OptionsInterface;
}

export interface OptionsInterface {
    icon?: React.ReactNode;
    type?: "success" | "info" | "error" | "warning";
    maxWidth?: "lg" | "md" | "sm" | "xl" | "xs" | false; // maxWidth 最少宽度
    footer?: React.ReactNode;
}

const ParaModal: FunctionComponent = () => {
    let div: HTMLElement = document.createElement("div");
    const [modalProps, setModalProps] = React.useState<ParaDialogInterface | any>({
        title: "",
        onOk: undefined,
        onCancel: undefined,
        content: Paper,
        options: undefined,
    });

    React.useEffect(() => {
        document.body.appendChild(div);

        const destroy = () => {
            const unmountResult = ReactDOM.unmountComponentAtNode(div);
            if (unmountResult && div.parentNode) {
                div.parentNode.removeChild(div);
            }
        };
        return () => {
            destroy();
        };
    }, [modalProps]);

    if (!window.$ParaModal) {
        window.$ParaModal = (
            title: string,
            content: React.ReactNode,
            onOk: Function | undefined,
            onCancel: Function | undefined,
            options?: OptionsInterface) => {
            setModalProps({
                title,
                content,
                onOk,
                onCancel,
                options
            });
        };
    }

    return ReactDOM.createPortal(<ParaModalBody {...modalProps}/>, div);
};

export default ParaModal;
export {
    ParaModal
};


