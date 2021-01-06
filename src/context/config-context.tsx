import React from "react";
/**
 * TODO
 * 陈夕 2020/7/7 上午11:29
 * desc: Context上下文
 * @params getPrefixCls 上下文
 * @params getPopupContainer弹出框的容器包裹
 * @params direction 位置，方位
 **/
export interface ConfigConsumerProps {
    getPrefixCls: (suffixCls: string, customizePrefixCls?: string) => string;
    getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
    direction?: "ltr" | "rtl";
}

export const ConfigContext = React.createContext<ConfigConsumerProps>({
    getPrefixCls: (suffixCls: string, customizePrefixCls?: string) => {
        if (customizePrefixCls) return customizePrefixCls;

        return suffixCls ? `para-${suffixCls}` : "para";
    },
});

export const ConfigConsumer = ConfigContext.Consumer;

export type SizeType = 'small' | 'middle' | 'large' | undefined;

export const SizeContext = React.createContext<SizeType>(undefined);

export interface SizeContextProps {
    size?: SizeType;
}

export const SizeContextProvider: React.FC<SizeContextProps> = ({ children, size }) => (
    <SizeContext.Consumer>
        {originSize => (
            <SizeContext.Provider value={size || originSize}>{children}</SizeContext.Provider>
        )}
    </SizeContext.Consumer>
);