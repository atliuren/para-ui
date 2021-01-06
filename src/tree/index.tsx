// @ts-nocheck
import React, {FunctionComponent} from "react";
import Tree, {TreeNode} from "rc-tree";
import clsx from "clsx";
import renderSwitcherIcon from "./iconUtil";
import {truncate} from "lodash-es";
import {getPrefixCls} from "../utils/prefix";

export interface ParaTreeProps {
    treeData?: any[];
    defaultSelectedKeys?: any[];
    defaultCheckedKeys?: any[];
    defaultExpandedKeys?: any[];
    selectedKeys?: any[];
    checkedKeys?: any[];
    checkStrictly?: boolean;
    checkInherit?: boolean; // 继承选中模式 与checkStrictly冲突当checkedInherit为true时checkStrictly不能为true
    defaultCheckInheritData?: any;
    defaultDisabledKeys?: any; // 默认设置初始化就置灰的key，indexOf匹配
    className?: string;
    selectable?: boolean;
    showLine?: boolean;
    checkable?: boolean;
    defaultExpandAll?: boolean;
    defaultExpandParent?: boolean;
    autoExpandParent?: boolean;
    showIcon?: boolean;
    icon?: Function;
    onExpand?: Function;
    onSelect?: Function;
    onCheck?: Function;
    draggable?: boolean;
    onDragStart?: Function;
    onDragEnter?: Function;
    onDrop?: Function;
    onDragOver?: Function;
    onDragEnd?: Function;
    onDragLeave?: Function;
    onCheckInherit?: Function;
    multiple?: boolean;
    direction?: "ltr" | "rtl";
    prefixCls?: string;
    switcherIcon?: React.ReactElement<any>;
    blockNode?: boolean;
    replaceFields?: {
        title?: string | number;
        children?: string;
        key?: string | number
    };
    onLoad?: Function;
    loadData?: Function;
    showArrow?: boolean;
    customize?: string;
    onLoadExpandedKeys?: string[];

    [customProp: string]: any;
}

export interface ParaTreeNodeAttribute {
    eventKey: string;
    prefixCls: string;
    className: string;
    expanded: boolean;
    selected: boolean;
    checked: boolean;
    halfChecked: boolean;
    children: React.ReactNode;
    title: React.ReactNode;
    pos: string;
    dragOver: boolean;
    dragOverGapTop: boolean;
    dragOverGapBottom: boolean;
    isLeaf: boolean;
    selectable: boolean;
    disabled: boolean;
    disableCheckbox: boolean;
}

export interface ParaTreeNodeProps {
    className?: string;
    checkable?: boolean;
    disabled?: boolean;
    disableCheckbox?: boolean;
    title?: string | React.ReactNode;
    key?: string;
    eventKey?: string;
    isLeaf?: boolean;
    checked?: boolean;
    expanded?: boolean;
    loading?: boolean;
    selected?: boolean;
    selectable?: boolean;
    icon?: ((treeNode: ParaTreeNodeAttribute) => React.ReactNode) | React.ReactNode;
    children?: React.ReactNode;

    [customProp: string]: any;
}

export const updateTreeData = (value, replaceFields, args?, parent?, setDefaultCheckedKeys?) => {
    const defaultFields = {children: "children", title: "title", key: "key"};
    const replaceField = {...defaultFields, ...replaceFields};
    value.forEach(node => {
        // more
        if (!node.more) {
            node["key"] = node[replaceField.key];
        } else {
            node["key"] = Math.random();
        }
        // 自定义节点
        if (args) {
            const {customize, defaultDisabledKeys} = args;
            if (customize) {
                if (node["type"] === customize) {
                    node["isLeaf"] = true;
                }
            }
            if (defaultDisabledKeys) {
                if (node["key"] && defaultDisabledKeys.indexOf(node["key"]) > -1) {
                    node["disabled"] = true;
                }
                console.log("node", node);
                console.log("args", defaultDisabledKeys);
            }
        }
        node["children"] = node[replaceField.children];

        if (typeof node["title"] === "string") {
            node["title"] = node[replaceField.title];
            node["title"] = truncate(node["title"], {"length": 32, "separator": "..."});
        } else {
            node["title"] = node[replaceField.title];
        }
        // 创建上级key,全路径
        if (parent) {
            node.parentKey = parent.key;
            node.fullPath = [...parent.fullPath, node.key];
        } else {
            node.parentKey = null;
            node.fullPath = [node.key];
        }
        if (node.children) {
            return updateTreeData(node.children, replaceFields, args, node, setDefaultCheckedKeys);
        }
    });
    return value;
};

