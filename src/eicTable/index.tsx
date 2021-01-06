import React, {useState, Fragment, FunctionComponent} from "react";
import clsx from "clsx";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Checkbox from "@material-ui/core/Checkbox";
import Divider from "@material-ui/core/Divider";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import Input from "@material-ui/core/Input";
import InputBase from "@material-ui/core/InputBase";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import ClearIcon from "@material-ui/icons/Clear";
import IconButton from "@material-ui/core/IconButton";
import FilterListIcon from "@material-ui/icons/FilterList";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemText from "@material-ui/core/ListItemText";
import Select from "@material-ui/core/Select";
import Tooltip from "@material-ui/core/Tooltip";
import {Get, Post} from "para-lib";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import LowPriorityIcon from "@material-ui/icons/LowPriority";
import Radio from "@material-ui/core/Radio";
import {ThemeProvider} from "@material-ui/core/styles";
import whiteTheme from "../providers/themeProvider";
import {ParaUIStyleProvider} from "../providers";
import MultiSelect from "./MuiSelect";
import {Empty} from "../empty";

import "./styles.less";
// declare let window: Window & { $msg: any };
// 入口
export interface EicTableProps {
    // 关于请求
    url?: string; //请求地址
    ctx?: string; //请求上下文
    method?: "post" | "get"; //请求方式 post || get
    bodyData?: any; // 搜索数据 对象形式传出
    size?: number; //初始数据长度
    page?: number; //初始页数
    // 静态数据
    localData?: object[]; // 本地table 静态数据
    // 数据展示
    localHeaderData?: object[]; //table头部数据 ，传入后不获取服务器的头部数据
    headerRowTitleKey: string; // 行显示的 title 对应的key值
    headerTitleKey: string;// 头部行显示的 title 对应的key值
    defaultHeaderData?: object[];//默认展示列，不可取消展示
    defaultUncheckedHeader?: string[];//自定义表头时默认不展示的表头的数据   headerRowTitleKey 对应的字符串数组
    fixedKeys?: string[]; // 默认展示行
    // 过滤
    filterArray?: Array<filterFace>; // 所有filter过滤对象；
    // 单选/ 复选设置
    check?: boolean; //是否开启复选框
    select?: boolean; // 是否开启单选
    rowKey?: string; //复选框选择的key键
    disabledCheckArray?: any[]; //禁用复选的 rowKey值
    defaultCheckValues?: any[]; // 默认选中项目，数据刷新清除
    getSelected?: Function; // 获取复选框选中的值 传出一个数组
    // 样式
    height?: number; // table 高度 设置后不自动计算高度
    sizeArray?: number[]; //初始分页页数
    className?: string; //自定义表格样式表
    hideHeader?: boolean; //是否显示头部
    hideSearchKey?: boolean; // 关闭搜索提示
    disableSort?: boolean; // 禁用排序
    disableSortFields?: any[]; // 禁用排序的某些列
    hideSearchBox?: boolean; //隐藏搜索框
    showIndex?: boolean; // 是否展示序号
    disablePagination?: boolean; // 是否禁用分页
    disableAutoSize?: boolean; //是否启用 自适应页码大小
    // 操作列配置
    operateTitle?: string; //操作列名称
    OperateComponent?: Function; // tsx compoment 传入当前行对象 rowData;
    operateKeyObject?: any; // 单独渲染某个属性 对象{ key: 渲染Function }
    // 其他
    refresh?: any; //值改变 刷新table数据
    getSearchKeys?: Function; // 返回接口里面可搜索字段的placehoder
    callBack?: Function; // 返回接口返回的数据
    requestCallBack?: Function; // 接口返回数据
    searchPlaceholder?:string // 自定义的搜搜的placeholder文字
}

// 过滤传值
interface filterFace {
    filterKey: string; //filter 发送到后台 的key
    title: string; // 筛选标题
    multiple?: boolean; // 是否多选，false 默认单选,true多选
    unIncludeFilter?: boolean; // 是否包含与 filter字段中
    data: Array<{
        name: string //名称
        value: string //值F
    }>; // 数据
}

// 数字输入法禁用字符
const invalidChars: string[] = ["-", "+", "e", ".", "E"];

