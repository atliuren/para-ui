import React, {FunctionComponent} from "react";
import {ParaTransfer} from "../../../src/index";

interface OwnProps {
}

type Props = OwnProps;

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
const index: FunctionComponent<Props> = (props) => {
    const [dataSource, setDataSource] = React.useState<any[]>(mockTransferData()); // 穿梭框数据

    return (
        <div>
            <ParaTransfer value={dataSource}
                          search={true}
                          sortable={true}
                          checked={true}
                          defaultChecked={[1,2,3]}
                          disabledKeys={[9,10]}
                          replaceFields={{key: "id", title: "displayName"}}
                          onChange={(arr, data) => {
                              // console.log(arr, data);
                          }}/>
        </div>
    );
};

export default index;
