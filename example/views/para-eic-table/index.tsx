import React, {FunctionComponent} from "react";
import {ParaEicTable} from "../../../src/index";

interface OwnProps {
}

type Props = OwnProps;

// mock穿梭框数据
const mockData = [
    {
        "idt_user_type__name": "qq11",
        "idt_user_type__remark": "",
        "idt_user_type__id": "1298108201102737410",
        "idt_user_type__code": "qq11"
    },
    {
        "idt_user_type__name": "qq",
        "idt_user_type__remark": "qq",
        "idt_user_type__id": "1298108106894475265",
        "idt_user_type__code": "qq"
    },
    {
        "idt_user_type__name": "11",
        "idt_user_type__remark": "11",
        "idt_user_type__id": "1298107939004874754",
        "idt_user_type__code": "11"
    },
    {
        "idt_user_type__name": "a23",
        "idt_user_type__remark": "",
        "idt_user_type__id": "1280054367931596802",
        "idt_user_type__code": "a21"
    },
    {
        "idt_user_type__name": "a1",
        "idt_user_type__remark": "",
        "idt_user_type__id": "1280054319856484354",
        "idt_user_type__code": "a2"
    },
    {
        "idt_user_type__name": "13",
        "idt_user_type__remark": "1221",
        "idt_user_type__id": "1280054298327121921",
        "idt_user_type__code": "212121"
    },
    {
        "idt_user_type__name": "asf13ads",
        "idt_user_type__remark": "",
        "idt_user_type__id": "1280054274352480258",
        "idt_user_type__code": "123qwe"
    },
    {
        "idt_user_type__name": "a2211223asd`",
        "idt_user_type__remark": "",
        "idt_user_type__id": "1280054238965137410",
        "idt_user_type__code": "31`12`1`122`1"
    },
    {
        "idt_user_type__name": "21131212121",
        "idt_user_type__remark": "",
        "idt_user_type__id": "1280054195738640385",
        "idt_user_type__code": "1311312121"
    },
    {
        "idt_user_type__name": "adfasf`131313",
        "idt_user_type__remark": "",
        "idt_user_type__id": "1280054165472542722",
        "idt_user_type__code": "2121"
    },
    {
        "idt_user_type__name": "asfasdf",
        "idt_user_type__remark": "asdfasdf",
        "idt_user_type__id": "1280054136322129921",
        "idt_user_type__code": "fasdf"
    },
    {
        "idt_user_type__name": "12321",
        "idt_user_type__remark": "3123123",
        "idt_user_type__id": "1280054113215709186",
        "idt_user_type__code": "312312"
    },
    {
        "idt_user_type__name": "应届生",
        "idt_user_type__remark": "1112",
        "idt_user_type__id": "1271337241544753153",
        "idt_user_type__code": "1112"
    },
    {
        "idt_user_type__name": "12121212",
        "idt_user_type__remark": "",
        "idt_user_type__id": "1268067636449640450",
        "idt_user_type__code": "1212"
    },
    {
        "idt_user_type__name": "实习生",
        "idt_user_type__remark": "",
        "idt_user_type__id": "1261551465122496514",
        "idt_user_type__code": "10002"
    },
    {
        "idt_user_type__name": "正式员工",
        "idt_user_type__remark": "",
        "idt_user_type__id": "1261551419941453826",
        "idt_user_type__code": "10001"
    },
    {
        "idt_user_type__name": "qq11",
        "idt_user_type__remark": "",
        "idt_user_type__id": "1298108201102737410",
        "idt_user_type__code": "qq11"
    },
    {
        "idt_user_type__name": "qq",
        "idt_user_type__remark": "qq",
        "idt_user_type__id": "1298108106894475265",
        "idt_user_type__code": "qq"
    },
    {
        "idt_user_type__name": "11",
        "idt_user_type__remark": "11",
        "idt_user_type__id": "1298107939004874754",
        "idt_user_type__code": "11"
    },
    {
        "idt_user_type__name": "a23",
        "idt_user_type__remark": "",
        "idt_user_type__id": "1280054367931596802",
        "idt_user_type__code": "a21"
    },
    {
        "idt_user_type__name": "a1",
        "idt_user_type__remark": "",
        "idt_user_type__id": "1280054319856484354",
        "idt_user_type__code": "a2"
    },
    {
        "idt_user_type__name": "13",
        "idt_user_type__remark": "1221",
        "idt_user_type__id": "1280054298327121921",
        "idt_user_type__code": "212121"
    },
    {
        "idt_user_type__name": "asf13ads",
        "idt_user_type__remark": "",
        "idt_user_type__id": "1280054274352480258",
        "idt_user_type__code": "123qwe"
    },
    {
        "idt_user_type__name": "a2211223asd`",
        "idt_user_type__remark": "",
        "idt_user_type__id": "1280054238965137410",
        "idt_user_type__code": "31`12`1`122`1"
    },
    {
        "idt_user_type__name": "21131212121",
        "idt_user_type__remark": "",
        "idt_user_type__id": "1280054195738640385",
        "idt_user_type__code": "1311312121"
    },
    {
        "idt_user_type__name": "adfasf`131313",
        "idt_user_type__remark": "",
        "idt_user_type__id": "1280054165472542722",
        "idt_user_type__code": "2121"
    },
    {
        "idt_user_type__name": "asfasdf",
        "idt_user_type__remark": "asdfasdf",
        "idt_user_type__id": "1280054136322129921",
        "idt_user_type__code": "fasdf"
    },
    {
        "idt_user_type__name": "12321",
        "idt_user_type__remark": "3123123",
        "idt_user_type__id": "1280054113215709186",
        "idt_user_type__code": "312312"
    },
    {
        "idt_user_type__name": "应届生",
        "idt_user_type__remark": "1112",
        "idt_user_type__id": "1271337241544753153",
        "idt_user_type__code": "1112"
    },
    {
        "idt_user_type__name": "12121212",
        "idt_user_type__remark": "",
        "idt_user_type__id": "1268067636449640450",
        "idt_user_type__code": "1212"
    },
    {
        "idt_user_type__name": "实习生",
        "idt_user_type__remark": "",
        "idt_user_type__id": "1261551465122496514",
        "idt_user_type__code": "10002"
    },
    {
        "idt_user_type__name": "正式员工",
        "idt_user_type__remark": "",
        "idt_user_type__id": "1261551419941453826",
        "idt_user_type__code": "10001"
    },{
        "idt_user_type__name": "qq11",
        "idt_user_type__remark": "",
        "idt_user_type__id": "1298108201102737410",
        "idt_user_type__code": "qq11"
    },
    {
        "idt_user_type__name": "qq",
        "idt_user_type__remark": "qq",
        "idt_user_type__id": "1298108106894475265",
        "idt_user_type__code": "qq"
    },
    {
        "idt_user_type__name": "11",
        "idt_user_type__remark": "11",
        "idt_user_type__id": "1298107939004874754",
        "idt_user_type__code": "11"
    },
    {
        "idt_user_type__name": "a23",
        "idt_user_type__remark": "",
        "idt_user_type__id": "1280054367931596802",
        "idt_user_type__code": "a21"
    },
    {
        "idt_user_type__name": "a1",
        "idt_user_type__remark": "",
        "idt_user_type__id": "1280054319856484354",
        "idt_user_type__code": "a2"
    },
    {
        "idt_user_type__name": "13",
        "idt_user_type__remark": "1221",
        "idt_user_type__id": "1280054298327121921",
        "idt_user_type__code": "212121"
    },
    {
        "idt_user_type__name": "asf13ads",
        "idt_user_type__remark": "",
        "idt_user_type__id": "1280054274352480258",
        "idt_user_type__code": "123qwe"
    },
    {
        "idt_user_type__name": "a2211223asd`",
        "idt_user_type__remark": "",
        "idt_user_type__id": "1280054238965137410",
        "idt_user_type__code": "31`12`1`122`1"
    },
    {
        "idt_user_type__name": "21131212121",
        "idt_user_type__remark": "",
        "idt_user_type__id": "1280054195738640385",
        "idt_user_type__code": "1311312121"
    },
    {
        "idt_user_type__name": "adfasf`131313",
        "idt_user_type__remark": "",
        "idt_user_type__id": "1280054165472542722",
        "idt_user_type__code": "2121"
    },
    {
        "idt_user_type__name": "asfasdf",
        "idt_user_type__remark": "asdfasdf",
        "idt_user_type__id": "1280054136322129921",
        "idt_user_type__code": "fasdf"
    },
    {
        "idt_user_type__name": "12321",
        "idt_user_type__remark": "3123123",
        "idt_user_type__id": "1280054113215709186",
        "idt_user_type__code": "312312"
    },
    {
        "idt_user_type__name": "应届生",
        "idt_user_type__remark": "1112",
        "idt_user_type__id": "1271337241544753153",
        "idt_user_type__code": "1112"
    },
    {
        "idt_user_type__name": "12121212",
        "idt_user_type__remark": "",
        "idt_user_type__id": "1268067636449640450",
        "idt_user_type__code": "1212"
    },
    {
        "idt_user_type__name": "实习生",
        "idt_user_type__remark": "",
        "idt_user_type__id": "1261551465122496514",
        "idt_user_type__code": "10002"
    },
    {
        "idt_user_type__name": "正式员工",
        "idt_user_type__remark": "",
        "idt_user_type__id": "1261551419941453826",
        "idt_user_type__code": "10001"
    }
];
const headData = [
    {
        "columnName": "idt_user_type__name",
        "columnDisplayName": "用户类型名称"
    },
    {
        "columnName": "idt_user_type__code",
        "columnDisplayName": "编码"
    },
    {
        "columnName": "idt_user_type__remark",
        "columnDisplayName": "描述"
    },
    {
        "columnName": "idt_user_type__id",
        "columnDisplayName": "主键"
    }
];
const index: FunctionComponent<Props> = (props) => {
    const [localData, setLocalData] = React.useState<any[]>([]); // 穿梭框数据

    return (
        <div>
            <ParaEicTable
                check={true}
                localData={localData}
                localHeaderData={headData}
                rowKey={"idt_user_type__id"}
                headerRowTitleKey={"columnName"}
                headerTitleKey={"columnDisplayName"}

            />
        </div>
    );
};

export default index;
