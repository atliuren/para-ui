export const getPrefixCls = (suffixCls: string, customizePrefixCls?: string) => {
    if (customizePrefixCls) return customizePrefixCls;

    return `para-${suffixCls}`;
};

export const browserLanguage = () => window.navigator.language;