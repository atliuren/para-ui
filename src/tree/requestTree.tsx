// @ts-nocheck
import React, {FunctionComponent} from "react";
import ParaTree, {ParaTreeProps} from "./index";
import {Get, Post, ObjectConverParameters} from "para-lib";
import SearchBar, {SearchOptionsInterface} from "./SearchBar";
import NoData from "../components/NoData";
import {ParaSkeleton} from "../skeleton";
import {ParaUIStyleProvider} from "../providers";


export interface Params {
    page?: number;
    size?: number;

    [customProp: string]: any;
}

export interface RequestProps {
    url: string;
    ctx?: string;
    method?: "get" | "post";
    params?: Params;
}


export interface RequestTreeProps extends ParaTreeProps {
    request: RequestProps; // 请求的options（ajax）的配置对象
    requestCallback: Function; // 请求的回调
    parent?: string; // 渲染的上下级的判断字段
    onSelectCallback?: Function; // 选择的节点的回调函数
    onExpandCallback?: Function; // 展开节点的回调函数
    size?: number; // 分页数量配置
    page?: number; // 页数 默认从1开始
    refresh?: any; // 刷新函数
    search?: boolean; // 搜索的配置
    searchOptions?: SearchOptionsInterface; // 搜索选项
    noData?: string;
    root?: boolean; // 是否插入固定根节点
    rootOptions?: any; // 自定义根节点

    [customProp: string]: any;
}

interface DataNode {
    title: string;
    key: string;
    isLeaf?: boolean;
    children?: DataNode[];
}

