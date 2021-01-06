// @ts-ignore
import React, {FunctionComponent, Fragment} from "react";
import {ThemeProvider} from "@material-ui/core/styles";
import whiteTheme from "../providers/themeProvider";
import {Grid} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import {ReactSortable, Sortable, Swap} from "react-sortablejs";
import SearchBar from "../tree/SearchBar";
import {ParaUIStyleProvider} from "../providers";
import Icon from "@material-ui/core/Icon";

Sortable.mount(new Swap());
// interface mock
/*
* @Params
* value: 入参的数据 [1,2,3,4]
* valueLabel:入参的显示title
* replaceFields = {} //Object.assign {key,title} {id,name/path/nameEn}
* title = replaceFields['nameEn']
* onChange: (keys<string>[],labels<string>[])=> [1,2,3,4] ['one','two','three','four']
* onChange: (keys<string>[],node<{}>[])=> [1,2,3,4] [{key:1,title:'one'}]
* sortable boolean true
* search boolean true
* key ????????
* request={}
* checkbox 是否显示
*   每条前面有图标
*  拖动排序  上下和左右
*
*  默认值填充
*  禁止选中
*  自定义搜索参数
*  分页：可以尝试
* */
export interface TransferProps {
    value: any; // 入参的数据 一定是对象数组   如果有图标的话 在数据里面加一个 icon 的图片地址
    replaceFields?: any; // 替换字段
    onChange?: Function;  // 返回操作后的变化
    search?: boolean;  // 是否支持搜索 默认支持
    sortable?: boolean; // 是否支持排序 默认支持
    icons?: any;  // 自定义iconfont 的图标 不传就使用默认的
    checked?: boolean; // 是否显示多选框
    defaultChecked?: any[]; // 初始选中的右边的key值
    disabled?: boolean;  // 是否禁用 用于只展示数据的场景
    variant?: "contained" | "outlined";
    dragabled?: boolean;   // 是否支持拖动
    disabledKeys?: any[]; // 禁止操作的项
}

