//@ts-nocheck
import "react-app-polyfill/ie11";
import * as React from "react";
import * as ReactDOM from "react-dom";
import Paper from "@material-ui/core/Paper";
import {observer} from "mobx-react";
import {useStores} from "./hook/useStores";
import Button from "@material-ui/core/Button";
import Switch from "@material-ui/core/Switch";
import Grid from "@material-ui/core/Grid";
import {Debugger} from "para-lib";
import * as ParaUI from "../src";
import {ReactSortable} from "react-sortablejs";

console.log(ParaUI);

const defs = {};
const threes = (): any[] => [
    {id: Math.random(), name: "shrek", ...defs},
    {id: Math.random(), name: "fiona", ...defs},
    {id: Math.random(), name: "donkey", ...defs, selected: true, filtered: true},
    {id: Math.random(), name: "Lord Faarquad", ...defs}
];

const threes1 = (): any[] => [
    {id: Math.random(), name: "shrek1111", ...defs},
    {id: Math.random(), name: "fiona1111", ...defs},
    {id: Math.random(), name: "donkey1111", ...defs, selected: true, filtered: true},
    {id: Math.random(), name: "Lord Faarquad1111", ...defs}
];

interface Window {

}

export const Counter = observer(() => {
    const {counterStore} = useStores();

    return (
        <>
            <div>{counterStore.count}</div>
            <button onClick={() => counterStore.increment()}>++</button>
            <button onClick={() => counterStore.decrement()}>--</button>
        </>
    );
});

