import React from "react";
import useRCNotification from "rc-notification/lib/useNotification";
import {
    NotificationInstance as RCNotificationInstance,
    NoticeContent as RCNoticeContent,
    HolderReadyCallback as RCHolderReadyCallback,
} from "rc-notification/lib/Notification";
import {NotificationInstance, ArgsPropsNotifacation} from "..";
import {getPrefixCls} from "../../utils/prefix";

export default function createUseNotification(
    getNotificationInstance: (
        args: ArgsPropsNotifacation,
        callback: (info: { prefixCls: string; instance: RCNotificationInstance }) => void,
    ) => void,
    getRCNoticeProps: (args: ArgsPropsNotifacation, prefixCls: string) => RCNoticeContent,
) {
    const useNotification = (): [NotificationInstance, React.ReactElement] => {
        let innerInstance: RCNotificationInstance | null = null;
        const proxy = {
            add: (noticeProps: RCNoticeContent, holderCallback?: RCHolderReadyCallback) => {
                innerInstance?.component.add(noticeProps, holderCallback);
            },
        } as any;

        const [hookNotify, holder] = useRCNotification(proxy);

        function notify(args: ArgsPropsNotifacation) {
            const {prefixCls: customizePrefixCls} = args;

            const mergedPrefixCls = getPrefixCls("notification", customizePrefixCls);

            getNotificationInstance(
                {
                    ...args,
                    prefixCls: mergedPrefixCls,
                },
                ({prefixCls, instance}) => {
                    innerInstance = instance;
                    hookNotify(getRCNoticeProps(args, prefixCls));
                },
            );
        }

        // Fill functions
        const hookAPI: any = {
            open: notify,
        };
        ["success", "info", "warning", "error"].forEach(type => {
            hookAPI[type] = (args: ArgsPropsNotifacation) =>
                hookAPI.open({...args, type});
        });

        return [
            hookAPI,
            <React.Fragment key="holder">
                {() => {
                    // console.log("context", context);
                    return holder;
                }}
            </React.Fragment>,
        ];
    };

    return useNotification;
}
