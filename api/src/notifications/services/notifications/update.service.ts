import { BadRequestError, HttpStatus, UnAuthorizedError, logger, type Context } from "@/core"
import { AppMessages } from "@/core/common"
import { Notifications } from "@/notifications/models"
import type { FindNotificationsPayload } from "@/notifications/payload_interfaces"

 class UpdateNotifications {
    constructor(private readonly dbNotifications: typeof Notifications) {}

    handle = async ({ query, user }: Context<FindNotificationsPayload>) => {
        if (!user) throw new UnAuthorizedError(AppMessages.FAILURE.INVALID_CREDENTIALS)

        if (query?.notification_id) return this.markSingleAsRead(query?.notification_id, user.id)

        await this.dbNotifications.update(
            { read: true },
            {
                where: { notifier: user.id },
            },
        )

        logger.info(`Notifications for ${user.id} Marked as Read`)

        return {
            code: HttpStatus.OK,
            message: "Notifications marked as read for User successfully",
        }
    }

    private markSingleAsRead = async (notification_id: string, user_id: string) => {
        const singleNotification = await this.dbNotifications.findOne({
            where: { id: notification_id, notifier: user_id },
        })

        if (!singleNotification) throw new BadRequestError("Invalid Notification!")

        singleNotification.read = true

        await singleNotification.save()

        logger.info(`Notification ${singleNotification.message} marked as read for ${user_id}`)

        return {
            code: HttpStatus.OK,
            data: singleNotification,
            message: "Notification marked as read for user successfully",
        }
    }
}
export const updatenotifications = new UpdateNotifications(Notifications)
