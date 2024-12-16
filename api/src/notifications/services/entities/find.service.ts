import { HttpStatus, logger } from "@/core"
import { NotificationEntity } from "@/notifications/models"

class FindNotificationEntity {
    constructor(private readonly dbNotificationEntity: typeof NotificationEntity) {}

    handle = async () => {
        const allNotificationEntities = await this.dbNotificationEntity.findAll()

        logger.info(`Notification Entities Found`)

        return {
            code: HttpStatus.OK,
            data: allNotificationEntities,
            message: "Notification Entity Found successfully",
        }
    }
}

export const findAllNotificationEntities = new FindNotificationEntity(NotificationEntity)
