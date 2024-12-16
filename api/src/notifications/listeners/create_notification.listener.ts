import { BadRequestError, HttpStatus, logger, sequelize } from "@/core"
import { NotificationEntity, Notifications } from "@/notifications/models"
import { type ICreateNotificationDTO } from "../dto"
import { Users } from "@/auth/model/user.model"
import { WEBSOCKET_CONSTANT, Websocket } from "@/web-socket"

class CreateNotification {
    constructor(
        private readonly dbNotificationEntity: typeof NotificationEntity,
        private readonly dbNotifications: typeof Notifications,
        private readonly dbUsers: typeof Users,
    ) {}

    handle = async (input: ICreateNotificationDTO) => {
        if (!input) throw new BadRequestError("No Input!")

        const { actor, entity_type, item_id, message, notifier } = input

        const currentNotificationEntityType = await this.dbNotificationEntity.findOne({
            where: { name: entity_type },
        })

        if (!currentNotificationEntityType) throw new BadRequestError("Invalid Notification Entity Type!")

        const entity_type_id = currentNotificationEntityType.id

        if (actor !== "SYSTEM") {
            const actorExists = await this.dbUsers.findOne({ where: { id: actor.id } })

            if (!actorExists) throw new BadRequestError("Invalid Actor")
        }

        const transaction = await sequelize.transaction()

        const newNotifications: Notifications[] = []

        try {
            await Promise.all(
                notifier.map(async (notifier_id) => {
                    const notifierExists = await this.dbUsers.findOne({ where: { id: notifier_id } })

                    if (!notifierExists) throw new BadRequestError("Invalid Notifier")

                    const notification = await this.dbNotifications.create({
                        actor: actor === "SYSTEM" ? undefined : actor.id,
                        entity_type_id,
                        item_id,
                        notifier: notifier_id,
                        message,
                    })

                    newNotifications.push(notification)

                    const io = Websocket.getInstance()

                    const event_id = `${WEBSOCKET_CONSTANT.NOTIFICATION.EVENTS.NEW_NOTIFICATION}:${notifier_id}`

                    console.log("event:", event_id)

                    io.of(WEBSOCKET_CONSTANT.NOTIFICATION.NAMESPACE).emit(event_id, {
                        notification,
                    })
                }),
            )

            transaction.commit()

            logger.info(`Notification Created Successfully: ${JSON.stringify(newNotifications)}`)

            return {
                code: HttpStatus.CREATED,
                data: newNotifications,
                message: "Notification Created successfully",
            }
        } catch (error: any) {
            transaction.rollback()

            logger.error(error?.message)

            throw new Error("Internal Server Error")
        }
    }

    private validate_item_based_on_entity = (item_id: string, entity_type: NotificationEntity) => {}
}

export const createNotification = new CreateNotification(NotificationEntity, Notifications, Users)
