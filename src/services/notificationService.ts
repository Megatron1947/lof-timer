import {isPermissionGranted, requestPermission, sendNotification} from '@tauri-apps/plugin-notification'

export const sendSystemNotification = async (title: string, body: string) => {
    try {
        let permissionGranted = await isPermissionGranted()

        if (!permissionGranted) {
            const permission = await requestPermission()
            permissionGranted = permission === 'granted'
        }

        if (permissionGranted) {
            sendNotification({title, body})
        }
    } catch (error) {
        console.error('[notificationService] 发送系统通知失败:', error)
    }
}
