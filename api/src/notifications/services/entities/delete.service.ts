import type { DeleteNotificationEntityPayload } from "@/notifications/payload_interfaces"
import { BadRequestError, HttpStatus, UnAuthorizedError, logger, type Context } from "@/core"
import { NotificationEntity } from "@/notifications/models"
import { AppMessages } from "@/core/common"

class DeleteNotificationEntity {
    constructor(private readonly dbNotificationEntity: typeof NotificationEntity) {}

    handle = async ({ query, user }: Context<DeleteNotificationEntityPayload>) => {
        if (!user) throw new UnAuthorizedError(AppMessages.FAILURE.INVALID_TOKEN_PROVIDED)

        const currentNotificationEntity = await this.dbNotificationEntity.findOne({
            where: { id: query.entity_id },
        })

        if (!currentNotificationEntity) throw new BadRequestError("Invalid Notification Entity")

        await this.dbNotificationEntity.destroy({ where: { id: query.entity_id } })

        logger.info(`Notification Entity: ${query?.entity_id} deleted by ${user.id}`)

        return {
            code: HttpStatus.NO_CONTENT,
            message: "Notification Entity Deleted successfully",
        }
    }
}

export const deleteNotificationEntity = new DeleteNotificationEntity(NotificationEntity)
