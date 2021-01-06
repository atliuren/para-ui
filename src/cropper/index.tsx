//@ts-nocheck
import React, {FunctionComponent} from "react";
import Paper from "@material-ui/core/Paper";
import CloudUpload from "@material-ui/icons/CloudUploadOutlined";
import DeleteForeverOutlined from "@material-ui/icons/DeleteForeverOutlined";
import Dialog from "@material-ui/core/Dialog";
import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import {useTheme} from "@material-ui/core/styles";
import Cropper from "react-cropper";
import {ParaUIStyleProvider, whiteTheme} from "../providers";
import {ThemeProvider} from "@material-ui/core/styles";

interface CropperProps {
    size?: number;
    aspectRatio?: any;
    onSuccess?: Function;
    closeDialogAction?: Function;
    value?: any;
    disabled?: boolean;
    onClear?: Function;
}

export interface ResponsiveDialogProps {
    title: string;
    show: boolean;
    component: FunctionComponent;
    successAction: Function;
    closeAction: Function
}

export interface CropperComponentProps {
    src: string;
    onSuccess: Function;
    aspectRatio?: any;
}

const CropperComponent = React.forwardRef(function CropperComponent(props: CropperComponentProps, ref) {
    const {src, onSuccess, aspectRatio} = props;
    const [cropper, setCropper] = React.useState(null);
    React.useEffect(() => {
        onSuccess(cropper);
    }, [cropper]);

    return (
        <div ref={ref} className={"paraCropperContainer"}>
            <Cropper
                style={{height: 400, width: "100%"}}
                aspectRatio={aspectRatio}
                preview=".img-preview"
                guides={false}
                src={src}
                ref={cr => setCropper(cr)}
            />
        </div>
    );
});
let MAX_FILE_SIZE = 300;

const ParaCropper: FunctionComponent<CropperProps> = (props) => {
    const {
        size = 300,
        aspectRatio = 4 / 4,
        onSuccess,
        closeDialogAction,
        value = "",
        disabled = false,
        onClear
    } = props;
    const ref = React.createRef();
    const [src, setSrc]: any = React.useState("");
    const [openDialog, setOpenDialog] = React.useState(false);
    const [openMessage, setOpenMessage] = React.useState({open: false, type: "", message: ""});
    const [ctx, setCtx] = React.useState(null);
    const [cropResult, setCropResult] = React.useState(value);

    if (size) MAX_FILE_SIZE = size;

    const onChange = (e: any) => {
        e.preventDefault();
        let files;
        if (e.dataTransfer) {
            files = e.dataTransfer.files;
        } else if (e.target) {
            files = e.target.files;
        }
        if ((files[0]).size >= MAX_FILE_SIZE * 1024) {
            setOpenMessage({open: true, type: "error", message: `文件超过了规定尺寸(${MAX_FILE_SIZE}kb)`});
            return;
        }
        const reader = new FileReader();
        reader.onload = () => {
            setSrc(reader.result);
        };
        reader.readAsDataURL(files[0]);
        setOpenDialog(true);
    };
    const onClearLocal = () => {
        setCropResult(null);
        if (onClear) onClear();
    };
    return (
        <ThemeProvider theme={whiteTheme}>
            <ParaUIStyleProvider prefix={"para-ui-cropper"}>
                <div className={"paraCropper"}>
                    {
                        cropResult
                            ? <Paper variant="outlined" className="avatar-delete-upload">
                                <img src={cropResult} alt={"image"} className={"avatar-image"}/>
                                {
                                    !disabled
                                        ? (<div className="avatar-delete" onClick={onClearLocal}>
                                            <DeleteForeverOutlined className="avatar-upload-icon"/>
                                            <div className="avatar-upload-text">删除</div>
                                        </div>)
                                        : null
                                }

                            </Paper>
                            : <Paper variant="outlined" className="avatar-upload">
                                {
                                    !disabled
                                        ? (<input type="file" onChange={onChange} className="avatar-input"
                                                  value={cropResult ? "" : ""}/>)
                                        : null
                                }

                                <div>
                                    <CloudUpload className="avatar-upload-icon"/>
                                    <div className="avatar-upload-text">Upload</div>
                                </div>
                            </Paper>
                    }
                    <ResponsiveDialog
                        title={"图片裁切"}
                        show={openDialog}
                        component={
                            <CropperComponent
                                aspectRatio={aspectRatio}
                                src={src}
                                ref={ref}
                                onSuccess={cr => setCtx(cr)}
                            />
                        }
                        successAction={() => {
                            if (!ctx) return;
                            if (typeof ctx.getCroppedCanvas() === "undefined") return;
                            const value = ctx.getCroppedCanvas().toDataURL();
                            setCropResult(value);
                            setOpenDialog(false);
                            if (onSuccess) onSuccess(value);
                        }}
                        closeAction={() => {
                            setOpenDialog(false);
                            if (closeDialogAction) {
                                closeDialogAction();
                            }
                        }}
                    />
                    <FloatMessage body={openMessage} onClose={() => {
                        setOpenMessage({...openMessage, open: false});
                    }}/>
                </div>
            </ParaUIStyleProvider>
        </ThemeProvider>
    );
};

export interface FloatMessageProps {
    body: boolean;
    onClose: Function
}

const FloatMessage = (props) => {
    const {body, onClose} = props;
    const {open, type, message} = body;
    return (
        <Snackbar
            style={{width: "100%"}}
            open={open}
            autoHideDuration={3000}
            onClose={onClose}
            anchorOrigin={{vertical: "top", horizontal: "right"}}
        >
            <Alert onClose={onClose} severity={type}>
                {message}
            </Alert>
        </Snackbar>
    );
};

const ResponsiveDialog: FunctionComponent<ResponsiveDialogProps> = (props) => {
    const {show = false, component, title, successAction, closeAction} = props;
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

    return (
        <Dialog
            fullScreen={fullScreen}
            open={show}
            onClose={closeAction}
            className={"avatar-cropper-dialog"}
        >
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                {component}
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={closeAction} color="primary">关闭</Button>
                <Button onClick={successAction} color="primary" autoFocus>确定</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ParaCropper;
export {
    ParaCropper,
    FloatMessage,
    ResponsiveDialog
};
