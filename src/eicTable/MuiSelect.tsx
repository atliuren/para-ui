import React, {Fragment, useState, useRef, FunctionComponent} from "react";
import {
    Button,
    Checkbox,
    FormControlLabel,
    Menu,
    MenuItem
} from "@material-ui/core";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import "./styles.less";

/*
    label 显示文字
    onChange //选值发生改变传值
    options //已选所有能选的列表
    value //列表
*/

interface MultiSelectCfg {
    label: string;
    onChange?: Function;
    options: Array<any>;
    selectKey: string;
    titleKey: string;
    value: Array<any>;
}

const MultiSelect: FunctionComponent<MultiSelectCfg> = (props) => {
    const {label, options, value, onChange, selectKey, titleKey} = props;
    const anchorRef = useRef(null);
    const [openMenu, setOpenMenu] = useState(false);
    const [refMenu, setRefMenu] = useState<any>();
    const valueJdObj = useRef<any>({});
    const selValue = useRef<any>(value);
    const handleMenuOpen = () => {
        setRefMenu(Math.random());
        setOpenMenu(true);
    };
    const handleMenuClose = () => {
        setOpenMenu(false);
    };
    React.useEffect(() => {
        const jdObj: any = {};
        options.forEach(item => {
            jdObj[item[selectKey]] = item;
        });
        valueJdObj.current = jdObj;
    }, [options]);
    React.useEffect(() => {
        selValue.current = value;
    }, [value]);
    // React.useEffect(() => {
    //     selValue.current = value;
    // }, []);
    const handleOptionToggle = (event: any) => {
        let newValue = [...selValue.current];
        if (event.target.checked) {
            newValue.push(valueJdObj.current[event.target.value]);
        } else {
            newValue = newValue.filter(
                item => item[selectKey] !== event.target.value
            );
        }
        // setSelValue(newValue);
        //排序；
        newValue.sort((item1: any, item2: any) => item1.order - item2.order);
        selValue.current = newValue;
        //传出选中的头部列表
        onChange && onChange(newValue);
    };
    const menuItemMemo = React.useMemo(() => {
        return options.map((option: any) => {
            return <MenuItem
                className="eic-table-menuItem"
                key={option[selectKey]}
                style={{height: "30px"}}
            >
                <FormControlLabel
                    className="eic-table-formControlLabel"
                    control={
                        <Checkbox
                            className="eic-table-formControlCheck"
                            defaultChecked={
                                selValue.current.filter((item: any) =>
                                    item[selectKey] === option[selectKey]
                                ).length > 0
                            }
                            color="primary"
                            onClick={handleOptionToggle}
                            value={option[selectKey]}
                        />
                    }
                    label={option[titleKey]}
                />
            </MenuItem>;
        });
    }, [options, refMenu]);
    return (
        <Fragment>
            <Button className="eic-table-eicMultiSelectRoot" onClick={handleMenuOpen} ref={anchorRef}>
                {label}
                <ArrowDropDownIcon/>
            </Button>
            <Menu
                anchorEl={anchorRef.current}
                onClose={handleMenuClose}
                open={openMenu}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "left"
                }}
                // eslint-disable-next-line react/jsx-sort-props
                PaperProps={{style: {minWidth: "150px", marginTop: "45px", maxHeight: "300px"}}}
            >
                {menuItemMemo}
            </Menu>
        </Fragment>
    );
};

export default MultiSelect;
