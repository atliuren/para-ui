// @ts-nocheck
import React, {FunctionComponent, useEffect} from "react";
import {ParaUIStyleProvider, whiteTheme} from "../providers";
import {ThemeProvider} from "@material-ui/core/styles";
import Cascader, {CascaderOption, CascaderValueType} from '../cascade';

/**
 * huangxi 2020/7/17 15:58
 * desc:
 * @params showArea  true: 省市区 false：省市
 * @params inputValue 显示已选择的数据
 * @params dataSource 渲染的数据源
 * @params key 数据的起点-从哪里开始选择 省、市、区
 **/
export interface AreaLinkageProps {
    showArea?: boolean, // true: 省市区 false：省市
    inputValue?: string, // 显示已选择的数据
    onChange?: (value, selectOptions) => void;
    dataSource: object;
    key?: string;
}

const ParaAreaLinkage: FunctionComponent<AreaLinkageProps> = (props) => {
    let {
        showArea = true,
        value,
        theme = whiteTheme,
        dataSource,
        key
    } = props;

    const [areaData, setAreaData] = React.useState([]);

    if (!dataSource) {
        throw Error("请传入dataSource渲染的数据");
    }

    const initAreaData = () => {
        const province = dataSource[key ? key : '86'];
        let _province = [], _city = [], _area = [];
        Object.keys(province).forEach(key => {
            // 获取所有省
            _province.push({label: province[key], value: key, children: []})
            // 获取城市
            const city = dataSource[key];
            Object.keys(city).forEach(key2 => {
                showArea ? _city.push({label: city[key2], value: key2, pid: key, children: []}) :
                    _city.push({label: city[key2], value: key2, pid: key})

                if (showArea) {
                    // 获取地区
                    const area = dataSource[key2];
                    Object.keys(area).forEach(key3 => {
                        _area.push({label: area[key3], value: key3, pid: key2})
                    })
                }
            })
        })
        // 是否需要区级
        if (showArea) {
            _city.forEach(c => {
                _area.forEach(a => {
                    if (a.pid === c.value) {
                        c.children.push({
                            label: a.label,
                            value: a.value
                        })
                    }
                })
            })
        }
        _province.forEach(p => {
            _city.forEach(c => {
                if (c.pid === p.value) {
                    p.children.push({
                        label: c.label,
                        value: c.value,
                        children: c.children
                    })
                }
            })
        })
        setAreaData(_province)
    }

    // 初始化数据
    useEffect(() => {
        initAreaData();
    }, [])

    return (
        <ThemeProvider theme={theme}>
            <ParaUIStyleProvider prefix={"para-ui-areaLinkage"}>
                <Cascader {...props} options={areaData}/>
            </ParaUIStyleProvider>
        </ThemeProvider>
    );
};

export default ParaAreaLinkage;
export {
    ParaAreaLinkage
};
