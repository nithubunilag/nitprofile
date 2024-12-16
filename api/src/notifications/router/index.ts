import { Router } from "express"

import { ControlBuilder } from "@/core/middlewares/controlBuilder"
import {
  createNotificationEntity,
  findNotifications,
  updatenotifications,
  deleteNotificationEntity,
  findAllNotificationEntities,
} from "@/notifications/services"

import { createNotificationEntitySchema, notificationEntityQuerySchema, notificationQuerySchema } from "./schema"

export const notificationRouter = Router()

notificationRouter.get("/health", (req, res) => {
  res.status(200).json({
    message: "Notification Service is up and running!",
    status: 200,
  })
})

notificationRouter
  .route("/")
  .get(
    ControlBuilder.builder()
      .setHandler(findNotifications.handle)
      .setValidator(notificationQuerySchema)
      .isPrivate()
      .handle(),
  )
  .patch(
    ControlBuilder.builder()
      .setHandler(updatenotifications.handle)
      .setValidator(notificationQuerySchema)
      .isPrivate()
      .handle(),
  )

notificationRouter
  .route("/entities")
  .post(
    ControlBuilder.builder()
      .setHandler(createNotificationEntity.handle)
      .setValidator(createNotificationEntitySchema)
      .only("DEVELOPER")
      .isPrivate()
      .handle(),
  )
  .get(ControlBuilder.builder().setHandler(findAllNotificationEntities.handle).isPrivate().only("DEVELOPER").handle())
  .delete(
    ControlBuilder.builder()
      .setHandler(deleteNotificationEntity.handle)
      .setValidator(notificationEntityQuerySchema)
      .isPrivate()
      .only("DEVELOPER")
      .handle(),
  )
