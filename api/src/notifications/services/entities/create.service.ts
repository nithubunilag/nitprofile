import { AppMessages } from "@/core/common"
import { BadRequestError, HttpStatus, UnAuthorizedError, logger, type Context } from "@/core"
import { NotificationEntity } from "@/notifications/models"
import type { CreateNotificationEntityPayload } from "@/notifications/payload_interfaces"
import { convertToUpperCaseWithUnderscore } from "@/notifications/utils"

class CreateNotificationEntity {
    constructor(private readonly dbNotificationEntity: typeof NotificationEntity) {}

    handle = async ({ input, user }: Context<CreateNotificationEntityPayload>) => {
        if (!user) throw new UnAuthorizedError(AppMessages.FAILURE.INVALID_CREDENTIALS)

        const name = convertToUpperCaseWithUnderscore(input?.name)

        const notificationEntityExists = await this.dbNotificationEntity.findOne({
            where: { name },
        })

        if (notificationEntityExists) throw new BadRequestError("Notification Entity Exists")

        const newNotificationEntity = await this.dbNotificationEntity.create({
            name,
            description: input?.description,
        })

        logger.info(`Notification Entity: ${JSON.stringify(newNotificationEntity)} created by ${user.id}`)

        return {
            code: HttpStatus.CREATED,
            data: newNotificationEntity,
            message: "Notification Entity Created successfully",
        }
    }
}

export const createNotificationEntity = new CreateNotificationEntity(NotificationEntity)
