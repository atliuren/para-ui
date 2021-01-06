// @ts-ignore
import React, {FunctionComponent, Fragment} from "react";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import DeleteOutlineOutlined from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import clsx from "clsx";
import Typography from "@material-ui/core/Typography";
import {ParaUIStyleProvider, whiteTheme} from "../providers";
import {ThemeProvider} from "@material-ui/core/styles";

export interface InitValue {
    value: string;
    key?: string;
}

export interface MultinputProps {
    type?: "string" | "object"; // 多值框的类型，单框还是多框
    value?: InitValue[] | string[]; // 初始值
    label?: { //标题字段
        key: string;
        value?: string
    },
    onChange?: Function;
    replaceFields?: {
        key: string;
        value: string;
    },
    className?: string;
    error?: boolean;
    disabled?: boolean;
    helpText?: string;
    width?: number;
    defaultColumns?: number;
    splitPadding?: number;
}

export {
    ParaMultinput
};

const ParaMultinput: FunctionComponent<MultinputProps> = (props) => {
    let {
        type = "string",
        value = [],
        label,
        onChange,
        replaceFields,
        className,
        error = false,
        disabled = false,
        helpText,
        width = 400,
        defaultColumns,
        splitPadding
    } = props;

    let INIT_STATE_VALUE: any = [];

    /* 动态更改默认初始值 */
    const dynamicInitValue = (value: any) => {
        if (Array.isArray(value) && value.length > 0) {
            let INIT_STATE: any = [];
            const defaultFields = {key: "key", value: "value"};
            const replaceField = {...defaultFields, ...replaceFields};
            if (type === "string") {
                if (defaultColumns) {
                    if (defaultColumns > value.length) { // 默认长度超过了默认值
                        for (let i = 0, l = value.length; i < l; i++) {
                            INIT_STATE.push({
                                id: Math.random(),
                                value: value[i][replaceField.value] || value[i]
                            });
                        }
                        //    补值
                        for (let j = 0, l = defaultColumns - value.length; j < l; j++) {
                            INIT_STATE.push({
                                id: Math.random(),
                                value: ""
                            });
                        }
                    } else {
                        for (let i = 0, l = defaultColumns; i < l; i++) {
                            INIT_STATE.push({
                                id: Math.random(),
                                value: value[i][replaceField.value] || value[i]
                            });
                        }
                    }
                } else {
                    for (let i = 0, l = value.length; i < l; i++) {
                        INIT_STATE.push({
                            id: Math.random(),
                            value: value[i][replaceField.value] || value[i]
                        });
                    }
                }
            } else {
                if (defaultColumns) {
                    if (defaultColumns > value.length) { // 默认长度超过了默认值
                        for (let i = 0, l = value.length; i < l; i++) {
                            INIT_STATE.push({
                                id: Math.random(),
                                key: value[i][replaceField.key],
                                value: value[i][replaceField.value]
                            });
                        }
                        //    补值
                        for (let j = 0, l = defaultColumns - value.length; j < l; j++) {
                            INIT_STATE.push({
                                id: Math.random(),
                                key: "",
                                value: ""
                            });
                        }
                    } else {
                        for (let i = 0, l = defaultColumns; i < l; i++) {
                            INIT_STATE.push({
                                id: Math.random(),
                                key: value[i][replaceField.key],
                                value: value[i][replaceField.value]
                            });
                        }
                    }
                } else {
                    for (let i = 0, l = value.length; i < l; i++) {
                        INIT_STATE.push({
                            id: Math.random(),
                            key: value[i][replaceField.key],
                            value: value[i][replaceField.value]
                        });
                    }
                }
            }
            return INIT_STATE;
        } else {
            if (defaultColumns) {
                let tempArr: any = [];
                for (let i = 0; i < defaultColumns; i++) {
                    if (type === "string") {
                        tempArr.push({id: Math.random(), value: ""});
                    } else {
                        tempArr.push({id: Math.random(), key: "", value: ""});
                    }
                }
                return tempArr;
            } else {
                return [];
            }
        }
    };

    /*  是否给上初始值  */
    if (value && value?.length) {
        INIT_STATE_VALUE = [...dynamicInitValue(value)];
    }

    /* 多值框的值 */
    const [itemValue, setItemValue]: any = React.useState(INIT_STATE_VALUE);
    const [errorKey, setErrorKey]: any = React.useState(null);

    /* 添加值的函数 */
    const addItems = () => {
        if (type === "string") {
            setItemValue([...itemValue, {id: Math.random(), value: ""}]);
        } else {
            setItemValue([...itemValue, {id: Math.random(), key: "", value: ""}]);
        }
    };

    /*  清除函数  */
    const onClearItem = (info: { id: string }) => {
        setItemValue((origin: any) => {
            let newArr = origin.filter((it: any) => it.id !== info.id);
            return [...newArr];
        });
    };

    /* 校验函数 */
    const validateForm = () => {
        let bool = true;
        if (type === "object") {
            // 多框的时候
            itemValue.forEach((data: any) => {
                if (data.key === "") bool = false;
            });
        } else {
            // 单框的时候
            itemValue.forEach((data: any) => {
                if (data.value === "") bool = false;
            });
        }
        return bool;
    };

    /*  赋值  */
    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement>,
        id: number,
        type: string,
        position: string = "value"
    ) => {
        event.persist();
        setItemValue((origin: any) => {
            origin.map((val: any) => {
                if (val.id === id) {
                    val[position] = event.target.value;
                }
            });
            let nextState = [...origin];
            setOnChangeValue(nextState, id, type);
            return nextState;
        });
    };
    /**
     * 陈夕 2020/7/10 下午2:39
     * desc:
     * @params
     **/
    const setOnChangeValue = (origin: any, id: any, type: string) => {
        /*  返回值处理  */
        if (validateForm()) { // 通过校验
            setErrorKey(null);
            if (onChange) {
                if (type === "object") {
                    let backArr: any[] = [];
                    const defaultFields = {key: "key", value: "value"};
                    const replaceField = {...defaultFields, ...replaceFields};
                    origin.forEach((value: any) => {
                        let obj: any = {};
                        obj[replaceField.key] = value.key;
                        obj[replaceField.value] = value.value;
                        backArr.push(obj);
                    });
                    onChange(backArr);
                } else {
                    let stringArr: any[] = [];
                    origin.forEach((value: any) => {
                        stringArr.push(value.value);
                    });
                    onChange(stringArr);
                }
            }
        } else { // 未通过校验
            setErrorKey(id);
        }
    };

    /*  render Object的函数  */
    const renderObjectItem = () => {
        if (itemValue.length > 0) {
            return itemValue.map((item: any, index: number) => {
                return (
                    <Paper key={index} component="form" className={"para-multinput-root"} elevation={0}>
                        <TextField size={"small"}
                                   variant="outlined"
                                   error={errorKey === item.id}
                                   label={label ? label.key : null}
                                   className={"para-multinput-input"}
                                   value={item.key}
                                   disabled={disabled}
                                   onChange={
                                       (event: React.ChangeEvent<HTMLInputElement>) => handleChange(
                                           event,
                                           item.id,
                                           "object",
                                           "key"
                                       )
                                   }
                        />
                        <span
                            className={"para-multinput-divider-split"}
                            style={splitPadding ? {padding: `0 ${splitPadding}px`} : undefined}
                        >:</span>
                        <TextField size={"small"}
                                   variant="outlined"
                                   label={label ? label.value : null}
                                   className={"para-multinput-input"}
                                   value={item.value}
                                   disabled={disabled}
                                   onChange={
                                       (event: React.ChangeEvent<HTMLInputElement>) => handleChange(
                                           event,
                                           item.id,
                                           "object",
                                           "value"
                                       )
                                   }
                        />
                        {
                            !defaultColumns
                                ? <Fragment>
                                    <Divider className={"para-multinput-divider"} orientation="vertical"/>
                                    <IconButton
                                        color="primary"
                                        className={"para-multinput-iconButton"}
                                        onClick={() => onClearItem(item)}
                                    >
                                        <DeleteOutlineOutlined/>
                                    </IconButton>
                                </Fragment>
                                : null
                        }
                    </Paper>
                );
            });
        } else {
            return null;
        }

    };

    /*  render String的函数  */
    const renderStringItem = () => {
        if (itemValue.length > 0) {
            return itemValue.map((item: any, index: number) => {
                return (
                    <Paper key={index} component="form" className={"para-multinput-root"} elevation={0}>
                        <TextField size={"small"}
                                   variant="outlined"
                                   error={errorKey === item.id}
                                   label={label ? label.key : null}
                                   value={item.value}
                                   className={"para-multinput-input"}
                                   onChange={
                                       (event: React.ChangeEvent<HTMLInputElement>) => handleChange(
                                           event,
                                           item.id,
                                           "string",
                                           "value"
                                       )
                                   }
                        />
                        {
                            !defaultColumns
                                ? <Fragment>
                                    <Divider className={"para-multinput-divider"} orientation="vertical"/>
                                    <IconButton
                                        color="primary"
                                        className={"para-multinput-iconButton"}
                                        onClick={() => onClearItem(item)}
                                    >
                                        <DeleteOutlineOutlined/>
                                    </IconButton>
                                </Fragment>
                                : null
                        }

                    </Paper>
                );
            });
        } else {
            return null;
        }

    };

    React.useEffect(() => {
        setItemValue([...dynamicInitValue(value)]);
    }, [defaultColumns]);

    return (
        <ThemeProvider theme={whiteTheme}>
            <ParaUIStyleProvider prefix={"para-ui-multinput"}>
                <div className={clsx(
                    "paraMultinput",
                    className,
                    {
                        ["para-multi-error-help"]: error
                    }
                )}
                     style={{width: `${width}px`}}
                >
                    {
                        type === "string"
                            ? renderStringItem()
                            : renderObjectItem()
                    }
                    {/* 错误占位符 */}
                    <Typography variant="body2" align={"left"} color={"error"} gutterBottom>{helpText}</Typography>
                    {/* 添加操作符 */}
                    {
                        !defaultColumns
                            ? <Button
                                variant="outlined"
                                color="primary"
                                className={"para-multinput-addIcon"}
                                onClick={addItems}
                                style={{width: `${width - 53}px`}}
                            >
                                <AddIcon/>
                            </Button>
                            : null
                    }
                </div>
            </ParaUIStyleProvider>
        </ThemeProvider>
    );
};

export default ParaMultinput;