let TREE_MAPPING: any = {};
let defaultSizePage: any = {size: 25, page: 1};
let defaultRequest: any = {params: {page: 1, size: 25}};
let defaultMethods: string = "get";
const RequestTree: FunctionComponent<RequestTreeProps> = (props) => {
    let {
        request, parent,
        replaceFields,
        onSelectCallback,
        requestCallback,
        size,
        page,
        refresh,
        search = false,
        searchOptions = {
            placeholder: "请输入搜索关键词",
            options: [
                {key: "searchKey", value: "搜索关键词"},
            ]
        },
        checkable,
        noData = "暂无数据",
        root,
    }: any = props;
    const treeRef = React.useRef();

    const [requestState, setRequestState] = React.useState<any>({});
    const [treeData, setTreeData]: any = React.useState([]);
    const [treeDataMapping, setTreeDataMapping]: any = React.useState({});
    const [refreshCurrent, setRefreshCurrent] = React.useState<any>(0);
    const [loading, setLoading] = React.useState<boolean>(true);
    const [searchInfo, setSearchInfo] = React.useState<any>(null);
    const updateTreeData = React.useCallback((list: DataNode[], key: React.Key, children: DataNode[], isMore: boolean): DataNode[] => {
        if (key === "/") {
            if (children.length && children.length >= defaultSizePage.size) {
                const temp = list[list.length - 1]; // 最后一项
                list.splice(-1, 1);
                children.map((li: any) => {
                    list.push(li);
                });
                list.push(temp);
            } else {
                list.splice(-1, 1);
                children.map((li: any) => {
                    list.push(li);
                });
            }
            return list;
        } else {
            return list.map((node: any) => {
                /* 建立索引TreeDataMapping映射关系 */
                if (!TREE_MAPPING[node.key]) {
                    TREE_MAPPING[node.key] = node;
                }
                if (node.key === key) {
                    if (isMore) {
                        if (children.length && children.length >= defaultSizePage.size) {
                            const temp = node.children[node.children.length - 1];
                            node.children.splice(-1, 1);
                            children.map((it: any) => {
                                node.children?.push(it);
                            });
                            node.children?.push(temp);
                            return node;
                        } else {
                            node.children?.splice(-1, 1);
                            children.map((it: any) => {
                                node.children?.push(it);
                            });
                            return node;
                        }
                    } else {
                        return {...node, children};
                    }
                } else if (node.children) {
                    return {
                        ...node,
                        children: updateTreeData(node.children, key, children, isMore)
                    };
                }
                return node;
            });
        }
    }, []);

    /* 树的选择的函数 */
    const onSelectHandler = async (selectedKeys: any, e: any) => {
        const {selected, node} = e;
        if (selected && node.more) {
            const data = await onLoadData(node);
            console.log('parent', parent);
            treeRef.current.update(node, data); // 更新树内部数据状态
            if (onSelectCallback) onSelectCallback(selectedKeys, e);
        } else {
            if (onSelectCallback) onSelectCallback(selectedKeys, e, TREE_MAPPING[node.key]);
        }
    };
    const fetchData = async (req: any) => {
        setLoading(true);
        let data: any = {};
        let url: string = "";
        let value: any = "";
        if (!req.method) req.method = "get";
        let methods = req.method.toLocaleLowerCase();
        defaultMethods = methods;
        if (methods === "get") {
            url = req.params ? `${req.url}?${ObjectConverParameters(req.params)}` : `${req.url}`;
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
        loopTreeDataMapping(value);
        return value;
    };
    /* 树的请求函数封装 */
    /* 生成所有数据对应map图 */
    const loopTreeDataMapping = React.useCallback((data) => {
        if (data && data.length > 0) {
            data.map((value: any) => {
                setTreeDataMapping((origin: any) => {
                    if (!origin[value.id]) {
                        origin[value.id] = {page: 1, size: defaultSizePage.size};
                    }
                    return origin;
                });
            });
        }
    }, []);
    /* 设置加载更多的节点 */
    const setMoreNode = (parentKey) => {
        let tempKey = Math.random();
        let moreNode: any = {
            id: tempKey,
            isLeaf: true,
            more: true,
            parentKey,
            disableCheckbox: true,
            className: checkable ? "para-tree-hidden para-tree-more" : "para-tree-hidden-normal para-tree-more"
        };
        if (replaceFields && replaceFields.title) {
            moreNode[replaceFields.title] = "加载更多";
        } else {
            moreNode["title"] = "加载更多";
        }
        return moreNode;
    };

    const setRootNode = () => {
        let rootNode: any = {
            id: "-1",
            isLeaf: true,
            className: "para-tree-root-node"
        };
        if (replaceFields && replaceFields.title) {
            rootNode[replaceFields.title] = "root根节点";
        } else {
            rootNode["title"] = "root根节点";
        }
        return rootNode;
    };

    /* 懒加载函数 */
    const onLoadData = (treeNode: any) => {
        const {key, children, more} = treeNode;
        return new Promise(async resolve => {
            if (children) {
                resolve();
                return;
            }
            let data: any;
            if (!more) {
                /* 展开下级 */
                let obj: any = {};
                let tempSearchObject: any = {};
                obj[parent] = key;
                let opts = Object.assign({}, {...treeDataMapping[key]}, obj);
                let moreNodeLoad = setMoreNode();
                // if (searchInfo) tempSearchObject[searchInfo.key] = defaultMethods === "get" ? encodeURIComponent(`${searchInfo.keywords}`) : searchInfo.keywords;
                if (searchInfo) tempSearchObject[searchInfo.key] = searchInfo.keywords;
                let tempParams = Object.assign({}, requestState.params || {}, opts, tempSearchObject);
                let tempRequest = Object.assign({}, requestState, {params: tempParams});
                data = await fetchData(tempRequest);
                moreNodeLoad[parent] = opts[parent];
                if (data && data.length >= defaultSizePage.size) data = [...data, moreNodeLoad];
                setTreeData((origin: any) => {
                    const nData = updateTreeData(origin, key, data, false);
                    return [...nData];
                });
            } else {
                /* 加载更多 */
                if (loading) return;
                treeDataMapping[treeNode[parent]].page = treeDataMapping[treeNode[parent]].page + 1;
                let objParent: any = {};
                let tempSearchObject: any = {};
                /* 多根节点的时候异常处理 */
                if (treeNode[parent] !== "/") {
                    objParent[parent] = treeNode[parent];
                } else {
                    objParent[parent] = "";
                }
                // if (searchInfo) tempSearchObject[searchInfo.key] = defaultMethods === "get" ? encodeURIComponent(`${searchInfo.keywords}`) : searchInfo.keywords;
                if (searchInfo) tempSearchObject[searchInfo.key] = searchInfo.keywords;
                let opts = Object.assign({}, {...treeDataMapping[treeNode[parent]]}, objParent);
                let tempParams = Object.assign({}, requestState.params || {}, opts, tempSearchObject);
                let tempRequest = Object.assign({}, requestState, {params: tempParams});
                data = await fetchData(tempRequest);
                setTreeData((origin: any) => {
                    const nData = updateTreeData(origin, treeNode[parent], data, true);
                    return [...nData];
                });
            }
            resolve(data);
        });
    };
    /* 搜索 */
    const onSearch = async (info: any) => {
        if (loading) return;
        let tempObject: any = {};
        if (info.keywords) {
            setSearchInfo(info);
            // tempObject[info.key] = defaultMethods === "get" ? encodeURIComponent(`${info.keywords}`) : info.keywords;
            tempObject[info.key] = info.keywords;
            let tempParams = Object.assign({}, requestState.params || {}, tempObject);
            let tempRequest = Object.assign({}, requestState, {params: tempParams});
            fetchData(tempRequest).then(value => {
                if (value && typeof value !== "string" && value.length > 0) {
                    let moreNodeLoad = setMoreNode(null);
                    if (tempRequest.params[parent] === "" || tempRequest.params[parent] === "/" || tempRequest.params[parent] === "root") {
                        moreNodeLoad[parent] = "/";
                        setTreeDataMapping((origin: any) => {
                            origin["/"] = {
                                page: 1,
                                size: defaultSizePage.size
                            };
                            return origin;
                        });
                    } else {
                        moreNodeLoad[parent] = request.params[parent];
                    }
                    /* 添加加载更多 */
                    if (value && value.length >= defaultSizePage.size) value.push(moreNodeLoad);
                    setTreeData([]);
                    setTimeout(() => setTreeData(value), 300);
                } else {
                    setTreeData([]);
                }
            });
        } else {
            setRefreshCurrent(Math.random());
            setTreeData([]);
            if (parent) defaultRequest.params[parent] = "";
            request = {...defaultRequest, ...request};
            initFunction(request);
        }
    };
    /* 关闭 */
    const onClose = () => {
        if (loading) return;
        setSearchInfo(null);
        setRefreshCurrent(Math.random());
        setTreeData([]);
        if (parent) defaultRequest.params[parent] = "";
        request = {...defaultRequest, ...request};
        initFunction(request);
    };

    /* 监听刷新 */
    React.useEffect(() => {
        if (refresh === refreshCurrent) return;
        if (parent) defaultRequest.params[parent] = "";
        request = {...defaultRequest, ...request};
        setRefreshCurrent(refresh);
        setTreeData([]);
        initFunction(request);
    }, [refresh]);

    const initFunction = (req: any) => {
        if (page) defaultSizePage.page = page;
        if (size) defaultSizePage.size = size;
        if (req) {
            setRequestState(JSON.parse(JSON.stringify(req))); // 复制一份request请求对象
            fetchData(req).then(value => {
                if (value && typeof value !== "string" && value.length > 0) {
                    let moreNodeLoad = setMoreNode(null);
                    if (req.params[parent] === "" || req.params[parent] === "/" || req.params[parent] === "root" || req.params[parent] === -1) {
                        moreNodeLoad[parent] = "/";
                        setTreeDataMapping((origin: any) => {
                            origin["/"] = {
                                page: 1,
                                size: defaultSizePage.size
                            };
                            return origin;
                        });
                    } else {
                        moreNodeLoad[parent] = req.params[parent];
                    }
                    /* 添加加载更多 */
                    if (value && value.length >= defaultSizePage.size) value.push(moreNodeLoad);
                    /* 判断是否添加root节点 */
                    if (root) {
                        let rootNodeLoad = setRootNode();
                        value.unshift(rootNodeLoad);
                    }
                    setTreeData(value);
                } else {
                    setTreeData([]);
                }
            });
        }
    };

    React.useEffect(() => {
        if (parent) defaultRequest.params[parent] = "";
        request = {...defaultRequest, ...request};
        initFunction(request);
    }, []);

    return (
        <ParaUIStyleProvider prefix={"para-ui-request-tree"}>
            <div style={{position: "relative"}} className={"para-request-tree"}>
                {search ? (<SearchBar {...searchOptions} onChange={onSearch} onClose={onClose}/>) : null}
                {
                    treeData.length > 0
                        ? (<div className={search ? "para-search-content-scroll" : "para-search-content-noscroll"}>
                            <ParaTree
                                ref={treeRef}
                                onSelect={onSelectHandler}
                                loadData={onLoadData}
                                treeData={treeData}
                                checkStrictly={true}
                                {...props}
                            />
                        </div>)
                        : loading
                        ? (<ParaSkeleton loading={loading} active paragraph={{rows: 4}}
                                         className={"para-request-tree-skeleton"}/>)
                        : <NoData content={noData}/>
                }
            </div>
        </ParaUIStyleProvider>
    );
};

export default RequestTree;
export {
    RequestTree
};
