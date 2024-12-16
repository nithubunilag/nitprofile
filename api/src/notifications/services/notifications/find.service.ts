import { BadRequestError, HttpStatus, UnAuthorizedError, logger, type Context } from "@/core"
import { AppMessages } from "@/core/common"
import { Notifications } from "@/notifications/models"
import type { FindNotificationsPayload } from "@/notifications/payload_interfaces"

class FindNotifications {
    constructor(private readonly dbNotifications: typeof Notifications) {}

    handle = async ({ query, user }: Context<FindNotificationsPayload>) => {
        if (!user) throw new UnAuthorizedError(AppMessages.FAILURE.INVALID_CREDENTIALS)

        if (query?.notification_id) return this.singleNotification(query?.notification_id, user.id)

        const allUserNotifications = await this.dbNotifications.findAll({
            where: { notifier: user.id },
        })

        logger.info(`Notifications for ${user.id} Found`)

        return {
            code: HttpStatus.OK,
            data: allUserNotifications,
            message: "Notifications Found for User successfully",
        }
    }

    private singleNotification = async (notification_id: string, user_id: string) => {
        // Get more Indepth Details

        const singleNotification = await this.dbNotifications.findOne({
            where: { id: notification_id, notifier: user_id },
        })

        if (!singleNotification) throw new BadRequestError("Invalid Notification!")

        logger.info(`Notification for ${user_id} Found`)

        return {
            code: HttpStatus.OK,
            data: singleNotification,
            message: "Notification Found for user successfully",
        }
    }
}

export const findNotifications = new FindNotifications(Notifications)
