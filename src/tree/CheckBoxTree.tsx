// @ts-nocheck
import React, {FunctionComponent} from "react";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Radio from "@material-ui/core/Radio";
import {Get, Post, ObjectConverParameters} from "para-lib";
import SearchBar from "./SearchBar";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import {cloneDeep, uniq} from "lodash-es";
import NoData from "../components/NoData";
import {ParaSkeleton} from "../skeleton";
import clsx from "clsx";
import {ThemeProvider} from "@material-ui/core/styles";
import {ParaUIStyleProvider, whiteTheme} from "../providers";
import ParaTooltips from "./ParaTooltips";

interface CheckBoxTreeProps {
    search?: boolean; //搜索
    request?: any; // 请求体
    requestCallback?: Function; // 请求的callback
    searchOptions?: any; // 搜索的配置
    replaceFields?: any; // 替换字段
    checkStrictly?: boolean; // 严格模式
    checkable?: boolean; // 是否可选
    page?: number;
    size?: number;
    onChange?: Function;
    onSelect?: Function;
    checkedKeys?: string[];
    noData?: string;
    refresh?: any;

    [customProp: string]: any;
}

let defaultRequest: any = {params: {page: 1, size: 25}};
const INIT_MORE = {key: "more", title: "加载更多"};
let INSERT_CHECKEDKEYS: string[] = [];
const CheckBoxTree: FunctionComponent<CheckBoxTreeProps> = (props) => {
    let {
        request,
        requestCallback,
        searchOptions = {},
        search = false,
        checkStrictly = true,
        replaceFields,
        checkable = true,
        page,
        size,
        onChange,
        onSelect,
        checkedKeys = [],
        noData = "暂无数据",
        refresh
    } = props;

    let HASREQUESTURL: any = {};
    const [state, setState] = React.useState<any>(null);
    const [loading, setLoading] = React.useState<boolean>(true);
    const [refreshCurrent, setRefreshCurrent] = React.useState<any>(0);
    const [defaultSizePage, setDefaultSizePage] = React.useState<any>({size: 25, page: 1});
    /**
     * 陈夕 2020/7/17 下午2:19
     * desc: 点击加载更多的时候也要记录当前的搜索词
     * @params
     **/
    const [searchInfo, setSearchInfo] = React.useState<any>(null);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>, item: any) => {
        event.persist();
        const {key} = item;
        setState((origin: any) => {
            origin.forEach((it: any) => {
                if (checkStrictly) {
                    if (it.key == key) {
                        it.checked = event.target ? event.target.checked : false;
                    } else {
                        it.checked = false;
                    }
                } else {
                    if (it.key == key) {
                        it.checked = event.target ? event.target.checked : false;
                    }
                }
            });
            return [...origin];
        });
    };
    /**
     * 陈夕 2020/7/17 下午2:28
     * desc: searchInfo 点击加载更多时候带上搜索词
     * @params
     **/
    const handleMoreChange = () => {
        if (loading) return;
        if (!request.params) request.params = {};
        // defaultSizePage.page = defaultSizePage.page + 1;
        let tempSearchObject: any = {};
        setDefaultSizePage((prev) => {
            prev.page = prev.page + 1;
            if (searchInfo) tempSearchObject[searchInfo.key] = searchInfo.keywords;
            let tempParams = Object.assign({}, request.params, defaultSizePage, tempSearchObject);
            let tempRequest = Object.assign({}, request);
            tempRequest.params = tempParams;
            fetchData(tempRequest).then((value: any) => {
                const data = updateSourceData(value);
                /* 添加加载更多 */
                setState((origin: any) => {
                    origin.pop();
                    // if (data.length <= defaultSizePage.size) data.push(INIT_MORE);
                    /* bug 2020年05月20日13:35:28 */
                    if (data.length > 0 && data.length === defaultSizePage.size || data.length >= defaultSizePage.size) data.push(INIT_MORE);
                    origin = [...origin, ...data];
                    return [...origin];
                });
            });
            return prev;
        });
    };

    const itemClick = (info: any) => {
        if (onSelect) {
            onSelect(info);
        }
    };

    const renderContent = (value: any) => {
        if (value && value.length > 0) {
            return value.map((item: any, index: number) => (
                item.key !== "more"
                    ? checkable
                    ? (<ParaTooltips title={item.title}>
                        <FormControlLabel
                            key={index}
                            value={item.key}
                            disabled={item.disabled}
                            control={checkStrictly
                                ? (<Radio
                                    checked={item.checked}
                                    onChange={(e: any) => {
                                        handleChange(e, item);
                                        itemClick(item);
                                    }}
                                    name={item.title}
                                    color="primary"/>)
                                : (<Checkbox
                                    checked={item.checked}
                                    onChange={(e: any) => {
                                        handleChange(e, item);
                                        itemClick(item);
                                    }}
                                    name={item.title} color="primary"/>)}
                            label={item.title}
                        />
                    </ParaTooltips>)
                    : (<ParaTooltips title={item.title}>
                        <div key={index} onClick={() => itemClick(item)}>{item.title}</div>
                    </ParaTooltips>)
                    : <div key={index} className={clsx("checkbox-tree-more", {
                        ["checkbox-tree-more-loading"]: loading
                    })}
                           style={{display: "flex", cursor: "pointer", color: "#1976d2"}}
                           onClick={() => {
                               handleMoreChange();
                               itemClick(INIT_MORE);
                           }}>
                        <MoreHorizIcon/>
                        <span style={{marginLeft: "6px", fontSize: "12px", marginTop: "3px"}}>{item.title}</span>
                    </div>
            ));
        } else {
            return (<NoData content={noData}/>);
        }
    };

    const fetchData = async (req: any) => {
        setLoading(true);
        let data: any = {};
        let url: string = "";
        let value: any = "";
        if (!req.method) req.method = "get";
        let methods = req.method.toLocaleLowerCase();
        if (methods === "get") {
            url = req.params ? `${req.url}?${ObjectConverParameters(req.params)}` : `${req.url}`;
            if (HASREQUESTURL[url]) return;
            HASREQUESTURL[url] = true;
            data = await Get({url, ctx: req.ctx, ...req});
            if (data.status === 403 || data.status === "403") {
                setLoading(false);
                noData = "暂无权限";
            }
            if (data.err) return false;
            setLoading(false);
            if (requestCallback) {
                requestCallback(data?.data, (val: any) => {
                    value = val;
                });
            } else {
                value = data.data;
            }
        }
        if (methods === "post") {
            if (HASREQUESTURL[req.url]) return;
            HASREQUESTURL[req.url] = true;
            data = await Post({url: req.url, ctx: req.ctx, data: req.params || {}, ...req});
            if (data.status === 403 || data.status === "403") {
                setLoading(false);
                noData = "暂无权限";
            }
            if (data.err) return false;
            setLoading(false);
            if (requestCallback) {
                requestCallback(data?.data, (val: any) => {
                    value = val;
                });
            } else {
                value = data.data;
            }
        }
        return value;
    };

    const onSearch = async (info: any) => {
        if (loading) return;
        if (!request.params) request.params = defaultRequest.params;
        setSearchInfo(info);
        let tempParam = info.keywords
            ? Object.assign({}, request.params, {[info["key"]]: info.keywords})
            : Object.assign({}, request.params);
        let tempReq = cloneDeep(request);
        tempReq.params = tempParam;
        fetchData(tempReq).then((value: any) => {
            if (value && typeof value !== "string" && value.length > 0) {
                const data = updateSourceData(value);
                /* 添加加载更多 */
                if (data.length > 0 && data.length === defaultSizePage.size || data.length >= defaultSizePage.size) data.push(INIT_MORE);
                setState(data);
            } else {
                setState([]);
            }
        });
    };
    /**
     * 陈夕 2020/7/17 下午2:23
     * desc: 添加Close事件
     * @params
     **/
    const onClose = () => {
        if (loading) return;
        setSearchInfo(null);
        setRefreshCurrent(Math.random());
        setState([]);
        setDefaultSizePage((prev) => {
            prev.page = 1;
            prev.size = size;
            return prev;
        });
        request = {...defaultRequest, ...request};
        initFunction(request);
    };

    const updateSourceData = (val: any) => {
        let defaultReplaceFields = {key: "key", title: "title"};
        let replaceFileds = {...defaultReplaceFields, ...replaceFields};
        if (val && val.length > 0) {
            for (let i = 0; i < val.length; i++) {
                val[i]["key"] = val[i][replaceFileds.key];
                val[i]["title"] = val[i][replaceFileds.title];
                val[i]["disabled"] = false;
                val[i]["checked"] = INSERT_CHECKEDKEYS && INSERT_CHECKEDKEYS.indexOf(val[i]["key"]) > -1;
            }
            return val;
        } else {
            return [];
        }
    };
    const initFunction = (req) => {
        fetchData(req).then(value => {
            if (value && typeof value !== "string" && value.length > 0) {
                const data = updateSourceData(value);
                /* 添加加载更多 */
                if (data.length > 0 && data.length === defaultSizePage.size || data.length >= defaultSizePage.size) data.push(INIT_MORE);
                setState(data);
            } else {
                setState([]);
            }
        });
    };
    React.useEffect(() => {
        if (onChange && state) {
            let tempCheckedKeys: string[] = [];
            let tempNode: any = [];
            for (let i = 0; i < state.length; i++) {
                if (state[i].checked) {
                    tempCheckedKeys.push(state[i].key);
                    tempNode.push(state[i]);
                }
            }
            onChange(uniq(tempCheckedKeys), tempNode);
        }
    }, [state]);

    React.useEffect(() => {
        if (page) {
            setDefaultSizePage((prev) => {
                prev.page = page;
                return prev;
            });
        }
        if (size) {
            setDefaultSizePage((prev) => {
                prev.size = size;
                return prev;
            });
        } else {
            setDefaultSizePage((prev) => {
                prev.size = defaultRequest.params.size;
                return prev;
            });
        }
        if (checkedKeys) INSERT_CHECKEDKEYS = cloneDeep(checkedKeys);
        if (request) {
            request = {...defaultRequest, ...request};
            fetchData(request).then(value => {
                if (value && typeof value !== "string" && value.length > 0) {
                    const data = updateSourceData(value);
                    /* 添加加载更多 */
                    if (data.length > 0 && data.length === defaultSizePage.size || data.length >= defaultSizePage.size) data.push(INIT_MORE);
                    setState(data);
                } else {
                    setState([]);
                }
            });
        }
    }, []);

    React.useEffect(() => {
        if (refresh === refreshCurrent) return;
        setRefreshCurrent(refresh);
        setState([]);
        setDefaultSizePage((prev) => {
            prev.page = 1;
            prev.size = size;
            return prev;
        });
        initFunction(request);
    }, [refresh]);

    return (
        <ThemeProvider theme={whiteTheme}>
            <ParaUIStyleProvider prefix={"para-ui-checkbox-tree"}>
                <div style={{position: "relative"}} className={"para-checkbox-tree"}>
                    {search ? (<SearchBar {...searchOptions} onChange={onSearch} onClose={onClose}/>) : null}
                    {/*{loading ? <ParaLoading loading={loading} {...props}/> : null}*/}
                    <FormGroup className={"para-check-box-tree"}>
                        {loading
                            ? <ParaSkeleton loading={loading} active paragraph={{rows: 4}}
                                            className={"para-checkbox-tree-skeleton"}/>
                            : renderContent(state)
                        }
                    </FormGroup>
                </div>
            </ParaUIStyleProvider>
        </ThemeProvider>
    );
};

export default CheckBoxTree;
export {CheckBoxTree, CheckBoxTreeProps};
