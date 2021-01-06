import React, {FunctionComponent} from "react";
import Upload from "rc-upload";
import clsx from "clsx";
import Button from "@material-ui/core/Button";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import {ParaUIStyleProvider, whiteTheme} from "../providers";
import {ThemeProvider} from "@material-ui/core/styles";
import {getPrefixCls} from "../utils/prefix";

export interface UploadProps {
    name?: string;
    prefixCls?: string;
    style?: object;
    className?: string;
    disabled?: boolean;
    component?: string;
    onReady?: Function;
    action?: string | Function | Promise<string>;
    method?: string;
    directory?: boolean;
    data?: object | Function;
    headers?: object;
    accept?: string;
    multiple?: boolean;
    onStart?: Function;
    onError?: Function;
    onSuccess?: Function;
    onProgress?: Function;
    beforeUpload?: Function;
    customRequest?: Function;
    withCredentials?: boolean;
    openFileDialogOnClick?: boolean;
    transformFile?: Function;
    switchIcon?: Function;
    color?: "default" | "primary";
    variant?: "text" | "outlined" | "contained";
    size?: "small" | "medium" | "large";
    type?: "button" | "avatar" | "wall" | "drag";
    preview?: boolean

    [customProp: string]: any;
}

const ParaUpload: FunctionComponent<UploadProps> = (props) => {
    let {
        prefixCls: customizePrefixCls,
        className,
        switchIcon,
        color = "primary",
        variant = "contained",
        size = "medium"
    } = props;

    const prefixCls = getPrefixCls("upload", customizePrefixCls);

    const uploaderProps = {
        ...props,
        prefixCls
    };

    return (
        <ThemeProvider theme={whiteTheme}>
            <ParaUIStyleProvider prefix={"para-upload-provider"}>
                <div className={"paraUpload"}>
                    <Upload
                        {...uploaderProps}
                        className={clsx(className)}
                    >
                        <Button
                            variant={variant}
                            color={color}
                            size={size}
                            startIcon={
                                switchIcon
                                    ? switchIcon()
                                    : <CloudUploadIcon/>
                            }
                        >
                            Upload
                        </Button>

                    </Upload>
                </div>
            </ParaUIStyleProvider>
        </ThemeProvider>
    );
};

export default ParaUpload;
export {
    ParaUpload
};
