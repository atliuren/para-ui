/******************************************/
/* author: 陈夕                            */
/* time: 2020年08月13日11:21:11            */
/* description: 表格头操作按钮               */
/******************************************/
import React, {FunctionComponent} from "react";
import clsx from "clsx";
import Toolbar from "@material-ui/core/Toolbar";
import Icon from "@material-ui/core/Icon";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";

export interface ParaTableActionInterface {
    icon?: string | Function | any;
    tooltip?: string;
    onClick?: Function;
    disabled?: boolean;
    align?: "left" | "right";
    iconProps?: object;
}

interface PTableActionsProps {
    className?: string;
    actions?: ParaTableActionInterface[]
}

const PTableActions: FunctionComponent<PTableActionsProps> = (props) => {
    const {className, actions} = props;
    if (!actions) return null;

    const handleOnClick = (event: any, data: ParaTableActionInterface) => {
        if (data.onClick) {
            data.onClick(event, data);
            event.stopPropagation();
        }
    };

    const renderIcons = (action: ParaTableActionInterface) => {
        if (typeof action.icon === "string") {
            return (<Icon {...action.iconProps}>{action.icon}</Icon>);
        } else if (typeof action.icon === "function") {
            return action.icon({...action.iconProps, disabled: action.disabled});
        } else {
            return <action.icon/>;
        }
    };

    const renderButton = (action: ParaTableActionInterface) => {
        return (
            <IconButton
                size="small"
                color="inherit"
                disabled={action.disabled}
                onClick={(event) => handleOnClick(event, action)}
            >
                {renderIcons(action)}
            </IconButton>
        );
    };
    const renderToolTip = (action: ParaTableActionInterface) => {
        if (action.tooltip) {
            return (
                <Tooltip title={action.tooltip}>
                    <span>{renderButton(action)}</span>
                </Tooltip>
            )
        } else {
            return renderButton(action);
        }
    };
    const renderToolBar = (data: ParaTableActionInterface[]) => {
        return data.map((item: ParaTableActionInterface, index: number) => {
            if (item.align && item.align === "left") {
                return (
                    <div key={index} className={"para-table-actions-left"}>
                        {renderToolTip(item)}
                    </div>
                );
            } else {
                return (
                    <div key={index} className={"para-table-actions-right"}>
                        {renderToolTip(item)}
                    </div>
                );
            }
        });
    };

    return (
        <div className={clsx(className, "para-table-header")}>
            <Toolbar className={"para-table-header-toolbar"}>
                {renderToolBar(actions)}
            </Toolbar>
        </div>
    );
};

export default PTableActions;
