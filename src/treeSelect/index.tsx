// @ts-nocheck
import React, {FunctionComponent} from "react";
import {ParaUIStyleProvider, whiteTheme} from "../providers";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Paper from "@material-ui/core/Paper";
import FormatListBulletedIcon from "@material-ui/icons/FormatListBulleted";
import DeleteIcon from "@material-ui/icons/Clear";
import Popover from "@material-ui/core/Popover";
import NoData from "../components/NoData";
import Tooltip from "@material-ui/core/Tooltip";
import CheckBoxTree from "../tree/CheckBoxTree";
import RequestTree from "../tree/requestTree";
import {ThemeProvider} from "@material-ui/core/styles";


export interface TreeSelectProps {
    type?: "tree" | "list";
    showArrow?: boolean;
    value?: string[];
    valueLabel?: string[]; // 兼容旧版本
    onChange?: Function; // 选择改变事件
    request?: any; // request请求
    size?: number; // 分页参数
    replaceFields?: any; // 返回数据替换字段key value
    parent?: string; // tree请求时需要配置parent字段
    onLoadExpandedKeys?: string[]; // tree默认展开的节点
    searchOptions?: any; // 搜索的配置
    disabled?: boolean; // 禁用
    checkStrictly?: boolean; // 严格模式
    checkInherit?: boolean; // 继承模式 与checkStrictly互斥
    noData?: string; // 暂无数据提示文字
    autoClose?: boolean;
    theme?: any;
    treeSelectRequestCallback?: Function;

    [customProp: string]: any;
}

