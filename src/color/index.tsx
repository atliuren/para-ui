import React, {FunctionComponent} from "react";
import {ParaUIStyleProvider, whiteTheme} from "../providers";
import {CommonInterface} from "../interface/common.interface";
import Grid from "@material-ui/core/Grid";

import {
    AlphaPicker,
    AlphaPickerProps,
    BlockPicker,
    BlockPickerProps,
    ChromePicker,
    ChromePickerProps,
    CirclePicker,
    CirclePickerProps,
    CompactPicker,
    CompactPickerProps,
    GithubPicker,
    GithubPickerProps,
    HuePicker,
    HuePickerProps,
    MaterialPicker,
    MaterialPickerProps,
    PhotoshopPicker,
    PhotoshopPickerProps,
    SketchPicker,
    SketchPickerProps,
    SliderPicker,
    SliderPickerProps,
    SwatchesPicker,
    SwatchesPickerProps,
    TwitterPicker,
    TwitterPickerProps,
} from "react-color";
import {ThemeProvider} from "@material-ui/core/styles";

interface ParaColorProps extends CommonInterface {
    type?: "Alpha" | "Block"
        | "Chrome" | "Circle"
        | "Compact" | "Github"
        | "Hue" | "Material"
        | "Photoshop" | "Sketch"
        | "Slider" | "Swatches" | "Twitter";
    value?: string;
    onChange?: Function;
    onChangeComplete?: Function;

    [customProp: string]: any;
}

export {
    ParaColor,
    ParaColorProps,
    AlphaPickerProps,
    BlockPickerProps,
    ChromePickerProps,
    CirclePickerProps,
    CompactPickerProps,
    GithubPickerProps,
    HuePickerProps,
    MaterialPickerProps,
    PhotoshopPickerProps,
    SketchPickerProps,
    SliderPickerProps,
    SwatchesPickerProps,
    TwitterPickerProps
};

const renderPickerByType = (t: string, args?: any) => {
    switch (t) {
        case "Alpha":
            return (
                <AlphaPicker {...args} />
            );
        case "Block":
            return (
                <BlockPicker {...args} />
            );
        case "Chrome":
            return (
                <ChromePicker {...args} />
            );
        case "Circle":
            return (
                <CirclePicker {...args} />
            );
        case "Compact":
            return (
                <CompactPicker {...args} />
            );
        case "Github":
            return (
                <GithubPicker {...args} />
            );
        case "Hue":
            return (
                <HuePicker {...args} />
            );
        case "Material":
            return (
                <MaterialPicker {...args} />
            );
        case "Photoshop":
            return (
                <PhotoshopPicker {...args} />
            );
        case "Sketch":
            return (
                <SketchPicker {...args} />
            );
        case "Slider":
            return (
                <SliderPicker {...args} />
            );
        case "Swatches":
            return (
                <SwatchesPicker {...args} />
            );
        case "Twitter":
            return (
                <TwitterPicker {...args} />
            );
        default:
            return (
                <ChromePicker {...args} />
            );
    }
};

const ParaColor: FunctionComponent<ParaColorProps> = (props) => {
    let {
        type = "Chrome",
        value = "",
        onChange = () => {
        },
        onChangeComplete = () => {
        },
    } = props;

    return (
        <ThemeProvider theme={whiteTheme}>
            <ParaUIStyleProvider prefix={"para-ui-color"}>
                <div>
                    <Grid container spacing={2}>
                        {renderPickerByType(type, {
                            color: value,
                            onChange,
                            onChangeComplete,
                            ...props
                        })}
                    </Grid>
                </div>
            </ParaUIStyleProvider>
        </ThemeProvider>
    );
};

export default ParaColor;