export const ThemeToggler = observer(() => {
    const {themeStore} = useStores();

    return (
        <>
            <div>{themeStore.theme}</div>
            <button onClick={() => themeStore.setTheme("light")}>
                set theme: light
            </button>
            <button onClick={() => themeStore.setTheme("dark")}>
                set theme: dark
            </button>
        </>
    );
});
const init = async () => {
    await Debugger.init(["http://192.168.2.241:10000"]);
    ReactDOM.render(<App/>, document.getElementById("root"));
};
init();
const App = () => {
    const [state, setState] = React.useState(0);
    const [refresh, setRefresh] = React.useState(0);
    const [a, seta] = React.useState(["1000000000"]);
    const [b, setb] = React.useState(["paraview123"]);
    const {
        ParaTree,
        ParaUpload,
        ParaCropper,
        ParaEditor,
        ParaMultinput,
        RequestTree,
        ParaShadow,
        ParaColor,
        ParaTreeSelect,
        ParaMessage: message,
        ParaNotice: notice,
        ParaModal,
        ParaSkeleton,
        ParaCascade,
        ParaAreaLinkage,
        ParaTransfer,
    } = ParaUI;
    const requestCallback = (data: any, cb: Function) => {
        cb(data.data.list);
    };
    const [color, setColor] = React.useState("#fff");

    const [requestP, setRequestP] = React.useState<any>({
        url: "http://192.168.2.241:9086/esc-idm/idt/org/listOrgTree",
        params: {page: 1, size: 3, id: "", hasSelected: 1, jobInclude: 0},
        ctx: "esc-idm",
        method: "post"
    });

    const handleChangeComplete = (color, event) => {
        setColor(color.hex);
    };

    const [switchus, setSwitchus] = React.useState(true);

    const [list1, setList1] = React.useState(threes);
    const [list2, setList2] = React.useState(threes1);

    const changeTreeSelect = (value: any, valueLabel: any) => {
        console.log(value, valueLabel);
        seta(value);
        setb(valueLabel);
    };

    const success = () => {
        message.success("This is a success message");
    };

    const openNotificationWithIcon = type => {
        notice[type]({
            message: "Notification Title",
            duration: 10000,
            description:
                "This is the content of the notification. This is the content of the notification. This is the content of the notification."
        });
    };
    const openModal = () => {
        window.$ParaModal("chenxi", "你好",
            () => {
                console.log("onOk");
                window.$ParaModal("chenxi2", "nihao", () => true, () => true, {type: "info", width: "300px"});
            },
            () => {
                console.log("onCancel");
                return true;
            },
            {
                type: "success",
                width: "416px",
                okText: "hello",
                cancelText: "nihao"
            }
        );
    };

    // mock穿梭框数据
    const mockTransferData = () => {
        let dataSourceArr: any[] = [];
        for (let i = 0; i < 20; i++) {
            let obj: any = {
                displayName: "content" + i,
                title: "title" + i,
                id: i,
                icon: "https://himg.bdimg.com/sys/portraitn/item/a5bacab3caacb9ed30393130fc46"
            };
            dataSourceArr.push(obj);
        }
        return dataSourceArr;
    };

    const change1 = () => {
        seta(["1000000000", "asd"]);
        setb(["paraview123", "123"]);
    };

    // const [checkedKeys, setCheckedKeys] = React.useState<string[]>(["102000", "102007"]);
    const [checkedKeys, setCheckedKeys] = React.useState<string[]>([]);// ["102000"]
    const [checkedKeysLabels, setCheckedKeysLabels] = React.useState<string[]>([]); //["根路径"]
    const [checkedKeys2, setCheckedKeys2] = React.useState<string[]>([]); // "1000000000000000001" 根路径
    const [checkedLabels2, setCheckedLabels2] = React.useState<string[]>([]); // "1000000000000000001" 根路径
    const [dataSource, setDataSource] = React.useState<any[]>(mockTransferData()); // 穿梭框数据


    // AreaLinkage
    const [selectedArea, setSelectArea] = React.useState("");
    const areaOnChange = (value, selectOptions) => {
        console.log(value);
        console.log(selectOptions);
        setSelectArea(selectOptions.map(o => o.label).join("/"));
    };

    return (
        <div className={"demo"}>
            <Grid container>
                <Grid item xs={12}>
                    <Paper>
                        <Button onClick={success}>success</Button>
                        <Button onClick={() => openNotificationWithIcon("success")}>notice</Button>
                        <Button onClick={openModal}>modal</Button>
                        <Switch checked={switchus} onChange={(event: any) => setSwitchus(event.target.checked)}/>
                        <Button onClick={() => setRefresh(Math.random())}>请求树刷新测试</Button>
                        <Button onClick={() => setRequestP({
                            url: "http://192.168.2.241:9086/esc-idm/idt/org/listOrgTree",
                            params: {page: 1, size: 5, id: ""},
                            ctx: "esc-idm"
                        })}>请求Request</Button>
                        <Button onClick={() => {
                            setCheckedKeys([]);
                            setCheckedKeysLabels([]);
                            setCheckedKeys2([]);
                            setCheckedLabels2([]);
                        }}>清空值</Button>
                        <Button onClick={() => {
                            setList2((prevState: any) => {
                                console.log(prevState);
                                prevState.forEach((item: any) => {
                                    item["checked"] = !item["checked"];
                                });
                                return prevState;
                            });
                        }}>变更值</Button>
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <ParaTreeSelect
                        style={{margin: "40px"}}
                        request={{
                            url: "http://192.168.2.241:9086/esc-idm/idt/user/list",
                            params: {page: 1, size: 1, columns: "idt_user__id,idt_user__uid"},
                            ctx: "esc-idm",
                            method: "post"
                        }}
                        size={1}
                        replaceFields={{key: "idt_user__id", title: "idt_user__uid"}}
                        showArrow={false}
                        value={checkedKeys}
                        checkStrictly={true}
                        valueLabel={checkedKeysLabels}
                        autoClose={true}
                        disabled={false}
                        onChange={(keys: any, keyNodes: any) => {
                            console.log("外部OnChange1", keys, keyNodes);
                            setCheckedKeys(keys);
                            setCheckedKeysLabels(keyNodes);
                        }}/>
                </Grid>

                <Grid item xs={6}>
                    <Paper>
                        <ParaTreeSelect
                            request={{
                                url: "http://192.168.2.241:9086/esc-idm/idt/org/listOrgTree",
                                ctx: "esc-idm",
                                params: {page: 1, size: 15, id: "", hasSelected: 1, jobInclude: 0},
                                method: "post"
                            }}
                            size={15}
                            parent={"id"}
                            checkStrictly={true}
                            replaceFields={{key: "id", title: "name"}}
                            showArrow={true}
                            value={checkedKeys2}
                            valueLabel={checkedLabels2}
                            noData={"显示为空"}
                            root={true}
                            autoClose={true}
                            onChange={(keys: any, keyNodes: any) => {
                                console.log("外部OnChange", keys, keyNodes);
                                setCheckedKeys2(keys);
                                setCheckedLabels2(keyNodes);
                            }}/>
                    </Paper>
                </Grid>
                {/*省市区*/}
                <Grid item xs={12}>
                    <Paper style={{margin: "20px"}}>
                        <ParaAreaLinkage showArea={true} inputValue={selectedArea} onChange={areaOnChange}/>
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <ReactSortable
                        list={list1}
                        setList={setList1}
                        animation={150}
                        group="shared-group-name"
                    >
                        {list1.map(item => (
                            <div className={"item-dragable"} key={item.id}>{item.name}</div>
                        ))}
                    </ReactSortable>
                    <ReactSortable
                        list={list2}
                        setList={setList2}
                        animation={150}
                        group="shared-group-name"
                    >
                        {list2.map(item => (
                            <div className={"item-dragable"} key={item.id}>{item.name}</div>
                        ))}
                    </ReactSortable>
                </Grid>
                <Grid item xs={12} style={{margin: "50px 20px"}}>
                    <ParaTransfer value={dataSource}
                                  search={true}
                                  sortable={true}
                                  checked={true}
                                  replaceFields={{key: "id", title: "displayName"}}
                                  onChange={(arr, data) => {
                                      console.log(arr, data);
                                  }}/>

                </Grid>
            </Grid>
            <Paper>

            </Paper>
            <Paper>

            </Paper>
            <Paper>
                组织树/Get请求
                <RequestTree
                    request={requestP}
                    size={3}
                    requestCallback={(data: any, cb: Function) => {
                        cb(data.data.list);
                    }}
                    checkStrictly={false}
                    parent={"id"}
                    replaceFields={{key: "id", title: "name"}}
                    showArrow={true}
                    refresh={refresh}
                    checkable={true}
                    search={true}
                    root={true}
                />
            </Paper>
            <Paper>
                <ParaUpload/>
            </Paper>
            <Paper>
                <ParaCropper/>
            </Paper>
            <Paper>
                <ParaEditor maxLength={3} onChange={(val) => {
                    console.log("val======>", val);
                }}/>
            </Paper>
            <Paper>
                <ParaMultinput
                    type='object'
                    replaceFields={{key: "id", value: "value"}}
                    label={{key: "chenxi", value: "xi"}}
                    value={[]}
                    disabled={false}
                    error={true}
                    helpText={"helpText Some feelings is error"}
                    defaultColumns={state}
                    width={300}
                    onChange={(value) => {
                        console.log("ParaMultinput:", value);
                    }}/>
            </Paper>
            <Paper>
                <ParaMultinput
                    label={{key: "chenxi"}}
                    value={["我你"]}
                    defaultColumns={3}
                    onChange={(value) => {
                        console.log("ParaMultString:", value);
                    }}/>
            </Paper>
            <Paper>
                <main>
                    <Counter/>
                    <ThemeToggler/>
                </main>
            </Paper>
            <Paper>
                <ParaShadow onChange={(val) => {
                    console.log(val);
                }}/>
            </Paper>
            <Paper>
                <ParaColor value={color} onChangeComplete={handleChangeComplete}/>
            </Paper>
            <Paper>
                <span onClick={change1}>lin</span>
                <div>
                    {/*<ParaTreeSelect url="http://192.168.2.241:81/osc/res/group/api/queryResGroupPageTree"*/}
                    {/*                ctx="osc"*/}
                    {/*                value={a}*/}
                    {/*                valueLabel={b}*/}
                    {/*                onChange={changeTreeSelect}*/}
                    {/*                showArrow={true}*/}
                    {/*                title="prName"/>*/}
                </div>
            </Paper>
            <ParaModal/>
            <ParaSkeleton loading={switchus} active avatar paragraph={{rows: 4}}>
                <div style={{width: "100%"}}>chenxi</div>
            </ParaSkeleton>
        </div>
    );
};
