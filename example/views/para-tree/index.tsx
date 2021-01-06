import React, {Fragment, FunctionComponent} from "react";
import {CheckBoxTree, ParaTree, RequestTree} from "../../../src";
import AccountTreeOutlinedIcon from "@material-ui/icons/AccountTreeOutlined";
import AdbOutlinedIcon from "@material-ui/icons/AdbOutlined";

interface OwnProps {
}

type Props = OwnProps;

const treeData = [
    {
        title: (...args) => {
            console.log(args);
            return <span>chenxi</span>;
        },
        key: "0-0",
        icon: ({selected}) => (selected ? <AccountTreeOutlinedIcon style={{
            fontSize: "20px",
            marginTop: "2px"
        }}/> : <AdbOutlinedIcon/>),
        children: [
            {
                title: "0-0-0",
                key: "0-0-0",
                icon: <AdbOutlinedIcon/>,
                children: [
                    {title: "0-0-0-0", key: "0-0-0-0"},
                    {title: "0-0-0-1", key: "0-0-0-1"},
                    {title: "0-0-0-2", key: "0-0-0-2"}
                ]
            },
            {
                title: "0-0-1",
                key: "0-0-1",
                children: [
                    {title: "0-0-1-0", key: "0-0-1-0"},
                    {title: "0-0-1-1", key: "0-0-1-1"},
                    {title: "0-0-1-2", key: "0-0-1-2"}
                ]
            },
            {
                title: "0-0-2",
                key: "0-0-2"
            }
        ]
    },
    {
        title: "0-1",
        key: "0-1",
        children: [
            {title: "0-1-0-0", key: "0-1-0-0"},
            {title: "0-1-0-1", key: "0-1-0-1"},
            {title: "0-1-0-2", key: "0-1-0-2"}
        ]
    },
    {
        title: "0-2",
        key: "0-2"
    }
];

const idata = {
    "1315967331419029506": {
        "path": "/1315967329586118657/1315967331419029506",
        "exclude": {},
        "pathArr": ["1315967329586118657", "1315967331419029506"]
    },
    "1315966651824340994": {"path": "/1315966651824340994", "exclude": {}, "pathArr": ["1315966651824340994"]},
    "1315975706382958593": {"path": "/1315975706382958593", "exclude": {}},
    "1315975308268011522": {"path": "/1315975308268011522", "exclude": {}}
};
const idata2: any = {
    "1315967331419029506": {
        "path": "/1315967329586118657/1315967331419029506",
        "exclude": {}
    },
    "1315966651824340994": {
        "path": "/1315966651824340994",
        "exclude": {}
    }
};
const index: FunctionComponent<Props> = (props) => {
    const [checkedKeys, setCheckedKeys] = React.useState<string[]>(["102000"]);// ["102000"]
    const [refresh, setRefresh] = React.useState(0);
    const [requestP, setRequestP] = React.useState<any>({
        url: "http://192.168.7.27:8998/esc-idm/idt/org/listOrgTree",
        params: {page: 1, size: 3, id: "", hasSelected: 1, jobInclude: 0},
        ctx: "esc-idm",
        method: "post"
    });
    const [id, setid] = React.useState(idata);

    const requestCallback = (data: any, cb: Function) => {
        console.log("data", data);
        cb(data.data.list);
    };
    const tr = React.useMemo(() => {
        return (
            <RequestTree
                request={requestP}
                size={3}
                requestCallback={(data: any, cb: Function) => {
                    cb(data.data.list);
                }}
                checkStrictly={!false}
                defaultCheckInheritData={id}
                defaultDisabledKeys={["1315975706382958593"]}
                checkInherit={true}
                onCheckInherit={(e) => console.log("aaa", JSON.stringify(e))}
                parent={"id"}
                replaceFields={{key: "id", title: "name"}}
                showArrow={true}
                refresh={refresh}
                checkable={true}
                search={true}
                root={true}
                key={Math.random()}
                searchOptions={{
                    placeholder: "sousuo",
                    options: [{key: "searchKey", value: ""}]
                }}
            />
        );
    }, [id]);

    const click1 = () => {
        console.log(idata);
        setid(idata);
    };
    const click2 = () => {
        console.log(idata2);
        setid(idata2);
    };
    return (
        <Fragment>
            {tr}
            <button onClick={click1}>btn1</button>
            <button onClick={click2}>btn2</button>
            {/*<hr/>
            <CheckBoxTree
                request={{
                    url: "http://192.168.7.27:8998/esc-idm/idt/user/list",
                    params: {page: 1, size: 3},
                    // params: {page: 1, size: 3},
                    ctx: "esc-idm",
                    method: "post"
                }}
                size={3}
                refresh={refresh}
                requestCallback={requestCallback}
                checkStrictly={true}
                replaceFields={{key: "idt_user_type__id", title: "idt_org__name"}}
                checkable={true}
                search={true}
                checkedKeys={checkedKeys}
                searchOptions={{
                    placeholder: "请输入搜索关键词",
                    options: [
                        {key: "searchKey", value: "搜索关键词"}
                    ]
                }}
                onChange={(checkKeys: any) => {
                    console.log("======>checkKeys", checkKeys);
                    setCheckedKeys(checkKeys);
                }}
            />

            <hr/>

            <ParaTree
                treeData={treeData}
                checkable={true}
                showArrow={true}
                defaultExpandedKeys={["0-0"]}
            />*/}
        </Fragment>

    );
};

export default index;