let defaultHalfCheckedKeys = [];

function formatCheckInheritData(data) {
    defaultHalfCheckedKeys = [];
    const keys = Object.keys(data);
    if (keys.length === 0) return data;
    for (let i = 0, l = keys.length; i < l; i++) {
        const key = keys[i];
        const value = data[key];
        if (value.path) {
            value.pathArr = value.path.split("/");
            value.pathArr.splice(0, 1);
            setDefaultHalfCheckedKeys(value.pathArr.slice(0, value.pathArr.length - 1));
        }
        if (!value.exclude) continue;
        const exclude = Object.keys(value.exclude);
        if (exclude.length === 0) continue;
        exclude.forEach(k => {
            let e = value.exclude[k];
            if (e.path) {
                e.pathArr = e.path.split("/");
                e.pathArr.splice(0, 1);
                setDefaultHalfCheckedKeys(e.pathArr.slice(0, e.pathArr.length - 1));
            }
        });
    }
    return data;
}

function setDefaultHalfCheckedKeys(keys) {
    for (let i = 0, l = keys.length; i < l; i++) {
        if (defaultHalfCheckedKeys.indexOf(keys[i]) === -1)
            defaultHalfCheckedKeys.push(keys[i]);
    }
}

let treeMap = {};
const ParaTree: FunctionComponent<ParaTreeProps> = React.forwardRef((props, ref) => {
    let {
        className,
        showLine,
        checkable,
        showIcon,
        prefixCls: customizePrefixCls,
        switcherIcon,
        blockNode,
        children,
        direction,
        treeData,
        replaceFields,
        showArrow = true,
        defaultExpandedKeys,
        defaultCheckInheritData,
        onLoadExpandedKeys = [],
        defaultDisabledKeys = []
    } = props;
    const treeRef = React.useRef();

    const [checkInheritData, setCheckInheritData] = React.useState<any>(formatCheckInheritData(defaultCheckInheritData || {}));

    const prefixCls = getPrefixCls("tree", customizePrefixCls);

    if (treeData) {
        treeData = updateTreeData(treeData, replaceFields, props, null);
    }
    // checkbox事件
    const onCheck = (info, event) => {
        if (typeof props.onCheck === "function") return props.onCheck(info, event);
        if (props.checkInherit !== true) return;
        const {checked, node} = event;
        const children = node.children;
        setTimeout(() => setCheckBox(checked, children, info, node), 0);
    };

    // 递归设置checkbox状态
    const setCheckBox = async (checked, children: any, info, node) => {
        const {checkedKeys, halfCheckedKeys} = treeRef.current.state;
        if (halfCheckedKeys.indexOf(node.key) !== -1)
            halfCheckedKeys.splice(halfCheckedKeys.indexOf(node.key), 1); // 移除当前操作节点半选
        delCheckInheritData(node.key);
        if (children && children.length > 0) {
            const recursion = (cdr) => {
                for (let i = 0, l = cdr.length; i < l; i++) {
                    const item: any = cdr[i];
                    delCheckInheritData(item.key);
                    if (checked && checkedKeys.indexOf(item.key) === -1) checkedKeys.push(item.key);
                    else if (!checked && checkedKeys.indexOf(item.key) !== -1) checkedKeys.splice(checkedKeys.indexOf(item.key), 1);
                    if (item.children && item.children.length > 0) recursion(item.children);
                }
            };
            recursion(children);
        }
        // 父节点checkbox状态更新,向上查找所有节点
        let rootKey;
        const parentState = (parentKey, cb) => {
            if (!parentKey) return cb();
            const parent = treeMap[parentKey];
            if (!parent) return cb();
            delCheckInheritData(parent.key);
            const brother = parent.children;
            if (brother && brother.length > 0) {
                let checked = {y: 0, n: 0};
                brother.forEach(n => {
                    const c = treeMap[n.key];
                    delCheckInheritData(n.key);
                    if (!c || c.disableCheckbox) return true;
                    if (c.checked) checked.y++;
                    else checked.n++;
                });
                if (checked.y !== 0 && checked.n !== 0) { // 半选
                    if (checkedKeys.indexOf(parent.key) !== -1)
                        checkedKeys.splice(checkedKeys.indexOf(parent.key), 1); // 移除已勾选key
                    if (halfCheckedKeys.indexOf(parent.key) === -1)
                        halfCheckedKeys.push(parent.key); // 增加半选key
                    parent.checked = false;
                    parent.halfChecked = true;
                } else if (checked.y === 0 && checked.n === 0) {
                    // 无下级
                } else if (checked.y === 0) { // 全不选
                    if (checkedKeys.indexOf(parent.key) !== -1)
                        checkedKeys.splice(checkedKeys.indexOf(parent.key), 1); // 移除已勾选key
                    if (halfCheckedKeys.indexOf(parent.key) !== -1)
                        halfCheckedKeys.splice(halfCheckedKeys.indexOf(parent.key), 1); // 移除半选
                    parent.checked = false;
                    parent.halfChecked = false;
                } else if (checked.n === 0) { // 全选
                    if (checkedKeys.indexOf(parent.key) === -1)
                        checkedKeys.push(parent.key); // 勾选父级
                    if (halfCheckedKeys.indexOf(parent.key) !== -1)
                        halfCheckedKeys.splice(halfCheckedKeys.indexOf(parent.key), 1); // 移除半选
                    parent.checked = true;
                    parent.halfChecked = false;
                }
            }
            if (parent.checked) rootKey = parent.key;
            if (parent.parentKey) parentState(parent.parentKey, cb);
            else cb();
        };
        await delay(0);

        parentState(node.parentKey, () => {
            treeRef.current.setUncontrolledState({checkedKeys, halfCheckedKeys});
            setCheckInheritData(checkInheritData);
            getCheckInheritData(rootKey);
        });
    };

    const delCheckInheritData = (key) => {
        if (checkInheritData[key]) delete checkInheritData[key];
        Object.keys(checkInheritData).forEach(k => {
            const node = checkInheritData[k];
            if (node.pathArr && node.pathArr.indexOf(key) !== -1) delete checkInheritData[k];
        });
    };

    // 懒加载事件
    const loadData = async (treeNode: any) => {
        let data;
        if (typeof props.loadData === "function") data = await props.loadData(treeNode);
        setDefaultCheckedKeys(treeNode, data);
    };

    // 设置默认checkbox状态
    const setDefaultCheckedKeys = (treeNode, data) => {
        if (typeof treeNode === "string") treeNode = treeMap[treeNode];
        if (props.checkInherit !== true) return; // 该方法仅继承模式执行
        if (treeNode) {
            const inheritData = checkInheritData[treeNode.key]; // 存在勾选清单
            if (inheritData && treeRef.current.state.checkedKeys.indexOf(treeNode.key) === -1)
                treeRef.current.state.checkedKeys.push(treeNode.key);
        }
        if (!data || data.length === 0) return;
        for (let i = 0, l = data.length; i < l; i++) {
            const item = data[i];
            setHalfCheckedKeys(item);
            treeMap[item.key].fullPath = treeNode ? [...treeNode.fullPath, item.key] : [item.key];
            let checked = false;
            if (treeNode) checked = treeNode.checked;
            if (checkInheritData[item.key])
                checked = true;
            else if (treeNode && checkInheritData[treeNode.key] && checkInheritData[treeNode.key].exclude[item.key]) // 存在排除清单之中
                checked = false;

            //checkInheritData
            if (checked) // 继承模式当上级勾选状态则下级也勾选
                treeRef.current.state.checkedKeys.push(item.key);
        }
    };

    // 返回继承模式数据结构,nodeKey更新改分支节点
    const getCheckInheritData = async () => {
        const {checkedKeys, treeData} = treeRef.current.state;
        let data = {...checkInheritData};
        const recursion = (parent: any, idx: number, checkedKey: string = "") => { // parentChecked 上级是否已有选中
            for (let i = 0, l = parent.length; i < l; i++) {
                const node: any = parent[i];
                const checked = checkedKeys.indexOf(node.key) !== -1;
                let ck = "";
                if (checked && !checkedKey) {
                    data[node.key] = {
                        path: "/" + node.fullPath.join("/"),
                        exclude: {} // 排除清单
                    };
                    ck = node.key;
                } else if (!checked && checkedKey) {
                    data[checkedKey].exclude[node.key] = {
                        path: "/" + node.fullPath.join("/"),
                    };
                }
                if (node.children && node.children.length > 0) recursion(node.children, isNaN(idx) ? i : idx, ck);
            }
        };
        recursion(treeData);

        await delay(0);
        setCheckInheritData(data);
        if (typeof props.onCheckInherit === "function") props.onCheckInherit(data);
    };
    const filterTreeNode = (node) => {
        if (typeof props.filterTreeNode === "function") {
            let e = props.filterTreeNode(node);
            if (e) return true;
        }
        treeMap[node.key] = node;
    };

    const setHalfCheckedKeys = (node) => {
        const {halfCheckedKeys} = treeRef.current.state;
        if (defaultHalfCheckedKeys.indexOf(node.key) !== -1 && halfCheckedKeys.indexOf(node.key) === -1)
            halfCheckedKeys.push(node.key);
    };
    // format树数据字段
    React.useEffect(() => {
        console.log("defaultCheckInheritData", defaultCheckInheritData);
        // 继承模式初始checkbox状态设置
        if (props.checkInherit === true && checkInheritData) {
            let {treeData} = treeRef.current.state;
            treeRef.current.state.checkedKeys = [];
            treeRef.current.state.halfCheckedKeys = [];
            const recursion = (parent: any) => { // parentChecked 上级是否已有选中
                for (let i = 0, l = parent.length; i < l; i++) {
                    const node: any = parent[i];
                    const inheritData = checkInheritData[node.key]; // 存在勾选清单
                    // 设置半选
                    if (inheritData)
                        setDefaultCheckedKeys({key: node.key, checked: true}, node.children);
                    else
                        setHalfCheckedKeys(node);
                    if (node.children && node.children.length > 0)
                        recursion(node.children);
                }
            };
            recursion(treeData);
        }
    }, [defaultCheckInheritData]);

    React.useImperativeHandle(ref, () => ({
        update: (parent, data) => { // ref.update 外部调用更新函数
            // parent.parentKey
            setDefaultCheckedKeys(parent.parentKey, data);
        },
        getCheckInheritData: () => {
            return getCheckInheritData();
        }
    }));

    return (
        <div className={clsx("paraTree", "para-tree-fragment")}>
            <Tree
                itemHeight={20}
                ref={treeRef}
                {...props}
                onCheck={onCheck}
                loadData={loadData}
                prefixCls={prefixCls}
                filterTreeNode={filterTreeNode}
                className={clsx(className, {
                    [`${prefixCls}-icon-hide`]: !showIcon,
                    [`${prefixCls}-block-node`]: blockNode,
                    [`${prefixCls}-rtl`]: direction === "rtl"
                })}
                checkable={checkable ? <span className={`${prefixCls}-checkbox-inner`}/> : checkable}
                switcherIcon={(nodeProps: ParaTreeNodeProps) =>
                    renderSwitcherIcon(prefixCls, switcherIcon, showLine, showArrow, nodeProps, onLoadExpandedKeys)
                }
                treeData={treeData}
                defaultExpandedKeys={defaultExpandedKeys || []}
            >
                {children}
            </Tree>
        </div>

    );
});

function delay(time = 0) {
    return new Promise(resolve => {
        setTimeout(resolve, time);
    });
}

export default ParaTree;

export {
    TreeNode,
    ParaTree
};
