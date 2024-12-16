import { sendEmail } from "@/mails"
import { config, logger } from "@/core"
import { sendNewUserMail } from "@/programs/listeners"
import { createNotification } from "@/notifications/listeners"

/**
 * Event Listener Registry.
 */
export const register = {
    "app:up": () => {
        logger.info(`Server started successfully on port ${config.port}`)
        config.appEnvironment !== "development" && console.log(`Server started successfully on port ${config.port}`)
        const memoryUsage = process.memoryUsage()
        // logger.info(`Heap Used: ${memoryUsage.heapUsed / 1024 / 1024} MB`)
    },
    "cache:connection:established": () => logger.info(`Cache connection established`),
    "event:registeration:succesful": () => logger.info("Events listeners registered"),
    "event:sendMail": sendEmail,
    "event:newNotification": createNotification.handle,
    "event:sendNewUserMail": sendNewUserMail.handle,
}