const ParaEicTable: FunctionComponent<EicTableProps> = (props) => {
    const {
        className,
        ctx,
        url,
        hideHeader,
        bodyData,
        method,
        sizeArray,
        check,
        disabledCheckArray,
        rowKey,
        OperateComponent,
        operateTitle,
        headerRowTitleKey,
        headerTitleKey,
        localData,
        localHeaderData,
        refresh,
        getSearchKeys,
        operateKeyObject,
        hideSearchKey,
        filterArray,
        defaultCheckValues,
        select,
        disableSort,
        disableAutoSize,
        defaultHeaderData,
        fixedKeys,
        hideSearchBox,
        height,
        defaultUncheckedHeader,
        callBack,
        requestCallBack,
        disableSortFields,
        showIndex,
        disablePagination,
        searchPlaceholder
    } = props;
    const [listData, setListData] = useState<any>(null); //当前列表数据
    const [tableFirstinit, setTableFirstinit] = useState<boolean>(true); //列表是否初次加载
    // const [loadState, setLoadState] = useState<boolean>(false); // 列表加载状态
    const [selColList, setSelColList] = useState<any>(localHeaderData || []); //当前选择显示的列属性
    const [colAllMul, setColAllMul] = useState<any>([]); //当前选择显示的列属性
    const [selectedArr, setSelectedArr] = useState<any>([]); // 复选框选中的值
    const [checkLength, setCheckLength] = useState<number>(0); // 复选项总长度;
    const [selectedJDArr, setJelectedJDArr] = useState<any>([]); // 选中判断数组;
    const [page, setPage] = useState(props.page || 0); // 页码
    const [size, setSize] = useState(props.size || (!disableAutoSize ? null : 10)); // size
    const [tablePagSizeArr, setTablePagSizeArr] = useState<number[]>(sizeArray || [10, 20, 50, 100]);
    const [total, setTotal] = useState<number>(0); // 总页数
    const [orderField, setOrderField] = useState<string>(bodyData?.orderField || "");  // orderField 值
    const [orderType, setOrderType] = useState<string>(bodyData?.orderType || "asc");  // 顺序倒序
    const [searchKeys, setSearchKeys] = useState<string | null>(null); // 搜索提示回调
    const [tableSearchData, setTableSearchData] = useState<any>({}); // 搜索数据
    const [searchValue, setSearchValue] = useState<any>(); // 搜索框数据
    const [selectfilter, setSelectfilter] = useState<any>(null); // fitle数据
    const [unincludeKeys, setUnincludeKeys] = useState<any>(); // fitle name数据
    const [selectfilterName, setSelectfilterName] = useState<any>(); // fitle name数据
    const [filterCheckStatus, setFilterCheckStatus] = useState<boolean>(false); // fitle 选择状态,加载数据只有点击以下才触发搜索
    const [filterTipsStatus, setFilterTipsStatus] = useState<boolean>(true); // fitle 选择状态,加载数据只有点击以下才触发搜索
    const [deleteStatus, setDeleteStatus] = useState<boolean>(false); // 是否显示删除按钮
    const oldUrl = React.useRef<any>(null); // 老的url
    const inputJumpEl = React.useRef<any>(null); // 保存跳转输入框的input
    const inputJumpOldValue = React.useRef<number>(1); // 保存跳转输入框的input
    const selValueRef = React.useRef<any>(localHeaderData || []); //当前选择显示的列属性
    const setData = async () => {
        if (!localData) {
            const submitData: any = {
                url: encodeURI(`${url}?size=${size}&page=${page + 1}${method === "get" ? ("&" + handleUrl(bodyData)) : ""}`),
                ctx: ctx,
                data: {...tableSearchData, ...bodyData, size, page: page + 1}
            };
            /**
             * jilanlan 2020-07-15 10:52
             * desc: 搜索值直接使用state里面，如果保存在tableSearchData中，会和searchValue不同步，会导致页面搜索值和实际搜索结果不匹配
             * @params
             **/
            if (searchValue && searchValue.value) {
                submitData.data.searchKey = searchValue.value;
            } else {
                submitData.data.searchKey = "";
            }

            if (!disableSort) {
                submitData.data.orderField = orderField;
                submitData.data.orderType = orderType;
            }
            if (bodyData && bodyData.filter && tableSearchData.filter) {
                submitData.data.filter = {...tableSearchData.filter, ...bodyData.filter};
            }
            // setLoadState(true);
            let result: any = {};
            if (method && method.toLowerCase() === "post") {
                result = await Post(submitData);
            } else {
                result = await Get(submitData);
            }
            let {data, err} = result;
            // setLoadState(false);
            if (err) {
                return;
            } else {
                if (requestCallBack) {
                    data = requestCallBack(data) || data;
                }
                setListData(data?.data?.list || []);
                setTotal((data?.data?.total * 1) || 0);
                setSelectedArr([]);
                // 以下 只设置一次
                if (oldUrl.current !== url) {
                    oldUrl.current = url;
                    setTabeleConfig(data);
                }
                // 返回请求的列表数据
                if (callBack) {
                    callBack(data?.data?.list || [], submitData);
                }
            }
        } else {
            size && setListData(localData.slice(page * size, page * size + size));
            setTotal(localData.length || 0);
            if (selColList.length === 0) {
                setSelColList(localHeaderData);
                selValueRef.current = localHeaderData;
            }
            colAllMul.length === 0 && setColAllMul(localHeaderData);
        }
    };
    // 设计表头配置项
    const setTabeleConfig = (data: any) => {
        if (selColList && colAllMul && colAllMul.length === 0) {
            let jdObj: any = {};
            let newAllColumnList: any = [];
            if (!localHeaderData) {
                data?.data?.allColumnList?.forEach((obj: any, idx: number) => {
                    obj.order = idx + 1;
                    jdObj[obj[headerRowTitleKey]] = obj;
                    // 判断是否有不可取消key
                    if (!fixedKeys || fixedKeys.indexOf(obj[headerRowTitleKey]) === -1) {
                        newAllColumnList.push(obj);
                    }
                });
            }
            // 已选显示列
            //后台数据会过滤不可选的显示列
            let selTemp: any = localHeaderData || data?.data?.selectedColumnList?.filter((obj: any) => jdObj[obj[headerRowTitleKey]] && (obj.order = jdObj[obj[headerRowTitleKey]].order) && obj);
            // 如果有需要不默认显示的自定义表头 就过滤掉
            if (defaultUncheckedHeader) {
                selTemp = selTemp.filter((item: any) => {
                    return defaultUncheckedHeader.indexOf(item[headerRowTitleKey]) === -1;
                });
            }
            const tempList: any = selTemp ? (selTemp.concat(defaultHeaderData || [])) : [];
            setSelColList(tempList);
            selValueRef.current = tempList;
            //可选显示列
            setColAllMul(localHeaderData || newAllColumnList);
        }
        // 搜索提示
        !hideSearchKey && !searchKeys && setSearchKeys(data?.data?.searchColumnList?.map((obj: any) => obj["columnDisplayName"]).join("/"));

    };
    // 侦听filterArr 建立 fitler 对应state
    React.useEffect(() => {
        if (filterArray) {
            setFilterCheckStatus(false);
            const filterObj: any = {};
            const filterObjName: any = {};
            const unincludeKeysCache: any[] = [];
            if (filterArray.length > 0) {
                filterArray.forEach(item => {
                    filterObj[item.filterKey] = [];
                    filterObjName[item.filterKey] = {};
                    item.unIncludeFilter && unincludeKeysCache.push(item.filterKey);
                    item.data.forEach((nItem: any) => {
                        filterObjName[item.filterKey][nItem.value] = nItem.name;
                    });
                });
                setSelectfilterName(filterObjName);
                setSelectfilter(filterObj);
                setUnincludeKeys(unincludeKeysCache);
            } else {
                setSelectfilterName(null);
                setSelectfilter(null);
                setUnincludeKeys(null);
            }
        }

    }, [filterArray]);
    // 侦听选中filter变化发送数据请求
    React.useEffect(() => {
        if (tableFirstinit || !filterCheckStatus) return;
        const cacheFilter: any = {};
        const cacheUnincludeKeys: any = {};
        Object.keys(selectfilter).forEach((key: string) => {
            if (unincludeKeys.indexOf(key) !== -1) {
                cacheUnincludeKeys[key] = selectfilter[key].join(",");
            } else if (selectfilter[key].length > 0) {
                cacheFilter[key] = selectfilter[key].join(",");
            }
        });
        setsearchData({filter: cacheFilter, ...cacheUnincludeKeys});
    }, [selectfilter]);
    // 初次加载获取数据
    React.useEffect(() => {
        if ((!disableAutoSize && size && tableFirstinit) || (disableAutoSize && tableFirstinit)) {
            defaultCheckValues && setSelectedArr(defaultCheckValues);
            setData();
            setTimeout(() => {
                setTableFirstinit(false);
            }, 0);
        }

    }, [size]);
    // 侦听page，size变化，重新获取数据
    React.useEffect(() => {
        if (tableFirstinit) return;
        setData();
        setSelectedArr([]);  // 表格刷新同时清空选中的行
    }, [size, page, refresh, orderField, orderType, localData]);
    // 侦听 搜索值变化发送给父元素
    React.useEffect(() => {
        if (tableFirstinit) return;
        if (page !== 0) setPage(0);
        else setData();
    }, [bodyData, tableSearchData, url, localData]);
    React.useEffect(() => {
        getSearchKeys && searchKeys && getSearchKeys(searchKeys);
    }, [searchKeys]);
    // 切换页面清空复选值
    React.useEffect(() => {
        if (tableFirstinit) return;
        selectedArr !== null && setSelectedArr([]);
    }, [page]);
    // 侦听当前列表数组变化，计算能 check 的数量
    React.useEffect(() => {
        if (rowKey && check && listData) {
            let checkL = listData.length;
            disabledCheckArray && listData.forEach((item: any) => {
                disabledCheckArray.indexOf(item[rowKey]) > -1 && checkL--;
            });
            setCheckLength(checkL);
        }
        if (rowKey && check && listData) {
            const jdArr: any = {};
            listData.forEach((item: any) => {
                jdArr[item[rowKey]] = item;
            });
            setJelectedJDArr(jdArr);
        }
        // 单选框设置默认选中值
        if (rowKey && select && listData) {
            if (defaultCheckValues) {
                setSelectedArr(defaultCheckValues);
            }
        }
    }, [listData, disabledCheckArray, defaultCheckValues]);
    // 侦听复选值变化，发送给子节点
    React.useEffect(() => {
        if (tableFirstinit) return;
        if (!selectedArr) return;
        if (props.getSelected && rowKey) {
            const selectedObjArr: any = [...listData];
            const selectedJD: any = {};
            const backArr: any = [];
            selectedObjArr.forEach((item: any) => {
                selectedJD[item[rowKey]] = item;
            });
            selectedArr.forEach((key: any) => {
                backArr.push(selectedJD[key]);
            });
            props.getSelected(selectedArr, backArr);
        }
    }, [selectedArr]);

    React.useEffect(() => {
        if (selectedArr === "") return;
        if (rowKey && check && listData && selectedArr.length && selectedArr.length > 0) {
            const newSelectArr: any = selectedArr.filter((key: any) => Boolean(selectedJDArr[key]));
            // newSelectArr.join('') !== selectedArr.join('') && setSelectedArr(newSelectArr);
            setSelectedArr(newSelectArr);
        }
    }, [selectedJDArr]);
    // 复选 选中所有或取消
    const handleSelectAll = (event: any) => {
        const selectedArr: any = [];
        event.target.checked &&
        listData && listData.forEach((item: any) => {
            if (
                rowKey &&
                (!disabledCheckArray || disabledCheckArray.indexOf(item[rowKey]) === -1)
            )
                selectedArr.push(item[rowKey]);
        });
        setSelectedArr(selectedArr);
    };
    // 复选 单选
    const handleSelectOne = (event: any, key: any) => {
        let newSelect: string[];
        if (select) {
            newSelect = [];

        } else {
            newSelect = (selectedArr === "" ? [] : [...selectedArr]);
        }
        if (event.target.checked) {
            newSelect.push(key);
        } else {
            newSelect = newSelect.filter(item => item !== key);
        }
        setSelectedArr(newSelect);
    };
    // 改变页码
    const handleChangePage = (event: any, page: any) => {
        console.log(event)
        setPage(page);
    };
    // 改变页宽
    const handleChangeRowsPerPage = (event: any) => {
        setSize(event.target.value);
        const tempSize: any = event.target.value;
        if (tempSize * page > total) {
            setPage(0);
        }
        if (inputJumpEl.current.value && (Math.ceil(total / tempSize) < inputJumpEl.current.value)) {
            inputJumpEl.current.value = "";
            inputJumpOldValue.current = 1;
        }
    };

    // 点击表头排序 设置排序值
    const changeOrderField = (data: string) => () => {
        if (disableSort) return;
        // 只单独禁用某几项的排序
        if (disableSortFields && disableSortFields.indexOf(data) > -1) return;
        if (data === orderField) {
            toggleOrderType();
        } else {
            setOrderField(data);
        }
    };

    // 排序类型切换
    const toggleOrderType = () => {
        if (orderType === "asc") {
            setOrderType("desc");
        } else if (orderType === "desc") {
            setOrderField("");
            setOrderType("asc");
        } else {
            setOrderType("asc");
        }
    };
    // 设置搜索字段
    const setsearchData = (setObj: any) => {
        const setData: any = {...tableSearchData, ...setObj};
        setTableSearchData(setData);
    };

    // 处理get请求的地址
    const handleUrl = (parmas: any): string => {
        let urlParams: string = "";
        if (orderField) {
            urlParams = urlParams + `orderField=${orderField}`;
        }
        if (orderType && (!disableSort)) {
            urlParams = urlParams ? urlParams + `&orderType=${orderType}` : urlParams + `orderType=${orderType}`;
        }
        // if (tableSearchData.searchKey) {
        //     urlParams = urlParams + `&searchKey=${tableSearchData.searchKey}`;
        // }
        /**
         * jilanlan 2020-07-15 10:52
         * desc: 搜索值直接使用state里面，如果保存在tableSearchData中，会和searchValue不同步，会导致页面搜索值和实际搜索结果不匹配
         * @params
         **/
        if (searchValue && searchValue.value) {
            urlParams = urlParams + `&searchKey=${searchValue.value}`;
        }
        if (parmas) {
            if (typeof parmas === "string") {
                urlParams += (urlParams ? "&" : "") + parmas;
            }
            if (typeof parmas === "object") {
                Object.keys(parmas).forEach((key) => {
                    if (key !== "filter") {
                        urlParams += (urlParams ? "&" : "") + key + "=" + parmas[key];
                    }
                });
            }
        }

        // if (urlParams) urlParams = '?' + urlParams;
        return urlParams;
    };
    // 动态计算表格高度
    const computeTableHeight = React.useCallback((tDiv: any) => {
        if (!disableAutoSize && !size && tDiv) {
            let topValue: any;
            let jdFilterHeight = 0;
            if (document.getElementsByClassName("eic-table-filterbar").length > 0) {
                jdFilterHeight = 40;
            }
            if (filterArray) {
                topValue = tDiv.getBoundingClientRect().top + 40 + 40 + 15 + 10 + 30 - jdFilterHeight;
            } else {
                topValue = tDiv.getBoundingClientRect().top + 40 + 15 + 10 + 30 - jdFilterHeight;
            }
            const bodyHeight = height || document.body.clientHeight - topValue;
            const firstPage = parseInt(bodyHeight / 34 - 2 + "");
            tDiv.style.height = bodyHeight + "px";
            if (firstPage > 0) {
                setSize(firstPage);
                if (tablePagSizeArr.indexOf(firstPage) === -1) {
                    const tempArr = [firstPage, ...tablePagSizeArr];
                    setTablePagSizeArr(tempArr);
                }
            } else {
                setSize(10);
            }
        }
    }, [filterArray, size]);
    /* table hander渲染 */
    const StyleHander = React.useMemo(() => {
        return (
            <Fragment>
                {selColList && selColList.map((item: any) => {
                    return (
                        <TableCell style={!disableSort ? {cursor: "pointer", width: `${100 / selColList.length}%`} : {}}
                                   key={"thander" + item[headerRowTitleKey]}
                                   onClick={changeOrderField(item[headerRowTitleKey])}>
                            {item[headerTitleKey]}
                            {orderField === item[headerRowTitleKey] && (
                                <div className="arrowBox">
                                    <ArrowDropDownIcon
                                        className={orderType === "asc" ? "arrowDown" : "arrowUp"}/>
                                </div>)}
                        </TableCell>
                    );
                })}
                {OperateComponent && <TableCell style={{textOverflow: "inherit"}}>{operateTitle || "操作"}</TableCell>}
            </Fragment>
        );
    }, [selColList, OperateComponent, operateTitle, orderType, orderField]);
    /* table body渲染 */
    const StyleBody = React.useMemo(() => {
        return (
            <Fragment>
                {listData && listData.length > 0 ? listData.map((item: any, idx: number) => {
                        return (
                            <TableRow hover key={"tbody" + idx}>
                                {rowKey && check && (
                                    <TableCell padding="checkbox">
                                        {(!disabledCheckArray ||
                                            disabledCheckArray.indexOf(item[rowKey]) ===
                                            -1) && (
                                            <Checkbox
                                                checked={
                                                    selectedArr && selectedArr.indexOf(
                                                        item[rowKey]
                                                    ) > -1
                                                }
                                                onClick={e => {
                                                    handleSelectOne(
                                                        e,
                                                        item[rowKey]
                                                    );
                                                }}
                                                value={item[rowKey]}
                                                color="primary"
                                            />
                                        )}
                                    </TableCell>
                                )}

                                {rowKey && select && (
                                    <TableCell padding="checkbox">
                                        {(!disabledCheckArray ||
                                            disabledCheckArray.indexOf(item[rowKey]) ===
                                            -1) && (
                                            <Radio
                                                checked={
                                                    selectedArr && selectedArr.indexOf(
                                                        item[rowKey]
                                                    ) > -1
                                                }
                                                onClick={e => {
                                                    handleSelectOne(
                                                        e,
                                                        item[rowKey]
                                                    );
                                                }}
                                                value={item[rowKey]}
                                                color="primary"
                                            />
                                        )}
                                    </TableCell>
                                )}
                                {
                                    showIndex &&
                                    <TableCell>
                                    <span className={"eic-table-td"}>
                                                {idx + 1}
                                    </span>
                                    </TableCell>
                                }

                                {selColList.map((hitem: any, hidx: number) => {
                                    const itemValue = hitem[headerRowTitleKey];
                                    const valueTemp = operateKeyObject && operateKeyObject[hitem[headerRowTitleKey]] ?
                                        operateKeyObject[hitem[headerRowTitleKey]](item) :
                                        (item[itemValue + "EnumsDesc"] || item[itemValue]);
                                    return (
                                        <TableCell
                                            key={"tbCell" + itemValue + hidx}
                                            className={itemValue.indexOf("status") !== -1 ? `statusColor${item[itemValue]}` : ""}
                                        >
                                            <Tooltip
                                                placement="top-start"
                                                title={
                                                    valueTemp && valueTemp.length > 20 ?
                                                        (
                                                            valueTemp.length > 500 ?
                                                                `${valueTemp.slice(0, 500)}...` :
                                                                valueTemp
                                                        ) :
                                                        ""
                                                }
                                            >
                                            <span className={"eic-table-td"}>
                                                {valueTemp}
                                            </span>
                                            </Tooltip>

                                        </TableCell>
                                    );
                                })}
                                {OperateComponent &&
                                <TableCell
                                    style={{
                                        width: "230px",
                                        maxWidth: "1000px",
                                        textOverflow: "inherit"
                                    }}>
                                    <OperateComponent rowData={item}/>
                                </TableCell>
                                }
                            </TableRow>
                        );
                    })
                    :
                    (
                        // <TableRow className="noDataTips">
                        //     <TableCell rowSpan={selColList?.length || 0}>暂无数据</TableCell>
                        // </TableRow>
                        <TableRow className="noDataTips">
                            <TableCell rowSpan={selColList?.length || 0}><Empty/></TableCell>
                        </TableRow>

                    )}
            </Fragment>
        );
    }, [listData, OperateComponent, operateKeyObject, selColList, disabledCheckArray, selectedArr, defaultCheckValues]);

    const handleMultiSelectChange = (value: any) => {
        selValueRef.current = value;
        setSelColList(value);
    };

    const jumpPage = () => {
        const jumpValue = inputJumpEl.current.value * 1;
        if (jumpValue) {
            setPage(jumpValue - 1);
        }
    };

    const totalPages = (a: any, b: any) => Math.ceil(a / b);
    // 分页
    const TablePaginationMemo = React.useMemo(() => {
        // 禁用分页
        if (disablePagination) return null;
        return (
            <Fragment>
                <TablePagination
                    style={{width: "calc(100% - 60px)"}}
                    component="div"
                    count={total}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                    labelRowsPerPage={`共 ${total} 条  每页行数:`}
                    labelDisplayedRows={({count}) => `当前页 : ${page + 1}/${totalPages(count, size)}`}
                    page={page}
                    rowsPerPage={size || 0}
                    rowsPerPageOptions={tablePagSizeArr}
                />
                <Input
                    style={{width: "60px", fontSize: "12px", marginRight: "10px"}}
                    inputRef={inputJumpEl}
                    onChange={(e: any) => {
                        const jumpValue = e.target.value === "" ? e.target.value : e.target.value * 1;
                        if ((((size || size === 0) && Math.ceil(total / size) >= jumpValue) || jumpValue === "") && jumpValue !== 0) {
                            inputJumpOldValue.current = jumpValue;
                        } else {
                            inputJumpEl.current.value = inputJumpOldValue.current;
                        }
                    }}
                    onKeyUp={(e) => {
                        e.keyCode === 13 && jumpPage();
                    }}
                    onKeyPress={(e) => {
                        if (invalidChars.indexOf(e.key) !== -1) {
                            e.preventDefault();
                        }
                    }}
                    placeholder="跳转"
                    endAdornment={
                        <InputAdornment
                            style={{cursor: "pointer", marginLeft: "-11px"}}
                            onClick={() => {
                                jumpPage();
                            }}
                            position="end"
                        >
                            <Tooltip placement="top" title="跳转">
                                <LowPriorityIcon/>
                            </Tooltip>
                        </InputAdornment>
                    }
                />
            </Fragment>
        );
    }, [tablePagSizeArr, size, page, total]);
    /* 头部过滤字段渲染 */
    /**
     * huangxi 2020/7/13 16:09
     * desc:B#17463 解决Tooltip重复出现问题
     * @params
     **/
    const filterMemo = React.useMemo(() => {
        return (filterArray && filterArray.length > 0 &&
            <Fragment>
                <CardHeader
                    className="eic-table-filterbar-title eic-table-filterbar"
                    avatar={
                        <Fragment>
                            {selectfilter && filterArray.map((item: any, idx: number) => {
                                return (
                                    <div key={item.filterKey + idx} className="eicTableFilterBox">
                                        <div><FilterListIcon color="primary"
                                                             style={{verticalAlign: "middle"}}/>{item.title}:
                                        </div>
                                        <Tooltip
                                            arrow={true}
                                            onMouseEnter={() => {
                                                !filterTipsStatus && setFilterTipsStatus(true);
                                            }}
                                            placement="bottom"
                                            id={item.filterKey + idx}
                                            title={filterTipsStatus && selectfilter[item.filterKey].length > 0 ? selectfilter[item.filterKey].map((key: string) => selectfilterName[item.filterKey][key]).join(",") : ""}
                                        >
                                            <Select
                                                multiple={item.multiple}
                                                value={selectfilter[item.filterKey]}
                                                onOpen={() => {
                                                    filterTipsStatus && setFilterTipsStatus(false);
                                                }}
                                                onClose={() => {
                                                    setTimeout(() => {
                                                        setFilterTipsStatus(false);
                                                    }, 0);
                                                }}
                                                onChange={(e) => {
                                                    const cacheFilter = {...selectfilter};
                                                    if (typeof e.target.value === "string") {
                                                        if (selectfilter[item.filterKey].indexOf(e.target.value) !== -1) {
                                                            cacheFilter[item.filterKey] = [];
                                                        } else {
                                                            cacheFilter[item.filterKey] = [e.target.value];
                                                        }
                                                    } else {
                                                        cacheFilter[item.filterKey] = e.target.value;
                                                    }
                                                    !filterCheckStatus && setFilterCheckStatus(true);
                                                    setSelectfilter(cacheFilter);
                                                }}
                                                MenuProps={{className: "eic-filter-menu"}}
                                                input={<Input/>}
                                                renderValue={(selected) => (selected as string[]).map((key: string) => selectfilterName[item.filterKey][key]).join(",")}
                                            >
                                                {item.data.map((nitem: any) => (
                                                    <MenuItem dense={true} className="filterMulti"
                                                              key={nitem.value + nitem.name} value={nitem.value}>
                                                        {item.multiple && <Checkbox color="primary"
                                                                                    checked={selectfilter[item.filterKey].indexOf(nitem.value) > -1}/>}
                                                        <ListItemText
                                                            style={!item.multiple ? {textIndent: "10px"} : undefined}
                                                            primary={nitem.name}/>
                                                    </MenuItem>
                                                ))}

                                            </Select>
                                        </Tooltip>
                                    </div>
                                );
                            })}
                        </Fragment>
                    }
                />
                < Divider/>
            </Fragment>
        );
    }, [filterArray, selectfilter, filterTipsStatus]);
    const multiSelectMemo = React.useMemo(() => {
        return <MultiSelect
            label={"显示列"}
            titleKey={headerTitleKey}
            selectKey={headerRowTitleKey}
            onChange={handleMultiSelectChange}
            options={colAllMul || []}
            value={selValueRef.current}
        />;
    }, [colAllMul]);
    return (
        <ThemeProvider theme={whiteTheme}>
            <ParaUIStyleProvider prefix={"para-ui-eic-table"}>
                <div className={clsx("eicTableRoot", className, "para-ui-MuiGrid-eicTable")}>
                    {/*<div hidden={!loadState} className="loadEl">*/}
                    {/*    <LinearProgress/>*/}
                    {/*</div>*/}
                    <Card>
                        {filterMemo}
                        {!hideHeader && (
                            <Fragment>
                                <CardHeader
                                    className="eic-table-filterbar-title eic-table-searchbar"
                                    avatar={
                                        hideSearchBox ? null :
                                            <InputBase
                                                className="eicTabletitleInputBase"
                                                placeholder={searchKeys || searchPlaceholder || "搜索"}
                                                onChange={(e) => {
                                                    /**
                                                     * jilanlan 2020-07-15 10:52
                                                     * desc: 如果搜索的值是手动删除到空，就要同步searchValue 为无
                                                     * @params
                                                     **/
                                                    if (e.target.value === "") {
                                                        setSearchValue(null);
                                                    } else {
                                                        !searchValue && setSearchValue(e.target);
                                                    }

                                                    if (!e.target.value && deleteStatus) {
                                                        setDeleteStatus(false);
                                                    } else if (!deleteStatus) {
                                                        setDeleteStatus(true);
                                                    }

                                                }
                                                }
                                                inputProps={{
                                                    maxLength: "255"
                                                }}
                                                onKeyUp={(e) => {
                                                    e.keyCode === 13 && setsearchData({searchKey: searchValue && searchValue.value});
                                                }}
                                                startAdornment={
                                                    <InputAdornment position="start">
                                                        <SearchIcon style={{cursor: "pointer"}} onClick={() => {
                                                            setsearchData({searchKey: searchValue && searchValue.value});
                                                        }} color="primary"/>
                                                    </InputAdornment>
                                                }
                                                endAdornment={
                                                    deleteStatus &&
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            edge="end"
                                                            onClick={() => {
                                                                searchValue.value = "";
                                                                setDeleteStatus(false);
                                                                setsearchData({searchKey: null});
                                                            }}
                                                        >
                                                            <ClearIcon/>
                                                        </IconButton>
                                                    </InputAdornment>
                                                }
                                            />
                                    }
                                    action={
                                        <Fragment>
                                            {multiSelectMemo}
                                        </Fragment>
                                    }
                                />
                                <Divider/>
                            </Fragment>
                        )}
                        <CardContent className="eic-table-content">
                            <div ref={(tDiv: any) => {
                                computeTableHeight(tDiv);
                            }} className="eic-table-inner">
                                <Table size={"small"}>
                                    <TableHead>
                                        <TableRow>
                                            {rowKey && check && (
                                                <TableCell padding="checkbox">
                                                    <Checkbox
                                                        checked={
                                                            selectedArr && selectedArr.length > 0 &&
                                                            selectedArr.length ===
                                                            checkLength
                                                        }
                                                        color="primary"
                                                        indeterminate={
                                                            selectedArr && selectedArr.length > 0 &&
                                                            selectedArr.length <
                                                            checkLength
                                                        }
                                                        onChange={handleSelectAll}
                                                    />
                                                </TableCell>
                                            )}
                                            {rowKey && select && (
                                                <TableCell padding="checkbox">
                                                </TableCell>
                                            )}
                                            {showIndex && (
                                                <TableCell style={{width: "40%"}}>
                                                    序号
                                                </TableCell>
                                            )}

                                            {StyleHander}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {StyleBody}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                        <CardActions className="eic-table-actions pageNav">
                            {TablePaginationMemo}
                        </CardActions>
                    </Card>
                </div>
            </ParaUIStyleProvider>
        </ThemeProvider>
    );
};
export default ParaEicTable;
export {
    ParaEicTable
};
