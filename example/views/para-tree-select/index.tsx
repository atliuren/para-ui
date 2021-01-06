import React, {Fragment, FunctionComponent} from "react";
import {ParaTreeSelect} from "../../../src/index";

interface OwnProps {
}

type Props = OwnProps;

const index: FunctionComponent<Props> = (props) => {
    const [checkedKeys, setCheckedKeys] = React.useState<string[]>(["102000"]);// ["102000"]
    const [checkedKeysLabels, setCheckedKeysLabels] = React.useState<string[]>(["根路径"]); //["根路径"]
    const [checkedKeys2, setCheckedKeys2] = React.useState<string[]>(["1267635215073804289"]); // "1000000000000000001" 根路径
    const [checkedLabels2, setCheckedLabels2] = React.useState<string[]>(["确认bug167131"]); // "1000000000000000001" 根路径
    return (
        <Fragment>
            <ParaTreeSelect
                request={{
                    url: "http://192.168.7.27:8998/esc-idm/idt/org/listOrgTree",
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

            <hr/>

            <ParaTreeSelect
                style={{margin: "40px"}}
                request={{
                    url: "http://192.168.7.27:8998/esc-idm/idt/user/list",
                    params: {page: 1, size: 1, columns: "idt_user__id,idt_user__uid"},
                    ctx: "esc-idm",
                    method: "post"
                }}
                size={1}
                replaceFields={{key: "idt_user__id", title: "idt_user__uid"}}
                showArrow={false}
                value={checkedKeys}
                checkStrictly={false}
                valueLabel={checkedKeysLabels}
                autoClose={true}
                disabled={false}
                onChange={(keys: any, keyNodes: any) => {
                    console.log("外部OnChange1", keys, keyNodes);
                    setCheckedKeys(keys);
                    setCheckedKeysLabels(keyNodes);
                }}/>
        </Fragment>

    );
};

export default index;