const ParaTransfer: FunctionComponent<TransferProps> = (props) => {
    const {
        value, replaceFields,
        search, onChange,
        sortable, icons,
        checked, defaultChecked,
        disabled, variant, disabledKeys,
        dragabled = false
    } = props;
    const [dataSourceLeft, setDataSourceLeft] = React.useState<any[]>([]); // 左边数据
    const [dataSourceRight, setDataSourceRight] = React.useState<any[]>([]); // 右边数据
    const [originRight, setOriginRight] = React.useState<any[]>([]); // 搜索之前右边数据
    const [originLeft, setOriginLeft] = React.useState<any[]>([]); // 搜索之前左边数据

    // 初始化方法
    const initFunction = () => {
        updateSourceData(value);
    };

    // 初始化数据 const defs = { chosen: false, filtered: false, selected: false };
    const updateSourceData = (val: any) => {
        let defaultReplaceFields = {key: "key", title: "title"};
        let replaceField = {...defaultReplaceFields, ...replaceFields};
        let outerArr: any[] = [];
        if (val && val.length > 0) {
            for (let i = 0; i < val.length; i++) {
                val[i]["key"] = val[i][replaceField.key];
                val[i]["title"] = val[i][replaceField.title];
                val[i]["disabled"] = disabledKeys && disabledKeys.indexOf(val[i][replaceField.key]) > -1;
                val[i]["show"] = true;
                val[i]["active"] = false;
                val[i]["sort"] = i;
            }
            outerArr = val;
        }

        // 如果有初始值，初始化初始值
        if (defaultChecked && defaultChecked.length > 0) {
            let rightArr: any = [];
            for (let k = 0; k < defaultChecked.length; k++) {
                let item = outerArr.filter((item) => item.key === defaultChecked[k])[0];
                rightArr.push(item);
                outerArr = outerArr.filter((item) => item.key !== defaultChecked[k]);
            }
            setDataSourceRight([...rightArr]);
        }

        setDataSourceLeft([...outerArr]);

    };

    React.useEffect(() => {
        initFunction();
    }, []);

    // 点击单条数据 key是当前点击的元素的key  flag是 true 点击左边  false 点击右边
    const handleClickItem = (key: string, flag: boolean) => {
        if (disabledKeys && disabledKeys.indexOf(key) > -1) return;
        let prevState: any = flag ? dataSourceLeft : dataSourceRight;
        for (let i = 0, len = prevState.length; i < len; i++) {
            if (prevState[i].key === key) {
                prevState[i].active = prevState[i].active ? (!prevState[i].active) : true;
            }
        }
        if (flag) {
            setDataSourceLeft([...prevState]);
        } else {
            setDataSourceRight([...prevState]);
        }
    };

    // 双击  key是当前点击的元素的key flag是 true 点击左边  false 点击右边
    const handleDoubleClickItem = (key: string, flag: boolean) => {
        if (disabledKeys && disabledKeys.indexOf(key) > -1) return;
        let prevState: any = flag ? [...dataSourceLeft] : [...dataSourceRight];
        let copyArr: any = flag ? [...dataSourceRight] : [...dataSourceLeft];
        for (let i = 0, len = prevState.length; i < len; i++) {
            if (prevState[i].key === key) {
                prevState[i].active = false;
                copyArr.push(prevState[i]);
                prevState = prevState.filter((item: any) => item.key !== key);
                break;
            }
        }
        if (flag) {
            setDataSourceLeft([...prevState]);
            setDataSourceRight([...copyArr]);
            if (!dragabled) {
                changeCallBack(copyArr);
            }
        } else {
            setDataSourceRight([...prevState]);
            setDataSourceLeft([...copyArr]);
            if (!dragabled) {
                changeCallBack(prevState);
            }
        }
    };

    // 全量操作 flag是 true 左边移到右边  false 右边移到左边
    const toHandleAll = (flag: boolean) => {
        let rightdata = deleteArrItemKey(dataSourceRight, disabledKeys || []);
        let leftdata = deleteArrItemKey(dataSourceLeft, disabledKeys || []);

        let disableObjArrLeft = getDisabledKeyObj(dataSourceLeft);
        let disableObjArrRight = getDisabledKeyObj(dataSourceRight);

        let prevState: any = flag ? leftdata : rightdata;

        if (flag) {
            prevState = prevState.concat(rightdata).concat(disableObjArrRight);
            setDataSourceLeft(disableObjArrLeft);
            setDataSourceRight([...prevState]);
            setOriginLeft(deleteArrItem(originLeft, prevState));
            setOriginRight([...originRight, ...prevState]);
            if (!dragabled) {
                changeCallBack(prevState);
            }
        } else {
            prevState = prevState.concat(leftdata).concat(disableObjArrLeft);
            setDataSourceRight(disableObjArrRight);
            setDataSourceLeft([...prevState]);
            setOriginRight(deleteArrItem(originRight, prevState));
            setOriginLeft([...originLeft, ...prevState]);
            if (!dragabled) {
                changeCallBack([]);
            }
        }
        // 拖动自带change事件，但是不支持排序的情况要手动出发

    };

    // 选中数据的移动 // flag true 左边移到右边  false 右边移到左边
    const checkedMove = (flag: boolean) => {
        let prevState: any = flag ? dataSourceLeft : dataSourceRight;
        let prevStateCopy: any = flag ? [...dataSourceLeft] : [...dataSourceRight];
        let copyArr: any = flag ? [...dataSourceRight] : [...dataSourceLeft];
        for (let i = 0, len = prevState.length; i < len; i++) {
            if (prevState[i].active) {
                prevState[i].active = false;
                copyArr.push(prevState[i]);
                prevStateCopy = prevStateCopy.filter((item: any) => item.key !== prevState[i].key);
            }
        }
        if (flag) {
            setDataSourceLeft([...prevStateCopy]);
            setDataSourceRight([...copyArr]);
            setOriginLeft(deleteArrItem(originLeft, copyArr));
            setOriginRight([...originRight, ...copyArr]);
            if (!dragabled) {
                changeCallBack(copyArr);
            }
        } else {
            setDataSourceRight([...prevStateCopy]);
            setDataSourceLeft([...copyArr]);
            setOriginRight(deleteArrItem(originRight, copyArr));
            setOriginLeft([...originLeft, ...copyArr]);
            if (!dragabled) {
                changeCallBack(prevStateCopy);
            }
        }
        // 拖动自带change事件，但是不支持拖拽排序的情况要手动出发

    };
    /**
     * jilanlan 2020-07-08 19:11
     * 去除arr1 中 与 arr2 的共同元素 两个都是对象数组
     * desc:
     * @params arr1 需要过滤的数组
     * @params arr2 对比的元素
     **/
    const deleteArrItem = (arr1: any[], arr2: any[]) => {
        if (arr1.length === 0) return [];
        if (arr2.length === 0) return arr1;
        let copyArr = [...arr1];
        for (let i = 0; i < arr1.length; i++) {
            for (let j = 0; j < arr2.length; j++) {
                if (arr1[i].key === arr2[j].key) {
                    copyArr = copyArr.filter((item: any) => item.key !== arr2[j].key);
                }
            }
        }
        return copyArr;
    };
    /**
     * jilanlan 2020-07-08 19:11
     * 去除arr1 中 与 arr2 的共同元素
     * desc:
     * @params arr1 需要过滤的数组
     * @params arr2 对比的元素
     **/
    const deleteArrItemKey = (arr1: any[], arr2: any[]) => {
        if (arr1.length === 0) return [];
        if (arr2.length === 0) return arr1;
        let copyArr = [...arr1];
        for (let i = 0; i < arr1.length; i++) {
            for (let j = 0; j < arr2.length; j++) {
                if (arr1[i].key === arr2[j]) {
                    copyArr = copyArr.filter((item: any) => item.key !== arr2[j]);
                }
            }
        }
        return copyArr;
    };

    // 获取禁止选中的对象数组

    const getDisabledKeyObj = (arr: any[]) => {
        if (!disabledKeys) return [];
        let objArr = [];
        for (let i = 0; i < disabledKeys.length; i++) {
            for (let j = 0; j < arr.length; j++) {
                if (disabledKeys[i] === arr[j].key) {
                    objArr.push(arr[j]);
                }
            }
        }
        return objArr;
    };

    const RenderListItemDOM = React.forwardRef((props: any, ref: any) => {
        return (
            <div ref={ref} className="para-transfer-click-div">
                {props.children}
            </div>
        );
    });

    /**
     * 陈夕 2020/7/9 下午1:36
     * desc: 单击双击点击事件判断
     * @param event 点击事件
     * @param item 点击的Column
     * @param flag boolean
     * () => {if (disabled || item.disabled) return;clickFn(item.key, flag);}
     **/
    let refDOM: any = [];
    let clickTimeId: any;
    const clickEventHandler = (info: any) => {
        clearTimeout(clickTimeId);
        clickTimeId = setTimeout(function () {
            handleClickItem(info.key, info.flag);
        }, 250);
    };
    const dblclickEventHandler = (info: any) => {
        clearTimeout(clickTimeId);
        handleDoubleClickItem(info.key, info.flag);
    };
    React.useEffect(() => {
        if (refDOM && refDOM.length) {
            refDOM.forEach((item: any) => {
                if (item.ref.current) {
                    item.ref.current.addEventListener("click", () => clickEventHandler(item));
                    item.ref.current.addEventListener("dblclick", () => dblclickEventHandler(item));
                }
            });
        }
        return () => {
        };
    }, [refDOM]);

    // 列表渲染
    const renderItemList = (dataSource: any, flag: boolean) => {
        return dataSource.map((item: any, index: number) => {
                const ref = React.createRef();
                let copyFlagItem = {...item, flag};
                if (refDOM.findIndex((it: any) => it.key === copyFlagItem.key) === -1) {
                    refDOM.push({key: copyFlagItem.key || copyFlagItem.id, ref, ...copyFlagItem});
                }
                return (
                    <RenderListItemDOM ref={ref} key={index}>
                        <div key={item.sort} title={item.title}
                             className={(item.active && !checked) ? `listItem active` : "listItem"}
                        >
                            {
                                checked &&
                                <Checkbox color="primary" checked={item.active}
                                          className={"transferCheck"}
                                          disabled={item.disabled || disabled}/>
                            }
                            {
                                item.icon &&
                                <img className="iconImg" src={item.icon} alt=""/>
                            }
                            {item.title}
                        </div>
                    </RenderListItemDOM>
                );
            }
        );
    };

    // 搜索方法  searchKey 搜索的值   // flag true 右边搜索  false 左边搜索
    const searchHandle = (searchKey: string, flag: boolean) => {
        let prevState: any;
        if (flag) {
            if (originRight.length > 0) {
                prevState = [...originRight];
            } else {
                prevState = [...dataSourceRight];
                setOriginRight([...dataSourceRight]);
            }
        } else {
            if (originLeft.length > 0) {
                prevState = [...originLeft];
            } else {
                prevState = [...dataSourceLeft];
                setOriginLeft([...dataSourceLeft]);
            }
        }
        for (let i = 0, len = prevState.length; i < len; i++) {
            prevState[i].show = prevState[i].title.indexOf(searchKey) > -1;
        }
        prevState = prevState.filter((item: any) => item.show);
        if (flag) {
            setDataSourceRight([...prevState]);
        } else {
            setDataSourceLeft([...prevState]);
        }
    };

    // 清空搜索框 // flag true 右边搜索  false 左边搜索
    const onClose = (flag: boolean) => {
        let prevState: any = flag ? originRight : originLeft;
        if (prevState.length === 0) return;
        let prevStateCopy: any = flag ? originRight : originLeft;
        let filterArray: any = flag ? dataSourceLeft : dataSourceRight;

        for (let i = 0, len = prevState.length; i < len; i++) {
            for (let k = 0, len = filterArray.length; k < len; k++) {
                if (prevState[i].key === filterArray[k].key) {
                    prevStateCopy = prevStateCopy.filter((item: any) => item.key !== filterArray[k].key);
                }
            }
        }

        if (flag) {
            setDataSourceRight([...prevStateCopy]);
            setOriginRight([]);
        } else {
            setDataSourceLeft([...prevStateCopy]);
            setOriginLeft([]);
        }
    };

    // 左边全选点击切换事件
    const toggleSelectAllLeft = (event: React.ChangeEvent<HTMLInputElement>) => {
        let checked: boolean = event.target.checked;
        toggleSelectAll(checked, false);
    };

    // 右边全选点击切换事件
    const toggleSelectAllRight = (event: React.ChangeEvent<HTMLInputElement>) => {
        let checked: boolean = event.target.checked;
        toggleSelectAll(checked, true);
    };

    // 全选的操作 checked true 是全选 false 不全选  flag true 右边 false 左边
    const toggleSelectAll = (checked: boolean, flag: boolean) => {
        let prevState: any = flag ? dataSourceRight : dataSourceLeft;
        for (let i = 0, len = prevState.length; i < len; i++) {
            // 禁用的状态不能选中
            if (disabledKeys && disabledKeys.indexOf(prevState[i].key) === -1) {
                prevState[i].active = checked;
            }
        }
        if (flag) {
            setDataSourceRight([...prevState]);
        } else {
            setDataSourceLeft([...prevState]);
        }
    };

    // 全选复选框的状态  flag true 右边 false 左边
    const checkedAllStatus = (flag: boolean) => {
        let value: boolean = true;
        let dataSource: any = flag ? dataSourceRight : dataSourceLeft;
        for (let i = 0, len = dataSource.length; i < len; i++) {
            if (!dataSource[i].active) {
                value = false;
            }
        }
        return value;
    };

    // 每次变化的回调
    const changeCallBack = (arr: any) => {
        let arrKey: string[] = [];
        let arrObject: any[] = [];
        let newArr: any = [...arr];
        for (let i = 0, len = newArr.length; i < len; i++) {
            arrKey.push(newArr[i].key);
            arrObject.push(newArr[i]);
        }
        return onChange && onChange(arrKey, arrObject);
    };

    // 排序 仅支持一个的上下移动  flag true 上移 false 下移
    const sortListItem = (flag: boolean) => {    // flag true 上移 false 下移
        let newArr1 = [...dataSourceRight];   // 所有已选
        let newArr1Copy = [...dataSourceRight];   // 所有已选
        let newArr2 = dataSourceRight.filter((item) => item.active); // 鼠标点中的

        for (let i = 0, len = newArr1.length; i < len; i++) {
            if (newArr1[i].key === newArr2[0].key) {
                if (flag) {
                    newArr1Copy.splice(i - 1, 0, newArr1[i]);
                    newArr1Copy.splice(i + 1, 1);

                } else {
                    newArr1Copy.splice(i, 0, newArr1[i + 1]);
                    newArr1Copy.splice(i + 2, 1);
                }
            }
        }
        setDataSourceRight([...newArr1Copy]);
        /**
         * jilanlan 2020-07-15 14:16
         * desc:排序后回调给父组件
         * @params
         **/
        if (!dragabled) {
            changeCallBack([...newArr1Copy]);
        }
    };

    // 判断下移上移按钮是否可点flag true 上移 false 下移
    const checkSortable = (flag: boolean) => {
        let newArr1 = dataSourceRight.filter((item) => item.show);   // 所有已选
        let newArr2 = dataSourceRight.filter((item) => item.active); // 鼠标点中的
        if (flag) {
            return (newArr1.length > 0 && newArr2.length === 1 && newArr2[0].key !== newArr1[0].key);
        } else {
            return (newArr1.length > 0 && newArr2.length === 1 && newArr2[0].key !== newArr1[newArr1.length - 1].key);

        }
    };

    /**
     * 陈夕 2020/7/9 上午11:30
     * desc: SearchBar 函数处理值
     * @params
     **/
    const searchBarFunction = (info: any) => {
        if (info.keywords === "") {
            onClose(false);
        } else {
            searchHandle(info.keywords, false);
        }
    };
    /**
     * 陈夕 2020/7/9 上午11:34
     * desc: 渲染拖拽的列
     * @params
     **/
    const renderColumnItem = (type: string) => {
        if (sortable && dragabled) {
            return (
                <ReactSortable className="list"
                               list={type === "left" ? dataSourceLeft : dataSourceRight}
                               setList={type === "left" ? setDataSourceLeft : setDataSourceRight}
                               animation={150}
                               group="shared-group-name"
                               onEnd={type === "left" ? null : changeCallBack(dataSourceRight)}
                >
                    {
                        renderItemList(
                            type === "left" ? dataSourceLeft : dataSourceRight,
                            type === "left")
                    }
                </ReactSortable>
            );
        } else {
            return (
                <div className="list">
                    {
                        renderItemList(
                            type === "left" ? dataSourceLeft : dataSourceRight,
                            type === "left")
                    }
                </div>
            );
        }
    };

    /**
     * 陈夕 2020/7/9 上午11:44
     * desc: 渲染底部文字footer
     * @params
     **/

    const renderFooterContext = () => {
        const rightLength = dataSourceRight.length;
        const rightActiveLength = dataSourceRight.filter((item) => item.active).length;
        return `${rightActiveLength}/${rightLength}`;
    };

    return (
        <ThemeProvider theme={whiteTheme}>
            <ParaUIStyleProvider prefix={"para-ui-transfer"}>
                <Grid container className="para-ui-transfer">
                    <Grid item className="listbox">
                        {/*搜索框*/}
                        {search && <SearchBar
                            onChange={searchBarFunction}
                            onClose={() => onClose(false)}
                            className={"para-transfer-searchbar"}/>}
                        {/* 渲染列 */}
                        {renderColumnItem("left")}
                        {/*底部全选操作条*/}
                        <Grid container className={"fixedBottom"}>
                            <Grid item>
                                <Checkbox
                                    color="primary"
                                    checked={dataSourceLeft.length !== 0 && checkedAllStatus(false)}
                                    // classes={{"root": "transferCheck"}}
                                    className={"transferCheck"}
                                    onChange={toggleSelectAllLeft}
                                    disabled={dataSourceLeft.length === 0 || disabled}
                                />
                                全选
                            </Grid>
                            <Grid item>
                                {dataSourceLeft.filter((item) => item.active).length}/{dataSourceLeft.length}
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid container className="centerBox" direction="row" alignItems="center" spacing={2}>
                        {/*全部左移*/}
                        <Grid item xs={12}>
                            <Button size="small"
                                    variant={variant || "contained"}
                                    color="primary"
                                    disabled={dataSourceRight.length === 0 || disabled}
                                    onClick={() => toHandleAll(false)}>
                                {
                                    (icons && icons.leftAll)
                                        ? <Icon className={`iconfont icon-${icons.leftAll}`}/>
                                        : "<<"
                                }
                            </Button>
                        </Grid>
                        {/*选中的左移*/}
                        <Grid item xs={12}>
                            <Button size="small"
                                    variant={variant || "contained"}
                                    color="primary"
                                    disabled={dataSourceRight.filter((item) => item.active).length === 0 || disabled}
                                    onClick={() => checkedMove(false)}>
                                {
                                    (icons && icons.left)
                                        ? <Icon className={`iconfont icon-${icons.left}`}/>
                                        : "<"
                                }
                            </Button>
                        </Grid>
                        {
                            sortable &&
                            <Fragment>
                                {/*右边单个选中的上移*/}
                                <Grid item xs={12}>
                                    <Button size="small"
                                            variant={variant || "contained"}
                                            onClick={() => sortListItem(true)}
                                            disabled={!checkSortable(true) || disabled}
                                            color="primary"
                                            className="rotateArrow">
                                        {
                                            (icons && icons.left)
                                                ? <Icon className={`iconfont icon-${icons.left}`}/>
                                                : "<"
                                        }
                                    </Button>
                                </Grid>
                                {/*右边单个选中的下移*/}
                                <Grid item xs={12}>
                                    <Button size="small"
                                            variant={variant || "contained"}
                                            onClick={() => sortListItem(false)}
                                            disabled={!checkSortable(false) || disabled}
                                            color="primary"
                                            className="rotateArrow">
                                        {
                                            (icons && icons.right)
                                                ? <Icon className={`iconfont icon-${icons.right}`}/>
                                                : ">"
                                        }
                                    </Button>
                                </Grid>
                            </Fragment>
                        }
                        {/*选中的右移*/}
                        <Grid item xs={12}>
                            <Button size="small"
                                    variant={variant || "contained"}
                                    disabled={dataSourceLeft.filter((item) => item.active).length === 0 || disabled}
                                    color="primary"
                                    onClick={() => checkedMove(true)}>
                                {
                                    (icons && icons.right)
                                        ? <Icon className={`iconfont icon-${icons.right}`}/>
                                        : ">"
                                }
                            </Button>
                        </Grid>
                        {/*全部右移*/}
                        <Grid item xs={12}>
                            <Button size="small"
                                    variant={variant || "contained"}
                                    disabled={dataSourceLeft.length === 0 || disabled}
                                    color="primary"
                                    onClick={() => toHandleAll(true)}>
                                {
                                    (icons && icons.rightAll) ?
                                        <Icon className={`iconfont icon-${icons.rightAll}`}/> :
                                        ">>"
                                }
                            </Button>
                        </Grid>
                    </Grid>

                    <Grid item className="listbox">
                        {/*搜索框*/}
                        {
                            search &&
                            <SearchBar
                                onChange={(info: any) => {
                                    if (info.keywords === "") {
                                        onClose(true);
                                    } else {
                                        searchHandle(info.keywords, true);
                                    }
                                }}
                                onClose={() => onClose(true)}
                                className={"para-transfer-searchbar"}
                            />
                        }
                        {/*列*/}
                        {renderColumnItem("right")}
                        {/*{*/}
                        {/*    (sortable && draggble) ?*/}
                        {/*        <ReactSortable className="list"*/}
                        {/*                       list={dataSourceRight}*/}
                        {/*                       setList={setDataSourceRight}*/}
                        {/*                       animation={150}*/}
                        {/*                       multiDrag*/}
                        {/*                       group="shared-group-name"*/}
                        {/*                       onEnd={changeCallBack(dataSourceRight)}*/}
                        {/*        >*/}
                        {/*            {renderItemList(dataSourceRight, false)}*/}
                        {/*        </ReactSortable> :*/}
                        {/*        <div className="list">*/}
                        {/*            {renderItemList(dataSourceRight, false)}*/}
                        {/*        </div>*/}
                        {/*}*/}
                        <Grid container className={"fixedBottom"}>
                            <Grid item>
                                <Checkbox
                                    color="primary"
                                    checked={dataSourceRight.length !== 0 && checkedAllStatus(true)}
                                    className={"transferCheck"}
                                    onChange={toggleSelectAllRight}
                                    disabled={dataSourceRight.length === 0 || disabled}
                                />
                                全选
                            </Grid>
                            <Grid item>{renderFooterContext()}</Grid>
                        </Grid>
                    </Grid>

                </Grid>
            </ParaUIStyleProvider>
        </ThemeProvider>

    );
};


export default ParaTransfer;
export {
    ParaTransfer
};