const ParaTreeSelect: FunctionComponent<TreeSelectProps> = (props) => {
    let {
        request,
        type,
        showArrow,
        value,
        valueLabel,
        onChange,
        size,
        replaceFields,
        onLoadExpandedKeys,
        parent,
        checkStrictly,
        searchOptions = {
            placeholder: "请输入搜索关键词",
            options: [
                {key: "searchKey", value: "搜索关键词"}
            ]
        },
        disabled,
        noData = "",
        autoClose = false,
        theme = whiteTheme,
        treeSelectRequestCallback
    } = props;

    const [dataSource, setDataSource]: any = React.useState<any>(value || []);
    const [dataLabels, setDataLabels]: any = React.useState<any>(valueLabel || []);
    const [DEFAULTSIZE]: any = React.useState<any>(size || 25);
    const [flag, setFlag] = React.useState<boolean>(true);
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => setAnchorEl(null);
    let open = Boolean(anchorEl);
    const id = open ? "para-tree-select" : undefined;

    const closeListItem = (info: any) => {
        setDataSource((prev) => {
            return prev.filter(key => key !== info.key);
        });
        setDataLabels((prev) => {
            return prev.filter(item => item.title !== info.title);
        });
    };

    const renderContent = () => {
        const requestCallback = (data: any, cb: Function) => {
            if (treeSelectRequestCallback) {
                treeSelectRequestCallback(data, cb);
            } else {
                cb(data.data.list);
            }
        };
        const onCheckHandler = (checkedKeys: any, node: any) => {
            if (type === "list" || !showArrow) {
                setDataSource(checkedKeys);
                setDataLabels(node);
                if (autoClose && checkStrictly && checkedKeys.length > 0 && flag) {
                    setAnchorEl(null);
                    setFlag(false);
                }
            }
            if (type === "tree" || showArrow) {
                let checkedKeysTree = checkedKeys.checked || checkedKeys;
                let checkedNodes = node.checkedNodes;
                if (checkStrictly) {
                    checkedKeysTree = checkedKeysTree.length > 0 ? [checkedKeysTree[checkedKeysTree.length - 1]] : checkedKeysTree;
                    checkedNodes = checkedNodes.length > 0 ? [checkedNodes[checkedNodes.length - 1]] : checkedNodes;
                    if (autoClose && checkedKeysTree.length > 0) {
                        setAnchorEl(null);
                        setFlag(true);
                    }
                }
                setDataSource(checkedKeysTree);
                setDataLabels(checkedNodes);
            }
        };

        const onSelectHandler = (info: any) => {
            if (info.key && info.key === "more") {
                setFlag(false);
            } else {
                setFlag(true);
                if (autoClose && checkStrictly && info.key) {
                    setAnchorEl(null);
                    setFlag(false);
                }
            }
        };

        const onRequestTreeSelect = (_: any, e: any) => {
            if (e.node.more) {
                setFlag(false);
            } else {
                setFlag(true);
            }
        };
        if ((type === "list" || !showArrow) && request) {
            return (
                <CheckBoxTree
                    request={request}
                    size={DEFAULTSIZE}
                    replaceFields={replaceFields}
                    requestCallback={requestCallback}
                    checkStrictly={checkStrictly}
                    checkable={true}
                    search={true}
                    checkedKeys={dataSource}
                    onChange={onCheckHandler}
                    onSelect={onSelectHandler}
                    searchOptions={searchOptions}
                    {...props}
                />
            );
        }
        if ((type === "tree" || showArrow) && request) {
            return (
                <RequestTree
                    request={request}
                    size={DEFAULTSIZE}
                    parent={parent}
                    replaceFields={replaceFields}
                    onLoadExpandedKeys={onLoadExpandedKeys}
                    requestCallback={requestCallback}
                    checkStrictly={checkStrictly}
                    checkable={true}
                    showArrow={true}
                    search={true}
                    checkedKeys={dataSource}
                    onCheck={onCheckHandler}
                    onSelectCallback={onRequestTreeSelect}
                    searchOptions={searchOptions}
                    {...props}
                />
            );
        }
        return <NoData content={"加载中..."}/>;
    };

    const updateDataSource = (keys: string[], lbs: any) => {
        let tempRenderNodes: any = [];
        if (keys && keys.length > 0) {
            if (lbs && lbs.length > 0) {
                for (let i = 0; i < lbs.length; i++) {
                    tempRenderNodes.push({
                        key: keys[i],
                        title: typeof lbs[i] === "string" ? lbs[i] : lbs[i].title || ""
                    });
                }
            } else {
                for (let i = 0; i < keys.length; i++) {
                    tempRenderNodes.push({
                        key: keys[i],
                        title: typeof keys[i] === "string" ? keys[i] : keys[i].title || ""
                    });
                }
            }
        }
        return tempRenderNodes;
    };

    const renderListItem = (keys: any, values: any) => {
        const renderData = updateDataSource(keys, values);
        if (renderData.length > 0) {
            return renderData.map((item: any, index: number) => (
                <ListItem divider={index !== (renderData.length - 1)} key={index} style={{height: "100%"}}
                          disabled={disabled}>
                    <Tooltip title={item.title}>
                        <ListItemText primary={item.title} className={"para-tree-select-typography"}/>
                    </Tooltip>
                    <ListItemSecondaryAction style={{height: "100%"}}>
                        <IconButton edge="end" size={"small"} style={{marginTop: "4px"}} disabled={disabled}
                                    onClick={() => closeListItem(item)}><DeleteIcon/></IconButton>
                    </ListItemSecondaryAction>
                </ListItem>
            ));
        } else {
            return <ListItem><ListItemText primary={noData} style={{color: "#a1a1a1"}}
                                           className={"para-tree-select-nodata"}/></ListItem>;
        }
    };

    React.useEffect(() => {
        if (onChange && JSON.stringify(dataSource) !== JSON.stringify(value)) {
            onChange(dataSource, dataLabels);
        }
    }, [dataSource]);

    React.useEffect(() => {
        setDataSource(value);
        setDataLabels(valueLabel);
    }, [value, valueLabel]);

    return (
        <ThemeProvider theme={theme}>
            <ParaUIStyleProvider prefix={"para-ui-tree-select"}>
                <div className={"para-tree-select-group"}>
                    <div className={"para-tree-select-left"}>
                        <List dense={true} style={{padding: "0", height: "100%"}}>
                            {renderListItem(dataSource, dataLabels)}
                        </List>
                    </div>
                    <div className={"para-tree-select-right"}>
                        <Button onClick={handleClick} size={"small"} disabled={disabled}>
                            <FormatListBulletedIcon/>
                        </Button>
                    </div>
                </div>
                <Popover id={id} open={open} anchorEl={anchorEl} onClose={handleClose}
                         elevation={0}
                         anchorOrigin={{vertical: "center", horizontal: "right"}}
                         transformOrigin={{vertical: "center", horizontal: "left"}}
                         PaperProps={{className: "para-tree-select-popover-paper"}}
                         className={"para-tree-select-popover"}
                >
                    <Paper variant={"outlined"} elevation={0} style={{padding: "8px"}}>
                        {renderContent()}
                    </Paper>
                </Popover>
            </ParaUIStyleProvider>
        </ThemeProvider>
    );
};

export default ParaTreeSelect;
export {
    ParaTreeSelect
};
