import React from "react";
import Popover from "../views/para-popover";
import ParaHelp from "../views/para-help";
import ParaTransfer from "../views/para-transfer";
import ParaTreeSelect from "../views/para-tree-select";
import ParaMultinput from "../views/para-multinput";
import ParaDatePicker from "../views/para-date-picker";
import ParaTimePicker from "../views/para-time-picker";
import ParaTree from "../views/para-tree";
import ParaEditor from "../views/para-editor";
import ParaCropper from "../views/para-cropper";
import ParaModal from "../views/para-modal";
import ParaShadow from "../views/para-shadow";
import ParaArealinkage from "../views/para-arealinkage";
import ParaTable from "../views/para-table";
import ParaEmpty from "../views/para-empty";
import ParaEicTable from "../views/para-eic-table";

const route = [
    {
        title: "Empty 空",
        component: <ParaEmpty/>
    },
    {
        title: "Table 表格",
        component: <ParaTable/>
    },
    {
        title: "Popover 弹出框",
        component: <Popover/>
    },
    {
        title: "Help 提示框",
        component: <ParaHelp/>
    },
    {
        title: "Transfer 穿梭框",
        component: <ParaTransfer/>
    },
    {
        title: "TreeSelect 树选择器",
        component: <ParaTreeSelect/>
    },
    {
        title: "Multinput 多值输入框",
        component: <ParaMultinput/>
    },
    {
        title: "Date 日期选择器",
        component: <ParaDatePicker/>
    },
    {
        title: "Time 时间选择器",
        component: <ParaTimePicker/>
    },
    {
        title: "Tree 结构树",
        component: <ParaTree/>
    },
    {
        title: "ParaEditor 富文本编辑器",
        component: <ParaEditor/>
    },
    {
        title: "ParaCropper",
        component: <ParaCropper/>
    },
    {
        title: "ParaModal",
        component: <ParaModal/>
    },
    {
        title: "ParaShadow",
        component: <ParaShadow/>
    },
    {
        title: "AreaLinkage 城市选择器",
        component: <ParaArealinkage/>
    },
    {
        title: "Eic Table 表格",
        component: <ParaEicTable/>
    }
];

export {route};
