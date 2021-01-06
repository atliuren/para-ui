import React, {FunctionComponent} from "react";
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";
import ClearIcon from "@material-ui/icons/Clear";
import Popover from "@material-ui/core/Popover";
import whiteTheme from "../providers/themeProvider";
import {ThemeProvider} from "@material-ui/core/styles";
import {ParaUIStyleProvider} from "../providers";
import clsx from "clsx";
import RefreshIcon from "@material-ui/icons/Refresh";

interface SearchBarOptionsProps {
    key: string | number;
    value: string | number;
}

interface SearchOptionsInterface {
    placeholder?: string; // 提示语
    className?: string; // 自定义class名字
    options?: SearchBarOptionsProps[]; // 配置搜索框的前缀
    value?: SearchBarOptionsProps[]; // 传入值
    onChange?: Function; // 返回值/事件
    onClose?: Function; // 关闭事件
    refresh?: boolean;
}

const SearchBar: FunctionComponent<SearchOptionsInterface> = (props) => {
        let {
            placeholder = "请输入",
            options = [],
            value,
            onChange,
            className,
            onClose,
            refresh = true
        } = props;
        if (value) options = value; // 如果有默认值，设置初始值

        const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

        const [state, setState] = React.useState<any>(null);
        const [keywords, setKeywords] = React.useState<string>("");

        const handleClickListItem = (event: React.MouseEvent<HTMLElement>) => {
            setAnchorEl(event.currentTarget);
        };

        const handleMenuItemClick = (_: any, value: SearchBarOptionsProps) => {
            setState(value);
            setAnchorEl(null);
        };
        /* 关闭 */
        const handleClose = () => {
            setAnchorEl(null);
        };
        const open = Boolean(anchorEl);
        const id = open ? "para-ui-searchbar" : undefined;
        /* 搜索函数 */
        const searchHandler = () => {
            if (!state) {
                if (options.length > 0) {
                    const temp = options[0];
                    const tempValue = Object.assign({}, temp, {keywords});
                    if (onChange && typeof onChange === "function") onChange(tempValue);
                } else {
                    console.warn("未传入的搜索参数,将使用默认值");
                    const tempValue = Object.assign({}, {keywords});
                    if (onChange && typeof onChange === "function") onChange(tempValue);
                }
            } else {
                const tempValue = Object.assign({}, state, {keywords});
                if (onChange && typeof onChange === "function") onChange(tempValue);
            }
        };
        const searchKeyboard = (event: any) => {
            if (event.keyCode === 13) {
                searchHandler();
            }
        };
        /**
         * 陈夕 2020/8/12 上午11:24
         * desc: 去除搜索的空格
         * @params
         **/
        const setKeywordsHandler = (event: any) => {
            let keys = event.target.value as string;
            keys = keys.trim();
            setKeywords(keys);
        };
        const refreshHandler = () => searchHandler();

        const renderLeftButton = () => {
            if (refresh) {
                return (
                    <IconButton color="primary" className={"para-searchbar-icon-button"} onClick={refreshHandler}>
                        <RefreshIcon/>
                    </IconButton>
                );
            } else if (options.length > 0) {
                return (
                    <div className={"para-searchbar-paper"}>
                        {
                            state
                                ? (<Button onClick={handleClickListItem}>{state.value}</Button>)
                                : (<IconButton className={"para-searchbar-icon-button"}
                                               onClick={handleClickListItem}>
                                    <MenuIcon/>
                                </IconButton>)
                        }
                        <Popover
                            anchorOrigin={{vertical: "bottom", horizontal: "center"}}
                            transformOrigin={{vertical: "top", horizontal: "center"}}
                            id={id}
                            open={open}
                            anchorEl={anchorEl}
                            onClose={handleClose}
                        >
                            {options.map((option: SearchBarOptionsProps, index) => (
                                <Button
                                    key={index}
                                    color={(state && option.key === state.key) ? "primary" : "default"}
                                    onClick={(event) => handleMenuItemClick(event, option)}>
                                    {option.value}
                                </Button>
                            ))}
                        </Popover>
                    </div>
                );
            }
            return null;
        };

        const renderCloseButton = () => {
            if (keywords) {
                return (
                    <IconButton className={"para-searchbar-icon-button"}
                                aria-label="close"
                                onClick={() => {
                                    if (keywords) setKeywords("");
                                    if (onClose && typeof onClose === "function") onClose();
                                }}
                    >
                        <ClearIcon/>
                    </IconButton>
                );
            } else {
                return null;
            }
        };

        return (
            <ThemeProvider theme={whiteTheme}>
                <ParaUIStyleProvider prefix={"para-ui-searchbar"}>
                    <Paper variant="outlined" className={clsx(className, "para-searchbar-root")}>
                        {renderLeftButton()}
                        <InputBase
                            className={"para-searchbar-input"}
                            placeholder={placeholder}
                            inputProps={{"aria-label": `${placeholder}`}} value={keywords}
                            onChange={setKeywordsHandler}
                            onKeyUp={searchKeyboard}
                        />
                        {renderCloseButton()}
                        <Divider className={"para-searchbar-divider"} orientation="vertical"/>
                        <IconButton color="primary"
                                    className={"para-searchbar-icon-button"}
                                    aria-label="search"
                                    onClick={searchHandler}
                        >
                            <SearchIcon/>
                        </IconButton>
                    </Paper>
                </ParaUIStyleProvider>
            </ThemeProvider>
        );
    }
;

export default SearchBar;
export {
    SearchBar,
    SearchOptionsInterface,
    SearchBarOptionsProps
};
